import type { APIRoute } from 'astro';

const SITE_URL = 'https://freeaipromptgen.com';

const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/examples', changefreq: 'monthly', priority: 0.8 },
  { url: '/score', changefreq: 'monthly', priority: 0.8 },
  { url: '/templates', changefreq: 'monthly', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
];

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
