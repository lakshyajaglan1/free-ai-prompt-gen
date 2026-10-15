// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://freeaipromptgen.com',
  trailingSlash: 'never',
  redirects: {
    '/scorer': '/score'
  },
  integrations: [
    sitemap({
      customPages: ['https://freeaipromptgen.com/scorer'],
      filter: (page) =>
        !page.endsWith('/404') &&
        !page.endsWith('/404/') &&
        !page.endsWith('/500') &&
        !page.endsWith('/500/'),
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});