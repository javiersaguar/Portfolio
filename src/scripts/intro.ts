import { currentTheme, type Theme } from './theme';

const root = document.documentElement;
const intro = document.querySelector<HTMLElement>('[data-native-intro]')!;
const art = intro.querySelector<HTMLElement>('[data-intro-art]')!;
const skip = intro.querySelector<HTMLButtonElement>('[data-skip-intro]')!;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const SEEN_KEY = 'js-intro-seen-native-v1';
const DURATION = 2800;
let loadingTimer: ReturnType<typeof setTimeout> | undefined;
let playbackTimer: ReturnType<typeof setTimeout> | undefined;
let exitTimer: ReturnType<typeof setTimeout> | undefined;
let assetRequest = 0;
let playing = false;
let closing = false;
let complete = root.dataset.intro !== 'pending';
const assets = new Map<Theme, Promise<void>>();

const clearTimers = () => {
  clearTimeout(loadingTimer);
  clearTimeout(playbackTimer);
  clearTimeout(exitTimer);
};

const finalize = (focus: boolean) => {
  if (complete) return;
  complete = true;
  clearTimers();
  assetRequest++;
  root.dataset.intro = 'done';
  intro.hidden = true;
  try { sessionStorage.setItem(SEEN_KEY, 'yes'); } catch { /* El contenido sigue siendo accesible sin almacenamiento. */ }
  document.removeEventListener('theme', onTheme);
  document.removeEventListener('keydown', onKey);
  reduce.removeEventListener('change', onMotion);
  document.dispatchEvent(new CustomEvent('intro-finished', { detail: { focus } }));
};

const finish = (focus = false, withExit = false) => {
  if (complete) return;
  if (closing || !withExit || reduce.matches) { finalize(focus); return; }
  closing = true;
  clearTimers();
  art.classList.add('is-complete');
  intro.classList.add('is-leaving');
  exitTimer = setTimeout(() => finalize(focus), 180);
};

const assetFor = (theme: Theme) => {
  let pending = assets.get(theme);
  if (!pending) {
    pending = new Promise<void>((resolve, reject) => {
      const image = new Image();
      image.onload = () => { void image.decode().then(resolve, reject); };
      image.onerror = () => reject(new Error('No se pudo cargar el nombre de la intro.'));
      image.src = `/intro/name-${theme}.webp`;
    });
    assets.set(theme, pending);
  }
  return pending;
};

const prepareTheme = async () => {
  if (complete || closing) return;
  const request = ++assetRequest;
  const theme = currentTheme();
  art.dataset.assetReady = 'false';
  try {
    await assetFor(theme);
    if (request !== assetRequest || complete || closing) return;
    intro.dataset.introTheme = theme;
    art.style.setProperty('--wordmark-image', `url('/intro/name-${theme}.webp')`);
    art.dataset.assetReady = 'true';
    clearTimeout(loadingTimer);
    if (!playing) {
      playing = true;
      art.classList.add('is-playing');
      playbackTimer = setTimeout(() => finish(false, true), DURATION - 180);
    }
  } catch {
    if (request === assetRequest) finish();
  }
};

const onTheme = () => { void prepareTheme(); };
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !complete) { event.preventDefault(); finish(true); }
};
const onMotion = () => { if (reduce.matches) finish(); };

skip.addEventListener('click', () => finish(true));
if (complete) intro.hidden = true;
else if (reduce.matches) finish();
else {
  document.addEventListener('theme', onTheme);
  document.addEventListener('keydown', onKey);
  reduce.addEventListener('change', onMotion);
  // Una carga fallida nunca bloquea el acceso al menú.
  loadingTimer = setTimeout(() => finish(), 1800);
  void prepareTheme();
}
