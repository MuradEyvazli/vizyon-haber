import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';


const app = express();
app.use(helmet());
app.use(express.json({ limit: '200kb' }));
app.use(cookieParser());
app.use(cors({ origin: ['https://vizyon-nexus.com', 'http://localhost:5173'], credentials: true }));


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


app.listen(4000, () => console.log('API running on :4000'));