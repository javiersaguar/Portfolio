// Light and dark theme. The site follows the system until the nav switch pins one,
// which is remembered in localStorage. The inline script in Base.astro applies it
// before the first paint, so there is no flash.

import { prefersReducedMotion } from './game';

export type Theme = 'light' | 'dark';

const KEY = 'js-theme';
const systemLight = matchMedia('(prefers-color-scheme: light)');
const root = document.documentElement;

export function currentTheme(): Theme {
  const pinned = root.dataset.theme;
  if (pinned === 'light' || pinned === 'dark') return pinned;
  return systemLight.matches ? 'light' : 'dark';
}

function apply(theme: Theme): void {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode: it just won't be remembered.
  }
  syncThemeColor();
  document.dispatchEvent(new CustomEvent('theme', { detail: theme }));
}

// The browser bar follows the page background.
export function syncThemeColor(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = getComputedStyle(root).getPropertyValue('--bg').trim() || '#0c0d0b';
}

/**
 * Switch theme. With an origin point (the button), the new theme grows out of it
 * as a circle, using the View Transitions API where the browser has it.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }): void {
  const start = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } })
    .startViewTransition;
  if (!start || !origin || prefersReducedMotion()) {
    apply(theme);
    return;
  }
  const { x, y } = origin;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('vt-theme');
  const vt = start.call(document, () => apply(theme));
  vt.ready
    .then(() => {
      const anim = root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 520, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', pseudoElement: '::view-transition-new(root)' },
      );
      anim.finished.finally(() => root.classList.remove('vt-theme'));
    })
    .catch(() => root.classList.remove('vt-theme'));
}

export function toggleTheme(origin?: { x: number; y: number }): Theme {
  const next: Theme = currentTheme() === 'light' ? 'dark' : 'light';
  setTheme(next, origin);
  return next;
}

// If nothing is pinned, follow the system live.
systemLight.addEventListener('change', () => {
  if (!root.dataset.theme) {
    syncThemeColor();
    document.dispatchEvent(new CustomEvent('theme', { detail: currentTheme() }));
  }
});
