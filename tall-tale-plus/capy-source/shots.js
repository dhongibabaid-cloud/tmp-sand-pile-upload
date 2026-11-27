// WHAT IF A GIRAFFE MOVED INTO YOUR LIVING ROOM: Tall Tale+ goofy what-if.
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
import * as GR from './core/gir.js';
import * as CP from './core/cap.js';
import * as BH from './core/bth.js';
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
  const LR = GR.livingroom(), BR = BH.bathroom(), TB = BH.tub(), CC = CP.chewcouch(), CA = CP.capybara(0.9), CB = CP.capybara(0.9), BI = CP.bird();
  const OBJ = [LR, BR, TB, CC, CA, CB, BI]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('hook', 'CAPYBARA IN YOUR HOUSE', '#8A4AB5'); bdc('what', 'WHAT?!', '#B5372E'); bdc('bird', 'BIRD ON HEAD', '#2E6A9A'); bdc('calm', 'ZERO STRESS', '#2E6A4A');
  bdc('big', 'BIGGEST RODENT', '#2A2A33'); bdc('lbs', '130+ LBS', '#B5372E'); bdc('chill', 'PURE CHILL', '#2E6A9A');
  bdc('teeth', 'TEETH NEVER STOP', '#F28C28'); bdc('couch', 'COUCH: SNACK', '#B5372E'); bdc('five', '5 MIN UNDERWATER', '#2E6A9A'); bdc('hold', 'HOLDING BREATH', '#2A2A33'); bdc('tub', 'BATHTUB: HIS', '#B5372E');
  bdc('calmer', 'CALMER THAN YOU', '#2E6A4A'); bdc('another', 'ANOTHER ONE?!', '#B5372E');
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
  const room = () => { vis(LR, true); };
  const bath = (cr = 0) => { vis(BR, true); put(TB, 0, 0, -0.8); TB.crack(cr); };
  const cp = (o, x, y, z, ry, t, a = {}, s = 0.9) => { put(o, x, y, z, ry); o.scale.setScalar(s * 0.6); o.anim(t, a); };
  const bird = (x, y, z, ry = 0) => put(BI, x, y, z, ry);
  const HOOK = (lt, d, t) => { room(); cp(CA, -0.6, 0, -0.3, 0.0, t, { open: 0.3 }, 0.9); bird(-0.2, 1.05 + Math.abs(Math.sin(t * 5)) * 0.04, -0.3); stand(you, 0.95, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; };
  // LINE 0 (0.2-4.41)
  shot('C01', 0, 1.0, 'hook', [0, 4.0, 0], HOOK, [[0, 1.8, 6.8], [0, 1.8, 6.2], [0, 1.2, 0], 46], [[0.1, 'whoosh', 0.35], [0.3, 'plop', 0.4]]);
  shot('C02', 1.0, 2.0, 'what', [0.3, 3.8, 0], (lt, d, t) => { room(); cp(CA, -1.0, 0, -0.3, 0, t, { open: 0.2 }, 0.9); stand(you, 0.4, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, [[0.4, 1.8, 5.6], [0.4, 1.75, 4.8], [0.4, 1.5, 0], 46], [[0.1, 'bruh_clip', 0.5]]);
  shot('C03', 2.0, 3.2, 'bird', [0, 3.2, 0], (lt, d, t) => { room(); cp(CA, -0.9, 0, -0.3, 0.2, t, { open: 0.1, nod: 0.05 }, 0.9); bird(-0.6, 1.05, -0.2); return []; }, [[-0.5, 1.3, 4.6], [-0.5, 1.2, 3.8], [-0.5, 0.9, 0], 44], [[0.1, 'pop', 0.4]]);
  shot('C04', 3.2, 4.5, 'calm', [0, 3.4, 0], (lt, d, t) => { room(); cp(CA, -0.9, 0, -0.3, 0.2, t, { open: 0.05, nod: 0.05, lie: 0.3 }, 0.9); bird(-0.6, 0.95, -0.2); stand(you, 1.0, t, 1, { mood: 'angry', armL: [150, 0] }); return [you]; }, KC(0.2, 1.8, 6.6, 1.2, 46), [[0.2, 'boing', 0.4]]);
  // LINE 1 (4.56-8.64)
  shot('C05', 4.56, 5.8, 'big', [0, 4.0, 0], (lt, d, t) => { room(); cp(CA, -1.0, 0, -0.3, 0.0, t, { open: 0.1 }, 1.1); stand(you, 1.8, t, 1, { mood: 'shock', armL: [100, 0] }); return [you]; }, KC(0, 1.9, 7.2, 1.2, 46), [[0.1, 'whoosh', 0.4]]);
  shot('C06', 5.8, 7.2, 'lbs', [0, 3.8, 0], (lt, d, t) => { room(); cp(CA, 0.2, 0, -0.3, -0.5, t, { open: 0.1, bounce: 1 }, 1.0); return []; }, [[0, 1.4, 6.0], [0, 1.4, 5.0], [0, 0.8, 0], 46], [[0.1, 'stamp', 0.5], [0.4, 'boom', 0.4]]);
  shot('C07', 7.2, 8.7, 'chill', [0, 3.2, 0], (lt, d, t) => { room(); cp(CA, 0, 0, 0, 0.0, t, { open: 0.02, lie: 1 }, 0.95); bird(0.0, 0.7, 0); return []; }, [[0, 1.4, 5.6], [0, 1.4, 4.8], [0, 0.6, 0], 46], [[0.2, 'plop', 0.4]]);
  // LINE 2 (8.79-11.8)
  shot('C08', 8.79, 10.1, 'teeth', [0, 3.2, 0], (lt, d, t) => { room(); cp(CA, -0.8, 0, 0, 0.2, t, { chew: true }, 1.2); return []; }, [[-0.3, 1.1, 4.9], [-0.3, 1.1, 4.1], [-0.3, 0.8, 0], 42], [[0.2, 'crunch', 0.5], [0.7, 'crunch', 0.5]]);
  shot('C09', 10.1, 11.9, 'couch', [0, 4.0, 0], (lt, d, t) => { room(); put(CC, -2.8, 0, -1.8); CC.chew(clamp(lt / 1.4)); cp(CA, -0.5, 0, -0.5, 0.0, t, { chew: true, nod: -0.1 }, 0.9); stand(you, 1.1, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); return [you]; }, [[-1.0, 2.4, 8.6], [-1.0, 2.4, 7.8], [-1.0, 1.2, 0], 46], [[0.1, 'crunch', 0.5], [0.5, 'crunch', 0.5], [0.9, 'crunch', 0.5]]);
  // LINE 3 (11.95-15.2)
  shot('C10', 11.95, 13.2, 'five', [0, 3.6, 0], (lt, d, t) => { bath(0); cp(CA, 0, 0.95, -0.8, 0, t, { open: 0.1 }, 0.9); return []; }, KC(0, 2.0, 7.0, 1.2, 46), [[0.1, 'bubbles', 0.5]]);
  shot('C11', 13.2, 14.4, 'hold', [0, 3.4, 0], (lt, d, t) => { bath(0); cp(CA, 0, 0.55 + Math.sin(lt * 3) * 0.03, -0.8, 0, t, { lie: 1 }, 0.9); return []; }, [[0, 2.0, 6.4], [0, 1.9, 5.4], [0, 1.2, 0], 46], [[0.1, 'bubbles', 0.5], [0.6, 'plop', 0.4]]);
  shot('C12', 14.4, 15.35, 'tub', [0, 3.6, 0], (lt, d, t) => { bath(0); cp(CA, 0.5, 0.95, -0.8, 0, t, { open: 0.05 }, 0.9); stand(you, -1.5, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); return [you]; }, KC(0, 2.2, 7.8, 1.3, 46), [[0.2, 'trombone', 0.45]]);
  // LINE 4 (15.35-19.6)
  shot('C13', 15.35, 16.9, 'calmer', [0, 4.0, 0], (lt, d, t) => { room(); cp(CA, -0.9, 0, -0.3, 0.2, t, { open: 0.03, lie: 0.3 }, 0.9); bird(-0.6, 0.95, -0.2); stand(you, 0.95, t, 1, { mood: 'shock', armL: [170 + Math.sin(t * 20) * 10, 0], armR: [170 - Math.sin(t * 20) * 10, 0] }); return [you]; }, KC(0.2, 1.8, 6.8, 1.2, 46), [[0.2, 'boing', 0.4]]);
  shot('C14', 16.9, 18.2, 'another', [0, 4.0, 0], (lt, d, t) => { room(); cp(CA, -1.0, 0, -0.3, 0, t, { open: 0.2 }, 0.9); cp(CB, 1.0 + (1 - clamp(lt / 0.5)) * 3, 0, 0.2, Math.PI, t, { walk: lt < 0.5, open: 0.2 }, 0.8); stand(you, 0.0, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, KC(0, 1.9, 7.4, 1.2, 46), [[0.1, 'step', 0.4], [0.3, 'step', 0.4], [0.5, 'ohhhhhh', 0.5]]);
  shot('C15', 18.2, 19.8, 'hook', [0, 4.0, 0], HOOK, [[0, 1.8, 6.8], [0, 1.8, 6.2], [0, 1.2, 0], 46], [[0.1, 'whoosh', 0.35], [0.9, 'faaah', 0.5]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
