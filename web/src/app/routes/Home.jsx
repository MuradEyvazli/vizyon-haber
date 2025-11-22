import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PrayerTimes from '../components/PrayerTimes';
import HeroBanner from '../components/HeroBanner';
import CategoryButtons from '../components/CategoryButtons';
import EnhancedClock from '../components/EnhancedClock';
import LiveWidgets from '../components/LiveWidgets';
import AirportLinks from '../components/AirportLinks';
import QuickLinks from '../components/QuickLinks';
import DailyRecipe from '../components/DailyRecipe';
import NewsSlider from '../components/NewsSlider';
import AsymmetricNewsGrid from '../components/AsymmetricNewsGrid';
import Footer from '../components/Footer';
import { fetchNews, fetchNewsByCategory } from '../../services/newsApi';
import SEO, { StructuredData } from '../../components/SEO';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [location, setLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);

      // Genel haberler çek - İLK SAYFA
      const news = await fetchNews({
        pageSize: 20,
        page: 1,
      });

      setItems(news);
      setCurrentPage(1);
      setHasMore(news.length >= 20);

      // localStorage'a kaydet (detay sayfası için)
      localStorage.setItem('allArticles', JSON.stringify(news));

      // Her haberi ayrı ayrı kaydet
      news.forEach(article => {
        localStorage.setItem(`article-${article.slug}`, JSON.stringify(article));
      });

    } catch (error) {
      console.error('Haber yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Daha fazla haber yükle - PAGINATION
  const loadMoreNews = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      // SONRAKİ SAYFAYI ÇEK
      const moreNews = await fetchNews({
        pageSize: 20,
        page: nextPage,
      });

      if (moreNews.length > 0) {
        const newItems = [...items, ...moreNews];
        setItems(newItems);
        setCurrentPage(nextPage);
        setHasMore(moreNews.length >= 20);

        // localStorage güncelle
        localStorage.setItem('allArticles', JSON.stringify(newItems));
        moreNews.forEach(article => {
          localStorage.setItem(`article-${article.slug}`, JSON.stringify(article));
        });

      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Daha fazla haber yüklenemedi:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Kategorilere göre haberleri ayır
  const teknoloji = items.filter(item =>
    item.category?.toLowerCase().includes('teknoloji') ||
    item.category?.toLowerCase().includes('technology')
  ).slice(0, 8);

  const dunya = items.filter(item =>
    item.category?.toLowerCase().includes('dünya') ||
    item.category?.toLowerCase().includes('world') ||
    item.category?.toLowerCase().includes('genel')
  ).slice(0, 12);

  return (
    <main className="min-h-screen">
      {/* SEO Meta Tags */}
      <SEO
        title="Kısa Haber - Türkiye'nin En Güncel Haber Portalı | Son Dakika"
        description="Son dakika haberleri, güncel gelişmeler, ekonomi, spor, teknoloji ve dünya haberleri. Kısa ve öz haberler için Türkiye'nin en hızlı haber sitesi. 7/24 güncel haberler."
        keywords="kısa haber, son dakika, güncel haberler, türkiye haberleri, haber sitesi, son dakika haberleri, ekonomi haberleri, spor haberleri, dünya haberleri, teknoloji haberleri"
        image="/og-image.jpg"
      />

      {/* Structured Data - Organization */}
      <StructuredData type="organization" />
      <StructuredData type="website" />

      {/* Namaz Saatleri - En Üstte */}
      <PrayerTimes />

      {/* Hero Banner - Arka planda en son haberler */}
      <HeroBanner latestNews={items} />

      {/* Kategori Butonları - Ekonomi, Siyaset, Borsa, Emlak, Sağlık */}
      <CategoryButtons />

      {/* Gelişmiş Canlı Saat - Ana Konum + Yakın Ülkeler + Dünya Saatleri */}
      <EnhancedClock location={location} />

      {/* Ana Haber Grid */}
      <motion.div
        id="news-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="scroll-mt-20"
      >
        <AsymmetricNewsGrid items={items} />
      </motion.div>

      {/* Havalimanı Bilgileri - İstanbul, Ankara, Sabiha Gökçen */}
      <AirportLinks />
      
      {/* Canlı Widget'lar - Saat, Hava Durumu, Dünya Kameraları */}
      <LiveWidgets />

      {/* Hızlı Linkler - Alışveriş */}
      <QuickLinks />


      {/* Bugün Ne Pişirelim - Günlük Yemek Önerisi */}
      <DailyRecipe />

      {/* Öne Çıkan Haberler Slider */}
      {teknoloji.length > 0 && (
        <NewsSlider
          news={teknoloji}
          title="Teknoloji Haberleri"
          gradient="gradient-fire"
        />
      )}

      

      {/* Dünya Haberleri Slider - Daha Fazla Haber */}
      {dunya.length > 0 && (
        <NewsSlider
          news={dunya}
          title="Dünya Haberleri"
          gradient="gradient-ocean"
        />
      )}

      {/* Video Haberler - Clean & Simple */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20"
      >
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
              <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Video Haberler
            </h2>
            <p className="text-white/80 text-xl">En son video haberleri izleyin</p>
          </motion.div>

          {/* Video Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.slice(0, 3).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-500">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-125 group-hover:bg-red-700 transition-all shadow-2xl">
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="inline-block px-3 py-1 bg-red-600 rounded-lg text-white text-xs font-bold mb-3">
                      CANLI
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-sm">Video Haber</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Newsletter - Futuristic Black & White Design */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-black py-32 relative overflow-hidden"
      >
        {/* Animated Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * 600,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: [Math.random() * 600, Math.random() * 600 - 200],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}

          {/* Glowing Grid Lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Scanning Lines */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
            animate={{
              top: ['0%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Content */}
        <div className="container text-center relative z-10">
          {/* Holographic Icon */}
          <motion.div
            initial={{ scale: 0, rotateY: 0 }}
            whileInView={{ scale: 1, rotateY: 360 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="inline-flex items-center justify-center w-24 h-24 border-2 border-white/30 rounded-full mb-8 relative"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 border-2 border-white/20 rounded-full"
            />
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>

          {/* Title with Glitch Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tight relative inline-block">
              GÜNCEL KALIN
              <motion.span
                className="absolute inset-0 text-white/20"
                animate={{
                  x: [-2, 2, -2],
                  y: [2, -2, 2],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                GÜNCEL KALIN
              </motion.span>
            </h2>
          </motion.div>

          {/* Subtitle with Typing Effect */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light tracking-wide"
          >
            <span className="border-r-2 border-white/70 pr-1 animate-pulse">
              GELECEĞİN HABERLERİ DOĞRUDAN SIZE ULAŞSIN
            </span>
          </motion.p>

          {/* Futuristic Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative group">
              {/* Animated Border */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-white via-gray-400 to-white rounded-2xl opacity-20 blur-sm"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              <div className="relative flex flex-col sm:flex-row gap-4 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <input
                  type="email"
                  placeholder="E-POSTA ADRESİNİZİ GİRİN"
                  className="flex-1 px-6 py-5 bg-black/50 text-white placeholder-white/40 border border-white/20 rounded-xl focus:outline-none focus:border-white/60 transition-all font-mono tracking-wider text-sm uppercase"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-10 py-5 bg-white text-black font-black rounded-xl overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="relative flex items-center gap-3 tracking-wider text-sm">
                    ABONE OL
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center justify-center gap-8 text-white/50 text-xs uppercase tracking-widest font-mono"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="w-2 h-2 bg-green-500 rounded-full"
                />
                <span>CANLI YAYINDA</span>
              </div>
              <div className="h-1 w-1 bg-white/30 rounded-full" />
              <div>
                <motion.span
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  1.2M+ ABONE
                </motion.span>
              </div>
              <div className="h-1 w-1 bg-white/30 rounded-full" />
              <div>24/7 GÜNCEL</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Corner Decorations */}
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-white/20"
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-white/20"
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5,
          }}
        />
      </motion.div>

      {/* Footer */}
      <Footer />
    </main>
  );
}