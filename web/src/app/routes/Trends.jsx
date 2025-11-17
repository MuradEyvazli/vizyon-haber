import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockNewsData } from '../../data/mockNews';

export default function Trends() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🔥', color: 'from-orange-500 to-red-500' },
    { id: 'Teknoloji', name: 'Teknoloji', icon: '💻', color: 'from-purple-500 to-blue-500' },
    { id: 'Dünya', name: 'Dünya', icon: '🌍', color: 'from-blue-500 to-cyan-500' },
    { id: 'Politika', name: 'Politika', icon: '🏛️', color: 'from-red-500 to-pink-500' },
    { id: 'Ekonomi', name: 'Ekonomi', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { id: 'Spor', name: 'Spor', icon: '⚽', color: 'from-indigo-500 to-purple-500' },
  ];

  const trendingTopics = [
    { tag: '#YapayZeka', count: '125K gönderi' },
    { tag: '#İklimKrizi', count: '98K gönderi' },
    { tag: '#EkonomiGündemi', count: '87K gönderi' },
    { tag: '#Teknoloji', count: '76K gönderi' },
    { tag: '#Seçim2024', count: '65K gönderi' },
  ];

  const filteredNews = selectedCategory === 'all'
    ? mockNewsData
    : mockNewsData.filter(item => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pb-24 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              <span className="text-5xl">🔥</span>
              Keşfet
            </h1>
            <p className="text-white/90 text-lg">Gündemdeki konular ve trend haberler</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Category Filter */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Kategoriler</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                        : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredNews.map((item, idx) => (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-sm font-bold text-slate-900">
                      {item.category}
                    </div>

                    {/* Trending Badge */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">
                      <span>🔥</span>
                      <span>TREND</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                      {item.summary}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>{item.author}</span>
                      <span>{item.publishDate}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Sidebar - Trending Topics */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-6 shadow-xl"
              >
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  Trend Konular
                </h2>

                <div className="space-y-4">
                  {trendingTopics.map((topic, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-start justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                              {idx + 1}
                            </span>
                            <span className="text-blue-600 font-bold text-lg group-hover:underline">
                              {topic.tag}
                            </span>
                          </div>
                          <p className="text-slate-500 text-sm">{topic.count}</p>
                        </div>
                        <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                          🔥
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Popular Now */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h3 className="text-xl font-black text-slate-900 mb-4">
                    Şu Anda Popüler
                  </h3>
                  <div className="space-y-3">
                    {mockNewsData.slice(0, 5).map((news, idx) => (
                      <div key={idx} className="flex gap-3 group cursor-pointer">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {news.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{news.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
