import axios from 'axios';

// Rate limiting için basit bir cache
const requestCache = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 saniye
const MAX_REQUESTS_PER_WINDOW = 5;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.vizyon-nexus.com',
  withCredentials: true, // httpOnly cookie için CSRF koruması
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Rate limiting & security
api.interceptors.request.use(
  (config) => {
    const now = Date.now();
    const endpoint = config.url;

    // Rate limiting kontrolü
    if (requestCache.has(endpoint)) {
      const { count, timestamp } = requestCache.get(endpoint);

      if (now - timestamp < RATE_LIMIT_WINDOW) {
        if (count >= MAX_REQUESTS_PER_WINDOW) {
          console.warn('[API] Rate limit exceeded for:', endpoint);
          return Promise.reject(new Error('Rate limit exceeded'));
        }
        requestCache.set(endpoint, { count: count + 1, timestamp });
      } else {
        requestCache.set(endpoint, { count: 1, timestamp: now });
      }
    } else {
      requestCache.set(endpoint, { count: 1, timestamp: now });
    }

    // CSRF token varsa ekle (production'da backend'den gelecek)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Güvenlik logları
    const status = err?.response?.status;
    const message = err?.message;

    if (status === 429) {
      console.error('[API] Too many requests - rate limited');
    } else if (status === 401) {
      console.error('[API] Unauthorized - redirecting to login');
      // window.location.href = '/login';
    } else if (status === 403) {
      console.error('[API] Forbidden - access denied');
    } else if (status >= 500) {
      console.error('[API] Server error:', status);
    } else {
      console.error('[API]', status, message);
    }

    return Promise.reject(err);
  }
);

// Cache cleanup - her 5 dakikada bir eski kayıtları temizle
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > 300000) { // 5 dakika
      requestCache.delete(key);
    }
  }
}, 300000);