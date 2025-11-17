import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Daily Recipe Component
 * Shows 15 different meal suggestions with carousel navigation
 */
export default function DailyRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetch15Recipes();
  }, []);

  const fetch15Recipes = async () => {
    try {
      console.log('🍳 15 tarif yükleniyor...');
      const recipePromises = [];

      // 15 rastgele tarif çek
      for (let i = 0; i < 15; i++) {
        recipePromises.push(
          fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(res => res.json())
        );
      }

      const results = await Promise.all(recipePromises);

      const fetchedRecipes = results
        .filter(data => data.meals && data.meals[0])
        .map(data => {
          const meal = data.meals[0];
          return {
            name: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            youtubeUrl: meal.strYoutube,
            sourceUrl: meal.strSource,
          };
        });

      if (fetchedRecipes.length > 0) {
        setRecipes(fetchedRecipes);
        console.log(`✅ ${fetchedRecipes.length} tarif başarıyla yüklendi!`);
      } else {
        // Fallback - Türk tarifleri
        setRecipes([{
          name: 'Kuru Fasulye',
          image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop',
          category: 'Ana Yemek',
          area: 'Türk',
          instructions: 'Geleneksel Türk mutfağının vazgeçilmez lezzeti!',
          sourceUrl: 'https://www.nefisyemektarifleri.com/',
        }]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Recipe fetch error:', error);
      // Fallback
      setRecipes([{
        name: 'Kuru Fasulye',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop',
        category: 'Ana Yemek',
        area: 'Türk',
        instructions: 'Geleneksel Türk mutfağının vazgeçilmez lezzeti!',
        sourceUrl: 'https://www.nefisyemektarifleri.com/',
      }]);
      setLoading(false);
    }
  };

  const nextRecipe = () => {
    console.log('🔄 Sonraki tarif');
    setDirection(1);
    setCurrentIndex((prev) => {
      const next = (prev + 1) % recipes.length;
      console.log(`Tarif ${prev + 1} → ${next + 1}`);
      return next;
    });
  };

  const prevRecipe = () => {
    console.log('🔄 Önceki tarif');
    setDirection(-1);
    setCurrentIndex((prev) => {
      const next = (prev - 1 + recipes.length) % recipes.length;
      console.log(`Tarif ${prev + 1} → ${next + 1}`);
      return next;
    });
  };

  const recipe = recipes[currentIndex];

  console.log('📊 Recipe state:', {
    recipesLength: recipes.length,
    currentIndex,
    hasRecipe: !!recipe,
    loading
  });

  if (loading) {
    return (
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="container text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
            <span className="text-xl font-semibold text-slate-700">15 Lezzetli Tarif Hazırlanıyor...</span>
          </div>
        </div>
      </section>
    );
  }

  if (!recipe) return null;

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🍳</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Bugün Ne Pişirelim?
            </h2>
            <span className="text-5xl">🥘</span>
          </div>
          <p className="text-xl text-slate-600">
            {recipes.length} lezzetli tarif arasından seçtik
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {recipes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-orange-600'
                    : 'w-2 bg-orange-300 hover:bg-orange-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto overflow-hidden group">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold shadow-lg">
                {recipe.category}
              </div>

              {/* Area Badge */}
              {recipe.area && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-slate-900 rounded-lg font-bold shadow-lg">
                  {recipe.area} Mutfağı
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                {recipe.name}
              </h3>

              <p className="text-slate-600 mb-6 line-clamp-4">
                {recipe.instructions}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {recipe.sourceUrl && (
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Tarifi Gör</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                )}

                {recipe.youtubeUrl && (
                  <a
                    href={recipe.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>Video</span>
                  </a>
                )}

                <button
                  onClick={nextRecipe}
                  className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Başka Tarif</span>
                </button>
              </div>
            </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevRecipe}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-900 transition-all hover:scale-110 z-20"
            aria-label="Önceki tarif"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextRecipe}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-slate-100 rounded-full shadow-xl flex items-center justify-center text-slate-900 transition-all hover:scale-110 z-20"
            aria-label="Sonraki tarif"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
