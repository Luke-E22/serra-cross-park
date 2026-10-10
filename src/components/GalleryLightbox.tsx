import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Button, Gallery } from './ds';
import type { GalleryImage, ImgProps } from './ds';

/**
 * One photo of the mosaic, as plain data so the island's props serialize.
 * The page builds each one from picture() in src/lib/images.ts: `src` is the largest
 * generated candidate (the lightbox shows it), `srcSet` and `sizes` serve the thumbnail.
 */
export interface LightboxImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  layout: 'normal' | 'wide' | 'tall';
  /** CSS object-position for the thumbnail crop, for example "50% 30%". */
  position?: string;
}

export interface GalleryLightboxProps {
  images: LightboxImage[];
  /** Names the group for the dialog's accessible name, for example "Weddings and events". */
  label: string;
  rowHeight?: number;
}

/**
 * The gallery page's lightbox: the unchanged Gallery component with a native <dialog> after it.
 *
 * Accessibility choice: Gallery renders a plain <img> per cell and has no click hook, so each
 * photo becomes the control through the component's `imgProps` spread: role "button", tabIndex 0,
 * aria-haspopup "dialog", an aria-label "Open: <caption>", and Enter, Space or a click opens the
 * dialog. The button attributes are added only after hydration, so before JavaScript runs the
 * photos stay plain images rather than buttons that do nothing.
 *
 * The dialog shows the full photo with its caption, Previous and Next (ArrowLeft and ArrowRight
 * as well), Close, and Escape through the dialog's own cancel. Body scroll is locked while it is
 * open, and focus returns to the thumbnail that opened it.
 */
export default function GalleryLightbox({ images, label, rowHeight }: GalleryLightboxProps) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const bodyOverflow = useRef('');
  const captionId = useId();

  useEffect(() => {
    setReady(true);
  }, []);

  const count = images.length;
  const current = images[index];

  const openAt = useCallback((i: number, opener: HTMLElement) => {
    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== 'function' || dialog.open) return;
    openerRef.current = opener;
    setIndex(i);
    setOpen(true);
    bodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    // Start on the content, not on a button, so Enter does nothing until the visitor picks a control.
    innerRef.current?.focus();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Fires for the Close button and for Escape alike (the dialog's own close event).
  const handleClose = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = bodyOverflow.current;
    const opener = openerRef.current;
    openerRef.current = null;
    opener?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  const onDialogKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  // A click on the dialog's own navy margin, outside the content, closes it.
  const onDialogClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close();
  };

  // Warm the neighbours so Previous and Next feel immediate.
  useEffect(() => {
    if (!open || count === 0) return;
    for (const delta of [1, -1]) {
      const neighbour = images[(index + delta + count) % count];
      if (neighbour && neighbour.src !== current?.src) {
        const img = new Image();
        img.src = neighbour.src;
      }
    }
  }, [open, index, count, images, current]);

  const items: GalleryImage[] = images.map((im, i) => {
    const base: ImgProps = {
      srcSet: im.srcSet,
      sizes: im.sizes,
      width: im.width,
      height: im.height,
      loading: 'lazy',
      decoding: 'async',
    };
    if (im.position) base.style = { objectPosition: im.position };
    const control: ImgProps = ready
      ? {
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog',
          'aria-label': `Open: ${im.caption}`,
          onClick: (e: MouseEvent<HTMLImageElement>) => openAt(i, e.currentTarget),
          onKeyDown: (e: KeyboardEvent<HTMLImageElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openAt(i, e.currentTarget);
            }
          },
        }
      : {};
    return { src: im.src, alt: im.alt, caption: im.caption, layout: im.layout, imgProps: { ...base, ...control } };
  });

  return (
    <>
      <Gallery images={items} rowHeight={rowHeight} />
      <dialog
        ref={dialogRef}
        className="gallery-lightbox"
        aria-label={`Photo viewer: ${label}`}
        onClose={handleClose}
        onKeyDown={onDialogKeyDown}
        onClick={onDialogClick}
      >
        <div ref={innerRef} className="gallery-lightbox__inner" tabIndex={-1}>
          <div className="gallery-lightbox__top">
            <p className="gallery-lightbox__count label" aria-hidden="true">
              {count === 0 ? '' : `${index + 1} of ${count}`}
            </p>
            <Button variant="secondary" onDark icon="x" className="gallery-lightbox__close" onClick={close}>
              Close
            </Button>
          </div>

          <figure className="gallery-lightbox__figure">
            {open && current && (
              <img
                className="gallery-lightbox__img"
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                decoding="async"
              />
            )}
            <figcaption id={captionId} className="gallery-lightbox__caption body">
              {current?.caption ?? ''}
            </figcaption>
          </figure>

          <div className="gallery-lightbox__nav">
            <Button
              variant="secondary"
              onDark
              icon="arrow-right"
              iconPosition="start"
              className="gallery-lightbox__prev"
              onClick={() => step(-1)}
            >
              Previous
            </Button>
            <Button variant="secondary" onDark icon="arrow-right" className="gallery-lightbox__next" onClick={() => step(1)}>
              Next
            </Button>
          </div>

          <p className="sc-visually-hidden" aria-live="polite">
            {open && current ? `Photo ${index + 1} of ${count}: ${current.caption}` : ''}
          </p>
        </div>
      </dialog>
    </>
  );
}
