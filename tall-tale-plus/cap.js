// CAPYBARA props: capybara (chew/bird/sit), bird, chewable couch, tub.
import * as THREE from 'three';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.85, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const ell = (rx, ry, rz, mt, x, y, z, p) => { const m = sp(1, mt, x, y, z, p); m.scale.set(rx, ry, rz); return m; };
export function capybara(s = 1) {
  const g = new THREE.Group(), root = new THREE.Group(); g.add(root); const F = M('#8A5A32'), D = M('#6A4222'), N = M('#C8A078');
  ell(1.5, 0.85, 0.85, F, 0, 1.1, 0, root); ell(1.0, 0.5, 0.7, M('#A87A4A'), 0.1, 0.8, 0, root);
  const legs = []; [[0.8, 0.45], [0.8, -0.45], [-0.8, 0.45], [-0.8, -0.45]].forEach(([x, z]) => { const l = new THREE.Group(); l.position.set(x, 0.55, z); root.add(l); cy(0.2, 0.17, 0.6, D, 0, -0.3, 0, l, 8); legs.push(l); });
  const head = new THREE.Group(); head.position.set(1.5, 1.25, 0); root.add(head); ell(0.65, 0.5, 0.55, F, 0.1, 0, 0, head); ell(0.4, 0.4, 0.45, N, 0.65, -0.12, 0, head); ell(0.1, 0.12, 0.2, D, 1.0, 0.0, 0, head);
  [-1, 1].forEach((z) => { sp(0.12, M('#FFFFFF', 0.3), 0.4, 0.22, z * 0.3, head); sp(0.06, new THREE.MeshBasicMaterial({ color: '#000' }), 0.47, 0.22, z * 0.35, head); ell(0.1, 0.12, 0.06, D, -0.15, 0.4, z * 0.35, head); });
  const jaw = new THREE.Group(); jaw.position.set(0.7, -0.3, 0); head.add(jaw); ell(0.28, 0.08, 0.22, N, 0.12, 0, 0, jaw);
  const teeth = bx(0.12, 0.16, 0.14, M('#F4C040', 0.4), 0.98, -0.28, 0, head); teeth.userData.t = 1;
  g.scale.setScalar(s); Object.assign(g, { root, head, jaw, legs });
  g.anim = (t, o = {}) => { jaw.rotation.z = -(o.chew ? Math.abs(Math.sin(t * 14)) * 0.5 : (o.open || 0.03)); head.rotation.z = (o.nod || 0) + Math.sin(t * 2) * 0.02; const lie = o.lie || 0; root.position.y = -lie * 0.25 + (o.bounce ? Math.abs(Math.sin(t * 7)) * 0.1 : 0); legs.forEach((l, i) => { l.scale.y = 1 - lie * 0.5; if (o.walk) l.rotation.z = Math.sin(t * 8 + i * 1.6) * 0.35; else l.rotation.z = 0; }); };
  return g;
}
export function bird() { const g = new THREE.Group(); const B = M('#3A7AC8'); ell(0.18, 0.15, 0.13, B, 0, 0.15, 0, g); sp(0.09, B, 0.16, 0.3, 0, g); const b = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.1, 6), M('#F28C28')); b.rotation.z = -Math.PI / 2; b.position.set(0.28, 0.3, 0); g.add(b); [-1, 1].forEach((z) => sp(0.02, new THREE.MeshBasicMaterial({ color: '#000' }), 0.2, 0.34, z * 0.06, g)); ell(0.12, 0.04, 0.1, M('#2A5A98'), -0.05, 0.18, 0.14, g); ell(0.12, 0.04, 0.1, M('#2A5A98'), -0.05, 0.18, -0.14, g); return g; }
export function chewcouch() { const g = new THREE.Group(); const C = M('#8A4A5A', 0.9); const parts = [bx(3.2, 0.6, 1.2, C, 0, 0.5, 0, g), bx(3.2, 1.0, 0.3, C, 0, 1.0, -0.55, g), bx(0.3, 0.9, 1.2, C, -1.55, 0.75, 0, g), bx(0.3, 0.9, 1.2, C, 1.55, 0.75, 0, g)]; const cu = [-0.8, 0.8].map((x) => bx(1.4, 0.25, 1.0, M('#A8607A', 0.9), x, 0.92, 0.05, g)); g.chew = (k) => { parts[3].scale.x = Math.max(0.02, 1 - k * 1.1); cu[1].scale.setScalar(Math.max(0.02, 1 - k * 1.2)); parts[2].scale.x = Math.max(0.02, 1 - Math.max(0, k - 0.3) * 1.4); cu[0].scale.setScalar(Math.max(0.02, 1 - Math.max(0, k - 0.5) * 2)); }; g.chew(0); return g; }
