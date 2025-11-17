# 🌐 VİZYON NEXUS

> **Yeni Nesil Mobil-Öncelikli Haber Platformu**

VİZYON NEXUS, geleneksel haber sitelerinin tekdüzeliğini yıkan, estetik, yüksek güvenlikli ve mobil öncelikli tasarıma sahip yeni nesil bir dijital platformdur.

![React](https://img.shields.io/badge/React-19.2.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.2-646cff?logo=vite)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## ✨ Öne Çıkan Özellikler

### 📱 Mobil-First Tasarım
- **%70+ mobil trafik** için optimize edilmiş UX/UI
- Touch-friendly minimum 48px dokunma alanları
- Tek elle kullanıma uygun ergonomik navigasyon
- Progressive Web App (PWA) desteği

### 🎨 Modern Estetik
- Gradient header ve card hover efektleri
- Asimetrik grid düzeni (hero card + standard cards)
- Renkli kategori badge sistemi
- Smooth animations ve transitions

### 🔒 Güvenlik Öncelikleri
- **XSS Protection**: DOMPurify ile HTML sanitization
- **CSP Headers**: Content Security Policy
- **Rate Limiting**: API isteklerinde hız sınırlama
- **CSRF Token**: Cross-site request forgery koruması

### ⚡ Performans
- Vite ile lightning-fast HMR
- Lazy loading görseller
- Optimized bundle size
- CDN-ready architecture

---

## 🚀 Hızlı Başlangıç

```bash
# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

Server: **http://localhost:5173**

Detaylı kullanım için: [KULLANIM_KILAVUZU.md](./KULLANIM_KILAVUZU.md)

---

## 🏗️ Teknoloji Stack

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| **React** | 19.2.0 | UI Framework |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Vite** | 7.2.2 | Build tool & dev server |
| **Axios** | 1.13.2 | HTTP client |
| **DOMPurify** | 3.3.0 | XSS protection |
| **Zod** | 4.1.12 | Schema validation |

---

## 📂 Proje Yapısı

```
web/
├── src/
│   ├── app/
│   │   ├── components/       # UI Bileşenleri
│   │   │   ├── TopBar.jsx    # Gradient header
│   │   │   ├── BottomNav.jsx # Mobil navigasyon
│   │   │   ├── NewsCard.jsx  # Haber kartları
│   │   │   └── AsymmetricNewsGrid.jsx
│   │   ├── routes/           # Sayfa komponenentleri
│   │   └── utils/            # SEO, helpers
│   ├── data/                 # Mock data
│   ├── services/             # API, auth
│   └── index.css             # Global styles
├── public/                   # Static assets
└── index.html                # Entry HTML
```

---

## 🎯 Yapılan İyileştirmeler

✅ **Tailwind CSS v4 Entegrasyonu**
- Modern `@import "tailwindcss"` syntax
- Custom theme variables
- Mobile-first utilities

✅ **Güvenlik Katmanı**
- Rate limiting (5 req/sec)
- CSP headers
- XSS protection
- CSRF token support

✅ **Demo Veri Sistemi**
- 20 gerçekçi haber verisi
- Unsplash görselleri
- API fallback mekanizması

✅ **PWA Desteği**
- manifest.webmanifest
- Service worker ready
- Install prompt

✅ **SEO Optimizasyonu**
- Open Graph tags
- Twitter Cards
- Schema.org JSON-LD
- Semantic HTML

---

## 🔐 Güvenlik Önlemleri

### Frontend
- [x] Content Security Policy (CSP)
- [x] XSS Protection (DOMPurify)
- [x] Rate Limiting
- [x] CSRF Token Support
- [x] Secure Headers

### Backend (Yapılacak)
- [ ] Input Validation (Zod)
- [ ] SQL Injection Prevention
- [ ] JWT Authentication
- [ ] Password Hashing (bcrypt)
- [ ] API Key Management

### Infrastructure
- [ ] DDoS Protection (Cloudflare)
- [ ] SSL/TLS Certificates
- [ ] Regular Security Audits
- [ ] Penetration Testing

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

### Phase 2: Backend Integration (Sırada)
- [ ] REST API development
- [ ] Database schema (PostgreSQL)
- [ ] Admin panel
- [ ] CMS integration

### Phase 3: Advanced Features
- [ ] User authentication
- [ ] Comment system
- [ ] Push notifications
- [ ] Real-time updates (WebSocket)
- [ ] Search & filtering
- [ ] Dark mode

### Phase 4: Expansion
- [ ] 10 tematik site türetimi
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Mobile apps (React Native)

---

## 🤝 Katkıda Bulunma

Bu proje şu anda özel bir projedir. Katkı yapmak için lütfen iletişime geçin.

---

## 📧 İletişim

- **Website**: https://vizyon-nexus.com
- **Email**: info@vizyon-nexus.com
- **Twitter**: @vizyonnexus

---

## 📄 Lisans

© 2025 VİZYON NEXUS. Tüm hakları saklıdır.

---

**Geliştirici Notu**: Bu platform, sektördeki mobil ve güvenlik standartlarını yeniden belirleyen, estetik ve fonksiyonelliği birleştiren bir dijital yatırım projesidir.
