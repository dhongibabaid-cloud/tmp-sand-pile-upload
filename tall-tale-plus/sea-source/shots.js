// HE SURVIVED 438 DAYS LOST AT SEA: Tall Tale+ (Jose Salvador Alvarenga, 2012-2014).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as BP from './core/ocn.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);

const FISHER = { body: '#E2B33C', hat: 'cap', hatCol: '#1F3F8A', pattern: 'plain', extra: ['mustache'] };
const DOUB1 = { body: '#6A707A', hat: 'bowler', hatCol: '#222222', pattern: 'plain', extra: ['monocle'] };
const DOUB2 = { body: '#B5372E', hat: 'visor', hatCol: '#F2E6CF', pattern: 'stripes', patCol: '#7A1F1A', extra: ['glasses'] };
const SCI = { body: '#F4F4F4', hat: 'bun', hatCol: '#5A3A22', pattern: 'plain', extra: ['glasses', 'freckles'] };
assertDistinct([MO, FISHER, DOUB1, DOUB2, SCI], 'sea cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const oc = BP.ocean(), wc = BP.whitecaps(), bt = BP.boat(), gl = BP.gull(), tt = BP.turtle(), fs = BP.fish(), bk = BP.bucket(), isl = BP.island(), rn_ = BP.rain(), st = BP.storm(), cr = BP.currents(), cal = BP.calendar();
  const OBJ = [oc, wc, bt, gl, tt, fs, bk, isl, rn_, st, cr, cal]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('y2012', '2012', '#2A2A33'); bdc('blown', 'BLOWN OUT TO SEA', '#B5372E'); bdc('pac', 'ACROSS THE PACIFIC', '#2E6A9A'); bdc('year', 'MORE THAN A YEAR', '#2A2A33'); bdc('home', 'NO WAY HOME', '#6A4A32'); bdc('fish', 'FISH + BIRDS', '#2E6A4A'); bdc('hands', 'BARE HANDS', '#B8860B'); bdc('rain', 'RAINWATER', '#1B8FA0'); bdc('turtle', 'TURTLE BLOOD', '#4A7A3A'); bdc('days', '438 DAYS', '#B5372E'); bdc('marshall', 'MARSHALL ISLANDS', '#2E6A9A'); bdc('miles', 'THOUSANDS OF MILES', '#2A2A33'); bdc('doubt', 'MANY DOUBTED HIM', '#6A4A32'); bdc('cur', 'OCEAN CURRENTS CAN DO IT', '#1B8FA0'); bdc('you', 'SURVIVE A YEAR AT SEA?', '#2A2A33');
  const boards = Object.values(BD);
  const fm = person(FISHER), mo = person(MO, { height: 1.5 }), d1 = person(DOUB1), d2 = person(DOUB2), sci = person(SCI), pcn = PW.popcorn(1.2);
  const SP = [fm, mo, d1, d2, sci]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const resetAll = () => { [...SP, pcn, ...OBJ, ...boards].forEach((o) => vis(o, false)); worldKids.forEach((g) => (g.visible = false)); };
  const seaOn = (t, bob = 1) => { vis(oc, true); vis(wc, true); wc.update(t); vis(bt, true); bt.position.set(0, 0.02 + Math.sin(t * 1.6) * 0.05 * bob, 0); bt.rotation.set(Math.sin(t * 1.3) * 0.04 * bob, 0, Math.sin(t * 1.8) * 0.05 * bob); };
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
  const sit = (p, t, o = {}) => idle(p, -0.5, 0.52 + (o.dy || 0), 0, t, 1, { legs: 'sit', ...o });

  // LINE 0
  shot('S01', 0, 1.8, 'y2012', [0, 5.0, 0], (lt, d, t) => { seaOn(t, 3); vis(st, true); vis(rn_, true); rn_.update(t); rn_.position.set(0, 0, 0); bt.rotation.z = Math.sin(t * 4) * 0.18; bt.position.y = 0.05 + Math.abs(Math.sin(t * 3)) * 0.25; sit(fm, t, { mood: 'shock', armL: [140, 0], armR: [140, 0], dy: bt.position.y }); fm.group.rotation.z = bt.rotation.z; return [fm]; }, [[0, 2.2, 8], [0, 2.0, 7], [0, 1.2, 0], 44], [[0, 'boom', 0.5]]);
  shot('S02', 1.8, 3.45, 'blown', [0, 5.2, 0], (lt, d, t) => { seaOn(t, 3); vis(st, true); vis(rn_, true); rn_.update(t); bt.position.set(lerp(-1.5, 1.5, lt / d), 0.1 + Math.abs(Math.sin(t * 3)) * 0.3, 0); bt.rotation.z = Math.sin(t * 4) * 0.2; sit(fm, t, { mood: 'worried', armL: [150, 0], armR: [150, 0], dy: bt.position.y, blink: 0 }); fm.group.position.x += bt.position.x; return [fm]; }, [[0, 2.0, 6], [0, 1.8, 5], [0, 1.2, 0], 46], [[0.5, 'whoosh', 0.35]]);
  shot('S03', 3.45, 5.3, 'pac', [0, 4.6, 0], (lt, d, t) => { seaOn(t, 1); sit(fm, t, { mood: 'sad', blink: blink(t, 0.3), dy: bt.position.y }); return [fm]; }, [[0, 6, 20], [0, 4, 13], [0, 1.2, 0], 40], []);
  shot('S04', 5.3, 6.7, 'year', [0, 4.9, 0], (lt, d, t) => { seaOn(t, 1); vis(cal, true); cal.position.set(0, 0.3, 0.5); cal.update(lt); sit(fm, t, { mood: 'sad', armL: [80, 0], blink: blink(t, 0.3), dy: bt.position.y }); return [fm]; }, [[0, 2.4, 6.4], [0, 2.4, 5.4], [0, 1.6, 0], 44], [[0.3, 'whoosh', 0.3]]);
  // LINE 1
  shot('S05', 6.7, 8.2, 'home', [0, 4.6, 0], (lt, d, t) => { seaOn(t, 1); sit(fm, t, { mood: 'worried', armL: [160 + Math.sin(t * 3) * 10, 0], blink: blink(t, 0.3), dy: bt.position.y }); return [fm]; }, [[0, 2.2, 7], [0, 2.1, 6], [0, 1.5, 0], 44], []);
  shot('S06', 8.2, 10.45, 'hands', [0, 4.7, 0], (lt, d, t) => { seaOn(t, 1); const g0 = clamp((lt - 0.4) / 0.9); vis(gl, true); gl.position.set(lerp(-3, 0.5, eio(g0)), lerp(3, 0.9, eio(g0)), 0.2); gl.rotation.y = Math.PI / 2; gl.flap(t, g0 < 1 ? 0.7 : 0.1); vis(fs, true); fs.position.set(1.5, 0.15 + Math.max(0, Math.sin(clamp((lt - 1.2) / 0.8) * Math.PI)) * 0.8, 0.5); fs.rotation.z = Math.sin(t * 10) * 0.3; sit(fm, t, { mood: lt > 1.3 ? 'happy' : 'sly', armR: [120, 0], dy: bt.position.y }); return [fm]; }, [[0, 2.2, 6.8], [0, 2.0, 5.8], [0, 1.5, 0], 44], [[0.9, 'pop', 0.4]]);
  shot('S07', 10.45, 11.6, 'rain', [0, 4.2, 0], (lt, d, t) => { seaOn(t, 1); vis(rn_, true); rn_.update(t); rn_.position.set(0, 0, 0); vis(bk, true); bk.position.set(0.2, 0.55, 0.2); sit(fm, t, { mood: 'happy', armL: [90, 0], dy: bt.position.y }); return [fm]; }, [[0, 2.0, 6.0], [0, 1.9, 5.2], [0, 1.4, 0], 42], [[0, 'bubbles', 0.35]]);
  shot('S08', 11.6, 12.6, 'turtle', [0, 4.2, 0], (lt, d, t) => { seaOn(t, 1); vis(tt, true); tt.position.set(0.3, 0.55, 0.3); tt.rotation.y = -0.8; tt.scale.setScalar(0.9); sit(fm, t, { mood: lt > 0.5 ? 'shock' : 'sly', armL: [100, 0], dy: bt.position.y }); return [fm]; }, [[0, 1.9, 5.4], [0, 1.8, 4.6], [0, 1.3, 0], 42], [[0.55, 'bruh_clip', 0.55]]);
  // LINE 2
  shot('S09', 12.6, 14.0, 'days', [0, 4.7, 0], (lt, d, t) => { seaOn(t, 1); vis(cal, true); cal.position.set(0, 0.4, 0.5); cal.update(lt * 2); sit(fm, t, { mood: 'sad', blink: blink(t, 0.3), dy: bt.position.y }); return [fm]; }, [[0, 2.4, 6.2], [0, 2.4, 5.4], [0, 1.6, 0], 44], []);
  shot('S10', 14.0, 16.85, 'marshall', [0, 6.0, -1.0], (lt, d, t, k) => { vis(oc, true); vis(wc, true); wc.update(t); vis(isl, true); isl.position.set(0, 0, -3); vis(bt, true); bt.position.set(lerp(-4, 0.5, eio(k)), 0.1 + (1 - k) * 0.05, lerp(4, 1.4, eio(k))); bt.rotation.set(0, 0.5, 0.05 * Math.sin(t * 2)); idle(fm, bt.position.x - 0.4, 0.6, bt.position.z, t, 1, { legs: 'sit', mood: k > 0.6 ? 'happy' : 'sad', armL: [k > 0.6 ? 170 : 20, 0] }); return [fm]; }, [[-1, 3.0, 12], [1, 2.6, 8.6], [0, 1.8, -1], 44], [[2.0, 'cheer', 0.45]]);
  shot('S11', 16.85, 18.7, 'miles', [0, 3.2, 1.5], (lt, d, t, k) => { vis(oc, true); vis(wc, true); wc.update(t, 1.5); vis(bt, true); bt.position.set(0, 0.02 + Math.sin(t * 1.6) * 0.04, 0); bt.scale.setScalar(1); return []; }, [[0, 8, 14], [0, 12, 11], [0, 0, 0], 44], [[0, 'whoosh', 0.35]]);
  // LINE 3
  shot('S12', 18.7, 20.4, 'doubt', [0, 4.8, 0], (lt, d, t) => { vis(oc, true); vis(isl, true); isl.position.set(0, 0, -3); idle(d1, -0.8, 0.4, 0, t, 2, { mood: 'angry', armL: [140, 0], armR: [140, 0] }); idle(d2, 0.9, 0.4, 0, t, 3, { mood: 'smug', armL: [100, 0], armR: [100, 0] }); return [d1, d2]; }, [[0, 2.0, 6.6], [0, 1.9, 5.4], [0, 1.6, 0], 44], [[0.3, 'bruh', 0.4]]);
  shot('S13', 20.4, 22.95, 'cur', [0, 6.2, -1.0], (lt, d, t) => { vis(oc, true); vis(isl, true); isl.position.set(0, 0, -5); vis(cr, true); cr.position.set(0, 0.4, -1.0); idle(sci, -1.5, 0.4, 0.6, t, 4, { mood: 'proud', armR: [100 + Math.sin(t * 2) * 8, 0] }); return [sci]; }, [[0, 2.4, 9], [0, 2.3, 7.6], [0, 2.1, -1], 44], [[0, 'whoosh', 0.3]]);
  shot('S14', 22.95, 26.6, 'you', [0, 4.9, 0], (lt, d, t) => { seaOn(t, 1); mo.at(-0.5, 0.55 + bt.position.y, 0).set({ mood: lt > 2 ? 'worried' : 'happy', armL: [10, 0], armR: [10, 0], legs: 'sit', blink: blink(t, 0.3) }); vis(mo, true); pcn.position.set(-0.83, 1.4 + bt.position.y, 0.2); vis(pcn, true); return [mo]; }, [[0, 2.2, 7.2], [0, 2.0, 6.2], [0, 1.5, 0], 44], [[2.1, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
