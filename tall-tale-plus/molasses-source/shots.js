// THE DAY A WAVE OF MOLASSES HIT BOSTON: Tall Tale+ (1919 North End street, tank, wave, aftermath).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as CD from './core/cad.js';
import * as BS from './core/boston.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const KEY = {
  joe: { body: '#5A6A8A', pattern: 'overalls', patCol: '#3A4A6A', hat: 'cap', hatCol: '#4A3A2A', extra: ['mustache'] },
  exec: { body: '#2A2A33', pattern: 'vest', patCol: '#C9A13B', hat: 'tophat', hatCol: '#1A1A22', extra: ['mustache', 'monocle'] },
  judge: { body: '#3A3A44', hat: 'none', extra: ['glasses'] },
  fire1: { body: '#C0262D', hat: 'visor', hatCol: '#E2B33C', extra: ['mustache'] },
  fire2: { body: '#B5522E', hat: 'visor', hatCol: '#E2B33C', extra: ['freckles'] },
  kid: { body: '#7BB661', hat: 'beanie', hatCol: '#B5372E', extra: ['freckles', 'blush'] },
  clerk: { body: '#E8DFC8', pattern: 'apron', patCol: '#9A9A9A', hat: 'boater', hatCol: '#E8C77A', extra: ['glasses'] },
  mo: { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] },
};
const HATS = ['bowler', 'cap', 'beanie', 'visor', 'boater', 'bun', 'none', 'flower', 'mailcap', 'bow'], EXTRAS = [[], ['mustache'], ['glasses'], ['freckles'], ['blush'], ['pencil'], ['mustache', 'glasses'], ['freckles', 'blush']], PATS = ['plain', 'vest', 'apron', 'overalls'];
const CROWD = Array.from({ length: 10 }, (_, i) => ({ body: `hsl(${(i * 53 + 20) % 360},${40 + (i % 3) * 8}%,${38 + (i % 4) * 5}%)`, hat: HATS[i % HATS.length], hatCol: `hsl(${(i * 83 + 200) % 360},40%,${26 + (i % 3) * 9}%)`, pattern: PATS[i % 4], patCol: '#E8DFC8', extra: EXTRAS[(i * 3) % EXTRAS.length] }));
assertDistinct([...Object.values(KEY), ...CROWD], 'molasses cast');
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, show = (a) => a.forEach((o) => vis(o, true)), hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.35) => eob(clamp((lt - t0) / dur));

  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(8, 14, 12); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; sc.children.forEach((c) => { if (c.geometry && c.geometry.type === 'CircleGeometry') c.visible = false; if (c.geometry && c.geometry.type === 'PlaneGeometry' && c.geometry.parameters.width === 200) c.position.y = -2.5; }); sc.add(BS.street());
  const bld = BS.row(-34, 14, -7.5, 3); sc.add(bld); const bld2 = BS.row(-34, 14, -14, 9); sc.add(bld2);
  const tank = BS.tank(); tank.position.set(10.5, 0, -3.5); sc.add(tank);
  const wav = BS.wave(); sc.add(wav); wav.visible = false;
  const pools = [BS.pool(5.5), BS.pool(3.2), BS.pool(2.4)]; pools.forEach((p) => sc.add(p));
  const eng = BS.engine(); eng.position.set(-4.5, 0, 1.2); sc.add(eng); const hs = BS.hose(); sc.add(hs);
  const birds = PW.birds(5); sc.add(birds); const fl = CD.flies(5); sc.add(fl);
  // street dressing: barrels, crates, lamps, a horse cart-ish crate pile
  for (let i = 0; i < 12; i++) { const o = i % 2 ? WD.barrel() : WD.crate(0.55 + rn(i) * 0.3); o.position.set(-28 + i * 4.6 + rn(i + 2), 0.18, -4.6 + rn(i + 5) * 0.4); sc.add(o); }
  for (let x = -26; x < 14; x += 11) { const l = WD.lamp(); l.position.set(x, 0.18, -4.3); sc.add(l); }
  const stk = [BS.pool(1), BS.pool(1)]; // unused spare
  const bJan = WD.signBoard('JAN 15 · 1919', { w: 2.6, h: 0.55, bg: '#2E3E6A', fg: '#F2E6CF' }), bBos = WD.signBoard('BOSTON · 1919', { w: 2.6, h: 0.55, bg: '#2E3E6A', fg: '#F2E6CF' }), bDid = WD.signBoard('IT DID.', { w: 1.5, h: 0.5, bg: '#6A2E1E', fg: '#F2D37A' }), b35 = WD.signBoard('35 MPH', { w: 1.9, h: 0.6, bg: '#B5372E', fg: '#FFFFFF' }), b21 = WD.signBoard('21 DIED', { w: 1.8, h: 0.55, bg: '#2A2A33', fg: '#F2E6CF' }), b150 = WD.signBoard('150 HURT', { w: 2.0, h: 0.55, bg: '#B5372E', fg: '#FFFFFF' }), bAn = WD.signBoard('ANARCHISTS!', { w: 2.4, h: 0.55, bg: '#6A2E2E', fg: '#F2E6CF' }), bUn = WD.signBoard('TANK: UNSOUND', { w: 2.8, h: 0.55, bg: '#2E4E3F', fg: '#F2D37A' }), bSw = WD.signBoard('SMELLED SWEET FOR YEARS', { w: 3.2, h: 0.5, bg: '#7A3A8A', fg: '#FFFFFF' }), bSal = WD.signBoard('SALT WATER', { w: 2.0, h: 0.5, bg: '#2E5A8A', fg: '#FFFFFF' });
  const boards = [bJan, bBos, bDid, b35, b21, b150, bAn, bUn, bSw, bSal]; boards.forEach((b) => sc.add(b));
  const gav = CD.gavel(1.4); sc.add(gav); const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 0.8), WD.mat({ color: '#6B3E26' })); desk.position.y = 0.5; sc.add(desk);

  const joe = person(KEY.joe), exec = person(KEY.exec), judge = person(KEY.judge), fire1 = person(KEY.fire1), fire2 = person(KEY.fire2), kid = person(KEY.kid), clerk = person(KEY.clerk), mo = person(KEY.mo, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const crowd = CROWD.map((l) => person(l)); const SP = [joe, exec, judge, fire1, fire2, kid, clerk, mo]; [...SP, ...crowd].forEach((p) => sc.add(p.group)); sc.add(pcn);
  const W0 = crowd.slice(0, 6).map((p, i) => ({ p, x0: -24 + i * 8 + rn(i) * 4, z: [0.9, 1.6, 0.3, 1.2, -0.2, 1.9][i], v: (i % 2 ? -1 : 1) * (0.5 + rn(i + 3) * 0.4) }));
  const placeCrowd = (t, cx, on0 = true) => { W0.forEach((w, i) => { const x = ((w.x0 + w.v * t + 26) % 52 + 52) % 52 - 26; const on = on0 && Math.abs(x - cx) < 5.5; w.p.group.visible = on; if (on) w.p.at(x, Math.abs(Math.sin(t * 7 + i)) * 0.04, w.z).set({ mood: i % 3 ? 'neutral' : 'happy', legs: 'walk', phase: t * 7.3 + i * 1.7, flip: w.v < 0 ? 1 : 0, armL: [10 + Math.sin(t * 7 + i) * 12, 0], armR: [10 - Math.sin(t * 7 + i) * 12, 0], blink: blink(t, i) }); }); crowd.slice(6).forEach((p) => { p.group.visible = false; }); };
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); hide(crowd); [pcn, ...boards, gav, desk, wav, hs, fl, ...pools].forEach((o) => vis(o, false)); tank.crack.visible = false; tank.split(0); eng.visible = false; hs.visible = false; };
  const shoot = (people, from, to, at, at2, k, fov, pull = 1) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const tgt = at2 ? mix(at, at2, k) : at; cam.position.copy(tgt.clone().add(mix(from, to, k).sub(tgt).multiplyScalar(pull))); cam.lookAt(tgt);
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(tgt) });
  };
  const board = (b, on, x, y, z, s, lt, t0) => { vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const env = (t) => { birds.update(t, -12, 12, -10); };
  const sbs = (id, at, note, draw) => add({ id, at, note, draw });
  const T0 = () => Wd('burst.', 1) - 0.25;           // flood starts
  const WX = (ft) => 15.5 - 11 * ft;                   // wave front x after ft seconds
  const spawn = (arr) => arr.forEach(([p, x, z, mood], i) => { vis(p, true); p.at(x, 0, z).set({ mood }); });

  // 01 · wide: tank looms over the street, Mo with popcorn
  { const st = cut(0), it = Wd('it', 0) - st;
    sbs('S01', st, 'wide 1919 street, huge tank behind, Mo with popcorn, BOSTON · 1919', (lt, d, t, blit) => {
      resetAll(); placeCrowd(t, 2); env(t); show([clerk, joe]); clerk.at(-5, 0, 0.3).set({ mood: 'happy', armR: [100 + Math.sin(t * 5) * 15, 0], blink: blink(t) }); joe.at(4, 0, 1.2).set({ mood: 'neutral', armR: [15, 0], blink: blink(t, 1) }); putMo(0.2, 3.4); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      board(bBos, lt > 0.05, 0, 3.7 - eo(clamp(lt / d)) * 0.8, 1.4, 0.9, lt, 0.05);
      shoot([clerk, joe, mo], V3(2, 8.5, 16), V3(3.5, 2.4, 11.5), V3(6, 3.6, -1), V3(4, 1.8, 0), eio(clamp(lt / d)), 48); blit(); });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.5, 'creak', { gain: 0.35 }); cue(st + 1.1, 'klonk', { gain: 0.8 }); }
  // 02 · "it did" push-in
  { const st = Wd('it', 0) - 0.08;
    sbs('S02', st, 'push-in on Mo smirking, IT DID. board', (lt, d, t, blit) => {
      resetAll(); placeCrowd(t, 4); env(t); putMo(3.6, 2.2); mo.set({ mood: 'smug', blink: blink(t) }); board(bDid, lt > 0.15, 4.2, 2.6, 2.3, 0.8, lt, 0.15);
      shoot([mo], V3(3.8, 1.3, 7), V3(3.7, 1.25, 4.6), V3(3.6, 1.2, 2.2), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st + 0.12, 'shocked', { gain: 0.9 }); cue(st, 'whoosh', { gain: 0.3 }); }
  // 03 · the day: ordinary life, JAN 15 · 1919
  { const st = cut(1);
    sbs('S03', st, 'ordinary day: clerk sweeps, kid with a snowball, JAN 15 board', (lt, d, t, blit) => {
      resetAll(); placeCrowd(t, -2); env(t); show([clerk, kid, joe]); clerk.at(-4, 0, 0.6).set({ mood: 'happy', armR: [60 + Math.sin(t * 6) * 25, 0], blink: blink(t) }); kid.at(-1.0, 0, 1.4).set({ mood: 'laugh', armR: [150, 0], blink: blink(t, 1), bob: Math.abs(Math.sin(t * 6)) * 0.05 }); joe.at(2.6, 0, 0.6).set({ mood: 'happy', armR: [10, 0], blink: blink(t, 2) });
      board(bJan, lt > 0.1, -1.5, 3.2, 0.8, 0.9, lt, 0.1);
      shoot([clerk, kid, joe], V3(-3, 2.2, 10), V3(0, 2.0, 8), V3(-1, 1.5, 0), V3(1, 1.5, 0), eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'hehehehehehehe', { gain: 0.5 }); }
  // 04 · the tank groans, rivets pop
  { const st = Wd('tank', 1) - 0.06, bu = Wd('burst.', 1) - st;
    sbs('S04', st, 'tank close: crack grows, rivets shake, flies; Joe stares', (lt, d, t, blit) => {
      resetAll(); env(t); show([joe]); joe.at(6.2, 0, 0.8).set({ mood: lt > 0.7 ? 'shock' : 'worried', sweat: 1, armR: [lt > 0.7 ? 150 : 10, 0], blink: blink(t) });
      tank.crack.visible = lt > 0.5; tank.body.position.x = Math.sin(t * 17) * 0.03 * clamp(lt / d); vis(fl, true); fl.position.set(8.5, 5.5, -1);
      shoot([joe], V3(7, 3.5, 11), V3(8.6, 4.6, 8.2), V3(9.5, 4.5, -2), V3(10, 5.0, -2), eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'creak', { gain: 0.6 }); for (let k = 0; k < 4; k++) cue(st + 0.5 + k * 0.32, 'tock', { gain: 0.55 }); cue(st + 1.4, 'heartbeat', { gain: 0.6 }); }
  // 05 · BURST
  { const st = Wd('burst.', 1) - 0.3;
    sbs('S05', st, 'tank bursts: body collapses, wave launches; camera shakes', (lt, d, t, blit) => {
      resetAll(); env(t); const k = clamp(lt / 0.5); tank.split(eo(k)); show([joe]); joe.at(5.5 - lt * 2.5, 0, 1.0).set({ mood: 'shock', sweat: 1, legs: 'walk', phase: t * 12, flip: 1, armL: [150, 0], armR: [150, 0], blink: 0 });
      wav.put(8 - lt * 9, clamp(lt / 0.6) * 0.9 + 0.1, t); const sh = lt < 1.0 ? Math.sin(t * 21) * 0.08 : 0;
      shoot([joe], V3(4 + sh, 2.8, 11), V3(3 + sh, 2.4, 9.6), V3(7, 2.0, -0.5), V3(5, 1.8, 0), eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'boom', { gain: 1.0 }); cue(st + 0.05, 'aaaaaa', { gain: 0.7, dur: 1.8 }); cue(st + 0.1, 'slam', { gain: 0.7 }); cue(st + 0.5, 'whoosh', { gain: 0.6 }); }
  // 06 · tracking: wave chases the runners
  { const st = cut(2), sy = Wd('raced', 2) - st;
    sbs('S06', st, 'side tracking shot: wave chases Joe and kid down the street', (lt, d, t, blit) => {
      resetAll(); env(t); const ft = lt; const wx = 8 - lt * 7.5, rx = wx - 0.5; show([joe, kid, clerk]); const ph = t * 12;
      const run = (p, x, z, fl2) => p.at(x, Math.abs(Math.sin(ph + z)) * 0.08, z).set({ mood: 'shock', sweat: 1, legs: 'walk', phase: ph + z * 2, flip: 1, armL: [120 + Math.sin(ph) * 30, 0], armR: [120 - Math.sin(ph) * 30, 0], blink: 0 });
      run(joe, rx, 1.0); run(kid, rx - 1.8, 1.5); run(clerk, rx - 3.5, 0.7);
      wav.put(wx + 3.6, 1.0, t); const cx = wx - 1.5;
      shoot([joe, kid, clerk], V3(cx + 1, 2.2, 13), V3(cx + 1, 2.2, 13), V3(cx, 1.6, 0.8), null, 0, 46); blit(); });
    cue(st, 'whoosh', { gain: 0.4 }); for (let k = 0; k < 7; k++) cue(st + 0.15 + k * 0.4, 'step', { gain: 0.5, pan: k % 2 ? 0.2 : -0.2 }); cue(st + 0.6, 'anime_ahh', { gain: 0.8 }); cue(st + 1.8, 'bubbles', { gain: 0.5, dur: 1.4 }); }
  // 07 · front low: wave comes straight at the camera, 35 MPH
  { const st = Wd('thirty-five', 2) - 0.06;
    sbs('S07', st, 'low front shot: wave towers toward the camera, 35 MPH board, runners dive aside', (lt, d, t, blit) => {
      resetAll(); env(t); wav.rotation.y = Math.PI / 2; wav.position.z = 0; const k = clamp(lt / d); wav.visible = true; wav.position.set(0, -0.3, -10 + k * 7.5); wav.scale.set(1.0, 1.0, 1.0);
      show([joe, kid]); joe.at(-0.6, 0, -1.6 + k * 2.2).set({ mood: 'shock', sweat: 1, legs: 'walk', phase: t * 12, armL: [140, 0], armR: [150, 0], blink: 0 }); kid.at(0.7, 0, -1.2 + k * 2.2).set({ mood: 'shock', sweat: 1, legs: 'walk', phase: t * 12 + 2, armL: [150, 0], armR: [140, 0], blink: 0 });
      board(b35, lt > 0.2, 3.0, 3.4, -1, 0.9, lt, 0.2);
      shoot([joe, kid], V3(0, 1.0, 6.5), V3(0, 1.3, 5.0), V3(0, 1.4, -2), null, eio(clamp(lt / d)), 50); blit(); wav.rotation.y = 0; });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.2, 'stinger', { gain: 0.6 }); cue(st + 0.9, 'faaah', { gain: 0.7 }); cue(st + 1.6, 'slam', { gain: 0.7 }); }
  // 08 · aftermath: 21
  { const st = cut(3);
    sbs('S08', st, 'aftermath: the street is a brown lake, people stuck waist-deep, 21 DIED board', (lt, d, t, blit) => {
      resetAll(); env(t); pools[0].position.set(-2, 0, 0.5); pools[0].set(clamp(lt / 0.4)); show([joe, kid, clerk, mo]); vis(mo, true);
      joe.at(-4.5, -0.35, 1.0).set({ mood: 'sad', armL: [150, 0], armR: [150, 0], blink: blink(t) }); kid.at(-1.2, -0.3, 1.8).set({ mood: 'sad', tears: 1, armL: [150, 0], armR: [140, 0], blink: blink(t, 1) }); clerk.at(1.6, -0.35, 0.9).set({ mood: 'shock', armL: [140, 0], armR: [150, 0], blink: blink(t, 2) });
      putMo(3.4, 3.8); mo.set({ mood: 'shock', blink: 0 }); board(b21, lt > 0.5, -1.2, 3.1, 0.6, 0.95, lt, 0.5);
      shoot([joe, kid, clerk, mo], V3(0, 2.6, 11), V3(-0.6, 2.0, 8.6), V3(-1, 1.0, 0.8), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'plop', { gain: 0.6 }); cue(st + 0.9, 'error', { gain: 0.7 }); cue(st + 1.4, 'wasted', { gain: 0.5, dur: 1.5 }); }
  // 09 · 150 hurt
  { const st = Wd('hundred', 3) - 0.1;
    sbs('S09', st, 'bandaged crowd with crutches; 150 HURT board', (lt, d, t, blit) => {
      resetAll(); env(t); pools[1].position.set(-1, 0, 0.8); pools[1].set(1); show([joe, kid, clerk]); fl.visible = false;
      joe.at(-3.2, -0.2, 0.9).set({ mood: 'sad', armR: [150, 0], blink: blink(t) }); kid.at(0.6, -0.15, 1.7).set({ mood: 'worried', sweat: 1, armL: [120, 0], blink: blink(t, 1) }); clerk.at(2.9, 0, 0.9).set({ mood: 'tired', armR: [100, 0], blink: blink(t, 2) });
      crowd.slice(6, 9).forEach((p, i) => { vis(p, true); p.at(-6 + i * 4.2, -0.25, 2.6 + i * 0.2).set({ mood: 'sad', armR: [140 - i * 20, 0], blink: blink(t, i) }); });
      board(b150, lt > 0.1, -0.6, 3.0, 0.9, 0.95, lt, 0.1);
      shoot([joe, kid, clerk, ...crowd.slice(6, 9)], V3(-2, 2.0, 10), V3(0, 1.8, 7.8), V3(-1.5, 1.3, 1), V3(0.5, 1.3, 1), eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.4, 'bone_crack', { gain: 0.8 }); cue(st + 1.0, 'ah_shit', { gain: 0.6 }); }
  // 10 · the company blames anarchists
  { const st = cut(4), an = Wd('anarchists.', 4) - st;
    sbs('S10', st, 'company boss in tophat points at the sky: ANARCHISTS!', (lt, d, t, blit) => {
      resetAll(); env(t); show([exec]); exec.at(0, 0, 0.8).set({ mood: lt > an - 0.5 ? 'angry' : 'smug', armR: [150 + Math.sin(t * 9) * 10, 0], armL: [50, 0], blink: blink(t), talk: Math.sin(t * 13) > 0 });
      board(bAn, lt > an - 0.5, 1.5, 3.0, 0.8, 0.9, lt, an - 0.5); putMo(-2.8, 3.3); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      shoot([exec, mo], V3(0.5, 1.7, 7.2), V3(0.1, 1.7, 5.2), V3(0, 1.4, 0.8), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + an - 0.5, 'pop', { gain: 0.7 }); cue(st + an, 'metal_gear', { gain: 0.8 }); }
  // 11 · the court rules
  { const st = Wd('But', 4) - 0.06, un = Wd('unsound.', 4) - st;
    sbs('S11', st, 'judge bangs a gavel: TANK: UNSOUND', (lt, d, t, blit) => {
      resetAll(); env(t); desk.visible = true; desk.position.set(0, 0, 0.3); show([judge]); vis(gav, true); const hit = lt > un - 0.05 && lt < un + 0.2;
      judge.at(0, 0.55, -0.2).set({ mood: lt > un ? 'proud' : 'angry', armR: [hit ? 110 : 160, 0], armL: [30, 0], blink: blink(t), talk: lt < un ? Math.sin(t * 12) > 0 : 0 });
      gav.position.set(0.55, 1.1 + (hit ? 0 : 0.5), 0.4); board(bUn, lt > un - 0.4, 0, 3.0, 0.6, 0.95, lt, un - 0.4);
      shoot([judge], V3(0.4, 1.6, 7.0), V3(0.1, 1.5, 4.8), V3(0, 1.5, 0.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + un - 0.05, 'klonk', { gain: 1.0 }); cue(st + un, 'stamp', { gain: 0.6 }); cue(st + un + 0.3, 'get_out', { gain: 0.6 }); }
  // 12 · firefighters hose with salt water
  { const st = cut(5), sw = Wd('salt', 5) - st;
    sbs('S12', st, 'fire engine and two firefighters hose the brown lake; pool shrinks; SALT WATER board', (lt, d, t, blit) => {
      resetAll(); env(t); eng.visible = true; eng.position.set(-7, 0, -0.4); pools[2].position.set(-0.3, 0, 0.7); pools[2].set(1 - clamp((lt - 0.8) / (d - 0.8)) * 0.65); show([fire1, fire2]); vis(hs, lt > 0.5); const ph = t * 6;
      fire1.at(-2.6, 0, 1.4).set({ mood: 'proud', armL: [90, 0], armR: [90, 0], blink: blink(t), lean: 4 }); fire2.at(-4.0, 0, 1.2).set({ mood: 'happy', armL: [90, 0], armR: [90, 0], blink: blink(t, 1) });
      hs.position.set(-2.1, 1.4, 1.5); hs.stream.rotation.z = Math.PI / 2 - 0.35 + Math.sin(t * 5) * 0.03; hs.stream.scale.y = 0.9 + Math.sin(t * 40) * 0.08;
      board(bSal, lt > sw, -4.0, 3.5, 1.0, 0.9, lt, sw);
      shoot([fire1, fire2], V3(-3, 2.2, 9.5), V3(-2.4, 2.0, 7.6), V3(-3.2, 1.3, 0.8), V3(-1.8, 1.0, 0.8), eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'alarm', { gain: 0.4 }); cue(st + sw, 'bubbles', { gain: 0.6, dur: 1.8 }); cue(st + sw + 0.3, 'chug', { gain: 0.4 }); }
  // 13 · sweet smell
  { const st = Wd('smelled', 5) - 0.1;
    sbs('S13', st, 'people smell sweet air, hearts float; SMELLED SWEET FOR YEARS', (lt, d, t, blit) => {
      resetAll(); env(t); placeCrowd(t, 0); show([clerk, kid, joe]); clerk.at(-3, 0, 0.8).set({ mood: 'happy', armR: [150, 0], blink: blink(t), lean: -6 }); kid.at(0, 0, 1.5).set({ mood: 'laugh', blink: blink(t, 1), bob: Math.abs(Math.sin(t * 5)) * 0.04 }); joe.at(3, 0, 0.8).set({ mood: 'tired', armR: [155, 0], sweat: 1, blink: blink(t, 2) });
      board(bSw, lt > 0.15, 0, 3.4, 0.8, 0.95, lt, 0.15);
      shoot([clerk, kid, joe], V3(0, 2.0, 10), V3(0, 1.8, 8), V3(0, 1.5, 0.8), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'bruh_clip', { gain: 0.8 }); cue(st + 1.5, 'michael_jackson', { gain: 0.6 }); }
  // 14 · loop wide
  { const st = cut(6);
    sbs('S14', st, 'wide street again, tank gone, Mo with popcorn: can molasses kill?', (lt, d, t, blit) => {
      resetAll(); env(t); placeCrowd(t, 1); show([clerk]); clerk.at(-5, 0, 0.3).set({ mood: 'tired', armR: [100 + Math.sin(t * 5) * 15, 0], blink: blink(t) }); putMo(0.6, 3.4); mo.set({ mood: 'sly', blink: blink(t, 0.3) }); tank.visible = true; pools[1].position.set(10, 0, -0.5); pools[1].set(1);
      shoot([clerk, mo], V3(-1, 6.5, 15), V3(-1, 2.0, 11), V3(2, 3.0, -1), V3(-1, 1.8, 0), eio(clamp(lt / d)), 48); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 1.3, 'crunch', { gain: 0.5 }); }
  // 15 · the gag: Mo's shoe is stuck
  { const st = Wd('city', 6) - 0.1, nv = Wd('never', 6) - st;
    sbs('S15', st, 'Mo tries to leave but his shoe is glued to the street; stretch; wink', (lt, d, t, blit) => {
      resetAll(); env(t); pools[1].position.set(1.6, 0, 3.0); pools[1].set(1); putMo(1.6, 3.0); mo.set({ mood: lt > nv ? 'laugh' : 'worried', legs: 'walk', phase: lt < nv ? t * 8 : 0, lean: lt < nv ? 8 + Math.sin(t * 8) * 5 : 0, blink: blink(t, 0.3) });
      shoot([mo], V3(1.8, 1.2, 7), V3(1.7, 1.1, 5.2), V3(1.6, 1.0, 3.0), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'boing', { gain: 0.6 }); cue(st + nv, 'badumtss', { gain: 0.7 }); cue(st + nv + 0.2, 'bruh_clip', { gain: 0.6 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
