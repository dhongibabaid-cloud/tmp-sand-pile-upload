import * as THREE from 'three';
import { mat, facade, canvasTex } from './world.js';
import { bx, cy, sp } from './boston.js';
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const NAMES = ['BANQUE', 'CAFE', 'HOTEL', 'LIBRAIRIE', 'BOULANGER', 'PARFUM', 'BIJOUX', 'THEATRE'];
const WALLS = ['#E8DCC0', '#D9CBA8', '#EADFC6', '#D2C29E'];
export function row(x0, x1, z = -7.5, seed = 0) {
  const g = new THREE.Group(); let k = seed;
  for (let x = x0; x < x1; k++) { const w = 5 + rn(k) * 2, h = 8 + rn(k * 3) * 3; const wall = WALLS[k % WALLS.length]; const f = mat({ map: facade(NAMES[k % NAMES.length], { wall, kind: 'plaster', trim: '#FFF8E8', sign: ['#1E3A5A', '#2E4E3F', '#5A1E2E', '#3A2A1E'][k % 4], awning: ['#B5372E', '#1E3A5A', '#2E6A4A'][k % 3], w, h, seed: k }) }), s = mat({ color: wall, roughness: 1 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 6), [s, s, s, s, f, s]); b.position.set(x + w / 2, h / 2, z); b.castShadow = true; b.receiveShadow = true; g.add(b);
    bx(w + 0.2, 1.2, 6.2, mat({ color: '#5A6A7A', roughness: 0.8 }), x + w / 2, h + 0.6, z, g); bx(0.6, 1.4, 0.6, mat({ color: '#6A5A4A', roughness: 1 }), x + w * 0.7, h + 1.8, z, g); x += w + 0.1; }
  return g;
}
export function eiffel() {
  const g = new THREE.Group();
  const t = canvasTex('eiffel25', 512, 1024, (c, W, H) => {
    c.clearRect(0, 0, W, H); const X = (x) => W / 2 + x * W / 2, Y = (y) => H - y * H;
    const half = (y) => 0.07 + 0.93 * Math.pow(1 - y, 2.3);
    c.fillStyle = '#6A5648'; c.beginPath(); for (let k = 0; k <= 60; k++) { const y = k / 60; c.lineTo(X(half(y)), Y(y)); } for (let k = 60; k >= 0; k--) { const y = k / 60; c.lineTo(X(-half(y)), Y(y)); } c.closePath(); c.fill();
    c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.ellipse(X(0), Y(0), W * 0.215, H * 0.17, 0, Math.PI, 0); c.fill();
    c.beginPath(); c.ellipse(X(0), Y(0.27), W * 0.07, H * 0.045, 0, Math.PI, 0); c.fill();
    for (let r = 0; r < 12; r++) { const y0 = 0.2 + r * 0.055, y1 = y0 + 0.04, h0 = half(y0) * 0.55, h1 = half(y1) * 0.55; c.beginPath(); c.moveTo(X(-h0), Y(y0)); c.lineTo(X(0), Y(y1)); c.lineTo(X(h0), Y(y0)); c.lineTo(X(0), Y(y0 + 0.012)); c.closePath(); c.fill(); }
    c.globalCompositeOperation = 'source-over'; c.fillStyle = '#4A3A30';
    [[0.27, 0.09], [0.52, 0.05]].forEach(([y, hh]) => { c.fillRect(X(-half(y) - 0.07), Y(y) - 5, W * (half(y) + 0.07), 10); });
    c.strokeStyle = '#4A3A30'; c.lineWidth = 3; for (let r = 0; r < 30; r++) { const y = 0.3 + r * 0.022, hh = half(y) * 0.9; c.beginPath(); c.moveTo(X(-hh), Y(y)); c.lineTo(X(hh), Y(y + 0.022)); c.stroke(); c.beginPath(); c.moveTo(X(hh), Y(y)); c.lineTo(X(-hh), Y(y + 0.022)); c.stroke(); }
  }, [1, 1]);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 60), new THREE.MeshStandardMaterial({ map: t, transparent: true, alphaTest: 0.4, roughness: 0.8, side: THREE.DoubleSide })); m.position.y = 30; m.castShadow = false; g.add(m);
  return g;
}
export function briefcase() { const g = new THREE.Group(); bx(0.9, 0.55, 0.28, mat({ color: '#4A2E1E', roughness: 0.6 }), 0, 0.28, 0, g); bx(0.7, 0.05, 0.22, mat({ color: '#2E7A4A', roughness: 0.8 }), 0, 0.57, 0, g); g.open = (k) => { g.children[1].visible = k; }; return g; }
export function table() { const g = new THREE.Group(), w = mat({ color: '#6B3E26', roughness: 0.7 }); bx(3.4, 0.12, 1.4, w, 0, 1.0, 0, g); [[-1.5, -0.55], [1.5, -0.55], [-1.5, 0.55], [1.5, 0.55]].forEach(([x, z]) => bx(0.1, 1.0, 0.1, w, x, 0.5, z, g)); bx(3.4, 0.02, 1.4, mat({ color: '#F2E6CF' }), 0, 1.07, 0, g); return g; }
