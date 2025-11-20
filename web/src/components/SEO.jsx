/**
 * ========================================
 * SEO COMPONENT - META TAGS & STRUCTURED DATA
 * ========================================
 * Dependency yok, pure React 19
 * Google, Facebook, Twitter, LinkedIn optimize
 */

import { useEffect } from 'react';

export default function SEO({
  title = 'VİZYON NEXUS - Güncel Haber Portalı',
  description = 'Türkiye ve dünyadan son dakika haberleri, ekonomi, spor, teknoloji ve daha fazlası. Güvenilir haber kaynağınız.',
  keywords = 'haber, güncel haberler, son dakika, Türkiye haberleri, dünya haberleri, ekonomi, spor, teknoloji',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : 'https://vizyon-nexus.netlify.app',
  type = 'website',
  author = 'VİZYON NEXUS',
  publishedTime,
  modifiedTime,
}) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta tags
    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', author);

    // Open Graph (Facebook, LinkedIn)
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', 'VİZYON NEXUS', 'property');
    updateMeta('og:locale', 'tr_TR', 'property');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@vizyonnexus');
    updateMeta('twitter:creator', '@vizyonnexus');

    // Article meta (haber detay sayfaları için)
    if (type === 'article' && publishedTime) {
      updateMeta('article:published_time', publishedTime, 'property');
      updateMeta('article:modified_time', modifiedTime || publishedTime, 'property');
      updateMeta('article:author', author, 'property');
      updateMeta('article:section', 'Haberler', 'property');
    }

    // Canonical URL
    updateLink('canonical', url);
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);

  return null; // Bu component render etmez, sadece head'i günceller
}

// Helper: Meta tag güncelle
function updateMeta(name, content, type = 'name') {
  if (!content) return;

  let element = document.querySelector(`meta[${type}="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(type, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

// Helper: Link tag güncelle
function updateLink(rel, href) {
  if (!href) return;

  let element = document.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

/**
 * Structured Data Component - JSON-LD
 */
export function StructuredData({ type, data }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${type}`;

    let structuredData = {};

    if (type === 'organization') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'VİZYON NEXUS',
        url: 'https://vizyon-nexus.netlify.app',
        logo: 'https://vizyon-nexus.netlify.app/nexsus-logo.png',
        description: 'Türkiye\'nin güvenilir haber portalı',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'info@vizyon-nexus.com',
        },
        sameAs: [
          'https://twitter.com/vizyonnexus',
          'https://facebook.com/vizyonnexus',
        ],
      };
    } else if (type === 'newsarticle') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: data.title,
        description: data.summary,
        image: data.image,
        datePublished: data.publishedAt,
        dateModified: data.publishedAt,
        author: {
          '@type': 'Person',
          name: data.author || 'VİZYON NEXUS',
        },
        publisher: {
          '@type': 'Organization',
          name: 'VİZYON NEXUS',
          logo: {
            '@type': 'ImageObject',
            url: 'https://vizyon-nexus.netlify.app/nexsus-logo.png',
          },
        },
      };
    } else if (type === 'website') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'VİZYON NEXUS',
        url: 'https://vizyon-nexus.netlify.app',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://vizyon-nexus.netlify.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      };
    }

    script.textContent = JSON.stringify(structuredData);

    // Eski script'i kaldır
    const oldScript = document.getElementById(script.id);
    if (oldScript) {
      oldScript.remove();
    }

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [type, data]);

  return null;
}
