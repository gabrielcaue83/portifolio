import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const root = document.documentElement;
const canvas = document.getElementById('webgl');
const sec = document.getElementById('threejs');
const mIntro = document.querySelector('.m-intro');
const loadEl = sec.querySelector('.t-load');
const MOB = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;
const RED = matchMedia('(prefers-reduced-motion: reduce)').matches;

try { init(); } catch (e) {
  console.error(e); root.classList.add('t-fail');
  if (loadEl) loadEl.textContent = 'O 3D não abriu neste navegador.';
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOB, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, MOB ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !MOB;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const BG = new THREE.Color('#07080B');
  const scene = new THREE.Scene();
  scene.background = BG;
  scene.fog = new THREE.Fog(BG, 22, 95);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(MOB ? 52 : 40, innerWidth / innerHeight, 0.1, 400);

  /* ---------- luz de estúdio ---------- */
  scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x0b0b0d, 0.35));
  const key = new THREE.DirectionalLight(0xffe6c4, 2.6);
  key.position.set(10, 22, 14); key.castShadow = !MOB;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 90 });
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rimA = new THREE.PointLight(0x22e4ff, 60, 30, 2); rimA.position.set(-5, 5, -4); scene.add(rimA);
  const rimB = new THREE.PointLight(0xffb36b, 70, 30, 2); rimB.position.set(20, 7, -10); scene.add(rimB);

  /* ---------- chão escuro com reflexo suave ---------- */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: '#0e0f12', roughness: 0.38, metalness: 0.55 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  /* ---------- túnel de entrada ---------- */
  const tunnel = new THREE.Group(); scene.add(tunnel);
  const ringCols = [new THREE.Color('#22e4ff'), new THREE.Color('#a585ff'), new THREE.Color('#e2c08d')];
  for (let i = 0; i < 24; i++) {
    const c = ringCols[0].clone().lerp(ringCols[1], Math.min(1, i / 12)).lerp(ringCols[2], Math.max(0, (i - 12) / 12));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.045, 8, 120), new THREE.MeshBasicMaterial({ color: c, fog: true }));
    ring.position.set(0, 3, 20 + i * 3.4); ring.userData.s = (i % 2 ? 1 : -1) * (0.15 + i * 0.01);
    tunnel.add(ring);
  }

  /* ---------- SHOT 01 · metal iridescente ---------- */
  const A = new THREE.Group(); scene.add(A);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.42, MOB ? 140 : 260, MOB ? 20 : 36),
    new THREE.MeshPhysicalMaterial({ color: '#d9d9de', metalness: 1, roughness: 0.12, iridescence: 0.9, iridescenceIOR: 1.7, clearcoat: 1, clearcoatRoughness: 0.08 }));
  knot.position.y = 2.6; knot.castShadow = true; A.add(knot);
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.6, 64), new THREE.MeshPhysicalMaterial({ color: '#141418', roughness: 0.18, metalness: 0.2, clearcoat: 1 }));
  ped.position.y = 0.3; ped.castShadow = ped.receiveShadow = true; A.add(ped);
  const sats = [];
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 16), new THREE.MeshPhysicalMaterial({ color: ['#e2c08d', '#ffffff', '#22e4ff'][i], metalness: 1, roughness: 0.05 }));
    s.castShadow = true; s.userData.o = i * 2.1; A.add(s); sats.push(s);
  }

  /* ---------- SHOT 02 · eu, em 3D (modelado em código) ---------- */
  const BPOS = new THREE.Vector3(16, 0, -16);
  const B = new THREE.Group(); B.position.copy(BPOS); scene.add(B);
  const chiado = new THREE.Group(); B.add(chiado);
  const fabric = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9, metalness: 0 });
  const skinM = new THREE.MeshPhysicalMaterial({ color: '#E9B994', roughness: 0.55, clearcoat: 0.12 });
  const hairM = new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.55 });
  const inkM = new THREE.MeshStandardMaterial({ color: '#0c0c0c', roughness: 0.3 });
  const whiteM = new THREE.MeshStandardMaterial({ color: '#f3f1ec', roughness: 0.4 });
  const oliveM = fabric('#6E7A35'), olive2M = fabric('#56602A'), pantsM = fabric('#1F2A4D');
  const add = (geo, mat, x, y, z, parent = chiado) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
  // pernas (calça azul) e tênis
  [-0.38, 0.38].forEach(x => {
    add(new THREE.CapsuleGeometry(0.31, 1.2, 8, 16), pantsM, x, 1.07, 0);
    add(new RoundedBoxGeometry(0.56, 0.3, 0.92, 4, 0.12), new THREE.MeshStandardMaterial({ color: '#2D3036', roughness: 0.5 }), x * 1.06, 0.21, 0.12);
    add(new RoundedBoxGeometry(0.6, 0.1, 0.96, 2, 0.04), whiteM, x * 1.06, 0.07, 0.12);
    [0, 1, 2].forEach(i => { const st = add(new THREE.BoxGeometry(0.03, 0.16, 0.2), whiteM, x * 1.06 + (x < 0 ? -0.285 : 0.285), 0.24, 0.05 + i * 0.12); st.rotation.x = -0.5; });
  });
  const hips = add(new THREE.CapsuleGeometry(0.62, 0.22, 8, 20), pantsM, 0, 1.86, 0); hips.rotation.z = Math.PI / 2; hips.scale.set(1, 1, 0.8);
  // moletom verde-oliva
  const torso = add(new THREE.CapsuleGeometry(0.72, 0.72, 10, 28), oliveM, 0, 2.9, 0); torso.scale.set(1.1, 1, 0.8);
  const hem = add(new THREE.TorusGeometry(0.74, 0.11, 10, 40), olive2M, 0, 2.02, 0); hem.rotation.x = Math.PI / 2; hem.scale.set(1.1, 0.8, 1);
  const pocket = add(new RoundedBoxGeometry(0.95, 0.44, 0.1, 3, 0.05), olive2M, 0, 2.38, 0.55); pocket.rotation.x = -0.12;
  const hood = add(new THREE.TorusGeometry(0.42, 0.18, 12, 32), olive2M, 0, 3.86, -0.06); hood.rotation.x = Math.PI / 2 - 0.35;
  [-0.16, 0.16].forEach(x => { const d = add(new THREE.CylinderGeometry(0.022, 0.022, 0.55, 8), inkM, x, 3.42, 0.57); d.rotation.x = -0.15; add(new THREE.CylinderGeometry(0.035, 0.035, 0.1, 8), inkM, x, 3.12, 0.6); });
  const patch = add(new RoundedBoxGeometry(0.28, 0.19, 0.03, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#B6FF3B', roughness: 0.5, emissive: '#B6FF3B', emissiveIntensity: 0.15 }), -0.36, 3.38, 0.54); patch.rotation.y = -0.35;
  add(new THREE.CylinderGeometry(0.22, 0.24, 0.32, 20), skinM, 0, 4.0, 0);
  add(new THREE.CylinderGeometry(0.23, 0.23, 0.06, 20), whiteM, 0, 3.9, 0.04);
  // braços (pivô no ombro) — o direito segura o celular
  const arm = side => {
    const g = new THREE.Group(); g.position.set(side * 0.86, 3.62, 0); chiado.add(g);
    const sleeve = add(new THREE.CapsuleGeometry(0.21, 0.82, 8, 16), oliveM, 0, -0.58, 0, g); sleeve.rotation.z = side * 0.1;
    add(new THREE.TorusGeometry(0.19, 0.06, 8, 20), olive2M, side * 0.1, -1.08, 0, g).rotation.x = Math.PI / 2;
    add(new THREE.SphereGeometry(0.19, 24, 16), skinM, side * 0.11, -1.25, 0.02, g);
    if (side > 0) { const ph = add(new RoundedBoxGeometry(0.22, 0.4, 0.05, 2, 0.03), new THREE.MeshStandardMaterial({ color: '#2A2D33', roughness: 0.25, metalness: 0.4 }), side * 0.16, -1.32, 0.16, g); ph.rotation.x = -0.2; }
    g.rotation.z = side * 0.12; return g;
  };
  const armL = arm(-1), armR = arm(1);
  // cabeça
  const HEADY = 4.78;
  const headG = new THREE.Group(); headG.position.y = HEADY; chiado.add(headG);
  const headM = add(new THREE.SphereGeometry(0.78, 48, 32), skinM, 0, 0, 0, headG); headM.scale.set(1, 1.08, 0.95);
  [-1, 1].forEach(sd => { const e = add(new THREE.SphereGeometry(0.17, 20, 12), skinM, sd * 0.77, -0.04, 0, headG); e.scale.set(0.55, 1, 0.7); });
  const bud = add(new THREE.CapsuleGeometry(0.06, 0.14, 6, 10), whiteM, -0.86, -0.08, 0.06, headG); bud.rotation.z = 0.15;
  add(new THREE.SphereGeometry(0.08, 12, 8), whiteM, -0.84, 0.02, 0.06, headG);
  const eyes = [-0.25, 0.25].map(x => {
    const g = new THREE.Group(); g.position.set(x, 0.05, 0.7); headG.add(g);
    const e = add(new THREE.SphereGeometry(0.085, 16, 12), inkM, 0, 0, 0, g); e.scale.set(1, 1.35, 0.5);
    add(new THREE.SphereGeometry(0.026, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0.03, 0.05, 0.05, g);
    return g;
  });
  [-1, 1].forEach(sd => { const b = add(new RoundedBoxGeometry(0.26, 0.055, 0.05, 2, 0.02), inkM, sd * 0.25, 0.26, 0.68, headG); b.rotation.z = -sd * 0.12; });
  add(new THREE.SphereGeometry(0.07, 12, 8), skinM, 0.01, -0.1, 0.78, headG);
  const smile = add(new THREE.TorusGeometry(0.15, 0.026, 8, 24, Math.PI * 0.85), inkM, 0.01, -0.28, 0.69, headG); smile.rotation.z = Math.PI + 0.25;
  const oMouth = add(new THREE.TorusGeometry(0.07, 0.035, 8, 20), inkM, 0.01, -0.3, 0.7, headG); oMouth.visible = false;
  [-1, 1].forEach(sd => { const c = add(new THREE.CircleGeometry(0.08, 20), new THREE.MeshBasicMaterial({ color: 0xe8907c, transparent: true, opacity: 0.45 }), sd * 0.4, -0.18, 0.66, headG); c.lookAt(sd * 1.6, -0.6, 4); });
  // cabelo cacheado: bolinhas espalhadas no topo da cabeça
  const hairG = new THREE.Group(); headG.add(hairG);
  const curlGeo = new THREE.SphereGeometry(1, 14, 10);
  for (let i = 0; i < 70; i++) {
    const th = Math.random() * Math.PI * 2, front = Math.cos(th) > 0.55;
    const ph = Math.random() * (front ? 0.62 : 1.02);
    const dir = new THREE.Vector3(Math.sin(ph) * Math.sin(th), Math.cos(ph), Math.sin(ph) * Math.cos(th));
    const r = 0.15 + Math.random() * 0.09;
    const c = add(curlGeo, hairM, dir.x * 0.8, dir.y * 0.84 + 0.04, dir.z * 0.76, hairG); c.scale.setScalar(r);
  }
  [-1, 1].forEach(sd => { const f = add(new THREE.SphereGeometry(0.8, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.42), new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.8, transparent: true, opacity: 0.55 }), 0, 0.02, 0, headG); f.scale.set(1.02, 1.1, 0.97); f.rotation.z = sd * 0.9; });
  const face = { px: 0, py: 0, blink: 0, mood: 'smile' };
  function drawFace() {
    eyes.forEach((g, i) => { g.position.x = (i ? 0.25 : -0.25) + face.px * 0.05; g.position.y = 0.05 + face.py * -0.04; g.scale.y = Math.max(0.08, 1 - face.blink); });
    smile.visible = face.mood !== 'wow'; oMouth.visible = face.mood === 'wow';
  }
  drawFace();
  const ants = [];
  chiado.traverse(o => { if (o.isMesh) o.castShadow = true; });
  B.rotation.y = -0.25;
  const stage2 = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.25, 64), new THREE.MeshPhysicalMaterial({ color: '#16161b', roughness: 0.2, clearcoat: 1 }));
  stage2.position.y = 0.12; stage2.receiveShadow = true; B.add(stage2);

  /* ---------- SHOT 03 · mar de blocos instanciados ---------- */
  const CPOS = new THREE.Vector3(-16, 0, -32);
  const G = MOB ? 24 : 40, SP = 0.5;
  const boxGeo = new THREE.BoxGeometry(0.42, 1, 0.42); boxGeo.translate(0, 0.5, 0);
  const grid = new THREE.InstancedMesh(boxGeo, new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.4 }), G * G);
  grid.castShadow = !MOB; grid.receiveShadow = true; grid.position.copy(CPOS); scene.add(grid);
  const dummy = new THREE.Object3D(), colA = new THREE.Color('#1b2236'), colB = new THREE.Color('#e2c08d'), colC = new THREE.Color('#22e4ff'), tmpC = new THREE.Color();
  const hitLocal = new THREE.Vector3(999, 0, 999); let hitAmt = 0;
  const ripples = [];
  function updateGrid(t) {
    let i = 0;
    for (let x = 0; x < G; x++) for (let z = 0; z < G; z++) {
      const px = (x - G / 2) * SP, pz = (z - G / 2) * SP;
      let h = 0.35 + 0.28 * (Math.sin(px * 0.55 + t * 1.3) + Math.cos(pz * 0.5 + t * 1.1));
      const d2 = (px - hitLocal.x) ** 2 + (pz - hitLocal.z) ** 2;
      const bump = hitAmt * 2.4 * Math.exp(-d2 / 3.2);
      h += bump;
      ripples.forEach(r => { const d = Math.sqrt((px - r.x) ** 2 + (pz - r.z) ** 2), k = t - r.t; h += Math.max(0, 1.6 - k * 0.6) * Math.exp(-((d - k * 6) ** 2) / 0.8); });
      h = Math.max(0.08, h);
      dummy.position.set(px, 0, pz); dummy.scale.set(1, h, 1); dummy.updateMatrix();
      grid.setMatrixAt(i, dummy.matrix);
      tmpC.copy(colA).lerp(colB, Math.min(1, h / 1.6)); if (bump > 0.2) tmpC.lerp(colC, Math.min(1, bump / 2));
      grid.setColorAt(i, tmpC);
      i++;
    }
    grid.instanceMatrix.needsUpdate = true; if (grid.instanceColor) grid.instanceColor.needsUpdate = true;
    for (let k = ripples.length - 1; k >= 0; k--) if (t - ripples[k].t > 3) ripples.splice(k, 1);
  }
  updateGrid(0);

  /* ---------- caminho da câmera (shots) ---------- */
  const K = [
    [0.00, [0, 3, 92], [0, 3, 40]],
    [0.12, [0, 3.4, 26], [0, 2.4, 0]],
    [0.22, [3.6, 3.6, 8.6], [0, 2.4, 0]],
    [0.33, [-3.8, 2.6, 7.4], [0, 2.6, 0]],
    [0.45, [16 + 5.6, 5.0, -16 + 9], [16, 3.4, -16]],
    [0.57, [16 - 3.0, 4.6, -16 + 7.4], [16, 4.0, -16]],
    [0.69, [-16 + 3, 10.5, -32 + 13], [-16, 0.4, -32]],
    [0.81, [-16 - 7, 7.5, -32 + 10], [-16, 0.4, -32]],
    [1.00, [0, 46, 24], [0, 0, -16]]
  ].map(([p, a, b]) => ({ p, pos: new THREE.Vector3(...a), look: new THREE.Vector3(...b) }));
  const sm = t => t * t * (3 - 2 * t);
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), tgtPos = new THREE.Vector3(), tgtLook = new THREE.Vector3();
  function pathAt(p) {
    let i = 0; while (i < K.length - 2 && p > K[i + 1].p) i++;
    const a = K[i], b = K[i + 1], t = sm(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))));
    tgtPos.lerpVectors(a.pos, b.pos, t); tgtLook.lerpVectors(a.look, b.look, t);
  }

  /* ---------- HUD (legendas, tarjas, timecode) ---------- */
  const caps = Array.from(sec.querySelectorAll('.cap')), lbs = sec.querySelectorAll('.lb'), shotN = sec.querySelector('.shot-n'), tc = sec.querySelector('.tc');
  const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  let lastShot = -1;
  function hud(p) {
    caps.forEach(c => c.classList.toggle('on', p >= +c.dataset.a && p < +c.dataset.b));
    const lb = ss(0.01, 0.08, p) * (1 - ss(0.9, 0.99, p));
    lbs.forEach(l => { l.style.transform = 'scaleY(' + lb.toFixed(3) + ')'; });
    sec.classList.toggle('live', p > 0.04 && p < 0.97);
    const shot = p < 0.15 ? 0 : p < 0.37 ? 1 : p < 0.62 ? 2 : p < 0.86 ? 3 : 4;
    if (shot !== lastShot) { lastShot = shot; shotN.textContent = shot === 4 ? 'Corta!' : 'Shot 0' + shot; }
    const s = p * 48, ff = Math.floor((s % 1) * 24);
    tc.textContent = '00:00:' + String(Math.floor(s)).padStart(2, '0') + ':' + String(ff).padStart(2, '0');
  }

  /* ---------- interação: arrastar gira a câmera, clique mexe nos objetos ---------- */
  let yaw = 0, pitch = 0, vYaw = 0, vPitch = 0, drag = false, moved = 0, lx = 0, ly = 0;
  const mouse = new THREE.Vector2(9, 9), ray = new THREE.Raycaster();
  canvas.addEventListener('pointerdown', e => { drag = true; moved = 0; lx = e.clientX; ly = e.clientY; });
  addEventListener('pointermove', e => {
    mouse.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    face.px = mouse.x; face.py = -mouse.y;
    if (!drag) return;
    const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    vYaw = -dx * 0.004; vPitch = dy * 0.002;
  }, { passive: true });
  const jumpState = { y: 0, v: 0 };
  let knotSpin = 0;
  addEventListener('pointerup', e => {
    if (!drag) return; drag = false;
    if (moved > 6) return;
    ray.setFromCamera(new THREE.Vector2(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1), camera);
    const hits = ray.intersectObjects([knot, chiado, grid], true);
    if (!hits.length) return;
    const o = hits[0].object;
    if (o === knot) knotSpin += 6;
    else if (o === grid) { const l = grid.worldToLocal(hits[0].point.clone()); ripples.push({ x: l.x, z: l.z, t: clock.getElapsedTime() }); }
    else { jumpState.v = 9; face.mood = 'wow'; setTimeout(() => { face.mood = 'smile'; }, 900); }
  });

  /* ---------- quando renderizar ---------- */
  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.fov = innerWidth < 760 ? 52 : 40; camera.updateProjectionMatrix(); };
  addEventListener('resize', resize);
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hitW = new THREE.Vector3();
  const clock = new THREE.Clock();
  let first = true, lastFace = 0, blinkAt = 2;

  renderer.compile(scene, camera);
  root.classList.add('t-ready');

  renderer.setAnimationLoop(() => {
    const r = sec.getBoundingClientRect(), mr = mIntro && getComputedStyle(mIntro).display !== 'none' ? mIntro.getBoundingClientRect() : r;
    const active = r.top < innerHeight * 3 && mr.bottom > innerHeight * 0.3;
    canvas.classList.toggle('on', active);
    if (!active) { clock.getDelta(); return; }
    const dt = Math.min(clock.getDelta(), 1 / 20), t = clock.getElapsedTime();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / r.height));
    hud(p);

    // câmera: caminho + arrasto com inércia + leve paralaxe do mouse
    pathAt(p);
    if (p < 0.02) tgtPos.z -= Math.sin(t * 0.4) * 3 + 2;
    if (!drag) { vYaw *= 0.92; vPitch *= 0.92; yaw *= 0.97; pitch *= 0.95; }
    yaw += vYaw; pitch = Math.max(-0.35, Math.min(0.5, pitch + vPitch));
    const off = tgtPos.clone().sub(tgtLook);
    off.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw + (RED ? 0 : mouse.x * 0.06 * (Math.abs(mouse.x) < 2 ? 1 : 0)));
    const side = new THREE.Vector3().crossVectors(off, new THREE.Vector3(0, 1, 0)).normalize();
    off.applyAxisAngle(side, pitch);
    tgtPos.copy(tgtLook).add(off);
    const k = first ? 1 : 1 - Math.exp(-(RED ? 20 : 5) * dt);
    camPos.lerp(tgtPos, k); camLook.lerp(tgtLook, k); first = false;
    camera.position.copy(camPos); camera.lookAt(camLook);

    // túnel
    tunnel.children.forEach(ring => { ring.rotation.z += ring.userData.s * dt; });
    // shot 01
    knotSpin *= 0.96;
    knot.rotation.y += (0.35 + knotSpin) * dt; knot.rotation.x = Math.sin(t * 0.5) * 0.3;
    knot.position.y = 2.6 + Math.sin(t * 1.2) * 0.12;
    sats.forEach((s, i) => { const a = t * (0.6 + i * 0.15) + s.userData.o; s.position.set(Math.cos(a) * 2.6, 2.6 + Math.sin(a * 1.3) * 0.8, Math.sin(a) * 2.6); });
    // shot 02: eu respiro, aceno, pisco e pulo
    jumpState.v -= 26 * dt; jumpState.y = Math.max(0, jumpState.y + jumpState.v * dt); if (jumpState.y === 0 && jumpState.v < 0) jumpState.v = 0;
    const bob = Math.sin(t * 3.4) * 0.07;
    chiado.position.y = jumpState.y + bob;
    chiado.scale.set(1 + (jumpState.y > 0 ? -0.04 : bob * 0.3), 1 + (jumpState.y > 0 ? 0.06 : -bob * 0.4), 1);
    chiado.rotation.y = jumpState.y > 0 ? (jumpState.y * 0.6) : Math.sin(t * 0.6) * 0.12;
    hairG.scale.y = 1 + Math.sin(t * 3.4) * 0.025;
    headG.rotation.y = face.px * 0.25; headG.rotation.x = -face.py * 0.12;
    const waving = Math.sin(t * 0.8) > 0.4;
    armR.rotation.z += ((waving ? 2.5 + Math.sin(t * 9) * 0.35 : 0.12) - armR.rotation.z) * 0.15;
    armL.rotation.z = -0.12 - Math.sin(t * 1.6) * 0.05;
    if (t > blinkAt) { face.blink = 1; if (t > blinkAt + 0.12) { face.blink = 0; blinkAt = t + 1.5 + Math.random() * 3; } }
    if (t - lastFace > 1 / 30) { lastFace = t; drawFace(); }
    // shot 03: blocos seguem o mouse
    if (p > 0.55 && p < 0.92) {
      ray.setFromCamera(mouse, camera);
      if (ray.ray.intersectPlane(groundPlane, hitW)) { const l = grid.worldToLocal(hitW.clone()); hitLocal.lerp(l, 0.25); hitAmt += ((Math.abs(l.x) < G * SP / 2 && Math.abs(l.z) < G * SP / 2 ? 1 : 0) - hitAmt) * 0.1; }
      updateGrid(t);
    }
    renderer.render(scene, camera);
  });
}
