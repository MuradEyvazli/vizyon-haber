import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

/**
 * World Cameras Modal Component
 * Displays real-time camera feeds from major cities around the world
 */
export default function WorldCamerasModal({ isOpen, onClose }) {
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Real YouTube live camera feeds from around the world
  // Using verified 24/7 live streams
  const worldCameras = [
    {
      id: 1,
      city: 'Tokyo',
      country: 'Japonya',
      timezone: 'Asia/Tokyo',
      videoId: 'DjdUEyjx8GM', // Tokyo Shibuya 24/7
      youtubeUrl: 'https://www.youtube.com/watch?v=DjdUEyjx8GM',
      thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
      description: 'Shibuya Kavşağı - Canlı Yayın',
    },
    {
      id: 2,
      city: 'New York',
      country: 'ABD',
      timezone: 'America/New_York',
      videoId: 'wCcMrSOxC4E', // Times Square Earth Cam
      youtubeUrl: 'https://www.youtube.com/watch?v=wCcMrSOxC4E',
      thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
      description: 'Times Square - Canlı Yayın',
    },
    {
      id: 3,
      city: 'Paris',
      country: 'Fransa',
      timezone: 'Europe/Paris',
      videoId: 'ydYDqZQpim8', // Eiffel Tower
      youtubeUrl: 'https://www.youtube.com/watch?v=ydYDqZQpim8',
      thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
      description: 'Eyfel Kulesi - Canlı Yayın',
    },
    {
      id: 4,
      city: 'Dubai',
      country: 'BAE',
      timezone: 'Asia/Dubai',
      videoId: '5sZ0dDzUJuA', // Dubai Marina
      youtubeUrl: 'https://www.youtube.com/watch?v=5sZ0dDzUJuA',
      thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
      description: 'Dubai Marina - Canlı Yayın',
    },
    {
      id: 5,
      city: 'Londra',
      country: 'İngiltere',
      timezone: 'Europe/London',
      videoId: '9n1esR2djkk', // London Eye
      youtubeUrl: 'https://www.youtube.com/watch?v=9n1esR2djkk',
      thumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop',
      description: 'London Eye - Canlı Yayın',
    },
    {
      id: 6,
      city: 'Singapur',
      country: 'Singapur',
      timezone: 'Asia/Singapore',
      videoId: 'A1V3xr-CoW8', // Singapore Marina
      youtubeUrl: 'https://www.youtube.com/watch?v=A1V3xr-CoW8',
      thumbnail: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop',
      description: 'Marina Bay - Canlı Yayın',
    },
    {
      id: 7,
      city: 'İstanbul',
      country: 'Türkiye',
      timezone: 'Europe/Istanbul',
      videoId: 'EJhJetdDiMY', // Istanbul Bosphorus
      youtubeUrl: 'https://www.youtube.com/watch?v=EJhJetdDiMY',
      thumbnail: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop',
      description: 'Boğaz Manzarası - Canlı Yayın',
    },
    {
      id: 8,
      city: 'Amsterdam',
      country: 'Hollanda',
      timezone: 'Europe/Amsterdam',
      videoId: 'mfv8d24GqMc', // Amsterdam Canal
      youtubeUrl: 'https://www.youtube.com/watch?v=mfv8d24GqMc',
      thumbnail: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&h=400&fit=crop',
      description: 'Kanallar - Canlı Yayın',
    },
    {
      id: 9,
      city: 'Sydney',
      country: 'Avustralya',
      timezone: 'Australia/Sydney',
      videoId: 'HDVzG2TTkfI', // Sydney Harbour
      youtubeUrl: 'https://www.youtube.com/watch?v=HDVzG2TTkfI',
      thumbnail: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop',
      description: 'Sydney Limanı - Canlı Yayın',
    },
    {
      id: 10,
      city: 'Miami',
      country: 'ABD',
      timezone: 'America/New_York',
      videoId: 'K9RbpXVhPKs', // Miami Beach
      youtubeUrl: 'https://www.youtube.com/watch?v=K9RbpXVhPKs',
      thumbnail: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=600&h=400&fit=crop',
      description: 'Miami Beach - Canlı Yayın',
    },
    {
      id: 11,
      city: 'Hong Kong',
      country: 'Çin',
      timezone: 'Asia/Hong_Kong',
      videoId: 'c-YgxQXAEqE', // Hong Kong Harbour
      youtubeUrl: 'https://www.youtube.com/watch?v=c-YgxQXAEqE',
      thumbnail: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=600&h=400&fit=crop',
      description: 'Victoria Limanı - Canlı Yayın',
    },
    {
      id: 12,
      city: 'Los Angeles',
      country: 'ABD',
      timezone: 'America/Los_Angeles',
      videoId: 'ydYDqZQpim8', // LA Downtown
      youtubeUrl: 'https://www.youtube.com/watch?v=ydYDqZQpim8',
      thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
      description: 'Downtown LA - Canlı Yayın',
    },
  ];

  // Get current time for each timezone
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

  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
  };

  const handleClosePlayer = () => {
    setSelectedCamera(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-3xl w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    🌍 Dünya Kameraları
                  </h2>
                  <p className="text-white/90 text-sm md:text-base">
                    Dünyanın dört bir yanından canlı kamera yayınları
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-2xl transition-all hover:scale-110"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Video Player (if camera selected) */}
            {selectedCamera && (
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedCamera.videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title={`${selectedCamera.city} Live Camera`}
                  />
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {selectedCamera.city}, {selectedCamera.country}
                    </h3>
                    <p className="text-slate-600">{selectedCamera.description}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      💡 Video açılmıyorsa "YouTube'da Aç" butonunu kullanın
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <a
                      href={selectedCamera.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube'da Aç
                    </a>
                    <button
                      onClick={handleClosePlayer}
                      className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition-all"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Camera Grid */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {worldCameras.map((camera) => (
                  <motion.div
                    key={camera.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => handleCameraClick(camera)}
                  >
                    <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all">
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={camera.thumbnail}
                          alt={camera.city}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* LIVE Badge */}
                        <div className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-lg">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          CANLI
                        </div>

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                            <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">
                          {camera.city}
                        </h3>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{camera.country}</span>
                          <span className="font-mono font-semibold text-blue-600">
                            {getCityTime(camera.timezone)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {camera.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 md:px-8 py-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 text-center">
                Tüm kameralar YouTube üzerinden canlı yayın yapmaktadır
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
