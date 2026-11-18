// Pig War props: pig (+ghost), potato patch, rifle, warship, butterflies, popcorn, tombstone, tents, cannon, sea.
import * as THREE from 'three';
import { mat, canvasTex } from './world.js';
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const M = (o) => mat({ roughness: 0.8, ...o });
const mesh = (geo, m, x = 0, y = 0, z = 0, p) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; if (p) p.add(o); return o; };
const box = (w, h, d, m, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
const cyl = (r1, r2, h, m, x, y, z, p, s = 14) => mesh(new THREE.CylinderGeometry(r1, r2, h, s), m, x, y, z, p);
const sph = (r, m, x, y, z, p, sx = 1, sy = 1, sz = 1) => { const o = mesh(new THREE.SphereGeometry(r, 18, 14), m, x, y, z, p); o.scale.set(sx, sy, sz); return o; };

/** a round pink pig. group.munch(t), group.fall(k 0..1) rolls it onto its side, group.eyesX(on) draws X eyes */
export function pig(s = 1, pink = '#F4A6B5') {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); g.scale.setScalar(s);
  const pm = M({ color: pink, roughness: 0.55 }), dk = M({ color: '#D9808F' }), eye = M({ color: '#1B1B22' }), white = M({ color: '#FFFFFF' });
  sph(0.5, pm, 0, 0.55, 0, body, 1.35, 1, 1);
  const head = new THREE.Group(); head.position.set(0.62, 0.62, 0); body.add(head);
  sph(0.3, pm, 0, 0, 0, head); const snout = cyl(0.14, 0.14, 0.14, dk, 0.27, -0.04, 0, head, 16); snout.rotation.z = Math.PI / 2;
  [-0.05, 0.05].forEach((z) => sph(0.022, eye, 0.37, -0.04, z * 1.4, head));
  [[-1], [1]].forEach(([z]) => { const e = mesh(new THREE.ConeGeometry(0.11, 0.2, 4), dk, 0.03, 0.3, z * 0.17, head); e.rotation.x = z * 0.5; e.rotation.z = -0.3; });
  const eyes = []; [-1, 1].forEach((z) => { const w = sph(0.065, white, 0.23, 0.1, z * 0.14, head); const p = sph(0.035, eye, 0.28, 0.1, z * 0.14, head); eyes.push(w, p); });
  const xs = new THREE.Group(); xs.visible = false; head.add(xs); [-1, 1].forEach((z) => [0.7, -0.7].forEach((a) => { const b = box(0.1, 0.02, 0.02, eye, 0.28, 0.1, z * 0.14, xs); b.rotation.x = a; }));
  const legs = [[0.35, 0.22], [0.35, -0.22], [-0.38, 0.22], [-0.38, -0.22]].map(([x, z]) => cyl(0.07, 0.06, 0.28, dk, x, 0.14, z, body, 8));
  const tail = mesh(new THREE.TorusGeometry(0.07, 0.02, 6, 12, Math.PI * 1.6), dk, -0.68, 0.7, 0, body); tail.rotation.y = Math.PI / 2;
  g.munch = (t) => { head.rotation.z = -0.3 + Math.sin(t * 9) * 0.18; head.position.y = 0.45 + Math.abs(Math.sin(t * 9)) * 0.03; tail.rotation.z = Math.sin(t * 7) * 0.5; };
  g.idle = (t) => { head.rotation.z = Math.sin(t * 2) * 0.05; tail.rotation.z = Math.sin(t * 6) * 0.4; };
  g.fall = (k) => { body.rotation.x = k * Math.PI / 2; body.position.y = k * 0.38; legs.forEach((l, i) => { l.rotation.z = k * (i % 2 ? 0.5 : -0.4); }); xs.visible = k > 0.5; eyes.forEach((e) => (e.visible = k <= 0.5)); };
  g.reset = () => { g.fall(0); head.rotation.z = 0; };
  return g;
}
/** translucent ghost pig with a halo; bob it with g.position.y */
export function ghostPig(s = 1) {
  const g = pig(s, '#DDEBFF'); g.traverse((o) => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = 0.55; o.material.emissive = new THREE.Color('#9FC8FF'); o.material.emissiveIntensity = 0.35; o.castShadow = false; } });
  const halo = mesh(new THREE.TorusGeometry(0.2, 0.035, 8, 24), M({ color: '#FFE26A', emissive: '#FFD23A', emissiveIntensity: 1.2 }), 0.62, 1.4, 0, g); halo.rotation.x = Math.PI / 2; halo.castShadow = false;
  g.halo = halo; g.fall(0); return g;
}
/** rows of potato mounds with leaves; pulls potatoes up as `dig(t)` is called */
export function potatoPatch(w = 5, d = 2.6, seed = 1) {
  const g = new THREE.Group(), soil = M({ color: '#6B4A2E' }), leaf = M({ color: '#4E9A3C' }), pot = M({ color: '#C9A06A' });
  const rows = Math.round(d / 0.55), cols = Math.round(w / 0.5), loose = [];
  for (let r = 0; r < rows; r++) { const rowM = box(w, 0.1, 0.26, soil, 0, 0.05, -d / 2 + r * 0.55, g); for (let c = 0; c < cols; c++) { const x = -w / 2 + 0.25 + c * 0.5 + (rnd(r * 9 + c + seed) - 0.5) * 0.1, z = -d / 2 + r * 0.55;
      const lf = sph(0.12 + rnd(c + r * 7) * 0.05, leaf, x, 0.2, z, g, 1, 0.7, 1); lf.rotation.y = rnd(c * 3 + r) * 3; if (rnd(c + r * 5 + seed) > 0.8) { const p = sph(0.06, pot, x + 0.1, 0.1, z + 0.1, g, 1.2, 0.8, 1); } } }
  for (let i = 0; i < 6; i++) { const p = sph(0.07, pot, 0, 0.1, 0, g, 1.2, 0.8, 1); p.visible = false; loose.push(p); }
  g.dig = (t, cx = 0, cz = 0, on = true) => loose.forEach((p, i) => { const k = ((t * 1.6 + i * 0.37) % 1); p.visible = on; p.position.set(cx + (i - 2.5) * 0.12 + Math.sin(i * 2.3) * 0.2 * k, 0.1 + Math.sin(k * Math.PI) * (0.55 + (i % 3) * 0.12), cz + (k - 0.5) * (i % 2 ? 0.7 : -0.7)); p.rotation.set(k * 6, k * 4, 0); });
  return g;
}
export function rifle(s = 1) {
  const g = new THREE.Group(), wood = M({ color: '#7A4A26' }), steel = M({ color: '#2C2C34', metalness: 0.6, roughness: 0.4 });
  box(0.9 * s, 0.07 * s, 0.05 * s, steel, 0.3 * s, 0, 0, g); box(0.5 * s, 0.1 * s, 0.06 * s, wood, -0.3 * s, -0.02 * s, 0, g); const f = new THREE.Mesh(new THREE.SphereGeometry(0.12 * s, 10, 8), new THREE.MeshBasicMaterial({ color: '#FFD24A' })); f.position.set(0.85 * s, 0, 0); f.visible = false; g.add(f); g.flash = f; return g;
}
export function cannon(s = 1) {
  const g = new THREE.Group(), iron = M({ color: '#2B2B33', metalness: 0.5, roughness: 0.5 }), wood = M({ color: '#7A4A26' });
  const b = cyl(0.17 * s, 0.24 * s, 1.1 * s, iron, 0, 0.5 * s, 0, g, 16); b.rotation.z = Math.PI / 2 - 0.15; box(0.9 * s, 0.14 * s, 0.5 * s, wood, 0, 0.26 * s, 0, g);
  [-0.25, 0.25].forEach((z) => { const w = cyl(0.24 * s, 0.24 * s, 0.07 * s, wood, 0, 0.24 * s, z * s * 1.2, g, 16); w.rotation.x = Math.PI / 2; });
  return g;
}
/** sailing warship with a flag and cannon barrels; g.sway(t) */
export function ship(s = 1, flag = '#B5372E') {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); g.scale.setScalar(s);
  const sailTex = canvasTex('sail' + flag, 256, 256, (c, W, H) => { c.fillStyle = '#F2EAD3'; c.fillRect(0, 0, W, H); c.fillStyle = flag; c.fillRect(W / 2 - 18, 0, 36, H); c.fillRect(0, H / 2 - 18, W, 36); for (let y = 0; y < H; y += 32) { c.fillStyle = 'rgba(120,100,70,0.12)'; c.fillRect(0, y, W, 3); } });
  const hullM = M({ color: '#5A3A22' }), sail = M({ map: sailTex, side: THREE.DoubleSide }), band = M({ color: '#F2D37A' });
  const hull = box(1.5, 0.7, 4.6, hullM, 0, 0.35, 0, body); box(1.56, 0.08, 4.66, band, 0, 0.62, 0, body); box(1.2, 0.3, 1.3, hullM, 0, 0.85, -1.7, body);
  [-1, 1].forEach((x) => [-1.4, -0.4, 0.6, 1.5].forEach((z) => cyl(0.07, 0.07, 0.2, M({ color: '#17171C' }), x * 0.78, 0.5, z, body, 8).rotation.z = Math.PI / 2));
  [-1.2, 0.2, 1.4].forEach((z, i) => { const h = 2.6 - i * 0.3; cyl(0.05, 0.05, h, M({ color: '#6B4A2E' }), 0, 0.7 + h / 2, z, body, 8); const sl = mesh(new THREE.PlaneGeometry(1.4, h * 0.65), sail, 0, 0.9 + h * 0.5, z + 0.05, body); sl.castShadow = true; sl.rotation.y = 0.15; });
  const fl = box(0.5, 0.3, 0.02, M({ color: flag }), 0.28, 3.2, 0.2, body);
  g.sway = (t, ph = 0) => { body.rotation.z = Math.sin(t * 1.2 + ph) * 0.04; body.rotation.x = Math.sin(t * 0.9 + ph) * 0.02; body.position.y = Math.sin(t * 1.5 + ph) * 0.05; fl.rotation.y = Math.sin(t * 5 + ph) * 0.4; };
  return g;
}
/** fluttering butterflies around a point */
export function butterflies(n = 6, r = 3, seed = 1) {
  const g = new THREE.Group(), list = [];
  for (let i = 0; i < n; i++) { const col = ['#FFD23A', '#FFFFFF', '#F28CB5', '#9ACBFF'][i % 4], m = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }); const b = new THREE.Group(); const w1 = mesh(new THREE.PlaneGeometry(0.1, 0.07), m, 0.05, 0, 0, b), w2 = mesh(new THREE.PlaneGeometry(0.1, 0.07), m, -0.05, 0, 0, b); w1.castShadow = w2.castShadow = false; b.userData = { w1, w2, i }; g.add(b); list.push(b); }
  g.update = (t) => list.forEach((b) => { const i = b.userData.i, a = t * (0.35 + rnd(i + seed) * 0.3) + i * 2; b.position.set(Math.cos(a) * r * (0.5 + rnd(i * 3) * 0.5), 0.9 + Math.sin(t * 1.3 + i) * 0.35 + rnd(i) * 0.6, Math.sin(a * 1.2) * r * 0.6); b.rotation.y = -a; const f = Math.sin(t * 22 + i) * 0.9; b.userData.w1.rotation.z = f; b.userData.w2.rotation.z = -f; });
  return g;
}
export function popcorn(s = 1) {
  const g = new THREE.Group(); const bucket = cyl(0.12 * s, 0.09 * s, 0.2 * s, M({ map: canvasTex('popstripe', 128, 128, (c, W, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#FFFFFF' : '#D8343F'; c.fillRect(i * W / 8, 0, W / 8, H); } }) }), 0, 0.1 * s, 0, g, 16);
  for (let i = 0; i < 9; i++) sph(0.04 * s, M({ color: '#FFF3C8' }), (rnd(i) - 0.5) * 0.14 * s, 0.22 * s + rnd(i + 4) * 0.05 * s, (rnd(i + 8) - 0.5) * 0.14 * s, g); return g;
}
export function tombstone(text = ['R.I.P.', 'PIG', '1859'], s = 1) {
  const g = new THREE.Group(), stone = M({ color: '#B9BCC4', roughness: 0.9 }); const tex = canvasTex('tomb' + text.join(), 256, 320, (c, W, H) => { c.fillStyle = '#B9BCC4'; c.fillRect(0, 0, W, H); c.fillStyle = '#3A3D46'; c.textAlign = 'center'; c.font = 'bold 60px Caladea, serif'; text.forEach((t, i) => c.fillText(t, W / 2, 100 + i * 70)); });
  const slab = box(0.9 * s, 1.1 * s, 0.18 * s, M({ map: tex }), 0, 0.55 * s, 0, g); const top = cyl(0.45 * s, 0.45 * s, 0.18 * s, stone, 0, 1.1 * s, 0, g, 24); top.rotation.x = Math.PI / 2; box(1.2 * s, 0.12 * s, 0.5 * s, stone, 0, 0.06 * s, 0, g);
  return g;
}
export function tent(col = '#C9B48A', s = 1) { const g = new THREE.Group(); const t = mesh(new THREE.ConeGeometry(0.9 * s, 1.3 * s, 4), M({ color: col, roughness: 0.95 }), 0, 0.65 * s, 0, g); t.rotation.y = Math.PI / 4; box(0.02, 0.5 * s, 0.02, M({ color: '#6B4A2E' }), 0, 1.5 * s, 0, g); return g; }
/** a flat sea plane (natural blue) with sparkle bands */
export function sea(w = 140, d = 70, z = -40) {
  const tex = canvasTex('seablue', 512, 512, (c, W, H) => { c.fillStyle = '#2F7FC4'; c.fillRect(0, 0, W, H); for (let i = 0; i < 160; i++) { c.fillStyle = 'rgba(255,255,255,0.22)'; c.fillRect(rnd(i) * W, rnd(i + 99) * H, 18 + rnd(i + 5) * 30, 3); } }, [10, 6]);
  const m = M({ map: tex, roughness: 0.25, metalness: 0.1 }); m.polygonOffset = true; m.polygonOffsetFactor = -3; m.polygonOffsetUnits = -3;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), m); p.rotation.x = -Math.PI / 2; p.position.set(0, 0.02, z); p.receiveShadow = true; return p;
}
/** a little flock of birds (V-shaped), flapping */
export function birds(n = 5) {
  const g = new THREE.Group(), list = [], m = new THREE.MeshBasicMaterial({ color: '#2A2A33', side: THREE.DoubleSide });
  for (let i = 0; i < n; i++) { const b = new THREE.Group(), a = mesh(new THREE.PlaneGeometry(0.4, 0.1), m, -0.2, 0, 0, b), c = mesh(new THREE.PlaneGeometry(0.4, 0.1), m, 0.2, 0, 0, b); a.castShadow = c.castShadow = false; b.userData = { a, c }; g.add(b); list.push(b); }
  g.update = (t, x0 = -8, y0 = 9, z0 = -20) => list.forEach((b, i) => { b.position.set(x0 + ((t * 1.2 + i * 1.7) % 18), y0 + Math.sin(i * 2 + t) * 0.6 + (i % 2) * 0.8, z0 - i * 1.3); const f = Math.sin(t * 8 + i) * 0.6; b.userData.a.rotation.z = f; b.userData.c.rotation.z = -f; });
  return g;
}
