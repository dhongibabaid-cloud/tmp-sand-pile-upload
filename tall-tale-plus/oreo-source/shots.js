// SCIENTISTS BUILT A MACHINE TO TWIST OREOS: Tall Tale+ (MIT lab 2022).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as CD from './core/cad.js';
import * as BS from './core/boston.js';
import * as LB from './core/lab.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const KEY = {
  a: { body: '#F2F2F2', pattern: 'plain', hat: 'bun', hatCol: '#3A2A22', extra: ['glasses', 'blush'] },
  b: { body: '#E4ECF4', pattern: 'plain', hat: 'none', extra: ['mustache', 'pencil'] },
  c: { body: '#CFE4EE', pattern: 'plain', hat: 'beanie', hatCol: '#B5372E', extra: ['freckles'] },
  mo: { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] },
};
assertDistinct(Object.values(KEY), 'oreo cast');
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, show = (a) => a.forEach((o) => vis(o, true)), hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.35) => eob(clamp((lt - t0) / dur));

  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(6, 12, 12); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; sc.children.forEach((c) => { if (c.geometry && c.geometry.type === 'CircleGeometry') c.visible = false; if (c.geometry && c.geometry.type === 'PlaneGeometry' && c.geometry.parameters.width === 200) c.position.y = -2.5; });
  sc.add(LB.room());
  const bn = LB.bench(); sc.add(bn); bn.position.set(0, 0, 0.2);
  const om = LB.oreometer(); sc.add(om); const oo = LB.oreo(1.0); sc.add(oo);
  const oreos = [LB.oreo(1.0), LB.oreo(1.0), LB.oreo(1.0)]; oreos.forEach((o) => sc.add(o)); oreos[1].cb.scale.y = 1.9; oreos[1].cb.position.y = 0.26; oreos[2].cb.scale.y = 2.8; oreos[2].cb.position.y = 0.33;
  const hero = LB.oreo(1.0); sc.add(hero); const dr = LB.door(); sc.add(dr); dr.position.set(-4.2, 0, -2.5); const cv = LB.conveyor(); sc.add(cv); cv.position.set(0, 0, 0.2);
  const fA = LB.oreo(1.0), fB = LB.oreo(1.0); sc.add(fA); sc.add(fB); fA.top.visible = false; fB.bot.visible = false;
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bW = mk('WHY ONE SIDE?', ['#1E3A5A', '#F2E6CF']), bMachine = mk('THEY BUILT A MACHINE', ['#B5372E', '#FFFFFF']), bOre = mk('THE OREOMETER · MIT', ['#2E3E6A', '#F2E6CF']), bPen = mk('PENNIES + RUBBER BANDS', ['#B87333', '#FFFFFF']), bReg = mk('REGULAR', ['#2E4E8A', '#FFFFFF']), bDbl = mk('DOUBLE', ['#2E6A4A', '#FFFFFF']), bMega = mk('MEGA', ['#B5372E', '#FFFFFF']), bOne = mk('ONE SIDE. EVERY TIME.', ['#2A2A33', '#F2E6CF']), bDk = mk('= A DOORKNOB', ['#6A4A32', '#F2E6CF']), bFac = mk('FACTORY: CREAM FIRST', ['#7A3A8A', '#FFFFFF']), bNo = mk('NO TWIST FIXED IT', ['#B5372E', '#FFFFFF']);
  const boards = [bW, bMachine, bOre, bPen, bReg, bDbl, bMega, bOne, bDk, bFac, bNo]; boards.forEach((b) => sc.add(b));
  const sa = person(KEY.a), sb = person(KEY.b), scc = person(KEY.c), mo = person(KEY.mo, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const SP = [sa, sb, scc, mo]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, om, oo, ...oreos, hero, dr, cv, fA, fB, bn, ...boards].forEach((o) => vis(o, false)); };
  const idle = (p, x, z, t, i, o = {}) => { vis(p, true); p.at(x, 0, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const shoot = (people, from, to, at, at2, k, fov, pull = 1) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const tgt = at2 ? mix(at, at2, k) : at; cam.position.copy(tgt.clone().add(mix(from, to, k).sub(tgt).multiplyScalar(pull))); cam.lookAt(tgt);
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(tgt) });
  };
  const board = (b, on, x, y, z, s, lt, t0) => { vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const sbs = (id, at, note, draw) => add({ id, at, note, draw });
  const BT = 1.07;
  const onBench = () => { vis(bn, true); };

  // 01 · Mo twists an Oreo, cream on one side
  { const st = cut(0), sk = Wd('stick', 0) - st;
    sbs('S01', st, 'Mo holds a giant Oreo twisted open; all the cream on one wafer; WHY ONE SIDE? board', (lt, d, t, blit) => {
      resetAll(); onBench(); putMo(0, 2.4); mo.set({ mood: lt > sk ? 'confused' : 'smug', armR: [95, 0], blink: blink(t, 0.3) }); vis(hero, true); hero.position.set(0.55, 1.05, 2.7); hero.rotation.set(0.5, 0, 0.3); hero.split(clamp(lt / 0.5), 'bot', 0.45);
      board(bW, lt > sk - 0.3, 0, 3.2, 2.4, 0.9, lt, sk - 0.3); vis(om, true); om.position.set(-2.2, BT, 0.2);
      shoot([mo], V3(0, 2.2, 8.5), V3(0, 1.7, 6.4), V3(0.2, 1.3, 2.4), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + 0.6, 'tock', { gain: 0.5 }); cue(st + sk, 'error', { gain: 0.7 }); }
  // 02 · they built a machine
  { const st = Wd('Scientists', 0) - 0.08;
    sbs('S02', st, 'two scientists bolt up a machine on the bench, sparks of excitement; THEY BUILT A MACHINE', (lt, d, t, blit) => {
      resetAll(); onBench(); vis(om, true); om.position.set(0, BT, 0.2); idle(sa, -1.7, 0.8, t, 1, { mood: 'happy', armR: [100 + Math.sin(t * 9) * 25, 0] }); idle(sb, 1.7, 0.8, t, 2, { mood: 'laugh', flip: 1, armL: [100 - Math.sin(t * 9) * 25, 0] }); board(bMachine, lt > 0.4, 0, 3.7, 0.3, 0.95, lt, 0.4);
      shoot([sa, sb], V3(0, 2.6, 13.5), V3(0, 2.2, 11), V3(0, 1.6, 0.4), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'tock', { gain: 0.5 }); cue(st + 0.6, 'tock', { gain: 0.5 }); cue(st + 1.0, 'switch', { gain: 0.3, dur: 1.6 }); cue(st + 1.3, 'hehehehehehehe', { gain: 0.5 }); }
  // 03 · the Oreometer
  { const st = cut(1), ob = Wd('Oreometer,', 1) - st;
    sbs('S03', st, 'hero shot of the Oreometer with an Oreo clamped in; THE OREOMETER · MIT board', (lt, d, t, blit) => {
      resetAll(); onBench(); vis(om, true); om.position.set(0, BT, 0.2); om.twist(0); vis(oo, true); oo.position.set(0, BT + 0.9, 0.2); oo.split(0); idle(sa, -1.7, 0.9, t, 1, { mood: 'proud', armR: [70, 0] });
      board(bOre, lt > ob - 0.2, 0, 3.5, 0.3, 0.75, lt, ob - 0.2);
      shoot([sa], V3(0.8, 2.2, 11.5), V3(0.2, 1.9, 9.0), V3(-0.3, 1.7, 0.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ob - 0.2, 'pop', { gain: 0.7 }); cue(st + ob, 'core', { gain: 0.6 }); }
  // 04 · pennies twist
  { const st = Wd('twists', 1) - 0.1, pn = Wd('pennies', 1) - st;
    sbs('S04', st, 'close on machine: penny stack lowers, wheel turns, Oreo twists open; PENNIES + RUBBER BANDS', (lt, d, t, blit) => {
      resetAll(); onBench(); vis(om, true); om.position.set(0, BT, 0.2); const k = clamp((lt - 0.2) / (d - 0.5)); om.twist(eio(k)); vis(oo, true); oo.position.set(0, BT + 0.9, 0.2); oo.split(Math.max(0, (k - 0.5) * 2), 'bot', 0.5);
      board(bPen, lt > pn - 0.3, 0, 3.4, 0.3, 0.6, lt, pn - 0.3); idle(sa, -1.7, 0.9, t, 1, { mood: 'happy', armR: [110, 0] });
      shoot([sa], V3(1.2, 2.4, 8.8), V3(0.2, 2.1, 7.0), V3(-0.4, 1.8, 0.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + pn - 0.3, 'pop', { gain: 0.6 }); cue(st + 0.5, 'creak', { gain: 0.5 }); cue(st + pn + 0.5, 'klonk', { gain: 0.8 }); cue(st + 3.2, 'plop', { gain: 0.6 }); }
  // 05 · regular, double, mega
  { const st = cut(2), rg = Wd('regular,', 2) - st, db = Wd('double,', 2) - st, mg = Wd('mega', 2) - st;
    sbs('S05', st, 'three Oreos side by side: regular, double, mega stuf with labels', (lt, d, t, blit) => {
      resetAll(); onBench(); oreos.forEach((o, i) => { vis(o, true); o.position.set(-1.4 + i * 1.4, BT + 0.05, 0.4); o.split(0); o.rotation.y = t * 0.4; });
      board(bReg, lt > rg, -1.4, 2.5, 0.4, 0.55, lt, rg); board(bDbl, lt > db, 0, 2.5, 0.4, 0.55, lt, db); board(bMega, lt > mg, 1.4, 2.5, 0.4, 0.55, lt, mg); idle(scc, 2.9, 0.9, t, 3, { mood: 'happy', flip: 1, armL: [120, 0] });
      shoot([scc], V3(0, 2.2, 7.5), V3(0, 1.9, 5.8), V3(0, 1.4, 0.4), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + rg, 'pop', { gain: 0.6 }); cue(st + db, 'pop', { gain: 0.6 }); cue(st + mg, 'pop', { gain: 0.7 }); }
  // 06 · result: one side
  { const st = cut(3), rs = Wd('stuck', 3) - st;
    sbs('S06', st, 'scientist shocked holds twisted Oreo: all cream on one wafer; ONE SIDE. EVERY TIME.', (lt, d, t, blit) => {
      resetAll(); idle(sb, 0, 1.0, t, 2, { mood: lt > rs - 0.4 ? 'shock' : 'worried', armR: [120, 0], armL: [20, 0], sweat: 1 }); vis(hero, true); hero.position.set(0.55, 1.45, 1.3); hero.rotation.set(0.3, 0, 0.35); hero.split(1, 'bot', 0.5);
      board(bOne, lt > rs - 0.3, 0, 3.3, 1.0, 0.95, lt, rs - 0.3);
      shoot([sb], V3(0, 1.9, 7.5), V3(0, 1.8, 5.6), V3(0.2, 1.5, 1.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + rs - 0.3, 'shocked', { gain: 0.9 }); cue(st + rs + 0.5, 'bone_crack', { gain: 0.5 }); cue(st + rs + 1.3, 'bruh_clip', { gain: 0.6 }); }
  // 07 · doorknob
  { const st = cut(4), dk = Wd('doorknob.', 4) - st;
    sbs('S07', st, 'scientist turns a doorknob with an Oreo on a table; = A DOORKNOB', (lt, d, t, blit) => {
      resetAll(); vis(dr, true); dr.position.set(-0.7, 0, -1.2); dr.knob.rotation.z = Math.sin(t * 5) * 0.4; idle(sa, 0.7, 0.6, t, 1, { mood: 'happy', armL: [115 + Math.sin(t * 5) * 10, 0], flip: 1 }); vis(hero, true); hero.position.set(-1.3, 1.6, 0.8); hero.split(clamp((lt - 0.3) / 0.8), 'bot', 0.4); hero.rotation.set(0.4, 0.4, 0.2);
      board(bDk, lt > dk - 0.4, 0.2, 4.2, 0.6, 0.95, lt, dk - 0.4);
      shoot([sa], V3(0.2, 2.0, 8.5), V3(0.1, 1.9, 6.4), V3(0, 1.6, 0.6), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + 0.6 + k * 0.5, 'tock', { gain: 0.4 }); cue(st + dk - 0.3, 'pop', { gain: 0.6 }); cue(st + dk, 'klonk', { gain: 0.7 }); }
  // 08 · factory
  { const st = cut(5), fc = Wd('factory,', 5) - st;
    sbs('S08', st, 'conveyor: wafer gets cream first, second wafer arrives later; FACTORY: CREAM FIRST', (lt, d, t, blit) => {
      resetAll(); vis(cv, true); const k = clamp(lt / (d - 0.2)); const ax = -4.2 + k * 8.6; vis(fA, true); vis(fB, true); fA.position.set(ax, 1.16, 0.2); fA.cb.visible = ax > -1.6; fB.position.set(ax - 2.4, 1.16, 0.2);
      board(bFac, lt > fc - 0.4, 0, 3.8, 0.4, 0.75, lt, fc - 0.4); idle(scc, -3.4, 1.4, t, 3, { mood: 'sly', armR: [70, 0] });
      shoot([scc], V3(0, 2.8, 9), V3(0, 2.2, 6.8), V3(0, 1.4, 0.2), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'switch', { gain: 0.3, dur: 3 }); cue(st + 1.6, 'plop', { gain: 0.7 }); cue(st + 3.6, 'metal_gear', { gain: 0.5 }); }
  // 09 · loop: wide lab, Mo
  { const st = cut(6), sk = Wd('side?', 6) - st;
    sbs('S09', st, 'wide lab: Mo with popcorn and scientists around the machine', (lt, d, t, blit) => {
      resetAll(); onBench(); vis(om, true); om.position.set(0, BT, 0.2); om.twist(0); idle(sa, -2.5, 0.7, t, 1, { mood: 'confused', armR: [100, 0] }); idle(sb, 2.6, 0.7, t, 2, { mood: 'worried', flip: 1, armL: [100, 0] }); putMo(-0.4, 3.3); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      shoot([mo], V3(-1, 5.2, 13), V3(0, 2.4, 9.6), V3(0, 1.6, 0.8), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 1.2, 'crunch', { gain: 0.5 }); }
  // 10 · gag: Mo twists an Oreo, still one side
  { const st = Wd('machine,', 6) - 0.2, nt = Wd('fix', 6) - st;
    sbs('S10', st, 'Mo twists his own Oreo: cream on one side again; NO TWIST FIXED IT', (lt, d, t, blit) => {
      resetAll(); putMo(0.2, 2.6); const k = clamp(lt / 0.9); mo.set({ mood: lt > 0.9 ? 'shock' : 'worried', armR: [100, 0], blink: blink(t, 0.3), sweat: lt > 0.9 ? 1 : 0 }); vis(hero, true); hero.position.set(0.75, 1.05, 2.9); hero.rotation.set(0.5, 0, 0.3); hero.split(k, 'bot', 0.45);
      board(bNo, lt > nt - 0.2, 0.3, 3.0, 2.7, 0.8, lt, nt - 0.2);
      shoot([mo], V3(0.4, 1.4, 7.6), V3(0.4, 1.4, 5.6), V3(0.3, 1.3, 2.7), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.9, 'faaah', { gain: 0.8 }); cue(st + nt + 0.5, 'badumtss', { gain: 0.7 }); cue(st + nt + 0.7, 'omg_bruh', { gain: 0.5, dur: 1.6 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
