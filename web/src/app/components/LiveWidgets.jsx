import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserLocation, getWeatherByCoords, getWeatherIconUrl } from '../../services/weather';
import { getExchangeRates } from '../../services/exchangeRate';
import WorldCamerasModal from './WorldCamerasModal';

export default function LiveWidgets() {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({
    temp: 24,
    condition: 'Yükleniyor...',
    city: 'İstanbul',
    icon: '01d',
    humidity: 0,
    windSpeed: 0,
    loading: true,
  });
  const [location, setLocation] = useState(null);
  const [showCamerasModal, setShowCamerasModal] = useState(false);
  const [exchangeRates, setExchangeRates] = useState({
    USD: '--',
    EUR: '--',
    GBP: '--',
    timestamp: '--:--',
    loading: true,
  });

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user location and weather on mount
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const coords = await getUserLocation();
        setLocation(coords);

        const weatherData = await getWeatherByCoords(coords.lat, coords.lon);

        setWeather({
          temp: weatherData.temp,
          condition: weatherData.condition,
          city: weatherData.city,
          icon: weatherData.icon,
          humidity: weatherData.humidity,
          windSpeed: weatherData.windSpeed,
          feelsLike: weatherData.feelsLike,
          loading: false,
        });
      } catch (error) {
        console.error('Hava durumu hatası:', error);
        setWeather((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchWeather();
  }, []);

  // Fetch exchange rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getExchangeRates();
        setExchangeRates({ ...rates, loading: false });
      } catch (error) {
        console.error('Döviz kurları hatası:', error);
        setExchangeRates((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Preview world cameras data
  const cameraPreview = [
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'Paris', timezone: 'Europe/Paris' },
    { city: 'Dubai', timezone: 'Asia/Dubai' },
  ];

  // Get time for specific timezone
  const getCityTime = (timezone) => {
    try {
      return new Date().toLocaleTimeString('tr-TR', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '--:--';
    }
  };

  return (
    <>
      <div className="bg-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Hava Durumu - Real Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-white group cursor-pointer relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                    Hava Durumu
                  </h3>
                  {!weather.loading && (
                    <img
                      src={getWeatherIconUrl(weather.icon)}
                      alt={weather.condition}
                      className="w-12 h-12 drop-shadow-lg"
                    />
                  )}
                </div>

                {weather.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-lg">Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-3 mb-2">
                      <div className="text-6xl font-bold">{weather.temp}°</div>
                      <div className="text-lg opacity-90 capitalize">{weather.condition}</div>
                    </div>
                    <div className="text-sm opacity-90 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {weather.city}
                    </div>

                    {/* Additional weather info */}
                    <div className="flex items-center gap-4 text-xs opacity-80 border-t border-white/20 pt-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                        </svg>
                        Hissedilen: {weather.feelsLike}°
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.5 2a.5.5 0 01.5.5V4h8V2.5a.5.5 0 011 0V4h1a2 2 0 012 2v11a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h1V2.5a.5.5 0 01.5-.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Nem: {weather.humidity}%
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                        </svg>
                        Rüzgar: {weather.windSpeed} m/s
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>

            {/* Döviz Kurları - Live Rates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-white relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                    Döviz Kurları
                  </h3>
                  <svg className="w-5 h-5 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>

                {exchangeRates.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-lg">Yükleniyor...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* USD */}
                    <div className="flex items-center justify-between py-3 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                          $
                        </div>
                        <div>
                          <div className="font-bold text-lg">USD</div>
                          <div className="text-xs opacity-80">Amerikan Doları</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₺{exchangeRates.USD}</div>
                      </div>
                    </div>

                    {/* EUR */}
                    <div className="flex items-center justify-between py-3 border-b border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                          €
                        </div>
                        <div>
                          <div className="font-bold text-lg">EUR</div>
                          <div className="text-xs opacity-80">Euro</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₺{exchangeRates.EUR}</div>
                      </div>
                    </div>

                    {/* GBP */}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                          £
                        </div>
                        <div>
                          <div className="font-bold text-lg">GBP</div>
                          <div className="text-xs opacity-80">Sterlin</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₺{exchangeRates.GBP}</div>
                      </div>
                    </div>

                    {/* Update time */}
                    <div className="pt-3 border-t border-white/20 text-xs opacity-70 text-center">
                      Son güncelleme: {exchangeRates.timestamp}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Dünya Kameraları - Clickable */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-blue-500 transition-all group cursor-pointer"
              onClick={() => setShowCamerasModal(true)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                  Dünya Kameraları
                </h3>
                <svg
                  className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="space-y-3">
                {cameraPreview.map((camera, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{camera.city}</div>
                      <div className="text-xs text-slate-500 font-mono">
                        {getCityTime(camera.timezone)}
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-red-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      CANLI
                    </span>
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 flex items-center justify-center gap-2">
                  <span>Tüm Kameraları Gör</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* World Cameras Modal */}
      <WorldCamerasModal isOpen={showCamerasModal} onClose={() => setShowCamerasModal(false)} />
    </>
  );
}
