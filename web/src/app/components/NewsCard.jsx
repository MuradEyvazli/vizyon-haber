import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NewsCard({ item, variant }) {
  const safeSummary = DOMPurify.sanitize(item.summary || '');

  // Kategori rengini belirle
  const getCategoryColor = (category) => {
    const colors = {
      'Politika': 'bg-red-600',
      'Dünya': 'bg-blue-600',
      'Ekonomi': 'bg-green-600',
      'Teknoloji': 'bg-purple-600',
      'Bilim': 'bg-indigo-600',
      'Sağlık': 'bg-pink-600',
      'Çevre': 'bg-emerald-600',
      'Eğitim': 'bg-amber-600',
      'Kültür': 'bg-orange-600',
      'Spor': 'bg-rose-600',
    };
    return colors[category] || 'bg-slate-600';
  };

  const categoryColor = getCategoryColor(item.category);

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`
        group relative overflow-hidden rounded-3xl transition-all duration-300
        ${variant === 'hero'
          ? 'shadow-2xl hover:shadow-glow bg-white'
          : 'border-2 border-slate-200 bg-white hover:shadow-2xl hover:border-purple-300'
        }
      `}
    >
      <Link to={`/news/${item.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className={`
              w-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2
              ${variant === 'hero' ? 'h-72 sm:h-[400px]' : 'h-56'}
            `}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Category Badge */}
          <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg text-white text-xs font-semibold ${categoryColor} shadow-lg`}>
            {item.category}
          </div>

          {/* Trending Badge (for hero) */}
          {variant === 'hero' && (
            <div className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-lg">
              GÜNDEM
            </div>
          )}
        </div>

        {/* Content */}
        <div className={variant === 'hero' ? 'p-8' : 'p-5'}>
          <h2 className={`
            font-bold leading-tight mb-3 text-slate-900 group-hover:text-blue-600 transition-colors
            ${variant === 'hero' ? 'text-2xl sm:text-3xl' : 'text-lg'}
          `}>
            {item.title}
          </h2>

          <p
            className={`text-slate-600 line-clamp-3 mb-4 ${variant === 'hero' ? 'text-base' : 'text-sm'}`}
            dangerouslySetInnerHTML={{ __html: safeSummary }}
          />

          {/* Meta Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span>
                {new Date(item.publishedAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              <span>•</span>
              <span>5 dk okuma</span>
            </div>
          </div>
        </div>

        {/* Read More Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </Link>
    </motion.article>
  );
}