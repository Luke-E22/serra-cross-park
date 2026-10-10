import { SiteHeader } from './ds';
import { NAV } from '../config/site';

export interface SiteHeaderIslandProps {
  /** The header link to mark as current, by label. */
  active?: string;
}

/**
 * The site header on pages without a hero. BaseLayout hydrates it with
 * client:media="(max-width: 1099px)", because the only interactive part is the
 * menu toggle that SiteHeader shows below 1100px. Above that it stays static HTML.
 */
export default function SiteHeaderIsland({ active }: SiteHeaderIslandProps) {
  return (
    <SiteHeader
      links={NAV}
      active={active}
      homeHref="/"
      donateHref="/donate/"
      bookHref="/booking/"
      bookLabel="Plan your event"
    />
  );
}
