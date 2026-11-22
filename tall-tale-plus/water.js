// CAPE TOWN DAY ZERO: street, mountain, sink, taps, dam, water points, buckets, shower, pool, fountain.
import * as THREE from 'three';
import { mat, canvasTex } from './world.js';
import { bx, cy, sp, row } from './boston.js';
const M = (c, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const WATER = () => new THREE.MeshStandardMaterial({ color: '#3FA7E8', roughness: 0.1, metalness: 0.05 });
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const NAMES = ['CAFE', 'PHARMACY', 'LAUNDRY', 'CAR WASH', 'POOL SHOP', 'GYM', 'SUSHI', 'HOTEL', 'BAKERY', 'SPA'];
const WALLS = ['#F1EBDD', '#E6C9A8', '#CFE2E8', '#F2D7C3', '#E8E1C8', '#D9E6D2'];
export function city() {
  const g = new THREE.Group();
  const t = canvasTex('asphalt', 256, 256, (c, W, H) => { c.fillStyle = '#6E7076'; c.fillRect(0, 0, W, H); for (let i = 0; i < 900; i++) { const v = 90 + rn(i) * 50; c.fillStyle = `rgb(${v},${v},${v + 4})`; c.fillRect(rn(i * 3) * W, rn(i * 7) * H, 2, 2); } c.strokeStyle = '#4A4B50'; c.lineWidth = 2; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(rn(i) * W, rn(i + 9) * H); c.lineTo(rn(i + 3) * W, rn(i + 5) * H); c.stroke(); } }, [14, 6]);
  const o = new THREE.Mesh(new THREE.PlaneGeometry(90, 40), mat({ map: t, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2 })); o.rotation.x = -Math.PI / 2; o.position.set(0, 0.03, 0); o.receiveShadow = true; g.add(o);
  for (let i = -8; i < 8; i++) bx(1.6, 0.02, 0.18, M('#F4F0E0', 0.8), i * 3.2, 0.05, -2.4, g);
  bx(90, 0.18, 2.6, mat({ color: '#C9C4B8', roughness: 1 }), 0, 0.09, -6.8, g);
  g.add(row(-30, 30, -11, 4, NAMES, WALLS));
  // table mountain
  const mt = new THREE.Mesh(new THREE.CylinderGeometry(20, 34, 15, 40), mat({ color: '#9A8468', roughness: 1 })); mt.position.set(2, 7.5, -55); mt.scale.z = 0.5; g.add(mt);
  const gr = new THREE.Mesh(new THREE.CylinderGeometry(30, 36, 6, 40), mat({ color: '#6E9A58', roughness: 1 })); gr.position.set(2, 2, -53); gr.scale.z = 0.5; g.add(gr);
  // lamp posts, hydrants, bins, benches
  for (let i = -5; i <= 5; i++) { cy(0.07, 0.07, 3.6, M('#3A3F4A', 0.5, 0.4), i * 6 + 3, 1.8, -6.2, g, 8); bx(0.5, 0.12, 0.3, M('#3A3F4A', 0.5, 0.4), i * 6 + 3.2, 3.65, -6.2, g); }
  for (let i = 0; i < 6; i++) { cy(0.2, 0.2, 0.6, M(i % 2 ? '#B5372E' : '#E8C23A', 0.5), -9 + i * 4.1, 0.4, -6.2, g, 10); }
  for (let i = 0; i < 4; i++) { bx(1.2, 0.08, 0.4, M('#8A5A32', 0.7), -7 + i * 5.2, 0.5, -6.2, g); bx(1.2, 0.4, 0.06, M('#8A5A32', 0.7), -7 + i * 5.2, 0.75, -6.0, g); }
  return g;
}
export function tap() { // freestanding sink unit with a faucet
  const g = new THREE.Group();
  bx(1.5, 0.9, 0.8, M('#F4F4F0', 0.5), 0, 0.45, 0, g); bx(1.6, 0.1, 0.9, M('#C9CED2', 0.3, 0.3), 0, 0.95, 0, g); bx(1.1, 0.04, 0.5, M('#9AA3A8', 0.3, 0.5), 0, 1.0, 0.02, g);
  cy(0.05, 0.05, 0.6, M('#B8C0C4', 0.2, 0.9), 0, 1.3, -0.25, g, 12); bx(0.1, 0.08, 0.5, M('#B8C0C4', 0.2, 0.9), 0, 1.6, -0.02, g); cy(0.07, 0.07, 0.1, M('#B5372E', 0.4), -0.2, 1.1, -0.25, g, 12); cy(0.07, 0.07, 0.1, M('#2E4E8A', 0.4), 0.2, 1.1, -0.25, g, 12);
  const st = cy(0.04, 0.04, 0.6, new THREE.MeshStandardMaterial({ color: '#9CD4FF', roughness: 0.1, transparent: true, opacity: 0.8 }), 0, 1.28, 0.1, g, 8); st.visible = false;
  const dr = sp(0.05, new THREE.MeshStandardMaterial({ color: '#9CD4FF', roughness: 0.1 }), 0, 1.5, 0.1, g, 0.8, 1.3, 0.8); dr.visible = false;
  g.set = (k, t = 0) => { st.visible = k > 0.5; st.scale.set(k, 1, k); const f = (t * 1.3) % 1; dr.visible = k > 0 && k < 0.5 && f < 0.9; dr.position.y = 1.5 - f * f * 0.5; };
  return g;
}
export function wallTaps(n = 3) { // row of taps on a wall
  const g = new THREE.Group(); bx(n * 1.1 + 0.4, 2.0, 0.15, M('#CFC9B8', 0.9), 0, 1.4, 0, g); g.dr = [];
  for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * 1.1; cy(0.06, 0.06, 0.35, M('#B8C0C4', 0.2, 0.9), x, 1.5, 0.22, g, 10).rotation.x = Math.PI / 2; cy(0.1, 0.1, 0.08, i % 2 ? M('#2E4E8A', 0.4) : M('#B5372E', 0.4), x, 1.75, 0.12, g, 12); bx(0.5, 0.08, 0.3, M('#8A8F94', 0.4, 0.5), x, 0.55, 0.35, g); const d = sp(0.05, new THREE.MeshStandardMaterial({ color: '#9CD4FF', roughness: 0.1 }), x, 1.4, 0.4, g, 0.8, 1.3, 0.8); g.dr.push(d); }
  g.set = (t) => g.dr.forEach((d, i) => { const f = ((t * 0.9) + i * 0.37) % 1; d.visible = f < 0.8; d.position.y = 1.4 - f * f * 0.7; });
  return g;
}
export function dam() {
  const g = new THREE.Group();
  bx(11, 4, 1.4, M('#B9B6AE', 0.9), 0, 2, 0, g); for (let i = 0; i < 6; i++) bx(0.1, 4.05, 1.45, M('#8F8C84', 0.9), -5 + i * 2, 2, 0, g); bx(11.4, 0.3, 1.8, M('#A9A69E', 0.9), 0, 4.1, 0, g);
  const mud = canvasTex('mud', 256, 256, (c, W, H) => { c.fillStyle = '#9A7448'; c.fillRect(0, 0, W, H); c.strokeStyle = '#5A3E22'; c.lineWidth = 2; for (let i = 0; i < 40; i++) { c.beginPath(); c.moveTo(rn(i) * W, rn(i + 2) * H); c.lineTo(rn(i + 8) * W, rn(i + 5) * H); c.stroke(); } }, [3, 2]);
  bx(11, 0.12, 8, mat({ map: mud, roughness: 1 }), 0, 0.06, 4.8, g);
  g.w = bx(10.6, 1, 7.6, WATER(), 0, 0.2, 4.8, g);
  g.level = (k) => { const h = Math.max(0.04, k * 3.6); g.w.scale.y = h; g.w.position.y = 0.12 + h / 2; };
  g.level(0.2); return g;
}
export function bucket(fill = 1) {
  const g = new THREE.Group(); const b = cy(0.24, 0.18, 0.4, M('#E8C23A', 0.5), 0, 0.2, 0, g, 18); const w = cy(0.225, 0.225, 0.02, WATER(), 0, 0.36, 0, g, 18); const h = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 20, Math.PI), M('#888', 0.4, 0.8)); h.position.y = 0.4; g.add(h);
  g.fill = (k) => { w.visible = k > 0.02; w.position.y = 0.06 + k * 0.3; }; g.fill(fill); return g;
}
export function pod() { // water collection point
  const g = new THREE.Group();
  cy(0.75, 0.75, 1.7, M('#2E7ACF', 0.35), 0, 1.45, 0, g, 28); bx(1.6, 0.14, 1.6, M('#5A5F66', 0.5), 0, 0.5, 0, g); [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]].forEach(([x, z]) => bx(0.12, 0.6, 0.12, M('#4A4F56', 0.5), x, 0.25, z, g));
  cy(0.8, 0.8, 0.12, M('#1F5AA8', 0.4), 0, 2.35, 0, g, 28);
  for (let i = 0; i < 3; i++) { const a = (i - 1) * 0.7; cy(0.05, 0.05, 0.3, M('#B8C0C4', 0.2, 0.9), Math.sin(a) * 0.75, 0.95, Math.cos(a) * 0.75, g, 8); sp(0.05, M('#B5372E'), Math.sin(a) * 0.78, 1.1, Math.cos(a) * 0.78, g); }
  for (let i = -3; i <= 3; i++) { bx(0.08, 0.9, 0.08, M('#E8C23A', 0.6), i * 0.8, 0.45, 1.9, g); } bx(5.8, 0.08, 0.06, M('#B5372E', 0.6), 0, 0.85, 1.9, g); bx(5.8, 0.08, 0.06, M('#F4F0E0', 0.6), 0, 0.55, 1.9, g);
  [-3.4, 3.4].forEach((x) => { cy(0.1, 0.18, 0.5, M('#F28C38', 0.6), x, 0.25, 2.2, g, 12); });
  return g;
}
export function shower() {
  const g = new THREE.Group();
  bx(2, 3.4, 0.1, M('#CFE4EE', 0.4), 0, 1.7, -0.5, g); bx(0.1, 3.4, 1.0, M('#CFE4EE', 0.4), -1, 1.7, 0, g); bx(0.1, 3.4, 1.0, M('#CFE4EE', 0.4), 1, 1.7, 0, g); bx(2, 0.1, 1.2, M('#DDE4E6', 0.4), 0, 0.05, 0, g);
  cy(0.04, 0.04, 0.6, M('#B8C0C4', 0.2, 0.9), 0, 3.1, -0.42, g, 8); const hd = cy(0.22, 0.12, 0.1, M('#C9CED2', 0.2, 0.9), 0, 2.85, -0.1, g, 16); hd.rotation.x = 0.3;
  const st = new THREE.Group(); const sm = new THREE.MeshStandardMaterial({ color: '#9CD4FF', roughness: 0.1, transparent: true, opacity: 0.5 }); for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = i ? 0.2 : 0; cy(0.012, 0.016, 2.3, sm, Math.cos(a) * r, 1.6, -0.05 + Math.sin(a) * r, st, 6); } g.add(st); g.st = st;
  const cl = cy(0.45, 0.45, 0.08, M('#FFFFFF', 0.4), 1.7, 2.6, 0.0, g, 28); cl.rotation.x = Math.PI / 2; g.hand = bx(0.04, 0.34, 0.03, M('#B5372E'), 0, 0.17, 0.05, null); g.hp = new THREE.Group(); g.hp.position.set(1.7, 2.6, 0.06); g.hp.add(g.hand); g.add(g.hp);
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; bx(0.03, 0.07, 0.02, M('#222'), 1.7 + Math.sin(a) * 0.38, 2.6 + Math.cos(a) * 0.38, 0.05, g); }
  g.set = (run, k) => { st.visible = run; g.hp.rotation.z = -k * Math.PI * 2; };
  return g;
}
export function pool() { // above-ground pool
  const g = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 1.0, 40, 1, true), new THREE.MeshStandardMaterial({ color: '#4FA3C7', roughness: 0.5, side: THREE.DoubleSide })); wall.position.y = 0.5; wall.castShadow = true; g.add(wall);
  cy(1.9, 1.9, 0.06, M('#DDE9EE', 0.6), 0, 0.05, 0, g, 40); g.w = cy(1.86, 1.86, 0.1, WATER(), 0, 0.1, 0, g, 40);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.07, 8, 40), M('#F4F0E0', 0.5)); ring.rotation.x = Math.PI / 2; ring.position.y = 1.0; g.add(ring);
  bx(0.06, 1.5, 0.06, M('#C9CED2', 0.3, 0.8), 2.0, 0.75, 0.3, g); bx(0.06, 1.5, 0.06, M('#C9CED2', 0.3, 0.8), 2.0, 0.75, -0.3, g); for (let i = 0; i < 4; i++) bx(0.06, 0.05, 0.6, M('#C9CED2', 0.3, 0.8), 2.0, 0.3 + i * 0.35, 0, g);
  g.fill = (k) => { g.w.visible = k > 0.02; g.w.scale.y = Math.max(0.1, k * 8); g.w.position.y = 0.08 + Math.max(0.1, k * 8) * 0.05; };
  g.fill(1); return g;
}
export function fountain() {
  const g = new THREE.Group(), st = M('#CFC9B8', 0.9);
  cy(1.5, 1.6, 0.5, st, 0, 0.25, 0, g, 36); g.w1 = cy(1.35, 1.35, 0.08, WATER(), 0, 0.5, 0, g, 36); cy(0.25, 0.3, 1.3, st, 0, 1.0, 0, g, 16); cy(0.8, 0.5, 0.25, st, 0, 1.6, 0, g, 28); g.w2 = cy(0.7, 0.7, 0.06, WATER(), 0, 1.7, 0, g, 28); cy(0.12, 0.16, 0.6, st, 0, 1.95, 0, g, 12);
  g.jet = cy(0.05, 0.1, 1.0, new THREE.MeshStandardMaterial({ color: '#CFEBFF', roughness: 0.1, transparent: true, opacity: 0.7 }), 0, 2.8, 0, g, 10);
  g.on = (k) => { g.w1.visible = g.w2.visible = g.jet.visible = k > 0.5; };
  g.on(1); return g;
}
export function crack(w = 5, h = 3) { return null; }
