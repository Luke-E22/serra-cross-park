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
 * A Hero that carries the overlay SiteHeader. Pages render it statically (no client
 * directive); the header's menu toggle is wired by src/scripts/header-menu.ts.
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
