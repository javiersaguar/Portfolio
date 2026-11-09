const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const groups: Record<string, string> = {
  experience: '.career-date, .career-copy',
  education: '.degree-meta, .degree h3, .degree-description, .subjects li, .languages dl > div',
  skills: '.people-skill dt, .people-skill dd',
  about: '.sheet-id, .stats > div, .inv > li, .move',
};
const elements = Object.entries(groups).flatMap(([id, selector]) => [...document.querySelectorAll<HTMLElement>(`#${id} ${selector.split(', ').join(`, #${id} `)}`)]);
const seen = new Set<HTMLElement>();
const running = new Map<HTMLElement, Animation>();
const ease = getComputedStyle(document.documentElement).getPropertyValue('--ease').trim();
const play = (element: HTMLElement) => {
  if (reducedMotion.matches || document.hidden || seen.has(element)) return;
  const rect = element.getBoundingClientRect();
  if (!rect.width || rect.bottom <= 0 || rect.top >= innerHeight) return;
  seen.add(element);
  const section = element.closest('section')!;
  const siblings = elements.filter(item => item.closest('section') === section);
  const index = siblings.indexOf(element);
  // Las fechas entran desde su eje; el contenido aparece en el orden de lectura.
  const from = element.classList.contains('career-date') ? 'translateX(-12px)' : 'translateY(12px)';
  const animation = element.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: 320, delay: index % 6 * 45, easing: ease });
  running.set(element, animation);
  void animation.finished.then(() => running.delete(element), () => running.delete(element));
};
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) play(entry.target as HTMLElement); }), { threshold: .12 });
elements.forEach(element => observer.observe(element));
const cancel = () => { running.forEach(animation => animation.cancel()); running.clear(); };
const enter = () => {
  cancel(); seen.clear();
  requestAnimationFrame(() => elements.forEach(play));
};
document.addEventListener('portfolio-section', enter);
document.addEventListener('portfolio-view', () => {
  if (document.documentElement.dataset.view === 'arcade') cancel(); else enter();
});
document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
reducedMotion.addEventListener('change', () => { cancel(); if (!reducedMotion.matches) enter(); });
addEventListener('pagehide', cancel);
requestAnimationFrame(() => elements.forEach(play));
