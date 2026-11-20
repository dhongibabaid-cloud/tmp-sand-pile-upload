// Ancient-Rome market world: Colosseum under construction, shop fronts, stalls, amphorae, tub, hides, chest, desk, latrine.
import * as THREE from 'three';
import { mat, canvasTex, signBoard } from './world.js';
const bx = (w, h, d, m, x, y, z, p) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; if (p) p.add(o); return o; };
const cy = (r1, r2, h, m, x, y, z, p, seg = 12) => { const o = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m); o.position.set(x, y, z); o.castShadow = true; if (p) p.add(o); return o; };
const sp = (r, m, x, y, z, p, sx = 1, sy = 1, sz = 1) => { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10), m); o.position.set(x, y, z); o.scale.set(sx, sy, sz); o.castShadow = true; if (p) p.add(o); return o; };
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const archTex = (key, base, dark, rows = 1, small = false) => canvasTex(key, 128, 128 * rows, (c, W, H) => {
  c.fillStyle = base; c.fillRect(0, 0, W, H);
  for (let r = 0; r < rows; r++) { const y0 = r * 128;
    c.fillStyle = 'rgba(0,0,0,0.06)'; for (let k = 0; k < 6; k++) c.fillRect(0, y0 + 14 + k * 20, W, 2);
    c.fillStyle = dark; const w = small ? 30 : 60, x = (W - w) / 2, top = y0 + (small ? 40 : 22), h = small ? 60 : 98;
    c.beginPath(); c.moveTo(x, top + h); c.lineTo(x, top + w / 2); c.arc(W / 2, top + w / 2, w / 2, Math.PI, 0); c.lineTo(x + w, top + h); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.12)'; c.fillRect(0, y0, W, 4); }
}, [1, 1]);

export function colosseum() {
  const g = new THREE.Group(), tex = archTex('col-a', '#D9C79B', '#4A3F33'), tex2 = archTex('col-b', '#CDBA8C', '#3E352B', 1, true);
  const ring = (R, h, y, t, ts = 0, tl = Math.PI * 2) => { const geo = new THREE.CylinderGeometry(R, R, h, 96, 1, true, ts, tl), m = mat({ map: t.clone(), roughness: 1, side: THREE.DoubleSide }); m.map.wrapS = THREE.RepeatWrapping; m.map.repeat.set(Math.round(40 * tl / (Math.PI * 2)), 1); m.map.needsUpdate = true; const o = new THREE.Mesh(geo, m); o.position.y = y + h / 2; o.castShadow = true; o.receiveShadow = true; g.add(o); return o; };
  ring(14, 3.6, 0, tex); ring(13.7, 3.4, 3.6, tex); ring(13.4, 3.0, 7.0, tex, 0.5, Math.PI * 1.2);          // third tier only partly built
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(13.6, 13.9, 0.3, 96, 1, true), mat({ color: '#B9A878', side: THREE.DoubleSide })); cap.position.y = 7.0; g.add(cap);
  // scaffolding on the unfinished part + a crane
  const wood = mat({ color: '#8A6A3A', roughness: 1 }); const sc = new THREE.Group(); g.add(sc);
  for (let i = 0; i < 14; i++) { const a = 0.4 + i * 0.16 + Math.PI * 1.35 / 1.0, x = Math.cos(a) * 13.9, z = Math.sin(a) * 13.9; cy(0.07, 0.07, 6.0, wood, x, 6.8, z, sc, 6); }
  for (let r = 0; r < 4; r++) for (let i = 0; i < 13; i++) { const a1 = 0.4 + i * 0.16 + Math.PI * 1.35, a2 = a1 + 0.16, p1 = [Math.cos(a1) * 13.9, Math.sin(a1) * 13.9], p2 = [Math.cos(a2) * 13.9, Math.sin(a2) * 13.9]; const L = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]); const b = bx(L, 0.07, 0.07, wood, (p1[0] + p2[0]) / 2, 4.4 + r * 1.5, (p1[1] + p2[1]) / 2, sc); b.rotation.y = -Math.atan2(p2[1] - p1[1], p2[0] - p1[0]); }
  const crane = new THREE.Group(); crane.position.set(-4, 10.3, -9); g.add(crane); cy(0.12, 0.18, 6, wood, 0, 3, 0, crane, 6); const arm = new THREE.Group(); arm.position.y = 6; crane.add(arm); bx(7, 0.15, 0.15, wood, 2.5, 0, 0, arm); const rope = cy(0.015, 0.015, 3, mat({ color: '#6A5A3A' }), 5, -1.5, 0, arm, 4); bx(0.6, 0.5, 0.6, mat({ color: '#C9C0A8' }), 5, -3.1, 0, arm);
  g.sway = (t) => { arm.rotation.y = Math.sin(t * 0.4) * 0.25; };
  g.scale.set(1.2, 1, 1); return g;
}
export function awning(w, c1 = '#B5372E', c2 = '#F2E6CF') {
  const t = canvasTex('awn' + c1 + c2, 128, 64, (c, W, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? c2 : c1; c.fillRect(i * W / 8, 0, W / 8, H); } });
  const m = mat({ map: t.clone(), roughness: 1, side: THREE.DoubleSide }); m.map.repeat.set(Math.max(1, Math.round(w / 0.6) / 8), 1); m.map.needsUpdate = true;
  const o = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.1), m); o.castShadow = true; o.rotation.x = -Math.PI / 2 + 0.35; return o;
}
export function shop(w, h, col, a1, a2, seed = 0) {
  const g = new THREE.Group(); bx(w, h, 1.6, mat({ color: col, roughness: 1 }), 0, h / 2, 0, g); bx(w + 0.2, 0.18, 1.8, mat({ color: '#9A6A4A', roughness: 1 }), 0, h + 0.09, 0, g);
  bx(w * 0.45, 1.9, 0.1, mat({ color: '#3A2A1E', roughness: 1 }), 0, 0.95, 0.82, g);
  [-1, 1].forEach((s) => { const win = bx(0.5, 0.7, 0.08, mat({ color: '#2A241E' }), s * w * 0.36, h * 0.72, 0.82, g); });
  const a = awning(w * 0.9, a1, a2); a.position.set(0, 2.3, 1.3); g.add(a);
  const pots = rn(seed) > 0.5; for (let i = 0; i < 3; i++) cy(0.14, 0.1, 0.35, mat({ color: pots ? '#C9764A' : '#B08A55' }), -w * 0.3 + i * 0.35, 0.18, 1.25, g, 10);
  return g;
}
export function stall(w = 2.0, a1 = '#B5372E', a2 = '#F2E6CF', goods = 'fruit', seed = 0) {
  const g = new THREE.Group(), wood = mat({ color: '#9A6A3A', roughness: 1 });
  bx(w, 0.08, 0.8, wood, 0, 0.85, 0, g); [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => cy(0.04, 0.04, 0.85, wood, sx * (w / 2 - 0.06), 0.42, sz * 0.34, g, 6)));
  [-1, 1].forEach((sx) => cy(0.04, 0.04, 2.3, wood, sx * (w / 2 - 0.05), 1.15, -0.34, g, 6));
  const a = awning(w + 0.3, a1, a2); a.position.set(0, 2.25, 0.25); a.rotation.x = -Math.PI / 2 + 0.3; g.add(a);
  const cols = { fruit: ['#D9433A', '#E8A33A', '#7BB661'], pots: ['#C9764A', '#B5603A', '#D9A441'], cloth: ['#B5372E', '#2E4E8A', '#E2B33C', '#F2E6CF'], bread: ['#D9A441', '#C98A3A', '#E8C77A'], fish: ['#8AA0B8', '#6A8098'] }[goods];
  for (let i = 0; i < 9; i++) { const c = cols[i % cols.length], x = -w / 2 + 0.2 + (i % 5) * (w - 0.4) / 4, z = -0.1 + Math.floor(i / 5) * 0.3;
    if (goods === 'fruit' || goods === 'bread') sp(0.1, mat({ color: c, roughness: 0.8 }), x, 0.97, z, g, 1, goods === 'bread' ? 0.6 : 1, goods === 'bread' ? 1.3 : 1);
    else if (goods === 'pots') cy(0.1, 0.07, 0.24, mat({ color: c }), x, 1.0, z, g, 10); else bx(0.28, 0.1 + (i % 3) * 0.04, 0.22, mat({ color: c }), x, 0.94, z, g); }
  g.scale.setScalar(1); return g;
}
export function amphora(s = 1, col = '#C9764A') { const g = new THREE.Group(), m = mat({ color: col, roughness: 0.9 }); sp(0.2 * s, m, 0, 0.3 * s, 0, g, 1, 1.45, 1); cy(0.06 * s, 0.1 * s, 0.22 * s, m, 0, 0.7 * s, 0, g, 10); [-1, 1].forEach((sx) => { const h = new THREE.Mesh(new THREE.TorusGeometry(0.09 * s, 0.015 * s, 6, 10, Math.PI), m); h.position.set(sx * 0.07 * s, 0.7 * s, 0); h.rotation.z = sx > 0 ? -Math.PI / 2 : Math.PI / 2; g.add(h); }); cy(0.07 * s, 0.03 * s, 0.08 * s, m, 0, 0.02 * s, 0, g, 8); return g; }
export function tub(s = 1) { const g = new THREE.Group(), wd = mat({ color: '#9A6A3A', roughness: 1 }); cy(0.7 * s, 0.6 * s, 0.6 * s, wd, 0, 0.3 * s, 0, g, 20); const top = cy(0.62 * s, 0.62 * s, 0.02, mat({ color: '#E8DCA0', roughness: 0.4 }), 0, 0.58 * s, 0, g, 20); g.liquid = top; const cloth = cy(0.5 * s, 0.5 * s, 0.1, mat({ color: '#F4EFE2', roughness: 1 }), 0, 0.64 * s, 0, g, 16); cloth.scale.set(1, 1, 0.9); g.cloth = cloth; return g; }
export function rack(s = 1) { const g = new THREE.Group(), wd = mat({ color: '#7A5A3A', roughness: 1 }); [-1, 1].forEach((sx) => cy(0.05, 0.05, 1.8 * s, wd, sx * 0.9 * s, 0.9 * s, 0, g, 6)); bx(2.0 * s, 0.07, 0.07, wd, 0, 1.75 * s, 0, g); g.hides = [0, 1, 2].map((i) => { const h = bx(0.5 * s, 0.8 * s, 0.03, mat({ color: '#F0E6CF', roughness: 1 }), (i - 1) * 0.6 * s, 1.3 * s, 0, g); return h; }); return g; }
export function chest() { const g = new THREE.Group(), wd = mat({ color: '#6A3E1E', roughness: 0.8 }), gold = mat({ color: '#E2B33C', roughness: 0.3, metalness: 0.7 }); bx(1.0, 0.55, 0.6, wd, 0, 0.3, 0, g); const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.0, 14, 1, false, 0, Math.PI), wd); lid.rotation.z = Math.PI / 2; lid.rotation.y = Math.PI / 2; lid.position.set(0, 0.58, 0); g.add(lid); [-0.35, 0.35].forEach((x) => bx(0.06, 0.58, 0.62, gold, x, 0.3, 0, g)); const pile = sp(0.3, gold, 0, 0.62, 0, g, 1.5, 0.45, 0.9); g.pile = pile; return g; }
export function desk() { const g = new THREE.Group(), wd = mat({ color: '#8A5A2A', roughness: 1 }); bx(1.8, 0.1, 0.8, wd, 0, 0.95, 0, g); [-1, 1].forEach((sx) => [-1, 1].forEach((sz) => cy(0.05, 0.05, 0.95, wd, sx * 0.8, 0.47, sz * 0.32, g, 6))); bx(0.4, 0.02, 0.3, mat({ color: '#F2E6CF' }), -0.4, 1.01, 0, g); return g; }
export function coin(r = 0.1) { const g = new THREE.Group(); const m = mat({ color: '#FFD45A', roughness: 0.6, metalness: 0.15 }); const c = cy(r, r, r * 0.16, m, 0, 0, 0, g, 24); c.rotation.x = Math.PI / 2; const e = cy(r * 0.8, r * 0.8, r * 0.18, mat({ color: '#E8A81E', roughness: 0.7, metalness: 0.1 }), 0, 0, 0, g, 24); e.rotation.x = Math.PI / 2; return g; }
export function latrine() { const g = new THREE.Group(), st = mat({ color: '#C9BFA6', roughness: 1 }); bx(3.0, 2.6, 1.4, st, 0, 1.3, 0, g); bx(3.2, 0.2, 1.6, mat({ color: '#9A8F76' }), 0, 2.7, 0, g); const arch = bx(1.2, 1.9, 0.12, mat({ color: '#2A241E' }), 0, 0.95, 0.72, g); const top = cy(0.6, 0.6, 0.12, mat({ color: '#2A241E' }), 0, 1.9, 0.72, g, 16); top.rotation.x = Math.PI / 2; const sb = signBoard('PUBLIC LATRINE', { w: 2.4, h: 0.5, bg: '#7A5A3A', fg: '#F2E6CF' }); sb.position.set(0, 2.2, 0.8); g.add(sb); return g; }
export function dog() { const g = new THREE.Group(), m = mat({ color: '#B98A5E', roughness: 1 }); const body = sp(0.2, m, 0, 0.3, 0, g, 1.7, 0.9, 0.9); sp(0.12, m, 0.33, 0.45, 0, g); [-0.2, 0.2].forEach((x) => [-0.07, 0.07].forEach((z) => cy(0.03, 0.03, 0.22, m, x, 0.11, z, g, 5))); const tail = cy(0.025, 0.015, 0.25, m, -0.36, 0.45, 0, g, 5); tail.rotation.z = 0.8; g.tail = tail; sp(0.05, mat({ color: '#222' }), 0.43, 0.46, 0, g); [-1, 1].forEach((z) => sp(0.05, m, 0.3, 0.55, z * 0.09, g, 0.6, 1.2, 0.5)); return g; }
export function street() {
  const g = new THREE.Group();
  const t = canvasTex('paving', 256, 256, (c, W, H) => { c.fillStyle = '#C8B287'; c.fillRect(0, 0, W, H); for (let r = 0; r < 8; r++) for (let k = 0; k < 8; k++) { const o = (r % 2) * 16, v = (rn(r * 8 + k) - 0.5) * 18; c.fillStyle = `rgb(${200 + v},${178 + v},${135 + v})`; c.fillRect(k * 32 + o + 1, r * 32 + 1, 30, 30); } }, [16, 14]);
  const o = new THREE.Mesh(new THREE.PlaneGeometry(80, 70), mat({ map: t, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 })); o.rotation.x = -Math.PI / 2; o.position.set(0, 0.03, -27); o.receiveShadow = true; g.add(o);
  return g;
}
