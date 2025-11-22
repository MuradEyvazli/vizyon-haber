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

  // Türk haber kanalları - YouTube kanal linkleri (canlı yayın sayfaları)
  const turkishNewsChannels = [
    {
      name: 'TRT Haber',
      liveUrl: 'https://www.youtube.com/@TRTHaber/live',
      channelUrl: 'https://www.youtube.com/@TRTHaber',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdro_nOVjxFi_QL-8bCbUR2Zv7WDdqpjEeGPr_Wm_8=s176-c-k-c0x00ffffff-no-rj',
      color: 'from-red-600 to-red-800'
    },
    {
      name: 'NTV',
      liveUrl: 'https://www.youtube.com/@ntv/live',
      channelUrl: 'https://www.youtube.com/@ntv',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdro_l0fqIzTvmqhZzxIgBzqKJHp0GNvBcoqxJBsls=s176-c-k-c0x00ffffff-no-rj',
      color: 'from-blue-600 to-blue-800'
    },
    {
      name: 'CNN Türk',
      liveUrl: 'https://www.youtube.com/@caborahaber/live',
      channelUrl: 'https://www.youtube.com/@caborahaber',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdro_mVvlJ3eSxkVrTnQdCO0_6wOxuXb1wjLqMpkik=s176-c-k-c0x00ffffff-no-rj',
      color: 'from-red-700 to-orange-600'
    },
    {
      name: 'Habertürk',
      liveUrl: 'https://www.youtube.com/@Haberturk/live',
      channelUrl: 'https://www.youtube.com/@Haberturk',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kRxoLbFfZE-nQY8fYhM1Pj-vqEqJnGg4c=s176-c-k-c0x00ffffff-no-rj',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'A Haber',
      liveUrl: 'https://www.youtube.com/@AHaber/live',
      channelUrl: 'https://www.youtube.com/@AHaber',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kiTCU7TZBrJdXcFjyV_lqgmUbEXs=s176-c-k-c0x00ffffff-no-rj',
      color: 'from-red-500 to-red-700'
    },
    {
      name: 'TRT 1',
      liveUrl: 'https://www.youtube.com/@taborac/live',
      channelUrl: 'https://www.youtube.com/@taborac',
      logo: 'https://yt3.googleusercontent.com/ytc/AIdro_nJJfXb2VeSpGk0_Q7PDwpM8q8=s176-c-k-c0x00ffffff-no-rj',
      color: 'from-blue-500 to-purple-600'
    },
  ];

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

      {/* Canlı TV - Türk Haber Kanalları */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20"
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
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
              </span>
              Canlı TV
            </h2>
            <p className="text-white/70 text-lg">Türk haber kanallarını canlı izleyin</p>
          </motion.div>

          {/* TV Kanal Kartları */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {turkishNewsChannels.map((channel, idx) => (
              <motion.a
                key={channel.name}
                href={channel.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className={`relative bg-gradient-to-br ${channel.color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Live Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    <span className="text-white text-xs font-bold">CANLI</span>
                  </div>

                  {/* Channel Logo */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center text-white text-2xl font-black">
                      {channel.name.charAt(0)}
                    </div>
                  </div>

                  {/* Channel Name */}
                  <h3 className="text-white font-bold text-center text-sm mb-2">
                    {channel.name}
                  </h3>

                  {/* Watch Button */}
                  <div className="flex items-center justify-center gap-2 text-white/80 text-xs group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>İzle</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-white/50 text-sm mt-8"
          >
            Tıklayarak YouTube üzerinden canlı yayını izleyebilirsiniz
          </motion.p>
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