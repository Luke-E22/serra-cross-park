import type { HeroProps } from './ds';
import { Button, Hero, SiteHeader } from './ds';
import { NAV } from '../config/site';

export interface HeroAction {
  label: string;
  href: string;
}

export type PageHeroProps = Omit<HeroProps, 'header' | 'actions'> & {
  /** The header link to mark as current, by label. */
  active?: string;
  /**
   * Buttons as plain data, because island props must serialize.
   * `primary` is the page's one primary button; `secondary` is optional.
   */
  actions?: { primary?: HeroAction; secondary?: HeroAction };
};

/**
 * A Hero that carries the overlay SiteHeader. Pages render it with
 * client:media="(max-width: 1100px)" so the header's menu toggle works on small
 * screens while the hero stays static HTML on desktop. The query matches bundle.css,
 * which shows the toggle at max-width: 1100px; a narrower query left the toggle
 * visible but inert at exactly 1100px and at fractional widths under browser zoom.
 */
export default function PageHero({ active, actions, ...hero }: PageHeroProps) {
  const header = (
    <SiteHeader
      overlay
      links={NAV}
      active={active}
      homeHref="/"
      donateHref="/donate/"
      bookHref="/booking/"
      bookLabel="Plan your event"
    />
  );

  const buttons =
    actions && (actions.primary || actions.secondary) ? (
      <>
        {actions.primary && (
          <Button variant="primary" size="lg" onDark icon="arrow-right" href={actions.primary.href}>
            {actions.primary.label}
          </Button>
        )}
        {actions.secondary && (
          <Button variant="secondary" size="lg" onDark href={actions.secondary.href}>
            {actions.secondary.label}
          </Button>
        )}
      </>
    ) : undefined;

  return <Hero {...hero} header={header} actions={buttons} />;
}
