/**
 * Vite plugin: drop the render-blocking Google Fonts @import at the top of
 * design-system/components/bundle.css at build time. The same family (EB Garamond) is
 * self-hosted through src/styles/fonts.css, so nothing is lost and nothing in
 * design-system/ is edited. Logged in DESIGN-SYSTEM-CHANGES.md.
 */
const IMPORT = /^\s*@import\s+url\(\s*["']?https:\/\/fonts\.googleapis\.com[^)]*\)\s*;\s*\n?/m;

export default function stripGoogleFontsPlugin() {
  return {
    name: 'serra-strip-google-fonts',
    enforce: 'pre',
    transform(code, id) {
      if (!id.replace(/\\/g, '/').includes('design-system/components/bundle.css')) return null;
      if (!IMPORT.test(code)) return null;
      return { code: code.replace(IMPORT, ''), map: null };
    },
  };
}
