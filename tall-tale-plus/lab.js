import * as THREE from 'three';
import { mat, canvasTex, signBoard } from './world.js';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
export function room() {
  const g = new THREE.Group();
  const ft = canvasTex('labfloor', 256, 256, (c, W, H) => { for (let i = 0; i < 8; i++) for (let k = 0; k < 8; k++) { c.fillStyle = (i + k) % 2 ? '#DDE4E6' : '#C3CDD1'; c.fillRect(i * 32, k * 32, 32, 32); } }, [12, 8]);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), mat({ map: ft, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0.03, -2); fl.receiveShadow = true; g.add(fl);
  const wt = canvasTex('labwall', 256, 256, (c, W, H) => { c.fillStyle = '#E8EEF0'; c.fillRect(0, 0, W, H); c.strokeStyle = '#C5D0D4'; c.lineWidth = 2; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, H); c.stroke(); c.beginPath(); c.moveTo(0, i * 32); c.lineTo(W, i * 32); c.stroke(); } }, [10, 4]);
  const wm = mat({ map: wt, roughness: 0.9 });
  const bk = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), wm); bk.position.set(0, 6, -9); bk.receiveShadow = true; g.add(bk);
  [-14, 14].forEach((x) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), wm); s.position.set(x, 6, -2); s.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; g.add(s); });
  const ce = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), M('#F4F6F6', 1)); ce.rotation.x = Math.PI / 2; ce.position.set(0, 11.5, -2); g.add(ce);
  [-8, 0, 8].forEach((x) => bx(3.5, 0.15, 0.8, new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), x, 11.3, -1, g));
  // back counters with shelves and glassware
  bx(18, 1.6, 1.6, M('#5A6A72', 0.6), -7, 0.8, -8, g); bx(18, 0.1, 1.7, M('#222A2E', 0.4), -7, 1.65, -8, g);
  for (let i = 0; i < 9; i++) { const b = cy(0.22, 0.22, 0.9 + (i % 3) * 0.3, M(['#7BD0E8', '#E8D27B', '#E88B9B'][i % 3], 0.2), -14 + i * 1.7, 2.2, -8, g, 14); }
  bx(10, 0.12, 0.5, M('#B5A68A'), 8, 6.2, -8.6, g); bx(10, 0.12, 0.5, M('#B5A68A'), 8, 4.6, -8.6, g);
  for (let i = 0; i < 8; i++) { bx(1.0, 1.1, 0.5, M(['#1E3A8A', '#B5372E', '#E8C77A', '#2E4E8A'][i % 4], 0.6), 4 + i * 1.15, 4.7 + 0.55, -8.5, g); bx(0.9, 0.9, 0.4, M(['#E8EEF0', '#B5372E'][i % 2], 0.6), 4.2 + i * 1.1, 6.3 + 0.45, -8.5, g); }
  const wb = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.6), new THREE.MeshStandardMaterial({ map: canvasTex('wboard', 512, 256, (c, W, H) => { c.fillStyle = '#FAFAFA'; c.fillRect(0, 0, W, H); c.strokeStyle = '#2E4E8A'; c.lineWidth = 4; c.font = '700 34px sans-serif'; c.fillStyle = '#2E4E8A'; c.fillText('τ = η·γ̇ + τy', 30, 70); c.fillText('torque ≈ doorknob', 30, 130); c.strokeStyle = '#B5372E'; c.beginPath(); c.moveTo(40, 190); c.quadraticCurveTo(200, 120, 460, 210); c.stroke(); c.fillStyle = '#B5372E'; c.fillText('OREO?!', 330, 90); }, [1, 1]), roughness: 0.5 })); wb.position.set(-7, 6.2, -8.9); g.add(wb); bx(7.3, 3.9, 0.1, M('#9AA5AA'), -7, 6.2, -8.95, g);
  return g;
}
export function bench() { const g = new THREE.Group(); bx(5, 0.14, 1.8, M('#6A4A32', 0.6), 0, 1.0, 0, g); [[-2.3, -0.8], [2.3, -0.8], [-2.3, 0.8], [2.3, 0.8]].forEach(([x, z]) => bx(0.12, 1.0, 0.12, M('#3A3A44'), x, 0.5, z, g)); return g; }
export function oreo(s = 1) {
  const g = new THREE.Group(), wf = M('#2A1810', 0.55), cr = M('#F7F2E6', 0.7);
  const dots = (m) => { for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const d = sp(0.04, M('#150C08', 0.5), Math.cos(a) * 0.32, 0.065, Math.sin(a) * 0.32, m); } };
  g.bot = new THREE.Group(); g.top = new THREE.Group(); g.add(g.bot, g.top);
  cy(0.5, 0.5, 0.12, wf, 0, 0.06, 0, g.bot, 36); dots(g.bot); g.bot.children[0].position.y = 0.06;
  g.cb = cy(0.46, 0.46, 0.14, cr, 0, 0.19, 0, g.bot, 36);
  g.ct = cy(0.46, 0.46, 0.14, cr, 0, 0.05, 0, g.top, 36); g.ct.visible = false;
  const tw = cy(0.5, 0.5, 0.12, wf, 0, 0.14, 0, g.top, 36); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; sp(0.04, M('#150C08', 0.5), Math.cos(a) * 0.32, 0.21, Math.sin(a) * 0.32, g.top); }
  g.top.position.y = 0.26; g.scale.setScalar(s);
  g.split = (k, side = 'bot', sep = 1.2) => { g.top.position.y = 0.26 + k * sep; g.top.rotation.y = k * 2.0; g.cb.visible = side === 'bot' || k < 0.05; g.ct.visible = side === 'top' && k >= 0.05; };
  return g;
}
export function oreometer() {
  const g = new THREE.Group(), st = M('#8A9AA5', 0.4, 0.6), pl = M('#FF6A3A', 0.5), rb = M('#E8C23A', 0.6);
  bx(2.4, 0.15, 1.4, pl, 0, 0.08, 0, g); bx(0.18, 2.0, 0.18, st, -0.9, 1.1, 0, g); bx(0.18, 2.0, 0.18, st, 0.9, 1.1, 0, g); bx(2.0, 0.14, 0.2, st, 0, 2.1, 0, g);
  g.ore = null; g.wheel = new THREE.Group(); g.wheel.position.set(0, 1.0, 0); g.add(g.wheel); cy(0.55, 0.55, 0.1, pl, 0, 0, 0, g.wheel, 24);
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.04, 8, 28), rb); band.rotation.x = Math.PI / 2; g.wheel.add(band);
  g.pen = new THREE.Group(); g.add(g.pen); for (let i = 0; i < 5; i++) cy(0.14, 0.14, 0.03, M('#B87333', 0.3, 0.6), 0, i * 0.035, 0, g.pen, 14); g.pen.position.set(0.75, 0.9, 0.2);
  const str = bx(0.015, 0.9, 0.015, M('#EEE'), 0.75, 1.4, 0.2, g); g.str = str;
  g.twist = (k) => { g.wheel.rotation.y = k * 3.0; g.pen.position.y = 1.9 - k * 1.5; str.scale.y = 1 + k * 0.1; };
  return g;
}
export function door() { const g = new THREE.Group(); bx(2.2, 4, 0.2, M('#8A5A32', 0.6), 0, 2.0, 0, g); g.knob = sp(0.18, M('#C9A13B', 0.25, 0.7), 0.8, 2.0, 0.22, g); return g; }
export function conveyor() { const g = new THREE.Group(); bx(9, 0.3, 1.8, M('#3A3F4A', 0.5, 0.3), 0, 0.9, 0, g); for (let i = 0; i < 14; i++) cy(0.12, 0.12, 1.7, M('#6A7078', 0.4, 0.5), -4.2 + i * 0.65, 1.07, 0, g, 10).rotation.x = Math.PI / 2; bx(0.3, 2.2, 0.3, M('#8A9AA5', 0.4, 0.6), -1.6, 2.2, -0.6, g); bx(0.3, 0.3, 1.0, M('#8A9AA5', 0.4, 0.6), -1.6, 3.2, -0.2, g); const n = cy(0.12, 0.05, 0.4, M('#F7F2E6', 0.6), -1.6, 2.9, 0.3, g, 12); return g; }
