# 📦 VİZYON NEXUS - Deployment Rehberi

Bu rehber, VİZYON NEXUS projesini GitHub'a push etme ve Netlify'da yayınlama adımlarını detaylı olarak açıklar.

---

## 📋 İçindekiler

1. [Ön Hazırlık](#1-ön-hazırlık)
2. [GitHub'a Push Etme](#2-githuba-push-etme)
3. [Netlify'da Deployment](#3-netlifyde-deployment)
4. [Backend Deployment (İsteğe Bağlı)](#4-backend-deployment-isteğe-bağlı)
5. [Domain Bağlama](#5-domain-bağlama)
6. [Sorun Giderme](#6-sorun-giderme)

---

## 1. Ön Hazırlık

### ✅ Kontrol Listesi

- [ ] Node.js 18+ kurulu
- [ ] Git kurulu
- [ ] GitHub hesabı
- [ ] Netlify hesabı (ücretsiz)
- [ ] Proje local'de çalışıyor

### 🔍 Local'de Test Edin

```bash
# Backend'i test edin
cd api
npm install
npm run dev
# http://localhost:3001 çalışmalı

# Frontend'i test edin
cd ../web
npm install
npm run dev
# http://localhost:5173 çalışmalı

# Production build test
npm run build
npm run preview
```

Herşey çalışıyorsa devam edebilirsiniz!

---

## 2. GitHub'a Push Etme

### Adım 2.1: Git Repository Oluşturma (Eğer yoksa)

```bash
# Proje dizininde
cd /Users/murad/Desktop/vizyon-nexus

# Git başlat (eğer başlatmadıysanız)
git init

# Dosyaları stage'e ekleyin
git add .

# İlk commit
git commit -m "feat: Initial commit - VİZYON NEXUS v1.0"
```

### Adım 2.2: GitHub'da Repository Oluşturma

1. **GitHub'da Yeni Repo Oluşturun**
   - https://github.com/new adresine gidin
   - Repository name: `vizyon-nexus`
   - Description: `Yeni nesil mobil-öncelikli haber platformu`
   - Public veya Private seçin
   - **Initialize this repository with: NONE** (boş bırakın)
   - Create repository

2. **Local Repo'yu GitHub'a Bağlayın**

```bash
# GitHub'dan aldığınız URL ile (örnek):
git remote add origin https://github.com/KULLANICI_ADI/vizyon-nexus.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# Push edin
git push -u origin main
```

### Adım 2.3: Push'u Doğrulayın

GitHub'da repository sayfanızı yenileyin. Tüm dosyaları görmelisiniz:
- ✅ `api/` klasörü
- ✅ `web/` klasörü
- ✅ `README.md`
- ✅ `.gitignore`
- ✅ `netlify.toml`

---

## 3. Netlify'da Deployment

### Adım 3.1: Netlify'a Giriş Yapın

1. https://app.netlify.com adresine gidin
2. GitHub ile giriş yapın (Sign up with GitHub)
3. Netlify'a GitHub erişimi verin

### Adım 3.2: Yeni Site Oluşturun

1. **"Add new site"** butonuna tıklayın
2. **"Import an existing project"** seçin
3. **"Deploy with GitHub"** seçin
4. Repository'nizi bulun: `vizyon-nexus`
5. **"Deploy vizyon-nexus"** tıklayın

### Adım 3.3: Build Ayarları

Netlify otomatik olarak `netlify.toml` dosyasını okuyacak, ama kontrol edin:

```
Site Settings:
├── Base directory: web
├── Build command: npm run build
└── Publish directory: web/dist
```

**ÖNEMLI**: Eğer otomatik algılanmadıysa manuel olarak girin!

### Adım 3.4: Environment Variables Ekleyin

1. **Site Settings → Environment Variables** gidin
2. **"Add a variable"** tıklayın
3. Şu değişkeni ekleyin:

```
Key: VITE_API_BASE_URL
Value: http://localhost:3001
```

**Not**: Şimdilik localhost kullanıyoruz. Backend'i deploy edince bu URL'i güncelleyeceğiz.

### Adım 3.5: Deploy!

1. **"Deploy site"** butonuna tıklayın
2. Build loglarını izleyin (3-5 dakika sürebilir)
3. Deploy başarılı olunca:
   - ✅ Site live olacak
   - ✅ Otomatik bir URL alacaksınız: `https://random-name-12345.netlify.app`

### Adım 3.6: Site Adını Değiştirin

1. **Site Settings → General → Site details**
2. **"Change site name"** tıklayın
3. Örnek: `vizyon-nexus-app`
4. Yeni URL: `https://vizyon-nexus-app.netlify.app`

---

## 4. Backend Deployment (İsteğe Bağlı)

Frontend şu anda Netlify'da çalışıyor, ama backend hala local'de. Backend'i deploy etmek için:

### Seçenek A: Render.com (Ücretsiz, Önerilen)

1. **Render.com'a Gidin**
   - https://render.com
   - Sign up with GitHub

2. **New Web Service Oluşturun**
   - Dashboard → "New" → "Web Service"
   - GitHub repository'nizi bağlayın: `vizyon-nexus`

3. **Ayarları Yapın**
```
Name: vizyon-nexus-api
Region: Frankfurt (veya yakınınızdaki)
Branch: main
Root Directory: api
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

4. **Environment Variables**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-key-change-this
CORS_ORIGIN=https://vizyon-nexus-app.netlify.app
```

5. **Create Web Service**
   - Deploy tamamlanınca URL alacaksınız: `https://vizyon-nexus-api.onrender.com`

6. **Netlify'daki Environment Variable'ı Güncelleyin**
   - Netlify Dashboard → Site Settings → Environment Variables
   - `VITE_API_BASE_URL` değerini güncelleyin:
   ```
   VITE_API_BASE_URL=https://vizyon-nexus-api.onrender.com
   ```
   - **Triggeer Deploy** yapın (Site redeploy edilecek)

### Seçenek B: Railway.app

```bash
cd api
npm install -g railway
railway login
railway init
railway up
```

### Seçenek C: Heroku

```bash
cd api
heroku login
heroku create vizyon-nexus-api
git subtree push --prefix api heroku main
```

---

## 5. Domain Bağlama (İsteğe Bağlı)

### Netlify'a Custom Domain Ekleme

1. **Domain satın alın** (GoDaddy, Namecheap, vb.)
2. **Netlify Dashboard → Domain Settings**
3. **"Add custom domain"** tıklayın
4. Domain'inizi girin: `www.vizyon-nexus.com`
5. DNS ayarlarını yapın:

**Namecheap DNS Ayarları:**
```
Type: CNAME
Host: www
Value: vizyon-nexus-app.netlify.app
TTL: Automatic
```

**A Record (Root domain için):**
```
Type: A
Host: @
Value: 75.2.60.5 (Netlify IP)
TTL: Automatic
```

6. **SSL Sertifikası** (Netlify otomatik sağlar)
   - 24 saat içinde HTTPS aktif olacak

---

## 6. Sorun Giderme

### ❌ Build Başarısız Oluyor

**Hata**: `Error: Cannot find module`

**Çözüm**:
```bash
# Local'de test edin
cd web
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❌ Sayfalar 404 Veriyor

**Çözüm**: `netlify.toml` dosyasında redirect ayarlarını kontrol edin:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### ❌ API İstekleri Başarısız

**Çözüm**:
1. `VITE_API_BASE_URL` environment variable doğru mu?
2. Backend deploy edildi mi?
3. CORS ayarları doğru mu?

```javascript
// api/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}));
```

### ❌ Environment Variables Yüklenmiyor

**Çözüm**:
1. Netlify'da environment variable eklediniz mi?
2. Variable adı `VITE_` ile başlıyor mu? (Vite için gerekli)
3. Site'ı redeploy ettiniz mi?

---

## 🎉 Tebrikler!

Artık VİZYON NEXUS canlıda!

- ✅ Frontend: `https://vizyon-nexus-app.netlify.app`
- ✅ Backend: `https://vizyon-nexus-api.onrender.com`
- ✅ Otomatik deployment (GitHub'a push → Otomatik deploy)

### 🔄 Bundan Sonra

Her kod değişikliğinde:
```bash
git add .
git commit -m "feat: Yeni özellik eklendi"
git push origin main
```

Netlify otomatik olarak yeni versiyonu deploy edecek!

---

## 📞 Destek

Sorun yaşarsanız:
- GitHub Issues açın
- Netlify Support'a yazın
- Deployment loglarını kontrol edin

**Happy Deployment! 🚀**
