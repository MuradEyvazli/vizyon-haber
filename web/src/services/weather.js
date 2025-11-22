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
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      getLocationByIP().then(resolve).catch(() => {
        resolve({ lat: 41.0082, lon: 28.9784 }); // Istanbul default
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        getLocationByIP()
          .then(resolve)
          .catch(() => {
            resolve({ lat: 41.0082, lon: 28.9784 }); // Istanbul default
          });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

/**
 * Get approximate location using IP address
 * @returns {Promise<{lat: number, lon: number}>}
 */
const getLocationByIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');

    if (!response.ok) {
      throw new Error('IP geolocation failed');
    }

    const data = await response.json();

    if (data.latitude && data.longitude) {
      return {
        lat: data.latitude,
        lon: data.longitude,
      };
    }

    throw new Error('No coordinates in IP response');
  } catch (error) {
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
    if (!API_KEY || API_KEY === 'your_api_key_here' || API_KEY === '') {
      return getMockWeather();
    }

    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=tr`
    );

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();

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
      timezone: data.timezone,
    };
  } catch (error) {
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
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌧️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return '☀️';
  if (code > 800) return '☁️';
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
    timezone: 10800,
  };
};

/**
 * Get user's timezone offset in seconds
 * @returns {number}
 */
export const getUserTimezoneOffset = () => {
  return -new Date().getTimezoneOffset() * 60;
};
