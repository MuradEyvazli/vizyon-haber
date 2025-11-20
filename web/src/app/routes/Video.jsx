import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNews } from '../../services/newsApi';

export default function Video() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [embedError, setEmbedError] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoCategories = [
    { id: 'all', name: 'Tümü', icon: '🎬' },
    { id: 'news', name: 'Haber', icon: '📰' },
    { id: 'live', name: 'Canlı Yayın', icon: '🔴' },
    { id: 'documentary', name: 'Belgesel', icon: '🎥' },
    { id: 'interview', name: 'Röportaj', icon: '🎤' },
  ];

  // Gerçek haberleri çek
  useEffect(() => {
    loadVideoNews();
  }, []);

  const loadVideoNews = async () => {
    try {
      setLoading(true);
      const news = await fetchNews({ pageSize: 20, page: 1 });
      setNewsData(news);
    } catch (error) {
      console.error('Video haberler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  // YouTube video IDs - Embed edilebilir 24/7 canlı yayın ve haber videoları
  // Not: Bazı videolar embed kısıtlaması olabilir, bu durumda "YouTube'da İzle" fallback çalışır
  const youtubeVideoIds = [
    // 24/7 Canlı Haber Yayınları (genelde embed edilebilir)
    'w_Ma8oQLmSM', // TRT Haber Canlı
    'XWq5kBlakcQ', // Sky News Live
    'dp8PhLsUcFE', // Al Jazeera English Live
    '9Auq9mYxFEE', // ABC News Live
    'K3VOf3CBGvw', // BBC News Live
    '5VF4aov6_oQ', // France 24 English Live

    // Popüler Haber Videoları (embed friendly)
    'jNQXAC9IVRw', // Me at the zoo (ilk YouTube videosu - her zaman çalışır)
    'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up (demo için)
    '9bZkp7q19f0', // PSY - Gangnam Style (embed friendly)
    'kJQP7kiw5Fk', // Charlie bit my finger (embed friendly)
    'L_jWHffIx5E', // Sneezing Panda (embed friendly)
    'fJ9rUzIMcZQ', // Keyboard Cat (embed friendly)
  ];

  // Gerçek haber verilerini video formatına dönüştür
  const videos = newsData.map((news, idx) => ({
    id: idx,
    title: news.title,
    thumbnail: news.image,
    category: news.category,
    duration: `${Math.floor(Math.random() * 10) + 3}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    views: `${Math.floor(Math.random() * 900) + 100}K`,
    uploadDate: news.publishDate,
    channel: news.author,
    isLive: idx % 5 === 0, // Her 5. video canlı
    type: idx % 4 === 0 ? 'live' : idx % 3 === 0 ? 'documentary' : idx % 2 === 0 ? 'interview' : 'news',
    youtubeId: youtubeVideoIds[idx % youtubeVideoIds.length], // Gerçek YouTube ID
  }));

  const filteredVideos = activeFilter === 'all'
    ? videos
    : videos.filter(v => v.type === activeFilter);

  // Video seçildiğinde error state'ini sıfırla
  const handleVideoSelect = (video) => {
    setEmbedError(false);
    setSelectedVideo(video);
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-white pb-24 lg:pb-0">
        <div className="bg-white border-b border-slate-200 py-8">
          <div className="container">
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3 text-slate-900">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Video Haberler
            </h1>
          </div>
        </div>
        <div className="container py-16 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Video haberler yükleniyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3 text-slate-900">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Video Haberler
            </h1>
            <p className="text-slate-600 text-lg">Canlı yayınlar, haberler ve özel içerikler</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {videoCategories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeFilter === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Live Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Canlı Yayınlar
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {videos.filter(v => v.isLive).slice(0, 2).map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleVideoSelect(video)}
              >
                <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200">
                  {/* Thumbnail */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Live Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      CANLI
                    </div>

                    {/* Viewers Count */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-sm font-bold">
                      👁️ {video.views} izliyor
                    </div>

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-8 h-8 text-slate-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-3 text-white/90 text-sm">
                        <span>{video.channel}</span>
                        <span>•</span>
                        <span>{video.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tüm Videolar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
                onClick={() => handleVideoSelect(video)}
              >
                <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200">
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white rounded text-xs font-bold">
                      {video.duration}
                    </div>

                    {/* Live Badge */}
                    {video.isLive && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        CANLI
                      </div>
                    )}

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-slate-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-white">
                    <h3 className="text-slate-900 font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="truncate">{video.channel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{video.views}</span>
                      <span>•</span>
                      <span>{video.uploadDate}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-14 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Player */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              {/* YouTube Embed with Error Handling */}
              <div className="aspect-video bg-black relative">
                {!embedError ? (
                  <>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}&rel=0&modestbranding=1&playsinline=1`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="w-full h-full"
                      onError={() => setEmbedError(true)}
                    />

                    {/* Fallback for blocked embeds */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <a
                        href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto opacity-0 hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-8 py-4 rounded-2xl text-white font-bold flex items-center gap-3"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Video yüklenmiyor mu? YouTube'da izle
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Video Yüklenemedi</h3>
                    <p className="text-white/70 mb-6 max-w-md">
                      Bu video sahibi tarafından embed edilme özelliği kapatılmış olabilir. Videoyu YouTube'da izleyebilirsiniz.
                    </p>
                    <a
                      href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube'da İzle
                    </a>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="p-6 bg-white border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{selectedVideo.title}</h2>
                <div className="flex items-center gap-4 text-slate-600 mb-4">
                  <span className="font-semibold">{selectedVideo.channel}</span>
                  <span>•</span>
                  <span>{selectedVideo.views} görüntüleme</span>
                  <span>•</span>
                  <span>{selectedVideo.uploadDate}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>Beğen</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Paylaş</span>
                  </button>
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all ml-auto"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube'da Aç</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
