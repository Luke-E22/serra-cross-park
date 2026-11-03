// Dev-server bridge for the availability functions.
//
// `npm run dev` has no Netlify runtime, so this Vite plugin serves the two availability routes
// by loading their functions through Vite's SSR loader and handing each a web Request:
//   /api/availability        netlify/functions/availability.mts (the month grid)
//   /api/availability/times  netlify/functions/availability-times.mts (one day's start times)
// Each route matches its exact pathname, with or without one trailing slash, so the month route
// never answers for /api/availability/times. Nothing here runs in production; Netlify serves the
// functions there. Added to astro.config.mjs as vite.plugins. Try it with
//   curl "http://localhost:4321/api/availability?fixture=1"
//   curl "http://localhost:4321/api/availability/times?date=2026-11-07&minutes=180&fixture=1"
//
// Why the handler is unshifted in a post hook rather than added with middlewares.use():
// Astro's dev server unshifts its own guards (trailing slash, route guard, Sec-Fetch) to the
// front of the connect stack in its post hook, and with trailingSlash "always" the trailing
// slash guard answers 404 for /api/availability before any ordinary middleware runs. User
// plugins come after Astro's, so a post hook here runs later and our unshift lands first.

/** Request pathname to the function module that answers it. @type {Map<string, string>} */
const ROUTES = new Map([
  ['/api/availability', '/netlify/functions/availability.mts'],
  ['/api/availability/times', '/netlify/functions/availability-times.mts'],
]);

/**
 * The part of Netlify's request context the functions read: the deploy context, "dev" as
 * `netlify dev` sets it, so ?fixture=1 works here and never on production.
 */
const DEV_CONTEXT = Object.freeze({ deploy: Object.freeze({ context: 'dev', id: 'astro-dev', published: false }) });

/**
 * The function module for a request pathname, or undefined when no route matches.
 * @param {string} pathname
 * @returns {string | undefined}
 */
function moduleFor(pathname) {
  const path = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return ROUTES.get(path);
}

/** @returns {import('vite').Plugin} */
export default function devAvailabilityPlugin() {
  return {
    name: 'serra-dev-availability',
    /** @param {import('vite').ViteDevServer} server */
    configureServer(server) {
      /** @type {import('vite').Connect.NextHandleFunction} */
      const handle = async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const modulePath = moduleFor(url.pathname);
        if (!modulePath) return next();
        try {
          const mod = await server.ssrLoadModule(modulePath);
          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) {
            if (Array.isArray(value)) value.forEach((v) => headers.append(name, v));
            else if (value != null) headers.set(name, value);
          }
          const request = new Request(url, { method: req.method ?? 'GET', headers });
          const response = await mod.default(request, DEV_CONTEXT);
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
