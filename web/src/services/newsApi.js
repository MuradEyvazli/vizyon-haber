/**
 * ========================================
 * KISA HABER - NEWS API SERVICE
 * ========================================
 * Temiz, basit ve çalışan haber servisi
 * Backend proxy kullanır (CORS sorunu yok)
 */

import axios from 'axios';

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// NewsAPI Key - Frontend'den backend'e gönderilecek
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';

// Axios client
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'X-News-API-Key': NEWS_API_KEY, // API key'i header'da gönder
  },
});

/**
 * Haberleri getir
 * @param {Object} options - { pageSize: 10, page: 1 }
 * @returns {Promise<Array>} Haber listesi
 */
export async function fetchNews(options = {}) {
  try {
    const { pageSize = 20, page = 1 } = options;

    const response = await client.get('/api/news', {
      params: { pageSize, page }
    });

    const { articles } = response.data;

    if (articles && articles.length > 0) {
      return articles;
    }

    return [];

  } catch (error) {
    console.error('Haber çekme hatası:', error.message);
    return getLocalFallback();
  }
}

/**
 * Kategoriye göre haberler (gelecekte eklenecek)
 */
export function fetchNewsByCategory(category) {
  return fetchNews({ pageSize: 10 });
}

/**
 * Arama (gelecekte eklenecek)
 */
export function searchNews(query) {
  return fetchNews({ pageSize: 15 });
}

/**
 * Local fallback - backend'e hiç ulaşılamazsa
 */
function getLocalFallback() {
  return [
    {
      id: 'local-1',
      title: 'Backend\'e Bağlanılamadı',
      summary: 'Lütfen backend API\'nin çalıştığından emin olun.',
      content: 'Backend URL: ' + API_BASE_URL,
      category: 'Sistem',
      slug: 'backend-baglanti-hatasi',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
      publishedAt: new Date().toISOString(),
      source: 'LOCAL',
      url: '#',
      author: 'Sistem',
    }
  ];
}

// Export default
export default {
  fetchNews,
  fetchNewsByCategory,
  searchNews,
};
