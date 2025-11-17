# 🔑 API ANAHTARLARI REHBERİ

Bu dosya, uygulamanın gerçek verilerle çalışması için gerekli API'leri açıklar.

---

## ✅ ZORUNLU API

### 1. **OpenWeatherMap API** (Hava Durumu)

**Neden Gerekli:** Kullanıcının konumuna göre gerçek hava durumu verisi çekmek için

**Ücretsiz Mi:** ✅ Evet (günde 1,000 istek)

**Nasıl Alınır:**

1. **Kayıt Ol**
   - Git: https://home.openweathermap.org/users/sign_up
   - Email, kullanıcı adı, şifre ile kayıt ol

2. **API Key'i Bul**
   - Giriş yap: https://home.openweathermap.org/
   - "API keys" sekmesine tıkla
   - Varsayılan key'i kopyala (veya "Create Key" ile yeni oluştur)

3. **Projeye Ekle**
   - `.env.local` dosyasını aç
   - `VITE_OPENWEATHER_API_KEY=` satırına API key'i yapıştır

   Örnek:
   ```env
   VITE_OPENWEATHER_API_KEY=abc123def456ghi789jkl012mno345pq
   ```

4. **Dev Server'ı Yeniden Başlat**
   ```bash
   # Terminal'de Ctrl+C
   npm run dev
   ```

**Test Et:**
- Tarayıcı konum izni isteyecek → İzin ver
- Hava durumu widget'ında gerçek şehir adı ve sıcaklık görünecek

---

## 🔵 İSTEĞE BAĞLI API'LER

### 2. **NewsAPI** (Haberler)

**Neden Kullanılır:** Gerçek haber başlıkları çekmek için (şu anda demo veriler kullanılıyor)

**Ücretsiz Mi:** ✅ Evet (günde 100 istek, development için yeterli)

**Nasıl Alınır:**

1. **Kayıt Ol**
   - Git: https://newsapi.org/register
   - Email ve şifre ile kayıt ol

2. **API Key'i Bul**
   - Kayıt olduğun anda API key ekranda görünecek
   - Veya https://newsapi.org/account adresinden bak

3. **Projeye Ekle**
   ```env
   VITE_NEWS_API_KEY=your_news_api_key_here
   ```

**Not:** Şu anda demo haberler kullanılıyor, bu API opsiyonel.

---

### 3. **YouTube Data API v3** (Kamera Yayınları)

**Neden Kullanılır:** Daha gelişmiş YouTube entegrasyonu için (şu anda public embed kullanılıyor, çalışıyor)

**Ücretsiz Mi:** ✅ Evet (günde 10,000 quota)

**Nasıl Alınır:**

1. **Google Cloud Console'a Git**
   - Git: https://console.cloud.google.com/

2. **Proje Oluştur**
   - "Select a project" → "New Project"
   - Proje adı ver (örn: "vizyon-nexus")
   - Create

3. **YouTube API'yi Aktifleştir**
   - Sol menüden "APIs & Services" → "Library"
   - "YouTube Data API v3" ara
   - "Enable" tıkla

4. **API Key Oluştur**
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "API Key"
   - Key'i kopyala

5. **Projeye Ekle**
   ```env
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

**Not:** Şu anda YouTube embed public olarak çalışıyor, bu API opsiyonel.

---

## 📝 ÖZET

### En Az Bunları Al (Zorunlu):
```
1. ✅ OpenWeatherMap API → Hava durumu için ZORUNLU
```

### Sonra Bunları Ekleyebilirsin (Opsiyonel):
```
2. 🔵 NewsAPI → Gerçek haber başlıkları için
3. 🔵 YouTube API → Gelişmiş kamera özellikleri için
```

---

## 🚀 KURULUM ADIMLARI

1. API key'leri yukarıdaki sitelerden al
2. `.env.local` dosyasını aç
3. API key'leri ilgili satırlara yapıştır:
   ```env
   VITE_OPENWEATHER_API_KEY=buraya_api_key_yapistir
   VITE_NEWS_API_KEY=buraya_api_key_yapistir
   VITE_YOUTUBE_API_KEY=buraya_api_key_yapistir
   ```
4. Dev server'ı yeniden başlat:
   ```bash
   npm run dev
   ```

---

## ❓ SSS

**S: Hiç API key eklemesem ne olur?**
C: Hava durumu demo veriler gösterir (İstanbul, 24°C). Diğer özellikler zaten çalışır.

**S: API key'leri GitHub'a commit etsem ne olur?**
C: Güvenlik riski! `.env.local` zaten `.gitignore`'da, commit edilmez. Dikkatli ol.

**S: Ücretli hale gelir mi?**
C: Hayır, ücretsiz limitler yeterli. Günde 1000+ kullanıcın yoksa sorun yok.

**S: API limitleri aşılırsa?**
C: Kod otomatik olarak fallback verileri kullanır, uygulama patlamaz.

---

## 📞 DESTEK

API kurulumunda sorun yaşarsan:
1. `.env.local` dosyasını kontrol et
2. API key'lerin doğru kopyalandığından emin ol
3. Dev server'ı yeniden başlat
4. Console'da (F12) hata mesajlarına bak
