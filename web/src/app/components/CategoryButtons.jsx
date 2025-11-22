import { motion } from 'framer-motion';

/**
 * News Category Buttons
 * Links to different news category domains
 */
export default function CategoryButtons() {
  const categories = [
    {
      name: 'Ekonomi',
      url: 'https://www.ntv.com.tr/ekonomi',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30 hover:border-green-500/60',
      textColor: 'text-green-700',
      description: 'Döviz, Borsa, Finans',
    },
    {
      name: 'Spor',
      url: 'https://www.fanatik.com.tr/',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-500/60',
      textColor: 'text-blue-700',
      description: 'Futbol, Basketbol, Tenis',
    },
    {
      name: 'Teknoloji',
      url: 'https://shiftdelete.net/',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      textColor: 'text-purple-700',
      description: 'Yazılım, Donanım, AI',
    },
    {
      name: 'Dünya',
      url: 'https://www.trthaber.com/dunya/',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30 hover:border-orange-500/60',
      textColor: 'text-orange-700',
      description: 'Uluslararası Haberler',
    },
    {
      name: 'Sağlık',
      url: 'https://www.hurriyet.com.tr/kelebek/saglik/',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'from-cyan-500/20 to-teal-500/20',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      textColor: 'text-cyan-700',
      description: 'Tıp, Sağlıklı Yaşam',
    },
  ];

  return (
    <section className="bg-white py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Haber Kategorileri
          </h2>
          <p className="text-slate-600 text-lg">
            İlgi alanlarınıza göre hızlı erişim
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, idx) => (
            <motion.a
              key={idx}
              href={category.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Gradient border wrapper */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color.replace('/20', '')} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`} />

              <div className="relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 h-full flex flex-col">
                {/* Icon container with gradient background */}
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color.replace('/20', '/10')} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`${category.textColor}`}>
                    {category.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                  {category.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 mb-4 flex-grow">
                  {category.description}
                </p>

                {/* Arrow - only appears on hover */}
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-all">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">Keşfet</span>
                  <svg className="w-5 h-5 translate-x-0 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
