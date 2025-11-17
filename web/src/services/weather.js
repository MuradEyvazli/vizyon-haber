/**
 * Weather Service
 * Handles geolocation and weather data fetching from OpenWeatherMap API
 */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Get user's current location using browser's Geolocation API
 * Falls back to IP-based geolocation if permission denied
 * @returns {Promise<{lat: number, lon: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error('❌ Tarayıcınız konum özelliğini desteklemiyor');
      console.log('🌍 IP bazlı konum tespiti deneniyor...');
      getLocationByIP().then(resolve).catch(() => {
        console.warn('📍 Varsayılan konum kullanılıyor: İstanbul');
        resolve({ lat: 41.0082, lon: 28.9784 });
      });
      return;
    }

    console.log('📍 Konum izni isteniyor...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Konum izni verildi!');
        console.log(`📍 Koordinatlar: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        console.log(`📊 Hassasiyet: ±${Math.round(position.coords.accuracy)}m`);
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('⚠️ Konum izni reddedildi veya alınamadı:', error.message);
        console.log('🌍 IP bazlı konum tespiti deneniyor...');

        // Try IP-based geolocation as fallback
        getLocationByIP()
          .then(resolve)
          .catch(() => {
            console.warn('📍 Varsayılan konum kullanılıyor: İstanbul');
            resolve({ lat: 41.0082, lon: 28.9784 }); // Istanbul
          });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  });
};

/**
 * Get approximate location using IP address
 * Uses ipapi.co free service (no API key required, 1000 requests/day)
 * @returns {Promise<{lat: number, lon: number}>}
 */
const getLocationByIP = async () => {
  try {
    console.log('🌐 IP bazlı konum tespiti yapılıyor...');
    const response = await fetch('https://ipapi.co/json/');

    if (!response.ok) {
      throw new Error('IP geolocation failed');
    }

    const data = await response.json();

    if (data.latitude && data.longitude) {
      console.log(`✅ IP konumu tespit edildi: ${data.city}, ${data.country_name}`);
      console.log(`📍 Koordinatlar: ${data.latitude}, ${data.longitude}`);
      return {
        lat: data.latitude,
        lon: data.longitude,
      };
    }

    throw new Error('No coordinates in IP response');
  } catch (error) {
    console.error('❌ IP bazlı konum tespiti başarısız:', error.message);
    throw error;
  }
};

/**
 * Fetch weather data for given coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>}
 */
export const getWeatherByCoords = async (lat, lon) => {
  try {
    // If no API key, return mock data
    if (!API_KEY || API_KEY === 'your_api_key_here' || API_KEY === '') {
      console.warn('⚠️ OpenWeatherMap API key bulunamadı. Demo veriler kullanılıyor.');
      console.warn('API key eklemek için .env.local dosyasını düzenleyin');
      return getMockWeather();
    }

    console.log('🌤️ Hava durumu verisi çekiliyor...');
    console.log(`📍 Konum: ${lat}, ${lon}`);

    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`
    );

    if (!response.ok) {
      console.error('❌ Hava durumu API isteği başarısız:', response.status);
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

    console.log('✅ Hava durumu verisi başarıyla alındı!');
    console.log(`📍 Şehir: ${data.name}`);
    console.log(`🌡️ Sıcaklık: ${Math.round(data.main.temp)}°C`);
    console.log(`☁️ Durum: ${data.weather[0].description}`);

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      condition: data.weather[0].description,
      conditionCode: data.weather[0].id,
      icon: data.weather[0].icon,
      city: data.name,
      country: data.sys.country,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone, // Offset in seconds
    };
  } catch (error) {
    console.error('❌ Hava durumu hatası:', error.message);
    console.warn('⚠️ Demo veriler kullanılıyor');
    return getMockWeather();
  }
};

/**
 * Get weather icon URL from OpenWeatherMap
 * @param {string} icon - Icon code from API
 * @returns {string}
 */
export const getWeatherIconUrl = (icon) => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

/**
 * Get weather condition emoji based on condition code
 * @param {number} code - Weather condition code
 * @returns {string}
 */
export const getWeatherEmoji = (code) => {
  if (code >= 200 && code < 300) return '⛈️'; // Thunderstorm
  if (code >= 300 && code < 400) return '🌧️'; // Drizzle
  if (code >= 500 && code < 600) return '🌧️'; // Rain
  if (code >= 600 && code < 700) return '❄️'; // Snow
  if (code >= 700 && code < 800) return '🌫️'; // Atmosphere
  if (code === 800) return '☀️'; // Clear
  if (code > 800) return '☁️'; // Clouds
  return '🌤️';
};

/**
 * Mock weather data for fallback
 * @returns {Object}
 */
const getMockWeather = () => {
  return {
    temp: 24,
    feelsLike: 22,
    tempMin: 20,
    tempMax: 26,
    humidity: 65,
    pressure: 1013,
    condition: 'açık',
    conditionCode: 800,
    icon: '01d',
    city: 'İstanbul',
    country: 'TR',
    windSpeed: 3.5,
    windDeg: 180,
    clouds: 20,
    sunrise: Math.floor(Date.now() / 1000) - 7200,
    sunset: Math.floor(Date.now() / 1000) + 21600,
    timezone: 10800, // UTC+3
  };
};

/**
 * Get user's timezone offset in seconds
 * @returns {number}
 */
export const getUserTimezoneOffset = () => {
  return -new Date().getTimezoneOffset() * 60;
};
