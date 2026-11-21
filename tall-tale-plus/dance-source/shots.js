// THE CITY THAT COULDN'T STOP DANCING: Tall Tale+ (Strasbourg 1518).
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
  tro: { body: '#B5683F', pattern: 'apron', patCol: '#F2E6CF', hat: 'bun', hatCol: '#5A3A22', extra: ['freckles', 'blush'] },
  doc: { body: '#2A3A5A', pattern: 'vest', patCol: '#C9A13B', hat: 'bowler', hatCol: '#1A1A22', extra: ['mustache', 'glasses'] },
  off: { body: '#7A2E3A', pattern: 'vest', patCol: '#E2B33C', hat: 'tophat', hatCol: '#E2B33C', extra: ['mustache'] },
  sch: { body: '#5A4A7A', hat: 'boater', hatCol: '#E8C77A', extra: ['glasses', 'pencil'] },
  drum: { body: '#3E8A5A', hat: 'cap', hatCol: '#5A3A22', extra: ['freckles'] },
  pipe: { body: '#E2B33C', hat: 'flower', hatCol: '#B5372E', extra: ['blush'] },
  mo: { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] },
};
const HATS = ['bowler', 'cap', 'beanie', 'visor', 'boater', 'bun', 'none', 'flower', 'mailcap', 'bow'], EXTRAS = [[], ['mustache'], ['glasses'], ['freckles'], ['blush'], ['pencil'], ['mustache', 'glasses'], ['freckles', 'blush']], PATS = ['plain', 'vest', 'apron', 'overalls'];
const CROWD = Array.from({ length: 16 }, (_, i) => ({ body: `hsl(${(i * 47 + 12) % 360},${45 + (i % 3) * 9}%,${40 + (i % 4) * 5}%)`, hat: HATS[i % HATS.length], hatCol: `hsl(${(i * 83 + 200) % 360},42%,${26 + (i % 3) * 9}%)`, pattern: PATS[i % 4], patCol: '#E8DFC8', extra: EXTRAS[(i * 3 + 1) % EXTRAS.length] }));
assertDistinct([...Object.values(KEY), ...CROWD], 'dance cast');
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
  const NM = ['BAKER', 'TAVERN', 'WEAVER', 'CANDLES', 'COOPER', 'APOTHECARY', 'SMITH', 'FURRIER'], WL = ['#C9A77A', '#B58A5A', '#D9C29A', '#A87A55', '#C49A6A'];
  const bld = BS.row(-34, 16, -7.5, 5, NM, WL); sc.add(bld); const bld2 = BS.row(-34, 16, -14, 2, NM, WL); sc.add(bld2);
  const cat = BS.cathedral(); cat.position.set(2, 0, -24); cat.scale.setScalar(1.3); sc.add(cat);
  const stg = BS.stage(); stg.position.set(8, 0, -1.5); sc.add(stg);
  const bread = BS.bread(); sc.add(bread);
  const birds = PW.birds(6); sc.add(birds);
  for (let i = 0; i < 12; i++) { const o = i % 2 ? WD.barrel() : WD.crate(0.55 + rn(i) * 0.3); o.position.set(-28 + i * 4.6 + rn(i + 2), 0.18, -4.6 + rn(i + 5) * 0.4); sc.add(o); }
  for (let x = -26; x < 14; x += 11) { const l = WD.lamp(); l.position.set(x, 0.18, -4.3); sc.add(l); }
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bCity = mk('STRASBOURG · 1518', ['#2E3E6A', '#F2E6CF']), bJul = mk('JULY 1518', ['#2E3E6A', '#F2E6CF']), bDay = mk('DAY 6. STILL GOING.', ['#B5372E', '#FFFFFF']), b400 = mk('400 DANCERS', ['#B5372E', '#FFFFFF']), bHot = mk('"HOT BLOOD"', ['#7A2E3A', '#F2D37A']), bBand = mk('BAND HIRED', ['#2E6A4A', '#FFFFFF']), bEx = mk('EXHAUSTED', ['#2A2A33', '#F2E6CF']), bRye = mk('MOLDY RYE?', ['#4E7A3A', '#FFFFFF']), bStr = mk('MASS STRESS?', ['#7A3A8A', '#FFFFFF']), bDid = mk('IT DID.', ['#6A2E1E', '#F2D37A']), bNoStop = mk('CAN\'T STOP', ['#B5372E', '#FFFFFF']);
  const boards = [bCity, bJul, bDay, b400, bHot, bBand, bEx, bRye, bStr, bDid, bNoStop]; boards.forEach((b) => sc.add(b));

  const tro = person(KEY.tro), doc = person(KEY.doc), off = person(KEY.off), sch = person(KEY.sch), drum = person(KEY.drum), pipe = person(KEY.pipe), mo = person(KEY.mo, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const crowd = CROWD.map((l) => person(l)); const SP = [tro, doc, off, sch, drum, pipe, mo]; [...SP, ...crowd].forEach((p) => sc.add(p.group)); sc.add(pcn);
  const dance = (p, x, z, t, i, o = {}) => { const ph = t * 6 + i * 1.3, s = Math.sin(ph); vis(p, true); p.at(x + Math.sin(t * 1.5 + i) * 0.25, Math.abs(s) * 0.12, z).set({ mood: i % 4 ? 'happy' : 'laugh', legs: 'walk', phase: ph * 1.2, flip: Math.sin(t * 2 + i) > 0 ? 1 : 0, armL: [140 + s * 30, 0], armR: [140 - s * 30, 0], lean: s * 8, blink: blink(t, i * 0.4), ...o }); };
  const danceN = (t, cx, n, w = 8, z0 = 1.2, from = 0) => { crowd.forEach((p, i) => { p.group.visible = false; }); for (let k = 0; k < n; k++) { const i = (from + k) % crowd.length; dance(crowd[i], cx - w / 2 + (k + 0.5) * (w / n) + rn(i) * 0.4, z0 + (rn(i + 4) - 0.2) * 2.4, t, i); } };
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); hide(crowd); [pcn, ...boards, bread].forEach((o) => vis(o, false)); };
  const shoot = (people, from, to, at, at2, k, fov, pull = 1) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const tgt = at2 ? mix(at, at2, k) : at; cam.position.copy(tgt.clone().add(mix(from, to, k).sub(tgt).multiplyScalar(pull))); cam.lookAt(tgt);
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(tgt) });
  };
  const board = (b, on, x, y, z, s, lt, t0) => { vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const env = (t) => { birds.update(t, -12, 12, -10); };
  const sbs = (id, at, note, draw) => add({ id, at, note, draw });
  const lie = (p, x, z, i, t) => { vis(p, true); p.at(x, 0, z).set({ mood: 'dizzy', legs: 'sit', squash: 0, lean: i % 2 ? 12 : -12, armL: [30, 0], armR: [30, 0], blink: 0, bob: Math.sin(t * 2 + i) * 0.02 }); };

  // 01 · wide square, cathedral, Mo
  { const st = cut(0), it = Wd('drops?', 0) - st;
    sbs('S01', st, 'wide Strasbourg square, cathedral, Mo with popcorn, STRASBOURG · 1518 board', (lt, d, t, blit) => {
      resetAll(); env(t); danceN(t, 4, 3, 5, 1.0, 0); putMo(-1.2, 3.4); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      board(bCity, lt > 0.05, 2.6, 3.2 - eo(clamp(lt / d)) * 0.5, 1.4, 0.85, lt, 0.05);
      shoot([mo], V3(-2, 9, 16), V3(0, 2.6, 11.5), V3(4, 4.5, -2), V3(2, 1.8, 0), eio(clamp(lt / d)), 48); blit(); });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.5, 'creak', { gain: 0.3 }); cue(st + 1.4, 'klonk', { gain: 0.7 }); }
  // 02 · "Strasbourg did": push in on Mo
  { const st = Wd('Strasbourg', 0) - 0.12;
    sbs('S02', st, 'push-in on Mo smirking; IT DID. board; dancers behind', (lt, d, t, blit) => {
      resetAll(); env(t); danceN(t, 5, 3, 6, -0.6, 3); putMo(1.6, 2.4); mo.set({ mood: 'smug', blink: blink(t) }); board(bDid, lt > 0.2, 2.2, 2.6, 2.5, 0.8, lt, 0.2);
      shoot([mo], V3(1.8, 1.3, 7), V3(1.7, 1.25, 4.6), V3(1.6, 1.2, 2.4), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st + 0.1, 'shocked', { gain: 0.9 }); cue(st, 'whoosh', { gain: 0.3 }); }
  // 03 · Frau Troffea starts dancing
  { const st = cut(1);
    sbs('S03', st, 'JULY 1518: Frau Troffea dances alone in the street, townsfolk stare', (lt, d, t, blit) => {
      resetAll(); env(t); dance(tro, 0, 1.2, t, 3, { mood: 'happy' }); show([doc, sch]); doc.at(-3.6, 0, 0.6).set({ mood: 'worried', armR: [20, 0], blink: blink(t) }); sch.at(3.4, 0, 0.5).set({ mood: 'shock', armR: [100, 0], blink: blink(t, 1) });
      board(bJul, lt > 0.1, 0, 3.4, 0.8, 0.9, lt, 0.1);
      shoot([tro, doc, sch], V3(-1, 2.0, 10), V3(0, 1.8, 7.8), V3(0, 1.4, 1), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.7, 'michael_jackson', { gain: 0.8 }); cue(st + 2.0, 'hehehehehehehe', { gain: 0.4 }); }
  // 04 · she danced for days
  { const st = Wd('danced', 1) - 0.06, da = Wd('days.', 1) - st;
    sbs('S04', st, 'close on Troffea, sweating, still dancing; DAY 6 board', (lt, d, t, blit) => {
      resetAll(); env(t); dance(tro, 0, 1.2, t, 3, { mood: lt > da - 0.3 ? 'tired' : 'happy', sweat: 1 }); board(bDay, lt > da - 0.5, 0.2, 2.9, 1.0, 0.9, lt, da - 0.5);
      shoot([tro], V3(0.3, 1.3, 6.4), V3(0.1, 1.2, 4.2), V3(0, 1.1, 1.2), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + da - 0.4, 'error', { gain: 0.6 }); }
  // 05 · within weeks: crowd grows
  { const st = cut(2);
    sbs('S05', st, 'crowd of dancers grows 4 to 16 across the street; 400 DANCERS', (lt, d, t, blit) => {
      resetAll(); env(t); const n = Math.min(16, 4 + Math.floor(lt / d * 14)); danceN(t, 0, n, 9, 1.0); dance(tro, 0, 2.6, t, 3); board(b400, lt > 0.6, 0, 3.6, 0.5, 0.95, lt, 0.6);
      shoot([], V3(0, 4.8, 13), V3(0, 2.6, 10), V3(0, 1.2, 1.4), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.9, 'pop', { gain: 0.6 }); cue(st + 1.5, 'pop', { gain: 0.6 }); cue(st + 2.1, 'cheer', { gain: 0.8, dur: 1.6 }); }
  // 06 · packed street, high view
  { const st = Wd('people', 2) - 0.06;
    sbs('S06', st, 'high angle on a packed street of dancers, cathedral behind', (lt, d, t, blit) => {
      resetAll(); env(t); danceN(t, 0, 16, 10, 0.8); dance(tro, 0, 2.8, t, 3);
      shoot([], V3(-3, 6.5, 14), V3(3, 6.0, 13), V3(0, 1.4, 1.0), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.4, 'faaah', { gain: 0.6 }); }
  // 07 · doctor blames hot blood
  { const st = cut(3), hb = Wd('hot', 3) - st;
    sbs('S07', st, 'doctor with glasses declares HOT BLOOD, dancers behind him', (lt, d, t, blit) => {
      resetAll(); env(t); danceN(t, 2, 4, 6, -1.0, 6); show([doc]); doc.at(0, 0, 0.8).set({ mood: lt > hb ? 'smug' : 'sly', armR: [150 + Math.sin(t * 9) * 10, 0], armL: [40, 0], blink: blink(t), talk: Math.sin(t * 13) > 0 });
      board(bHot, lt > hb, 1.5, 3.0, 0.8, 0.9, lt, hb);
      shoot([doc], V3(0.5, 1.7, 7), V3(0.1, 1.7, 5.2), V3(0, 1.4, 0.8), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + hb, 'pop', { gain: 0.7 }); cue(st + hb + 0.2, 'metal_gear', { gain: 0.6 }); }
  // 08 · officials hire a band, stage
  { const st = Wd('officials', 3) - 0.06, bd = Wd('band', 3) - st;
    sbs('S08', st, 'stage with drummer and piper; official in gold tophat; BAND HIRED; dancers swarm', (lt, d, t, blit) => {
      resetAll(); env(t); danceN(t, 2, 6, 10, 3.0, 8); show([off]); off.at(3.2, 0, 3.2).set({ mood: 'proud', armR: [150, 0], armL: [60, 0], blink: blink(t) });
      dance(drum, 7, -1.5, t, 5, { flip: 0 }); drum.at(7, 0.7 + Math.abs(Math.sin(t * 8)) * 0.08, -1.5); pipe.at(9.2, 0.7 + Math.abs(Math.sin(t * 8 + 1)) * 0.08, -1.5).set({ mood: 'laugh', legs: 'stand', armL: [110, 0], armR: [110, 0], blink: blink(t) }); vis(pipe, true);
      board(bBand, lt > bd - 0.1, 4, 3.5, 1, 0.9, lt, bd - 0.1);
      shoot([off, drum, pipe], V3(2, 2.4, 10), V3(5.5, 2.2, 8.6), V3(5, 1.4, 0.5), V3(7, 1.4, 0), eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + bd - 0.1, 'klonk', { gain: 0.8 }); for (let k = 0; k < 6; k++) cue(st + bd + 0.2 + k * 0.45, 'tock', { gain: 0.45 }); cue(st + bd + 0.4, 'switch', { gain: 0.25, dur: 2.0 }); }
  // 09 · it backfired: collapse
  { const st = cut(4), bf = Wd('backfired.', 4) - st;
    sbs('S09', st, 'dancers collapse like dominoes; EXHAUSTED board', (lt, d, t, blit) => {
      resetAll(); env(t); const k = clamp((lt - bf) / 1.6);
      crowd.slice(0, 9).forEach((p, i) => { const x = -4 + i * 1.05, z = 0.8 + (i % 3) * 0.7; if (k * 9 > i) lie(p, x, z, i, t); else dance(p, x, z, t, i, { mood: 'worried', sweat: 1 }); }); dance(tro, 3.8, 2.6, t, 3, { mood: 'tired', sweat: 1 });
      board(bEx, lt > bf, 0, 3.3, 0.5, 0.95, lt, bf);
      shoot([], V3(0, 3.0, 11.5), V3(0, 2.4, 9.4), V3(0, 0.9, 1.4), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + bf, 'bone_crack', { gain: 0.8 }); for (let k = 0; k < 4; k++) cue(st + bf + 0.2 + k * 0.38, 'thud', { gain: 0.5 }); cue(st + bf + 1.0, 'wasted', { gain: 0.45, dur: 1.5 }); }
  // 10 · historians argue
  { const st = cut(5), ry = Wd('moldy', 5) - st, ms = Wd('mass', 5) - st;
    sbs('S10', st, 'scholar holds moldy bread, MOLDY RYE? then MASS STRESS? boards', (lt, d, t, blit) => {
      resetAll(); env(t); show([sch]); vis(bread, true); bread.position.set(-0.9, 1.5, 0.6); bread.scale.setScalar(0.5); bread.rotation.y = t * 1.2;
      sch.at(0.6, 0, 0.8).set({ mood: lt > ms ? 'worried' : 'sly', armR: [lt > ry ? 120 : 40, 0], armL: [40, 0], blink: blink(t), talk: Math.sin(t * 12) > 0 });
      board(bRye, lt > ry && lt < ms, 0, 3.2, 0.9, 0.9, lt, ry); board(bStr, lt > ms, 0, 3.2, 0.9, 0.9, lt, ms);
      shoot([sch], V3(0.3, 1.6, 7), V3(0.2, 1.5, 5.0), V3(0, 1.4, 0.9), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ry, 'pop', { gain: 0.6 }); cue(st + ms, 'pop', { gain: 0.6 }); cue(st + ms + 0.2, 'error', { gain: 0.5 }); }
  // 11 · loop wide: everyone dancing, Mo too
  { const st = cut(6);
    sbs('S11', st, 'wide square: whole city dancing, cathedral behind, Mo with popcorn', (lt, d, t, blit) => {
      resetAll(); env(t); danceN(t, 2, 14, 12, 1.0); putMo(-0.4, 3.6); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      shoot([mo], V3(-2, 8.5, 16), V3(0, 2.4, 11.5), V3(4, 4.5, -2), V3(2, 1.8, 0), eio(clamp(lt / d)), 48); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 0.2, 'michael_jackson', { gain: 0.7 }); cue(st + 1.4, 'crunch', { gain: 0.5 }); }
  // 12 · Mo cannot stop
  { const st = Wd('nobody', 6) - 0.2, nb = 0.4;
    sbs('S12', st, 'Mo tries to stop but his legs keep dancing; CANT STOP board; badumtss', (lt, d, t, blit) => {
      resetAll(); env(t); putMo(1.6, 3.0); const ph = t * 9; mo.set({ mood: lt > nb ? 'laugh' : 'worried', legs: 'walk', phase: ph, bob: Math.abs(Math.sin(ph)) * 0.06, armL: [140 + Math.sin(ph) * 30, 0], armR: [140 - Math.sin(ph) * 30, 0], lean: Math.sin(ph) * 8, blink: blink(t, 0.3) });
      pcn.position.set(1.27, 0.82 + Math.abs(Math.sin(ph)) * 0.06, 3.2); board(bNoStop, lt > 0.5, 1.8, 2.7, 3.1, 0.75, lt, 0.5);
      shoot([mo], V3(1.8, 1.2, 7), V3(1.7, 1.1, 5.2), V3(1.6, 1.0, 3.0), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'boing', { gain: 0.6 }); cue(st + 1.0, 'badumtss', { gain: 0.7 }); cue(st + 1.2, 'bruh_clip', { gain: 0.6 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
