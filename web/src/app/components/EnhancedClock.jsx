import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced Clock Component
 * Shows main location time + nearby countries + world time search
 */
export default function EnhancedClock({ location }) {
  const [time, setTime] = useState(new Date());
  const [showWorldTimes, setShowWorldTimes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Nearby countries/cities
  const nearbyCities = [
    { name: 'Azerbaycan', timezone: 'Asia/Baku', flag: '🇦🇿' },
    { name: 'Rusya', timezone: 'Europe/Moscow', flag: '🇷🇺' },
    { name: 'Amerika', timezone: 'America/New_York', flag: '🇺🇸' },
    { name: 'İspanya', timezone: 'Europe/Madrid', flag: '🇪🇸' },
    { name: 'İngiltere', timezone: 'Europe/London', flag: '🇬🇧' },
  ];

  // World cities for search
  const worldCities = [
    { name: 'New York', timezone: 'America/New_York', flag: '🇺🇸', country: 'ABD' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', flag: '🇺🇸', country: 'ABD' },
    { name: 'Londra', timezone: 'Europe/London', flag: '🇬🇧', country: 'İngiltere' },
    { name: 'Paris', timezone: 'Europe/Paris', flag: '🇫🇷', country: 'Fransa' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', flag: '🇯🇵', country: 'Japonya' },
    { name: 'Dubai', timezone: 'Asia/Dubai', flag: '🇦🇪', country: 'BAE' },
    { name: 'Moskova', timezone: 'Europe/Moscow', flag: '🇷🇺', country: 'Rusya' },
    { name: 'Sydney', timezone: 'Australia/Sydney', flag: '🇦🇺', country: 'Avustralya' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', flag: '🇭🇰', country: 'Çin' },
    { name: 'Singapur', timezone: 'Asia/Singapore', flag: '🇸🇬', country: 'Singapur' },
    { name: 'Berlin', timezone: 'Europe/Berlin', flag: '🇩🇪', country: 'Almanya' },
    { name: 'Madrid', timezone: 'Europe/Madrid', flag: '🇪🇸', country: 'İspanya' },
    { name: 'Bakü', timezone: 'Asia/Baku', flag: '🇦🇿', country: 'Azerbaycan' },
    { name: 'Tahran', timezone: 'Asia/Tehran', flag: '🇮🇷', country: 'İran' },
    { name: 'Kahire', timezone: 'Africa/Cairo', flag: '🇪🇬', country: 'Mısır' },
  ];

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

  const getMainTime = () => {
    return time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getMainDate = () => {
    return time.toLocaleDateString('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const filteredCities = searchQuery
    ? worldCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : worldCities;

  return (
    <div className="bg-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold opacity-90">Canlı Saat</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Main Time Display */}
              <div className="text-7xl md:text-8xl font-black mb-4 tracking-tight">
                {getMainTime()}
              </div>

              <div className="text-lg opacity-90 mb-6">
                {getMainDate()}
              </div>

              {/* Location */}
              {location && (
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location.lat.toFixed(2)}, {location.lon.toFixed(2)}</span>
                </div>
              )}

              {/* World Times Button */}
              <button
                onClick={() => setShowWorldTimes(!showWorldTimes)}
                className="mt-6 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-semibold transition-all border border-white/30 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dünya Saatleri
              </button>
            </div>
          </motion.div>

          {/* Nearby Countries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Yakın Ülkeler
            </h3>

            <div className="space-y-3">
              {nearbyCities.map((city, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{city.flag}</span>
                    <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {city.name}
                    </span>
                  </div>
                  <span className="text-lg font-mono font-bold text-slate-700">
                    {getCityTime(city.timezone)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* World Times Modal */}
        <AnimatePresence>
          {showWorldTimes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowWorldTimes(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold">Dünya Saatleri</h2>
                    <button
                      onClick={() => setShowWorldTimes(false)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                    >
                      ×
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Şehir veya ülke ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                  </div>
                </div>

                {/* Cities Grid */}
                <div className="p-6 overflow-y-auto max-h-[500px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCities.map((city, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{city.flag}</span>
                          <span className="text-xs text-slate-500">{city.country}</span>
                        </div>
                        <div className="font-bold text-slate-900 mb-1">{city.name}</div>
                        <div className="text-2xl font-mono font-bold text-blue-600">
                          {getCityTime(city.timezone)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
