// THE FAN EVERYONE HATED FOR 13 YEARS: Tall Tale+ (Bartman, NLCS Game 6, 2003).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as BP from './core/park.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const BART = { body: '#2F6B3F', hat: 'cap', hatCol: '#1F3FA0', pattern: 'plain', extra: ['glasses'] };
const ALOU = { body: '#F4F4F4', pattern: 'stripes', patCol: '#1F3FA0', hat: 'cap', hatCol: '#1F3FA0', extra: ['mustache'] };
const UMP = { body: '#1A1A1A', hat: 'cap', hatCol: '#111111', pattern: 'plain', extra: ['pencil'] };
const SEC = { body: '#F28C38', hat: 'cap', hatCol: '#222222', pattern: 'vest', extra: ['mustache'] };
const MAR = [{ body: '#2AA6A6', hat: 'cap', hatCol: '#111111', pattern: 'plain', extra: [] }, { body: '#2AA6A6', hat: 'cap', hatCol: '#111111', pattern: 'plain', extra: ['freckles'] }, { body: '#2AA6A6', hat: 'visor', hatCol: '#111111', pattern: 'plain', extra: ['glasses'] }];
const CRL = cast(8, 21);
assertDistinct([MO, BART, ALOU, UMP, SEC, ...MAR, ...CRL], 'bart cast');
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.35) => eob(clamp((lt - t0) / dur));

  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(6, 12, 12); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; sc.children.forEach((c) => { if (c.geometry && c.geometry.type === 'CircleGeometry') c.visible = false; if (c.geometry && c.geometry.type === 'PlaneGeometry' && c.geometry.parameters.width === 200) c.position.y = -2.5; });
  const pk = BP.park(); sc.add(pk);
  const bl = BP.ball(), gl = BP.glove(), tr = BP.trophy(), rg = BP.ring(), mc = BP.mic(); const cups = []; for (let i = 0; i < 8; i++) cups.push(BP.cup(['#E8E4D8', '#B5372E', '#E2B33C', '#2E6A4A'][i % 4]));
  [bl, gl, tr, rg, mc, ...cups].forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bScore = mk('CUBS 3 · MARLINS 0 · 8TH', ['#1F3FA0', '#FFFFFF']), bInst = mk('PURE INSTINCT', ['#2A2A33', '#F2E6CF']), bBlock = mk('BLOCKED HER GLOVE', ['#B5372E', '#FFFFFF']), bScream = mk('HE SCREAMED', ['#B5372E', '#FFFFFF']), bFive = mk('5 OUTS FROM THE WORLD SERIES', ['#1F3FA0', '#FFFFFF']), bSB = mk('STEVE BARTMAN', ['#2F6B3F', '#FFFFFF']), bNoInt = mk('RULED: NO INTERFERENCE', ['#2A2A33', '#F2E6CF']), bFall = mk('THE CUBS FELL APART', ['#B5372E', '#FFFFFF']), b8 = mk('FLORIDA: 8 RUNS', ['#2AA6A6', '#FFFFFF']), bTrash = mk('FANS THREW TRASH', ['#6A4A32', '#F2E6CF']), bSneak = mk('SNEAKED OUT', ['#2A2A33', '#F2E6CF']), bSorry = mk('HE APOLOGIZED', ['#2E4E8A', '#FFFFFF']), bHated = mk('MOST HATED FAN', ['#B5372E', '#FFFFFF']), b13 = mk('13 YEARS LATER', ['#1F3FA0', '#FFFFFF']), bRing = mk('CHAMPIONSHIP RING', ['#B8860B', '#FFFFFF']), bEvery = mk('LIKE EVERY FAN DOES', ['#2E6A4A', '#FFFFFF']), bReach = mk('DO YOU REACH?', ['#2A2A33', '#F2E6CF']);
  const boards = [bScore, bInst, bBlock, bScream, bFive, bSB, bNoInt, bFall, b8, bTrash, bSneak, bSorry, bHated, b13, bRing, bEvery, bReach]; boards.forEach((b) => sc.add(b));
  const mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2), bart = person(BART), alou = person(ALOU), ump = person(UMP), sec = person(SEC), MR = MAR.map((l) => person(l)), CR = CRL.map((l) => person(l));
  const SP = [mo, bart, alou, ump, sec, ...MR, ...CR]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const putMo = (x, y, z) => { mo.at(x, y, z); pcn.position.set(x - 0.33, y + 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, bl, gl, tr, rg, mc, ...cups, ...boards].forEach((o) => vis(o, false)); };
  const idle = (p, x, y, z, t, i, o = {}) => { vis(p, true); p.at(x, y, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const shoot = (people, from, to, at, at2, k, fov, pull = 1) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const tgt = at2 ? mix(at, at2, k) : at; cam.position.copy(tgt.clone().add(mix(from, to, k).sub(tgt).multiplyScalar(pull))); cam.lookAt(tgt);
    cam.updateMatrixWorld(true);
    boards.forEach((b) => { if (!b.visible) return; const dist = cam.position.distanceTo(b.position), hh = dist * Math.tan(cam.fov * Math.PI / 360), hw = hh * 0.5625, wd = b.geometry.parameters.width, sMax = (1.7 * hw * 0.88) / wd; if (b.scale.x > sMax) b.scale.setScalar(sMax);
      const n = b.position.clone().project(cam), hn = (wd * b.scale.x / 2) / hw; const ov = Math.abs(n.x) + hn - 0.92; if (ov > 0) b.position.x -= Math.sign(n.x || 1) * ov * hw; if (n.y > 0.72) b.position.y -= (n.y - 0.72) * hh; });
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(tgt) });
  };
  const board = (b, on, x, y, z, s, lt, t0) => { vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const sbs = (id, at, note, draw) => add({ id, at, note, draw });
  const SY = 0.75; // stands row height
  const seat = (p, x, t, i, o = {}) => idle(p, x, SY, -1.9, t, i, o);

  // 01 · wide: ball flies in toward Bartman; Mo next to him
  { const st = 0, ins = Wd('instinctively', 0) - st - 0.1;
    sbs('S01', st, 'wide ballpark, ball arcing toward Bartman in the stands, Mo with popcorn beside him; CUBS 3 · MARLINS 0', (lt, d, t, blit) => {
      resetAll(); seat(bart, 0.5, t, 1, { mood: 'happy', armL: [60, 0], armR: [60, 0] }); putMo(-0.7, SY, -1.9); mo.set({ mood: 'happy', blink: blink(t, 0.3) }); idle(alou, -1.0, 0, -0.5, t, 2, { mood: 'worried', armR: [130, 0], armL: [20, 0], lean: -6 });
      const k = clamp(lt / d); vis(bl, true); bl.position.set(lerp(3.5, 0.3, eio(k)), lerp(6, 2.7, eio(k)) + Math.sin(k * Math.PI) * 1.2, lerp(-5, -1.5, eio(k))); bl.rotation.z = lt * 12;
      board(bScore, lt > 0.5, 0, 6.2, -1.2, 1.0, lt, 0.5);
      shoot([bart, mo, alou], V3(0, 2.6, 9), V3(0, 2.4, 7.2), V3(0, 2.4, -1.5), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 0.4, 'pop', { gain: 0.5 }); cue(st + 1.2, 'cheer', { gain: 0.3, dur: 1.6 }); }
  // 02 · instinct: Bartman reaches up
  { const st = Wd('instinctively', 0) - 0.1, sk = Wd('stuck', 0) - st;
    sbs('S02', st, 'close on Bartman as his hands shoot up; PURE INSTINCT', (lt, d, t, blit) => {
      resetAll(); const up = clamp((lt - sk + 0.2) / 0.5); seat(bart, 0.4, t, 1, { mood: 'shock', armL: [lerp(40, 175, up), 0], armR: [lerp(40, 175, up), 0] }); const k = clamp(lt / d); vis(bl, true); bl.position.set(lerp(0.3, 0.35, k), lerp(3.4, 2.7, eio(k)), lerp(-1.5, -1.6, k));
      board(bInst, lt > sk - 0.2, 0.4, 5.0, -1.2, 0.9, lt, sk - 0.2);
      shoot([bart], V3(0.5, 2.4, 5.2), V3(0.45, 2.5, 4.0), V3(0.4, 2.7, -1.8), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + sk, 'boing', { gain: 0.6 }); cue(st + sk + 0.2, 'tock', { gain: 0.5 }); }
  // 03 · left fielder jumps
  { const st = Wd('right', 0) - 0.05, jp = Wd('jumped', 0) - st;
    sbs('S03', st, 'Alou leaps against the wall with the glove up; ball between them', (lt, d, t, blit) => {
      resetAll(); seat(bart, 0.45, t, 1, { mood: 'shock', armL: [175, 0], armR: [175, 0] }); const j = clamp((lt - jp + 0.3) / 0.4); idle(alou, -0.4, Math.sin(j * Math.PI * 0.5) * 0.75, -0.55, t, 2, { mood: 'angry', armR: [176, 0], armL: [20, 0] }); vis(gl, true); gl.position.set(-0.28, 2.45 + Math.sin(j * Math.PI * 0.5) * 0.75, -0.7); vis(bl, true); bl.position.set(0.0, lerp(2.9, 2.8, lt / d), -1.4);
      shoot([bart, alou], V3(0, 2.2, 6.2), V3(0, 2.4, 4.8), V3(0, 2.7, -1.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + jp - 0.3, 'boing', { gain: 0.5 }); cue(st + jp, 'step', { gain: 0.5 }); }
  // 04 · blocked the glove
  { const st = Wd('but', 0) - 0.1, bk = Wd('blocked', 0) - st;
    sbs('S04', st, 'ball hits Bartman hands, glove closes on air; BLOCKED HER GLOVE (kept short)', (lt, d, t, blit) => {
      resetAll(); seat(bart, 0.45, t, 1, { mood: 'shock', armL: [175, 0], armR: [175, 0] }); idle(alou, -0.4, 0.75, -0.55, t, 2, { mood: lt > bk ? 'angry' : 'worried', armR: [176, 0], armL: [20, 0] }); vis(gl, true); gl.position.set(-0.28 + (lt > bk ? 0.05 : 0), 3.2, -0.7); vis(bl, true); const f = clamp((lt - bk) / 0.8); bl.position.set(lerp(0.15, 1.4, f), lerp(2.9, 1.0, f * f), lerp(-1.4, -3.0, f)); bl.rotation.z = lt * 14;
      board(bBlock, lt > bk, 0, 5.0, -1.2, 0.9, lt, bk);
      shoot([bart, alou], V3(0, 2.2, 6.2), V3(0, 2.5, 4.8), V3(0, 2.9, -1.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st + bk - 0.05, 'klonk', { gain: 0.9 }); cue(st + bk + 0.1, 'bone_crack', { gain: 0.4 }); cue(st + bk + 0.5, 'bruh_clip', { gain: 0.6 }); }
  // 05 · he screamed
  { const st = cut(1), sc_ = Wd('screamed', 1) - st;
    sbs('S05', st, 'Alou screaming angrily, Bartman cringing behind the wall; HE SCREAMED', (lt, d, t, blit) => {
      resetAll(); idle(alou, -0.1, 0, -0.6, t, 2, { mood: 'angry', armR: [150, 0], armL: [90, 0], talk: Math.sin(t * 18) > 0 ? 1 : 0 }); seat(bart, 0.7, t, 1, { mood: 'shock', sweat: 1, armL: [100, 0], armR: [100, 0] });
      board(bScream, lt > sc_ - 0.2, 0, 4.6, -1.0, 0.9, lt, sc_ - 0.2);
      shoot([alou, bart], V3(0.2, 2.0, 6.5), V3(0.1, 2.0, 5.0), V3(0.2, 1.9, -0.8), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + sc_ - 0.1, 'aaaaaa', { gain: 0.7, dur: 1.4 }); cue(st + sc_ + 1.2, 'omg_bruh', { gain: 0.5, dur: 1.5 }); }
  // 06 · 5 outs from the World Series
  { const st = Wd('Cubs', 1) - 0.1, fv = Wd('five', 1) - st;
    sbs('S06', st, 'scoreboard + trophy glowing in background, Mo excited with popcorn; 5 OUTS FROM THE WORLD SERIES', (lt, d, t, blit) => {
      resetAll(); vis(tr, true); tr.position.set(1.2, 0.75, -1.6); tr.scale.setScalar(1.4); tr.rotation.y = t * 0.8; putMo(-0.5, SY, -1.9); mo.set({ mood: 'laugh', blink: blink(t, 0.3), armR: [150 + Math.sin(t * 8) * 15, 0] });
      board(bFive, lt > fv - 0.2, 0, 5.2, -1.0, 1.0, lt, fv - 0.2);
      shoot([mo], V3(0, 2.4, 8.5), V3(0, 2.3, 6.8), V3(0.2, 2.2, -1.7), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + fv, 'cheer', { gain: 0.5 }); cue(st + fv + 0.3, 'pop', { gain: 0.5 }); }
  // 07 · Steve Bartman
  { const st = Wd('this', 1) - 0.1, sb = Wd('Bartman.', 1) - st;
    sbs('S07', st, 'Bartman close-up, guilty face; STEVE BARTMAN', (lt, d, t, blit) => {
      resetAll(); seat(bart, 0.2, t, 1, { mood: lt > sb ? 'worried' : 'neutral', sweat: lt > sb ? 1 : 0, blink: blink(t, 0.2) });
      board(bSB, lt > sb - 0.1, 0.2, 4.6, -1.0, 0.95, lt, sb - 0.1);
      shoot([bart], V3(0.2, 2.2, 6), V3(0.2, 2.1, 4.4), V3(0.2, 2.1, -1.9), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + sb - 0.1, 'stamp', { gain: 0.8 }); cue(st + sb + 0.2, 'core', { gain: 0.6 }); }
  // 08 · umpire: no interference
  { const st = cut(2), no = Wd('no', 2) - st;
    sbs('S08', st, 'umpire waves arms wide: no interference; RULED: NO INTERFERENCE', (lt, d, t, blit) => {
      resetAll(); idle(ump, 0, 0, 0.6, t, 3, { mood: 'neutral', armL: [90 + Math.sin(t * 3) * 10, 0], armR: [90 - Math.sin(t * 3) * 10, 0] }); idle(alou, -1.5, 0, 0.0, t, 2, { mood: 'angry', armR: [110, 0] });
      board(bNoInt, lt > no - 0.1, 0, 4.3, 0.3, 0.9, lt, no - 0.1);
      shoot([ump, alou], V3(0, 1.9, 7.5), V3(0, 1.8, 5.8), V3(-0.3, 1.5, 0.4), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + no, 'switch', { gain: 0.5, dur: 1.0 }); cue(st + no + 1.0, 'bruh_clip', { gain: 0.6 }); }
  // 09 · Cubs fell apart
  { const st = Wd('Cubs', 2) - 0.1, fl = Wd('fell', 2) - st;
    sbs('S09', st, 'Cubs players slumped on the grass; THE CUBS FELL APART', (lt, d, t, blit) => {
      resetAll(); [[0, -1.8], [1, -0.6], [2, 0.6], [3, 1.8]].forEach(([i, x], n) => idle(CR[i], x, 0, 1.4 + (n % 2) * 0.5, t, i, { mood: 'sad', legs: 'sit', tears: 1, lean: n % 2 ? -10 : 10 })); 
      board(bFall, lt > fl - 0.1, 0, 3.7, 0.6, 0.95, lt, fl - 0.1);
      shoot([CR[0], CR[1], CR[2], CR[3]], V3(0, 2.2, 9.5), V3(0, 1.9, 7.8), V3(0, 1.0, 1.4), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + fl, 'trombone', { gain: 0.6 }); cue(st + fl + 0.3, 'thud', { gain: 0.5 }); }
  // 10 · Florida 8 runs
  { const st = Wd('Florida', 2) - 0.1, ei = Wd('eight', 2) - st;
    sbs('S10', st, 'teal Florida players jumping and celebrating; FLORIDA: 8 RUNS', (lt, d, t, blit) => {
      resetAll(); MR.forEach((p, i) => idle(p, -1.4 + i * 1.4, Math.abs(Math.sin(t * 7 + i)) * 0.3, 1.5 + (i % 2) * 0.4, t, i, { mood: 'laugh', armL: [160, 0], armR: [160, 0] })); 
      board(b8, lt > ei - 0.2, 0, 3.7, 0.6, 0.95, lt, ei - 0.2);
      shoot(MR, V3(0, 2.2, 9), V3(0, 1.9, 7.4), V3(0, 1.4, 1.5), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ei, 'cheer', { gain: 0.7 }); cue(st + ei + 0.4, 'coin', { gain: 0.4 }); }
  // 11 · fans throw trash
  { const st = cut(3), tr_ = Wd('trash', 3) - st;
    sbs('S11', st, 'angry fans throwing cups at cringing Bartman; FANS THREW TRASH', (lt, d, t, blit) => {
      resetAll(); seat(bart, 0.0, t, 1, { mood: 'shock', sweat: 1, armL: [120, 0], armR: [120, 0] }); [0, 1, 2].forEach((i) => idle(CR[i + 4], -1.7 + i * 1.2 + (i === 2 ? 2.4 : 0), SY, -2.9 + (i % 2) * 0.01, t, i, { mood: 'angry', armR: [140 + Math.sin(t * 8 + i) * 25, 0] })); 
      cups.forEach((c, i) => { vis(c, true); const f = (lt * 0.9 + i * 0.13) % 1, sx = -1.6 + (i % 4) * 1.1; c.position.set(lerp(sx, 0.0, f), 3.4 - f * 1.6 + Math.sin(f * 3) * 0.3, lerp(-2.6, -1.9, f)); c.rotation.z = lt * 10 + i; });
      board(bTrash, lt > tr_ - 0.2, 0, 5.3, -1.2, 0.95, lt, tr_ - 0.2);
      shoot([bart, CR[4], CR[5], CR[6]], V3(0, 2.4, 8.5), V3(0, 2.3, 6.9), V3(0, 2.1, -2.0), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 5; k++) cue(st + tr_ + k * 0.25, 'thud', { gain: 0.4 }); cue(st + tr_ + 0.2, 'ohhhhhh', { gain: 0.5, dur: 1.6 }); }
  // 12 · sneaked out
  { const st = Wd('Security', 3) - 0.1, sn = Wd('sneak', 3) - st;
    sbs('S12', st, 'security guard escorting a hunched Bartman; SNEAKED OUT', (lt, d, t, blit) => {
      resetAll(); const k = clamp(lt / d), x0 = lerp(-1.3, -0.5, k); idle(sec, x0 + 0.9, 0, 1.2, t, 4, { mood: 'angry', armL: [100, 0], legs: 'walk', phase: t * 7 }); idle(bart, x0, 0, 1.2, t, 1, { mood: 'sad', legs: 'walk', phase: t * 7, lean: 12, sweat: 1, armL: [150, 0], armR: [150, 0] });
      board(bSneak, lt > sn - 0.2, 0, 3.8, 0.6, 0.9, lt, sn - 0.2);
      shoot([sec, bart], V3(0, 1.9, 8.5), V3(0, 1.8, 6.8), V3(0, 1.1, 1.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 5; k++) cue(st + 0.3 + k * 0.45, 'step', { gain: 0.35 }); cue(st + sn, 'switch', { gain: 0.4, dur: 1.0 }); }
  // 13 · apology
  { const st = cut(4), ap = Wd('apologized', 4) - st;
    sbs('S13', st, 'Bartman at a mic, head down; HE APOLOGIZED', (lt, d, t, blit) => {
      resetAll(); vis(mc, true); mc.position.set(0.5, 0, 1.0); idle(bart, 0.0, 0, 1.0, t, 1, { mood: 'sad', tears: 1, armL: [100, 0], armR: [100, 0], lean: 6 });
      board(bSorry, lt > ap - 0.2, 0, 3.8, 0.6, 0.9, lt, ap - 0.2);
      shoot([bart], V3(0.2, 1.8, 6.8), V3(0.1, 1.7, 5.2), V3(0.2, 1.4, 1.0), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ap, 'tock', { gain: 0.5 }); cue(st + ap + 0.4, 'trombone', { gain: 0.5 }); }
  // 14 · most hated fan
  { const st = Wd('but', 4) - 0.1, ht = Wd('hated', 4) - st;
    sbs('S14', st, 'crowd of angry fans pointing at Bartman in the middle; MOST HATED FAN', (lt, d, t, blit) => {
      resetAll(); idle(bart, 0, 0, 2.2, t, 1, { mood: 'sad', sweat: 1, armL: [30, 0], armR: [30, 0] }); [0, 1, 2, 3, 4, 5].forEach((i, n) => idle(CR[i], -2.4 + n * 0.95, 0, 0.9 + (n % 2) * 0.1, t, i, { mood: 'angry', armR: [100 + Math.sin(t * 6 + i) * 20, 0], flip: n > 2 ? 1 : 0 }));
      board(bHated, lt > ht - 0.2, 0, 4.0, 0.4, 0.95, lt, ht - 0.2);
      shoot([bart, ...CR.slice(0, 6)], V3(0, 2.2, 10), V3(0, 2.0, 8.2), V3(0, 1.3, 1.4), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ht, 'bruh_clip', { gain: 0.6 }); cue(st + ht + 0.3, 'wasted', { gain: 0.5 }); }
  // 15 · 13 years later
  { const st = cut(5), th = Wd('Thirteen', 5) - st;
    sbs('S15', st, 'Cubs fans cheering around a gold trophy; 13 YEARS LATER', (lt, d, t, blit) => {
      resetAll(); vis(tr, true); tr.position.set(0, 0, 0.8); tr.scale.setScalar(1.3); tr.rotation.y = t; [0, 1, 2, 3].forEach((i) => idle(CR[i], -2.2 + i * 1.5, Math.abs(Math.sin(t * 6 + i)) * 0.25, 1.9, t, i, { mood: 'happy', armL: [160, 0], armR: [160, 0] }));
      board(b13, lt > th - 0.2, 0, 4.4, 0.6, 0.95, lt, th - 0.2);
      shoot([CR[0], CR[1], CR[2], CR[3]], V3(0, 2.2, 9.2), V3(0, 2.0, 7.4), V3(0, 1.2, 1.3), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + th, 'cheer', { gain: 0.7 }); cue(st + th + 0.3, 'pop', { gain: 0.5 }); cue(st + th + 1.2, 'thats_why_hes_the_goat', { gain: 0.5, dur: 2.2 }); }
  // 16 · championship ring
  { const st = Wd('and', 5) - 0.05, rn_ = Wd('championship', 5) - st;
    sbs('S16', st, 'big golden ring presented to a smiling Bartman; CHAMPIONSHIP RING', (lt, d, t, blit) => {
      resetAll(); idle(bart, 0, 0, 1.4, t, 1, { mood: lt > rn_ - 0.3 ? 'laugh' : 'happy', armR: [110, 0] }); vis(rg, true); rg.position.set(0.5, 1.9, 1.7); rg.rotation.set(0.3, t * 2, 0.1); rg.scale.setScalar(1.0 + 0.1 * Math.sin(t * 6));
      board(bRing, lt > rn_ - 0.3, 0, 3.9, 0.6, 0.9, lt, rn_ - 0.3);
      shoot([bart], V3(0.3, 1.9, 7), V3(0.2, 1.8, 5.4), V3(0.2, 1.5, 1.4), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + rn_ - 0.3, 'coin', { gain: 0.8 }); cue(st + rn_, 'cheer', { gain: 0.6 }); }
  // 17 · like fans do every game
  { const st = cut(6), fn = Wd('fans', 6) - st;
    sbs('S17', st, 'row of fans all reaching up for a foul ball; LIKE EVERY FAN DOES', (lt, d, t, blit) => {
      resetAll(); [0, 1, 2, 3, 4].forEach((i) => idle(CR[i], -2.4 + i * 1.2, SY * 0, 1.2 + (i % 2) * 0.4, t, i, { mood: 'happy', armL: [170 + Math.sin(t * 7 + i) * 6, 0], armR: [170 - Math.sin(t * 7 + i) * 6, 0] })); vis(bl, true); bl.position.set(0 + Math.sin(lt * 3) * 0.8, 3.3 + Math.sin(lt * 4) * 0.3, 1.4); bl.rotation.z = lt * 10;
      board(bEvery, lt > fn - 0.3, 0, 4.7, 0.6, 0.95, lt, fn - 0.3);
      shoot(CR.slice(0, 5), V3(0, 2.4, 9.5), V3(0, 2.2, 7.8), V3(0, 1.8, 1.4), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + fn, 'cheer', { gain: 0.5 }); }
  // 18 · loop: ball flies at Mo, do you reach?
  { const st = Wd('So', 6) - 0.1, rc = Wd('reach?', 6) - st;
    sbs('S18', st, 'ball flying at Mo in the stands with popcorn, hands half-raised; DO YOU REACH?', (lt, d, t, blit) => {
      resetAll(); putMo(0, SY, -1.9); mo.set({ mood: lt > rc - 0.5 ? 'confused' : 'happy', blink: blink(t, 0.3), armR: [lerp(20, 150, clamp((lt - 1.0) / 1.2)), 0] }); const k = clamp(lt / d); vis(bl, true); bl.position.set(lerp(3.5, 0.2, eio(k)), lerp(6, 2.5, eio(k)) + Math.sin(k * Math.PI) * 1.0, lerp(-5, -1.2, eio(k))); bl.rotation.z = lt * 12;
      board(bReach, lt > rc - 0.2, 0, 5.4, -1.0, 0.95, lt, rc - 0.2);
      shoot([mo], V3(0, 2.4, 8), V3(0, 2.3, 6.2), V3(0, 2.2, -1.7), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + rc - 0.3, 'pop', { gain: 0.5 }); cue(st + rc + 0.3, 'faaah', { gain: 0.7 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
