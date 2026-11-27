// GIRAFFE LIVING ROOM props: giraffe (neck/tongue/chew/lie), living room, breakable ceiling, couch, plants, cereal.
import * as THREE from 'three';
import { canvasTex } from './world.js';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.65, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const ell = (rx, ry, rz, mt, x, y, z, p) => { const m = sp(1, mt, x, y, z, p); m.scale.set(rx, ry, rz); return m; };
const cl = (x) => Math.max(0, Math.min(1, x));
export function giraffe(s = 1) {
  const g = new THREE.Group(), root = new THREE.Group(); g.add(root);
  const Y = M('#E8B84A', 0.7), BR = M('#9A5A2A', 0.8), CR = M('#F4E3B8', 0.8);
  const body = ell(1.3, 0.85, 0.7, Y, 0, 2.5, 0, root);
  for (let i = 0; i < 16; i++) { const a = rn(i) * 6.28, b = (rn(i + 9) - 0.5) * 1.6; const sx = Math.cos(a) * 1.15, sy = 2.5 + Math.sin(a) * 0.7; const sp2 = ell(0.17 + rn(i + 4) * 0.1, 0.15 + rn(i + 7) * 0.08, 0.05, BR, sx * 0.99, sy, (rn(i + 2) > 0.5 ? 1 : -1) * 0.68, root); sp2.rotation.y = 0.1; }
  const legs = []; [[0.8, 0.4], [0.8, -0.4], [-0.8, 0.4], [-0.8, -0.4]].forEach(([x, z], i) => { const l = new THREE.Group(); l.position.set(x, 1.9, z); root.add(l); cy(0.14, 0.1, 1.9, Y, 0, -0.95, 0, l, 8); bx(0.2, 0.18, 0.22, M('#3A2A1A'), 0.02, -1.9, 0, l); bx(0.15, 0.3, 0.15, BR, 0, -0.5, 0, l); legs.push(l); });
  const neck = new THREE.Group(); neck.position.set(1.0, 2.9, 0); root.add(neck);
  const nk = cy(0.28, 0.4, 2.6, Y, 0.55, 1.3, 0, neck, 12); nk.rotation.z = -0.38;
  for (let i = 0; i < 7; i++) { const q = i / 6; ell(0.1, 0.12, 0.04, BR, 0.28 + q * 1.2 + 0.0, 0.4 + q * 2.1, 0.33 - q * 0.05, neck); ell(0.1, 0.12, 0.04, BR, 0.28 + q * 1.2, 0.4 + q * 2.1, -0.33 + q * 0.05, neck); }
  for (let i = 0; i < 12; i++) bx(0.04, 0.22, 0.04, BR, 0.0 + (i / 11) * 1.25 - 0.18, 0.55 + (i / 11) * 2.25 + 0.1, 0, neck).rotation.z = -0.35;
  const head = new THREE.Group(); head.position.set(1.34, 2.65, 0); neck.add(head); ell(0.55, 0.32, 0.3, Y, 0.18, 0.0, 0, head); ell(0.3, 0.22, 0.25, CR, 0.62, -0.08, 0, head);
  [-1, 1].forEach((z) => { sp(0.11, M('#FFFFFF', 0.3), 0.18, 0.2, z * 0.24, head); sp(0.05, new THREE.MeshBasicMaterial({ color: '#000' }), 0.25, 0.2, z * 0.3, head); const ear = ell(0.2, 0.08, 0.05, Y, -0.1, 0.18, z * 0.38, head); ear.rotation.z = 0.5; const o = cy(0.05, 0.05, 0.4, BR, -0.05, 0.42, z * 0.12, head, 6); sp(0.09, BR, -0.05, 0.64, z * 0.12, head); sp(0.04, M('#2A1A0A'), 0.8, -0.04, z * 0.12, head); });
  const jaw = new THREE.Group(); jaw.position.set(0.5, -0.18, 0); head.add(jaw); ell(0.3, 0.07, 0.17, CR, 0.1, -0.02, 0, jaw);
  const tg = new THREE.Group(); tg.position.set(0.2, 0, 0); jaw.add(tg); const tcyl = cy(0.06, 0.05, 1, M('#7A4A9A', 0.5), 0.5, 0, 0, tg, 8); tcyl.rotation.z = Math.PI / 2; tg.visible = false;
  const tail = new THREE.Group(); tail.position.set(-1.25, 2.6, 0); root.add(tail); const tl = cy(0.05, 0.03, 1.5, Y, -0.1, -0.6, 0, tail, 6); tl.rotation.z = 0.15; sp(0.12, M('#2A1A0A'), -0.2, -1.4, 0, tail);
  g.scale.setScalar(s); Object.assign(g, { root, neck, head, jaw, tail, legs, body, tg });
  g.anim = (t, o = {}) => { const ch = o.chew ? Math.abs(Math.sin(t * 12)) * 0.35 : (o.open || 0.03); jaw.rotation.z = -ch; const L = o.tongue || 0; tg.visible = L > 0.02; tg.scale.set(0.2 + L * 1.9, 1, 1); neck.rotation.z = (o.neck === undefined ? 0 : o.neck) + Math.sin(t * 2) * 0.02; head.rotation.z = (o.nod || 0); tail.rotation.z = Math.sin(t * 6) * 0.3; const lie = o.lie || 0; legs.forEach((l, i) => { l.scale.y = 1 - lie * 0.75; l.position.y = 1.9 - lie * 0.5; if (o.walk) l.rotation.z = Math.sin(t * 8 + i * 1.6) * 0.35; else l.rotation.z = 0; }); root.position.y = -lie * 1.3 + (o.bounce ? Math.abs(Math.sin(t * 7)) * 0.1 : 0); };
  return g;
}
export function livingroom() { const g = new THREE.Group();
  for (let i = 0; i < 14; i++) for (let j = 0; j < 8; j++) bx(1.0, 0.1, 1.6, M((i + j) % 3 ? '#B8845A' : '#A8744A', 0.6), -6.5 + i * 1.0 + 0.5, -0.05, -3.5 + j * 1.6 + 0.8, g);
  bx(14, 9, 0.2, M('#E8D8C0', 0.9), 0, 4.5, -3.6, g); for (let i = 0; i < 14; i++) bx(0.4, 9, 0.02, M(i % 2 ? '#DCC8A8' : '#E8D8C0', 0.9), -6.5 + i, 4.5, -3.48, g);
  bx(14, 0.5, 0.1, M('#FFFFFF', 0.5), 0, 0.25, -3.45, g);
  const win = bx(2.4, 2.0, 0.1, M('#CFE8FF', 0.2), 4.2, 2.4, -3.45, g); win.material.emissive = new THREE.Color('#9AD0FF'); win.material.emissiveIntensity = 0.5; bx(2.6, 0.1, 0.2, M('#fff'), 4.2, 1.4, -3.4, g); bx(0.08, 2.0, 0.12, M('#fff'), 4.2, 2.4, -3.4, g); bx(0.8, 2.4, 0.08, M('#B5372E', 0.9), 2.7, 2.5, -3.35, g); bx(0.8, 2.4, 0.08, M('#B5372E', 0.9), 5.7, 2.5, -3.35, g);
  const pic = canvasTex('girpic', 128, 96, (c) => { c.fillStyle = '#9AD0F0'; c.fillRect(0, 0, 128, 96); c.fillStyle = '#6AA84A'; c.fillRect(0, 60, 128, 36); c.fillStyle = '#E8B84A'; c.fillRect(60, 20, 8, 44); c.beginPath(); c.arc(64, 18, 8, 0, 7); c.fill(); }); const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), new THREE.MeshBasicMaterial({ map: pic })); pm.position.set(-3.0, 2.8, -3.46); g.add(pm); bx(1.45, 1.15, 0.05, M('#6A4A2A'), -3.0, 2.8, -3.5, g);
  bx(3.0, 0.1, 2.0, M('#2E6A9A', 0.95), 0, 0.03, 0.2, g); bx(2.7, 0.02, 1.7, M('#F2E6CF', 0.95), 0, 0.09, 0.2, g);
  bx(1.8, 1.0, 0.1, M('#111', 0.3), 0, 1.7, -3.4, g).visible = false;
  cy(0.05, 0.1, 1.9, M('#444', 0.4, 0.5), -5.2, 0.95, -2.8, g, 8); const sh = cy(0.5, 0.35, 0.6, M('#F2C94C', 0.8), -5.2, 2.1, -2.8, g, 12); sh.material.emissive = new THREE.Color('#FFD070'); sh.material.emissiveIntensity = 0.5;
  return g; }
export function ceiling() { const g = new THREE.Group(); const tiles = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { const t = bx(1.75, 0.15, 2.0, M((i + j) % 2 ? '#F4F0E8' : '#E8E0D0', 0.9), -6.1 + i * 1.75 + 0.9, 3.6, -3 + j * 2.0 + 1.0, g); t.userData = { i, j, o: rn(i * 4 + j), x: t.position.x, z: t.position.z }; tiles.push(t); }
  g.crash = (k) => tiles.forEach((t) => { const d = Math.hypot(t.userData.x - 0.6, t.userData.z + 0.3); const near = d < 3.2 ? 1 : 0; const kk = near ? cl(k * 1.4 - t.userData.o * 0.3) : 0; t.position.y = 3.6 + (near ? Math.sin(kk * 3.14) * 1.6 * (0.4 + t.userData.o) - kk * kk * 0.0 : 0); t.position.x = t.userData.x + (t.userData.o - 0.5) * kk * 3; t.rotation.set(kk * 4 * (t.userData.o - 0.5), 0, kk * 5 * (t.userData.o - 0.3)); t.visible = k < 0.999 ? !(near && kk > 0.9) : false; }); g.crash(0); return g; }
export function couch() { const g = new THREE.Group(); const C = M('#8A4A5A', 0.9); bx(3.2, 0.6, 1.2, C, 0, 0.5, 0, g); bx(3.2, 1.0, 0.3, C, 0, 1.0, -0.55, g); [-1.55, 1.55].forEach((x) => bx(0.3, 0.9, 1.2, C, x, 0.75, 0, g)); [-0.8, 0.8].forEach((x) => bx(1.4, 0.25, 1.0, M('#A8607A', 0.9), x, 0.92, 0.05, g)); bx(0.5, 0.5, 0.15, M('#F2C94C', 0.8), -1.1, 1.2, -0.2, g).rotation.z = 0.3; return g; }
export function plants() { const g = new THREE.Group(); const ps = []; [[-1.5, 1.4], [0, 1.9], [1.5, 1.4]].forEach(([x, h], i) => { const p = new THREE.Group(); p.position.set(x, 0, 0); g.add(p); cy(0.35, 0.28, 0.6, M('#C8603A', 0.8), 0, 0.3, 0, p, 12); const top = new THREE.Group(); p.add(top); for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28; const lf = ell(0.14, 0.45, 0.06, M(k % 2 ? '#4A9A4A' : '#2E7A3A', 0.7), Math.cos(a) * 0.28, 0.95, Math.sin(a) * 0.28, top); lf.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); } ps.push(top); });
  g.eat = (k) => ps.forEach((t, i) => { const kk = cl(k * 3 - i); t.scale.setScalar(Math.max(0.001, 1 - kk)); }); return g; }
export function cereal() { const g = new THREE.Group(); const bowl = cy(0.4, 0.22, 0.24, M('#F2F4F6', 0.3), 0, 0.12, 0, g, 16); const co = []; for (let i = 0; i < 14; i++) { const c = cy(0.06, 0.06, 0.03, M(i % 2 ? '#F2C94C' : '#E8A030'), (rn(i) - 0.5) * 0.5, 0.26 + rn(i + 3) * 0.03, (rn(i + 5) - 0.5) * 0.5, g, 8); co.push(c); }
  const box = bx(0.5, 0.75, 0.2, M('#E85A5A', 0.5), 0.9, 0.4, -0.1, g); g.slurp = (k) => co.forEach((c, i) => { c.visible = k < rn(i + 1); }); return g; }
export function stopwatch() { return new THREE.Group(); }
