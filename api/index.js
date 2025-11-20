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
const NEWS_API_KEY = process.env.NEWS_API_KEY || '5056321a8bda4888aabbc60743ea46a68';

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


// NewsAPI Proxy - Gerçek haberler için
app.get('/api/news', async (req, res) => {
  try {
    const { category, query, pageSize = 20, page = 1 } = req.query;

    let apiQuery = query || 'Türkiye OR Turkey OR Turkish OR Ankara OR Istanbul';

    // Kategori varsa query'e ekle
    if (category) {
      const categoryMap = {
        'teknoloji': 'technology OR teknoloji',
        'technology': 'technology OR teknoloji',
        'spor': 'sports OR spor',
        'ekonomi': 'economy OR ekonomi OR business',
        'sağlık': 'health OR sağlık',
        'bilim': 'science OR bilim',
      };
      apiQuery = categoryMap[category.toLowerCase()] || category;
    }

    console.log('📡 NewsAPI proxy çağrısı:', apiQuery);

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        apiKey: NEWS_API_KEY,
        q: apiQuery,
        language: 'tr',
        sortBy: 'publishedAt',
        pageSize,
        page,
      },
      timeout: 10000,
    });

    if (response.data.status === 'ok') {
      console.log('✅ NewsAPI başarılı:', response.data.articles.length, 'haber');

      // Veriyi dönüştür
      const articles = response.data.articles.map((article, index) => ({
        id: `${Date.now()}-${index}`,
        title: article.title,
        summary: article.description || article.content?.substring(0, 200) || 'Detaylar için haberi okuyun.',
        content: article.content,
        category: category || 'Genel',
        slug: createSlug(article.title),
        image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop',
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Bilinmeyen Kaynak',
        url: article.url,
        author: article.author,
      }));

      return res.json({ articles, total: response.data.totalResults });
    }

    throw new Error('NewsAPI hatası');
  } catch (error) {
    console.error('❌ NewsAPI proxy error:', error.message);

    // Hata durumunda demo data dön
    const demoArticles = getDemoNews(parseInt(req.query.pageSize) || 20);
    res.json({
      articles: demoArticles,
      total: demoArticles.length,
      source: 'demo',
      message: 'API hatası, demo veriler kullanılıyor'
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