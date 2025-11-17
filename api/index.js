import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

// Environment variables
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

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