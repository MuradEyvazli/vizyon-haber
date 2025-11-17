import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPrayerTimes, getQiblaDirection, getNextPrayer } from '../../services/prayer';
import { getUserLocation } from '../../services/weather';

/**
 * Prayer Times Component
 * Displays Islamic prayer times with Qibla direction
 */
export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [qiblaDirection, setQiblaDirection] = useState(135);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllTimes, setShowAllTimes] = useState(false);

  useEffect(() => {
    const fetchPrayerData = async () => {
      try {
        const location = await getUserLocation();

        // Fetch prayer times and qibla direction
        const [times, qibla] = await Promise.all([
          getPrayerTimes(location.lat, location.lon),
          getQiblaDirection(location.lat, location.lon),
        ]);

        setPrayerTimes(times);
        setQiblaDirection(qibla);
        setNextPrayer(getNextPrayer(times));
        setLoading(false);
      } catch (error) {
        console.error('Prayer times error:', error);
        setLoading(false);
      }
    };

    fetchPrayerData();

    // Update next prayer every minute
    const interval = setInterval(() => {
      if (prayerTimes) {
        setNextPrayer(getNextPrayer(prayerTimes));
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const allPrayerTimes = prayerTimes ? [
    { name: 'İmsak', time: prayerTimes.fajr, color: 'text-indigo-600' },
    { name: 'Güneş', time: prayerTimes.sunrise, color: 'text-amber-600' },
    { name: 'Öğle', time: prayerTimes.dhuhr, color: 'text-orange-600' },
    { name: 'İkindi', time: prayerTimes.asr, color: 'text-yellow-600' },
    { name: 'Akşam', time: prayerTimes.maghrib, color: 'text-purple-600' },
    { name: 'Yatsı', time: prayerTimes.isha, color: 'text-slate-700' },
  ] : [];

  if (loading) {
    return (
      <div className="bg-slate-50 border-b border-slate-200 py-4">
        <div className="container">
          <div className="flex items-center justify-center gap-3 text-slate-600">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            <span className="text-sm font-medium">Namaz Vakitleri Yükleniyor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border-b border-slate-200"
    >
      <div className="container">
        <div className="py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left: Next Prayer Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {nextPrayer && (
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Sıradaki</div>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{nextPrayer.name}</span>
                      <span className="text-emerald-600">{nextPrayer.time}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Prayer Times (Desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              {allPrayerTimes.map((prayer, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="text-center"
                >
                  <div className={`text-xs font-semibold mb-1 ${prayer.color}`}>
                    {prayer.name}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900">
                    {prayer.time}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Toggle All Times (Mobile) */}
              <button
                onClick={() => setShowAllTimes(!showAllTimes)}
                className="lg:hidden px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all text-sm"
              >
                {showAllTimes ? 'Gizle' : 'Tüm Vakitler'}
              </button>

              {/* Link to Diyanet */}
              <a
                href="https://namazvakitleri.diyanet.gov.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 group"
              >
                <span>Detaylı Bilgi</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile: All Prayer Times (Expandable) */}
          <AnimatePresence>
            {showAllTimes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-slate-200 overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-3">
                  {allPrayerTimes.map((prayer, idx) => (
                    <div key={idx} className="text-center bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <div className={`text-xs font-bold mb-1 ${prayer.color}`}>
                        {prayer.name}
                      </div>
                      <div className="text-base font-mono font-bold text-slate-900">
                        {prayer.time}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
