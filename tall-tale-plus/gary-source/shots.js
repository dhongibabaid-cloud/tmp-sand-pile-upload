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
const GARY = { body: '#4A7AB5', hat: 'beanie', hatCol: '#F2C94C', pattern: 'check', patCol: '#2E5A8A', extra: ['mustache', 'glasses'] };
const MOM = { body: '#B58AB5', head: '#F4E8DA', hat: 'bun', hatCol: '#D8D8E0', pattern: 'plain', extra: ['glasses', 'blush'] };
assertDistinct([YOU, GARY, MOM], 'gary cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; };
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const LR = GR.livingroom(), LOT = GH.lot(), C_G = GH.car('#C0392B'), C_Y = GH.car('#2E7AC8'), NT = GH.notes(), CN = GH.cone(), PZ = GH.pizza(), SG = GH.sign(), LT = GH.letter('Please do not park|in my spot. Thanks!'), LT2 = GH.letter('First come,|first served.|Love, Gary'), LT3 = GH.letter('The spot is yours.|Coffee is on me.');
  const OBJ = [LR, LOT, C_G, C_Y, NT, CN, PZ, SG, LT, LT2, LT3]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('spot', 'MY PARKING SPOT', '#2E6A9A'); bdc('daily', 'EVERY SINGLE DAY', '#B5372E'); bdc('polite', 'ONE POLITE NOTE', '#2E6A4A'); bdc('reply', "GARY'S REPLY", '#2A2A33'); bdc('first', 'FIRST COME, FIRST SERVED', '#B5372E');
  bdc('revenge', 'TIME FOR REVENGE', '#7A4A9A'); bdc('d1', 'DAY 1: BLOCKED IN', '#B5372E'); bdc('honk', 'HONK AT 6 AM', '#F28C28'); bdc('wave', 'I WAVED LIKE AN ANGEL', '#2E6A4A');
  bdc('d2', 'DAY 2: STICKY NOTES', '#C28A00'); bdc('d3', 'DAY 3: TRAFFIC CONE', '#F28C28'); bdc('knock', 'KNOCK KNOCK', '#2A2A33'); bdc('who', 'WHO IS IT?', '#2E3A7A');
  bdc('son', "YOU'RE BLOCKING MY SON", '#7A4A9A'); bdc('night', 'NIGHT SHIFTS', '#2E3A7A'); bdc('tired', "HE'S EXHAUSTED", '#2E3A7A'); bdc('froze', 'I FROZE', '#2E6A9A'); bdc('worst', 'WORST PERSON ON EARTH', '#2A2A33');
  bdc('newnote', 'A NEW NOTE', '#2E6A4A'); bdc('yours', 'THE SPOT IS YOURS', '#2E6A4A'); bdc('pizza', 'GARY WITH A PIZZA', '#F28C28'); bdc('fav', 'MY FAVORITE NEIGHBOR', '#C2477A'); bdc('best', 'BEST FRIENDS NOW', '#2E6A4A'); bdc('stillspot', 'STILL TAKES MY SPOT', '#B5372E'); bdc('butpizza', 'BUT HE BRINGS PIZZA', '#F28C28');
  const boards = Object.values(BD);
  const you = person(YOU), gary = person(GARY), mom = person(MOM);
  const SP = [you, gary, mom]; SP.forEach((p) => sc.add(p.group));
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
  const lot = (k = 0) => { light(k); vis(LOT, true); };
  const door = (k = 0.1) => { light(k); vis(LR, true); };
  const cg = (x, z, ry = 0.5) => { put(C_G, x, 0, z, ry); };
  const cy2 = (x, z, ry = 0.5) => { put(C_Y, x, 0, z, ry); };
  // L0
  shot('G01', 0, 1.5, 'spot', [0, 4.6, 0], (lt, d, t) => { lot(); cg(0.3, -0.5, 0.45); stand(you, -1.0, t, 1, { mood: 'angry', armL: [10, 0], look: [1, 0] }); return [you]; }, KC2(0, 2.4, 8.2, 1.4, 46), [[0.1, 'whoosh', 0.3]]);
  shot('G02', 1.5, 2.9, 'daily', [0, 4.6, 0], (lt, d, t) => { lot(); cg(0.3, -0.5, 0.45); stand(you, -1.0, t, 1, { mood: 'angry', armL: [140, 0], armR: [40, 0] }); return [you]; }, KC2(0, 2.4, 8.0, 1.4, 46), [[0.1, 'thud', 0.4]]);
  shot('G03', 2.9, 4.5, 'polite', [0, 4.2, 0], (lt, d, t) => { lot(); cg(0.5, -0.5, 0.45); put(LT, 0.3, 1.5, 0.6, 0.2); LT.scale.setScalar(0.7); stand(you, -0.6, t, 1, { mood: 'happy', armL: [100, 0] }); return [you]; }, KC2(0, 2.0, 6.4, 1.4, 44), [[0.3, 'pop', 0.3]]);
  // L1
  shot('G04', 4.5, 5.9, 'reply', [0, 3.6, 0], (lt, d, t) => { lot(); put(LT2, 0, 1.6, 0.8, 0); LT2.scale.setScalar(1.0); return []; }, [[0, 1.6, 4.2], [0, 1.6, 3.4], [0, 1.6, 0], 42], [[0.2, 'tock', 0.4]]);
  shot('G05', 5.9, 7.3, 'first', [0, 4.2, 0], (lt, d, t) => { lot(); cg(1.0, -0.8, 0.45); stand(gary, 0.0, t, 2, { mood: 'smug', armL: [120, 0], armR: [20, 0] }); return [gary]; }, KC2(0.2, 2.0, 6.0, 1.5, 44), [[0.1, 'bruh_clip', 0.5]]);
  // L2
  shot('G06', 7.3, 8.9, 'revenge', [0, 4.2, 0], (lt, d, t) => { lot(); cg(1.0, -0.8, 0.45); stand(you, -0.4, t, 1, { mood: 'sly', armL: [120, 0] }); return [you]; }, KC2(0, 2.0, 5.6, 1.5, 44), [[0.1, 'whoosh', 0.3]]);
  shot('G07', 8.9, 11.1, 'd1', [0, 4.4, 0], (lt, d, t) => { lot(); cg(0.2, -1.0, 0.0); cy2(-0.4 + Math.min(1, lt / 0.8) * 0.4, 0.5, Math.PI / 2 - 0.1 + (1 - Math.min(1, lt / 0.8)) * 0.6); stand(you, -1.2, t, 1, { mood: 'sly', armL: [60, 0] }); return [you]; }, KC2(0, 2.6, 8.4, 1.2, 46), [[0.2, 'step', 0.3], [0.9, 'slam', 0.4]]);
  // L3
  shot('G08', 11.1, 12.4, 'honk', [0, 4.2, 0], (lt, d, t) => { lot(); cg(0.2, -1.0, 0.0); cy2(0.0, 0.5, Math.PI / 2); stand(gary, 1.2, t, 2, { mood: 'angry', armL: [150 + Math.sin(t * 20) * 10, 0], armR: [150, 0] }); return [gary]; }, KC2(0, 2.2, 6.4, 1.4, 46), [[0.1, 'alarm', 0.3], [0.5, 'alarm', 0.3]]);
  shot('G09', 12.4, 13.8, 'wave', [0, 4.2, 0], (lt, d, t) => { lot(); cy2(0.2, -0.5, 0.2); stand(you, -0.2, t, 1, { mood: 'happy', armL: [150 + Math.sin(t * 10) * 15, 0] }); return [you]; }, KC2(0, 2.0, 5.6, 1.5, 44), [[0.2, 'boing', 0.4]]);
  // L4
  shot('G10', 13.8, 15.3, 'd2', [0, 4.4, 0], (lt, d, t) => { lot(); cg(0.0, -0.6, 0.0); NT.show(Math.min(1, lt / 1.2)); put(NT, 0.0, 0, -0.6); stand(you, -1.2, t, 1, { mood: 'sly', armL: [100, 0] }); return [you]; }, KC2(0, 2.4, 7.6, 1.3, 46), [[0.3, 'pop', 0.3], [0.7, 'pop', 0.3]]);
  shot('G11', 15.3, 16.7, 'd2', [0, 4.2, 0], (lt, d, t) => { lot(); cg(0.0, -0.6, 0.0); NT.show(1); put(NT, 0.0, 0, -0.6); return []; }, [[0.2, 1.6, 5.8], [0.2, 1.6, 4.8], [0.2, 1.1, 0], 44], [[0.1, 'tock', 0.3]]);
  // L5
  shot('G12', 16.7, 18.4, 'd3', [0, 4.4, 0], (lt, d, t) => { lot(); cg(0.0, -0.6, 0.0); NT.show(1); put(NT, 0.0, 0, -0.6); put(CN, 0.0, 1.9 + (1 - Math.min(1, lt / 0.5)) * 2, -0.3); CN.scale.setScalar(1.2); stand(you, -1.2, t, 1, { mood: 'sly', armL: [150, 0] }); return [you]; }, KC2(0, 2.4, 7.6, 1.4, 46), [[0.4, 'plop', 0.4]]);
  shot('G13', 18.4, 19.9, 'knock', [0, 4.0, 0], (lt, d, t) => { door(0.5); stand(you, 0, t, 1, { mood: 'worried', look: [1, 0] }); return [you]; }, KC2(0, 1.9, 5.6, 1.4, 44), [[0.1, 'knock', 0.5], [0.6, 'knock', 0.5]]);
  shot('G14', 19.9, 21.4, 'who', [0, 4.0, 0], (lt, d, t) => { door(0.5); stand(you, -0.8, t, 1, { mood: 'shock', armL: [20, 0] }); idle(mom, 0.7, 0.4, 0, t, 5, { mood: 'sad', armL: [20, 0] }); return [you, mom]; }, KC2(0, 1.9, 5.8, 1.4, 44), [[0.2, 'creak', 0.4]]);
  // L6
  shot('G15', 21.4, 23.7, 'son', [0.2, 3.6, 0], (lt, d, t) => { door(0.5); idle(mom, 0.2, 0.4, 0, t, 5, { mood: 'sad', armL: [60, 0], talk: 1 }); return [mom]; }, [[0.2, 1.4, 4.6], [0.2, 1.4, 3.8], [0.2, 1.3, 0], 40], []);
  shot('G16', 23.7, 25.9, 'night', [0, 4.2, 0], (lt, d, t) => { door(1.1); idle(mom, 0.5, 0.4, 0, t, 5, { mood: 'sad', armL: [20, 0] }); stand(you, -0.7, t, 1, { mood: 'sad' }); return [mom, you]; }, KC2(0, 1.9, 5.8, 1.4, 44), [[0.2, 'heartbeat', 0.4]]);
  shot('G17', 25.9, 28.1, 'tired', [0, 4.2, 0], (lt, d, t) => { lot(1.1); cg(0.0, -0.2, 0.0); stand(gary, 0.0, t, 2, { mood: 'tired', armL: [5, 0], armR: [5, 0] }); return [gary]; }, KC2(0, 2.0, 6.4, 1.4, 44), []);
  // L7
  shot('G18', 28.1, 29.4, 'froze', [0, 4.0, 0], (lt, d, t) => { door(0.5); stand(you, 0, t, 1, { mood: 'shock', armL: [10, 0], armR: [10, 0], blink: 0 }); return [you]; }, [[0, 1.8, 5.2], [0, 1.8, 4.4], [0, 1.6, 0], 42], [[0.1, 'heartbeat', 0.4]]);
  shot('G19', 29.4, 30.6, 'worst', [0, 4.0, 0], (lt, d, t) => { door(0.8); stand(you, 0, t, 1, { mood: 'sad', armL: [5, 0], armR: [5, 0] }); return [you]; }, [[0, 1.8, 5.2], [0, 1.8, 4.4], [0, 1.6, 0], 42], [[0.2, 'trombone', 0.45]]);
  // L8
  shot('G20', 30.6, 32.6, 'newnote', [0, 4.2, 0], (lt, d, t) => { lot(0.1); cg(1.2, -1.0, 0.45); stand(you, -0.6, t, 1, { mood: 'happy', armL: [100, 0] }); put(LT3, -0.1, 1.6, 0.7, 0.1); LT3.scale.setScalar(0.6); return [you]; }, KC2(0, 2.0, 6.4, 1.4, 44), [[0.2, 'tock', 0.4]]);
  shot('G21', 32.6, 34.6, 'yours', [0, 3.6, 0], (lt, d, t) => { lot(0.1); put(LT3, 0, 1.6, 0.8, 0); LT3.scale.setScalar(1.0); return []; }, [[0, 1.6, 4.2], [0, 1.6, 3.4], [0, 1.6, 0], 42], [[0.2, 'coin', 0.4]]);
  // L9
  shot('G22', 34.6, 37.6, 'pizza', [0, 4.2, 0], (lt, d, t) => { door(0.0); stand(you, -0.9, t, 1, { mood: 'shock', armL: [20, 0] }); stand(gary, 0.7, t, 2, { mood: 'happy', armL: [90, 0] }); put(PZ, 0.7, 1.4, 0.8, 0.1); PZ.scale.setScalar(1.3); return [you, gary]; }, KC2(0, 1.9, 6.0, 1.4, 44), [[0.2, 'knock', 0.4], [1.2, 'pop', 0.3]]);
  // L10
  shot('G23', 37.6, 39.0, 'fav', [0, 4.2, 0], (lt, d, t) => { door(0.0); stand(gary, 0.2, t, 2, { mood: 'happy', armL: [100, 0], armR: [100, 0], talk: 1 }); put(PZ, 0.2, 1.3, 0.8, 0.1); PZ.scale.setScalar(1.2); return [gary]; }, [[0.2, 1.8, 5.2], [0.2, 1.8, 4.4], [0.2, 1.5, 0], 42], []);
  // L11
  shot('G24', 39.0, 41.0, 'best', [0, 4.2, 0], (lt, d, t) => { door(0.0); stand(you, -0.6, t, 1, { mood: 'laugh', armL: [100, 0], armR: [100, 0], bob: Math.abs(Math.sin(t * 8)) * 4 }); stand(gary, 0.6, t, 2, { mood: 'laugh', armL: [100, 0], armR: [100, 0] }); return [you, gary]; }, KC2(0, 1.9, 5.6, 1.4, 44), [[0.2, 'cheer', 0.4]]);
  shot('G25', 41.0, 42.4, 'stillspot', [0, 4.4, 0], (lt, d, t) => { lot(0.0); cg(0.2, -0.5, 0.45); stand(gary, 1.0, t, 2, { mood: 'smug', armL: [20, 0] }); stand(you, -1.0, t, 1, { mood: 'tired' }); return [gary, you]; }, KC2(0, 2.4, 8.0, 1.4, 46), [[0.3, 'boing', 0.4]]);
  shot('G26', 42.4, 44.0, 'butpizza', [0, 4.2, 0], (lt, d, t) => { door(0.0); stand(you, -0.6, t, 1, { mood: 'happy', armL: [60, 0] }); stand(gary, 0.6, t, 2, { mood: 'happy', armL: [60, 0] }); put(PZ, 0.0, 1.1, 0.8, 0.1); PZ.scale.setScalar(1.2); return [you, gary]; }, KC2(0, 1.9, 5.6, 1.4, 44), [[0.3, 'crunch', 0.5]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
