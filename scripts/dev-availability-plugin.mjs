// Dev-server bridge for the availability function.
//
// `npm run dev` has no Netlify runtime, so this Vite plugin serves /api/availability by
// loading netlify/functions/availability.mts through Vite's SSR loader and handing it a
// web Request. Nothing here runs in production; Netlify serves the function there.
// Added to astro.config.mjs as vite.plugins. Try it with
//   curl "http://localhost:4321/api/availability?fixture=1"
//
// Why the handler is unshifted in a post hook rather than added with middlewares.use():
// Astro's dev server unshifts its own guards (trailing slash, route guard, Sec-Fetch) to the
// front of the connect stack in its post hook, and with trailingSlash "always" the trailing
// slash guard answers 404 for /api/availability before any ordinary middleware runs. User
// plugins come after Astro's, so a post hook here runs later and our unshift lands first.

const ROUTE = '/api/availability';

/** @returns {import('vite').Plugin} */
export default function devAvailabilityPlugin() {
  return {
    name: 'serra-dev-availability',
    /** @param {import('vite').ViteDevServer} server */
    configureServer(server) {
      /** @type {import('vite').Connect.NextHandleFunction} */
      const handle = async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        if (url.pathname !== ROUTE && url.pathname !== `${ROUTE}/`) return next();
        try {
          const mod = await server.ssrLoadModule('/netlify/functions/availability.mts');
          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) value.forEach((v) => headers.append(name, v));
            else if (value != null) headers.set(name, value);
          }
          const request = new Request(url, { method: req.method ?? 'GET', headers });
          const response = await mod.default(request, {});
          res.statusCode = response.status;
          response.headers.forEach((value, name) => res.setHeader(name, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (err) {
          next(err);
        }
      };
      return () => {
        server.middlewares.stack.unshift({ route: '', handle });
      };
    },
  };
}
