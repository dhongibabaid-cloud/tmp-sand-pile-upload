// WHAT IF AN OCTOPUS MOVED INTO YOUR KITCHEN: Tall Tale+ goofy what-if.
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
import * as OC from './core/oct.js';
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
  const OCT = OC.octopus(0.8), HT = OC.hearts(), VL = OC.vial(), CN = OC.coins(), DR = OC.drain(), NT = OC.net(), ML = OC.milk(), FR = RX.fridge(), K = RX.kitchen(), DS = RX.dishes();
  const OBJ = [OCT, HT, VL, CN, DR, NT, ML, FR, K, DS]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('hook', 'OCTOPUS IN YOUR KITCHEN', '#8A4AB5'); bdc('what', 'WHAT?!', '#B5372E'); bdc('raid', 'RAIDING THE FRIDGE', '#B8860B'); bdc('arm7', 'ARM #7', '#2E6A4A');
  bdc('h3', '3 HEARTS', '#B5372E'); bdc('blue', 'BLUE BLOOD', '#2E5AA8'); bdc('cu', 'RUNS ON COPPER', '#C8743A');
  bdc('neur', '2/3 OF NEURONS', '#8A4AB5'); bdc('inarms', 'IN HIS ARMS', '#B5372E'); bdc('every', 'EVERY ARM...', '#2E6A9A'); bdc('self', 'THINKS FOR ITSELF', '#2A2A33');
  bdc('catch', 'CATCH HIM!', '#B8860B'); bdc('beak', 'ONLY HARD PART: BEAK', '#2A2A33'); bdc('sq', 'SQUISH', '#8A4AB5'); bdc('drain', 'DOWN THE DRAIN', '#2E6A9A');
  bdc('moral', 'MORAL:', '#2A2A33'); bdc('hide', 'HIDE AND SEEK', '#2E6A4A'); bdc('lose', 'YOU LOSE', '#B5372E');
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
  const kit = () => { vis(K, true); K.collapse(0); };
  const oct = (x, y, z, ry, t, o = {}, s = 0.55) => { put(OCT, x, y, z, ry); OCT.scale.setScalar(s); OCT.arms.forEach((a, i) => { a.up = o.up && o.up.includes(i) ? 1 : 0; }); OCT.anim(t, o); };
  const fr = (x, k) => { put(FR, x, 0, -1.9); FR.eat(k); };
  const KC = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  // LINE 0 (0.30-5.65)
  shot('O01', 0, 1.2, 'hook', [0, 4.8, 0], (lt, d, t) => { kit(); fr(1.9, 0.08); oct(0.4, 0, 0.6, 0, t, { crawl: 1, up: [1, 2, 3] }); stand(you, -1.7, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, KC(0, 2.3, 8.4, 1.5, 46), [[0.1, 'whoosh', 0.35]]);
  shot('O02', 1.2, 2.4, 'what', [0, 4.8, 0], (lt, d, t) => { kit(); fr(1.9, 0.08); oct(1.4, 0, 0.0, 0, t, { crawl: 1 }); stand(you, -0.6, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, [[-0.3, 2.0, 5.8], [-0.3, 1.95, 5.0], [0.2, 1.5, 0], 46], [[0.1, 'bruh_clip', 0.5]]);
  shot('O03', 2.4, 3.4, 'raid', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.0, 0.08); oct(lerp(-0.4, 0.7, lt), 0, 0.5, 0, t, { crawl: 1 }); return []; }, KC(0.4, 2.2, 7.6, 1.4, 46), [[0.1, 'plop', 0.4], [0.5, 'plop', 0.4]]);
  shot('O04', 3.4, 4.4, 'raid', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.0, 0.1 + lt * 0.12); oct(0.8, 0, 0.3, 0, t, { up: [2, 5] }); put(ML, 0.3, 1.5 + Math.sin(t * 9) * 0.15, 1.0); return []; }, KC(0.8, 2.3, 7.0, 1.4, 46), [[0.1, 'pop', 0.4]]);
  shot('O05', 4.4, 5.9, 'arm7', [0, 4.8, 0], (lt, d, t) => { kit(); oct(0.0, 0, 0.8, 0, t, { up: [6] , wiggle: 0.5 }); OCT.arms[6].seg.forEach((m, k) => { m.position.y += Math.sin(t * 12 + k) * 0.05; }); put(ML, 1.0, 1.9, 1.4); return []; }, [[0.2, 1.8, 5.6], [0.2, 1.8, 4.6], [0.2, 1.3, 0.5], 46], [[0.3, 'boing', 0.4]]);
  // LINE 1 (5.9-9.3)
  shot('O06', 5.9, 7.2, 'h3', [0, 4.8, 0], (lt, d, t) => { kit(); oct(0.0, 0, 0.0, 0, t, { wiggle: 0.5 }); put(HT, 0, 2.0, 0.9); HT.pulse(t); HT.scale.setScalar(0.7); return []; }, [[0, 2.0, 6.4], [0, 2.0, 5.4], [0, 1.6, 0], 46], [[0.0, 'heartbeat', 0.6], [0.7, 'heartbeat', 0.6]]);
  shot('O07', 7.2, 8.2, 'blue', [0, 4.8, 0], (lt, d, t) => { kit(); put(VL, 0, 0.6, 1.0); VL.scale.setScalar(1.6); VL.li.scale.y = 0.6 + Math.sin(t * 4) * 0.05; oct(1.5, 0, -0.4, 0, t, { wiggle: 0.6 }, 0.45); return []; }, [[0.3, 2.0, 5.6], [0.3, 1.95, 4.8], [0.3, 1.5, 0], 46], [[0.1, 'bubbles', 0.4]]);
  shot('O08', 8.2, 9.55, 'cu', [0, 4.8, 0], (lt, d, t) => { kit(); put(CN, -0.5, 0.3, 1.0); CN.scale.setScalar(1.3); oct(1.2, 0, -0.4, 0, t, { up: [3], wiggle: 0.6 }, 0.45); return []; }, [[0.3, 2.0, 5.6], [0.3, 1.95, 4.8], [0.3, 1.4, 0.6], 46], [[0.2, 'coin', 0.5]]);
  // LINE 2 (9.55-13.96)
  shot('O09', 9.55, 10.9, 'neur', [0, 4.8, 0], (lt, d, t) => { kit(); oct(0.0, 0, 0.5, 0, t, { brain: 1, wiggle: 0.5 }); return []; }, [[0, 1.9, 5.4], [0, 1.9, 4.6], [0, 1.4, 0.3], 46], [[0.1, 'pop', 0.4]]);
  shot('O10', 10.9, 12.2, 'inarms', [0, 4.8, 0], (lt, d, t) => { kit(); oct(0.0, 0, 0.3, 0, t, { brain: 1, up: [0, 2, 4, 6], wiggle: 1.2 }); return []; }, [[0, 2.2, 6.4], [0, 2.1, 5.4], [0, 1.5, 0.3], 46], [[0.1, 'whoosh', 0.35]]);
  shot('O11', 12.2, 13.1, 'every', [0, 4.8, 0], (lt, d, t) => { kit(); fr(2.0, 0.1); oct(0.5, 0, 0.3, 0, t, { up: [1, 4, 6], wiggle: 1.4 }); put(ML, 1.2, 2.0 + Math.sin(t * 6) * 0.2, 0.8); stand(you, -1.6, t, 1, { mood: 'worried' }); return [you]; }, KC(0, 2.3, 7.6, 1.5, 46), [[0.2, 'plop', 0.4]]);
  shot('O12', 13.1, 13.96, 'self', [0, 4.8, 0], (lt, d, t) => { kit(); oct(1.0, 0, 0.4, 0, t, { up: [5], wiggle: 0.7 }); stand(you, -0.6, t, 1, { mood: 'shock', armR: [150, 0] }); OCT.arms[5].seg.forEach((m, k) => { m.position.x -= k * 0.05; m.position.y += Math.sin(t * 20) * 0.04 * k; }); return [you]; }, [[0.2, 2.0, 5.8], [0.2, 1.95, 5.0], [0.2, 1.5, 0], 46], [[0.1, 'stamp', 0.5]]);
  // LINE 3 (13.96-18.8)
  shot('O13', 13.96, 15.05, 'catch', [0, 4.8, 0], (lt, d, t) => { kit(); put(NT, -0.8, 0, 0.8, 0.3); NT.rotation.z = -0.5 + Math.sin(t * 10) * 0.12; stand(you, -1.5, t, 1, { mood: 'angry', armR: [120, 0] }); oct(lerp(1.4, 0.6, lt), 0, 0.2, 0, t, { crawl: 1 }); return [you]; }, KC(0, 2.2, 7.6, 1.5, 46), [[0.1, 'step', 0.3]]);
  shot('O14', 15.05, 16.45, 'beak', [0, 2.35, 2.4], (lt, d, t) => { kit(); oct(0.0, 0, 0.9, 0, t, { wiggle: 0.4 }, 0.7); return []; }, [[0, 1.2, 4.6], [0, 1.15, 3.9], [0, 0.85, 1.4], 46], [[0.1, 'pop', 0.4]]);
  shot('O15', 16.45, 17.5, 'sq', [0, 4.8, 0], (lt, d, t) => { kit(); put(DR, 0, 0.02, 0.6); oct(0, 0, 0.6, 0, t, { squash: lerp(1, 0.35, lt), wiggle: 1.5 }, 0.5); return []; }, [[0, 2.4, 6.0], [0, 2.3, 5.2], [0, 0.8, 0.6], 46], [[0.2, 'whoosh', 0.4]]);
  shot('O16', 17.5, 18.8, 'drain', [0, 4.8, 0], (lt, d, t) => { kit(); put(DR, 0, 0.02, 0.6); const k = clamp(lt / 1.0); oct(0, -k * 1.4, 0.6, 0, t, { squash: 1 - k * 0.7, wiggle: 2 }, 0.5 * (1 - k * 0.8)); stand(you, -1.5, t, 1, { mood: 'shock', armR: [100, 0] }); return [you]; }, [[0, 2.4, 6.4], [0, 2.3, 5.6], [0, 0.9, 0.6], 46], [[0.2, 'ohhhhhh', 0.5], [0.4, 'bubbles', 0.4]]);
  // LINE 4 (18.8-22.7)
  shot('O17', 18.8, 20.0, 'moral', [0, 4.8, 0], (lt, d, t) => { kit(); mo.at(0, 0.4, 0.8).set({ mood: 'smug', armL: [10, 0], armR: [10, 0], blink: blink(t, 0.3) }); vis(mo, true); put(pcn, -0.3, 1.0, 1.1); vis(pcn, true); return [mo]; }, [[0, 2.0, 5.6], [0, 1.9, 4.8], [0, 1.4, 0], 46]);
  shot('O18', 20.0, 21.3, 'hide', [0, 4.8, 0], (lt, d, t) => { kit(); stand(you, -1.0, t, 1, { mood: 'happy', armL: [160, 0], armR: [160, 0] }); you.group.rotation.y = 0.0; oct(1.5, 0, -2.0, 0, t, { wiggle: 0.15 }, 0.7); return [you]; }, KC(0.3, 2.2, 7.8, 1.5, 46), [[0.3, 'tock', 0.4]]);
  shot('O19', 21.3, 22.7, 'lose', [0, 4.8, 0], (lt, d, t) => { kit(); stand(you, -0.5, t, 1, { mood: 'worried', armL: [20, 0], armR: [20, 0] }); put(OCT, -0.5, 1.9, 0.4, 0); OCT.scale.setScalar(0.28); OCT.anim(t, { wiggle: 1.2 }); mo.at(1.7, 0.4, 0.6).set({ mood: 'laugh', blink: blink(t) }); vis(mo, true); return [you, mo]; }, KC(0.4, 2.2, 6.6, 1.5, 46), [[0.4, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
