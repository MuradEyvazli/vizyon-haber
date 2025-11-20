import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import NodeCache from 'node-cache';

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
app.use(helmet());
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  CORS_ORIGIN,
  'https://vizyon-nexus.com',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
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
    timeout: 10000,
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

// 2. NewsData.io - 200 req/day FREE
async function fetchFromNewsData(pageSize, page) {
  if (!NEWSDATA_API_KEY || !canUseAPI('newsdata', 200)) {
    throw new Error('NewsData API kullanılamıyor');
  }

  console.log(`📡 NewsData API çağrısı... (${apiUsage.newsdata.count}/200)`);

  const response = await axios.get('https://newsdata.io/api/1/news', {
    params: {
      apikey: NEWSDATA_API_KEY,
      country: 'tr',
      language: 'tr',
      size: pageSize,
      // NewsData.io doesn't support page param - uses nextPage token instead
    },
    timeout: 10000,
  });

  if (response.data.status === 'success' && response.data.results) {
    return response.data.results.map((article, index) => ({
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
    timeout: 10000,
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

  // 1. Önce cache'den kontrol et
  const cachedNews = cache.get(cacheKey);
  if (cachedNews) {
    console.log('✅ Cache\'den haber döndürüldü');
    return {
      articles: cachedNews,
      source: 'cache',
      cached: true
    };
  }

  // 2. TÜM API'leri PARALEL çağır - maksimum haber için!
  console.log('🚀 3 API paralel çağrılıyor... (Maksimum haber modu)');

  const apiCalls = [
    fetchFromCurrents(pageSize, page).catch(err => {
      console.error('❌ Currents API HATA:', err.message);
      return [];
    }),
    fetchFromNewsData(pageSize, page).catch(err => {
      console.error('❌ NewsData API HATA:', err.message);
      return [];
    }),
    fetchFromNewsAPI(pageSize, page).catch(err => {
      console.error('❌ NewsAPI HATA:', err.message);
      return [];
    })
  ];

  const results = await Promise.all(apiCalls);

  // 3. Tüm sonuçları birleştir
  const allArticles = results.flat().filter(article => article);

  console.log(`📊 API Sonuçları:`);
  console.log(`   Currents: ${results[0].length} haber`);
  console.log(`   NewsData: ${results[1].length} haber`);
  console.log(`   NewsAPI: ${results[2].length} haber`);
  console.log(`   TOPLAM: ${allArticles.length} gerçek haber! 🎉`);

  // 4. Hiç haber yoksa demo data
  if (allArticles.length === 0) {
    console.warn('⚠️ Hiçbir API\'den haber alınamadı - Demo data kullanılıyor');
    return {
      articles: getDemoNews(pageSize),
      source: 'demo',
      cached: false,
      error: 'Tüm API\'ler başarısız'
    };
  }

  // 5. Haberleri karıştır - 3 API'den gelen haberler karışık gösterilsin
  const shuffled = shuffleArray(allArticles);

  // 6. Cache'e kaydet
  cache.set(cacheKey, shuffled);

  console.log(`✅ ${shuffled.length} haber karıştırılıp cache'e kaydedildi`);

  return {
    articles: shuffled,
    source: 'Hybrid (3 API Paralel)',
    cached: false,
    stats: {
      currents: results[0].length,
      newsdata: results[1].length,
      newsapi: results[2].length,
      total: allArticles.length
    }
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
    message: 'VİZYON NEXUS API v3.0 - Hibrit Sistem',
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
// START SERVER
// ========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 VİZYON NEXUS API v3.0 - HİBRİT SİSTEM');
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
  console.log('💾 Cache: 1 saat TTL');
  console.log('🔄 Otomatik Fallback: Aktif');
  console.log('==========================================');
  console.log('');
});
