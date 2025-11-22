export const site = {
  name: 'Kısa Haber',
  url: 'https://kisahaber.com',
  twitter: '@kisahaber'
};


export function buildOG({ title, description, image = '/og-image.jpg', url = site.url }) {
  return [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: site.twitter }],
  ];
}


export function newsArticleJsonLd({ headline, image, datePublished, dateModified, author }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline,
    image: [image],
    datePublished,
    dateModified,
    author: [{ '@type': 'Person', name: author }],
    publisher: { '@type': 'Organization', name: site.name },
  };
}
