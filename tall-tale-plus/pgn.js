// PROJECT PIGEON props: lab room, pigeon, missile, nose-cone cockpit, easel, cage, money bag, dish, rosette.
import * as THREE from 'three';
import { mat, canvasTex } from './world.js';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function room() {
  const g = new THREE.Group();
  const ft = canvasTex('pgfloor', 256, 256, (c, W, H) => { for (let i = 0; i < 8; i++) for (let k = 0; k < 8; k++) { c.fillStyle = (i + k) % 2 ? '#B9A27C' : '#A68E68'; c.fillRect(i * 32, k * 32, 32, 32); } for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(60,40,20,${rn(i) * 0.12})`; c.fillRect(rn(i * 3) * W, rn(i * 7) * H, 3, 2); } }, [10, 8]);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), mat({ map: ft, roughness: 0.6, polygonOffset: true, polygonOffsetFactor: -2 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0.03, -2); fl.receiveShadow = true; g.add(fl);
  const wt = canvasTex('pgwall', 256, 256, (c, W, H) => { c.fillStyle = '#7FA08C'; c.fillRect(0, 0, W, H); c.fillStyle = '#6E9079'; for (let i = 0; i < 8; i++) c.fillRect(i * 32, 0, 16, H); c.fillStyle = '#5A4630'; c.fillRect(0, H - 40, W, 40); }, [8, 2]);
  const wm = mat({ map: wt, roughness: 0.9 });
  const bk = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), wm); bk.position.set(0, 6, -9); bk.receiveShadow = true; g.add(bk);
  [-14, 14].forEach((x) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), wm); s.position.set(x, 6, -2); s.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2; g.add(s); });
  const ce = new THREE.Mesh(new THREE.PlaneGeometry(40, 30), M('#F4F1E8', 1)); ce.rotation.x = Math.PI / 2; ce.position.set(0, 11.5, -2); g.add(ce);
  [-8, 0, 8].forEach((x) => bx(3.5, 0.15, 0.8, new THREE.MeshBasicMaterial({ color: '#FFF6DC' }), x, 11.3, -1, g));
  // shelves with jars, grain sacks, cages, books; blackboard; window
  bx(18, 0.1, 0.6, M('#6A4A32', 0.6), -5, 3.6, -8.6, g); bx(18, 0.1, 0.6, M('#6A4A32', 0.6), -5, 5.4, -8.6, g);
  for (let i = 0; i < 12; i++) { cy(0.22, 0.22, 0.7 + (i % 3) * 0.2, M(['#E2C25A', '#C9D8A0', '#E8E4D8'][i % 3], 0.3), -13 + i * 1.5, 4.0, -8.6, g, 14); bx(0.5, 0.9 + (i % 2) * 0.2, 0.4, M(['#8A3A2E', '#2E4E8A', '#E8C77A', '#2E6A4A'][i % 4], 0.7), -13 + i * 1.5, 5.9, -8.6, g); }
  [-12, -6].forEach((x, i) => { bx(1.2, 0.9, 0.9, M('#C9B48A', 1), x, 0.45 + 0, -8.0, g); });
  const bb = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.4), new THREE.MeshStandardMaterial({ map: canvasTex('pgboard', 512, 256, (c, W, H) => { c.fillStyle = '#23352B'; c.fillRect(0, 0, W, H); c.strokeStyle = '#6A4A32'; c.lineWidth = 12; c.strokeRect(0, 0, W, H); c.fillStyle = '#EDEFE6'; c.font = '700 40px Caladea, serif'; c.fillText('PECK  →  FOOD', 60, 80); c.fillText('NO PECK  →  NO FOOD', 60, 150); c.strokeStyle = '#EDEFE6'; c.lineWidth = 4; c.beginPath(); c.arc(380, 205, 28, 0, 7); c.arc(380, 205, 14, 0, 7); c.stroke(); c.font = '30px sans-serif'; c.fillText('( )', 60, 215); }, [1, 1]), roughness: 0.8 })); bb.position.set(6.5, 5.2, -8.9); g.add(bb);
  const wd = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.6), new THREE.MeshBasicMaterial({ color: '#CFE6FF' })); wd.position.set(-8.4, 6, -8.95); g.add(wd); bx(3.5, 0.15, 0.2, M('#E8E4D8'), -8.4, 4.1, -8.85, g); bx(0.12, 3.6, 0.2, M('#E8E4D8'), -8.4, 6, -8.85, g); bx(3.2, 0.12, 0.2, M('#E8E4D8'), -8.4, 6, -8.85, g);
  return g;
}
export function pigeon(s = 1) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); g.scale.setScalar(s);
  const gr = M('#8E94A0', 0.7), dk = M('#5E6470', 0.7), pk = M('#D98A8A', 0.7);
  sp(0.3, gr, 0, 0.5, 0, body, 1, 0.85, 1.35); sp(0.14, M('#3E8A6A', 0.3, 0.2), 0, 0.72, 0.28, body); sp(0.1, M('#7A4A9A', 0.3, 0.2), 0, 0.68, 0.34, body, 1.3, 0.8, 0.8);
  [-1, 1].forEach((x) => { const w = sp(0.2, dk, x * 0.26, 0.55, -0.05, body, 0.35, 0.75, 1.5); w.rotation.z = x * 0.2; });
  const tl = bx(0.24, 0.06, 0.34, dk, 0, 0.46, -0.52, body); tl.rotation.x = 0.35;
  const head = new THREE.Group(); head.position.set(0, 0.88, 0.34); body.add(head);
  sp(0.17, gr, 0, 0, 0, head); const bk = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.16, 8), M('#F2B33C', 0.5)); bk.rotation.x = Math.PI / 2; bk.position.set(0, -0.02, 0.2); head.add(bk);
  [-1, 1].forEach((x) => { sp(0.045, M('#FFFFFF', 0.3), x * 0.11, 0.04, 0.1, head); sp(0.028, M('#E8702A', 0.3), x * 0.12, 0.04, 0.13, head); sp(0.016, M('#111', 0.3), x * 0.125, 0.04, 0.152, head); });
  [-1, 1].forEach((x) => { cy(0.02, 0.02, 0.3, pk, x * 0.1, 0.2, 0.05, body, 6); bx(0.14, 0.02, 0.18, pk, x * 0.1, 0.05, 0.1, body); });
  g.peck = (k) => { const p = Math.sin(clamp01(k) * Math.PI); head.rotation.x = p * 0.9; head.position.set(0, 0.88 - p * 0.25, 0.34 + p * 0.22); };
  g.bob = (t) => { head.position.z = 0.34 + Math.sin(t * 10) * 0.04; };
  return g;
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));
export function missile() {
  const g = new THREE.Group(), steel = M('#B9C0C8', 0.35, 0.6), red = M('#B5372E', 0.5);
  const b = cy(0.45, 0.45, 3.2, steel, 0, 0, 0, g, 24); b.rotation.z = Math.PI / 2;
  const n = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.3, 24), red); n.rotation.z = -Math.PI / 2; n.position.set(2.25, 0, 0); n.castShadow = true; g.add(n);
  [0, 1, 2, 3].forEach((i) => { const f = bx(0.7, 0.04, 0.6, red, -1.4, 0, 0, g); f.rotation.x = i * Math.PI / 2; f.position.set(-1.4, Math.sin(i * Math.PI / 2) * 0.55, Math.cos(i * Math.PI / 2) * 0.55); });
  const st = cy(0.46, 0.46, 0.2, M('#F4F4F4', 0.5), 0.2, 0, 0, g, 24); st.rotation.z = Math.PI / 2; const w = cy(0.455, 0.455, 0.5, M('#F4F4F4', 0.5), 0.9, 0, 0, g, 24); w.rotation.z = Math.PI / 2;
  const fl = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.0, 12), new THREE.MeshBasicMaterial({ color: '#FFB03A' })); fl.rotation.z = Math.PI / 2; fl.position.set(-2.3, 0, 0); g.add(fl); g.flame = fl;
  return g;
}
export function cockpit() { // open-front chamber seen from behind the pigeons; screen at the back
  const g = new THREE.Group();
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.6, 3.4, 28, 1, true), new THREE.MeshStandardMaterial({ color: '#B5372E', roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })); sh.rotation.x = Math.PI / 2; sh.position.set(0, 1.3, -0.6); g.add(sh);
  const sc = canvasTex('pgscr', 512, 256, (c, W, H) => { c.fillStyle = '#2F7FB5'; c.fillRect(0, 0, W, H); c.fillStyle = '#4A99CC'; for (let i = 0; i < 30; i++) c.fillRect(rn(i) * W, rn(i + 9) * H, 40, 3); c.fillStyle = '#5A5F6A'; c.fillRect(300, 120, 90, 30); c.fillRect(325, 100, 30, 22); c.fillStyle = '#B5372E'; c.fillRect(340, 90, 6, 14); c.strokeStyle = '#FF3030'; c.lineWidth = 4; c.beginPath(); c.arc(345, 130, 38, 0, 7); c.moveTo(285, 130); c.lineTo(405, 130); c.moveTo(345, 70); c.lineTo(345, 190); c.stroke(); });
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: sc })); scr.position.set(0, 1.5, -2.2); g.add(scr); bx(2.6, 1.4, 0.08, M('#222'), 0, 1.5, -2.26, g);
  [-1, 0, 1].forEach((x) => bx(0.7, 0.06, 0.5, M('#6A4A32', 0.6), x * 0.8, 0.62, -0.5, g));
  return g;
}
export function easel() { const g = new THREE.Group(); [-0.6, 0.6].forEach((x) => { const l = bx(0.07, 2.2, 0.07, M('#8A5A2E', 0.7), x, 1.1, 0, g); l.rotation.z = -x * 0.08; }); const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), new THREE.MeshBasicMaterial({ map: canvasTex('pgtgt', 256, 200, (c, W, H) => { c.fillStyle = '#F4EBD6'; c.fillRect(0, 0, W, H); c.fillStyle = '#B5372E'; c.beginPath(); c.arc(128, 100, 80, 0, 7); c.fill(); c.fillStyle = '#F4EBD6'; c.beginPath(); c.arc(128, 100, 55, 0, 7); c.fill(); c.fillStyle = '#B5372E'; c.beginPath(); c.arc(128, 100, 30, 0, 7); c.fill(); c.fillStyle = '#F4EBD6'; c.beginPath(); c.arc(128, 100, 12, 0, 7); c.fill(); }) })); poster.position.set(0, 1.5, 0.06); g.add(poster); bx(1.5, 0.08, 0.12, M('#8A5A2E'), 0, 0.95, 0.08, g); return g; }
export function dish() { const g = new THREE.Group(); cy(0.28, 0.22, 0.1, M('#C9B48A', 0.5), 0, 0.05, 0, g, 16); for (let i = 0; i < 24; i++) sp(0.02, M('#E2C25A', 0.5), (rn(i) - 0.5) * 0.4, 0.11, (rn(i + 5) - 0.5) * 0.4, g); return g; }
export function bag() { const g = new THREE.Group(); sp(0.4, M('#C9B48A', 0.9), 0, 0.4, 0, g, 1, 1, 1); cy(0.08, 0.2, 0.2, M('#C9B48A', 0.9), 0, 0.8, 0, g, 10); bx(0.3, 0.06, 0.06, M('#6A4A32'), 0, 0.72, 0.28, g); const t = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.4), new THREE.MeshBasicMaterial({ map: canvasTex('pgusd', 64, 64, (c, W, H) => { c.fillStyle = 'rgba(0,0,0,0)'; c.clearRect(0, 0, W, H); c.fillStyle = '#2E6A2A'; c.font = '700 52px Georgia, serif'; c.textAlign = 'center'; c.fillText('$', 32, 50); }), transparent: true })); t.position.set(0, 0.42, 0.4); g.add(t); return g; }
export function cage() { const g = new THREE.Group(); bx(2.2, 0.1, 1.2, M('#6A4A32', 0.7), 0, 0.05, 0, g); bx(2.2, 0.1, 1.2, M('#6A4A32', 0.7), 0, 1.4, 0, g); for (let i = 0; i < 12; i++) cy(0.015, 0.015, 1.35, M('#444A52', 0.4, 0.6), -1.05 + i * 0.19, 0.72, 0.58, g, 6); return g; }
export function rosette() { const g = new THREE.Group(); for (let i = 0; i < 12; i++) { const p = bx(0.1, 0.34, 0.03, M('#E2B33C', 0.4, 0.5), 0, 0, 0, g); p.rotation.z = i * Math.PI / 6; p.position.set(Math.sin(i * Math.PI / 6) * 0.17, Math.cos(i * Math.PI / 6) * 0.17, 0); } sp(0.14, M('#1F3FA0', 0.3), 0, 0, 0.02, g, 1, 1, 0.5); bx(0.12, 0.4, 0.02, M('#1F3FA0'), -0.06, -0.38, -0.02, g); bx(0.12, 0.4, 0.02, M('#B5372E'), 0.06, -0.38, -0.02, g); return g; }
export function chip() { const g = new THREE.Group(); bx(0.5, 0.06, 0.5, M('#2E6A3A', 0.4), 0, 0, 0, g); bx(0.22, 0.08, 0.22, M('#111', 0.3), 0, 0.06, 0, g); for (let i = 0; i < 6; i++) { bx(0.03, 0.02, 0.1, M('#C9C9C9', 0.2, 0.9), -0.22 + i * 0.09, 0.0, 0.3, g); bx(0.03, 0.02, 0.1, M('#C9C9C9', 0.2, 0.9), -0.22 + i * 0.09, 0.0, -0.3, g); } return g; }
