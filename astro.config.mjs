// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import devAvailabilityPlugin from './scripts/dev-availability-plugin.mjs';
import stripGoogleFontsPlugin from './scripts/strip-google-fonts-plugin.mjs';

// https://astro.build/config
// Vite keeps its pre-bundled dependencies in one cache for every command. A production build
// writes minified React there, and the next `astro dev` then hydrates islands against it and
// crashes ("_jsxDEV is not a function"). One cache directory per npm script keeps them apart.
const cacheDir = `node_modules/.vite-${process.env.npm_lifecycle_event ?? "default"}`;

export default defineConfig({
  site: 'https://serracrosspark.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Three noindex pages stay out of the sitemap: /booking/requested/ (Cal.com's success redirect),
  // /website-proposal/ (the board proposal) and /weddings-preview/ (a draft for the board), both private.
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/booking/requested/') && !page.includes('/website-proposal/') && !page.includes('/weddings-preview/'),
    }),
  ],
  vite: { cacheDir, plugins: [stripGoogleFontsPlugin(), devAvailabilityPlugin()] },
});
