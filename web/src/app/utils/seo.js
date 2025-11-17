export const site = {
    name: 'VİZYON NEXUS',
    url: 'https://vizyon-nexus.com',
    twitter: '@vizyonnexus'
    };
    
    
    export function buildOG({ title, description, image = '/og/default.jpg', url = site.url }) {
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