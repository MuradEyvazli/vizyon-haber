import axios from 'axios';

const API_KEY = import.meta.env.VITE_EXCHANGERATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

/**
 * Döviz kurlarını çek (TRY bazlı)
 */
export const getExchangeRates = async () => {
  try {
    if (!API_KEY) {
      console.warn('⚠️ Exchange Rate API key bulunamadı, demo veriler kullanılıyor');
      return getDemoRates();
    }

    const response = await axios.get(`${BASE_URL}/latest/TRY`);

    if (response.data.result === 'success') {
      const rates = response.data.conversion_rates;

      // Önemli dövizleri seç ve TRY'ye çevir
      return {
        USD: (1 / rates.USD).toFixed(2),
        EUR: (1 / rates.EUR).toFixed(2),
        GBP: (1 / rates.GBP).toFixed(2),
        timestamp: new Date(response.data.time_last_update_utc).toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    }

    throw new Error('API hatası');
  } catch (error) {
    console.error('❌ Exchange rate fetch error:', error.message);
    return getDemoRates();
  }
};

/**
 * Demo/fallback veriler
 */
function getDemoRates() {
  return {
    USD: '34.25',
    EUR: '37.18',
    GBP: '43.56',
    timestamp: new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}
