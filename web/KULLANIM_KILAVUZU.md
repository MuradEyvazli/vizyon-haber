# 📱 VİZYON NEXUS - Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

Server başladığında: **http://localhost:5173**

---

## 🎨 Yapılan İyileştirmeler

### ✅ Tailwind CSS v4 Entegrasyonu
- Modern `@import "tailwindcss"` syntax kullanıldı
- Custom theme ve utility class'lar eklendi
- Mobile-first responsive design uygulandı

### ✅ Mobil Öncelikli Tasarım
- **Touch-friendly UI**: Minimum 48px dokunma alanları
- **Bottom Navigation**: Mobil cihazlar için ergonomik alt navigasyon
- **Sticky Header**: Gradient arka planlı yapışkan üst bar
- **Responsive Grid**: 1/2/3 kolon asimetrik haber grid sistemi

### ✅ Güvenlik Özellikleri
- **Content Security Policy (CSP)**: XSS koruması
- **Rate Limiting**: API isteklerinde hız sınırlama (5 istek/saniye)
- **CSRF Token Support**: Cross-site request forgery koruması
- **DOMPurify**: HTML sanitization ile güvenli içerik gösterimi
- **Secure Headers**: X-Frame-Options, X-Content-Type-Options

### ✅ Demo Veri Sistemi
- 20 adet gerçekçi haber verisi
- API olmadan da çalışabilen fallback sistemi
- Unsplash görselleri ile zengin içerik

### ✅ PWA Desteği
- `manifest.webmanifest` dosyası
- Mobil cihazlara kurulum özelliği
- Offline çalışma hazırlığı

### ✅ SEO Optimizasyonu
- Open Graph meta tags
- Twitter Card desteği
- Schema.org NewsArticle JSON-LD
- Semantic HTML yapısı

---

## 📂 Proje Yapısı

```
web/
├── public/
│   ├── manifest.webmanifest     # PWA manifest
│   └── vite.svg
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── TopBar.jsx       # Üst navigasyon (gradient header)
│   │   │   ├── BottomNav.jsx    # Alt navigasyon (mobil)
│   │   │   ├── NewsCard.jsx     # Haber kartı (hover efektler)
│   │   │   └── AsymmetricNewsGrid.jsx  # Grid layout
│   │   ├── routes/
│   │   │   └── Home.jsx         # Ana sayfa
│   │   └── utils/
│   │       └── seo.js           # SEO helper fonksiyonlar
│   ├── data/
│   │   └── mockNews.js          # Demo haber verileri
│   ├── services/
│   │   └── api.js               # Axios + Rate Limiting + Security
│   ├── index.css                # Tailwind imports + Custom styles
│   └── main.jsx                 # React entry point
├── index.html                    # HTML entry + Security headers
├── tailwind.config.js            # Tailwind konfigürasyonu
├── postcss.config.js             # PostCSS ayarları
├── vite.config.js                # Vite build config
└── package.json
```

---

## 🎯 Özellikler

### 1. Responsive Design
- **Mobile**: Tek kolon, büyük dokunma alanları
- **Tablet (md)**: 2 kolon grid
- **Desktop (lg)**: 3 kolon grid, hero kart 2 kolon

### 2. Animasyonlar
- Hover efektleri (scale, shadow, color transitions)
- Card hover'da görsel zoom
- Bottom nav aktif tab göstergesi
- Smooth scroll

### 3. Kategori Renkleri
- Politika: Kırmızı
- Dünya: Mavi
- Ekonomi: Yeşil
- Teknoloji: Mor
- Bilim: İndigo
- Sağlık: Pembe
- Çevre: Zümrüt yeşili
- Eğitim: Amber
- Kültür: Turuncu

---

## 🔧 Özelleştirme

### Tema Renkleri Değiştirme

`tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      'nexus-blue': '#4f46e5',  // Değiştir
      'nexus-dark': '#0f172a',  // Değiştir
    },
  },
}
```

### API URL Ayarlama

`.env` dosyası oluştur:
```env
VITE_API_URL=https://api.vizyon-nexus.com
```

### Mock Veri Düzenleme

`src/data/mockNews.js` dosyasını düzenle.

---

## 🚀 Production Deployment

### 1. Environment Variables
```bash
# .env.production
VITE_API_URL=https://api.vizyonnexus.com
```

### 2. Build
```bash
npm run build
```

### 3. Deploy
`dist/` klasörünü hosting platformuna yükle:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist/`
- **Cloudflare Pages**: Connect GitHub repo

### 4. Server-Side Security Headers
Hosting platformunda CSP header'ları ekle:

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' https: data:;"
        }
      ]
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Tailwind CSS çalışmıyor
```bash
# node_modules temizle
rm -rf node_modules package-lock.json
npm install
```

### Port zaten kullanımda
```bash
# Farklı port kullan
npm run dev -- --port 3000
```

### Hot reload çalışmıyor
```bash
# Cache temizle
rm -rf node_modules/.vite
npm run dev
```

---

## 📊 Performance Tips

1. **Image Optimization**: Unsplash URL'lerinde `?w=800&q=80` parametreleri kullan
2. **Code Splitting**: Dynamic imports kullan
3. **Lazy Loading**: `loading="lazy"` attribute (zaten mevcut)
4. **CDN**: Statik dosyaları Cloudflare CDN'e yükle
5. **Compression**: Gzip/Brotli sıkıştırma aktif et (hosting tarafında)

---

## 🔐 Güvenlik Kontrol Listesi

- ✅ CSP Headers
- ✅ XSS Protection (DOMPurify)
- ✅ Rate Limiting
- ✅ CSRF Token Support
- ✅ Secure Headers (X-Frame-Options, etc.)
- ✅ HTTPS-only (production'da)
- ⚠️ Input Validation (Backend'de yapılmalı)
- ⚠️ SQL Injection Protection (Backend'de yapılmalı)
- ⚠️ DDoS Protection (Cloudflare kullan)

---

## 📝 Lisans

Bu proje VİZYON NEXUS tarafından geliştirilmiştir.

---

## 🤝 Destek

Sorularınız için:
- Email: support@vizyon-nexus.com
- GitHub Issues
- Twitter: @vizyonnexus

**Başarılar! 🚀**
