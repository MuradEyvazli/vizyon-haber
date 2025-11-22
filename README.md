# 📰 KISA HABER

> **Türkiye'nin En Güncel Haber Portalı - Mobil-Öncelikli Tasarım**

Kısa Haber, geleneksel haber sitelerinin tekdüzeliğini yıkan, estetik, yüksek güvenlikli ve mobil öncelikli tasarıma sahip modern bir dijital haber platformudur.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)

---

## 📋 İçindekiler

- [Özellikler](#-öne-çıkan-özellikler)
- [Teknoloji Stack](#️-teknoloji-stack)
- [Hızlı Başlangıç](#-hızlı-başlangıç)
- [Proje Yapısı](#-proje-yapısı)
- [Deployment](#-deployment)
- [Güvenlik](#-güvenlik-önlemleri)

---

## ✨ Öne Çıkan Özellikler

### 🔍 Akıllı Arama Sistemi
- **Instant Search**: Yazdıkça gerçek zamanlı sonuçlar
- **Fuzzy Search**: Yazım hatalarına toleranslı arama
- **Türkçe Karakter Desteği**: ç, ğ, ı, ö, ş, ü normalizasyonu
- **Çoklu Alan Arama**: Başlık, özet, içerik, kategori, yazar, kaynak
- **Highlight**: Eşleşen kelimelerin vurgulanması

### 📰 Hibrit Haber Sistemi (3 API Paralel)
- **Currents API**: 600 istek/gün (ücretsiz)
- **NewsData.io**: 200 istek/gün (ücretsiz)
- **NewsAPI**: 100 istek/gün (ücretsiz)
- **Toplam**: 900+ istek/gün kapasitesi
- **Fisher-Yates Shuffle**: Haberler karışık gösterilir
- **Akıllı Cache**: 1 saat TTL ile performans optimizasyonu

### 📱 Mobil-First Tasarım
- %70+ mobil trafik için optimize edilmiş UX/UI
- Touch-friendly minimum 48px dokunma alanları
- Progressive Web App (PWA) desteği

### 🎨 Modern Estetik
- Gradient header ve card hover efektleri
- Asimetrik grid düzeni
- Renkli kategori badge sistemi
- Smooth animations (Framer Motion)
- Breaking news ticker

### 🔒 Güvenlik
- XSS Protection (DOMPurify)
- CSP Headers
- Rate Limiting (100 req/min)
- Helmet.js

### 🔎 SEO Optimizasyonu
- Profesyonel meta tags
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- JSON-LD Structured Data (NewsMediaOrganization)
- Google Rich Results desteği

---

## 🏗️ Teknoloji Stack

### Frontend (`/web`)
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **React** | 19.2.0 | UI Framework |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Vite** | 7.2.2 | Build tool & dev server |
| **Axios** | 1.13.2 | HTTP client |
| **Framer Motion** | 12.23.24 | Animasyonlar |

### Backend (`/api`)
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Express.js** | 4.21.1 | REST API Framework |
| **Node Cache** | 5.1.2 | In-memory caching |
| **Helmet** | 7.1.0 | Security headers |
| **CORS** | 2.8.5 | Cross-origin requests |

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/muradeyvazli/kisa-haber.git
cd kisa-haber
```

### 2. Backend Kurulumu
```bash
cd api
npm install

# .env dosyası oluşturun
cat > .env << EOF
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
CURRENTS_API_KEY=your_currents_api_key
NEWSDATA_API_KEY=your_newsdata_api_key
NEWS_API_KEY=your_newsapi_key
EOF

npm run dev
```
Backend: **http://localhost:3001**

### 3. Frontend Kurulumu
```bash
cd web
npm install

# .env.local dosyası oluşturun
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:3001
EOF

npm run dev
```
Frontend: **http://localhost:5173**

### 4. API Key'leri Alın (Ücretsiz)
- [Currents API](https://currentsapi.services/) - 600 req/day
- [NewsData.io](https://newsdata.io/) - 200 req/day
- [NewsAPI](https://newsapi.org/) - 100 req/day

---

## 📂 Proje Yapısı

```
kisa-haber/
├── api/                          # Backend (Express.js)
│   ├── index.js                  # Hibrit API sistemi
│   ├── package.json
│   └── .env
│
├── web/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # UI Bileşenleri
│   │   │   │   ├── TopBar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── ...
│   │   │   └── routes/           # Sayfa komponentleri
│   │   │       ├── Home.jsx
│   │   │       ├── Trends.jsx
│   │   │       └── NewsDetail.jsx
│   │   ├── components/
│   │   │   └── SEO.jsx           # SEO & Structured Data
│   │   ├── services/
│   │   │   ├── newsApi.js        # Haber API servisi
│   │   │   └── weather.js        # Hava durumu
│   │   └── main.jsx
│   ├── public/
│   │   ├── og-image.jpg          # Open Graph image
│   │   └── manifest.webmanifest
│   └── index.html                # SEO meta tags
│
└── README.md
```

---

## 🌐 Deployment

### Frontend (Netlify)
```
Base directory: web
Build command: npm run build
Publish directory: web/dist
```

Environment Variables:
```
VITE_API_BASE_URL=https://your-api-url.com
```

### Backend (Render.com)
```
Root Directory: api
Build Command: npm install
Start Command: npm start
```

Environment Variables:
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://kisahaber.com
CURRENTS_API_KEY=xxx
NEWSDATA_API_KEY=xxx
NEWS_API_KEY=xxx
```

---

## 📧 İletişim

- **GitHub**: [github.com/muradeyvazli](https://github.com/muradeyvazli)
- **Website**: https://kisahaber.com

---

## 📄 Lisans

© 2025 Kısa Haber. Tüm hakları saklıdır.

---

**Made with ❤️ by Murad Eyvazli**

🚀 **Happy Coding!**
