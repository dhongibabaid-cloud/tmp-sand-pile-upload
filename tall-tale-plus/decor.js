// Tall Tale+ detail kit: the clutter that makes a room feel lived in. Everything is a THREE.Group you can place.
//   rug · plant · shelf · artFrame · floorLamp · stool · roundTable · mug · bookStack · wallClock · dress(scene, opts)
import * as THREE from 'three';
import { canvasTex, mat } from './world.js';

const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const bx = (w, h, d, m, x = 0, y = 0, z = 0, p) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; if (p) p.add(b); return b; };
const cy = (r1, r2, h, m, x, y, z, p, s = 14) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, s), m); c.position.set(x, y, z); c.castShadow = c.receiveShadow = true; if (p) p.add(c); return c; };
const sp = (r, m, x, y, z, p) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); s.position.set(x, y, z); s.castShadow = true; if (p) p.add(s); return s; };

/** patterned rug lying on the floor (width x depth in metres) */
export function rug(w = 3, d = 2, a = '#B5372E', b = '#F2E6CF', c = '#2E4E8A') {
  const tex = canvasTex('rug' + a + b + c, 512, 384, (g, W, H) => {
    g.fillStyle = a; g.fillRect(0, 0, W, H); g.strokeStyle = b; g.lineWidth = 14; g.strokeRect(22, 22, W - 44, H - 44); g.strokeStyle = c; g.lineWidth = 8; g.strokeRect(50, 50, W - 100, H - 100);
    g.fillStyle = b; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(W / 2 + (i - 4) * 46, H / 2 - 44); g.lineTo(W / 2 + (i - 4) * 46 + 22, H / 2); g.lineTo(W / 2 + (i - 4) * 46, H / 2 + 44); g.lineTo(W / 2 + (i - 4) * 46 - 22, H / 2); g.closePath(); g.fill(); }
    g.fillStyle = c; g.beginPath(); g.arc(W / 2, H / 2, 26, 0, 7); g.fill();
    for (let i = 0; i < 30; i++) { g.fillStyle = b; g.fillRect(22 + i * (W - 44) / 30, 4, 8, 14); g.fillRect(22 + i * (W - 44) / 30, H - 18, 8, 14); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat({ map: tex, roughness: 1 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.012; m.receiveShadow = true; return m;
}
export function plant(s = 1, pot = '#C9603F', leaf = '#3E9A4A') {
  const g = new THREE.Group(); cy(0.2 * s, 0.14 * s, 0.32 * s, mat({ color: pot }), 0, 0.16 * s, 0, g);
  for (let i = 0; i < 9; i++) { const a = i * 0.7, l = sp(0.16 * s, mat({ color: i % 2 ? leaf : '#4FB85A', roughness: 0.7 }), Math.cos(a) * 0.14 * s, (0.5 + (i % 3) * 0.14) * s, Math.sin(a) * 0.14 * s, g); l.scale.set(1, 1.6, 0.45); l.rotation.set(0.4 * Math.cos(a), a, 0.5 * Math.sin(a)); }
  return g;
}
export function bookStack(n = 4, s = 1) {
  const g = new THREE.Group(), cols = ['#B5372E', '#2E4E8A', '#E2B33C', '#3E8A5A', '#7A4A8A'];
  for (let i = 0; i < n; i++) { const b = bx((0.34 - i * 0.015) * s, 0.06 * s, 0.24 * s, mat({ color: cols[(i * 2) % 5] }), (rnd(i) - 0.5) * 0.04, 0.03 * s + i * 0.062 * s, 0, g); b.rotation.y = (rnd(i + 3) - 0.5) * 0.4; }
  return g;
}
export function mug(col = '#F2E6CF') { const g = new THREE.Group(); cy(0.05, 0.045, 0.1, mat({ color: col }), 0, 0.05, 0, g, 12); const h = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 6, 10, Math.PI), mat({ color: col })); h.position.set(0.055, 0.05, 0); h.rotation.z = -Math.PI / 2; g.add(h); return g; }
/** wall shelf with books and knick-knacks; faces +z */
export function shelf(w = 1.6, rows = 2, seed = 1) {
  const g = new THREE.Group(), wood = mat({ color: '#6B3E26', roughness: 0.8 }), cols = ['#B5372E', '#2E4E8A', '#E2B33C', '#3E8A5A', '#7A4A8A', '#C9603F', '#2F6B5A'];
  for (let r = 0; r < rows; r++) {
    const y = r * 0.42; bx(w, 0.05, 0.28, wood, 0, y, 0.12, g);
    let x = -w / 2 + 0.08, i = 0;
    while (x < w / 2 - 0.3) { const bw = 0.04 + rnd(seed + r * 9 + i) * 0.05, bh = 0.22 + rnd(seed + r * 5 + i * 2) * 0.12; bx(bw, bh, 0.2, mat({ color: cols[(i + r * 3 + seed) % cols.length] }), x + bw / 2, y + 0.025 + bh / 2, 0.12, g); x += bw + 0.005; i++; }
    if (r % 2 === 0) { const v = cy(0.07, 0.05, 0.2, mat({ color: '#E8D9B8' }), w / 2 - 0.16, y + 0.125, 0.12, g); sp(0.075, mat({ color: '#E8D9B8' }), w / 2 - 0.16, y + 0.27, 0.12, g); }
  }
  bx(w + 0.1, 0.05, 0.3, wood, 0, rows * 0.42, 0.12, g); return g;
}
export function artFrame(w = 0.9, h = 0.65, seed = 1, frame = '#C9A13B') {
  const tex = canvasTex('art' + seed, 256, 190, (g, W, H) => {
    const sky = ['#BFE4F7', '#F6C9A0', '#CFE3D0', '#E9D7F2'][seed % 4]; g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.fillStyle = ['#79C25A', '#9A7B52', '#5FA3A0', '#B07A9A'][seed % 4]; g.beginPath(); g.moveTo(0, H); g.quadraticCurveTo(70, 60 + rnd(seed) * 40, 140, 120); g.quadraticCurveTo(200, 80, W, 110); g.lineTo(W, H); g.fill();
    g.fillStyle = '#F2C230'; g.beginPath(); g.arc(190, 50, 20, 0, 7); g.fill();
  });
  const g = new THREE.Group(), fm = mat({ color: frame, metalness: 0.3, roughness: 0.5 });
  bx(w + 0.12, h + 0.12, 0.05, fm, 0, 0, 0, g); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); p.position.z = 0.03; g.add(p); return g;
}
export function floorLamp(col = '#F2C230') { const g = new THREE.Group(); cy(0.14, 0.16, 0.04, mat({ color: '#3A2A22' }), 0, 0.02, 0, g); cy(0.02, 0.02, 1.4, mat({ color: '#3A2A22' }), 0, 0.72, 0, g, 8); const sh = cy(0.1, 0.22, 0.28, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9 }), 0, 1.5, 0, g, 16); const l = new THREE.PointLight('#FFD9A0', 2.5, 5, 1.6); l.position.set(0, 1.45, 0); g.add(l); return g; }
export function stool(col = '#A8693E') { const g = new THREE.Group(); cy(0.2, 0.2, 0.06, mat({ color: col }), 0, 0.5, 0, g); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => cy(0.025, 0.025, 0.5, mat({ color: shadeCol(col) }), a * 0.13, 0.25, b * 0.13, g, 6)); return g; }
const shadeCol = (h) => { const c = new THREE.Color(h); c.multiplyScalar(0.7); return '#' + c.getHexString(); };
export function roundTable(r = 0.6, h = 0.75, top = '#7A3E24') { const g = new THREE.Group(); cy(r, r, 0.06, mat({ color: top, roughness: 0.6 }), 0, h, 0, g, 24); cy(0.05, 0.08, h, mat({ color: shadeCol(top) }), 0, h / 2, 0, g, 10); cy(0.28, 0.3, 0.04, mat({ color: shadeCol(top) }), 0, 0.02, 0, g, 16); return g; }
export function wallClock(r = 0.28) { const g = new THREE.Group(); cy(r, r, 0.06, mat({ color: '#3A2A22' }), 0, 0, 0, g, 24).rotation.x = Math.PI / 2; const f = new THREE.Mesh(new THREE.CircleGeometry(r * 0.88, 24), new THREE.MeshBasicMaterial({ color: '#FFF6E0', toneMapped: false })); f.position.z = 0.035; g.add(f); const h1 = bx(0.02, r * 0.55, 0.01, new THREE.MeshBasicMaterial({ color: '#1F1C33' }), 0, r * 0.2, 0.045, g); const h2 = bx(0.015, r * 0.7, 0.01, new THREE.MeshBasicMaterial({ color: '#1F1C33' }), r * 0.25, 0.08, 0.045, g); h2.rotation.z = -1.1; return g; }

/** dress an interior from world.interior(): rugs, plants, shelves, pictures, lamps, stools, a table with mugs and books. dense 0..1 */
export function dress(IN, { dense = 1, seed = 1, rugCols = ['#B5372E', '#F2E6CF', '#2E4E8A'], skip = [] } = {}) {
  const { scene, w, depth, h } = IN, add = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; scene.add(o); return o; };
  const out = {};
  if (!skip.includes('rug')) out.rug = add(rug(3.4, 2.4, ...rugCols), -0.6, 0, -depth / 2 + 0.2);
  if (!skip.includes('rug2')) add(rug(1.6, 1.1, rugCols[2], rugCols[1], rugCols[0]), -2.6, 0, -1.2, 0.3);
  add(shelf(1.8, 3, seed), -w / 2 + 0.22, 0.4, -depth / 2 - 1.2, Math.PI / 2);
  add(shelf(1.4, 2, seed + 4), -w / 2 + 0.22, 1.6, -depth / 2 + 1.4, Math.PI / 2);
  add(plant(1.4), -w / 2 + 0.55, 0, -depth + 0.5); add(plant(1.0, '#3C6FB6', '#2E8A4A'), w / 2 - 1.8, 0, -depth + 0.5); add(plant(0.9, '#E2B33C'), -w / 2 + 0.5, 0, -0.3);
  add(artFrame(0.9, 0.65, seed, '#C9A13B'), -2.6, 2.5, -depth + 0.14); add(artFrame(0.6, 0.8, seed + 1, '#6B3E26'), 2.6, 2.4, -depth + 0.14); add(artFrame(0.5, 0.5, seed + 2, '#2E4E3F'), 0, 3.3, -depth + 0.14);
  add(wallClock(0.3), 2.4, 3.3, -depth + 0.14);
  add(floorLamp(), -w / 2 + 0.6, 0, -2.6);
  const tb = add(roundTable(0.55), -2.4, 0, -4.2); const m1 = mug(); m1.position.set(0.15, 0.78, 0.1); tb.add(m1); const bs = bookStack(4, 1.0); bs.position.set(-0.15, 0.78, -0.1); tb.add(bs);
  add(stool(), -1.3, 0, -4.9); add(stool('#6B8E5A'), -3.4, 0, -3.6);
  return out;
}
