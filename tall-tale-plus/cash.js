// Cash props for "What if you had a billion dollars".
import * as THREE from 'three';
import { mat } from './world.js';
const GREEN = '#6B9E6A', GREEN2 = '#5A8A5C', BAND = '#E8DFC0', WOOD = '#B08A55';
const bx = (w, h, d, m, x, y, z, p) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; if (p) p.add(o); return o; };
/** a pallet holding $100M in hundreds (about 1 tonne), 0.8 m wide */
export function pallet(s = 1) {
  const g = new THREE.Group(), g1 = mat({ color: GREEN, roughness: 0.9 }), band = mat({ color: BAND, roughness: 0.9 }), w = mat({ color: WOOD, roughness: 1 });
  bx(0.8, 0.1, 0.7, w, 0, 0.05, 0, g); bx(0.74, 0.5, 0.64, g1, 0, 0.35, 0, g);
  [-0.18, 0.18].forEach((x) => bx(0.05, 0.52, 0.66, band, x, 0.35, 0, g));
  bx(0.2, 0.01, 0.2, band, 0, 0.61, 0, g);
  g.scale.setScalar(s); return g;
}
/** 4+3+2+1 pyramid of 10 pallets (= $1B), centered on x, base on y=0 */
export function pyramid(s = 1) {
  const g = new THREE.Group(); g.items = [];
  let n = 0; for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - r; c++) { const p = pallet(1); p.position.set((c - (3 - r) / 2) * 0.82 * s, r * 0.62 * s, 0); p.scale.setScalar(s); g.add(p); g.items.push(p); n++; }
  return g;
}
/** the cash tower: height h metres-ish; g.grow(k 0..1) scales the visible height */
export function tower(h = 10.9, w = 0.55) {
  const g = new THREE.Group(), m1 = mat({ color: GREEN, roughness: 0.9 }), m2 = mat({ color: BAND, roughness: 0.9 }); const n = 40;
  for (let i = 0; i < n; i++) bx(w, h / n * 0.5, w, i % 2 ? m2 : m1, 0, (i + 0.5) * (h / n), 0, g).scale.y = 2;
  g.grow = (k) => { g.scale.y = Math.max(0.001, k); }; return g;
}
export function burj(h = 8.28) {
  const g = new THREE.Group(), m = mat({ color: '#A9B8C8', roughness: 0.5, metalness: 0.2 }); const segs = [[0.5, 0.36, 2.2], [0.36, 0.26, 2.0], [0.26, 0.18, 1.8], [0.18, 0.1, 1.4], [0.1, 0.01, h - 7.4]];
  let y = 0; segs.forEach(([r0, r1, hh]) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, hh, 6), m); c.position.y = y + hh / 2; c.castShadow = true; g.add(c); y += hh; });
  return g;
}
export function coins(n = 90) {
  const m = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 12), mat({ color: '#E2B33C', roughness: 0.4, metalness: 0.5 }), n);
  m.frustumCulled = false; return m;
}
export function phone() {
  const g = new THREE.Group(); bx(0.22, 0.4, 0.03, mat({ color: '#1F1F26' }), 0, 0, 0, g); const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.35), new THREE.MeshBasicMaterial({ color: '#7FD6FF' })); sc.position.z = 0.017; g.add(sc); g.screen = sc; return g;
}
