import { fireLaser, IMPACT_DELAY, SHOT_DURATION } from './shot-effects';
import { prefersReducedMotion } from './game';

let active: HTMLElement | null = null;
let impactTimer: ReturnType<typeof setTimeout> | undefined;
let navigationTimer: ReturnType<typeof setTimeout> | undefined;
const reset = () => {
  clearTimeout(impactTimer); clearTimeout(navigationTimer);
  if (active) { active.style.opacity = ''; active.style.transform = ''; active.removeAttribute('aria-disabled'); }
  active = null;
  document.querySelector('[data-section-laser]')?.replaceChildren();
};
for (const event of ['portfolio-section', 'portfolio-view']) document.addEventListener(event, reset);
for (const event of ['popstate', 'hashchange', 'pagehide']) addEventListener(event, reset);

/** El mismo impacto confirma tanto el avance como la vuelta al arcade. */
export function laserNavigate(button: HTMLElement, navigate: () => void): void {
  if (active) return;
  if (prefersReducedMotion()) { navigate(); return; }
  const layer = document.querySelector<HTMLElement>('[data-section-laser]');
  if (!layer) { navigate(); return; }
  active = button; button.setAttribute('aria-disabled', 'true');
  const bounds = button.getBoundingClientRect();
  const point = { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
  const impact = fireLaser(layer, { x: point.x < innerWidth / 2 ? innerWidth : 0, y: Math.max(0, point.y - 100) }, point);
  impactTimer = setTimeout(() => { button.style.opacity = '0'; button.style.transform = 'scale(.96)'; impact(); }, IMPACT_DELAY);
  navigationTimer = setTimeout(() => { reset(); navigate(); }, SHOT_DURATION);
}
