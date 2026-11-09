import { prefersReducedMotion } from './game';
import type { arcadeCopy } from '../data/arcade-copy';
import { showSection } from './section-view';
import type { Aliens3D } from './aliens3d';
import { fireLaser, IMPACT_DELAY, SHOT_DURATION } from './shot-effects';
import { laserNavigate } from './navigation-laser';

const root = document.documentElement;
const arcade = document.querySelector<HTMLElement>('[data-arcade]')!;
const copy = JSON.parse(arcade.dataset.copy!) as ReturnType<typeof arcadeCopy>;
const stage = arcade.querySelector<HTMLElement>('[data-stage]')!;
const targets = [...arcade.querySelectorAll<HTMLAnchorElement>('[data-target]')];
const turret = arcade.querySelector<HTMLElement>('[data-turret]')!;
const recoil = arcade.querySelector<HTMLElement>('[data-recoil]')!;
const pivot = arcade.querySelector<HTMLElement>('[data-pivot]')!;
const muzzle = arcade.querySelector<HTMLElement>('[data-muzzle]')!;
const cannonContainer = arcade.querySelector<HTMLElement>('[data-cannon]')!;
type Cannon3D = NonNullable<ReturnType<typeof import('./cannon3d').createCannon3D>>;
let cannon3d: Cannon3D | null = null;
let cannonLoading: Promise<void> | null = null;
let cannonUnavailable = false;
let lastAim: { x: number; y: number } | null = null;
let aliens3d: Aliens3D | null = null;
let aliensLoading: Promise<void> | null = null;
let aliensUnavailable = false;
const visibleCannon = () => cannonContainer.dataset.cannonRenderer === 'webgl' ? cannon3d : null;
const crosshair = arcade.querySelector<HTMLElement>('[data-crosshair]')!;
const effects = arcade.querySelector<HTMLElement>('[data-effects]')!;
const kicker = arcade.querySelector<HTMLElement>('[data-readout-kicker]')!;
const readoutName = arcade.querySelector<HTMLElement>('[data-readout-name]')!;
const readoutDetail = arcade.querySelector<HTMLElement>('[data-readout-detail]')!;
const soundButton = arcade.querySelector<HTMLButtonElement>('[data-sound]')!;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let active: HTMLAnchorElement | null = null;
let armedTouch: HTMLAnchorElement | null = null;
let targetAngle = 0;
let angle = 0;
let frame = 0;
let shooting = false;
let transitionTimer: ReturnType<typeof setTimeout> | undefined;
let impactTimer: ReturnType<typeof setTimeout> | undefined;
const movementKeys = new Set<string>();
let movementFrame = 0;
let movementTime = 0;
const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0], ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1] };
const stopMovement = () => {
  movementKeys.clear();
  if (movementFrame) cancelAnimationFrame(movementFrame);
  movementFrame = 0;
  movementTime = 0;
};
let audioContext: AudioContext | undefined;
let sound = false;
try { sound = localStorage.getItem('js-arcade-sound') === 'on'; } catch { /* El sonido es opcional. */ }

const center = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

// La geometría y WebGL se cargan solo al mostrar el menú.
const loadCannon = () => {
  if (cannon3d || cannonLoading || cannonUnavailable) return;
  cannonLoading = import('./cannon3d').then(({ createCannon3D }) => {
    if (root.dataset.view !== 'arcade' || document.hidden) return;
    cannon3d = createCannon3D(cannonContainer);
    if (!cannon3d) { cannonUnavailable = true; cannonContainer.dataset.cannonRenderer = 'fallback'; return; }
    cannonContainer.dataset.cannonRenderer = 'webgl';
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    cannon3d.setActive(true);
    if (lastAim) cannon3d.aimAt(lastAim.x, lastAim.y);
    cannonContainer.querySelector('canvas')?.addEventListener('webglcontextrestored', () => {
      if (lastAim) cannon3d?.aimAt(lastAim.x, lastAim.y);
    });
  }).catch(error => {
    // El menú y el disparo mantienen su alternativa si el recurso no está disponible.
    console.warn('No se pudo cargar el cañón 3D.', error);
    cannonContainer.dataset.cannonRenderer = 'fallback';
  }).finally(() => { cannonLoading = null; });
};

const loadAliens = () => {
  if (aliens3d || aliensLoading || aliensUnavailable) return;
  aliensLoading = import('./aliens3d').then(({ createAliens3D }) => {
    if (root.dataset.view !== 'arcade' || document.hidden) return;
    aliens3d = createAliens3D(stage, targets);
    if (!aliens3d) { aliensUnavailable = true; stage.dataset.alienRenderer = 'fallback'; return; }
    aliens3d.setTarget(active ? Number(active.dataset.index) : null);
  }).catch(error => { console.warn('No se pudieron cargar los marcianos 3D.', error); stage.dataset.alienRenderer = 'fallback'; }).finally(() => { aliensLoading = null; });
};

// Solo se mantiene un frame pendiente mientras el cañón alcanza el puntero.
const rotate = () => {
  frame = 0;
  if (root.dataset.view !== 'arcade' || document.hidden) return;
  const delta = targetAngle - angle;
  angle = reducedMotion.matches ? targetAngle : angle + delta * .2;
  turret.style.transform = `rotate(${angle}deg)`;
  if (Math.abs(delta) > .08 && !reducedMotion.matches) frame = requestAnimationFrame(rotate);
};
const aim = (x: number, y: number) => {
  lastAim = { x, y };
  const model = visibleCannon();
  if (model) { model.aimAt(x, y); return; }
  const origin = center(pivot);
  targetAngle = Math.max(-76, Math.min(76, Math.atan2(x - origin.x, origin.y - y) * 180 / Math.PI));
  if (reducedMotion.matches) { angle = targetAngle; turret.style.transform = `rotate(${angle}deg)`; return; }
  if (!frame) frame = requestAnimationFrame(rotate);
};
const selectTarget = (target: HTMLAnchorElement | null) => {
  active = target;
  targets.forEach(item => item.classList.toggle('is-active', item === target));
  const destination = target ? copy.destinations[Number(target.dataset.index)] : undefined;
  kicker.textContent = destination ? copy.selected : copy.ready;
  readoutName.textContent = destination?.label ?? '';
  readoutDetail.textContent = destination?.detail ?? '';
  aliens3d?.setTarget(target ? Number(target.dataset.index) : null);
};

const setView = (view: 'arcade' | 'portfolio', id?: string, focus = true) => {
  root.dataset.portfolioMode = new URLSearchParams(location.search).get('view') === 'full' ? 'full' : 'section';
  stopMovement();
  stage.classList.remove('is-keyboard-aiming');
  root.dataset.view = view;
  stage.classList.remove('is-tracking');
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  if (view === 'arcade') {
    loadCannon();
    loadAliens();
    cannon3d?.setActive(!document.hidden);
    aliens3d?.setActive(!document.hidden);
    armedTouch = null;
    window.scrollTo({ top: 0, behavior: 'instant' });
    targets.forEach(target => target.classList.remove('is-hit'));
    shooting = false;
    if (focus) (active ?? targets[1]).focus({ preventScroll: true });
    if (active) { const point = center(active.querySelector<HTMLElement>('.alien')!); aim(point.x, point.y); }
  } else {
    cannon3d?.setActive(false);
    aliens3d?.setActive(false);
    const section = document.getElementById(showSection(id || 'top'));
    if (section) {
      section.scrollIntoView({ behavior: 'instant', block: 'start' });
      const heading = section.querySelector<HTMLElement>('h1, h2');
      if (heading && focus) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
  }
  document.dispatchEvent(new CustomEvent('portfolio-view', { detail: view }));
};

const navigate = (id: string) => {
  clearTimeout(transitionTimer);
  clearTimeout(impactTimer);
  history.pushState({ portfolio: id }, '', `#${id}`);
  setView('portfolio', id);
};

const updateSound = () => {
  soundButton.setAttribute('aria-pressed', String(sound));
  soundButton.textContent = sound ? copy.soundOn : copy.soundOff;
};
updateSound();
soundButton.addEventListener('click', () => {
  sound = !sound;
  try { localStorage.setItem('js-arcade-sound', sound ? 'on' : 'off'); } catch { /* Preferencia de sesión. */ }
  if (sound) {
    try { audioContext ??= new AudioContext(); void audioContext.resume().catch(() => {}); } catch { sound = false; }
  }
  updateSound();
});

const laserSound = () => {
  if (!sound) return;
  try {
    audioContext ??= new AudioContext();
    void audioContext.resume().catch(() => {});
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(1150, now);
    oscillator.frequency.exponentialRampToValueAtTime(65, now + .22);
    gain.gain.setValueAtTime(.1, now);
    gain.gain.exponentialRampToValueAtTime(.001, now + .24);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + .25);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  } catch { /* La navegación nunca depende de que el audio esté disponible. */ }
};

const shoot = (point: { x: number; y: number }, target?: HTMLAnchorElement, instant = false) => {
  if (shooting) return;
  if (target && (instant || prefersReducedMotion())) { navigate(target.dataset.target!); return; }
  laserSound();
  if (prefersReducedMotion()) return;
  const bounds = stage.getBoundingClientRect();
  const model = visibleCannon();
  const start = model?.getMuzzle() ?? center(muzzle);
  const impact = fireLaser(effects, { x: start.x - bounds.left, y: start.y - bounds.top }, { x: point.x - bounds.left, y: point.y - bounds.top });
  if (model) model.recoil();
  else recoil.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(11px)', offset: .25 }, { transform: 'translateY(0)' }], { duration: 240, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
  if (target) {
    shooting = true;
    impactTimer = setTimeout(() => {
      if (root.dataset.view !== 'arcade') return;
      target.classList.add('is-hit');
      aliens3d?.hit(Number(target.dataset.index));
      impact();
    }, IMPACT_DELAY);
    transitionTimer = setTimeout(() => navigate(target.dataset.target!), SHOT_DURATION);
  }
};

stage.addEventListener('pointermove', event => {
  if (!finePointer.matches || prefersReducedMotion() || root.dataset.view !== 'arcade') return;
  const bounds = stage.getBoundingClientRect();
  stopMovement();
  stage.classList.remove('is-keyboard-aiming');
  stage.classList.add('is-tracking');
  crosshair.style.transform = `translate(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px)`;
  aim(event.clientX, event.clientY);
});
stage.addEventListener('pointerleave', () => { stage.classList.remove('is-tracking'); if (!arcade.contains(document.activeElement)) selectTarget(null); });
stage.addEventListener('click', event => {
  if ((event.target as Element).closest('[data-target]')) return;
  if (!finePointer.matches) { armedTouch = null; selectTarget(null); return; }
  shoot({ x: event.clientX, y: event.clientY });
});

targets.forEach((target, index) => {
  target.addEventListener('pointerenter', () => { if (finePointer.matches) selectTarget(target); });
  target.addEventListener('pointerleave', () => { if (finePointer.matches && document.activeElement !== target) selectTarget(null); });
  target.addEventListener('focus', () => { selectTarget(target); const point = center(target.querySelector<HTMLElement>('.alien')!); aim(point.x, point.y); });
  target.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!finePointer.matches && event.detail !== 0 && armedTouch !== target) {
      armedTouch = target;
      selectTarget(target);
      readoutDetail.textContent = `${copy.destinations[index].detail} ${copy.tap}`;
      const point = center(target.querySelector<HTMLElement>('.alien')!);
      aim(point.x, point.y);
      return;
    }
    shoot(center(target.querySelector<HTMLElement>('.alien')!), target, event.detail === 0);
  });
});

document.querySelectorAll<HTMLAnchorElement>('[data-open-arcade]').forEach(link => link.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const go = () => {
    const url = new URL(location.href); url.searchParams.delete('view'); url.hash = 'arcade';
    history.pushState({ arcade: true }, '', url);
    setView('arcade');
  };
  if (link.classList.contains('brand')) go(); else laserNavigate(link, go);
}));
arcade.querySelector<HTMLAnchorElement>('[data-direct]')!.addEventListener('click', event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const url = new URL(location.href); url.searchParams.set('view', 'full'); url.hash = 'top';
  history.pushState({ portfolio: 'top' }, '', url); setView('portfolio', 'top');
});
const fromHash = () => {
  clearTimeout(transitionTimer);
  clearTimeout(impactTimer);
  shooting = false;
  const id = location.hash.slice(1);
  setView(id && id !== 'arcade' && document.getElementById(id) ? 'portfolio' : 'arcade', id, false);
};
addEventListener('popstate', fromHash);
addEventListener('hashchange', fromHash);
// El teclado mueve una mira libre: mantener una tecla permite apuntar de forma continua.
const moveKeyboardAim = (now: number) => {
  movementFrame = 0;
  if (!movementKeys.size || root.dataset.view !== 'arcade' || document.hidden || shooting) { stopMovement(); return; }
  const bounds = stage.getBoundingClientRect();
  const initial = lastAim ?? (active ? center(active.querySelector<HTMLElement>('.alien')!) : { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 3 });
  let dx = 0, dy = 0;
  movementKeys.forEach(key => { dx += directions[key][0]; dy += directions[key][1]; });
  const length = Math.hypot(dx, dy) || 1;
  const elapsed = Math.min(.04, movementTime ? (now - movementTime) / 1000 : .016);
  movementTime = now;
  const speed = Math.max(360, Math.min(900, bounds.width * .65));
  const point = {
    x: Math.max(bounds.left + 8, Math.min(bounds.right - 8, initial.x + dx / length * speed * elapsed)),
    y: Math.max(bounds.top + 8, Math.min(bounds.bottom - 8, initial.y + dy / length * speed * elapsed)),
  };
  stage.classList.remove('is-tracking');
  stage.classList.add('is-keyboard-aiming');
  crosshair.style.transform = `translate(${point.x - bounds.left}px, ${point.y - bounds.top}px)`;
  selectTarget(targets.find(target => {
    const rect = target.querySelector<HTMLElement>('.alien')!.getBoundingClientRect();
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
  }) ?? null);
  aim(point.x, point.y);
  movementFrame = requestAnimationFrame(moveKeyboardAim);
};
addEventListener('keydown', event => {
  const element = event.target as HTMLElement;
  if (root.dataset.view !== 'arcade' || root.dataset.intro === 'pending' || element.closest('input,textarea,select,button,[contenteditable]:not([contenteditable="false"]),a:not([data-target])') || event.metaKey || event.ctrlKey || event.altKey) return;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key in directions) {
    event.preventDefault();
    if (shooting) return;
    movementKeys.add(key);
    if (!movementFrame) moveKeyboardAim(performance.now());
    return;
  }
  if (event.code === 'Space' || event.key === ' ') {
    event.preventDefault();
    if (event.repeat) return;
    const bounds = stage.getBoundingClientRect();
    const point = lastAim ?? (active ? center(active.querySelector<HTMLElement>('.alien')!) : { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 3 });
    const target = targets.find(item => {
      const rect = item.getBoundingClientRect();
      return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
    });
    shoot(point, target);
    return;
  }
  if (/^[1-8]$/.test(event.key)) {
    event.preventDefault(); stopMovement();
    const target = targets[Number(event.key) - 1];
    target.focus({ preventScroll: true }); selectTarget(target);
    const point = center(target.querySelector<HTMLElement>('.alien')!); aim(point.x, point.y);
    const bounds = stage.getBoundingClientRect();
    crosshair.style.transform = `translate(${point.x - bounds.left}px, ${point.y - bounds.top}px)`;
  }
});
addEventListener('keyup', event => {
  movementKeys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key);
  if (!movementKeys.size) stopMovement();
});
addEventListener('blur', stopMovement);
// Una rotación del móvil cambia la posición de los objetivos, no su selección.
addEventListener('resize', () => {
  if (root.dataset.view !== 'arcade') return;
  stage.classList.remove('is-tracking');
  if (active) {
    const point = center(active.querySelector<HTMLElement>('.alien')!);
    aim(point.x, point.y);
  } else {
    lastAim = null;
    targetAngle = 0;
    cannon3d?.reset();
    if (!cannon3d && !frame) frame = requestAnimationFrame(rotate);
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopMovement();
  if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
  cannon3d?.setActive(!document.hidden && root.dataset.view === 'arcade');
  aliens3d?.setActive(!document.hidden && root.dataset.view === 'arcade');
  if (!document.hidden && root.dataset.view === 'arcade') { loadCannon(); loadAliens(); }
});
addEventListener('pagehide', event => {
  if (event.persisted) { cannon3d?.setActive(false); aliens3d?.setActive(false); }
  else { cannon3d?.dispose(); aliens3d?.dispose(); }
});
addEventListener('pageshow', event => {
  if (event.persisted) { cannon3d?.setActive(root.dataset.view === 'arcade' && !document.hidden); aliens3d?.setActive(root.dataset.view === 'arcade' && !document.hidden); }
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { if (frame) cancelAnimationFrame(frame); frame = 0; stage.classList.remove('is-tracking'); turret.style.transform = 'none'; cannon3d?.reset(); }
});

document.addEventListener('intro-finished', event => {
  if ((event as CustomEvent<{ focus: boolean }>).detail?.focus) targets[1].focus({ preventScroll: true });
});
fromHash();
