import { motion } from 'framer-motion';

export default function QuickLinks() {
  const shoppingLinks = [
    { name: 'Trendyol', url: 'https://trendyol.com', color: 'bg-orange-500' },
    { name: 'Hepsiburada', url: 'https://hepsiburada.com', color: 'bg-blue-600' },
    { name: 'N11', url: 'https://n11.com', color: 'bg-purple-600' },
    { name: 'Amazon', url: 'https://amazon.com.tr', color: 'bg-slate-900' },
  ];

  const airportLinks = [
    { name: 'İstanbul Havalimanı', code: 'IST', flights: 'Bilet Al', url: 'https://www.obilet.com/ucak-bileti/istanbul' },
    { name: 'Sabiha Gökçen', code: 'SAW', flights: 'Bilet Al', url: 'https://www.obilet.com/ucak-bileti' },
    { name: 'Ankara Esenboğa', code: 'ESB', flights: 'Bilet Al', url: 'https://www.obilet.com/ucak-bileti/ankara' },
    { name: 'İzmir Adnan Menderes', code: 'ADB', flights: 'Bilet Al', url: 'https://www.obilet.com/ucak-bileti/izmir' },
  ];

  const importantLinks = [
    { name: 'E-Devlet', url: 'https://giris.turkiye.gov.tr', color: 'bg-red-600' },
    { name: 'Hava Durumu', url: 'https://mgm.gov.tr', color: 'bg-sky-500' },
    { name: 'Trafik', url: 'https://trafik.gov.tr', color: 'bg-orange-500' },
    { name: 'Sağlık', url: 'https://mhrs.gov.tr', color: 'bg-emerald-600' },
    { name: 'SGK', url: 'https://sgk.gov.tr', color: 'bg-indigo-600' },
    { name: 'Bankalar', url: '#', color: 'bg-slate-700' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="container">

        {/* Alışveriş Siteleri - Clean & Modern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">🛍️ Alışveriş Siteleri</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {shoppingLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className={`${link.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer group`}
              >
                <div className="font-bold text-2xl mb-2">{link.name}</div>
                <div className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                  Alışverişe Git →
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Havalimanı Bilgileri - Professional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">✈️ Havalimanı Bilgileri</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {airportLinks.map((airport, idx) => (
              <motion.a
                key={idx}
                href={airport.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer block"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl font-black text-blue-600">{airport.code}</span>
                  <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                    Bilet Al
                  </span>
                </div>
                <div className="font-semibold text-slate-900 mb-2">{airport.name}</div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <span>Uçuş Ara</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Hızlı Erişim - Minimalist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-8">⚡ Hızlı Erişim</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {importantLinks.map((link, idx) => (
              <motion.a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`${link.color} hover:opacity-90 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all cursor-pointer text-center`}
              >
                <div className="font-bold text-sm">{link.name}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
