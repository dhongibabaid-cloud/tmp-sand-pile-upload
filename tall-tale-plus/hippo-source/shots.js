// WHAT IF AN HIPPO MOVED INTO YOUR KITCHEN: Tall Tale+ goofy what-if.
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
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
  const BR = BH.bathroom(), TB = BH.tub(), FL = BH.flood(), TW = BH.towels(), DK = BH.duck(), DG = BH.dung(), SH = BH.shades(), SW = BH.stopwatch(), HP = BH.hippo(0.6);
  HP.head.add(SH); SH.position.set(0.42, 0.57, 0); SH.visible = false;
  const OBJ = [BR, TB, FL, TW, DK, DG, SW, HP]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('hook', 'HIPPO IN YOUR TUB', '#8A4AB5'); bdc('what', 'WHAT?!', '#B5372E'); bdc('yawn', 'GIANT YAWN', '#2E6A9A'); bdc('swamp', 'SWAMP!', '#2E6A4A');
  bdc('tons', '4.5 TONS', '#2A2A33'); bdc('crack', 'CRACK...', '#B8860B'); bdc('gone', 'TUB: GONE', '#B5372E'); bdc('sec', 'LASTED 1 SECOND', '#2E6A9A');
  bdc('goo', 'RED SKIN GOO', '#C8503A'); bdc('sun', 'NATURAL SUNSCREEN', '#F28C28'); bdc('white', 'WHITE TOWELS', '#2A2A33'); bdc('salmon', 'NOW SALMON', '#F08A7A');
  bdc('boss', 'WHO IS BOSS?', '#B5372E'); bdc('tail', 'TAIL SPIN', '#2E6A9A'); bdc('splat', 'SPLAT!', '#6A4A2A');
  bdc('moral', 'MORAL:', '#2A2A33'); bdc('never', 'NEVER SHARE', '#B5372E');
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
  const bath = (fl = 0, cr = 0) => { vis(BR, true); put(TB, 0, 0, -0.8); TB.crack(cr); put(FL, 0, 0, 2); FL.rotation.x = -Math.PI / 2; FL.set(fl); };
  const hp = (x, y, z, ry, t, o = {}, s = 0.6) => { put(HP, x, y, z, ry); HP.scale.setScalar(s); HP.anim(t, o); };
  const KC = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  // LINE 0 (0.30-4.19)
  shot('H01', 0, 1.3, 'hook', [0, 4.8, 0], (lt, d, t) => { bath(0.3, 0); hp(0.0, 0.3, -0.8, -0.9, t, { open: 0.5, bounce: 1 }); stand(you, -1.9, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, KC(0, 2.4, 8.4, 1.4, 46), [[0.1, 'whoosh', 0.35], [0.3, 'plop', 0.4]]);
  shot('H02', 1.3, 2.3, 'what', [0, 4.8, 0], (lt, d, t) => { bath(0.3, 0); hp(1.4, 0.3, -0.8, -0.9, t, { open: 0.3 }); stand(you, -0.7, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, [[-0.3, 2.0, 5.8], [-0.3, 1.95, 5.0], [0.2, 1.5, 0], 46], [[0.1, 'bruh_clip', 0.5]]);
  shot('H03', 2.3, 3.2, 'yawn', [0.4, 4.8, 0], (lt, d, t) => { bath(0.35, 0); hp(0.0, 0.2, -0.3, -1.2, t, { open: 0.5 + Math.sin(lt * 3.2) * 0.6 }, 1.0); return []; }, [[0.5, 1.9, 5.8], [0.5, 1.9, 5.0], [0.5, 1.7, 0], 46], [[0.1, 'whoosh', 0.3]]);
  shot('H04', 3.2, 4.4, 'swamp', [0, 4.8, 0], (lt, d, t) => { bath(0.4 + lt * 0.5, 0); hp(0.0, 0.3, -0.8, -0.9, t, { open: 0.3 }); put(DK, -1.2, 0.35 + lt * 0.4 + Math.sin(t * 4) * 0.05, 1.2); return []; }, KC(0, 2.2, 8.0, 1.2, 46), [[0.1, 'bubbles', 0.5], [0.7, 'plop', 0.4]]);
  // LINE 1 (4.44-8.87)
  shot('H05', 4.44, 5.5, 'tons', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 0.15); const h = Math.max(0, Math.sin(lt * 8)); hp(0.0, 0.3 + h * 0.2, -0.8, -0.9, t, { open: 0.2 }); return []; }, KC(0, 2.2, 8.0, 1.2, 46), [[0.3, 'boom', 0.6]]);
  shot('H06', 5.5, 6.6, 'crack', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 0.15 + lt * 0.6); hp(0.0, 0.3 - lt * 0.15, -0.8, -0.9, t, { open: 0.2 }); return []; }, KC(0, 2.0, 7.4, 1.2, 46), [[0.1, 'creak', 0.6]]);
  shot('H07', 6.6, 7.6, 'gone', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); hp(0.0, 0.1, -0.5, -0.9, t, { open: 0.15 }); stand(you, -1.8, t, 1, { mood: 'shock', armL: [100, 0] }); return [you]; }, KC(0, 2.2, 8.0, 1.2, 46), [[0.1, 'slam', 0.6]]);
  shot('H08', 7.6, 8.87, 'sec', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); hp(-0.4, 0.1, -0.5, -0.9, t, { open: 0.1 }); put(SW, 1.5, 2.0, 0.6); SW.scale.setScalar(1.3 + Math.sin(t * 8) * 0.05); stand(you, 1.1 - 0.0, t, 1, { mood: 'angry', armL: [150, 0] }); return [you]; }, KC(0.2, 2.2, 7.4, 1.4, 46), [[0.1, 'stamp', 0.5]]);
  // LINE 2 (8.87-13.77)
  shot('H09', 8.87, 10.1, 'goo', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(clamp(lt / 1.0)); hp(0.0, 0.1, 0.0, -0.9, t, { open: 0.15, bounce: 1 }, 0.8); return []; }, [[0, 2.0, 6.6], [0, 1.95, 5.8], [0, 1.2, 0], 46], [[0.1, 'pop', 0.4]]);
  shot('H10', 10.1, 11.1, 'sun', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(1); SH.visible = true; hp(0.0, 0.1, 0.0, -1.1, t, { open: 0.1 }, 0.95); return []; }, [[0.3, 1.8, 5.6], [0.3, 1.8, 4.8], [0.3, 1.4, 0], 46], [[0.1, 'whoosh', 0.3]]);
  shot('H11', 11.1, 12.3, 'white', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(1); SH.visible = true; put(TW, 0, 0, -2.4); TW.col(clamp(lt / 1.2)); hp(1.6, 0.1, 0.5, -0.5, t, { open: 0.1, bounce: 1 }, 0.5); return []; }, KC(0, 2.6, 7.4, 1.8, 46), [[0.2, 'pop', 0.4], [0.5, 'pop', 0.4], [0.8, 'pop', 0.4]]);
  shot('H12', 12.3, 13.77, 'salmon', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(1); put(TW, 0, 0, -2.4); TW.col(1); stand(you, 0.0, t, 1, { mood: 'sad', armL: [60, 0], armR: [60, 0] }); hp(2.2, 0.1, 0.5, -0.5, t, { open: 0.1 }, 0.4); return [you]; }, KC(0, 2.4, 6.6, 1.6, 46), [[0.2, 'trombone', 0.45]]);
  // LINE 3 (13.77-16.99)
  shot('H13', 13.77, 14.9, 'boss', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(1); SH.visible = true; hp(0.0, 0.1, 0.0, -1.0, t, { open: 0.9, bounce: 1 }, 0.85); return []; }, [[0, 2.0, 6.6], [0, 1.95, 5.8], [0, 1.2, 0], 46], [[0.1, 'boing', 0.5]]);
  shot('H14', 14.9, 15.9, 'tail', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(1); SH.visible = true; hp(0.0, 0.1, 0.3, Math.PI / 2, t, { spin: 1 }, 0.7); return []; }, [[0.2, 1.7, 5.8], [0.2, 1.7, 5.0], [0.2, 1.2, 1.0], 46], [[0.1, 'whoosh', 0.4]]);
  shot('H15', 15.9, 17.0, 'splat', [0, 4.8, 0], (lt, d, t) => { bath(0.9, 1); HP.goo(1); SH.visible = true; hp(0.8, 0.1, -0.6, Math.PI / 2 - 0.5, t, { spin: 1 }, 0.6); DG.visible = true; DG.fire(lt, [0.3, 1.0, -0.3]); stand(you, -1.3, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; }, KC(0, 2.2, 7.6, 1.2, 46), [[0.2, 'plop', 0.5], [0.6, 'ohhhhhh', 0.5]]);
  // LINE 4 (16.99-19.4)
  shot('H16', 16.99, 18.2, 'moral', [0, 4.8, 0], (lt, d, t) => { vis(BR, true); mo.at(0, 0.4, 0.8).set({ mood: 'smug', armL: [10, 0], armR: [10, 0], blink: blink(t, 0.3) }); vis(mo, true); put(pcn, -0.3, 1.0, 1.1); vis(pcn, true); return [mo]; }, [[0, 2.0, 5.6], [0, 1.9, 4.8], [0, 1.4, 0], 46]);
  shot('H17', 18.2, 19.8, 'never', [0, 4.8, 0], (lt, d, t) => { bath(0, 0); HP.goo(1); SH.visible = true; hp(0.0, 0.3, -0.8, -0.9, t, { open: 0.1 }); stand(you, -1.9, t, 1, { mood: 'worried', armL: [20, 0], armR: [20, 0] }); mo.at(1.9, 0.4, 0.6).set({ mood: 'laugh', blink: blink(t) }); vis(mo, true); return [you, mo]; }, KC(0, 2.4, 8.4, 1.4, 46), [[0.4, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
