/**
 * ========================================
 * SEO COMPONENT - META TAGS & STRUCTURED DATA
 * ========================================
 * Kısa Haber - Türkiye'nin En Güncel Haber Portalı
 * Google, Facebook, Twitter, LinkedIn optimize
 */

import { useEffect } from 'react';

export default function SEO({
  title = 'Kısa Haber - Türkiye\'nin En Güncel Haber Portalı',
  description = 'Son dakika haberleri, güncel gelişmeler, ekonomi, spor, teknoloji ve dünya haberleri. Kısa ve öz haberler için Türkiye\'nin en hızlı haber sitesi.',
  keywords = 'kısa haber, son dakika, güncel haberler, türkiye haberleri, haber sitesi, ekonomi haberleri, spor haberleri, dünya haberleri, teknoloji haberleri',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : 'https://kisahaber.com',
  type = 'website',
  author = 'Kısa Haber',
  publishedTime,
  modifiedTime,
}) {
  useEffect(() => {
    document.title = title;

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    updateMeta('author', author);

    // Open Graph (Facebook, LinkedIn)
    updateMeta('og:title', title, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:url', url, 'property');
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', 'Kısa Haber', 'property');
    updateMeta('og:locale', 'tr_TR', 'property');

    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:site', '@kisahaber');
    updateMeta('twitter:creator', '@kisahaber');

    // Article meta (haber detay sayfaları için)
    if (type === 'article' && publishedTime) {
      updateMeta('article:published_time', publishedTime, 'property');
      updateMeta('article:modified_time', modifiedTime || publishedTime, 'property');
      updateMeta('article:author', author, 'property');
      updateMeta('article:section', 'Haberler', 'property');
    }

    updateLink('canonical', url);
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);

  return null;
}

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
 * Structured Data Component - JSON-LD for Google Rich Results
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
        '@type': 'NewsMediaOrganization',
        name: 'Kısa Haber',
        url: 'https://kisahaber.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://kisahaber.com/logo.png',
          width: 600,
          height: 60,
        },
        description: 'Türkiye\'nin en güncel ve güvenilir haber portalı. Son dakika haberleri, ekonomi, spor, teknoloji ve dünya haberleri.',
        foundingDate: '2025',
        sameAs: [
          'https://twitter.com/kisahaber',
          'https://facebook.com/kisahaber',
          'https://instagram.com/kisahaber',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          email: 'info@kisahaber.com',
          availableLanguage: 'Turkish',
        },
      };
    } else if (type === 'newsarticle') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url || 'https://kisahaber.com',
        },
        headline: data.title,
        description: data.summary,
        image: {
          '@type': 'ImageObject',
          url: data.image,
          width: 1200,
          height: 630,
        },
        datePublished: data.publishedAt,
        dateModified: data.publishedAt,
        author: {
          '@type': 'Person',
          name: data.author || 'Kısa Haber',
        },
        publisher: {
          '@type': 'NewsMediaOrganization',
          name: 'Kısa Haber',
          logo: {
            '@type': 'ImageObject',
            url: 'https://kisahaber.com/logo.png',
            width: 600,
            height: 60,
          },
        },
        isAccessibleForFree: true,
      };
    } else if (type === 'website') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Kısa Haber',
        alternateName: 'Kisa Haber',
        url: 'https://kisahaber.com',
        description: 'Türkiye\'nin en güncel haber portalı',
        inLanguage: 'tr-TR',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://kisahaber.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      };
    }

    script.textContent = JSON.stringify(structuredData);

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
