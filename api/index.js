import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import axios from 'axios';

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// GNews API (ücretsiz, günlük 100 istek, production'da çalışır)
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'f87177a3c07b5f4ad87e5413fb81a70f';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());

// CORS configuration - multiple origins support
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3001',
  CORS_ORIGIN,
  'https://vizyon-nexus.com',
  'https://www.vizyon-nexus.com'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true);
    } else {
      callback(null, true); // For now, allow all origins in development
    }
  },
  credentials: true
}));


// DDoS/Brute-force: kritik uç noktalara rate limit
const apiLimiter = rateLimit({ windowMs: 60_000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use('/news', apiLimiter);


// Basit doğrulama
const newsQuerySchema = z.object({ section: z.string().optional(), limit: z.string().regex(/^\d+$/).default('20') });


app.get('/news', (req, res) => {
const parse = newsQuerySchema.safeParse(req.query);
if (!parse.success) return res.status(400).json({ error: 'Bad query' });
const { section, limit } = parse.data;
// TODO: DB/Feed okuma + sanitize + cache (Redis önerilir)
const items = mockNews(parseInt(limit), section);
res.json({ items });
});


function mockNews(n = 20, section = 'world') {
return Array.from({ length: n }).map((_, i) => ({
id: `${section}-${i}`,
slug: `${section}-haber-${i}`,
title: `Başlık ${i} — ${section}`,
summary: `Kısa <strong>özet</strong> ${i}`,
image: `https://picsum.photos/seed/${section}-${i}/800/450.webp`,
category: section,
publishedAt: new Date().toISOString(),
}));
}


// GNews API Proxy - Gerçek haberler için
app.get('/api/news', async (req, res) => {
  try {
    const { category, query, pageSize = 20, page = 1 } = req.query;

    // GNews için query parametresi
    let searchQuery = query || 'Türkiye';

    // Kategori mapping (GNews kategorileri)
    const categoryMap = {
      'teknoloji': 'technology',
      'technology': 'technology',
      'spor': 'sports',
      'sports': 'sports',
      'ekonomi': 'business',
      'business': 'business',
      'sağlık': 'health',
      'health': 'health',
      'bilim': 'science',
      'science': 'science',
      'eğlence': 'entertainment',
      'entertainment': 'entertainment',
      'genel': 'general',
      'general': 'general',
    };

    const gnewsCategory = category ? categoryMap[category.toLowerCase()] : null;

    console.log('📡 GNews API çağrısı:', { query: searchQuery, category: gnewsCategory });

    // GNews API çağrısı
    const gnewsParams = {
      apikey: GNEWS_API_KEY,
      lang: 'tr',
      max: Math.min(parseInt(pageSize), 10), // GNews ücretsiz plan max 10
      q: searchQuery,
    };

    // Kategori varsa ekle
    if (gnewsCategory) {
      gnewsParams.category = gnewsCategory;
      delete gnewsParams.q; // Kategori ile birlikte q kullanılamaz
    }

    const response = await axios.get('https://gnews.io/api/v4/search', {
      params: gnewsParams,
      timeout: 10000,
    });

    if (response.data.articles && response.data.articles.length > 0) {
      console.log('✅ GNews API başarılı:', response.data.articles.length, 'GERÇEK HABER');

      // Veriyi frontend formatına dönüştür
      const articles = response.data.articles.map((article, index) => ({
        id: `gnews-${Date.now()}-${index}`,
        title: article.title,
        summary: article.description || article.content?.substring(0, 200) || 'Detaylar için haberi okuyun.',
        content: article.content || article.description,
        category: category || 'Genel',
        slug: createSlug(article.title),
        image: article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Bilinmeyen Kaynak',
        url: article.url,
        author: 'GNews',
      }));

      return res.json({
        articles,
        total: response.data.totalArticles || articles.length,
        source: 'gnews',
        message: 'Gerçek haberler - GNews API'
      });
    }

    // Haber bulunamadıysa fallback
    console.log('⚠️ GNews\'den haber gelmedi, demo veriler kullanılıyor');
    throw new Error('GNews API\'den veri gelmedi');

  } catch (error) {
    console.error('❌ GNews API error:', error.response?.data?.errors || error.message);

    // Hata durumunda demo data dön
    const demoArticles = getDemoNews(parseInt(req.query.pageSize) || 20);
    res.json({
      articles: demoArticles,
      total: demoArticles.length,
      source: 'demo',
      message: 'API hatası, demo veriler kullanılıyor: ' + (error.response?.data?.errors?.[0] || error.message)
    });
  }
});

// Slug oluştur helper
function createSlug(title) {
  if (!title) return 'haber';

  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };

  return title
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Demo haberler
function getDemoNews(count = 20) {
  const demoArticles = [
    {
      id: 1,
      title: "Türkiye'nin Yeni Dijital Dönüşüm Stratejisi Açıklandı",
      summary: "Cumhurbaşkanlığı Dijital Dönüşüm Ofisi tarafından hazırlanan yeni strateji belgesi, ülkenin teknoloji altyapısını güçlendirecek kapsamlı adımları içeriyor.",
      content: "Türkiye'nin dijital dönüşüm yol haritası bugün açıklandı...",
      category: 'Teknoloji',
      slug: 'turkiye-dijital-donusum-stratejisi',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      publishedAt: new Date().toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Demo',
      url: '#',
    },
    {
      id: 2,
      title: 'Merkez Bankası Faiz Kararını Açıkladı',
      summary: 'Merkez Bankası Para Politikası Kurulu toplantısında faiz oranlarını değiştirmeme kararı aldı.',
      content: 'Merkez Bankası Para Politikası Kurulu (PPK), bugün gerçekleştirdiği toplantıda politika faizini değiştirmeme kararı aldı...',
      category: 'Ekonomi',
      slug: 'merkez-bankasi-faiz-karari',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: 'VİZYON NEXUS',
      author: 'Demo',
      url: '#',
    }
  ];

  return demoArticles.slice(0, count);
}

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'VİZYON NEXUS API',
    version: '1.0.0',
    endpoints: {
      news: '/news?section=world&limit=20',
      health: '/health'
    }
  });
});

// Start server - bind to 0.0.0.0 for Render
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API running on port ${PORT}`);
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);
});