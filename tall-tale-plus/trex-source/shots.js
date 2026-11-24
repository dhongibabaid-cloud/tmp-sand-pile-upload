// WHAT IF A T-REX MOVED INTO YOUR KITCHEN: Tall Tale+ goofy what-if.
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);
const YOU = { body: '#E2663C', hat: 'cap', hatCol: '#222222', pattern: 'stripes', patCol: '#A8401F', extra: ['freckles'] };
const NEI = { body: '#2E9A6A', hat: 'visor', hatCol: '#F2E6CF', pattern: 'plain', extra: ['blush', 'mustache'] };
assertDistinct([MO, YOU, NEI], 'trex cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; };
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const T = RX.trex(0.6), FR = RX.fridge(), K = RX.kitchen(), BS = RX.basement(), DB = RX.dumbbell(), DB2 = RX.dumbbell(), TB = RX.table(), DS = RX.dishes();
  const OBJ = [T, FR, K, BS, DB, DB2, TB, DS]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('tue', 'TUESDAY MORNING', '#2E6A9A'); bdc('what', 'WHAT?!', '#B5372E'); bdc('hungry', 'T-REX: HUNGRY', '#B8860B'); bdc('nom', 'OM NOM NOM', '#2E6A4A'); bdc('bite', '8,000 LB BITE', '#B5372E'); bdc('crush', 'CRUSH', '#B5372E'); bdc('snack', 'CRUNCHY SNACK', '#F28C28'); bdc('mo', 'SNACK TIME', '#2A2A33');
  bdc('tons', '8 TONS', '#2A2A33'); bdc('floor', 'FLOOR SAYS NO', '#B8860B'); bdc('base', 'BASEMENT!', '#6A707A');
  bdc('tiny', 'TINY ARMS', '#2E6A4A'); bdc('curl', 'CURLS 220 LB', '#B5372E'); bdc('each', 'EACH ARM!', '#F28C28'); bdc('wr', 'ARM WRESTLE', '#2E6A9A'); bdc('win', 'REX WINS', '#B5372E');
  bdc('moral', 'MORAL:', '#2A2A33'); bdc('room', 'BEST ROOMMATE', '#2E6A4A'); bdc('dish', 'DISHES!', '#2E6A9A'); bdc('never', 'NEVER LOSES', '#B5372E');
  const boards = Object.values(BD);
  const you = person(YOU), nei = person(NEI), mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const SP = [you, nei, mo]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const resetAll = () => { [...SP, pcn, ...OBJ, ...boards].forEach((o) => vis(o, false)); worldKids.forEach((g) => (g.visible = false)); };
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
  const kit = (k = 0) => { vis(K, true); K.collapse(k); };
  const rex = (x, y, z, ry, t, o = {}, s = 0.42) => { put(T, x, y, z, ry); T.scale.setScalar(s); T.anim(t, o); };
  const fr = (x, k) => { put(FR, x, 0, -1.9); FR.eat(k); };
  const KC = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  // LINE 0 (0.30-4.05)
  shot('K01', 0, 1.2, 'tue', [0, 4.8, 0], (lt, d, t) => { kit(); fr(1.9, 0); stand(you, -1.5, t, 1, { mood: 'happy', armR: [150 + Math.sin(t * 9) * 25, 0] }); you.at(-1.5, 0.4, -0.2); rex(lerp(2.9, 1.7, lt / 1.2), 0, 0.4, Math.PI + 0.35, t, { walk: 1 }); return [you]; }, KC(0, 2.6, 9.0, 1.6, 46), [[0.2, 'step', 0.3], [0.6, 'step', 0.3]]);
  shot('K02', 1.2, 2.2, 'what', [0, 4.8, 0], (lt, d, t) => { kit(); fr(1.9, 0); stand(you, -0.6, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); rex(1.8, 0, -0.2, Math.PI + 0.35, t, { walk: 1 }); return [you]; }, [[-0.4, 2.0, 5.6], [-0.4, 1.95, 4.8], [0.2, 1.6, 0], 46], [[0.1, 'bruh_clip', 0.5]]);
  shot('K03', 2.2, 3.1, 'hungry', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.3, 0); rex(-0.2 + lt * 1.0, 0, 0.0, 0, t, { walk: 1, open: 0.5 }); stand(you, -2.0, t, 1, { mood: 'shock' }); return [you]; }, KC(0, 2.4, 8.4, 1.6, 46), [[0, 'step', 0.3], [0.4, 'step', 0.3]]);
  shot('K04', 3.1, 4.33, 'nom', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.3, clamp(lt / 1.2) * 0.45); rex(0.7, 0, 0.0, 0, t, { chew: 1 }); return []; }, [[0.8, 2.3, 7.0], [0.9, 2.2, 6.2], [1.4, 1.7, 0], 46], [[0.2, 'crunch', 0.5], [0.6, 'crunch', 0.5]]);
  // LINE 1 (4.33-9.05)
  shot('K05', 4.33, 5.4, 'bite', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.8, 0.5); rex(-0.5, 0, 0.5, -0.35, t, { chew: 1 }, 0.9); return []; }, [[0.8, 2.9, 5.4], [0.8, 2.9, 4.6], [0.8, 2.8, 0], 46], [[0.1, 'crunch', 0.5]]);
  shot('K06', 5.4, 6.7, 'crush', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.3, 0.5 + lt * 0.3); rex(0.7, 0, 0.0, 0, t, { chew: 1 }); stand(you, -1.8, t, 1, { mood: 'shock', armR: [170, 0], armL: [170, 0] }); return [you]; }, KC(0, 2.3, 8.0, 1.6, 46), [[0.1, 'crunch', 0.5], [0.7, 'crunch', 0.5]]);
  shot('K07', 6.7, 8.2, 'snack', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.3, 0.9 + lt * 0.08); rex(0.7, 0, 0.0, 0, t, { chew: 1 }); mo.at(-3.4, 1.0, -2.2).set({ mood: 'laugh', blink: blink(t) }); vis(mo, true); return [mo]; }, KC(-0.3, 2.3, 8.4, 1.6, 46));
  shot('K08', 8.2, 9.3, 'mo', [-3.0, 4.8, 0], (lt, d, t) => { kit(); mo.at(-3.4, 1.0, -2.2).set({ mood: 'happy', armL: [100, 0], blink: blink(t) }); vis(mo, true); put(pcn, -3.1, 1.9, -1.9); vis(pcn, true); rex(-1.4, 0, 0.0, 0.5, t, { chew: 1 }); return [mo]; }, [[-3.0, 2.0, 5.4], [-3.0, 2.0, 4.6], [-3.2, 1.5, -1], 46], [[0.2, 'crunch', 0.5]]);
  // LINE 2 (9.3-13.28)
  shot('K09', 9.3, 10.7, 'tons', [0, 4.8, 0], (lt, d, t) => { kit(); const hit = Math.max(0, Math.sin(lt * 9)); rex(0.3, hit * 0.25, 0.4, 0.3, t, { walk: 0 }); T.legs[0].rotation.z = -hit * 0.6; K.tiles.forEach((q) => (q.position.y = -0.05 + (hit > 0.9 ? Math.sin(t * 40 + q.userData.i) * 0.04 : 0))); stand(you, -2.0, t, 1, { mood: 'worried' }); return [you]; }, [[0, 1.4, 8.0], [0, 1.4, 7.2], [0, 1.4, 0], 46], [[0.3, 'boom', 0.6], [0.9, 'boom', 0.6]]);
  shot('K10', 10.7, 11.9, 'floor', [0, 4.8, 0], (lt, d, t) => { kit(lt * 0.18); rex(0.3, 0, 0.2, 0.3, t, { walk: 0, open: 0.4 }); stand(you, -2.4, t, 1, { mood: 'shock', armL: [170, 0] }); return [you]; }, KC(0, 2.3, 8.2, 1.4, 46), [[0.1, 'creak', 0.5], [0.8, 'thud', 0.5]]);
  shot('K11', 11.9, 13.53, 'base', [0, 4.8, 0], (lt, d, t, k) => { kit(0.2 + k * 0.8); vis(BS, true); const f = k * k; rex(0.3, -f * 3.2, 0.2, 0.3, t, { walk: 0, open: 0.5 }); you.at(-2.4, 0.4 - f * 3.6, 0); vis(you, true); you.set({ mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, [[0, 1.6, 8.6], [0, -0.8, 8.2], [0, 0.4, 0], 46], [[0.1, 'whoosh', 0.4], [1.2, 'slam', 0.7]]);
  // LINE 3 (13.53-19.05)
  shot('K12', 13.53, 14.6, 'tiny', [0.2, 0.2, 0.8], (lt, d, t) => { kit(1); vis(BS, true); rex(0.0, -3.0, 0.5, -1.2, t, { arm: 0.9 + Math.sin(t * 14) * 0.4 }, 0.5); return []; }, [[0.2, -1.6, 6.4], [0.2, -1.65, 5.4], [0.2, -1.9, 0.6], 46]);
  shot('K13', 14.6, 15.7, 'curl', [0.2, 0.2, 0.8], (lt, d, t) => { kit(1); vis(BS, true); const c = Math.sin(t * 8); rex(0.0, -3.0, 0.5, -1.2, t, { arm: 0.4 + c * 0.5 }, 0.5); put(DB, -0.05, -1.95 + c * 0.15, 1.3); return []; }, [[0.2, -1.6, 6.4], [0.2, -1.65, 5.4], [0.2, -1.9, 0.6], 46], [[0.1, 'pop', 0.4]]);
  shot('K14', 15.7, 16.9, 'each', [0.2, 0.2, 0.8], (lt, d, t) => { kit(1); vis(BS, true); const c = Math.sin(t * 8); rex(0.0, -3.0, 0.5, -1.2, t, { arm: 0.4 + c * 0.5 }, 0.5); put(DB, -0.05, -1.95 + c * 0.15, 1.3); put(DB2, 0.65, -1.95 - c * 0.15, 1.0); return []; }, [[0.2, -1.6, 6.4], [0.2, -1.65, 5.4], [0.2, -1.9, 0.6], 46], [[0.1, 'pop', 0.4]]);
  shot('K15', 16.9, 18.0, 'wr', [0, 4.6, 0], (lt, d, t) => { kit(0); put(TB, 0, 0, 0.5); rex(1.55, 0, 0.5, Math.PI, t, { arm: 0.2 }, 0.4); stand(you, -1.0, t, 1, { mood: 'angry', armR: [60, 0], lean: 0.3 }); you.at(-1.0 + Math.sin(t * 25) * 0.03, 0.4, 0.5); return [you]; }, KC(0.3, 2.0, 7.4, 1.3, 46));
  shot('K16', 18.0, 19.05, 'win', [0, 4.8, 0], (lt, d, t) => { kit(0); const q = lt; you.at(-1.2 - q * 2.2, 0.4 + Math.sin(q * 3) * 3.0, 0.5); vis(you, true); you.group.rotation.z = q * 5; you.set({ mood: 'shock', armL: [170, 0], armR: [170, 0] }); rex(0.8, 0, 0.5, Math.PI, t, { arm: 2.2, open: 0.4 }, 0.45); return []; }, KC(0, 2.5, 7.6, 1.6, 46), [[0.1, 'ohhhhhh', 0.5]]);
  // LINE 4 (19.05-22.66)
  shot('K17', 19.05, 20.3, 'moral', [0, 4.8, 0], (lt, d, t) => { kit(); mo.at(0, 0.4, 0.8).set({ mood: 'smug', armL: [10, 0], armR: [10, 0], blink: blink(t, 0.3) }); vis(mo, true); put(pcn, -0.3, 1.0, 1.1); vis(pcn, true); return [mo]; }, [[0, 2.0, 5.6], [0, 1.9, 4.8], [0, 1.4, 0], 46]);
  shot('K18', 20.3, 21.4, 'room', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.8, 1); rex(-0.6, 0, 0.6, 0.5, t, { open: 0.15 + Math.max(0, Math.sin(t * 3)) * 0.2, arm: 1.0 }, 0.42); nei.at(1.6, 0.4, 0.6); vis(nei, true); nei.set({ mood: 'happy', armR: [150, 0], blink: blink(t) }); return [nei]; }, KC(0.3, 2.2, 8.2, 1.5, 46), [[0.1, 'whoosh', 0.3]]);
  shot('K19', 21.4, 22.7, 'dish', [0, 4.8, 0], (lt, d, t) => { kit(); put(DS, -2.2, 1.0, -2.3); DS.scale.setScalar(1.6); rex(1.0, 0, 0.3, 0.3, t, { open: 0.5 + Math.sin(t * 5) * 0.1 }, 0.42); stand(you, -0.9, t, 1, { mood: 'angry', armR: [150 + Math.sin(t * 12) * 15, 0] }); return [you]; }, KC(-0.2, 2.2, 7.8, 1.5, 46), [[0.2, 'tock', 0.4]]);
  shot('K20', 22.7, 24.2, 'never', [0, 4.8, 0], (lt, d, t) => { kit(); put(DS, -2.2, 1.0, -2.3); DS.scale.setScalar(1.6 * (1 - lt * 0.5)); rex(-0.2, 0, 0.5, 0.2, t, { chew: 1 }, 0.42); you.at(1.7, 0.4, 0.6); vis(you, true); you.set({ mood: 'sad', armL: [10, 0], armR: [10, 0] }); mo.at(-3.4, 1.0, -2.2).set({ mood: 'laugh', blink: blink(t) }); vis(mo, true); return [you, mo]; }, KC(0, 2.3, 8.2, 1.5, 46), [[0.3, 'crunch', 0.4], [1.0, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
