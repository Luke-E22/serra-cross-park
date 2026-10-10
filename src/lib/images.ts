/**
 * Responsive photos for the design-system components.
 *
 * Every photo on the site goes through `picture()`. It returns a fallback `src` plus the
 * attributes the ported components spread onto their <img> (`imgProps`), so each photo
 * carries a WebP srcset, a sizes attribute and explicit dimensions, and nothing shifts
 * while it loads.
 *
 * WebP only, for now: a single <img> cannot offer AVIF and WebP at the same time. That
 * needs a <picture> with two <source> elements, and the components render a plain <img>.
 * Revisit if a component ever grows a <picture>.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

export interface PictureOptions {
  /** Candidate widths for the srcset. Astro drops widths above the source and adds the source width back. */
  widths: number[];
  /** The sizes attribute, for example "(min-width: 1200px) 376px, 50vw". */
  sizes: string;
  /** What is in the frame. Returned as `alt` for the page to hand to the component's own alt prop. */
  alt?: string;
  /** True for the one above-the-fold photo on a page (the hero): eager, high fetch priority. */
  priority?: boolean;
  /** CSS object-position for components that crop the photo (FeatureCard at 4:3, Gallery cells). */
  position?: string;
}

export interface PictureImgProps {
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  loading: 'eager' | 'lazy';
  decoding: 'async' | 'sync' | 'auto';
  /**
   * Lowercase on purpose. React 18.3 does not know the camelCase `fetchPriority` prop: it
   * warns and asks for the lowercase attribute, which it passes through to the DOM as is.
   */
  fetchpriority?: 'high' | 'low' | 'auto';
  style?: { objectPosition: string };
}

export interface Picture {
  /** Fallback URL at the largest generated width. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Spread onto the <img> through the component's `imgProps` prop. */
  imgProps: PictureImgProps;
}

/** WebP quality for photos. 75 keeps park photos clean and cuts about a third off the default. */
const WEBP_QUALITY = 75;

export async function picture(src: ImageMetadata, opts: PictureOptions): Promise<Picture> {
  // An imported image is a Proxy: reading any field but `clone` or `fsPath` marks the original
  // as referenced, and the build then copies the untouched JPEG into dist. Measure a clone instead.
  const meta = (src as ImageMetadata & { clone?: ImageMetadata }).clone ?? src;
  const widths = [...new Set(opts.widths.filter((w) => Number.isFinite(w) && w > 0))].sort((a, b) => a - b);
  const largest = Math.min(widths[widths.length - 1] ?? meta.width, meta.width);

  // `width` pins the fallback src to the largest candidate, so the original is never served as is.
  const image = await getImage({ src, format: 'webp', widths, width: largest, sizes: opts.sizes, quality: WEBP_QUALITY });

  // Dimensions come from the largest generated candidate, then the transform, then the source,
  // so the browser can reserve the box before any bytes arrive.
  const candidates = image.srcSet.values;
  let best: (typeof candidates)[number] | undefined;
  for (const candidate of candidates) {
    if (!best || (candidate.transform.width ?? 0) > (best.transform.width ?? 0)) best = candidate;
  }
  const width = best?.transform.width ?? image.options.width ?? meta.width;
  const height = best?.transform.height ?? image.options.height ?? Math.round(width * (meta.height / meta.width));

  const imgProps: PictureImgProps = {
    srcSet: image.srcSet.attribute,
    sizes: opts.sizes,
    width,
    height,
    loading: opts.priority ? 'eager' : 'lazy',
    // Astro's own `priority` option decodes the LCP image synchronously so it paints in the same frame.
    decoding: opts.priority ? 'sync' : 'async',
  };
  if (opts.priority) imgProps.fetchpriority = 'high';
  if (opts.position) imgProps.style = { objectPosition: opts.position };

  return { src: image.src, alt: opts.alt ?? '', width, height, imgProps };
}

/**
 * A 1200 x 630 JPEG crop for Open Graph and Twitter cards. Returns a site-relative path;
 * BaseLayout turns it into an absolute URL. `position` is sharp's gravity, "centre" by default.
 */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export async function ogImage(src: ImageMetadata, position = 'centre'): Promise<string> {
  // Sharp never upscales: a smaller source gives a smaller JPEG and a broken card. Fail the build
  // instead, so the page picks a larger photo (sizes are listed in src/content/photos.ts).
  const meta = (src as ImageMetadata & { clone?: ImageMetadata }).clone ?? src;
  if (meta.width < OG_WIDTH || meta.height < OG_HEIGHT) {
    throw new Error(
      `ogImage: ${meta.src} is ${meta.width}x${meta.height}; an Open Graph card needs at least ${OG_WIDTH}x${OG_HEIGHT}.`,
    );
  }
  const image = await getImage({ src, width: OG_WIDTH, height: OG_HEIGHT, fit: 'cover', position, format: 'jpg', quality: 82 });
  return image.src;
}
