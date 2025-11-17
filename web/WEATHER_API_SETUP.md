# Hava Durumu API Kurulumu

Canlı hava durumu özelliğini kullanmak için OpenWeatherMap API anahtarına ihtiyacınız var.

## Adımlar

1. **OpenWeatherMap'e Kayıt Ol**
   - https://home.openweathermap.org/users/sign_up adresine git
   - Ücretsiz bir hesap oluştur

2. **API Anahtarını Al**
   - Giriş yaptıktan sonra "API keys" sekmesine git
   - Varsayılan API anahtarını kopyala veya yeni bir tane oluştur

3. **API Anahtarını Projeye Ekle**
   - `.env.local` dosyasını aç (kök dizinde)
   - `VITE_OPENWEATHER_API_KEY=your_api_key_here` satırındaki `your_api_key_here` kısmını kopyaladığın API anahtarıyla değiştir

   Örnek:
   ```env
   VITE_OPENWEATHER_API_KEY=abc123def456ghi789jkl012mno345pq
   ```

4. **Geliştirme Sunucusunu Yeniden Başlat**
   - Terminal'de Ctrl+C ile sunucuyu durdur
   - `npm run dev` komutuyla tekrar başlat

## Notlar

- API anahtarı ücretsizdir ve günde 1,000 istek yapmanıza izin verir
- Eğer API anahtarı yoksa, uygulama otomatik olarak demo verileri kullanır
- API anahtarını asla GitHub'a commit etmeyin (`.env.local` zaten `.gitignore`'da)

## Test Et

Kurulum başarılı olursa:
- ✅ Tarayıcı konum izni isteyecek
- ✅ Gerçek hava durumu verisi gösterilecek
- ✅ Şehir adı otomatik güncellenecek
- ✅ Hava durumu ikonu görünecek
