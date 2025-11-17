import { motion } from 'framer-motion';

/**
 * Airport Links Component
 * Quick links to major Turkish airports' flight information
 */
export default function AirportLinks() {
  const airports = [
    {
      id: 1,
      name: 'İstanbul Havalimanı',
      code: 'IST',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
      departuresUrl: 'https://www.istairport.com/tr/yolcu/ucuslar/giden-ucuslar',
      arrivalsUrl: 'https://www.istairport.com/tr/yolcu/ucuslar/gelen-ucuslar',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      id: 2,
      name: 'Sabiha Gökçen',
      code: 'SAW',
      image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&h=300&fit=crop',
      departuresUrl: 'https://www.sabihagokcen.aero/tr/ucus-bilgileri/giden-ucuslar',
      arrivalsUrl: 'https://www.sabihagokcen.aero/tr/ucus-bilgileri/gelen-ucuslar',
      color: 'from-purple-600 to-pink-500',
    },
    {
      id: 3,
      name: 'Ankara Esenboğa',
      code: 'ANK',
      image: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=400&h=300&fit=crop',
      departuresUrl: 'https://www.esenbogaairport.com/tr-TR/ucuslarim/ucus-bilgileri/giden-ucuslar',
      arrivalsUrl: 'https://www.esenbogaairport.com/tr-TR/ucuslarim/ucus-bilgileri/gelen-ucuslar',
      color: 'from-orange-600 to-red-500',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3l14 9-14 9V3z"
                transform="rotate(-45 12 12)"
              />
            </svg>
            <h2 className="text-4xl font-bold text-slate-900">
              Havalimanı Bilgileri
            </h2>
          </motion.div>
          <p className="text-slate-600 text-lg">
            Anlık uçuş bilgileri ve havalimanı durumu
          </p>
        </div>

        {/* Airport Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {airports.map((airport, idx) => (
            <motion.div
              key={airport.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50">
                {/* Airport Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={airport.image}
                    alt={airport.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${airport.color} opacity-70`} />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Airport Code Badge - Modernized */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-lg rounded-2xl px-5 py-3 shadow-2xl border border-white/50">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{airport.code}</div>
                  </div>

                  {/* Live Indicator - Enhanced */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/95 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    CANLI
                  </div>
                </div>

                {/* Airport Info */}
                <div className="p-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {airport.name}
                  </h3>

                  {/* Modern Glass Buttons */}
                  <div className="space-y-3">
                    {/* Departures Button - Glass Morphism */}
                    <a
                      href={airport.departuresUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 hover:border-blue-500/60 rounded-2xl font-bold transition-all duration-300 group/btn overflow-hidden hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover/btn:from-blue-500/20 group-hover/btn:to-cyan-500/20 transition-all duration-300" />

                      <span className="relative flex items-center gap-3 text-blue-700 group-hover/btn:text-blue-800">
                        <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover/btn:bg-blue-500/30 transition-colors">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        </div>
                        <span className="text-lg">Giden Uçuşlar</span>
                      </span>

                      <svg className="relative w-6 h-6 text-blue-600 group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>

                    {/* Arrivals Button - Glass Morphism */}
                    <a
                      href={airport.arrivalsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center justify-between w-full px-6 py-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-xl border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl font-bold transition-all duration-300 group/btn overflow-hidden hover:shadow-lg hover:shadow-emerald-500/20"
                    >
                      {/* Animated Background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-green-500/0 group-hover/btn:from-emerald-500/20 group-hover/btn:to-green-500/20 transition-all duration-300" />

                      <span className="relative flex items-center gap-3 text-emerald-700 group-hover/btn:text-emerald-800">
                        <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover/btn:bg-emerald-500/30 transition-colors">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <span className="text-lg">Gelen Uçuşlar</span>
                      </span>

                      <svg className="relative w-6 h-6 text-emerald-600 group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-6 py-3 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">
              Tüm uçuş bilgileri havalimanlarının resmi web sitelerinden sağlanmaktadır
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
