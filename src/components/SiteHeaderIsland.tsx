import { SiteHeader } from './ds';
import { NAV } from '../config/site';

export interface SiteHeaderIslandProps {
  /** The header link to mark as current, by label. */
  active?: string;
}

/**
 * The site header on pages without a hero. Rendered statically by BaseLayout; the menu
 * toggle under 1100px is wired by src/scripts/header-menu.ts, so no React ships for it.
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
