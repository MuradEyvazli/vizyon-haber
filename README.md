# 🌐 VİZYON NEXUS

> **Yeni Nesil Mobil-Öncelikli Haber Platformu**

VİZYON NEXUS, geleneksel haber sitelerinin tekdüzeliğini yıkan, estetik, yüksek güvenlikli ve mobil öncelikli tasarıma sahip modern bir dijital platformdur.

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
- [Roadmap](#️-roadmap)

---

## ✨ Öne Çıkan Özellikler

### 📱 Mobil-First Tasarım
- %70+ mobil trafik için optimize edilmiş UX/UI
- Touch-friendly minimum 48px dokunma alanları
- Tek elle kullanıma uygun ergonomik navigasyon
- Progressive Web App (PWA) desteği

### 🎨 Modern Estetik
- Gradient header ve card hover efektleri
- Asimetrik grid düzeni (hero card + standard cards)
- Renkli kategori badge sistemi
- Smooth animations ve transitions (Framer Motion)

### 🔒 Güvenlik Öncelikleri
- **XSS Protection**: DOMPurify ile HTML sanitization
- **CSP Headers**: Content Security Policy
- **Rate Limiting**: API isteklerinde hız sınırlama
- **CSRF Token**: Cross-site request forgery koruması
- **Helmet.js**: HTTP header güvenlik katmanı

### ⚡ Performans
- Vite ile lightning-fast HMR
- Lazy loading görseller
- Optimized bundle size
- CDN-ready architecture

---

## 🏗️ Teknoloji Stack

### Frontend (`/web`)
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **React** | 19.2.0 | UI Framework |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Vite** | 7.2.2 | Build tool & dev server |
| **Axios** | 1.13.2 | HTTP client |
| **DOMPurify** | 3.3.0 | XSS protection |
| **Framer Motion** | 12.23.24 | Animasyonlar |
| **Zod** | 4.1.12 | Schema validation |
| **Swiper** | 12.0.3 | Touch slider |

### Backend (`/api`)
| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **Express.js** | 4.21.1 | REST API Framework |
| **Helmet** | 7.1.0 | Security headers |
| **CORS** | 2.8.5 | Cross-origin requests |
| **Express Rate Limit** | 7.4.0 | Rate limiting |
| **JWT** | 9.0.2 | Authentication |
| **Morgan** | 1.10.0 | Request logging |

---

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullanici-adi/vizyon-nexus.git
cd vizyon-nexus
```

### 2. Backend Kurulumu
```bash
cd api
npm install
npm run dev
```
Backend: **http://localhost:3001**

### 3. Frontend Kurulumu
```bash
cd web
npm install

# .env.local dosyası oluşturun
echo "VITE_API_BASE_URL=http://localhost:3001" > .env.local

npm run dev
```
Frontend: **http://localhost:5173**

### 4. Tarayıcıda Açın
```
http://localhost:5173
```

---

## 📂 Proje Yapısı

```
vizyon-nexus/
├── api/                          # Backend (Express.js)
│   ├── index.js                  # API entry point
│   ├── package.json
│   └── node_modules/
│
├── web/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/       # UI Bileşenleri
│   │   │   │   ├── TopBar.jsx    # Gradient header
│   │   │   │   ├── BottomNav.jsx # Mobil navigasyon
│   │   │   │   ├── NewsCard.jsx  # Haber kartları
│   │   │   │   └── AsymmetricNewsGrid.jsx
│   │   │   ├── routes/           # Sayfa komponentleri
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── CategoryPage.jsx
│   │   │   │   └── ArticlePage.jsx
│   │   │   └── utils/            # SEO, helpers
│   │   ├── data/                 # Mock data
│   │   ├── services/             # API, auth
│   │   │   └── api.js
│   │   ├── main.jsx              # React entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static assets
│   │   ├── manifest.webmanifest
│   │   └── icon-192.png
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🌐 Deployment

### Frontend Deployment (Netlify)

#### Otomatik Deployment (Önerilen)

1. **GitHub'a Push Edin**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Netlify'da Yeni Site Oluşturun**
   - [Netlify](https://app.netlify.com) → "Add new site" → "Import from Git"
   - GitHub repository'nizi seçin

3. **Build Ayarları**
```
Base directory: web
Build command: npm run build
Publish directory: web/dist
```

4. **Environment Variables**
```
VITE_API_BASE_URL=https://your-api-url.com
```

5. **Deploy!** Netlify otomatik olarak build edip deploy edecektir.

#### Manuel Deployment

```bash
cd web
npm run build
npx netlify deploy --prod --dir=dist
```

### Backend Deployment (Render / Railway / Heroku)

#### Render.com (Ücretsiz)

1. [Render.com](https://render.com) → "New Web Service"
2. GitHub repository'nizi bağlayın
3. Ayarlar:
```
Root Directory: api
Build Command: npm install
Start Command: npm start
```
4. Environment Variables ekleyin:
```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key
```

#### Railway.app

```bash
cd api
railway login
railway init
railway up
```

---

## 🔐 Güvenlik Önlemleri

### Uygulanmış Güvenlik Katmanları

#### Frontend
- ✅ Content Security Policy (CSP)
- ✅ XSS Protection (DOMPurify)
- ✅ CSRF Token Support
- ✅ Secure Headers
- ✅ Input Validation (Zod)

#### Backend
- ✅ Helmet.js (HTTP headers)
- ✅ CORS Configuration
- ✅ Rate Limiting (5 req/sec)
- ✅ Cookie Parser (secure cookies)
- ✅ JWT Authentication
- ✅ Request Logging (Morgan)

### Önerilen Ek Güvenlik Adımları

```bash
# Production'da environment variables kullanın
# .env dosyasını ASLA git'e eklemeyin
# SSL sertifikası kullanın (Netlify otomatik sağlar)
# API Key'leri güvenli şekilde saklayın
```

---

## 📊 Performance Metrikleri

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint | < 1.8s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Time to Interactive | < 3.5s | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |
| Mobile Lighthouse Score | > 90 | 🎯 |

---

## 🗺️ Roadmap

### Phase 1: Core Platform ✅
- [x] Mobil-first UI/UX
- [x] Haber grid sistemi
- [x] Güvenlik altyapısı
- [x] Demo veri entegrasyonu
- [x] REST API temel yapısı

### Phase 2: Backend Enhancement (Sırada)
- [ ] Database entegrasyonu (PostgreSQL/MongoDB)
- [ ] Admin panel
- [ ] CMS integration
- [ ] Image upload & optimization

### Phase 3: Advanced Features
- [ ] User authentication & profiles
- [ ] Comment system
- [ ] Push notifications
- [ ] Real-time updates (WebSocket)
- [ ] Advanced search & filtering
- [ ] Dark mode
- [ ] Bookmark/save articles

### Phase 4: Expansion
- [ ] 10 tematik site türetimi
- [ ] Multi-language support (i18n)
- [ ] Analytics dashboard
- [ ] Mobile apps (React Native)
- [ ] Email newsletters
- [ ] RSS feeds

---

## 🧪 Testing

```bash
# Frontend tests
cd web
npm run test

# Backend tests (yapılacak)
cd api
npm run test
```

---

## 📝 Scripts

### Frontend (`/web`)
```bash
npm run dev       # Development server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

### Backend (`/api`)
```bash
npm run dev       # Development server with nodemon
npm start         # Production server
```

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

### Commit Mesaj Formatı
```
feat: Yeni özellik
fix: Bug düzeltmesi
docs: Dokümantasyon
style: Kod formatı
refactor: Kod iyileştirmesi
test: Test ekleme
chore: Build/config değişiklikleri
```

---

## 📧 İletişim & Destek

- **GitHub Issues**: [Sorun bildirin](https://github.com/kullanici-adi/vizyon-nexus/issues)
- **Email**: info@vizyon-nexus.com
- **Website**: https://vizyon-nexus.netlify.app

---

## 📄 Lisans

© 2025 VİZYON NEXUS. Tüm hakları saklıdır.

---

## 🙏 Teşekkürler

- [React Team](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Unsplash](https://unsplash.com/) (Demo görseller)

---

**Geliştirici Notu**: Bu platform, sektördeki mobil ve güvenlik standartlarını yeniden belirleyen, estetik ve fonksiyonelliği birleştiren bir dijital yatırım projesidir.

🚀 **Happy Coding!**
