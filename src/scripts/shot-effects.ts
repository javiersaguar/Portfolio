export const SHOT_DURATION = 380;
export const IMPACT_DELAY = 75;
type Point = { x: number; y: number };

/** Descarga de plasma, núcleo luminoso y fragmentación localizada en el objetivo. */
export function fireLaser(layer: HTMLElement, start: Point, end: Point): () => void {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  const direction = Math.atan2(dy, dx);
  const add = (style: string, frames: Keyframe[], duration: number, easing = 'ease-out') => {
    const element = document.createElement('span');
    element.style.cssText = `position:absolute;pointer-events:none;${style}`;
    layer.append(element);
    const animation = element.animate(frames, { duration, easing, fill: 'forwards' });
    void animation.finished.then(() => element.remove(), () => element.remove());
    return element;
  };
  const beam = add(`left:${start.x}px;top:${start.y - 9}px;width:${distance}px;height:18px;background:linear-gradient(0deg,transparent,var(--accent),#f2fff4,var(--accent),transparent);box-shadow:0 0 24px color-mix(in srgb,var(--accent) 75%,transparent);transform-origin:0 50%;transform:rotate(${direction}rad)`, [
    { opacity: 0, clipPath: 'inset(0 100% 0 0)', offset: 0 },
    { opacity: 1, clipPath: 'inset(0 0 0 0)', offset: .32 },
    { opacity: .85, clipPath: 'inset(0 0 0 0)', offset: .65 },
    { opacity: 0, clipPath: 'inset(0 0 0 0)', offset: 1 },
  ], 270, 'linear');
  const core = document.createElement('span');
  core.style.cssText = 'position:absolute;left:0;right:0;top:7px;height:4px;background:#f2fff4;box-shadow:0 0 10px var(--accent)';
  beam.append(core);
  add(`left:${start.x - 30}px;top:${start.y - 30}px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle,#f2fff4 0 15%,var(--accent) 30%,transparent 70%)`, [
    { transform: 'scale(.85)', opacity: .95 }, { transform: 'scale(1.4)', opacity: 0 },
  ], 180);
  add(`left:${start.x - 12}px;top:${start.y - 4}px;width:24px;height:8px;border-radius:50%;background:#f2fff4;box-shadow:0 0 15px var(--accent)`, [
    { transform: `translate(0,0) rotate(${direction}rad)`, opacity: 1 },
    { transform: `translate(${dx}px,${dy}px) rotate(${direction}rad)`, opacity: 1, offset: .8 },
    { transform: `translate(${dx}px,${dy}px) rotate(${direction}rad)`, opacity: 0 },
  ], 95, 'linear');

  return () => {
    add(`left:${end.x - 32}px;top:${end.y - 32}px;width:64px;height:64px;border:3px solid var(--accent);border-radius:50%`, [
      { transform: 'scale(.85)', opacity: 1 }, { transform: 'scale(2.1)', opacity: 0 },
    ], 285, 'cubic-bezier(0.16, 1, 0.3, 1)');
    add(`left:${end.x - 55}px;top:${end.y - 55}px;width:110px;height:110px;background:radial-gradient(circle,#f2fff4 0 8%,var(--accent) 23%,transparent 68%);border-radius:50%`, [
      { opacity: .85, transform: 'scale(.9)' }, { opacity: 0, transform: 'scale(1.4)' },
    ], 230);
    for (let index = 0; index < 18; index++) {
      const angle = index * Math.PI * 2 / 18;
      const travel = 52 + index % 4 * 14;
      const size = 4 + index % 3 * 2;
      add(`left:${end.x}px;top:${end.y}px;width:${size}px;height:${size}px;background:${index % 4 === 0 ? '#f2fff4' : 'var(--accent)'};box-shadow:0 0 5px var(--accent)`, [
        { opacity: 1, transform: 'translate(0,0) rotate(0deg)' },
        { opacity: .9, offset: .7, transform: `translate(${Math.cos(angle) * travel * .92}px,${Math.sin(angle) * travel * .92}px) rotate(${index * 26}deg)` },
        { opacity: 0, transform: `translate(${Math.cos(angle) * travel}px,${Math.sin(angle) * travel}px) rotate(${index * 32}deg)` },
      ], 300, 'linear');
    }
  };
}
