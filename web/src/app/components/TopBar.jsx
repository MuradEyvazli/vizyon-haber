import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const menuItems = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/trends', label: 'Keşfet' },
    { href: '/video', label: 'Video' },
  ];

  // Türkçe karakterleri normalize et (ç->c, ğ->g, ı->i, ö->o, ş->s, ü->u)
  const normalizeTurkish = (text) => {
    if (!text) return '';
    const map = {
      'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
    };
    return text.toLowerCase().split('').map(char => map[char] || char).join('');
  };

  // Fuzzy search - typo'lara toleranslı arama
  const fuzzyMatch = (text, query) => {
    const normalizedText = normalizeTurkish(text);
    const normalizedQuery = normalizeTurkish(query);

    // Direkt içeriyor mu?
    if (normalizedText.includes(normalizedQuery)) return true;

    // Kelimelere böl ve her kelimede ara
    const words = normalizedQuery.split(' ').filter(w => w.length > 0);
    return words.every(word => normalizedText.includes(word));
  };

  // Akıllı arama - localStorage'daki tüm haberlerde ara
  const performSearch = (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // LocalStorage'dan tüm haberleri al
    const allArticlesStr = localStorage.getItem('allArticles');
    if (!allArticlesStr) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const allArticles = JSON.parse(allArticlesStr);

    // Fuzzy search ile ara
    const results = allArticles.filter(article => {
      return (
        fuzzyMatch(article.title || '', query) ||
        fuzzyMatch(article.summary || '', query) ||
        fuzzyMatch(article.content || '', query) ||
        fuzzyMatch(article.category || '', query) ||
        fuzzyMatch(article.author || '', query) ||
        fuzzyMatch(article.source || '', query)
      );
    });

    // İlk 8 sonucu göster
    setSearchResults(results.slice(0, 8));
    setIsSearching(false);
  };

  // Real-time arama - debounce ile
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300); // 300ms bekle

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Arama sonucuna tıklayınca
  const handleResultClick = (article) => {
    navigate(`/news/${article.slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Highlight - eşleşen kelimeleri vurgula
  const highlightText = (text, query) => {
    if (!query || !text) return text;

    const words = query.trim().split(' ').filter(w => w.length > 0);
    let highlightedText = text;

    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-slate-900">$1</mark>');
    });

    return highlightedText;
  };

  // Uzun metinleri kes ve "..." ekle
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

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
                  {truncateText(news, 100)}
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

      {/* Akıllı Arama - Instant Results */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200 bg-slate-50 relative"
          >
            <div className="container py-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Haber, kategori, yazar ara... (Türkçe karakter desteği)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-white border-2 border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  autoFocus
                />

                {/* Search Icon / Loading */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-[500px] overflow-y-auto z-50"
                  >
                    <div className="container">
                      {/* Sonuçlar varsa */}
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs text-slate-500 font-semibold uppercase">
                            {searchResults.length} Sonuç Bulundu
                          </div>
                          {searchResults.map((article, idx) => (
                            <motion.div
                              key={article.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              onClick={() => handleResultClick(article)}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all border-b border-slate-100 last:border-b-0"
                            >
                              <div className="flex gap-4">
                                {/* Thumbnail */}
                                {article.image && (
                                  <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                  />
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  {/* Category Badge */}
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                      {article.category || 'Haber'}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                      {article.source || 'Kaynak'}
                                    </span>
                                  </div>

                                  {/* Title - Highlighted */}
                                  <h3
                                    className="font-bold text-slate-900 mb-1 line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                      __html: highlightText(article.title, searchQuery)
                                    }}
                                  />

                                  {/* Summary - Highlighted */}
                                  <p
                                    className="text-sm text-slate-600 line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                      __html: highlightText(article.summary || '', searchQuery)
                                    }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        /* Sonuç yoksa */
                        <div className="py-12 text-center">
                          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-slate-500 font-medium">
                            "{searchQuery}" için sonuç bulunamadı
                          </p>
                          <p className="text-sm text-slate-400 mt-2">
                            Farklı kelimeler deneyin veya yazım hatası olup olmadığını kontrol edin
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}