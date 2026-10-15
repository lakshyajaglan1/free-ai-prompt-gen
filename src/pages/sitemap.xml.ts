import type { APIRoute } from 'astro';
import { STARTER_TEMPLATES } from '../data/templates';
import { FRAMEWORK_PAGES } from '../data/frameworksData';
import { MODEL_PAGES } from '../data/modelsData';

const SITE_URL = 'https://freeaipromptgen.com';

const staticPages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/examples', changefreq: 'monthly', priority: 0.8 },
  { url: '/score', changefreq: 'monthly', priority: 0.8 },
  { url: '/scorer', changefreq: 'monthly', priority: 0.8 },
  { url: '/templates', changefreq: 'daily', priority: 0.9 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
];

export const GET: APIRoute = async () => {
  const lastmod = new Date().toISOString().split('T')[0];

  const templatePages = STARTER_TEMPLATES.map((t) => ({
    url: `/templates/${t.slug}`,
    changefreq: 'weekly',
    priority: 0.7,
  }));

  const frameworkPages = FRAMEWORK_PAGES.map((f) => ({
    url: `/frameworks/${f.slug}`,
    changefreq: 'weekly',
    priority: 0.85,
  }));

  const modelPages = MODEL_PAGES.map((m) => ({
    url: `/models/${m.slug}`,
    changefreq: 'weekly',
    priority: 0.85,
  }));

  const allPages = [...staticPages, ...frameworkPages, ...modelPages, ...templatePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
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
