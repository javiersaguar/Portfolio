import * as THREE from 'three';

export type Cannon3D = {
  aimAt(clientX: number, clientY: number): void;
  recoil(): void;
  getMuzzle(): { x: number; y: number };
  reset(): void;
  resize(): void;
  setActive(active: boolean): void;
  dispose(): void;
};

/** Torreta tridimensional decorativa. Solo dibuja al apuntar, disparar o cambiar la vista. */
export function createCannon3D(container: HTMLElement): Cannon3D | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power' });
  } catch {
    return null;
  }

  const canvas = renderer.domElement;
  canvas.dataset.cannonCanvas = '';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.append(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 50);
  camera.position.set(3.15, 4.6, 7.7);
  camera.lookAt(0, 1.2, -.25);
  camera.zoom = 1.02;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();

  const metal = new THREE.MeshStandardMaterial({ color: '#35434b', metalness: .62, roughness: .37, flatShading: true });
  const armor = new THREE.MeshStandardMaterial({ color: '#a3b0b2', metalness: .48, roughness: .31, flatShading: true });
  const trim = new THREE.MeshStandardMaterial({ color: '#596b72', metalness: .78, roughness: .28, flatShading: true });
  const rubber = new THREE.MeshStandardMaterial({ color: '#11191d', metalness: .1, roughness: .78 });
  const bore = new THREE.MeshBasicMaterial({ color: '#030708', side: THREE.DoubleSide });
  const accent = new THREE.MeshStandardMaterial({ color: '#5ce483', emissive: '#5ce483', emissiveIntensity: .85, metalness: .2, roughness: .28 });
  const lens = new THREE.MeshBasicMaterial({ color: '#5ce483', side: THREE.DoubleSide });
  const flashCoreMaterial = new THREE.MeshBasicMaterial({ color: '#effff5', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const flashRingMaterial = new THREE.MeshBasicMaterial({ color: '#5ce483', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  let accentIdleIntensity = .85;

  const add = <T extends THREE.BufferGeometry>(parent: THREE.Object3D, geometry: T, material: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = material !== lens && material !== bore;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) => add(parent, new THREE.BoxGeometry(...size), material, ...position);
  const cylinder = (parent: THREE.Object3D, top: number, bottom: number, height: number, material: THREE.Material, x: number, y: number, z: number, sides = 12) => add(parent, new THREE.CylinderGeometry(top, bottom, height, sides), material, x, y, z);
  const model = new THREE.Group();
  scene.add(model);
  const pedestal = new THREE.Group();
  pedestal.scale.x = 1.55;
  model.add(pedestal);

  // El pedestal tiene caras inclinadas, patas y una junta de energía visible entre placas.
  cylinder(pedestal, 1.62, 1.74, .14, rubber, 0, .07, 0, 8);
  cylinder(pedestal, 1.52, 1.67, .19, metal, 0, .23, 0, 8);
  cylinder(pedestal, 1.51, 1.53, .045, accent, 0, .347, 0, 8);
  cylinder(pedestal, 1.26, 1.52, .23, armor, 0, .485, 0, 8);
  cylinder(pedestal, .85, .92, .13, trim, 0, .66, 0, 16);
  cylinder(pedestal, .78, .8, .08, rubber, 0, .755, 0, 16);

  for (let index = 0; index < 8; index++) {
    const theta = index * Math.PI / 4 + Math.PI / 8;
    const x = Math.sin(theta) * 1.24;
    const z = Math.cos(theta) * 1.24;
    cylinder(pedestal, .048, .048, .026, trim, x, .614, z, 6);
    if (index % 2 === 0) {
      const foot = box(pedestal, [.42, .18, .61], [Math.sin(theta) * 1.4, .11, Math.cos(theta) * 1.4], metal);
      foot.rotation.y = theta;
      const inset = box(pedestal, [.16, .028, .3], [Math.sin(theta) * 1.4, .211, Math.cos(theta) * 1.4], accent);
      inset.rotation.y = theta;
    }
  }

  const yaw = new THREE.Group();
  yaw.position.y = .78;
  model.add(yaw);
  cylinder(yaw, .68, .76, .17, metal, 0, .07, 0, 12);
  cylinder(yaw, .56, .66, .08, trim, 0, .195, 0, 12);

  for (const side of [-1, 1]) {
    box(yaw, [.19, .56, .64], [side * .66, .38, .08], armor);
    box(yaw, [.035, .32, .39], [side * .766, .42, .08], metal);
    const hinge = cylinder(yaw, .27, .27, .18, trim, side * .72, .6, 0, 12);
    hinge.rotation.z = Math.PI / 2;
    const cap = cylinder(yaw, .18, .18, .025, accent, side * .825, .6, 0, 12);
    cap.rotation.z = Math.PI / 2;
    const bolt = cylinder(yaw, .075, .075, .032, rubber, side * .844, .6, 0, 6);
    bolt.rotation.z = Math.PI / 2;
  }

  const pitch = new THREE.Group();
  pitch.position.y = .6;
  yaw.add(pitch);

  // Una carcasa biselada permite leer el volumen incluso con la cámara casi frontal.
  const outline = new THREE.Shape();
  outline.moveTo(-.4, -.32);
  outline.lineTo(.4, -.32);
  outline.lineTo(.54, -.16);
  outline.lineTo(.54, .18);
  outline.lineTo(.35, .34);
  outline.lineTo(-.35, .34);
  outline.lineTo(-.54, .18);
  outline.lineTo(-.54, -.16);
  outline.closePath();
  const housing = new THREE.ExtrudeGeometry(outline, { depth: 1.15, bevelEnabled: true, bevelSize: .055, bevelThickness: .055, bevelSegments: 1, steps: 1 });
  add(pitch, housing, armor, 0, 0, -.79);
  box(pitch, [.75, .4, .18], [0, .015, .46], metal);
  box(pitch, [.5, .11, .026], [0, .08, .558], accent);
  for (let index = 0; index < 4; index++) box(pitch, [.53, .055, .065], [0, .392, -.47 + index * .18], rubber);
  for (const side of [-1, 1]) {
    box(pitch, [.035, .12, .52], [side * .592, .07, -.16], accent);
    box(pitch, [.18, .31, .44], [side * .66, -.04, .08], metal);

    // Bancos blindados, aletas de refrigeración y acumuladores detrás de la recámara.
    const shoulder = box(pitch, [.38, .58, 1.04], [side * .73, -.01, -.3], metal);
    shoulder.rotation.z = side * -.1;
    const outerArmor = box(pitch, [.13, .45, .91], [side * .96, .03, -.32], armor);
    outerArmor.rotation.z = side * -.13;
    box(pitch, [.048, .085, .72], [side * 1.045, .12, -.32], accent);
    for (let index = 0; index < 5; index++) {
      box(pitch, [.16, .09, .075], [side * .9, .34, -.68 + index * .18], trim);
      box(pitch, [.025, .2, .06], [side * 1.055, -.07, -.68 + index * .18], rubber);
    }
    const capacitor = cylinder(pitch, .22, .22, .67, trim, side * .72, -.06, .6, 10);
    capacitor.rotation.x = Math.PI / 2;
    const cellRing = cylinder(pitch, .232, .232, .075, accent, side * .72, -.06, .79, 10);
    cellRing.rotation.x = Math.PI / 2;
    const cellCap = cylinder(pitch, .24, .24, .11, rubber, side * .72, -.06, .98, 10);
    cellCap.rotation.x = Math.PI / 2;
  }
  box(pitch, [.56, .13, .5], [0, .44, .05], metal);
  box(pitch, [.33, .045, .28], [0, .528, .05], accent);

  const barrel = new THREE.Group();
  barrel.scale.z = .97;
  pitch.add(barrel);
  const tube = cylinder(barrel, .26, .26, 1.94, metal, 0, 0, -1.59);
  tube.rotation.x = Math.PI / 2;
  const innerTube = cylinder(barrel, .16, .16, 1.99, rubber, 0, 0, -1.61);
  innerTube.rotation.x = Math.PI / 2;
  for (const z of [-.83, -1.29, -1.89, -2.37]) {
    const ring = cylinder(barrel, .345, .345, .15, z === -1.29 ? accent : trim, 0, 0, z);
    ring.rotation.x = Math.PI / 2;
  }
  for (const side of [-1, 1]) {
    box(barrel, [.14, .23, 1.57], [side * .32, 0, -1.59], armor);
    box(barrel, [.043, .075, 1.12], [side * .409, .02, -1.6], accent);
    box(barrel, [.19, .12, .27], [side * .33, -.18, -1.13], metal);
    box(barrel, [.19, .12, .27], [side * .33, -.18, -2.1], metal);
  }
  box(barrel, [.18, .1, 1.45], [0, .315, -1.58], metal);
  box(barrel, [.07, .035, 1.25], [0, .385, -1.58], accent);

  // La boca es hueca: aro exterior, revestimiento interior y lente situada al fondo.
  const muzzleShell = add(barrel, new THREE.CylinderGeometry(.36, .44, .32, 12, 1, true), armor, 0, 0, -2.6);
  muzzleShell.rotation.x = Math.PI / 2;
  const lining = add(barrel, new THREE.CylinderGeometry(.28, .28, .3, 12, 1, true), new THREE.MeshStandardMaterial({ color: '#10191d', roughness: .8, side: THREE.DoubleSide }), 0, 0, -2.6);
  lining.rotation.x = Math.PI / 2;
  const lip = add(barrel, new THREE.RingGeometry(.28, .44, 12), trim, 0, 0, -2.762);
  lip.rotation.y = Math.PI;
  const darkness = add(barrel, new THREE.CircleGeometry(.278, 16), bore, 0, 0, -2.49);
  darkness.rotation.y = Math.PI;
  const core = add(barrel, new THREE.CircleGeometry(.13, 12), lens, 0, 0, -2.495);
  core.rotation.y = Math.PI;
  const innerRing = add(barrel, new THREE.RingGeometry(.17, .20, 12), lens, 0, 0, -2.498);
  innerRing.rotation.y = Math.PI;
  const muzzle = new THREE.Object3D();
  muzzle.position.z = -2.78;
  barrel.add(muzzle);

  // Pulso local de descarga; el láser principal permanece en la capa del arcade.
  const flash = new THREE.Group();
  flash.position.z = -2.82;
  flash.visible = false;
  barrel.add(flash);
  const flashCore = add(flash, new THREE.SphereGeometry(.19, 12, 8), flashCoreMaterial);
  flashCore.scale.z = .7;
  const flashRing = add(flash, new THREE.TorusGeometry(.36, .032, 6, 24), flashRingMaterial);
  flashRing.castShadow = false;
  flashCore.castShadow = false;
  const dischargeLight = new THREE.PointLight('#5ce483', 0, 2.5, 2);
  flash.add(dischargeLight);

  const ambient = new THREE.HemisphereLight('#ecf8ff', '#263323', 2.2);
  scene.add(ambient);
  const key = new THREE.DirectionalLight('#f2f8ff', 4.5);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(512, 512);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -4;
  key.shadow.camera.near = .5;
  key.shadow.camera.far = 18;
  key.shadow.normalBias = .025;
  key.shadow.bias = -.0003;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#a5f5be', 2.5);
  rim.position.set(5, 3, -4);
  scene.add(rim);
  const shadowMaterial = new THREE.ShadowMaterial({ color: '#000000', opacity: .27 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), shadowMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.025;
  floor.receiveShadow = true;
  scene.add(floor);

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const neutralYaw = Math.atan2(camera.position.x, camera.position.z) + .13;
  const neutralPitch = 1.1;
  let currentYaw = neutralYaw;
  let currentPitch = neutralPitch;
  let wantedYaw = neutralYaw;
  let wantedPitch = neutralPitch;
  let active = true;
  let disposed = false;
  let contextLost = false;
  let pendingFrame = 0;
  let previousTime = 0;
  let recoilStart = -Infinity;
  let kick = 0;
  let target: { x: number; y: number } | null = null;
  let width = 0;
  let height = 0;
  const point = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const hingeWorld = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const plane = new THREE.Plane();
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  const updatePose = () => {
    yaw.rotation.y = currentYaw;
    pitch.rotation.x = currentPitch + kick;
    model.updateMatrixWorld(true);
  };
  const render = () => {
    if (!disposed && !contextLost && active && width > 0 && height > 0) renderer.render(scene, camera);
  };
  const needsFrame = () => Math.abs(wantedYaw - currentYaw) > .0005 || Math.abs(wantedPitch - currentPitch) > .0005 || performance.now() - recoilStart < 340;
  const tick = (now: number) => {
    pendingFrame = 0;
    if (disposed || contextLost || !active || document.hidden) return;
    const dt = Math.min(.05, Math.max(.001, (now - (previousTime || now - 16)) / 1000));
    previousTime = now;
    const smoothing = 1 - Math.exp(-14 * dt);
    currentYaw += (wantedYaw - currentYaw) * smoothing;
    currentPitch += (wantedPitch - currentPitch) * smoothing;
    if (Math.abs(wantedYaw - currentYaw) < .0005) currentYaw = wantedYaw;
    if (Math.abs(wantedPitch - currentPitch) < .0005) currentPitch = wantedPitch;
    const elapsed = (now - recoilStart) / 1000;
    const pulse = !reduce.matches && elapsed >= 0 && elapsed < .2 ? Math.pow(1 - elapsed / .2, 2) : 0;
    barrel.position.z = reduce.matches || elapsed > .34 ? 0 : elapsed < .025 ? .34 * elapsed / .025 : .34 * Math.exp(-(elapsed - .025) * 18);
    kick = reduce.matches || elapsed > .3 ? 0 : .035 * Math.sin(Math.min(1, elapsed / .05) * Math.PI / 2) * Math.exp(-elapsed * 14);
    flash.visible = pulse > 0;
    flashCoreMaterial.opacity = pulse * .95;
    flashRingMaterial.opacity = pulse * .85;
    flash.scale.setScalar(1 + (1 - pulse) * .9);
    dischargeLight.intensity = pulse * 3.5;
    accent.emissiveIntensity = accentIdleIntensity + pulse * .8;
    updatePose();
    render();
    if (needsFrame()) pendingFrame = requestAnimationFrame(tick);
  };
  const request = () => {
    if (disposed || contextLost || !active || document.hidden || pendingFrame) return;
    previousTime = 0;
    pendingFrame = requestAnimationFrame(tick);
  };

  const aimAt = (clientX: number, clientY: number) => {
    target = { x: clientX, y: clientY };
    if (disposed || reduce.matches) return;
    const rect = container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    ndc.set((clientX - rect.left) / rect.width * 2 - 1, 1 - (clientY - rect.top) / rect.height * 2);
    camera.getWorldDirection(normal);
    pitch.getWorldPosition(hingeWorld);
    point.copy(hingeWorld).addScaledVector(normal, 8);
    plane.setFromNormalAndCoplanarPoint(normal, point);
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(plane, point)) return;
    direction.copy(point).sub(hingeWorld).normalize();
    const desiredYaw = Math.atan2(-direction.x, -direction.z);
    let difference = Math.atan2(Math.sin(desiredYaw - neutralYaw), Math.cos(desiredYaw - neutralYaw));
    difference = THREE.MathUtils.clamp(difference, -1.14, 1.14);
    wantedYaw = neutralYaw + difference;
    wantedPitch = THREE.MathUtils.clamp(Math.atan2(direction.y, Math.hypot(direction.x, direction.z)), .22, 1.34);
    request();
  };

  const resize = () => {
    if (disposed) return;
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    width = rect.width;
    height = rect.height;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (target) aimAt(target.x, target.y);
    render();
  };

  const updateTheme = () => {
    if (disposed) return;
    const style = getComputedStyle(document.documentElement);
    const color = new THREE.Color(style.getPropertyValue('--accent').trim() || '#5ce483');
    const background = new THREE.Color(style.getPropertyValue('--bg').trim() || '#0c0d0b');
    const light = background.getHSL({ h: 0, s: 0, l: 0 }).l > .5;
    accent.color.copy(color);
    accent.emissive.copy(color);
    accentIdleIntensity = light ? .32 : .85;
    accent.emissiveIntensity = accentIdleIntensity;
    lens.color.copy(color);
    flashRingMaterial.color.copy(color);
    dischargeLight.color.copy(color);
    rim.color.copy(color).lerp(new THREE.Color('#ffffff'), .7);
    metal.color.set(light ? '#475b61' : '#35434b');
    armor.color.set(light ? '#b8c8c9' : '#94a7ac');
    trim.color.set(light ? '#60777e' : '#60757d');
    shadowMaterial.opacity = light ? .22 : .38;
    render();
  };

  const reset = () => {
    target = null;
    wantedYaw = neutralYaw;
    wantedPitch = neutralPitch;
    if (reduce.matches) {
      currentYaw = wantedYaw;
      currentPitch = wantedPitch;
      barrel.position.z = 0;
      recoilStart = -Infinity;
      kick = 0;
      flash.visible = false;
      dischargeLight.intensity = 0;
      accent.emissiveIntensity = accentIdleIntensity;
      updatePose();
      render();
    } else request();
  };
  const onReducedMotion = () => {
    if (reduce.matches) reset();
    else if (target) aimAt(target.x, target.y);
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    container.dataset.cannonRenderer = 'fallback';
  };
  const onContextRestored = () => {
    contextLost = false;
    container.dataset.cannonRenderer = 'webgl';
    resize();
    request();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  document.addEventListener('theme', updateTheme);
  document.addEventListener('palette', updateTheme);
  reduce.addEventListener('change', onReducedMotion);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  updatePose();
  resize();
  updateTheme();
  container.dataset.cannonRenderer = 'webgl';

  return {
    aimAt,
    recoil() {
      if (reduce.matches || disposed || !active) return;
      recoilStart = performance.now();
      request();
    },
    getMuzzle() {
      updatePose();
      muzzle.getWorldPosition(point);
      point.project(camera);
      const rect = container.getBoundingClientRect();
      return { x: rect.left + (point.x + 1) * rect.width / 2, y: rect.top + (1 - point.y) * rect.height / 2 };
    },
    reset,
    resize,
    setActive(value) {
      active = value;
      if (!active) {
        if (pendingFrame) cancelAnimationFrame(pendingFrame);
        pendingFrame = 0;
        barrel.position.z = 0;
        recoilStart = -Infinity;
        kick = 0;
        flash.visible = false;
        dischargeLight.intensity = 0;
        accent.emissiveIntensity = accentIdleIntensity;
      } else {
        resize();
        request();
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      observer.disconnect();
      document.removeEventListener('theme', updateTheme);
      document.removeEventListener('palette', updateTheme);
      reduce.removeEventListener('change', onReducedMotion);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        geometries.add(object.geometry);
        (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete container.dataset.cannonRenderer;
    },
  };
}
