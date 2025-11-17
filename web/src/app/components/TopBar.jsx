import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/trends', label: 'Keşfet' },
    { href: '/video', label: 'Video' },
  ];

  // Son dakika haberleri ticker için
  const breakingNews = [
    'SON DAKİKA: Merkez Bankası faiz kararını açıkladı',
    'Teknoloji devinden çığır açan yapay zeka hamlesi',
    'İklim zirvesinde tarihi anlaşma sağlandı',
    'Borsa İstanbul rekor seviyede',
    'Süper Lig\'de dev transfer',
    'Ekonomide yeni dönem başlıyor',
    'Dünya liderleri kritik zirvede bir araya geldi',
    'Yeni teknoloji ile hayat kolaylaşıyor',
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-lg">
      {/* Breaking News Ticker */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-800 overflow-hidden">
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
            {[...breakingNews, ...breakingNews].map((news, idx) => (
              <div key={idx} className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-sm font-medium">
                  {news}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Ana Header */}
      <div className="container">
        <div className="flex items-center justify-between py-5 md:py-6">
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center cursor-pointer"
            >
              <img
                src="/nexsus-logo.png"
                alt="Vizyon Nexsus News"
                className="h-[200px] mb-[-50px] mt-[-50px] md:mb-[-50px] md:mt-[-50px] md:h-[200px] w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-1">
            {menuItems.map((item, idx) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="px-4 py-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-all"
                >
                  {item.label}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Bildirimler</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-slate-200 bg-slate-50"
        >
          <div className="container py-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Haber, kategori veya yazar ara..."
                className="flex-1 px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all">
                Ara
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </header>
  );
}