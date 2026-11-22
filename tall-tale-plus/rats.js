// HANOI RAT BOUNTY 1902: rats, tails, bounty counter, scissors, rat farm cages.
import * as THREE from 'three';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const HNAMES = ['BOULANGERIE', 'PHARMACIE', 'HOTEL', 'CAFE', 'EPICERIE', 'TABAC', 'LIBRAIRIE', 'BANQUE'];
export const HWALLS = ['#E6C45A', '#D9B04A', '#EBD58A', '#E8D8A8', '#D8A860', '#EFE2B8'];
export function rat(tint = '#7A6E66') {
  const g = new THREE.Group(), fur = M(tint, 0.9), pk = M('#E8A8A0', 0.6);
  sp(0.17, fur, 0, 0.14, 0, g, 1.5, 0.85, 0.85); sp(0.1, fur, 0.24, 0.15, 0, g, 1.1, 0.9, 0.9);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.12, 12), fur); nose.rotation.z = -Math.PI / 2; nose.position.set(0.36, 0.14, 0); g.add(nose); sp(0.016, M('#E88A9A'), 0.43, 0.14, 0, g);
  [-1, 1].forEach((s) => { sp(0.045, pk, 0.2, 0.26, s * 0.06, g, 0.4, 1, 1); sp(0.014, M('#050505', 0.2), 0.3, 0.19, s * 0.06, g); cy(0.025, 0.02, 0.07, fur, -0.1, 0.04, s * 0.09, g, 6); cy(0.025, 0.02, 0.07, fur, 0.1, 0.04, s * 0.09, g, 6); });
  g.tail = new THREE.Group(); g.add(g.tail); const t = cy(0.014, 0.006, 0.55, pk, -0.5, 0.1, 0, g.tail, 8); t.rotation.z = Math.PI / 2 - 0.15;
  g.at = (x, z, face = 0, s = 1, bob = 0) => { g.position.set(x, Math.abs(Math.sin(bob * 16)) * 0.05 * s, z); g.rotation.y = face; g.scale.setScalar(s); };
  return g;
}
export function tailPiece() { const g = new THREE.Group(); const t = cy(0.014, 0.008, 0.45, M('#E8A8A0', 0.6), 0, 0, 0, g, 8); t.rotation.z = Math.PI / 2 - 0.2; return g; }
export function counter() {
  const g = new THREE.Group(), wd = M('#7A4A2A', 0.6);
  bx(3.6, 1.0, 1.1, wd, 0, 0.5, 0, g); bx(3.8, 0.1, 1.3, M('#5A3418', 0.5), 0, 1.05, 0, g); bx(3.2, 0.5, 0.06, M('#2E4E3F', 0.6), 0, 0.5, 0.58, g);
  g.pile = new THREE.Group(); g.add(g.pile); g.piles = []; for (let i = 0; i < 70; i++) { const t = tailPiece(); const r = rn(i) * 0.5, a = rn(i + 9) * 6.28; t.position.set(-0.9 + Math.cos(a) * r * 1.2, 1.12 + rn(i + 3) * 0.28, Math.sin(a) * r * 0.4); t.rotation.set(rn(i + 4) * 3, rn(i + 5) * 3, rn(i + 6) * 3); g.pile.add(t); g.piles.push(t); }
  g.coins = new THREE.Group(); g.add(g.coins); for (let i = 0; i < 12; i++) cy(0.09, 0.09, 0.025, M('#D9B45A', 0.25, 0.9), 1.2 + (i % 3) * 0.02, 1.12 + i * 0.028, 0.1, g.coins, 16);
  g.setPile = (k) => g.piles.forEach((t, i) => { t.visible = i < k * g.piles.length; });
  g.setPile(0.2); return g;
}
export function scissors() {
  const g = new THREE.Group(), st = M('#C7CBD1', 0.2, 1);
  g.a = new THREE.Group(); g.b = new THREE.Group(); g.add(g.a, g.b); bx(0.5, 0.03, 0.01, st, 0.25, 0, 0, g.a); bx(0.5, 0.03, 0.01, st, 0.25, 0, 0, g.b); sp(0.07, M('#B5372E'), -0.05, 0.05, 0, g.a); sp(0.07, M('#B5372E'), -0.05, -0.05, 0, g.b);
  g.set = (k) => { g.a.rotation.z = 0.35 * (1 - k); g.b.rotation.z = -0.35 * (1 - k); }; g.set(0); return g;
}
export function cages() {
  const g = new THREE.Group(), wd = M('#8A5A32', 0.7), wr = M('#9AA3A8', 0.3, 0.8); g.rats = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) {
    const x = (c - 0.5) * 1.5, y = 0.35 + r * 0.8; bx(1.4, 0.06, 0.8, wd, x, y - 0.3, 0, g); bx(1.4, 0.06, 0.8, wd, x, y + 0.38, 0, g);
    for (let i = 0; i <= 7; i++) bx(0.02, 0.68, 0.02, wr, x - 0.7 + i * 0.2, y + 0.04, 0.4, g); bx(1.4, 0.68, 0.04, M('#6A4A32', 0.8), x, y + 0.04, -0.4, g);
  }
  return g;
}
