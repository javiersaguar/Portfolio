// The small game layer of the site: achievements with toasts and the
// Game Boy palette. Everything is optional and lives in localStorage.

export const achievements = {
  filter: { title: 'Picky player', hint: 'Filter the projects.' },
  inventory: { title: 'Inventory check', hint: 'Inspect an item in the tech stack.' },
  root: { title: 'Root access', hint: 'Run a command in the terminal.' },
  snake: { title: 'Snake charmer', hint: 'Eat 10 blocks in the snake game.' },
  explorer: { title: 'Explorer', hint: 'Reach the end of the page.' },
  konami: { title: 'Cheat code', hint: 'Up, up, down, down, left, right, left, right, B, A.' },
} as const;

export type AchievementId = keyof typeof achievements;

const KEY = 'js-achievements';
const PALETTE_KEY = 'js-palette';

function read(): AchievementId[] {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(ids) ? ids.filter((id) => id in achievements) : [];
  } catch {
    return [];
  }
}

export function unlocked(): Set<AchievementId> {
  return new Set(read());
}

export function unlock(id: AchievementId): void {
  const have = read();
  if (have.includes(id)) return;
  have.push(id);
  try {
    localStorage.setItem(KEY, JSON.stringify(have));
  } catch {
    // Private mode: the toast still shows, it just won't be remembered.
  }
  toast('Achievement unlocked', achievements[id].title);
}

export function toast(label: string, text: string): void {
  let box = document.getElementById('toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toasts';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    document.body.append(box);
  }
  const item = document.createElement('div');
  item.className = 'toast';
  const l = document.createElement('span');
  l.className = 'toast-label';
  l.textContent = label;
  const t = document.createElement('span');
  t.className = 'toast-text';
  t.textContent = text;
  item.append(l, t);
  box.append(item);
  setTimeout(() => item.classList.add('out'), 3200);
  setTimeout(() => item.remove(), 3700);
}

export function isGameBoy(): boolean {
  return document.documentElement.dataset.palette === 'gb';
}

export function setGameBoy(on: boolean): void {
  if (on) document.documentElement.dataset.palette = 'gb';
  else delete document.documentElement.dataset.palette;
  try {
    localStorage.setItem(PALETTE_KEY, on ? 'gb' : '');
  } catch {
    // Not remembered, that's all.
  }
  document.dispatchEvent(new CustomEvent('palette', { detail: on }));
}

export function toggleGameBoy(): boolean {
  setGameBoy(!isGameBoy());
  return isGameBoy();
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
