// GHOST STORY: Tall Tale+ story short (Emma voice for girl lines).
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
const SIS = { body: '#E27A9A', head: '#F7F7FA', hat: 'bow', hatCol: '#B5372E', pattern: 'plain', extra: ['freckles'], kid: true };
const GPA = { body: '#8A8A92', head: '#F4E8DA', hat: 'mailcap', hatCol: '#2E4E8A', pattern: 'plain', extra: ['mustache', 'glasses'] };
const C1 = { body: '#E2B33C', hat: 'visor', hatCol: '#B5372E', pattern: 'plain', extra: ['blush'] };
const C2 = { body: '#7A4A9A', hat: 'beanie', hatCol: '#2E8A4A', pattern: 'check', patCol: '#5A2E7A', extra: ['mustache'] };
const C3 = { body: '#2E9A9A', hat: 'cap', hatCol: '#F28C28', pattern: 'stripes', patCol: '#1E6A6A', extra: ['glasses'] };
assertDistinct([YOU, GPA, C1, C2, C3], 'mail cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; };
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const LR = GR.livingroom(), BRm = GH.bedroom(), TR = GH.trunk(), KY = GH.key(), LT = GH.letter(), LT2 = GH.letter(), JR = GH.jar(), FM = GH.frame();
  const OBJ = [LR, BRm, TR, KY, LT, LT2, JR, FM]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('said', 'GRANDPA ALWAYS SAID', '#2E6A9A'); bdc('treasure', 'MY GREATEST TREASURE', '#C28A00'); bdc('laughed', 'EVERYONE LAUGHED', '#F28C28'); bdc('caps', 'MAILMAN + BOTTLE CAPS', '#2E4E8A');
  bdc('passed', 'HE PASSED AWAY', '#2A2A33'); bdc('fight', 'THE HOUSE IS MINE!', '#B5372E'); bdc('car', 'THE CAR! THE MAILBOX!', '#B5372E');
  bdc('key', 'ONE RUSTY KEY', '#8A5A2A'); bdc('attic', 'OPEN THE ATTIC. ALONE.', '#2A2A33'); bdc('night', 'THAT NIGHT', '#2E3A7A'); bdc('moved', 'SOMETHING MOVED', '#2A2A33');
  bdc('aah', 'AAAAAH!', '#B5372E'); bdc('louder', 'EVEN LOUDER!', '#C2477A'); bdc('why', 'WHY ARE WE HERE?!', '#C2477A');
  bdc('trunk', 'AN OLD TRUNK', '#8A5A2A'); bdc('name', 'EVERY ONE HAD MY NAME', '#2E6A9A'); bdc('bday', 'ONE PER BIRTHDAY', '#C28A00'); bdc('forty', 'UNTIL I TURN 40', '#C28A00');
  bdc('cried', 'I CRIED', '#2E6A9A'); bdc('last', 'THE LAST LETTER', '#2A2A33'); bdc('real', 'THE REAL TREASURE', '#C28A00'); bdc('never', 'NEVER MISS A BIRTHDAY', '#C2477A'); bdc('ps', 'P.S. CAPS ARE WORTHLESS', '#B5372E');
  bdc('both', 'LAUGHING + CRYING', '#7A4A9A'); bdc('best', 'BEST MAILMAN EVER', '#2E6A4A');
  const boards = Object.values(BD);
  const you = person(YOU), sis = person(SIS), gpa = person(GPA), c1 = person(C1), c2 = person(C2), c3 = person(C3);
  const SP = [you, sis, gpa, c1, c2, c3]; SP.forEach((p) => sc.add(p.group));
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
  const room = () => { vis(LR, true); };
  const bath = (cr = 0) => { vis(BR, true); put(TB, 0, 0, -0.8); TB.crack(cr); };
  const cp = (o, x, y, z, ry, t, a = {}, s = 0.9) => { put(o, x, y, z, ry); o.scale.setScalar(s * 0.6); o.anim(t, a); };
  const bird = (x, y, z, ry = 0) => put(BI, x, y, z, ry);
  const HOOK = (lt, d, t) => { room(); cp(CA, -0.6, 0, -0.3, 0.0, t, { open: 0.3 }, 0.9); bird(-0.2, 1.05 + Math.abs(Math.sin(t * 5)) * 0.04, -0.3); stand(you, 0.95, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; };
  const KC2 = (x, y, z, ty = 1.5, fov = 44) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const day = (k = 0.1) => { light(k); vis(LR, true); put(FM, -3.0, 2.8, -3.4); };
  const attic = (k = 1.2) => { light(k); vis(BRm, true); };
  // L0
  shot('M01', 0, 1.4, 'said', [0, 4.2, 0], (lt, d, t) => { day(); stand(gpa, 0.7, t, 2, { mood: 'happy', armL: [90, 0], talk: 1 }); stand(you, -0.8, t, 1, { mood: 'happy', armL: [10, 0] }); return [gpa, you]; }, KC2(0, 2.0, 6.2, 1.5, 44), [[0.1, 'whoosh', 0.3]]);
  shot('M02', 1.4, 4.0, 'treasure', [0, 4.2, 0], (lt, d, t) => { day(); stand(gpa, 0.4, t, 2, { mood: 'proud', armL: [130, 0], armR: [130, 0] }); stand(you, -0.7, t, 1, { mood: 'happy', look: [1, 0] }); return [gpa, you]; }, [[0, 1.9, 5.8], [0, 1.9, 4.8], [0, 1.5, 0], 44], [[0.3, 'coin', 0.5]]);
  // L1
  shot('M03', 4.0, 5.4, 'laughed', [0, 4.2, 0], (lt, d, t) => { day(); const b = Math.abs(Math.sin(t * 12)) * 6; stand(c1, -1.0, t, 3, { mood: 'laugh', bob: b }); stand(c2, 0.0, t, 4, { mood: 'laugh', bob: b }); stand(c3, 1.0, t, 5, { mood: 'laugh', bob: b }); return [c1, c2, c3]; }, KC2(0, 2.0, 7.0, 1.5, 46), [[0.1, 'pop', 0.3]]);
  shot('M04', 5.4, 7.9, 'caps', [0, 4.2, 0], (lt, d, t) => { day(); put(JR, 1.0, 0.0, 0.5); JR.scale.setScalar(1.3); stand(gpa, -0.5, t, 2, { mood: 'proud', armL: [20, 0], talk: 1 }); return [gpa]; }, [[0.2, 1.7, 6.8], [0.2, 1.7, 5.8], [0.2, 1.3, 0], 44], [[0.2, 'plop', 0.4]]);
  // L2
  shot('M05', 7.9, 9.3, 'passed', [0, 4.2, 0], (lt, d, t) => { day(0.7); stand(you, 0.6, t, 1, { mood: 'sad', armL: [5, 0], armR: [5, 0] }); return [you]; }, [[-1.2, 2.2, 6.4], [-1.2, 2.2, 5.6], [-1.2, 2.2, 0], 46], [[0.1, 'creak', 0.3]]);
  shot('M06', 9.3, 10.8, 'fight', [0, 4.2, 0], (lt, d, t) => { day(0.2); const s = Math.sin(t * 14) * 8; stand(c1, -0.8, t, 3, { mood: 'angry', armL: [140 + s, 0], armR: [140 - s, 0] }); stand(c2, 0.8, t, 4, { mood: 'angry', armL: [140 - s, 0], armR: [140 + s, 0] }); return [c1, c2]; }, KC2(0, 2.0, 6.4, 1.5, 44), [[0.1, 'thud', 0.4], [0.7, 'slam', 0.4]]);
  shot('M07', 10.8, 12.2, 'car', [0, 4.2, 0], (lt, d, t) => { day(0.2); const s = Math.sin(t * 14) * 8; stand(c2, -0.8, t, 4, { mood: 'angry', armL: [140 + s, 0] }); stand(c3, 0.8, t, 5, { mood: 'angry', armR: [140 - s, 0] }); stand(you, 0.0, t, 1, { mood: 'sad', armL: [5, 0], armR: [5, 0] }); return [c2, c3, you]; }, KC2(0, 2.0, 6.6, 1.5, 44), [[0.1, 'boing', 0.4]]);
  // L3
  shot('M08', 12.2, 13.8, 'key', [0, 3.4, 0], (lt, d, t) => { day(0.5); put(KY, 0, 1.5 + Math.sin(t * 3) * 0.05, 0.8, 0, 0.3); KY.scale.setScalar(1.8); return []; }, [[0, 1.5, 3.6], [0, 1.5, 3.0], [0, 1.3, 0], 40], [[0.2, 'tock', 0.4]]);
  shot('M09', 13.8, 15.9, 'attic', [0, 4.2, 0], (lt, d, t) => { day(0.5); stand(you, 0, t, 1, { mood: 'worried', armL: [60, 0], armR: [60, 0] }); put(LT, 0.7, 2.2, 0.8, 0.1); LT.scale.setScalar(0.7); return [you]; }, KC2(0.1, 1.9, 5.6, 1.5, 44), [[0.1, 'whoosh', 0.3]]);
  // L4
  shot('M10', 15.9, 17.4, 'night', [0, 4.2, 0], (lt, d, t) => { attic(1.15); stand(you, -0.3, t, 1, { mood: 'worried', armL: [20, 0] }); put(KY, 0.5, 1.4, 0.8); KY.scale.setScalar(0.9); return [you]; }, KC2(0, 2.0, 6.2, 1.5, 44), [[0.1, 'step', 0.4], [0.6, 'creak', 0.4]]);
  shot('M11', 17.4, 19.3, 'moved', [0, 4.2, 0], (lt, d, t) => { attic(1.5); stand(you, -0.6, t, 1, { mood: 'shock', armL: [100, 0], armR: [100, 0] }); return [you]; }, [[-0.6, 1.9, 5.8], [-0.6, 1.9, 4.8], [-0.6, 1.6, 0], 44], [[0.2, 'heartbeat', 0.5]]);
  // L5
  shot('M12', 19.3, 20.7, 'aah', [0, 4.2, 0], (lt, d, t) => { attic(1.15); stand(you, -0.3, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0], talk: 1 }); return [you]; }, [[-0.3, 1.9, 5.2], [-0.3, 1.9, 4.4], [-0.3, 1.7, 0], 42], [[0.05, 'aaaaaa', 0.5]]);
  shot('M13', 20.7, 22.27, 'louder', [0, 4.2, 0], (lt, d, t) => { attic(1.15); stand(you, -0.9, t, 1, { mood: 'shock', armL: [10, 0] }); idle(sis, 0.7, 0.4, 0, t, 5, { mood: 'shock', armL: [170, 0], armR: [170, 0], talk: 1 }); return [you, sis]; }, KC2(0, 1.9, 5.6, 1.4, 44), [[0.1, 'boing', 0.4]]);
  // L6
  shot('M14', 22.27, 23.9, 'why', [0, 4.0, 0], (lt, d, t) => { attic(1.0); idle(sis, 0.2, 0.4, 0, t, 5, { mood: 'worried', armL: [20, 0], talk: 1 }); return [sis]; }, [[0.2, 1.3, 4.4], [0.2, 1.3, 3.6], [0.2, 1.2, 0], 40], []);
  // L7
  shot('M15', 23.9, 25.5, 'trunk', [0, 4.2, 0], (lt, d, t) => { attic(0.9); put(TR, 0, 0, 0); TR.scale.setScalar(1.3); stand(you, -1.0, t, 1, { mood: 'shock', look: [1, 0] }); idle(sis, 1.1, 0.4, 0.3, t, 5, { mood: 'worried' }); return [you, sis]; }, KC2(0, 2.2, 6.4, 1.2, 46), [[0.1, 'creak', 0.4]]);
  shot('M16', 25.5, 28.4, 'name', [0, 3.4, 0], (lt, d, t) => { attic(0.9); put(TR, 0, 0, 0); TR.scale.setScalar(1.6); put(LT, 0.2, 1.7 + Math.sin(t * 3) * 0.05, 1.0, 0.1); LT.scale.setScalar(0.9); return []; }, [[0.2, 1.9, 4.6], [0.2, 1.9, 3.8], [0.2, 1.5, 0], 42], [[0.2, 'pop', 0.4]]);
  // L8
  shot('M17', 28.4, 29.6, 'bday', [0, 4.2, 0], (lt, d, t) => { attic(0.6); put(TR, 0.5, 0, -0.3); stand(you, -0.7, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); put(LT, -0.4, 1.7, 0.9, 0.1); LT.scale.setScalar(0.7); return [you]; }, KC2(0, 2.0, 6.0, 1.4, 44), []);
  shot('M18', 29.6, 30.9, 'forty', [0, 3.6, 0], (lt, d, t) => { attic(0.6); put(LT, -0.4, 1.8, 0.9, 0.1); put(LT2, 0.4, 1.5, 0.7, -0.2); LT.scale.setScalar(0.8); LT2.scale.setScalar(0.8); return []; }, [[0, 1.7, 4.2], [0, 1.7, 3.4], [0, 1.6, 0], 42], [[0.2, 'stamp', 0.4]]);
  // L9
  shot('M19', 30.9, 32.4, 'cried', [0, 4.2, 0], (lt, d, t) => { day(0.6); stand(you, -0.5, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); idle(sis, 0.7, 0.4, 0.2, t, 5, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); return [you, sis]; }, KC2(0, 1.8, 5.2, 1.3, 44), []);
  shot('M20', 32.4, 33.9, 'last', [0, 3.6, 0], (lt, d, t) => { day(0.4); put(LT, 0, 1.7, 0.9, 0); LT.scale.setScalar(1.0); return []; }, [[0, 1.7, 4.0], [0, 1.7, 3.2], [0, 1.6, 0], 42], [[0.2, 'switch', 0.4]]);
  // L10 (33.78-41.1)
  shot('M21', 33.9, 36.5, 'real', [0, 4.2, 0], (lt, d, t) => { day(0.2); put(FM, 0.0, 2.6, 0.4); FM.scale.setScalar(1.4); stand(you, -1.0, t, 1, { mood: 'sad', armL: [20, 0] }); return [you]; }, KC2(0, 2.2, 6.0, 1.9, 46), [[0.2, 'tock', 0.3]]);
  shot('M22', 36.5, 38.8, 'never', [0, 4.2, 0], (lt, d, t) => { day(0.1); stand(gpa, 0.6, t, 2, { mood: 'happy', armL: [20, 0] }); stand(you, -0.8, t, 1, { mood: 'happy', armL: [60, 0], armR: [60, 0] }); return [you, gpa]; }, KC2(0, 2.0, 6.0, 1.5, 44), []);
  shot('M23', 38.8, 41.2, 'ps', [0, 4.2, 0], (lt, d, t) => { day(0.1); put(JR, 0.7, 0.0, 0.6); JR.scale.setScalar(1.3); stand(you, -0.7, t, 1, { mood: 'shock', armL: [100, 0], armR: [100, 0] }); return [you]; }, KC2(0, 2.0, 5.8, 1.4, 44), [[0.3, 'badumtss', 0.5]]);
  // L11-12
  shot('M24', 41.2, 43.0, 'both', [0, 4.2, 0], (lt, d, t) => { day(0.1); stand(you, 0, t, 1, { mood: 'laugh', armL: [60, 0], armR: [60, 0], bob: Math.abs(Math.sin(t * 10)) * 5 }); return [you]; }, [[0, 1.9, 5.0], [0, 1.9, 4.2], [0, 1.6, 0], 42], []);
  shot('M25', 43.0, 45.4, 'best', [0, 4.2, 0], (lt, d, t) => { day(0.0); put(FM, 2.3, 3.0, -2.8); stand(you, -0.4, t, 1, { mood: 'happy', armL: [40, 0] }); idle(sis, 0.5, 0.4, 0.1, t, 5, { mood: 'happy', armL: [60, 0], armR: [60, 0] }); return [you, sis]; }, KC2(0, 2.0, 5.8, 1.4, 44), [[0.2, 'cheer', 0.4]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
