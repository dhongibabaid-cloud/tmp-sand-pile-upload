// ALIEN FRIEND props: alien, saucer, house exterior, living room, couch, apple, pizza, clock, globe, trampoline, blanket, glow rock, router.
import * as THREE from 'three';
import { mat, canvasTex } from './world.js';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const E = (c) => new THREE.MeshBasicMaterial({ color: c });
export function alien(s = 1) {
  const g = new THREE.Group(), b = new THREE.Group(); g.add(b); g.scale.setScalar(s);
  const gr = M('#7ED66E', 0.55), dk = M('#5CB852', 0.55);
  sp(0.3, gr, 0, 0.95, 0, b, 0.9, 1.25, 0.8);
  [-1, 1].forEach((x) => { const l = cy(0.05, 0.04, 0.8, dk, x * 0.12, 0.4, 0, b, 8); });
  [-1, 1].forEach((x) => bx(0.2, 0.05, 0.3, dk, x * 0.12, 0.02, 0.05, b));
  const head = new THREE.Group(); head.position.set(0, 1.62, 0); b.add(head);
  sp(0.42, gr, 0, 0, 0, head, 1.0, 1.1, 0.95);
  [-1, 1].forEach((x) => { const e = sp(0.17, M('#0A0A12', 0.1, 0.2), x * 0.21, -0.02, 0.33, head, 1.0, 1.5, 0.45); e.rotation.z = -x * 0.45; sp(0.05, E('#FFFFFF'), x * 0.18, 0.08, 0.42, head); });
  sp(0.04, M('#3F8F3A'), 0, -0.2, 0.43, head, 2.2, 0.6, 0.5);
  [-1, 1].forEach((x) => { const a = cy(0.012, 0.012, 0.45, dk, x * 0.18, 0.5, 0, head, 6); a.rotation.z = -x * 0.35; const tip = sp(0.06, E('#FFF27A'), x * 0.18 + x * 0.08, 0.76, 0, head); g['tip' + (x < 0 ? 'L' : 'R')] = tip; });
  const armL = new THREE.Group(), armR = new THREE.Group(); armL.position.set(-0.27, 1.25, 0); armR.position.set(0.27, 1.25, 0); b.add(armL, armR);
  [armL, armR].forEach((a, i) => { cy(0.035, 0.03, 0.6, dk, 0, -0.28, 0, a, 6); sp(0.06, gr, 0, -0.6, 0, a); });
  g.head = head; g.armL = armL; g.armR = armR; g.body = b;
  g.pose = (o = {}) => { armL.rotation.z = o.aL ?? 0.25; armR.rotation.z = o.aR ?? -0.25; armL.rotation.x = o.xL ?? 0; armR.rotation.x = o.xR ?? 0; head.rotation.z = o.tilt ?? 0; head.rotation.y = o.turn ?? 0; head.rotation.x = o.nod ?? 0; };
  return g;
}
export function saucer() {
  const g = new THREE.Group(), met = M('#C4CAD2', 0.25, 0.7);
  sp(1.6, met, 0, 0.35, 0, g, 1, 0.22, 1); const dome = sp(0.8, new THREE.MeshStandardMaterial({ color: '#BFE9F7', roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.55 }), 0, 0.72, 0, g, 1, 0.9, 1);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; sp(0.09, E(i % 2 ? '#FFE25A' : '#FF5A5A'), Math.cos(a) * 1.5, 0.33, Math.sin(a) * 1.5, g); }
  sp(0.3, M('#7ED66E'), 0, 0.82, 0, g, 1, 1.1, 1);
  g.smoke = []; for (let i = 0; i < 6; i++) { const s = sp(0.32 + rn(i) * 0.2, new THREE.MeshStandardMaterial({ color: '#6A6A72', roughness: 1, transparent: true, opacity: 0.6 }), -0.5 + rn(i + 3) * 1.0, 1.2 + i * 0.55, rn(i + 9) * 0.6, g); g.smoke.push(s); }
  return g;
}
export function house() {
  const g = new THREE.Group();
  bx(7, 3.6, 4.4, M('#EFE0C0', 0.9), 0, 1.8, 0, g);
  const rf = (sx) => { const r = bx(4.4, 0.18, 4.8, M("#B5472E", 0.8), sx * 1.7, 4.6, 0, g); r.rotation.z = -sx * 0.5; return r; }; rf(-1); rf(1);
  bx(0.7, 1.4, 0.7, M('#9A5A3A', 0.9), 2.2, 4.9, -1.0, g);
  const dr = bx(1.1, 2.2, 0.1, M('#7A4A2A', 0.7), -1.7, 1.1, 2.24, g); sp(0.07, M('#E2B33C', 0.3, 0.8), -1.4, 1.1, 2.32, g);
  bx(1.8, 1.5, 0.1, M('#F4F4F4', 0.6), 1.6, 1.9, 2.24, g); bx(1.6, 1.3, 0.12, new THREE.MeshStandardMaterial({ color: '#BFE4F7', roughness: 0.1, metalness: 0.1 }), 1.6, 1.9, 2.26, g); bx(0.06, 1.3, 0.14, M('#F4F4F4'), 1.6, 1.9, 2.27, g); bx(1.6, 0.06, 0.14, M('#F4F4F4'), 1.6, 1.9, 2.27, g);
  bx(8, 0.05, 1.0, M('#9A9A94', 1), 0, 0.03, 3.1, g);
  return g;
}
export function home() {
  const g = new THREE.Group();
  const ft = canvasTex('alfloor', 256, 256, (c, W, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#B58A5A' : '#A47A4C'; c.fillRect(0, i * 32, W, 32); c.fillStyle = 'rgba(60,35,15,.25)'; c.fillRect(0, i * 32, W, 2); } for (let i = 0; i < 200; i++) { c.fillStyle = `rgba(60,35,15,${rn(i) * 0.1})`; c.fillRect(rn(i * 3) * W, rn(i * 5) * H, 20, 1); } }, [6, 4]);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), mat({ map: ft, polygonOffset: true, polygonOffsetFactor: -2 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0.03, 0); fl.receiveShadow = true; g.add(fl);
  const wt = canvasTex('alwall', 256, 256, (c, W, H) => { c.fillStyle = '#F0D9A8'; c.fillRect(0, 0, W, H); c.fillStyle = '#E4C78C'; for (let i = 0; i < 8; i++) c.fillRect(i * 32 + 12, 0, 8, H); for (let y = 20; y < H; y += 48) for (let x = 16; x < W; x += 64) { c.fillStyle = '#D9B56E'; c.beginPath(); c.arc(x, y, 5, 0, 7); c.fill(); } }, [8, 2]);
  const wm = mat({ map: wt, roughness: 0.9 });
  const bk = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), wm); bk.position.set(0, 6, -4.5); bk.receiveShadow = true; g.add(bk);
  bx(40, 0.5, 0.15, M('#FFFFFF', 0.6), 0, 0.25, -4.4, g);
  [-14, 14].forEach((x) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), wm); s.position.set(x, 6, 0); s.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; g.add(s); });
  const ce = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), M('#FFFFFF', 1)); ce.rotation.x = Math.PI / 2; ce.position.set(0, 9, 0); g.add(ce);
  // window with frame and curtains
  const win = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.4), new THREE.MeshBasicMaterial({ color: '#BFE4F7' })); win.position.set(0, 3.4, -4.4); g.add(win);
  bx(2.9, 0.12, 0.2, M('#FFFFFF'), 0, 4.65, -4.35, g); bx(2.9, 0.12, 0.2, M('#FFFFFF'), 0, 2.15, -4.35, g); bx(0.12, 2.6, 0.2, M('#FFFFFF'), -1.4, 3.4, -4.35, g); bx(0.12, 2.6, 0.2, M('#FFFFFF'), 1.4, 3.4, -4.35, g); bx(0.08, 2.5, 0.2, M('#FFFFFF'), 0, 3.4, -4.35, g);
  [-1, 1].forEach((x) => bx(0.7, 2.8, 0.15, M('#C9603F', 0.95), x * 1.8, 3.4, -4.28, g));
  // pictures, lamp, plant, rug
  [[-4.5, 4.2, '#2E6A9A'], [4.4, 4.0, '#B5472E'], [-6.5, 3.6, '#3E8F5A'], [6.4, 4.2, '#E2B33C']].forEach(([x, y, c]) => { bx(1.3, 1.0, 0.08, M('#5A3A22'), x, y, -4.38, g); bx(1.1, 0.8, 0.09, M(c, 0.8), x, y, -4.37, g); });
  cy(0.05, 0.05, 1.6, M('#222'), 4.6, 0.8, -3.6, g, 6); const sh = cy(0.4, 0.6, 0.6, M('#F2E6CF', 0.9), 4.6, 1.8, -3.6, g, 16); sh.material.emissive = new THREE.Color('#FFE9A0'); sh.material.emissiveIntensity = 0.5;
  cy(0.3, 0.22, 0.5, M('#B5472E', 0.8), -4.4, 0.25, -3.8, g, 12); for (let i = 0; i < 7; i++) sp(0.3, M('#3E8F4A', 0.8), -4.4 + (rn(i) - 0.5) * 0.7, 0.9 + rn(i + 2) * 0.7, -3.8 + (rn(i + 5) - 0.5) * 0.4, g, 1, 1.4, 0.5);
  const rug = cy(2.6, 2.6, 0.03, M('#B5472E', 1), 0, 0.045, 0.6, g, 32); sp(0, M('#fff'), 0, 0, 0, g);
  cy(1.9, 1.9, 0.035, M('#F2E6CF', 1), 0, 0.055, 0.6, g, 32);
  return g;
}
export function couch() { const g = new THREE.Group(), c = M('#4A6A9A', 0.9); bx(3.2, 0.5, 1.2, c, 0, 0.45, 0, g); bx(3.2, 0.9, 0.35, c, 0, 0.95, -0.5, g); [-1, 1].forEach((x) => bx(0.35, 0.8, 1.2, c, x * 1.62, 0.6, 0, g)); [-1, 1].forEach((x) => bx(1.4, 0.18, 1.0, M('#5A7AAA', 0.9), x * 0.75, 0.78, 0.05, g)); [-1, 1].forEach((x) => bx(0.14, 0.2, 0.14, M('#3A2A1E'), x * 1.4, 0.1, 0.4, g)); return g; }
export function apple() { const g = new THREE.Group(); sp(0.22, M('#D8352E', 0.35), 0, 0.22, 0, g, 1, 0.9, 1); cy(0.012, 0.012, 0.12, M('#5A3A22'), 0, 0.45, 0, g, 5); const l = sp(0.07, M('#4EAA3E'), 0.07, 0.45, 0, g, 1.6, 0.4, 0.8); l.rotation.z = 0.4; return g; }
export function pizza() { const g = new THREE.Group(); const t = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 3, 1), M('#E2B060', 0.8)); t.rotation.y = Math.PI / 2; t.scale.set(1, 1, 0.9); g.add(t); const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.06, 3, 1), M('#F5C542', 0.4)); ch.rotation.y = Math.PI / 2; ch.position.y = 0.01; g.add(ch); [[0, 0.05], [0.1, -0.08], [-0.1, -0.06]].forEach(([x, z]) => cy(0.05, 0.05, 0.02, M('#B5372E'), x, 0.05, z, g, 10)); return g; }
export function clock() { const g = new THREE.Group(); const t = canvasTex('alclk', 256, 128, (c, W, H) => { c.fillStyle = '#111'; c.fillRect(0, 0, W, H); c.fillStyle = '#FF3A2A'; c.font = '700 84px "Courier New", monospace'; c.fillText('3:00', 30, 98); }); bx(1.2, 0.6, 0.4, M('#2A2A33'), 0, 0.3, 0, g); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshBasicMaterial({ map: t })); f.position.set(0, 0.3, 0.21); g.add(f); return g; }
export function globe() { const g = new THREE.Group(); const t = canvasTex('alglobe', 256, 128, (c, W, H) => { c.fillStyle = '#2F7FC4'; c.fillRect(0, 0, W, H); c.fillStyle = '#5BAA4A'; [[40, 40, 40, 24], [110, 60, 24, 30], [170, 40, 44, 22], [200, 82, 24, 16], [70, 92, 18, 14]].forEach(([x, y, a, b]) => { c.beginPath(); c.ellipse(x, y, a, b, 0.3, 0, 7); c.fill(); }); }); const s = new THREE.Mesh(new THREE.SphereGeometry(0.6, 32, 20), new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 })); s.position.y = 1.3; s.castShadow = true; g.add(s); g.ball = s; cy(0.04, 0.04, 0.5, M('#222'), 0, 0.5, 0, g, 6); cy(0.4, 0.4, 0.06, M('#222'), 0, 0.05, 0, g, 16); return g; }
export function tramp() { const g = new THREE.Group(); const m = cy(1.4, 1.4, 0.06, M('#222831', 0.9), 0, 0.75, 0, g, 28); const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.07, 8, 32), M('#2E6A9A', 0.5)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.78; g.add(ring); [0, 1, 2, 3, 4, 5].forEach((i) => { const a = i * Math.PI / 3 + 0.3; cy(0.04, 0.04, 0.75, M('#999', 0.3, 0.8), Math.cos(a) * 1.3, 0.37, Math.sin(a) * 1.3, g, 6); }); return g; }
export function blanket() { const g = new THREE.Group(); const t = canvasTex('alblk', 128, 128, (c, W, H) => { c.fillStyle = '#C9603F'; c.fillRect(0, 0, W, H); c.fillStyle = '#F2D37A'; for (let i = 0; i < 4; i++) c.fillRect(0, i * 32 + 8, W, 8); c.fillStyle = '#2E6A9A'; for (let i = 0; i < 4; i++) c.fillRect(i * 32 + 8, 0, 6, H); }, [2, 2]); const b = sp(0.7, new THREE.MeshStandardMaterial({ map: t, roughness: 1 }), 0, 0.85, 0, g, 0.9, 1.7, 0.8); return g; }
export function rock() { const g = new THREE.Group(); const r = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 0), new THREE.MeshStandardMaterial({ color: '#7AF0FF', emissive: '#3AD0FF', emissiveIntensity: 1.4, roughness: 0.2 })); r.position.y = 0.3; g.add(r); g.rock = r; const l = new THREE.PointLight('#7AF0FF', 1.2, 6); l.position.y = 0.5; g.add(l); g.light = l; return g; }
export function router() { const g = new THREE.Group(); bx(0.9, 0.12, 0.5, M('#EDEDED', 0.4), 0, 0.06, 0, g); [-1, 0, 1].forEach((x) => cy(0.025, 0.025, 0.6, M('#EDEDED', 0.4), x * 0.3, 0.4, -0.1, g, 6)); [0, 1, 2, 3].forEach((i) => sp(0.025, E('#3AFF6A'), -0.3 + i * 0.12, 0.08, 0.26, g)); const t = canvasTex('alwf', 128, 128, (c, W, H) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, W, H); c.strokeStyle = '#1B9A3A'; c.lineWidth = 12; c.lineCap = 'round'; for (let i = 1; i <= 3; i++) { c.beginPath(); c.arc(64, 100, i * 26, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); } c.fillStyle = '#1B9A3A'; c.beginPath(); c.arc(64, 100, 8, 0, 7); c.fill(); }); const w = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshBasicMaterial({ map: t, transparent: true })); w.position.set(0, 1.1, 0.1); g.add(w); return g; }
export function heart() { const g = new THREE.Group(); const s = new THREE.Shape(); s.moveTo(0, -0.3); s.bezierCurveTo(-0.6, 0.1, -0.3, 0.5, 0, 0.25); s.bezierCurveTo(0.3, 0.5, 0.6, 0.1, 0, -0.3); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: false }), E('#FF4A7A')); g.add(m); return g; }
export function easel() { const g = new THREE.Group(); [-0.6, 0.6].forEach((x) => { const l = bx(0.07, 2.2, 0.07, M('#8A5A2E', 0.7), x, 1.1, 0, g); l.rotation.z = -x * 0.08; }); const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), new THREE.MeshBasicMaterial({ map: canvasTex('alhello', 256, 200, (c, W, H) => { c.fillStyle = '#F4EBD6'; c.fillRect(0, 0, W, H); c.fillStyle = '#B5372E'; c.font = '700 64px Georgia, serif'; c.fillText('HELLO', 24, 120); }) })); poster.position.set(0, 1.5, 0.06); g.add(poster); return g; }
