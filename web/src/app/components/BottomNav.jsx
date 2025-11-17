import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const navItems = [
    {
      href: '/',
      label: 'Ana Sayfa',
      icon: (isActive) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: '/trends',
      label: 'Keşfet',
      icon: (isActive) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
    },
    {
      href: '/video',
      label: 'Video',
      icon: (isActive) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl">
      <div className="grid grid-cols-3 relative">
        {navItems.map((item) => {
          const isActive = activeTab === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setActiveTab(item.href)}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`relative flex flex-col items-center justify-center py-3 px-2 transition-all ${
                  isActive ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {/* Icon */}
                <div className="mb-1">
                  {item.icon(isActive)}
                </div>

                {/* Label */}
                <span className={`text-xs font-semibold transition-all ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Glow Effect */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.2, scale: 1 }}
                    className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}