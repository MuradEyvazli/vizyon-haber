import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NewsSlider({ news = [], title = "Öne Çıkan Haberler", gradient = "gradient-primary" }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!news.length) return null;

  const slideLeft = () => {
    setActiveIndex((prev) => (prev === 0 ? news.length - 4 : prev - 1));
  };

  const slideRight = () => {
    setActiveIndex((prev) => (prev >= news.length - 4 ? 0 : prev + 1));
  };

  // Ticker için haber başlıklarını al
  const tickerNews = news.slice(0, 10).map(item => item.title);

  return (
    <div className="bg-white">
      {/* Haber Ticker Bandı */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-y border-blue-800 overflow-hidden">
        <div className="py-3">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
              repeatType: 'loop'
            }}
          >
            {/* İki kez tekrarla seamless loop için */}
            {[...tickerNews, ...tickerNews].map((newsTitle, idx) => (
              <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">
                  {newsTitle}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            {title}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={slideLeft}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold hover:scale-110 transition-all"
            >
              ←
            </button>
            <button
              onClick={slideRight}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-700 font-bold hover:scale-110 transition-all"
            >
              →
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${activeIndex * 25}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {news.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] group cursor-pointer"
              >
                <Link to={`/news/${item.slug}`}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {item.summary}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(item.publishedAt).toLocaleDateString('tr-TR')}</span>
                        <span className="text-blue-600 font-semibold group-hover:underline">
                          Devamını Oku →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(news.length / 4) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx * 4)}
              className={`h-2 rounded-full transition-all ${
                Math.floor(activeIndex / 4) === idx
                  ? 'w-8 bg-blue-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
