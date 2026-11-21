// 1919 Boston North End: brick street, molasses tank, wave, pool, hose, fire engine.
import * as THREE from 'three';
import { mat, canvasTex, facade, signBoard } from './world.js';
const bx = (w, h, d, m, x, y, z, p) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; if (p) p.add(o); return o; };
const cy = (r1, r2, h, m, x, y, z, p, seg = 16) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; if (p) p.add(o); return o; };
const sp = (r, m, x, y, z, p, sx = 1, sy = 1, sz = 1) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.castShadow = true; o.receiveShadow = true; if (p) p.add(o); return o; };
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const MOL = () => mat({ color: '#4A2208', roughness: 0.18, metalness: 0.05 });

export function street() {
  const g = new THREE.Group();
  const t = canvasTex('cobble19', 256, 256, (c, W, H) => { c.fillStyle = '#6C6559'; c.fillRect(0, 0, W, H); for (let r = 0; r < 10; r++) for (let k = 0; k < 10; k++) { const o = (r % 2) * 12, v = (rn(r * 10 + k) - 0.5) * 34; c.fillStyle = `rgb(${104 + v},${98 + v},${88 + v})`; c.beginPath(); c.roundRect(k * 26 + o + 1, r * 26 + 1, 23, 23, 6); c.fill(); } }, [20, 14]);
  const o = new THREE.Mesh(new THREE.PlaneGeometry(90, 40), mat({ map: t, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2 })); o.rotation.x = -Math.PI / 2; o.position.set(0, 0.03, 0); o.receiveShadow = true; g.add(o);
  const wk = bx(90, 0.18, 2.2, mat({ color: '#9A9488', roughness: 1 }), 0, 0.09, -5.2, g); return g;
}
const NAMES = ['BAKERY', 'SALOON', 'HARBOR CO.', 'FISH MARKET', 'BARBER', 'GROCER', 'TAILOR', 'PUB', 'TOBACCO', 'DRUGGIST', 'HARDWARE', 'BOOKS'];
const WALLS = ['#9A4A38', '#B5683F', '#7A4638', '#A5583E', '#8A5A42', '#C0794C'];
export function row(x0, x1, z = -7.5, seed = 0, names = NAMES, walls = WALLS) {
  const g = new THREE.Group(); let k = seed;
  for (let x = x0; x < x1; k++) { const w = 5 + rn(k) * 2, h = 7 + rn(k * 3) * 3; const wall = walls[k % walls.length]; const f = mat({ map: facade(names[k % names.length], { wall, kind: 'brick', trim: '#E8DFC8', sign: ['#2E4E3F', '#3A2A1E', '#2E3E6A', '#6A2E2E'][k % 4], awning: k % 3 ? ['#B5372E', '#2E6A4A', '#2E4E8A'][k % 3] : null, w, h, seed: k }) }), s = mat({ color: wall, roughness: 1 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 6), [s, s, s, s, f, s]); b.position.set(x + w / 2, h / 2, z); b.castShadow = true; b.receiveShadow = true; g.add(b);
    const ch = bx(0.7, 1.6, 0.7, mat({ color: '#5A3A2E', roughness: 1 }), x + w * 0.7, h + 0.7, z, g); x += w + 0.1; }
  return g;
}
export function tank() {
  const g = new THREE.Group(), steel = mat({ color: '#7E8A86', roughness: 0.55, metalness: 0.35 }), rv = mat({ color: '#4A524E', roughness: 0.5, metalness: 0.5 });
  const body = new THREE.Group(); g.add(body); g.body = body;
  cy(3.4, 3.4, 8.4, steel, 0, 4.2, 0, body, 36); cy(0.01, 3.5, 1.0, steel, 0, 8.9, 0, body, 36);
  for (let r = 0; r < 7; r++) for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2; if (Math.sin(a) < 0.1) continue; const m = sp(0.07, rv, Math.cos(a) * 3.42, 0.8 + r * 1.1, Math.sin(a) * 3.42, body); }
  [1.9, 4.5, 7.1].forEach((y) => { const b = cy(3.45, 3.45, 0.12, rv, 0, y, 0, body, 36); });
  const lab = signBoard('PURE MOLASSES', { w: 3.4, h: 0.9, bg: '#F2E6CF', fg: '#4A2208' }); lab.position.set(0, 4.8, 3.46); body.add(lab);
  const crack = bx(0.12, 6.5, 0.05, new THREE.MeshBasicMaterial({ color: '#111' }), -1.2, 4.0, 3.45, body); crack.visible = false; g.crack = crack;
  g.split = (k) => { body.scale.set(1 + k * 0.5, Math.max(0.12, 1 - k * 0.88), 1 + k * 0.5); };
  return g;
}
export function wave() {
  const g = new THREE.Group(), m = MOL();
  const a = sp(1, m, 0, 0, 0, g, 3.2, 2.4, 3.6), b = sp(1, m, -2.4, -0.4, 0, g, 2.6, 1.5, 3.2), c = sp(1, m, 2.8, -0.5, 0, g, 1.8, 1.0, 3.0);
  const lip = sp(1, mat({ color: '#6A3A12', roughness: 0.12 }), -3.0, -0.2, 0, g, 1.1, 1.1, 3.0); g.lip = lip;
  g.put = (x, k, t = 0) => { g.visible = k > 0.001; g.position.set(x, -0.35, 0.3); g.scale.set(0.35 + 0.65 * k, 0.15 + 0.85 * k, 1); a.scale.y = 2.4 + Math.sin(t * 7) * 0.12; lip.scale.y = 1.1 + Math.sin(t * 9 + 1) * 0.12; };
  return g;
}
export function pool(r = 1) { const g = new THREE.Group(); const o = cy(r, r, 0.22, MOL(), 0, 0.12, 0, g, 36); o.scale.set(1, 1, 0.55); g.set = (k) => { g.visible = k > 0.01; g.scale.set(Math.max(0.01, k), 1, Math.max(0.01, k)); }; return g; }
export function hose() { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: '#9CD4FF', roughness: 0.15, transparent: true, opacity: 0.85 }); const s = cy(0.05, 0.14, 4, m, 2, 0, 0, g, 8); s.rotation.z = Math.PI / 2 - 0.35; g.stream = s; return g; }
export function engine() { const g = new THREE.Group(), red = mat({ color: '#C0262D', roughness: 0.4 }); bx(3.4, 1.3, 1.6, red, 0, 1.1, 0, g); bx(1.4, 1.0, 1.5, red, 1.2, 1.9, 0, g); [-1.1, 1.1].forEach((x) => [-0.85, 0.85].forEach((z) => { const w = cy(0.5, 0.5, 0.15, mat({ color: '#222' }), x, 0.5, z, g, 16); w.rotation.x = Math.PI / 2; })); const bell = sp(0.14, mat({ color: '#E2B33C', metalness: 0.6, roughness: 0.3 }), 1.5, 2.55, 0, g); const lad = bx(3, 0.08, 0.2, mat({ color: '#B08A4A' }), 0, 1.9, 0.5, g); return g; }
export { bx, cy, sp };

export function cathedral() {
  const g = new THREE.Group(), st = mat({ color: '#C98A78', roughness: 1 }), dk = mat({ color: '#A8685A', roughness: 1 }), win = mat({ color: '#2E4A6A', roughness: 0.3 });
  bx(14, 16, 8, st, 0, 8, 0, g); bx(5, 30, 5, st, -4, 15, 0, g); const sp1 = new THREE.Mesh(new THREE.ConeGeometry(3.4, 14, 4), dk); sp1.position.set(-4, 37, 0); sp1.rotation.y = Math.PI / 4; sp1.castShadow = true; g.add(sp1);
  bx(4, 22, 4, st, 4.5, 11, 0, g); bx(3.4, 0.4, 3.4, dk, 4.5, 22.2, 0, g);
  for (let i = 0; i < 4; i++) bx(1.2, 3.2, 0.2, win, -5 + i * 3.4, 10, 4.1, g);
  const rose = cy(2.2, 2.2, 0.2, win, 0, 13.6, 4.1, g, 24); rose.rotation.x = Math.PI / 2; bx(3.4, 6, 0.3, new THREE.MeshStandardMaterial({ color: '#3A2A22' }), 0, 3, 4.1, g);
  [-5, -1.7, 1.7, 5].forEach((x) => bx(0.5, 9, 0.7, dk, x, 4.5, 4.2, g)); return g;
}
export function stage() { const g = new THREE.Group(), wd = mat({ color: '#9A6A3A', roughness: 1 }); bx(6, 0.7, 3, wd, 0, 0.35, 0, g); [-2.6, 2.6].forEach((x) => bx(0.2, 3.2, 0.2, wd, x, 2, -1.2, g)); bx(6, 0.15, 3, mat({ color: '#B5372E' }), 0, 3.5, -0.2, g); bx(6, 2.2, 0.1, mat({ color: '#7A2E3A' }), 0, 2.4, -1.4, g); return g; }
export function bread() { const g = new THREE.Group(); sp(0.5, mat({ color: '#B58A4A', roughness: 1 }), 0, 0.3, 0, g, 1.4, 0.8, 0.9); [[-0.3, 0.55, 0.2], [0.2, 0.6, -0.2], [0.4, 0.45, 0.25], [-0.1, 0.62, -0.1]].forEach(([x, y, z]) => sp(0.15, mat({ color: '#4E7A3A', roughness: 1 }), x, y, z, g, 1, 0.6, 1)); return g; }
