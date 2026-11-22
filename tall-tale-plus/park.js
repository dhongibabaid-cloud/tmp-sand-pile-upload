// BARTMAN: ballpark (outfield wall with ivy, stands, scoreboard), baseball, glove, trophy, ring, trash.
import * as THREE from 'three';
import { mat, canvasTex } from './world.js';
import { bx, cy, sp } from './boston.js';
const M = (c, r = 0.7, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function park() {
  const g = new THREE.Group();
  const gt = canvasTex('mow', 256, 256, (c, W, H) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#4E9A3C' : '#5BAA48'; c.fillRect(0, i * 32, W, 32); } for (let i = 0; i < 1500; i++) { c.fillStyle = `rgba(30,80,20,${0.1 + rn(i) * 0.15})`; c.fillRect(rn(i * 3) * W, rn(i * 7) * H, 2, 3); } }, [10, 6]);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(90, 40), mat({ map: gt, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 })); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0.03, 4); fl.receiveShadow = true; g.add(fl);
  bx(90, 0.04, 2.0, M('#A0643C', 1), 0, 0.05, 0.4, g); // warning track
  // brick wall with ivy
  bx(60, 1.0, 0.5, M('#9A3F2E', 0.9), 0, 0.5, -1.2, g);
  const iv = canvasTex('ivy', 256, 128, (c, W, H) => { c.fillStyle = '#2E6A2A'; c.fillRect(0, 0, W, H); for (let i = 0; i < 1400; i++) { const v = rn(i) * 60; c.fillStyle = `rgb(${40 + v * 0.4},${110 + v},${40 + v * 0.3})`; c.beginPath(); c.arc(rn(i * 3) * W, rn(i * 7) * H, 3 + rn(i + 1) * 4, 0, 7); c.fill(); } }, [14, 1]);
  const ivy = new THREE.Mesh(new THREE.BoxGeometry(60, 0.8, 0.56), mat({ map: iv, roughness: 1 })); ivy.position.set(0, 1.4, -1.2); ivy.castShadow = true; g.add(ivy);
  bx(60, 0.12, 0.7, M('#E8E4D8', 0.6), 0, 1.86, -1.2, g);
  // stepped stands behind the wall
  for (let r = 0; r < 12; r++) { bx(60, 0.45 + r * 0.45, 0.9, M(r % 2 ? '#2E4E8A' : '#3A5A9A', 0.8), 0, (0.45 + r * 0.45) / 2 + 0.3, -2.0 - r * 0.9, g); bx(60, 0.06, 0.12, M('#E8E4D8', 0.6), 0, 0.75 + r * 0.45, -2.4 - r * 0.9 + 0.5, g); }
  const COL = ['#B5372E', '#1F3FA0', '#E8E4D8', '#2E6A4A', '#E2B33C', '#7A3A8A', '#F28C38'];
  for (let i = 0; i < 200; i++) { const r = Math.floor(rn(i) * 11) + 1, x = (rn(i + 50) - 0.5) * 24, z = -2.0 - r * 0.9, y = 0.75 + r * 0.45; cy(0.13, 0.15, 0.28, M(COL[i % 7], 0.8), x, y + 0.18, z, g, 8); sp(0.11, M('#E8B890', 0.8), x, y + 0.45, z, g); if (i % 3 === 0) cy(0.115, 0.115, 0.05, M(COL[(i + 2) % 7], 0.8), x, y + 0.56, z, g, 8); }
  // scoreboard
  const sbt = canvasTex('score', 512, 256, (c, W, H) => { c.fillStyle = '#16301E'; c.fillRect(0, 0, W, H); c.strokeStyle = '#E8E4D8'; c.lineWidth = 6; c.strokeRect(8, 8, W - 16, H - 16); c.fillStyle = '#F2E6CF'; c.font = '700 56px Georgia, serif'; c.textAlign = 'center'; c.fillText('CUBS', 130, 100); c.fillText('3', 400, 100); c.fillText('MARLINS', 130, 180); c.fillText('0', 400, 180); c.font = '700 34px Georgia, serif'; c.fillText('8TH INNING · 1 OUT', W / 2, 235); });
  const sb = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), new THREE.MeshBasicMaterial({ map: sbt })); sb.position.set(7, 8.6, -12.5); g.add(sb); g.sb = sb;
  const mt = new THREE.Mesh(new THREE.CylinderGeometry(30, 40, 14, 40), mat({ color: '#6E8A9A', roughness: 1 })); mt.position.set(0, 3, -60); mt.visible = false; g.add(mt);
  return g;
}
export function ball() { const g = new THREE.Group(); sp(0.1, M('#F8F6F0', 0.5), 0, 0, 0, g); [0, Math.PI / 2].forEach((a) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.006, 6, 24, Math.PI), M('#B5372E', 0.6)); t.position.set(0.04, 0, 0.0); t.rotation.set(0, a + 0.3, 0.2); g.add(t); }); return g; }
export function glove() { const g = new THREE.Group(); sp(0.17, M('#8A5A2E', 0.7), 0, 0, 0, g, 1, 1.15, 0.7); for (let i = 0; i < 4; i++) cy(0.035, 0.03, 0.22, M('#7A4A22', 0.7), -0.1 + i * 0.07, 0.2, 0, g, 8); sp(0.06, M('#A06A38', 0.6), 0, -0.02, 0.08, g); return g; }
export function trophy() { const g = new THREE.Group(), au = M('#E2B33C', 0.25, 0.9); cy(0.35, 0.35, 0.1, M('#222', 0.4), 0, 0.05, 0, g, 20); cy(0.12, 0.14, 0.7, au, 0, 0.45, 0, g, 16); const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.14, 0.55, 24), au); cup.position.y = 1.1; g.add(cup); sp(0.14, au, 0, 1.5, 0, g); [-1, 1].forEach((s) => { const h = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 16, Math.PI), au); h.position.set(s * 0.4, 1.15, 0); h.rotation.z = s > 0 ? -1.2 : 1.2 + Math.PI; g.add(h); }); return g; }
export function ring() { const g = new THREE.Group(), au = M('#E2B33C', 0.2, 1); const t = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.07, 14, 36), au); g.add(t); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.1, 6), au); top.position.set(0, 0.34, 0); g.add(top); sp(0.12, new THREE.MeshStandardMaterial({ color: '#1F3FA0', roughness: 0.1, metalness: 0.2 }), 0, 0.42, 0, g); return g; }
export function cup(col = '#E8E4D8') { const g = new THREE.Group(); cy(0.07, 0.05, 0.16, M(col, 0.6), 0, 0, 0, g, 10); return g; }
export function mic() { const g = new THREE.Group(); cy(0.02, 0.02, 1.0, M('#222', 0.4, 0.6), 0, 0.5, 0, g, 8); sp(0.07, M('#333', 0.4, 0.5), 0, 1.05, 0, g); bx(0.3, 0.04, 0.3, M('#222'), 0, 0.02, 0, g); return g; }
