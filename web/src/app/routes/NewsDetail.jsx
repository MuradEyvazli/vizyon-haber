import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Footer from '../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullContent, setFullContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [relatedNews, setRelatedNews] = useState([]);

  // Tam içeriği API'den çek
  const fetchFullContent = async (url) => {
    if (!url || url === '#') return;

    try {
      setContentLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/article`, {
        params: { url },
        timeout: 20000
      });

      if (response.data.success && response.data.content) {
        setFullContent(response.data.content);
      }
    } catch (error) {
      console.error('İçerik çekme hatası:', error.message);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    // localStorage'dan haberi bul
    const savedArticle = localStorage.getItem(`article-${slug}`);

    if (savedArticle) {
      const data = JSON.parse(savedArticle);
      setArticle(data);

      // Tam içeriği çek (orijinal kaynaktan)
      if (data.url && data.url !== '#') {
        fetchFullContent(data.url);
      }

      // İlgili haberleri getir
      const allArticles = JSON.parse(localStorage.getItem('allArticles') || '[]');
      const related = allArticles
        .filter(a => a.category === data.category && a.slug !== slug)
        .slice(0, 3);
      setRelatedNews(related);
    }

    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xl font-semibold text-slate-700">Haber Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Haber Bulunamadı</h1>
          <p className="text-slate-600 mb-8">Aradığınız haber bulunamadı veya kaldırılmış olabilir.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Geri Butonu */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Geri Dön</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Kategori Badge */}
        <div className="absolute top-8 left-8">
          <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">
            {article.category}
          </span>
        </div>
      </div>

      {/* İçerik */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
          >
            {/* Başlık */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Bilgiler */}
            <div className="flex flex-wrap items-center gap-4 pb-6 mb-6 border-b border-slate-200">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">
                  {new Date(article.publishedAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {article.author && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">{article.author}</span>
                </div>
              )}

              {article.source && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="text-sm font-medium">{article.source}</span>
                </div>
              )}
            </div>

            {/* Özet */}
            <div className="mb-8 p-6 bg-blue-50 rounded-2xl border-l-4 border-blue-600">
              <p className="text-lg text-slate-700 font-medium leading-relaxed">
                {article.summary}
              </p>
            </div>

            {/* İçerik - Tam Haber */}
            <div className="prose prose-lg prose-slate max-w-none mb-8">
              {contentLoading ? (
                // Yükleniyor animasyonu
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-600 font-medium">Haberin tam içeriği yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Tam içerik varsa göster */}
                  {fullContent ? (
                    <>
                      {fullContent.split('\n\n').map((paragraph, idx) => (
                        <p
                          key={idx}
                          className={`text-slate-700 leading-relaxed mb-6 ${
                            idx === 0 ? 'text-xl font-medium text-slate-900' : 'text-lg'
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </>
                  ) : (
                    // Fallback - API içeriği
                    <>
                      {(() => {
                        let fallbackText = article.summary || '';

                        if (article.content && article.content !== article.summary) {
                          const cleanContent = article.content
                            .replace(/\[\+\d+\s*chars?\]/gi, '')
                            .replace(/…$/, '')
                            .trim();
                          if (cleanContent) {
                            fallbackText += '\n\n' + cleanContent;
                          }
                        }

                        const paragraphs = fallbackText
                          .split(/\n\n+/)
                          .map(p => p.trim())
                          .filter(p => p.length > 15);

                        return paragraphs.map((paragraph, idx) => (
                          <p
                            key={idx}
                            className={`text-slate-700 leading-relaxed mb-6 ${
                              idx === 0 ? 'text-xl font-medium text-slate-900' : 'text-lg'
                            }`}
                          >
                            {paragraph}
                          </p>
                        ));
                      })()}
                    </>
                  )}

                  {/* Kaynak linki - Tam haberi oku butonu */}
                  {article.url && article.url !== '#' && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-slate-700 font-medium">
                            Haberin devamını kaynak sitede okuyabilirsiniz.
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            Kaynak: {article.source || 'Orijinal Kaynak'}
                          </p>
                        </div>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                        >
                          <span>Kaynağa Git</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Kaynak Bilgisi - Link olarak değil, sadece bilgi */}
            {article.source && (
              <div className="pt-6 mt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="font-medium">Kaynak: {article.source}</span>
                </div>
              </div>
            )}
          </motion.article>

          {/* İlgili Haberler */}
          {relatedNews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">İlgili Haberler</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <Link
                    key={news.slug}
                    to={`/news/${news.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {news.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {news.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
