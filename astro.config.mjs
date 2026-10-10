// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import devAvailabilityPlugin from './scripts/dev-availability-plugin.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://serracrosspark.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // /booking/requested/ is noindex (Cal.com's success redirect), so it stays out of the sitemap.
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/booking/requested/') })],
  vite: { plugins: [devAvailabilityPlugin()] },
});
