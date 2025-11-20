import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

// ========================================
// ENVIRONMENT VARIABLES
// ========================================
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

// ========================================
// EXPRESS SETUP
// ========================================
const app = express();
app.use(helmet());
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

// CORS - multiple origins support
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
// NEWS API ENDPOINT - CLEAN & SIMPLE
// ========================================
app.get('/api/news', async (req, res) => {
  try {
    const { pageSize = 10, page = 1 } = req.query;
    const limit = Math.min(parseInt(pageSize), 20);
    const pageNum = parseInt(page);

    // API Key - önce header'dan, yoksa environment'tan al
    const apiKey = req.headers['x-news-api-key'] || NEWS_API_KEY;

    // API Key kontrolü
    if (!apiKey || apiKey === 'demo') {
      console.log('⚠️ NEWS_API_KEY yok, demo data kullanılıyor');
      return res.json({
        success: true,
        source: 'demo',
        articles: getDemoNews(limit),
        message: 'Demo veriler - VITE_NEWS_API_KEY veya NEWS_API_KEY ekleyin'
      });
    }

    console.log(`📡 NewsAPI çağrısı yapılıyor... (sayfa: ${pageNum}, key: ${apiKey.substring(0, 10)}...)`);

    // Türkiye haberleri - Türkçe kaynaklar
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: apiKey,
        // Türk haber sitelerinden aramak için domains kullan
        domains: 'sabah.com.tr,hurriyet.com.tr,milliyet.com.tr,sozcu.com.tr,haberturk.com,ntv.com.tr,cnnturk.com,trthaber.com',
        sortBy: 'publishedAt',
        pageSize: limit,
        page: pageNum,
      },
      timeout: 10000,
    });

    // Başarılı yanıt
    if (response.data.status === 'ok' && response.data.articles.length > 0) {
      console.log('✅ NewsAPI BAŞARILI:', response.data.articles.length, 'GERÇEK HABER');

      const articles = response.data.articles.map((article, index) => ({
        id: `news-${Date.now()}-${index}`,
        title: article.title,
        summary: article.description || 'Haber detayları için tıklayın.',
        content: article.content || article.description,
        category: 'Gündem',
        slug: slugify(article.title),
        image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Haber Kaynağı',
        url: article.url,
        author: article.author || 'Yazar',
      }));

      return res.json({
        success: true,
        source: 'newsapi',
        articles,
        message: 'Gerçek haberler - NewsAPI'
      });
    }

    // Haber bulunamadı
    throw new Error('NewsAPI\'den haber gelmedi');

  } catch (error) {
    console.error('❌ NewsAPI HATA:', error.response?.data || error.message);

    // Hata durumunda demo data
    return res.json({
      success: true,
      source: 'demo',
      articles: getDemoNews(parseInt(req.query.pageSize) || 10),
      message: 'API hatası, demo veriler: ' + (error.response?.data?.message || error.message)
    });
  }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

// Türkçe karakter desteği ile slug oluştur
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

// Demo haberler - fallback için
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
// HEALTH & ROOT ENDPOINTS
// ========================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: NODE_ENV,
    hasApiKey: !!NEWS_API_KEY && NEWS_API_KEY !== 'demo',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'VİZYON NEXUS API v2.0',
    endpoints: {
      news: '/api/news?pageSize=10',
      health: '/health'
    },
    docs: 'Backend NewsAPI proxy - CORS sorunu çözüldü'
  });
});

// ========================================
// START SERVER
// ========================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 VİZYON NEXUS API');
  console.log('================================');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS: ${CORS_ORIGIN}`);
  console.log(`🔑 API Key: ${NEWS_API_KEY ? '✅ Ayarlandı' : '❌ YOK (demo mode)'}`);
  console.log('================================');
  console.log('');
});
