// THE CITY THAT PAID PEOPLE TO BREED RATS: Tall Tale+ (Hanoi 1902).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as WT from './core/water.js';
import * as RT from './core/rats.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const OFF = { body: '#E8E4D8', hat: 'bowler', hatCol: '#222222', pattern: 'vest', extra: ['monocle', 'mustache'] };
const CRL = cast(8, 11);
assertDistinct([MO, OFF, ...CRL], 'rat cast');
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
  const cty = WT.city(RT.HNAMES, RT.HWALLS); sc.add(cty);
  const gnd = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#B5A47C', roughness: 1 })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = 0; gnd.receiveShadow = true; sc.add(gnd);
  const ct = RT.counter(), sz = RT.scissors(), cg = RT.cages(), tp = RT.tailPiece(), tp2 = RT.tailPiece();
  const TINTS = ['#7A6E66', '#5E5650', '#8A7A6A', '#6A625C', '#968A7C', '#544E4A'];
  const R = []; for (let i = 0; i < 18; i++) R.push(RT.rat(TINTS[i % 6]));
  [ct, sz, cg, tp, tp2, ...R].forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bKill = mk('PAY PEOPLE TO KILL RATS?', ['#2A2A33', '#F2E6CF']), bHanoi = mk('HANOI · 1902', ['#2E4E3F', '#F2E6CF']), bPlague = mk('PLAGUE!', ['#3E7A3A', '#FFFFFF']), bCent = mk('1 CENT PER RAT', ['#B8860B', '#FFFFFF']), bTail = mk('BRING THE TAIL', ['#B5372E', '#FFFFFF']), b20k = mk('20,000+ TAILS IN ONE DAY', ['#2E3E6A', '#F2E6CF']), bNoT = mk('RATS WITH NO TAILS?!', ['#7A3A8A', '#FFFFFF']), bSnip = mk('SNIP. RELEASE. REPEAT.', ['#2A2A33', '#F2E6CF']), bFarm = mk('RAT FARM', ['#6A4A32', '#F2E6CF']), bCan = mk('BOUNTY CANCELLED', ['#B5372E', '#FFFFFF']), bStay = mk('THE RATS STAYED', ['#2E6A4A', '#FFFFFF']), bWrong = mk('WHAT COULD GO WRONG?', ['#2A2A33', '#F2E6CF']), bBreed = mk('THEY BREED THEM', ['#B5372E', '#FFFFFF']), b06 = mk('PLAGUE AGAIN · 1906', ['#3E7A3A', '#FFFFFF']);
  const boards = [bKill, bHanoi, bPlague, bCent, bTail, b20k, bNoT, bSnip, bFarm, bCan, bStay, bWrong, bBreed, b06]; boards.forEach((b) => sc.add(b));
  const mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2), off = person(OFF), CR = CRL.map((l) => person(l));
  const SP = [mo, off, ...CR]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, ct, sz, cg, tp, tp2, ...R, ...boards].forEach((o) => vis(o, false)); cty.visible = true; gnd.visible = false; ct.setPile(0.2); };
  const idle = (p, x, z, t, i, o = {}) => { vis(p, true); p.at(x, 0, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const ratAt = (i, x, z, face, s = 1, bob = 0, tail = true) => { vis(R[i], true); R[i].at(x, z, face, s, bob); R[i].tail.visible = tail; };
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
  const MOODS = ['worried', 'sad', 'confused', 'shock', 'worried', 'sad', 'confused', 'worried'];

  // 01 · Mo, a rat runs by
  { const st = 0, pk = Wd('kill', 0) - st - 0.2;
    sbs('S01', st, 'Mo with popcorn, a rat scampers past; PAY PEOPLE TO KILL RATS?', (lt, d, t, blit) => {
      resetAll(); putMo(-0.3, 2.5); mo.set({ mood: lt > pk ? 'sly' : 'happy', armR: [110, 0], blink: blink(t, 0.3) }); ratAt(0, -2.6 + lt * 1.6, 3.3, 0, 1.6, lt);
      board(bKill, lt > pk, 0, 3.6, 2.4, 0.95, lt, pk);
      shoot([mo], V3(0, 1.9, 8.2), V3(0, 1.7, 6.6), V3(0.1, 1.2, 2.5), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st + 0.2, 'whoosh', { gain: 0.35 }); cue(st + 0.5, 'tock', { gain: 0.4 }); cue(st + pk, 'pop', { gain: 0.7 }); cue(st + pk + 0.3, 'hehehehehehehe', { gain: 0.5 }); }
  // 02 · Hanoi 1902, rats everywhere, people on chairs
  { const st = Wd('In', 0) - 0.1, hn = Wd('Hanoi', 0) - st;
    sbs('S02', st, 'wide Hanoi street, rats running between worried people; HANOI · 1902', (lt, d, t, blit) => {
      resetAll(); [[0, -2.6, 2.4], [1, 2.6, 2.4], [2, -1.0, 3.6], [3, 1.4, 3.7]].forEach(([i, x, z]) => idle(CR[i], x, z, t, i, { mood: MOODS[i], armL: [30, 0] })); putMo(0, 4.5); mo.set({ mood: 'worried', blink: blink(t, 0.3) });
      for (let i = 0; i < 7; i++) ratAt(i + 1, -4 + ((lt * (1.4 + i * 0.2) + i * 1.3) % 8), 1.6 + (i % 4) * 0.8, 0, 1.2, lt + i);
      board(bHanoi, lt > hn - 0.2, 0, 5.2, 0.5, 1.0, lt, hn - 0.2);
      shoot([mo, ...CR.slice(0, 4)], V3(0, 3.0, 12), V3(0, 2.6, 9.4), V3(0, 2.6, 0), null, eio(clamp(lt / d)), 50); blit(); });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + 0.5, 'step', { gain: 0.3 }); cue(st + hn, 'pop', { gain: 0.6 }); cue(st + hn + 0.2, 'core', { gain: 0.5 }); }
  // 03 · plague
  { const st = cut(1), pg = Wd('plague,', 1) - st;
    sbs('S03', st, 'big rat close with sick green crowd; PLAGUE!', (lt, d, t, blit) => {
      resetAll(); ratAt(8, -0.2, 2.6, -0.7, 3.2, lt * 0.6); idle(CR[4], 1.6, 1.4, t, 4, { mood: 'shock', sweat: 1, armR: [120, 0] }); idle(CR[5], -1.8, 1.6, t, 5, { mood: 'sad', flip: 1 });
      board(bPlague, lt > pg - 0.2, 0, 3.4, 1.0, 0.9, lt, pg - 0.2);
      shoot([CR[4], CR[5]], V3(0.5, 1.7, 8), V3(0.2, 1.5, 6.2), V3(0, 1.1, 2.0), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + pg - 0.2, 'shocked', { gain: 0.7 }); cue(st + pg + 0.3, 'bone_crack', { gain: 0.4 }); }
  // 04 · 1 cent per rat
  { const st = Wd('French', 1) - 0.1, ce = Wd('cent', 1) - st;
    sbs('S04', st, 'French official behind counter flipping a coin; 1 CENT PER RAT', (lt, d, t, blit) => {
      resetAll(); vis(ct, true); ct.position.set(0, 0, 0.3); idle(off, 0.4, -0.7, t, 1, { mood: 'smug', armR: [100 + Math.sin(t * 6) * 15, 0] });
      board(bCent, lt > ce - 0.2, 0, 3.3, 0.3, 0.9, lt, ce - 0.2);
      shoot([off], V3(0.5, 1.9, 9), V3(0.2, 1.8, 7.2), V3(0, 1.4, 0.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ce, 'coin', { gain: 0.8 }); cue(st + ce + 0.3, 'coin', { gain: 0.6 }); }
  // 05 · bring the tail
  { const st = Wd('Just', 1) - 0.1, tl = Wd('tail.', 1) - st;
    sbs('S05', st, 'hunter hands a rat tail to the official; BRING THE TAIL', (lt, d, t, blit) => {
      resetAll(); vis(ct, true); ct.position.set(0, 0, 0.3); idle(off, -0.5, -0.7, t, 1, { mood: 'smug', armL: [100, 0] }); idle(CR[2], 0.9, 1.5, t, 2, { mood: 'proud', armR: [100, 0], flip: 1 });
      vis(tp, true); const k = clamp((lt - 0.3) / (d - 0.5)); tp.position.set(lerp(0.7, -0.2, eio(k)), lerp(1.5, 1.35, k), lerp(1.4, 0.2, eio(k))); tp.rotation.z = 0.3;
      board(bTail, lt > tl - 0.4, 0, 3.4, 0.3, 0.9, lt, tl - 0.4);
      shoot([off, CR[2]], V3(0.3, 1.8, 8.5), V3(0.2, 1.7, 6.8), V3(0.1, 1.4, 0.6), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.6, 'tock', { gain: 0.5 }); cue(st + tl, 'pop', { gain: 0.7 }); cue(st + tl + 0.2, 'coin', { gain: 0.6 }); }
  // 06 · 20,000 tails
  { const st = cut(2), tw = Wd('twenty', 2) - st;
    sbs('S06', st, 'pile of tails growing on the counter, hunters queue; 20,000+ TAILS IN ONE DAY', (lt, d, t, blit) => {
      resetAll(); vis(ct, true); ct.position.set(0, 0, 0.3); ct.setPile(clamp(0.2 + lt / d)); idle(off, 1.1, -0.7, t, 1, { mood: 'shock', armR: [110, 0], sweat: lt > tw }); [3, 5, 6].forEach((i, n) => idle(CR[i], -2.0 + n * 1.0, 2.0, t, i, { mood: 'proud', armR: [90 + Math.sin(t * 4 + i) * 15, 0], flip: n % 2 }));
      board(b20k, lt > tw - 0.2, 0, 3.6, 0.3, 0.95, lt, tw - 0.2);
      shoot([off, CR[3], CR[5], CR[6]], V3(0.3, 2.0, 10.5), V3(0.2, 1.9, 8.4), V3(0, 1.4, 0.5), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 6; k++) cue(st + 0.4 + k * 0.45, 'coin', { gain: 0.4 }); cue(st + tw, 'omg_bruh', { gain: 0.6, dur: 1.6 }); }
  // 07 · rats with no tails
  { const st = cut(3), no = Wd('no', 3) - st;
    sbs('S07', st, 'inspector with clipboard spots a tailless rat; RATS WITH NO TAILS?!', (lt, d, t, blit) => {
      resetAll(); idle(off, -0.5, 1.6, t, 1, { mood: lt > no - 0.3 ? 'shock' : 'worried', armR: [110, 0], sweat: lt > no - 0.3 }); for (let i = 0; i < 3; i++) ratAt(i + 9, -2.4 + ((lt * 1.1 + i * 1.4) % 5.2), 2.4 + i * 0.6, 0, 1.8, lt + i, false);
      board(bNoT, lt > no - 0.3, 0, 3.5, 1.0, 0.9, lt, no - 0.3);
      shoot([off], V3(0.3, 1.8, 8), V3(0.1, 1.5, 6.2), V3(0, 1.0, 2.0), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + no - 0.3, 'shocked', { gain: 0.8 }); cue(st + no + 0.3, 'bruh_clip', { gain: 0.6 }); }
  // 08 · snip and release
  { const st = Wd('People', 3) - 0.1, cu = Wd('cutting', 3) - st, go = Wd('go.', 3) - st;
    sbs('S08', st, 'hunter snips a rat tail with scissors then lets it run; SNIP. RELEASE. REPEAT.', (lt, d, t, blit) => {
      resetAll(); idle(CR[7], 0, 1.5, t, 7, { mood: 'sly', armR: [110, 0], armL: [100, 0] }); vis(sz, true); sz.position.set(0.45, 1.1, 1.9); sz.scale.setScalar(0.45); sz.set(Math.abs(Math.sin(lt * 7)) );
      const free = lt > go - 0.2; ratAt(12, free ? lerp(-0.2, 3, clamp((lt - go + 0.2) / 0.8)) : -0.2, 1.7, 0, 1.6, free ? lt : 0, lt < cu + 0.3);
      if (lt > cu + 0.3) { vis(tp, true); tp.position.set(0.3, 1.3 - clamp((lt - cu - 0.3) / 0.6) * 0.8, 1.9); }
      board(bSnip, lt > cu - 0.3, 0, 3.4, 1.0, 0.9, lt, cu - 0.3);
      shoot([CR[7]], V3(0.3, 1.8, 7.5), V3(0.1, 1.5, 5.8), V3(0.1, 1.0, 1.8), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + cu, 'tock', { gain: 0.7 }); cue(st + cu + 0.3, 'bone_crack', { gain: 0.5 }); cue(st + go, 'faaah', { gain: 0.7 }); }
  // 09 · rat farm
  { const st = cut(4), fm = Wd('farms', 4) - st;
    sbs('S09', st, 'stacked cages full of rats, proud farmer; RAT FARM', (lt, d, t, blit) => {
      resetAll(); vis(cg, true); cg.position.set(0, 0, 0); for (let i = 0; i < 6; i++) { const r = Math.floor(i / 2), c = i % 2; ratAt(i + 13 > 17 ? 17 : i + 13, (c - 0.5) * 1.5 + Math.sin(lt * 2 + i) * 0.3, 0.05, i % 2 ? 0 : Math.PI, 1.0, 0); R[Math.min(i + 13, 17)].position.y = 0.38 + r * 0.8; }
      idle(CR[1], 2.0, 1.8, t, 1, { mood: 'proud', armL: [110, 0], flip: 1 });
      board(bFarm, lt > fm - 0.3, 0, 3.4, 0.3, 0.9, lt, fm - 0.3);
      shoot([CR[1]], V3(0.5, 1.8, 9), V3(0.3, 1.6, 7.2), V3(0.5, 1.3, 0.5), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + fm, 'pop', { gain: 0.7 }); cue(st + fm + 0.2, 'thats_why_hes_the_goat', { gain: 0.5, dur: 2.0 }); }
  // 10 · bounty cancelled
  { const st = cut(5), cn = Wd('cancelled', 5) - st;
    sbs('S10', st, 'official stamps BOUNTY CANCELLED', (lt, d, t, blit) => {
      resetAll(); vis(ct, true); ct.position.set(0, 0, 0.3); ct.setPile(1); idle(off, 0, -0.7, t, 1, { mood: lt > cn ? 'angry' : 'neutral', armR: [lt > cn ? 40 : 120, 0] });
      board(bCan, lt > cn - 0.1, 0, 3.3, 0.5, 1.0, lt, cn - 0.1);
      shoot([off], V3(0.3, 1.8, 9), V3(0.2, 1.7, 7.2), V3(0, 1.4, 0.4), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + cn - 0.05, 'stamp', { gain: 0.9 }); cue(st + cn + 0.3, 'slam', { gain: 0.5 }); }
  // 11 · rats stayed
  { const st = Wd('rats', 5) - 0.2, ry = Wd('stayed.', 5) - st;
    sbs('S11', st, 'street swarming with rats, Mo defeated; THE RATS STAYED', (lt, d, t, blit) => {
      resetAll(); putMo(0, 3.0); mo.set({ mood: lt > ry - 0.2 ? 'sad' : 'worried', blink: blink(t, 0.3) }); for (let i = 0; i < 14; i++) ratAt(i + 1, -3.2 + ((lt * (0.8 + (i % 5) * 0.2) + i * 0.9) % 6.6), 1.0 + (i % 5) * 0.7, i % 2 ? 0 : Math.PI, 1.3, lt + i);
      board(bStay, lt > ry - 0.3, 0, 3.3, 0.5, 0.95, lt, ry - 0.3);
      shoot([mo], V3(0, 2.0, 9.5), V3(0, 1.9, 7.8), V3(0, 1.4, 1.5), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'step', { gain: 0.3 }); cue(st + ry, 'trombone', { gain: 0.6 }); }
  // 12 · loop: what could go wrong
  { const st = cut(6), pa = Wd('pay', 6) - st;
    sbs('S12', st, 'Mo wide with rats at his feet; WHAT COULD GO WRONG?', (lt, d, t, blit) => {
      resetAll(); putMo(0, 4.2); mo.set({ mood: 'confused', blink: blink(t, 0.3), armR: [120, 0] }); [[0, -2.6, 2.6], [2, 2.6, 2.6]].forEach(([i, x, z]) => idle(CR[i], x, z, t, i, { mood: MOODS[i] })); for (let i = 0; i < 5; i++) ratAt(i + 1, -2.5 + i * 1.3, 3.2 + (i % 2) * 0.6, i % 2 ? 0 : Math.PI, 1.2, lt + i);
      board(bWrong, lt > pa - 0.2, 0, 4.2, 1.0, 0.9, lt, pa - 0.2);
      shoot([mo], V3(0, 3.0, 13), V3(0, 2.4, 10), V3(0, 1.5, 2), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + pa, 'pop', { gain: 0.6 }); }
  // 13 · they breed them
  { const st = Wd('They', 6) - 0.1, br = Wd('breed', 6) - st;
    sbs('S13', st, 'two big rats and a growing swarm of baby rats; THEY BREED THEM', (lt, d, t, blit) => {
      resetAll(); ratAt(0, -0.4, 2.4, 0, 2.6, 0); ratAt(1, 0.5, 2.4, Math.PI, 2.6, 0); const n = Math.floor(clamp(lt / (d - 0.2)) * 12); for (let i = 0; i < n; i++) ratAt(i + 2 > 17 ? 17 : i + 2, -1.8 + (i % 6) * 0.7, 2.9 + Math.floor(i / 6) * 0.5, i % 2 ? 0 : Math.PI, 0.9, lt + i);
      board(bBreed, lt > br - 0.2, 0, 3.4, 1.0, 0.9, lt, br - 0.2);
      shoot([], V3(0.2, 1.6, 7.5), V3(0.1, 1.5, 6), V3(0, 0.8, 2.4), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 5; k++) cue(st + 0.3 + k * 0.2, 'pop', { gain: 0.5 }); cue(st + br, 'omg_bruh', { gain: 0.6, dur: 1.6 }); }
  // 14 · plague again
  { const st = Wd('And', 6) - 0.1, pg = Wd('plague', 6) - st;
    sbs('S14', st, 'sick green-faced crowd and Mo shocked; PLAGUE AGAIN · 1906', (lt, d, t, blit) => {
      resetAll(); putMo(0, 3.0); mo.set({ mood: 'shock', blink: blink(t, 0.3), sweat: 1 }); idle(CR[4], -2.0, 2.2, t, 4, { mood: 'sad', tears: 1 }); idle(CR[6], 2.0, 2.2, t, 6, { mood: 'worried', flip: 1, sweat: 1 }); ratAt(3, 1.2, 3.8, Math.PI, 1.6, lt);
      board(b06, lt > pg - 0.4, 0, 3.4, 0.5, 0.9, lt, pg - 0.4);
      shoot([mo], V3(0, 2.0, 9.5), V3(0, 1.9, 7.8), V3(0, 1.4, 1.5), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + pg, 'core', { gain: 0.7 }); cue(st + pg + 0.5, 'badumtss', { gain: 0.7 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
