import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rafail-drakakis.github.io',
  base: '/',
  output: 'static',
  integrations: [
    tailwind(),
    sitemap({
      customPages: ['https://rafail-drakakis.github.io/'],
    }),
  ],
});
