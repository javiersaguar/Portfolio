import * as THREE from 'three';
import { arcadeAliens } from '../data/arcade-sprites';

export type Aliens3D = {
  setActive(active: boolean): void;
  setTarget(index: number | null): void;
  hit(index: number): void;
  resize(): void;
  dispose(): void;
};

/** Una sola superficie WebGL dibuja los ocho marcianos sobre sus enlaces accesibles. */
export function createAliens3D(stage: HTMLElement, targets: HTMLAnchorElement[]): Aliens3D | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
  } catch { return null; }
  const canvas = renderer.domElement;
  canvas.dataset.aliensCanvas = '';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  stage.prepend(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2000);
  camera.position.z = 1000;
  scene.add(new THREE.HemisphereLight('#eefcf4', '#183328', 2.1));
  const key = new THREE.DirectionalLight('#ffffff', 3.5);
  key.position.set(-400, 500, 700);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#8bdca6', 1.6);
  rim.position.set(500, -50, 200);
  scene.add(rim);
  const colors: Record<string, THREE.MeshStandardMaterial> = {};
  for (const char of ['g', 'd', 'w', 'm', 'k']) {
    colors[char] = new THREE.MeshStandardMaterial({ color: '#5ce483', metalness: .16, roughness: .4, flatShading: true });
  }
  const geometry = new THREE.BoxGeometry(.96, .96, 1);
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const actors = targets.map((target, index) => {
    const group = new THREE.Group();
    const rows = arcadeAliens[index][0];
    const pixels: { char: string; x: number; y: number }[] = [];
    rows.forEach((row, y) => [...row].forEach((char, x) => { if (char !== '.') pixels.push({ char, x, y }); }));
    const centerX = (Math.min(...pixels.map(p => p.x)) + Math.max(...pixels.map(p => p.x))) / 2;
    const centerY = (Math.min(...pixels.map(p => p.y)) + Math.max(...pixels.map(p => p.y))) / 2;
    for (const char of Object.keys(colors)) {
      const selected = pixels.filter(pixel => pixel.char === char);
      if (!selected.length) continue;
      const mesh = new THREE.InstancedMesh(geometry, colors[char], selected.length);
      selected.forEach((pixel, instance) => {
        const eye = char === 'w' || char === 'k';
        const depth = eye ? 1 : pixel.y > centerY + 2 ? 3.2 : 4.7;
        position.set(pixel.x - centerX, centerY - pixel.y, eye ? 2.8 : 0);
        scale.set(1, 1, depth);
        matrix.compose(position, quaternion, scale);
        mesh.setMatrixAt(instance, matrix);
        const tint = new THREE.Color('#ffffff').multiplyScalar(.9 + ((pixel.x + pixel.y * 3) % 5) * .025);
        mesh.setColorAt(instance, tint);
      });
      mesh.instanceMatrix.needsUpdate = true;
      group.add(mesh);
    }
    scene.add(group);
    return { group, target, x: 0, y: 0, size: 1, emphasis: 1, yaw: (index % 2 ? -.27 : .28), hit: false };
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = true;
  let lost = false;
  let disposed = false;
  let selected: number | null = null;
  let frame = 0;
  let lastDraw = 0;

  const render = (time = performance.now()) => {
    if (disposed || lost || !active || document.hidden) return;
    for (let index = 0; index < actors.length; index++) {
      const actor = actors[index];
      const phase = time * .0007 + index * .8;
      const goal = selected === index ? 1.08 : 1;
      actor.emphasis = reduced.matches ? 1 : actor.emphasis + (goal - actor.emphasis) * .22;
      actor.group.visible = !actor.hit;
      actor.group.position.set(actor.x, actor.y + (reduced.matches ? 0 : Math.sin(phase) * actor.size * .024), 0);
      actor.group.rotation.set(-.2 + (reduced.matches ? 0 : Math.cos(phase * .75) * .035), actor.yaw + (reduced.matches ? 0 : Math.sin(phase) * .09), 0);
      actor.group.scale.setScalar(actor.size / 19 * actor.emphasis);
    }
    renderer.render(scene, camera);
  };
  const tick = (time: number) => {
    frame = 0;
    if (disposed || lost || !active || document.hidden || reduced.matches) return;
    // Los pequeños movimientos de flotación no necesitan sesenta renders por segundo.
    if (time - lastDraw >= 1000 / 30) { render(time); lastDraw = time; }
    frame = requestAnimationFrame(tick);
  };
  const request = () => {
    if (disposed || lost || !active || document.hidden) return;
    if (reduced.matches) { render(); return; }
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    if (disposed) return;
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(rect.width, rect.height, false);
    camera.left = -rect.width / 2; camera.right = rect.width / 2;
    camera.top = rect.height / 2; camera.bottom = -rect.height / 2;
    camera.updateProjectionMatrix();
    actors.forEach(actor => {
      const bounds = actor.target.querySelector<HTMLElement>('.alien')!.getBoundingClientRect();
      actor.x = bounds.left + bounds.width / 2 - rect.left - rect.width / 2;
      actor.y = rect.height / 2 - (bounds.top + bounds.height / 2 - rect.top);
      actor.size = Math.min(bounds.width, bounds.height);
    });
    render(); request();
  };
  const updateTheme = () => {
    const style = getComputedStyle(document.documentElement);
    const accent = new THREE.Color(style.getPropertyValue('--accent').trim() || '#5ce483');
    colors.g.color.copy(accent);
    colors.g.emissive.copy(accent); colors.g.emissiveIntensity = .08;
    colors.d.color.copy(accent).multiplyScalar(.6);
    colors.w.color.set('#edf7ed'); colors.w.roughness = .25;
    colors.k.color.set('#0a1b12');
    colors.m.color.copy(accent).lerp(new THREE.Color('#bdc9c0'), .5);
    render(); request();
  };
  const onReduced = () => { if (frame) cancelAnimationFrame(frame); frame = 0; render(); request(); };
  const onLost = (event: Event) => {
    event.preventDefault(); lost = true;
    if (frame) cancelAnimationFrame(frame); frame = 0;
    stage.dataset.alienRenderer = 'fallback';
  };
  const onRestored = () => { lost = false; stage.dataset.alienRenderer = 'webgl'; resize(); request(); };
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  targets.forEach(target => observer.observe(target.querySelector('.alien')!));
  document.fonts.ready.then(() => { if (!disposed) resize(); });
  document.addEventListener('theme', updateTheme);
  document.addEventListener('palette', updateTheme);
  reduced.addEventListener('change', onReduced);
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);
  resize(); updateTheme();
  stage.dataset.alienRenderer = 'webgl';

  return {
    resize,
    setTarget(index) { selected = index; render(); request(); },
    hit(index) { if (actors[index]) { actors[index].hit = true; render(); } },
    setActive(value) {
      active = value;
      if (!value) { if (frame) cancelAnimationFrame(frame); frame = 0; }
      else { actors.forEach(actor => { actor.hit = false; }); resize(); request(); }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('theme', updateTheme);
      document.removeEventListener('palette', updateTheme);
      reduced.removeEventListener('change', onReduced);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      actors.forEach(actor => actor.group.traverse(object => { if (object instanceof THREE.InstancedMesh) object.dispose(); }));
      geometry.dispose(); Object.values(colors).forEach(material => material.dispose());
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
