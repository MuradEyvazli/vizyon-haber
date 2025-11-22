import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import NodeCache from 'node-cache';
import * as cheerio from 'cheerio';

// ========================================
// ENVIRONMENT VARIABLES
// ========================================
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Multiple API Keys - Hibrit Yaklaşım
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const CURRENTS_API_KEY = process.env.CURRENTS_API_KEY || '';
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY || '';

// ========================================
// CACHE SETUP - 1 saat TTL
// ========================================
const cache = new NodeCache({
  stdTTL: 3600,  // 1 saat cache
  checkperiod: 120,  // 2 dakikada bir expired cache'leri temizle
  useClones: false  // Performans için
});

// API kullanım tracker - Günlük limitleri takip et
const apiUsage = {
  newsapi: { count: 0, resetTime: Date.now() + 86400000 }, // 24 saat
  currents: { count: 0, resetTime: Date.now() + 86400000 },
  newsdata: { count: 0, resetTime: Date.now() + 86400000 },
};

// Günlük limitleri sıfırla
setInterval(() => {
  const now = Date.now();
  Object.keys(apiUsage).forEach(api => {
    if (now > apiUsage[api].resetTime) {
      apiUsage[api].count = 0;
      apiUsage[api].resetTime = now + 86400000;
      console.log(`🔄 ${api.toUpperCase()} günlük limiti sıfırlandı`);
    }
  });
}, 3600000); // Her saat kontrol et

// ========================================
// EXPRESS SETUP
// ========================================
const app = express();

// Render/Vercel gibi reverse proxy arkasında çalışırken gerekli
// X-Forwarded-For header'ını doğru okumak için
app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

// CORS - Sadece izin verilen siteler erişebilir
const allowedOrigins = [
  // Production
  'https://kisahaber.netlify.app',
  'https://kisahaber.com',
  'https://www.kisahaber.com',
  // Development
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Server-to-server istekleri (origin yok) - izin ver (health check vs.)
    if (!origin) {
      return callback(null, true);
    }

    // İzin verilen origin mi kontrol et
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS engellendi: ${origin}`);
      callback(new Error('CORS izni yok - Bu site API\'ye erişemez'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/news', apiLimiter);

// ========================================
// HELPER FUNCTIONS
// ========================================

// Slug oluştur (Türkçe karakter desteği)
function slugify(text) {
  if (!text) return 'haber';
  const map = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  return text
    .split('')
    .map(char => map[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// API kullanımını artır ve limit kontrolü yap
function canUseAPI(apiName, limit) {
  const now = Date.now();
  const usage = apiUsage[apiName];

  // Reset time geçtiyse sıfırla
  if (now > usage.resetTime) {
    usage.count = 0;
    usage.resetTime = now + 86400000;
  }

  if (usage.count >= limit) {
    console.log(`⚠️ ${apiName.toUpperCase()} günlük limit doldu (${usage.count}/${limit})`);
    return false;
  }

  usage.count++;
  return true;
}

// ========================================
// NEWS API PROVIDERS
// ========================================

// 1. Currents API - 600 req/day FREE
async function fetchFromCurrents(pageSize, page) {
  if (!CURRENTS_API_KEY || !canUseAPI('currents', 600)) {
    throw new Error('Currents API kullanılamıyor');
  }

  console.log(`📡 Currents API çağrısı... (${apiUsage.currents.count}/600)`);

  const response = await axios.get('https://api.currentsapi.services/v1/latest-news', {
    params: {
      apiKey: CURRENTS_API_KEY,
      country: 'TR',
      language: 'tr',
      page_size: pageSize,
      page_number: page,
    },
    timeout: 3000,
  });

  if (response.data.status === 'ok' && response.data.news) {
    return response.data.news.map((article, index) => ({
      id: `currents-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description || 'Haber detayları için tıklayın.',
      content: article.description,
      category: article.category?.[0] || 'Gündem',
      slug: slugify(article.title),
      image: article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      publishedAt: article.published,
      source: 'Currents API',
      url: article.url,
      author: article.author || 'Haber Kaynağı',
    }));
  }

  throw new Error('Currents API - Haber bulunamadı');
}

// 2. NewsData.io - 200 req/day FREE (Max 10 results per request on free plan)
async function fetchFromNewsData(pageSize, page) {
  if (!NEWSDATA_API_KEY || !canUseAPI('newsdata', 200)) {
    throw new Error('NewsData API kullanılamıyor');
  }

  console.log(`📡 NewsData API çağrısı... (${apiUsage.newsdata.count}/200)`);

  // Free plan'da max 10 result
  const actualSize = Math.min(pageSize, 10);

  const response = await axios.get('https://newsdata.io/api/1/latest', {
    params: {
      apikey: NEWSDATA_API_KEY,
      country: 'tr',
      language: 'tr',
    },
    timeout: 3000,
  });

  if (response.data.status === 'success' && response.data.results) {
    return response.data.results.slice(0, actualSize).map((article, index) => ({
      id: `newsdata-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description || 'Haber detayları için tıklayın.',
      content: article.content || article.description,
      category: article.category?.[0] || 'Gündem',
      slug: slugify(article.title),
      image: article.image_url || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      publishedAt: article.pubDate,
      source: 'NewsData.io',
      url: article.link,
      author: article.creator?.[0] || article.source_id || 'Haber Kaynağı',
    }));
  }

  throw new Error('NewsData API - Haber bulunamadı');
}

// 3. NewsAPI (Fallback) - 100 req/day FREE
async function fetchFromNewsAPI(pageSize, page) {
  if (!NEWS_API_KEY || !canUseAPI('newsapi', 100)) {
    throw new Error('NewsAPI kullanılamıyor');
  }

  console.log(`📡 NewsAPI çağrısı... (${apiUsage.newsapi.count}/100)`);

  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      apiKey: NEWS_API_KEY,
      domains: 'sabah.com.tr,hurriyet.com.tr,milliyet.com.tr,sozcu.com.tr,haberturk.com,ntv.com.tr,cnnturk.com,trthaber.com',
      sortBy: 'publishedAt',
      pageSize: pageSize,
      page: page,
    },
    timeout: 3000,
  });

  if (response.data.status === 'ok' && response.data.articles) {
    return response.data.articles.map((article, index) => ({
      id: `newsapi-${Date.now()}-${index}`,
      title: article.title,
      summary: article.description || 'Haber detayları için tıklayın.',
      content: article.content || article.description,
      category: 'Gündem',
      slug: slugify(article.title),
      image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      publishedAt: article.publishedAt,
      source: 'NewsAPI',
      url: article.url,
      author: article.author || article.source?.name || 'Haber Kaynağı',
    }));
  }

  throw new Error('NewsAPI - Haber bulunamadı');
}

// Demo haberler - Son fallback
function getDemoNews(count = 10) {
  const demos = [
    {
      id: 'demo-1',
      title: 'Türkiye Ekonomisinde Yeni Dönem Başlıyor',
      summary: 'Ekonomi yönetimi yeni reform paketini açıkladı. Enflasyonla mücadele ve büyüme hedefleri belirlendi.',
      content: 'Detaylı haber içeriği...',
      category: 'Ekonomi',
      slug: 'turkiye-ekonomi-reform',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      publishedAt: new Date().toISOString(),
      source: 'DEMO',
      url: '#',
      author: 'Demo Yazar',
    },
    {
      id: 'demo-2',
      title: 'Teknoloji Devlerinden Yapay Zeka Atılımı',
      summary: 'Yeni nesil yapay zeka modelleri tanıtıldı. Türkçe dil desteği güçlendirildi.',
      content: 'Detaylı haber içeriği...',
      category: 'Teknoloji',
      slug: 'yapay-zeka-atilim',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: 'DEMO',
      url: '#',
      author: 'Demo Yazar',
    },
    {
      id: 'demo-3',
      title: 'Süper Lig\'de Şampiyonluk Yarışı Kızışıyor',
      summary: 'Ligin ikinci yarısına girilirken şampiyonluk adayları belli olmaya başladı.',
      content: 'Detaylı haber içeriği...',
      category: 'Spor',
      slug: 'super-lig-sampiyonluk',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: 'DEMO',
      url: '#',
      author: 'Demo Yazar',
    },
  ];

  return demos.slice(0, count);
}

// ========================================
// SMART NEWS FETCHER - HİBRİT SİSTEM
// ========================================

// Shuffle fonksiyonu - haberleri karıştır (Fisher-Yates algoritması)
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function fetchNewsHybrid(pageSize, page) {
  // Cache key
  const cacheKey = `news-${pageSize}-${page}`;

  // 1. Önce cache'den kontrol et - ANINDA DÖNÜŞ
  const cachedNews = cache.get(cacheKey);
  if (cachedNews) {
    console.log('⚡ Cache\'den ANINDA döndürüldü!');
    return {
      articles: cachedNews,
      source: 'cache',
      cached: true
    };
  }

  console.log('🚀 HIZLI MOD: İlk başarılı API kazanır!');

  // 2. SÜPER HIZLI MOD: İlk başarılı sonucu hemen döndür
  const apiResults = { currents: 0, newsdata: 0, newsapi: 0 };

  // Timeout wrapper - 3 saniye max (daha kısa!)
  const withTimeout = (promise, ms, name) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${name} timeout`)), ms)
      )
    ]);
  };

  // Her API'yi ayrı ayrı sarmalayıp, ilk başarılı olanı al
  const makeApiCall = async (fetchFn, name, timeout) => {
    try {
      const data = await withTimeout(fetchFn, timeout, name);
      if (data && data.length > 0) {
        return { source: name, data };
      }
    } catch (e) {
      console.log(`⚠️ ${name}: ${e.message}`);
    }
    return null;
  };

  // İLK BAŞARILI API KAZANIR - Promise.race ile
  try {
    const firstSuccess = await Promise.race([
      // Her API'yi race'e sok - ilk dönen kazanır
      makeApiCall(fetchFromCurrents(pageSize, page), 'Currents', 3000),
      makeApiCall(fetchFromNewsData(pageSize, page), 'NewsData', 3000),
      makeApiCall(fetchFromNewsAPI(pageSize, page), 'NewsAPI', 3000),
      // 4 saniye global timeout
      new Promise(resolve => setTimeout(() => resolve(null), 4000))
    ]);

    if (firstSuccess && firstSuccess.data && firstSuccess.data.length > 0) {
      console.log(`✅ ${firstSuccess.source}'dan ${firstSuccess.data.length} haber alındı!`);

      // Cache'e kaydet (2 saat)
      const shuffled = shuffleArray(firstSuccess.data);
      cache.set(cacheKey, shuffled, 7200);

      return {
        articles: shuffled,
        source: firstSuccess.source,
        cached: false
      };
    }
  } catch (error) {
    console.error('❌ API hatası:', error.message);
  }

  // 3. Hiç haber yoksa demo data
  console.warn('⚠️ Demo data kullanılıyor');
  return {
    articles: getDemoNews(pageSize),
    source: 'demo',
    cached: false
  };
}

// ========================================
// NEWS ENDPOINT - HİBRİT SİSTEM
// ========================================
app.get('/api/news', async (req, res) => {
  try {
    const { pageSize = 10, page = 1 } = req.query;
    const limit = Math.min(parseInt(pageSize), 20);
    const pageNum = parseInt(page);

    console.log(`\n📰 Haber isteği alındı (Sayfa: ${pageNum}, Limit: ${limit})`);

    const result = await fetchNewsHybrid(limit, pageNum);

    return res.json({
      success: true,
      source: result.source,
      cached: result.cached,
      articles: result.articles,
      stats: {
        currents: `${apiUsage.currents.count}/600`,
        newsdata: `${apiUsage.newsdata.count}/200`,
        newsapi: `${apiUsage.newsapi.count}/100`,
      },
      message: result.cached
        ? 'Cache\'den döndürüldü'
        : `${result.source} kullanıldı`,
    });

  } catch (error) {
    console.error('❌ GENEL HATA:', error);

    return res.json({
      success: true,
      source: 'demo',
      articles: getDemoNews(parseInt(req.query.pageSize) || 10),
      message: 'API hatası, demo veriler: ' + error.message
    });
  }
});

// ========================================
// CACHE STATS ENDPOINT
// ========================================
app.get('/api/stats', (req, res) => {
  const stats = cache.getStats();

  res.json({
    cache: {
      keys: cache.keys().length,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hits / (stats.hits + stats.misses) || 0,
    },
    apiUsage: {
      currents: `${apiUsage.currents.count}/600 (${Math.round(apiUsage.currents.count / 600 * 100)}%)`,
      newsdata: `${apiUsage.newsdata.count}/200 (${Math.round(apiUsage.newsdata.count / 200 * 100)}%)`,
      newsapi: `${apiUsage.newsapi.count}/100 (${Math.round(apiUsage.newsapi.count / 100 * 100)}%)`,
    },
    resetIn: {
      currents: Math.round((apiUsage.currents.resetTime - Date.now()) / 3600000) + ' saat',
      newsdata: Math.round((apiUsage.newsdata.resetTime - Date.now()) / 3600000) + ' saat',
      newsapi: Math.round((apiUsage.newsapi.resetTime - Date.now()) / 3600000) + ' saat',
    }
  });
});

// ========================================
// ARTICLE SCRAPER ENDPOINT - Tam İçerik Çekme
// ========================================
app.get('/api/article', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, error: 'URL gerekli' });
    }

    // Cache kontrolü
    const cacheKey = `article-${Buffer.from(url).toString('base64').substring(0, 50)}`;
    const cachedContent = cache.get(cacheKey);
    if (cachedContent) {
      return res.json({ success: true, content: cachedContent, cached: true });
    }

    console.log(`📄 Makale çekiliyor: ${url}`);

    // Sayfayı çek
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    const $ = cheerio.load(response.data);

    // Gereksiz elementleri kaldır
    $('script, style, nav, header, footer, aside, .ad, .advertisement, .social-share, .comments, .related-news, iframe, .sidebar').remove();

    // Farklı haber sitelerinin içerik selector'ları
    const contentSelectors = [
      // Türk haber siteleri
      '.news-content',
      '.article-content',
      '.news-detail-content',
      '.detail-content',
      '.content-text',
      '.haber-detay',
      '.haber-icerik',
      '.news-body',
      '.article-body',
      '.story-body',
      '.entry-content',
      '.post-content',
      // Genel selector'lar
      '[itemprop="articleBody"]',
      '[class*="article-content"]',
      '[class*="news-content"]',
      '[class*="story-content"]',
      'article p',
      '.content p',
      'main p',
    ];

    let fullContent = '';
    let paragraphs = [];

    // Selector'ları dene
    for (const selector of contentSelectors) {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.find('p').each((_, el) => {
          const text = $(el).text().trim();
          if (text.length > 30 && !text.includes('©') && !text.includes('Tüm hakları')) {
            paragraphs.push(text);
          }
        });

        if (paragraphs.length >= 3) {
          break;
        }
      }
    }

    // Eğer hala içerik bulunamadıysa, tüm p etiketlerini dene
    if (paragraphs.length < 3) {
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50 && !text.includes('©') && !text.includes('cookie') && !text.includes('reklam')) {
          paragraphs.push(text);
        }
      });
    }

    // Tekrar eden paragrafları kaldır
    paragraphs = [...new Set(paragraphs)];

    // İlk 15 paragrafı al (çok uzun olmasın)
    fullContent = paragraphs.slice(0, 15).join('\n\n');

    if (fullContent.length < 100) {
      return res.json({
        success: false,
        error: 'İçerik çekilemedi',
        content: null
      });
    }

    // Cache'e kaydet (6 saat)
    cache.set(cacheKey, fullContent, 21600);

    console.log(`✅ Makale çekildi: ${paragraphs.length} paragraf, ${fullContent.length} karakter`);

    return res.json({
      success: true,
      content: fullContent,
      paragraphCount: paragraphs.length,
      cached: false
    });

  } catch (error) {
    console.error('❌ Makale çekme hatası:', error.message);
    return res.json({
      success: false,
      error: error.message,
      content: null
    });
  }
});

// ========================================
// HEALTH & ROOT ENDPOINTS
// ========================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    apis: {
      currents: !!CURRENTS_API_KEY,
      newsdata: !!NEWSDATA_API_KEY,
      newsapi: !!NEWS_API_KEY,
    },
    cache: {
      enabled: true,
      ttl: '1 hour',
      keys: cache.keys().length,
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Kısa Haber API v3.0 - Hibrit Sistem',
    features: [
      '✅ Çoklu API Desteği (Currents + NewsData + NewsAPI)',
      '✅ Akıllı Cache (1 saat TTL)',
      '✅ Otomatik Fallback',
      '✅ Günlük Limit Takibi',
      '✅ Load Balancing',
    ],
    endpoints: {
      news: '/api/news?pageSize=10&page=1',
      stats: '/api/stats',
      health: '/health'
    },
    docs: 'Professional Hybrid News API System'
  });
});

// ========================================
// CACHE WARM-UP - Otomatik cache yenileme sistemi
// ========================================
async function warmUpCache(isInitial = false) {
  const prefix = isInitial ? '🔥 İLK YÜKLEME' : '🔄 PERİYODİK YENİLEME';
  console.log(`${prefix}: Cache ısınıyor...`);

  try {
    // Cache'i temizle ve yeni veri çek (force refresh)
    const cacheKey = 'news-20-1';

    // Eğer cache varsa ve periyodik yenilemeyse, cache'i sil
    if (!isInitial && cache.has(cacheKey)) {
      cache.del(cacheKey);
      console.log('🗑️ Eski cache silindi');
    }

    // Yeni haberleri çek
    const result = await fetchNewsHybrid(20, 1);

    if (result.articles && result.articles.length > 0) {
      console.log(`✅ ${prefix} BAŞARILI: ${result.articles.length} haber cache'lendi (${result.source})`);
    } else {
      console.log(`⚠️ ${prefix}: Haber bulunamadı`);
    }
  } catch (error) {
    console.log(`❌ ${prefix} BAŞARISIZ:`, error.message);
  }
}

// Periyodik cache yenileme - Her 30 dakikada bir
function startPeriodicCacheRefresh() {
  const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 dakika

  setInterval(async () => {
    console.log('\n⏰ Zamanlanmış cache yenileme başlıyor...');
    await warmUpCache(false);
  }, REFRESH_INTERVAL);

  console.log(`📅 Periyodik cache yenileme aktif (her 30 dakika)`);
}

// ========================================
// START SERVER
// ========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 Kısa Haber API v3.0 - SÜPER HIZLI MOD');
  console.log('==========================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS: ${CORS_ORIGIN}`);
  console.log('');
  console.log('📡 API Durumu:');
  console.log(`   Currents API: ${CURRENTS_API_KEY ? '✅ Aktif (600 req/day)' : '❌ Yok'}`);
  console.log(`   NewsData.io:  ${NEWSDATA_API_KEY ? '✅ Aktif (200 req/day)' : '❌ Yok'}`);
  console.log(`   NewsAPI:      ${NEWS_API_KEY ? '✅ Aktif (100 req/day)' : '❌ Yok'}`);
  console.log('');
  console.log('⚡ Hız Optimizasyonları:');
  console.log('   - İlk başarılı API kazanır (Promise.race)');
  console.log('   - 3 saniye API timeout');
  console.log('   - 4 saniye global timeout');
  console.log('   - 2 saat cache TTL');
  console.log('==========================================');
  console.log('');

  // Server başladıktan sonra cache'i ısıt
  setTimeout(() => {
    warmUpCache(true);  // İlk yükleme
    startPeriodicCacheRefresh();  // Periyodik yenileme başlat
  }, 1000);
});
