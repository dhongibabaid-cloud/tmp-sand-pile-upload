// Emu and field props for The Great Emu War (3D low-poly cartoon birds that match the Tall Tale world).
import * as THREE from 'three';
import { mat } from './world.js';

const M = {
  body: () => mat({ color: '#7A5B45', roughness: 1 }), grey: () => mat({ color: '#9A8B7E', roughness: 1 }), neck: () => mat({ color: '#B7A99A', roughness: 1 }),
  beak: () => mat({ color: '#2B2B30' }), leg: () => mat({ color: '#A9744F' }), white: () => new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), ink: () => new THREE.MeshBasicMaterial({ color: '#1F1C33' }),
};
const sph = (r, m, x, y, z, p, sx = 1, sy = 1, sz = 1) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); s.position.set(x, y, z); s.scale.set(sx, sy, sz); s.castShadow = true; if (p) p.add(s); return s; };
const cyl = (r1, r2, h, m, x, y, z, p, seg = 8) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); c.position.set(x, y, z); c.castShadow = true; if (p) p.add(c); return c; };

/** a cartoon emu ~1.7 m tall, facing +z. e.run(t, speed) animates; e.neckSway(t). */
export function emu(scale = 1, tint = null) {
  const g = new THREE.Group(), pivot = new THREE.Group(); g.add(pivot);
  const body = sph(0.42, M.body(), 0, 0.95, 0, pivot, 0.85, 1, 1.35);
  sph(0.34, M.grey(), 0, 1.0, -0.38, pivot, 0.8, 0.9, 0.9);                       // fluffy tail end
  const neck = new THREE.Group(); neck.position.set(0, 1.15, 0.45); pivot.add(neck);
  const nk = cyl(0.07, 0.1, 0.78, M.neck(), 0, 0.35, 0.1, neck, 10); nk.rotation.x = 0.28;
  const head = new THREE.Group(); head.position.set(0, 0.78, 0.2); neck.add(head);
  sph(0.12, M.neck(), 0, 0, 0, head, 0.9, 1, 1.1);
  const beak = cyl(0.01, 0.05, 0.22, M.beak(), 0, -0.02, 0.2, head, 6); beak.rotation.x = Math.PI / 2;
  [-1, 1].forEach((s) => { sph(0.05, M.white(), s * 0.085, 0.04, 0.06, head); sph(0.022, M.ink(), s * 0.11, 0.04, 0.08, head); });
  const legs = [-1, 1].map((s) => { const l = new THREE.Group(); l.position.set(s * 0.17, 0.62, 0.02); pivot.add(l); cyl(0.04, 0.03, 0.62, M.leg(), 0, -0.31, 0, l, 6); const f = cyl(0.03, 0.03, 0.2, M.leg(), 0, -0.62, 0.08, l, 6); f.rotation.x = Math.PI / 2; return l; });
  g.scale.setScalar(scale);
  if (tint) body.material.color.set(tint);
  g.run = (t, speed = 1) => { const a = Math.sin(t * 14 * speed) * 0.9; legs[0].rotation.x = a; legs[1].rotation.x = -a; pivot.position.y = Math.abs(Math.sin(t * 14 * speed)) * 0.08; pivot.rotation.z = Math.sin(t * 14 * speed) * 0.04; neck.rotation.x = 0.35 + Math.sin(t * 14 * speed + 1) * 0.1; };
  g.idle = (t, off = 0) => { legs[0].rotation.x = legs[1].rotation.x = 0; pivot.position.y = 0; pivot.rotation.z = 0; neck.rotation.x = Math.sin(t * 1.4 + off) * 0.12; head.rotation.y = Math.sin(t * 1.9 + off * 2) * 0.5; };
  return g;
}
/** wheat field: instanced golden stalks over the rectangle [x0,x1] x [z0,z1], skipping `clear` boxes [[x0,x1,z0,z1]] */
export function wheat(x0, x1, z0, z1, { n = 9000, clear = [], seed = 1 } = {}) {
  const geo = new THREE.BoxGeometry(0.022, 0.8, 0.022); geo.translate(0, 0.42, 0);
  const im = new THREE.InstancedMesh(geo, mat({ color: '#FFFFFF', roughness: 1 }), n), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), r = (i) => { const x = Math.sin(i * 91.7 + seed * 13.1) * 43758.5; return x - Math.floor(x); };
  const cols = ['#E8B84A', '#F2CB63', '#D9A53A', '#EBC25A']; let k = 0;
  for (let i = 0; i < n * 3 && k < n; i++) {
    const x = x0 + r(i) * (x1 - x0), z = z0 + r(i + 7777) * (z1 - z0);
    if (clear.some(([a, b, c, d]) => x > a && x < b && z > c && z < d)) continue;
    e.set((r(i + 5) - 0.5) * 0.3, r(i + 9) * 6, (r(i + 3) - 0.5) * 0.3); q.setFromEuler(e); m.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(1, 0.8 + r(i + 11) * 0.6, 1));
    im.setMatrixAt(k, m); im.setColorAt(k, new THREE.Color(cols[k % 4])); k++;
  }
  im.count = k; im.receiveShadow = true; return im;
}
/** Lewis-style machine gun on a little tripod, barrel along +z */
export function lewisGun(s = 1) {
  const g = new THREE.Group(), steel = mat({ color: '#3A3F46', metalness: 0.4, roughness: 0.5 }), wood = mat({ color: '#8A5A36' });
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.8), steel); b.position.set(0, 0.55, 0); g.add(b);
  const barrel = cyl(0.04, 0.04, 0.7, steel, 0, 0.56, 0.7, g, 8); barrel.rotation.x = Math.PI / 2;
  const jacket = cyl(0.07, 0.07, 0.45, steel, 0, 0.56, 0.5, g, 10); jacket.rotation.x = Math.PI / 2;
  const pan = cyl(0.2, 0.2, 0.07, steel, 0, 0.72, 0.05, g, 18);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.4), wood); stock.position.set(0, 0.5, -0.5); g.add(stock);
  [[-0.3, 0.3, 0.2], [0.3, 0.3, 0.2], [0, 0.3, -0.35]].forEach(([x, y, z]) => { const l = cyl(0.015, 0.015, 0.55, steel, x * 0.5, 0.28, z * 0.5, g, 5); l.rotation.set(z > 0 ? -0.3 : 0.4, 0, x * 1.2); });
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); g.scale.setScalar(s); return g;
}
/** muzzle flash sprite (call .visible per frame) */
export function flash() { const f = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.4, 8), new THREE.MeshBasicMaterial({ color: '#FFD45A', toneMapped: false })); f.rotation.x = Math.PI / 2; f.position.z = 1.2; f.position.y = 0.56; f.visible = false; return f; }
