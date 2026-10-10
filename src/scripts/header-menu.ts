/**
 * The site header's menu toggle, without React.
 *
 * SiteHeader (src/components/ds) renders statically everywhere; its only interactive part is
 * the menu button shown under 1100px. Hydrating the whole header (or the hero that carries it)
 * cost every page the React runtime for one toggle. This script reproduces what the component's
 * state does: the `is-open` class on the header, `hidden` on the menu, `aria-expanded` on the
 * button, the menu/x icon swap with its label, and the wordmark's tone on overlay headers.
 * Escape closes the menu and returns focus to the button.
 */
const MENU_ICON = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
const CLOSE_ICON = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';

function wire(header: HTMLElement) {
  const toggle = header.querySelector<HTMLButtonElement>('.sc-header__toggle');
  if (!toggle || toggle.dataset.wired) return;
  toggle.dataset.wired = 'true';
  const menuId = toggle.getAttribute('aria-controls');
  const menu = menuId ? document.getElementById(menuId) : null;
  const svg = toggle.querySelector('svg');
  const wordmark = header.querySelector('.sc-wordmark');
  const overlay = header.classList.contains('sc-header--overlay');
  let open = false;

  const render = () => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (menu) menu.hidden = !open;
    if (svg) {
      svg.innerHTML = open ? CLOSE_ICON : MENU_ICON;
      svg.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (overlay && wordmark) wordmark.classList.toggle('sc-wordmark--paper', !open);
  };

  toggle.addEventListener('click', () => {
    open = !open;
    render();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      open = false;
      render();
      toggle.focus();
    }
  });
}

document.querySelectorAll<HTMLElement>('.sc-header').forEach(wire);
