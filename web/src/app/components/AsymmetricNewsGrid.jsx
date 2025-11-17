import NewsCard from './NewsCard';

export default function AsymmetricNewsGrid({ items = [] }) {
  /*
   * Mobil-First Asimetrik Grid Tasarımı:
   * - Mobil: tek kolon, hero + standart kartlar
   * - Tablet (md): 2 kolon grid
   * - Desktop (lg): 3 kolon grid, ilk kart 2 kolon kaplar
   */

  if (!items.length) {
    return (
      <section className="container my-8">
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">Henüz haber bulunamadı.</p>
        </div>
      </section>
    );
  }

  const [first, ...rest] = items;

  return (
    <section className="container my-6 sm:my-12 bg-white py-12">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Son Haberler
        </h2>
        <button className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1">
          Tümünü Gör
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hero Card - 2 columns on desktop */}
        <div className="md:col-span-2">
          <NewsCard item={first} variant="hero" />
        </div>

        {/* Regular Cards */}
        {rest.slice(0, 11).map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Load More Button */}
      {items.length > 12 && (
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all">
            Daha Fazla Haber Yükle
          </button>
        </div>
      )}
    </section>
  );
}