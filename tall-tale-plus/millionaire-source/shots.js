// MILLIONAIRE STORY: Tall Tale+ story short (Emma voice for girl lines).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
import * as GR from './core/gir.js';
import * as GH from './core/gh.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx, cy, sp } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);
const YOU = { body: '#E2663C', hat: 'cap', hatCol: '#222222', pattern: 'stripes', patCol: '#A8401F', extra: ['freckles'] };
const R1 = { body: '#E8C23A', hat: 'visor', hatCol: '#2E7A4A', pattern: 'plain', extra: [] };
const R2 = { body: '#7A4A9A', hat: 'beanie', hatCol: '#E86A8A', pattern: 'check', patCol: '#5A3A7A', extra: ['mustache'] };
const R3 = { body: '#2E9A9A', hat: 'cap', hatCol: '#F2F2F2', pattern: 'stripes', patCol: '#1E7A7A', extra: ['glasses'] };
const MOM = { body: '#D0457A', head: '#F4E8DA', hat: 'bun', hatCol: '#3A2A2A', pattern: 'plain', extra: ['glasses', 'blush'] };
assertDistinct([YOU, R1, R2, R3, MOM], 'mil cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; };
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const LR = GR.livingroom(), TN = GH.tin(), PH = GH.msg(), LT = GH.letter('You were always|my millionaire.');
  const OBJ = [LR, TN, PH, LT]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  const B = [['joke', "I'M A MILLIONAIRE", '#2E6A4A'], ['really', 'OH MY GOD, REALLY?!', '#C2477A'], ['bel', 'MOM BELIEVED ME', '#C2477A'], ['neigh', 'EVERY NEIGHBOR KNOWS', '#2E3A7A'], ['rel', '20 RELATIVES AT THE DOOR', '#B5372E'], ['loan', 'LOANS?!', '#F28C28'], ['prank', 'MOM, IT WAS A PRANK!', '#B5372E'], ['smile', 'SHE JUST SMILED', '#2E6A4A'], ['wait', 'WAIT HERE, BETA', '#C2477A'], ['tin', 'THE OLD TIN BOX', '#8A6A18'], ['ten', '10 YEARS OF POCKET MONEY', '#2E6A4A'], ['dream', 'FOR YOUR DREAMS', '#2E3A7A'], ['open', 'I OPENED IT', '#2A2A33'], ['rup', '4,000 RUPEES + A NOTE', '#2E6A4A'], ['mil', 'MY MILLIONAIRE', '#C2477A'], ['cry', 'WE BOTH CRIED', '#2E3A7A'], ['ask', 'THEN: "CAN I GET A LOAN?"', '#B5372E'], ['broke', 'STILL NOT A MILLIONAIRE', '#2A2A33']];
  B.forEach(([k, t, c]) => bdc(k, t, c));
  const boards = Object.values(BD);
  const you = person(YOU), mom = person(MOM), r1 = person(R1), r2 = person(R2), r3 = person(R3);
  const SP = [you, mom, r1, r2, r3]; SP.forEach((p) => sc.add(p.group));
  const hemi = W.sun.group.children.find((c) => c.isHemisphereLight); const H0 = hemi.intensity, S0 = W.sun.key.intensity;
  const light = (k) => { hemi.intensity = k <= 1 ? lerp(H0, 0.5, k) : lerp(0.5, 0.1, Math.min(1, k - 1)); const dk = k > 1; k = Math.min(k, 1); hemi.color.set(k > 0.4 ? '#9AA8FF' : '#FFE9D2'); hemi.groundColor.set(k > 0.4 ? '#2A2A4A' : '#5A3A2A'); W.sun.key.intensity = lerp(S0, 0.3, k); W.sun.key.color.set(k > 0.4 ? '#8A9AFF' : '#FFFFFF'); if (dk) W.sun.key.intensity = 0.08; sc.environmentIntensity = dk ? 0.07 : lerp(0.25, 0.1, k); };
  const resetAll = () => { [...SP, ...OBJ, ...boards].forEach((o) => vis(o, false)); worldKids.forEach((g) => (g.visible = false)); W.sun.group.visible = true; };
  const ext = () => worldKids.forEach((g) => (g.visible = true));
  const idle = (p, x, y, z, t, i, o = {}) => { vis(p, true); p.at(x, y, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const shoot = (people, from, to, at, k, fov) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at); cam.updateMatrixWorld(true);
    boards.forEach((b) => { if (!b.visible) return; const dist = cam.position.distanceTo(b.position), hh = dist * Math.tan(cam.fov * Math.PI / 360), hw = hh * 0.5625, wd = b.geometry.parameters.width, sMax = (1.7 * hw * 0.88) / wd; if (b.scale.x > sMax) b.scale.setScalar(sMax);
      const n = b.position.clone().project(cam), hn = (wd * b.scale.x / 2) / hw; const ov = Math.abs(n.x) + hn - 0.92; if (ov > 0) b.position.x -= Math.sign(n.x || 1) * ov * hw; if (n.y > 0.72) b.position.y -= (n.y - 0.72) * hh; });
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(at) });
  };
  const board = (key, on, x, y, z, s, lt, t0) => { const b = BD[key]; vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const shot = (id, st_, en, key, bp, setup, cm, sfx = []) => {
    add({ id, at: st_, note: id, draw: (lt, d, t, blit) => { resetAll(); const k = eio(clamp(lt / d)); const ppl = setup(lt, d, t, k) || []; board(key, true, bp[0], bp[1], bp[2], bp[3] || 0.95, lt, 0.12); shoot(ppl, V(...cm[0]), V(...cm[1]), V(...cm[2]), k, cm[3]); blit(); } });
    sfx.forEach(([dt, n, g]) => cue(st_ + dt, n, { gain: g ?? 0.5 }));
  };
  const sit = (p, x, t, o = {}) => idle(p, x, 0.52 + (o.dy || 0), 0, t, 1, { legs: 'sit', ...o });
  const stand = (p, x, t, i, o = {}) => idle(p, x, 0.4, 0, t, i, o);
  const put = (o, x, y, z, ry = 0, rz = 0) => { vis(o, true); o.position.set(x, y, z); o.rotation.set(0, ry, rz); };
  const wave = (f, t) => { if (f.cloth) f.cloth.rotation.y = Math.sin(t * 5) * 0.25; };
  const CM = (y, z, fov = 44, ty = 1.4) => [[0, y, z], [0, y - 0.1, z - 0.9], [0, ty, 0], fov];
  const KC0 = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const KC = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];

  const bath = (cr = 0) => { vis(BR, true); put(TB, 0, 0, -0.8); TB.crack(cr); };
  const cp = (o, x, y, z, ry, t, a = {}, s = 0.9) => { put(o, x, y, z, ry); o.scale.setScalar(s * 0.6); o.anim(t, a); };
  const bird = (x, y, z, ry = 0) => put(BI, x, y, z, ry);
  const HOOK = (lt, d, t) => { room(); cp(CA, -0.6, 0, -0.3, 0.0, t, { open: 0.3 }, 0.9); bird(-0.2, 1.05 + Math.abs(Math.sin(t * 5)) * 0.04, -0.3); stand(you, 0.95, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; };
  const KC2 = (x, y, z, ty = 1.5, fov = 44) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const lot = (k = 0) => { light(k); vis(LOT, true); };
  const door = (k = 0.1) => { light(k); vis(LR, true); };
  const cg = (x, z, ry = 0.5) => { put(C_G, x, 0, z, ry); };
  const cy2 = (x, z, ry = 0.5) => { put(C_Y, x, 0, z, ry); };
  const R = (lt, t, x3 = [-1.2, 0.0, 1.2], o = {}) => { stand(r1, x3[0], t, 2, { mood: 'angry', armL: [140, 0], armR: [20, 0], ...o }); stand(r2, x3[1], t, 3, { mood: 'sly', armL: [120, 0], armR: [120, 0], ...o }); stand(r3, x3[2], t, 4, { mood: 'happy', armL: [20, 0], armR: [140, 0], ...o }); return [r1, r2, r3]; };
  const room = (k = 0) => { light(k); vis(LR, true); };
  // M
  shot('M01', 0, 2.9, 'joke', [0, 4.4, 0], (lt, d, t) => { room(); put(PH, 0.4, 1.6, 0.5, 0.2); PH.scale.setScalar(0.9); stand(you, -0.5, t, 1, { mood: 'sly', armL: [120, 0], armR: [10, 0] }); return [you]; }, KC2(0, 1.9, 5.8, 1.5, 44), [[0.2, 'whoosh', 0.3], [1.3, 'pop', 0.3]]);
  shot('M02', 2.9, 4.4, 'really', [0, 4.2, 0], (lt, d, t) => { room(); stand(mom, 0.7, t, 5, { mood: 'shock', armL: [160, 0], armR: [160, 0] }); stand(you, -0.7, t, 1, { mood: 'laugh', armL: [20, 0] }); return [mom, you]; }, KC2(0, 1.9, 5.8, 1.4, 44), [[0.1, 'pop', 0.4]]);
  shot('M03', 4.4, 6.6, 'bel', [0, 4.2, 0], (lt, d, t) => { room(); stand(mom, 0.5, t, 5, { mood: 'happy', armL: [100, 0], armR: [100, 0], bob: Math.abs(Math.sin(t * 8)) * 4 }); stand(you, -0.7, t, 1, { mood: 'smug', armL: [10, 0] }); return [mom, you]; }, KC2(0, 1.9, 5.6, 1.4, 44), [[0.3, 'boing', 0.4]]);
  shot('M04', 6.6, 8.85, 'neigh', [0, 4.4, 0], (lt, d, t) => { room(); stand(mom, 0.1, t, 5, { mood: 'happy', armL: [150 + Math.sin(t * 9) * 12, 0], armR: [150, 0] }); R(lt, t, [-0.95, -0.5, 0.85], { mood: 'shock', armL: [90, 0], armR: [90, 0] }); return [mom, r1, r2, r3]; }, KC2(0, 1.9, 6.4, 1.4, 46), [[0.2, 'whoosh', 0.3], [1.0, 'cheer', 0.3]]);
  shot('M05', 8.85, 10.4, 'rel', [0, 4.4, 0], (lt, d, t) => { room(0.05); return R(lt, t).concat([]); }, KC2(0, 2.2, 8.6, 1.4, 46), [[0.1, 'knock', 0.5], [0.5, 'knock', 0.5]]);
  shot('M06', 10.4, 12.1, 'loan', [0, 4.2, 0], (lt, d, t) => { room(0.05); stand(you, -1.3, t, 1, { mood: 'worried', armL: [10, 0] }); stand(r1, 0.0, t, 2, { mood: 'angry', armL: [95, 0], armR: [95, 0] }); stand(r2, 1.1, t, 3, { mood: 'sly', armL: [95, 0], armR: [95, 0] }); return [you, r1, r2]; }, KC2(-0.1, 2.1, 7.6, 1.4, 46), [[0.2, 'coin', 0.4]]);
  shot('M07', 12.1, 13.7, 'prank', [0, 4.2, 0], (lt, d, t) => { room(); stand(you, -0.5, t, 1, { mood: 'shock', armL: [150 + Math.sin(t * 14) * 15, 0], armR: [150 - Math.sin(t * 14) * 15, 0] }); stand(mom, 0.7, t, 5, { mood: 'neutral', armL: [10, 0] }); return [you, mom]; }, KC2(0, 1.9, 5.8, 1.4, 44), [[0.2, 'alarm', 0.25]]);
  shot('M08', 13.7, 16.1, 'smile', [0, 4.2, 0], (lt, d, t) => { room(); stand(mom, 0.5 + Math.min(1, lt / 1.6) * 0.5, t, 5, { mood: 'happy', armL: [10, 0] }); stand(you, -0.7, t, 1, { mood: 'worried', look: [1, 0] }); return [mom, you]; }, KC2(0, 1.9, 6.2, 1.4, 44), [[0.2, 'tock', 0.4], [1.3, 'step', 0.3]]);
  shot('M09', 16.1, 17.6, 'wait', [0, 4.0, 0], (lt, d, t) => { room(0.3); stand(mom, 0.7, t, 5, { mood: 'happy', armL: [60, 0], talk: 1 }); stand(you, -0.7, t, 1, { mood: 'worried' }); return [mom, you]; }, KC2(0, 1.8, 5.4, 1.4, 42), []);
  shot('M10', 17.6, 19.4, 'tin', [0, 3.6, 0], (lt, d, t) => { room(0.3); put(TN, 0, 0.5, 0.6, 0.3); TN.scale.setScalar(0.85); TN.open(0); return []; }, [[0, 1.9, 6.4], [0, 1.7, 5.5], [0, 1.0, 0], 42], [[0.2, 'thud', 0.4]]);
  shot('M11', 19.4, 21.3, 'ten', [0, 4.2, 0], (lt, d, t) => { room(0.3); stand(mom, 0.5, t, 5, { mood: 'happy', armL: [60, 0], talk: 1 }); stand(you, -0.7, t, 1, { mood: 'shock', armL: [10, 0] }); return [mom, you]; }, KC2(0, 1.9, 5.4, 1.4, 42), [[0.3, 'tock', 0.4]]);
  shot('M12', 21.3, 23.4, 'dream', [0, 4.2, 0], (lt, d, t) => { room(0.4); stand(mom, 0.7, t, 5, { mood: 'happy', armL: [100, 0], armR: [100, 0], talk: 1 }); stand(you, -0.7, t, 1, { mood: 'sad', armL: [10, 0] }); put(TN, -0.1, 1.0, 0.7, 0.2); TN.scale.setScalar(0.6); TN.open(0); return [mom, you]; }, KC2(0, 1.9, 5.4, 1.4, 42), [[0.2, 'heartbeat', 0.45]]);
  shot('M13', 23.4, 25.0, 'open', [0, 3.6, 0], (lt, d, t) => { room(0.4); put(TN, 0, 0.5, 0.6, 0.2); TN.scale.setScalar(0.85); TN.open(Math.min(1, lt / 0.5)); return []; }, [[0, 1.9, 6.4], [0, 1.7, 5.5], [0, 1.0, 0], 42], [[0.1, 'creak', 0.4]]);
  shot('M14', 25.0, 26.6, 'rup', [0, 3.6, 0], (lt, d, t) => { room(0.4); put(TN, -0.3, 0.5, 0.2, 0.2); TN.scale.setScalar(0.8); TN.open(1); put(LT, 0.8, 1.0, 0.6, 0.0); LT.scale.setScalar(0.6); return []; }, [[0, 1.9, 6.4], [0, 1.7, 5.5], [0, 1.0, 0], 42], [[0.2, 'coin', 0.4]]);
  shot('M15', 26.6, 28.5, 'mil', [0, 3.6, 0], (lt, d, t) => { room(0.4); put(LT, 0, 1.6, 0.8, 0); LT.scale.setScalar(1.0); return []; }, [[0, 1.6, 4.2], [0, 1.6, 3.4], [0, 1.6, 0], 42], [[0.3, 'heartbeat', 0.4]]);
  shot('M16', 28.5, 30.0, 'cry', [0, 4.2, 0], (lt, d, t) => { room(0.4); stand(you, -0.7, t, 1, { mood: 'sad', armL: [100, 0], armR: [100, 0] }); stand(mom, 0.7, t, 5, { mood: 'sad', armL: [100, 0], armR: [100, 0] }); return [you, mom]; }, KC2(0, 1.9, 5.2, 1.4, 42), []);
  shot('M17', 30.0, 31.6, 'ask', [0, 4.4, 0], (lt, d, t) => { room(0.05); stand(you, -1.4, t, 1, { mood: 'sad' }); R(lt, t, [-0.3, 0.5, 1.3], { mood: 'sly', armL: [95, 0], armR: [95, 0] }); return [you, r1, r2, r3]; }, KC2(0, 2.2, 8.2, 1.4, 46), [[0.2, 'badumtss', 0.5]]);
  shot('M18', 31.6, 33.3, 'broke', [0, 4.2, 0], (lt, d, t) => { room(); stand(you, -0.7, t, 1, { mood: 'tired', armL: [10, 0] }); stand(mom, 0.7, t, 5, { mood: 'laugh', armL: [100, 0], armR: [100, 0] }); return [you, mom]; }, KC2(0, 1.9, 5.8, 1.4, 44), [[0.2, 'trombone', 0.4]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
