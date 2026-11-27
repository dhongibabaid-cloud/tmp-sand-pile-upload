// WHAT IF A GIRAFFE MOVED INTO YOUR LIVING ROOM: Tall Tale+ goofy what-if.
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
import * as GR from './core/gir.js';
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
  const LR = GR.livingroom(), CE = GR.ceiling(), CO = GR.couch(), PL = GR.plants(), CR = GR.cereal(), GI = GR.giraffe(0.9);
  const OBJ = [LR, CE, CO, PL, CR, GI]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('hook', 'GIRAFFE IN YOUR ROOM', '#8A4AB5'); bdc('what', 'WHAT?!', '#B5372E'); bdc('crash', 'CRASH!', '#B8860B'); bdc('roof', 'HELLO, ROOF', '#2E6A9A');
  bdc('tall', '18 FEET TALL', '#2A2A33'); bdc('ceil', 'CEILING: GONE', '#B5372E'); bdc('down', 'HI DOWN THERE', '#2E6A4A');
  bdc('tongue', 'TONGUE: 18 INCHES', '#7A4A9A'); bdc('purple', 'PURPLE!', '#7A4A9A'); bdc('cereal', 'CEREAL: GONE', '#B5372E');
  bdc('lb', '75 LB A DAY', '#2A2A33'); bdc('plants', 'PLANTS: GONE', '#2E6A4A'); bdc('nom', 'NOM NOM NOM', '#F28C28');
  bdc('sleep', 'SLEEPS 30 MIN', '#2E6A9A'); bdc('couch', 'COUCH: TAKEN', '#B5372E'); bdc('floor', 'YOU: ON THE FLOOR', '#2A2A33');
  bdc('moral', 'MORAL:', '#2A2A33'); bdc('never', 'NEVER INVITE ONE', '#B5372E');
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
  const KC0 = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const KC = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const room = (cr = 0) => { vis(LR, true); CE.crash(cr); vis(CE, true); put(CO, -4.2, 0, -2.6); };
  const gp = (x, y, z, ry, t, o = {}, s = 0.9) => { put(GI, x, y, z, ry); GI.scale.setScalar(s); GI.anim(t, o); };
  const plants = (k = 0) => { put(PL, 2.4, 0, -2.2); PL.eat(k); };
  // LINE 0 (0.30-4.59)
  shot('G01', 0, 1.3, 'hook', [0, 6.2, 0], (lt, d, t) => { room(0.25); gp(-1.1, 0, -0.5, 0, t, { neck: 0.05, open: 0.4 }); stand(you, 1.8, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, [[0, 2.8, 11.5], [0, 3.0, 10.5], [0, 3.2, 0], 46], [[0.1, 'whoosh', 0.35], [0.3, 'plop', 0.4]]);
  shot('G02', 1.3, 2.4, 'what', [0, 5.2, 0], (lt, d, t) => { room(0.3); gp(-1.1, 0, -0.5, 0, t, { open: 0.3 }); stand(you, 0.6, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, [[0.6, 2.0, 6.0], [0.6, 1.95, 5.2], [0.6, 1.6, 0], 46], [[0.1, 'bruh_clip', 0.5]]);
  shot('G03', 2.4, 3.5, 'crash', [0, 6.0, 0], (lt, d, t) => { room(clamp(lt / 1.0)); gp(-1.1, 0, -0.5, 0, t, { neck: 0.12, open: 0.5 }); return []; }, [[0, 3.0, 10.5], [0, 3.4, 9.5], [0, 3.4, 0], 46], [[0.1, 'boom', 0.6], [0.3, 'creak', 0.4]]);
  shot('G04', 3.5, 4.8, 'roof', [0, 6.6, 0], (lt, d, t) => { room(1); gp(-1.1, 0, -0.5, 0, t, { neck: 0.2, open: 0.2, nod: 0.1 }); return []; }, [[1.4, 4.6, 7.2], [1.4, 4.9, 6.4], [1.4, 4.8, 0], 46], [[0.1, 'whoosh', 0.3]]);
  // LINE 1 (4.84-8.39)
  shot('G05', 4.84, 6.0, 'tall', [0, 6.4, 0], (lt, d, t) => { room(1); gp(-1.1, 0, -0.5, 0, t, { neck: 0.05, open: 0.1 }); stand(you, 1.9, t, 1, { mood: 'shock', armL: [100, 0] }); return [you]; }, [[0, 2.8, 11.5], [0, 3.0, 10.5], [0, 3.2, 0], 46], [[0.1, 'stamp', 0.5]]);
  shot('G06', 6.0, 7.2, 'ceil', [0, 5.2, 0], (lt, d, t) => { room(1); gp(-1.1, 0, -0.5, 0, t, { neck: 0.1 }); stand(you, 1.0, t, 1, { mood: 'angry', armL: [150, 0] }); return [you]; }, [[0.2, 1.6, 6.8], [0.2, 2.2, 6.0], [0.2, 3.4, 0], 46], [[0.1, 'thud', 0.5]]);
  shot('G07', 7.2, 8.64, 'down', [0.4, 4.8, 0], (lt, d, t) => { room(1); gp(-2.0, 0, -0.5, 0, t, { neck: -0.7, nod: -0.3, open: 0.1 }); stand(you, 1.2, t, 1, { mood: 'worried', armL: [20, 0], armR: [20, 0] }); return [you]; }, [[0.5, 2.0, 6.6], [0.5, 1.95, 5.8], [0.5, 2.2, 0], 46], [[0.1, 'boing', 0.4]]);
  // LINE 2 (8.64-13.01)
  shot('G08', 8.64, 9.9, 'tongue', [0.4, 4.6, 0], (lt, d, t) => { room(1); gp(-2.3, 0, -0.5, 0, t, { neck: -0.8, open: 0.4, tongue: clamp(lt / 0.8) }); return []; }, [[0.5, 1.6, 6.6], [0.5, 1.7, 5.6], [0.5, 2.2, 0], 46], [[0.1, 'pop', 0.4]]);
  shot('G09', 9.9, 11.4, 'purple', [0.6, 4.6, 0], (lt, d, t) => { room(1); gp(-2.3, 0, -0.5, 0, t, { neck: -0.8, open: 0.4, tongue: 1, nod: Math.sin(lt * 9) * 0.1 }); return []; }, [[1.4, 2.0, 5.2], [1.4, 2.0, 4.2], [1.0, 2.0, 0], 44], [[0.1, 'whoosh', 0.3], [0.7, 'pop', 0.4]]);
  shot('G10', 11.4, 13.26, 'cereal', [0, 4.2, 0], (lt, d, t) => { room(1); put(CR, 1.6, 0.9, 0.3); CR.slurp(clamp((lt - 0.4) / 1.0)); gp(-2.6, 0, -0.5, 0, t, { neck: -0.95, tongue: clamp(Math.sin(lt * 3) + 0.4), chew: lt > 0.6 }); stand(you, 1.0 + 1.2, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); return [you]; }, [[0.4, 2.2, 7.4], [0.4, 2.1, 6.4], [0.4, 1.2, 0], 46], [[0.2, 'gulp', 0.5], [0.9, 'gulp', 0.5]]);
  // LINE 3 (13.26-16.74)
  shot('G11', 13.26, 14.6, 'lb', [0, 5.2, 0], (lt, d, t) => { room(1); gp(-1.1, 0, -0.5, 0, t, { neck: -0.1, chew: true }); return []; }, [[0, 2.4, 10.0], [0, 2.8, 9.0], [0, 3.2, 0], 46], [[0.1, 'crunch', 0.5]]);
  shot('G12', 14.6, 16.0, 'plants', [0, 5.0, 0], (lt, d, t) => { room(1); plants(clamp(lt / 1.2)); gp(0.2, 0, -0.5, 0, t, { neck: -0.4, chew: true }, 0.9); return []; }, [[1.6, 2.2, 8.0], [1.6, 2.4, 7.0], [1.6, 2.4, 0], 46], [[0.2, 'crunch', 0.5], [0.6, 'crunch', 0.5]]);
  shot('G13', 16.0, 17.0, 'nom', [0, 4.4, 0], (lt, d, t) => { room(1); plants(1); gp(-1.1, 0, -0.5, 0, t, { chew: true, neck: -0.1 }); stand(you, 1.9, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); return [you]; }, KC(0, 2.6, 8.8, 2.0, 46), [[0.2, 'trombone', 0.45]]);
  // LINE 4 (16.99-20.94)
  shot('G14', 16.99, 18.4, 'sleep', [0, 4.8, 0], (lt, d, t) => { room(1); gp(-3.0 + lt * 1.4, 0, -0.5, 0, t, { walk: true, neck: -0.2 }); stand(you, 2.2, t, 1, { mood: 'shock', armL: [20, 0] }); return [you]; }, [[0.5, 2.4, 11.0], [0.5, 2.6, 10.0], [0.5, 2.6, 0], 46], [[0.1, 'step', 0.4], [0.5, 'step', 0.4], [0.9, 'step', 0.4]]);
  shot('G15', 18.4, 19.8, 'couch', [0, 4.8, 0], (lt, d, t) => { room(1); gp(-4.0, 0.35, -2.2, 0, t, { lie: clamp(lt / 0.6), neck: -0.4, open: 0.02 }, 0.9); return []; }, [[-3.2, 2.4, 8.0], [-3.2, 2.6, 7.0], [-3.2, 1.6, 0], 46], [[0.2, 'plop', 0.5], [0.7, 'snoring', 0.45]]);
  shot('G16', 19.8, 21.1, 'floor', [0, 4.4, 0], (lt, d, t) => { room(1); gp(-4.0, 0.35, -2.2, 0, t, { lie: 1, neck: -0.4 }, 0.9); stand(you, 0.0, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); return [you]; }, [[-1.6, 2.2, 8.4], [-1.6, 2.4, 7.4], [-1.6, 1.4, 0], 46], [[0.2, 'trombone', 0.45]]);
  // LINE 5 (21.19-23.8)
  shot('G17', 21.19, 22.4, 'moral', [0, 4.8, 0], (lt, d, t) => { vis(LR, true); mo.at(0, 0.4, 0.8).set({ mood: 'smug', armL: [10, 0], armR: [10, 0], blink: blink(t, 0.3) }); vis(mo, true); put(pcn, -0.3, 1.0, 1.1); vis(pcn, true); return [mo]; }, [[0, 2.0, 5.6], [0, 1.9, 4.8], [0, 1.4, 0], 46]);
  shot('G18', 22.4, 23.9, 'never', [0, 6.2, 0], (lt, d, t) => { room(1); gp(-1.1, 0, -0.5, 0, t, { neck: 0.05, open: 0.4, tongue: 0.7 }); stand(you, 1.9, t, 1, { mood: 'worried', armL: [20, 0], armR: [20, 0] }); mo.at(0.6, 0.4, 1.6).set({ mood: 'laugh', blink: blink(t) }); vis(mo, true); return [you, mo]; }, [[0, 2.8, 11.5], [0, 3.0, 10.5], [0, 3.2, 0], 46], [[0.4, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
