import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HeroBanner({ latestNews = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gerçek haberlerden en popüler 5 tanesini al
  const heroNews = latestNews.length >= 5
    ? latestNews.slice(0, 5).map(news => ({
        title: news.title,
        subtitle: news.summary?.substring(0, 100) + '...' || '',
        image: news.image,
        category: news.category,
        slug: news.slug,
        color: getCategoryColor(news.category)
      }))
    : [
        // Fallback demo data (sadece haberler yüklenmediyse)
        {
          title: "Haberler Yükleniyor...",
          subtitle: "En güncel haberler için sayfayı yenileyin",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=600&fit=crop",
          category: "Genel",
          color: "from-slate-600 to-gray-900"
        }
      ];

  // Kategori bazlı renk paleti
  function getCategoryColor(category) {
    const colors = {
      'Teknoloji': 'from-purple-600 to-indigo-900',
      'Dünya': 'from-blue-600 to-cyan-900',
      'Ekonomi': 'from-green-600 to-emerald-900',
      'Sağlık': 'from-pink-600 to-rose-900',
      'Bilim': 'from-indigo-600 to-blue-900',
      'Spor': 'from-red-600 to-orange-900',
      'Politika': 'from-red-700 to-gray-900',
      'Çevre': 'from-emerald-600 to-green-900',
      'Eğitim': 'from-amber-600 to-yellow-900',
      'Kültür': 'from-orange-600 to-red-900',
    };
    return colors[category] || 'from-slate-600 to-gray-900';
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroNews.length]);

  // Arka planda akan haberler (en son 12 haber)
  const backgroundNews = latestNews.slice(0, 12);

  // Kategori renk eşleştirmesi
  const getCategoryStyle = (category) => {
    const styles = {
      'Politika': 'bg-red-500/20 text-red-300 border-red-400/30',
      'Dünya': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'Ekonomi': 'bg-green-500/20 text-green-300 border-green-400/30',
      'Teknoloji': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'Bilim': 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      'Sağlık': 'bg-pink-500/20 text-pink-300 border-pink-400/30',
      'Çevre': 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      'Eğitim': 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      'Kültür': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'Spor': 'bg-rose-500/20 text-rose-300 border-rose-400/30',
    };
    return styles[category] || 'bg-slate-500/20 text-slate-300 border-slate-400/30';
  };

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Arka planda akan haber başlıkları - GERÇEK HABERLER */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        {/* Üst sıra - soldan sağa akan */}
        <motion.div
          className="absolute top-12 left-0 flex gap-4 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {backgroundNews.slice(0, 6).map((news, idx) => (
            <a
              key={`top-${idx}`}
              href={`/makale/${news.slug}`}
              className="group bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30 min-w-[320px] hover:bg-white/25 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-2 ${getCategoryStyle(news.category)}`}>
                {news.category}
              </div>
              <div className="text-white text-sm font-semibold line-clamp-2 leading-relaxed">
                {news.title}
              </div>
            </a>
          ))}
          {/* Döngü için tekrar */}
          {backgroundNews.slice(0, 6).map((news, idx) => (
            <a
              key={`top-repeat-${idx}`}
              href={`/makale/${news.slug}`}
              className="group bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30 min-w-[320px] hover:bg-white/25 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-2 ${getCategoryStyle(news.category)}`}>
                {news.category}
              </div>
              <div className="text-white text-sm font-semibold line-clamp-2 leading-relaxed">
                {news.title}
              </div>
            </a>
          ))}
        </motion.div>

        {/* Alt sıra - sağdan sola akan */}
        <motion.div
          className="absolute bottom-12 left-0 flex gap-4 whitespace-nowrap"
          animate={{ x: [-1000, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {backgroundNews.slice(6, 12).map((news, idx) => (
            <a
              key={`bottom-${idx}`}
              href={`/makale/${news.slug}`}
              className="group bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30 min-w-[320px] hover:bg-white/25 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-2 ${getCategoryStyle(news.category)}`}>
                {news.category}
              </div>
              <div className="text-white text-sm font-semibold line-clamp-2 leading-relaxed">
                {news.title}
              </div>
            </a>
          ))}
          {/* Döngü için tekrar */}
          {backgroundNews.slice(6, 12).map((news, idx) => (
            <a
              key={`bottom-repeat-${idx}`}
              href={`/makale/${news.slug}`}
              className="group bg-white/15 backdrop-blur-md rounded-xl px-5 py-3 border border-white/30 min-w-[320px] hover:bg-white/25 hover:border-white/50 transition-all duration-300 hover:scale-105"
            >
              <div className={`inline-block px-2 py-1 rounded-md text-xs font-bold mb-2 ${getCategoryStyle(news.category)}`}>
                {news.category}
              </div>
              <div className="text-white text-sm font-semibold line-clamp-2 leading-relaxed">
                {news.title}
              </div>
            </a>
          ))}
        </motion.div>
      </div>

      {/* Ana slider içerik */}
      <div className="relative h-full">
        {heroNews.map((news, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 ${index === currentSlide ? 'z-10' : 'z-0'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Background image with overlay */}
            <div className="absolute inset-0">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${news.color} opacity-80`} />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="max-w-3xl"
                >
                  <span className="inline-block px-4 py-2 bg-red-600 rounded-lg text-white text-sm font-bold mb-4">
                    SON DAKİKA • {news.category}
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                    {news.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-6">
                    {news.subtitle}
                  </p>
                  <div className="flex gap-4">
                    {news.slug ? (
                      <Link
                        to={`/news/${news.slug}`}
                        className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-block"
                      >
                        Haberi Oku →
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          document.getElementById('news-section')?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                          });
                        }}
                        className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        Haberlere Git →
                      </button>
                    )}
                    <button
                      onClick={() => {
                        document.getElementById('news-section')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }}
                      className="px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-lg hover:bg-white/30 transition-all border border-white/30 hover:scale-105"
                    >
                      Tüm Haberler
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slider indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroNews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + heroNews.length) % heroNews.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        ←
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % heroNews.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
      >
        →
      </button>
    </div>
  );
}
