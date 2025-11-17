# VİZYON NEXUS - API Dokümantasyonu

Bu dokümantasyon, VİZYON NEXUS projesinde kullanılan tüm API'leri ve entegrasyonları açıklar.

---

## 1. Hava Durumu API - OpenWeatherMap

**API Provider**: OpenWeatherMap
**Website**: https://openweathermap.org/api
**Pricing**: Ücretsiz (1000 istek/gün)
**API Key Gerekli**: Evet

### Kullanım Yeri
- `src/services/weather.js`
- `src/app/components/LiveWidgets.jsx`

### Endpoints

#### Mevcut Hava Durumu
```
GET https://api.openweathermap.org/data/2.5/weather
```

**Parametreler**:
- `lat` (required): Enlem
- `lon` (required): Boylam
- `appid` (required): API anahtarı
- `units` (optional): Birim sistemi (metric, imperial)
- `lang` (optional): Dil kodu (tr)

**Örnek İstek**:
```javascript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=41.0082&lon=28.9784&appid=${API_KEY}&units=metric&lang=tr`
);
```

**Örnek Yanıt**:
```json
{
  "name": "Istanbul",
  "main": {
    "temp": 18.5,
    "feels_like": 17.3,
    "humidity": 65
  },
  "weather": [
    {
      "description": "parçalı bulutlu",
      "icon": "02d"
    }
  ],
  "wind": {
    "speed": 3.5
  }
}
```

### Kurulum
1. https://openweathermap.org/ adresinden ücretsiz hesap oluşturun
2. API anahtarınızı alın
3. `.env.local` dosyasına ekleyin:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

---

## 2. Namaz Vakitleri API - Aladhan

**API Provider**: Aladhan.com
**Website**: https://aladhan.com/prayer-times-api
**Pricing**: Tamamen Ücretsiz, Limitsiz
**API Key Gerekli**: Hayır

### Kullanım Yeri
- `src/services/prayer.js`
- `src/app/components/PrayerTimes.jsx`

### Endpoints

#### Namaz Vakitleri
```
GET https://api.aladhan.com/v1/timings/{timestamp}
```

**Parametreler**:
- `timestamp` (required): Unix timestamp
- `latitude` (required): Enlem
- `longitude` (required): Boylam
- `method` (optional): Hesaplama yöntemi (13 = Türkiye Diyanet İşleri)

**Örnek İstek**:
```javascript
const timestamp = Math.floor(Date.now() / 1000);
const response = await fetch(
  `https://api.aladhan.com/v1/timings/${timestamp}?latitude=41.0082&longitude=28.9784&method=13`
);
```

**Örnek Yanıt**:
```json
{
  "data": {
    "timings": {
      "Fajr": "05:30",
      "Sunrise": "07:00",
      "Dhuhr": "13:15",
      "Asr": "16:30",
      "Maghrib": "19:00",
      "Isha": "20:30"
    }
  }
}
```

#### Kıble Yönü
```
GET https://api.aladhan.com/v1/qibla/{latitude}/{longitude}
```

**Örnek İstek**:
```javascript
const response = await fetch(
  `https://api.aladhan.com/v1/qibla/41.0082/28.9784`
);
```

**Örnek Yanıt**:
```json
{
  "data": {
    "direction": 156.78
  }
}
```

### Kurulum
API anahtarı gerektirmez, doğrudan kullanılabilir.

---

## 3. Yemek Tarifleri API - TheMealDB

**API Provider**: TheMealDB
**Website**: https://www.themealdb.com/api.php
**Pricing**: Ücretsiz (Test API)
**API Key Gerekli**: Hayır (test için)

### Kullanım Yeri
- `src/app/components/DailyRecipe.jsx`

### Endpoints

#### Rastgele Tarif
```
GET https://www.themealdb.com/api/json/v1/1/random.php
```

**Örnek İstek**:
```javascript
const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
```

**Örnek Yanıt**:
```json
{
  "meals": [
    {
      "idMeal": "52772",
      "strMeal": "Teriyaki Chicken Casserole",
      "strCategory": "Chicken",
      "strArea": "Japanese",
      "strInstructions": "Preheat oven to 350°F...",
      "strMealThumb": "https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
      "strYoutube": "https://www.youtube.com/watch?v=4aZr5hZXP_s",
      "strSource": "https://www.recipe-website.com"
    }
  ]
}
```

### Kurulum
API anahtarı gerektirmez. Premium özellükler için (https://www.patreon.com/thedatadb) Patreon üyeliği gerekir.

---

## 4. Haberler API - NewsAPI

**API Provider**: NewsAPI.org
**Website**: https://newsapi.org/
**Pricing**: Ücretsiz (100 istek/gün)
**API Key Gerekli**: Evet

### Kullanım Yeri
- `src/services/api.js`
- `src/app/routes/Home.jsx`

### Endpoints

#### Son Haberler
```
GET https://newsapi.org/v2/everything
```

**Parametreler**:
- `q` (optional): Arama sorgusu
- `sources` (optional): Haber kaynakları
- `language` (optional): Dil kodu
- `pageSize` (optional): Sonuç sayısı
- `apiKey` (required): API anahtarı

**Örnek İstek**:
```javascript
const response = await fetch(
  `https://newsapi.org/v2/everything?q=teknoloji&language=tr&pageSize=20&apiKey=${API_KEY}`
);
```

### Kurulum
1. https://newsapi.org/ adresinden ücretsiz hesap oluşturun
2. API anahtarınızı alın
3. `.env.local` dosyasına ekleyin:
```env
VITE_NEWS_API_KEY=your_api_key_here
```

**NOT**: Ücretsiz plan geliştirme amaçlıdır, production için ücretli plan gerekir.

---

## 5. YouTube Embed API

**API Provider**: YouTube
**Website**: https://developers.google.com/youtube
**Pricing**: Ücretsiz (Embed için)
**API Key Gerekli**: Hayır (embed için)

### Kullanım Yeri
- `src/app/components/WorldCamerasModal.jsx`

### Kullanım

#### Embed Video
```html
<iframe
  src="https://www.youtube.com/embed/{VIDEO_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1"
  allowFullScreen
/>
```

**Parametreler**:
- `autoplay=1`: Otomatik başlat
- `mute=1`: Sessiz başlat
- `controls=1`: Kontrolleri göster
- `rel=0`: İlgili videoları gizle
- `modestbranding=1`: YouTube logosunu küçült

### Canlı Kamera Video ID'leri

| Şehir | Video ID | Açıklama |
|-------|----------|----------|
| Tokyo | DjdUEyjx8GM | Shibuya Crossing 24/7 |
| New York | o7ZYs1vTlLo | Times Square EarthCam |
| London | NyLF8nHIquM | Abbey Road Crossing |
| Paris | ZXgDgHcMQZo | Paris Skyline Live |
| Dubai | nYxVSRjhrfU | Downtown Dubai |
| Hong Kong | 3DIkZ4vm_hI | Hong Kong City View |
| Istanbul | jYvKSKCJXsY | Bosphorus View |
| Moscow | dPBlggFZpAM | Red Square View |
| Sydney | 3fKrEJH67r4 | Sydney Harbour |
| Singapore | XE_dQhcdqKc | Marina Bay |
| Los Angeles | b7K_lbglfI4 | Hollywood Hills |
| Barcelona | 5FyOhznPYGM | La Rambla |

---

## 6. Geolocation API (Browser)

**API Provider**: Browser Native API
**Pricing**: Ücretsiz
**API Key Gerekli**: Hayır

### Kullanım Yeri
- `src/services/weather.js`
- `src/services/prayer.js`
- `src/app/components/EnhancedClock.jsx`

### Kullanım

```javascript
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tarayıcınız konum bilgisini desteklemiyor'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
```

### İzinler
- Kullanıcıdan konum izni gerekir
- HTTPS bağlantı gereklidir
- Tarayıcı ayarlarından kontrol edilebilir

---

## 7. Harici Linkler ve Kaynaklar

### Havalimanı Bilgileri

#### İstanbul Havalimanı (IST)
- **Gidiş Uçuşları**: https://www.istairport.com/tr/yolcu/ucuslar/giden-ucuslar
- **Geliş Uçuşları**: https://www.istairport.com/tr/yolcu/ucuslar/gelen-ucuslar

#### Sabiha Gökçen Havalimanı (SAW)
- **Gidiş Uçuşları**: https://www.sabihagokcen.aero/tr/yolcular/ucuslar/giden-ucuslar
- **Geliş Uçuşları**: https://www.sabihagokcen.aero/tr/yolcular/ucuslar/gelen-ucuslar

#### Ankara Esenboğa Havalimanı (ANK)
- **Gidiş Uçuşları**: https://www.esenbogaairport.com/tr/ucuslar
- **Geliş Uçuşları**: https://www.esenbogaairport.com/tr/ucuslar

### Kategori Linkleri

| Kategori | URL |
|----------|-----|
| Ekonomi | https://www.bbc.com/turkce/topics/ckdxnw959n7t |
| Siyaset | https://www.bbc.com/turkce/topics/cw57v2pmll9t |
| Borsa | https://www.borsamagazin.com.tr/ |
| Emlak | https://www.hurriyetemlak.com/ |
| Sağlık | https://www.bbc.com/turkce/topics/c340q430z4vt |

### Namaz Vakitleri
- **Diyanet İşleri**: https://namazvakitleri.diyanet.gov.tr/

---

## 8. Ortam Değişkenleri (.env.local)

Projenin çalışması için gerekli tüm API anahtarları:

```env
# Hava Durumu API
VITE_OPENWEATHER_API_KEY=fe1786287a1fce546099e424aaf23877

# Haberler API
VITE_NEWS_API_KEY=5056321a8bda488aabbc60743ea46a68

# YouTube API (Gelecekte veri çekmek için)
VITE_YOUTUBE_API_KEY=AIzaSyASHErdZc3GoLnqGd27JChZixHahb2Cv6k

# TheMealDB API (Opsiyonel, ücretsiz test API'si var)
VITE_MEALDB_API_KEY=1

# Opsiyonel API'ler (Gelecek geliştirmeler için)
VITE_COLLECTAPI_KEY=
VITE_EXCHANGERATE_API_KEY=
```

---

## 9. Hata Yönetimi

### Genel Hata Yakalama Stratejisi

```javascript
try {
  const data = await fetchDataFromAPI();
  setData(data);
} catch (error) {
  console.error('API Error:', error);
  // Fallback verisi göster
  setData(DEFAULT_DATA);
} finally {
  setLoading(false);
}
```

### Yaygın Hatalar ve Çözümleri

#### 1. CORS Hatası
**Sorun**: `Access-Control-Allow-Origin` hatası
**Çözüm**: Backend proxy kullanın veya API'nin CORS desteği olduğundan emin olun

#### 2. API Key Geçersiz
**Sorun**: `401 Unauthorized` veya `403 Forbidden`
**Çözüm**:
- API anahtarını kontrol edin
- `.env.local` dosyasının doğru konumda olduğundan emin olun
- Uygulamayı yeniden başlatın (`npm run dev`)

#### 3. Rate Limit Aşımı
**Sorun**: `429 Too Many Requests`
**Çözüm**:
- İstekleri önbellekleyin (cache)
- İstek sıklığını azaltın
- Ücretli plana geçin

#### 4. Konum İzni Reddedildi
**Sorun**: Kullanıcı konum iznini reddettiğinde
**Çözüm**:
```javascript
// Varsayılan konum kullan (İstanbul)
const defaultLocation = { lat: 41.0082, lon: 28.9784 };
```

---

## 10. Performans Optimizasyonu

### Caching Stratejisi

```javascript
// Hava durumunu 10 dakika cache'le
const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika
let weatherCache = {
  data: null,
  timestamp: 0
};

export const getCachedWeather = async (lat, lon) => {
  const now = Date.now();
  if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION) {
    return weatherCache.data;
  }

  const freshData = await getWeatherByCoords(lat, lon);
  weatherCache = { data: freshData, timestamp: now };
  return freshData;
};
```

### İstek Optimizasyonu

```javascript
// Birden fazla API'yi paralel olarak çağır
const [weather, prayerTimes, news] = await Promise.all([
  getWeatherByCoords(lat, lon),
  getPrayerTimes(lat, lon),
  getNews()
]);
```

---

## 11. Güvenlik Önlemleri

### API Anahtarlarının Korunması

1. **Asla GitHub'a commit etmeyin**
```bash
# .gitignore dosyasına ekleyin
.env.local
.env
```

2. **Environment Variables kullanın**
```javascript
// ✅ Doğru
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// ❌ Yanlış
const API_KEY = "fe1786287a1fce546099e424aaf23877";
```

3. **Production'da Backend Proxy kullanın**
```javascript
// Frontend'den direkt API çağrısı yerine
// Kendi backend'inizden proxy yapın
const response = await fetch('/api/weather', {
  method: 'POST',
  body: JSON.stringify({ lat, lon })
});
```

### XSS Koruması

```javascript
import DOMPurify from 'isomorphic-dompurify';

// Kullanıcıdan gelen veriyi temizle
const cleanHTML = DOMPurify.sanitize(userInput);
```

---

## 12. Test ve Debugging

### API İsteklerini Test Etme

```javascript
// Console'da detaylı log
console.log('🌤️ Hava durumu verisi çekiliyor...');
console.log(`📍 Konum: ${lat}, ${lon}`);
console.log('✅ Başarılı!', data);
```

### Network İzleme
1. Browser Developer Tools → Network sekmesi
2. API isteklerini filtrele
3. Response'ları kontrol et

### Yaygın Test Senaryoları
- ✅ API anahtarı geçerliliği
- ✅ Konum izni verildiğinde
- ✅ Konum izni reddedildiğinde
- ✅ Network bağlantısı olmadığında
- ✅ API yanıt vermediğinde
- ✅ Rate limit aşıldığında

---

## 13. Gelecek Geliştirmeler

### Potansiyel API Eklemeleri

1. **Döviz ve Altın Fiyatları**
   - CollectAPI (https://collectapi.com/)
   - ExchangeRate-API (https://www.exchangerate-api.com/)

2. **Borsa Verileri**
   - Alpha Vantage (https://www.alphavantage.co/)
   - Yahoo Finance API

3. **Trafik Bilgileri**
   - Google Maps Traffic API
   - TomTom Traffic API

4. **Etkinlikler**
   - Eventbrite API
   - Biletix (Custom scraping)

---

## İletişim ve Destek

**Geliştirici**: Murad Eyvazli
**GitHub**: https://github.com/muradeyvazli
**Proje**: VİZYON NEXUS

API kullanımında sorun yaşarsanız, ilgili API'nin dokümantasyonunu kontrol edin veya GitHub'da issue açın.

---

**Son Güncelleme**: 2025-11-11
**Versiyon**: 1.0.0
