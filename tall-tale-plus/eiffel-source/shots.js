// THE MAN WHO SOLD THE EIFFEL TOWER: Tall Tale+ (Paris 1925).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as CD from './core/cad.js';
import * as BS from './core/boston.js';
import * as PR from './core/paris.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const KEY = {
  lus: { body: '#2A2A33', pattern: 'vest', patCol: '#C9A13B', hat: 'tophat', hatCol: '#1A1A22', extra: ['mustache', 'monocle'] },
  poi: { body: '#6A5A3A', pattern: 'apron', patCol: '#D9C9A0', hat: 'boater', hatCol: '#E8C77A', extra: ['glasses', 'mustache'] },
  cop: { body: '#2E4E8A', hat: 'mailcap', hatCol: '#1E3A5A', extra: ['mustache'] },
  mo: { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] },
};
const HATS = ['bowler', 'cap', 'beanie', 'visor', 'boater', 'bun', 'none', 'flower', 'bow', 'tophat'], EXTRAS = [[], ['mustache'], ['glasses'], ['freckles'], ['blush'], ['pencil'], ['mustache', 'glasses'], ['freckles', 'blush']], PATS = ['plain', 'vest', 'apron', 'overalls'];
const CROWD = Array.from({ length: 12 }, (_, i) => ({ body: `hsl(${(i * 61 + 8) % 360},${45 + (i % 3) * 9}%,${38 + (i % 4) * 5}%)`, hat: HATS[i % HATS.length], hatCol: `hsl(${(i * 83 + 200) % 360},42%,${26 + (i % 3) * 9}%)`, pattern: PATS[i % 4], patCol: '#E8DFC8', extra: EXTRAS[(i * 3 + 1) % EXTRAS.length] }));
assertDistinct([...Object.values(KEY), ...CROWD], 'eiffel cast');
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
  sc.add(PR.row(-34, 16, -7.5, 4));
  const tow = PR.eiffel(); tow.position.set(5, 0, -22); tow.scale.setScalar(1.0); sc.add(tow);
  const tbl = PR.table(); sc.add(tbl); const bc = PR.briefcase(); sc.add(bc);
  const birds = PW.birds(6); sc.add(birds);
  for (let i = 0; i < 10; i++) { const o = i % 2 ? WD.barrel() : WD.crate(0.55 + rn(i) * 0.3); o.position.set(-28 + i * 5.2 + rn(i + 2), 0.18, -4.6 + rn(i + 5) * 0.4); sc.add(o); }
  for (let x = -26; x < 14; x += 9) { const l = WD.lamp(); l.position.set(x, 0.18, -4.3); sc.add(l); }
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bP = mk('PARIS · 1925', ['#1E3A5A', '#F2E6CF']), bDid = mk('IT DID.', ['#6A2E1E', '#F2D37A']), bGov = mk('GOVT. OFFICIAL', ['#2E4E3F', '#F2D37A']), b5 = mk('5 SCRAP DEALERS', ['#3A2A1E', '#F2E6CF']), bScr = mk('SOLD FOR SCRAP', ['#B5372E', '#FFFFFF']), b73 = mk('7,300 TONS OF IRON', ['#4A4A52', '#FFFFFF']), bPaid = mk('PAID', ['#2E7A4A', '#FFFFFF']), bBr = mk('+ BRIBE', ['#7A3A8A', '#FFFFFF']), bAu = mk('AUSTRIA →', ['#B5372E', '#FFFFFF']), bEm = mk('TOO EMBARRASSED', ['#2A2A33', '#F2E6CF']), bR2 = mk('ROUND 2', ['#B5372E', '#FFFFFF']), bFS = mk('FOR SALE', ['#B5372E', '#FFFFFF']);
  const boards = [bP, bDid, bGov, b5, bScr, b73, bPaid, bBr, bAu, bEm, bR2, bFS]; boards.forEach((b) => sc.add(b));

  const lus = person(KEY.lus), poi = person(KEY.poi), cop = person(KEY.cop), mo = person(KEY.mo, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const crowd = CROWD.map((l) => person(l)); const SP = [lus, poi, cop, mo]; [...SP, ...crowd].forEach((p) => sc.add(p.group)); sc.add(pcn);
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); hide(crowd); [pcn, tbl, bc, ...boards].forEach((o) => vis(o, false)); tow.rotation.z = 0; };
  const idle = (p, x, z, t, i, o = {}) => { vis(p, true); p.at(x, 0, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const shoot = (people, from, to, at, at2, k, fov, pull = 1) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const tgt = at2 ? mix(at, at2, k) : at; cam.position.copy(tgt.clone().add(mix(from, to, k).sub(tgt).multiplyScalar(pull))); cam.lookAt(tgt);
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(tgt) });
  };
  const board = (b, on, x, y, z, s, lt, t0) => { vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const env = (t) => { birds.update(t, -12, 12, -10); };
  const sbs = (id, at, note, draw) => add({ id, at, note, draw });
  const walkers = (t, n = 4) => { for (let k = 0; k < n; k++) { const x = ((-14 + k * 7 + t * (k % 2 ? -0.5 : 0.5) + 30) % 28) - 14; const p = crowd[k]; vis(p, true); p.at(x, Math.abs(Math.sin(t * 6 + k)) * 0.04, 1.8 + (k % 3) * 0.5).set({ mood: 'neutral', legs: 'walk', phase: t * 6.5 + k * 1.7, flip: k % 2, armL: [10 + Math.sin(t * 6 + k) * 12, 0], armR: [10 - Math.sin(t * 6 + k) * 12, 0], blink: blink(t, k) }); } };
  const sitAt = (p, x, z, t, i, face) => { vis(p, true); p.at(x, 0, z).set({ mood: 'neutral', legs: 'sit', flip: face, armL: [20, 0], armR: [20, 0], blink: blink(t, i) }); };

  // 01 · wide Paris, Eiffel Tower, Mo
  { const st = cut(0), it = Wd('Tower?', 0) - st;
    sbs('S01', st, 'wide Paris street, Eiffel Tower behind, Mo with popcorn, PARIS 1925 board', (lt, d, t, blit) => {
      resetAll(); env(t); walkers(t, 3); putMo(1.0, 3.4); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      board(bP, lt > 0.05, 1.5, 3.3 - eo(clamp(lt / d)) * 0.5, 1.4, 0.85, lt, 0.05);
      shoot([mo], V3(1, 8, 18), V3(2, 2.8, 12), V3(4, 11, -3), V3(2, 1.8, 0), eio(clamp(lt / d)), 50); blit(); });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.6, 'creak', { gain: 0.3 }); cue(st + 1.5, 'klonk', { gain: 0.7 }); }
  // 02 · one man did
  { const st = Wd('man', 0) - 0.15;
    sbs('S02', st, 'push-in on Mo smirking; IT DID.', (lt, d, t, blit) => {
      resetAll(); env(t); walkers(t, 2); putMo(1.6, 2.4); mo.set({ mood: 'smug', blink: blink(t) }); board(bDid, lt > 0.2, 2.2, 2.6, 2.5, 0.8, lt, 0.2);
      shoot([mo], V3(1.8, 1.3, 7), V3(1.7, 1.25, 4.6), V3(1.6, 1.2, 2.4), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.1, 'shocked', { gain: 0.9 }); }
  // 03 · Lustig the official
  { const st = cut(1), gv = Wd('government', 1) - st;
    sbs('S03', st, 'Lustig in monocle and tophat adjusts lapel; GOVT. OFFICIAL board', (lt, d, t, blit) => {
      resetAll(); env(t); idle(lus, 0, 0.9, t, 1, { mood: 'smug', armR: [100 + Math.sin(t * 3) * 8, 0], armL: [30, 0], talk: Math.sin(t * 12) > 0 });
      board(bGov, lt > gv - 0.2, 1.5, 3.0, 0.8, 0.9, lt, gv - 0.2);
      shoot([lus], V3(0.5, 1.7, 7.2), V3(0.1, 1.6, 5.0), V3(0, 1.4, 0.9), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + gv - 0.2, 'pop', { gain: 0.7 }); cue(st + gv, 'metal_gear', { gain: 0.6 }); }
  // 04 · five dealers at the hotel table
  { const st = Wd('invited', 1) - 0.08, fv = Wd('five', 1) - st;
    sbs('S04', st, 'hotel table: Lustig and five different scrap dealers; 5 SCRAP DEALERS board', (lt, d, t, blit) => {
      resetAll(); env(t); tbl.visible = true; tbl.position.set(0, 0, 0.4); idle(lus, 0, -0.55, t, 1, { mood: 'smug', armR: [90 + Math.sin(t * 4) * 10, 0], talk: Math.sin(t * 12) > 0 });
      [-1.6, -0.8, 0, 0.8, 1.6].forEach((x, i) => sitAt(crowd[i + 4], x * 1.15, 1.45, t, i, 0)); board(b5, lt > fv, 0, 3.0, 0.8, 0.9, lt, fv);
      shoot([lus, ...crowd.slice(4, 9)], V3(0, 3.3, 9), V3(0, 2.7, 7.2), V3(0, 1.1, 0.5), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + fv, 'pop', { gain: 0.6 }); cue(st + fv + 0.3, 'let_him_cook_now', { gain: 0.5, dur: 2.2 }); }
  // 05 · sold for scrap: low angle at tower
  { const st = cut(2), sc2 = Wd('scrap.', 2) - st;
    sbs('S05', st, 'low angle: Lustig points up at the Eiffel Tower; board SOLD FOR SCRAP; tower shivers', (lt, d, t, blit) => {
      resetAll(); env(t); idle(lus, -1.2, 1.5, t, 1, { mood: 'smug', armR: [165, 0], armL: [30, 0], talk: Math.sin(t * 12) > 0 }); tow.rotation.z = lt > sc2 - 0.5 ? Math.sin(t * 22) * 0.01 : 0;
      board(bScr, lt > sc2 - 0.4, 1.8, 3.4, 2.2, 0.9, lt, sc2 - 0.4);
      shoot([lus], V3(-1, 0.9, 8), V3(-0.5, 0.8, 6.4), V3(2, 8.0, -14), V3(2, 14.0, -14), eio(clamp(lt / d)), 56); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + sc2 - 0.4, 'pop', { gain: 0.7 }); cue(st + sc2, 'klonk', { gain: 0.9 }); cue(st + sc2 + 0.4, 'creak', { gain: 0.4 }); }
  // 06 · Poisson pays
  { const st = cut(3), pd = Wd('paid', 3) - st;
    sbs('S06', st, 'Poisson hands an open briefcase of cash to Lustig; PAID board', (lt, d, t, blit) => {
      resetAll(); env(t); idle(poi, -0.5, 0.9, t, 2, { mood: lt > pd ? 'worried' : 'happy', armR: [lt > pd - 0.3 ? 70 : 20, 0], sweat: lt > pd ? 1 : 0 }); idle(lus, 0.55, 0.9, t, 1, { mood: 'smug', flip: 1, armL: [lt > pd ? 80 : 30, 0] });
      vis(bc, true); bc.position.set(lt > pd ? 0.7 : -0.5, 0.2 + 0.9 - 0.2, 1.2); bc.position.y = 0.95; board(bPaid, lt > pd, 0, 3.0, 0.8, 0.9, lt, pd);
      shoot([poi, lus], V3(0, 1.8, 9.2), V3(0, 1.7, 7.6), V3(0, 1.3, 0.9), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + pd, 'pop', { gain: 0.6 }); cue(st + pd + 0.2, 'coin', { gain: 0.7 }); cue(st + pd + 0.3, 'faaah', { gain: 0.5 }); }
  // 07 · even bribed him
  { const st = Wd('bribed', 3) - 0.1;
    sbs('S07', st, 'Poisson slips an extra envelope; Lustig grins; + BRIBE board', (lt, d, t, blit) => {
      resetAll(); env(t); idle(poi, -0.5, 0.9, t, 2, { mood: 'worried', armR: [70, 0], sweat: 1 }); idle(lus, 0.55, 0.9, t, 1, { mood: 'sly', flip: 1, armL: [60, 0] }); board(bBr, lt > 0.15, 0, 3.0, 0.8, 0.9, lt, 0.15);
      shoot([poi, lus], V3(0.6, 1.6, 9), V3(0.2, 1.5, 7.4), V3(0, 1.3, 0.9), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.15, 'pop', { gain: 0.6 }); cue(st + 0.5, 'hehehehehehehe', { gain: 0.6 }); cue(st + 1.3, 'coin', { gain: 0.6 }); }
  // 08 · fled to Austria
  { const st = cut(4), au = Wd('Austria.', 4) - st;
    sbs('S08', st, 'tracking side shot: Lustig runs with suitcase of cash; AUSTRIA board', (lt, d, t, blit) => {
      resetAll(); env(t); const x = -8 + lt * 7, ph = t * 12; vis(lus, true); lus.at(x, Math.abs(Math.sin(ph)) * 0.08, 1.0).set({ mood: 'smug', legs: 'walk', phase: ph, flip: 0, armL: [100 + Math.sin(ph) * 30, 0], armR: [100 - Math.sin(ph) * 30, 0], blink: blink(t) });
      vis(bc, true); bc.position.set(x + 0.6, 0.55 + Math.abs(Math.sin(ph)) * 0.08, 1.15); board(bAu, lt > au - 0.7, x + 1.2, 3.1, 0.8, 0.9, lt, au - 0.7);
      shoot([lus], V3(x + 0.6, 2.0, 9.5), V3(x + 0.6, 2.0, 9.5), V3(x + 0.8, 1.4, 1.0), null, 0, 44); blit(); });
    cue(st, 'whoosh', { gain: 0.4 }); for (let k = 0; k < 6; k++) cue(st + 0.2 + k * 0.42, 'step', { gain: 0.5, pan: k % 2 ? 0.2 : -0.2 }); cue(st + au - 0.6, 'anime_ahh', { gain: 0.7 }); }
  // 09 · Poisson embarrassed
  { const st = Wd('Poisson', 4) - 0.08, em = Wd('embarrassed', 4) - st;
    sbs('S09', st, 'Poisson blushes, facepalms and cries; cop waits, shrugs; TOO EMBARRASSED', (lt, d, t, blit) => {
      resetAll(); env(t); idle(poi, 0, 0.9, t, 2, { mood: 'sad', tears: 1, armL: [150, 0], armR: [150, 0], sweat: 1 }); idle(cop, 3.0, 1.3, t, 3, { mood: 'confused', armR: [70, 0], armL: [20, 0] }); board(bEm, lt > em - 0.2, -0.2, 3.0, 0.8, 0.9, lt, em - 0.2);
      shoot([poi, cop], V3(1, 1.8, 8.2), V3(0.8, 1.6, 6.2), V3(1.2, 1.3, 1.0), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.7, 'auughhh', { gain: 0.5, dur: 1.8 }); cue(st + em, 'bruh_clip', { gain: 0.7 }); }
  // 10 · round 2
  { const st = cut(5), rd = Wd('again.', 5) - st;
    sbs('S10', st, 'Lustig again with five new dealers at the table; ROUND 2', (lt, d, t, blit) => {
      resetAll(); env(t); tbl.visible = true; tbl.position.set(0, 0, 0.4); idle(lus, 0, -0.55, t, 1, { mood: 'sly', armR: [90 + Math.sin(t * 4) * 10, 0], talk: Math.sin(t * 12) > 0 });
      [-1.6, -0.8, 0, 0.8, 1.6].forEach((x, i) => sitAt(crowd[(i + 7) % 12], x * 1.15, 1.45, t, i, 0)); board(bR2, lt > 0.3, 0, 3.0, 0.8, 0.95, lt, 0.3);
      shoot([lus, ...crowd.slice(7, 12)], V3(0, 3.3, 9), V3(0, 2.7, 7.2), V3(0, 1.1, 0.5), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'pop', { gain: 0.6 }); cue(st + rd - 0.3, 'get_out', { gain: 0.5 }); }
  // 11 · loop wide
  { const st = cut(6);
    sbs('S11', st, 'wide Paris, Eiffel Tower standing, Mo', (lt, d, t, blit) => {
      resetAll(); env(t); walkers(t, 4); putMo(0.4, 3.6); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      shoot([mo], V3(-1, 8, 18), V3(1, 2.6, 12), V3(4, 11, -3), V3(2, 1.8, 0), eio(clamp(lt / d)), 50); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 1.4, 'crunch', { gain: 0.5 }); }
  // 12 · gag: Mo FOR SALE
  { const st = Wd('still', 6) - 0.5, ss = Wd('still', 6) - st;
    sbs('S12', st, 'Mo smiles with a FOR SALE board pointed at the tower; badumtss', (lt, d, t, blit) => {
      resetAll(); env(t); putMo(1.0, 3.0); mo.set({ mood: lt > ss ? 'laugh' : 'sly', armR: [150, 0], blink: blink(t, 0.3) }); board(bFS, lt > 0.1, 1.9, 2.5, 3.1, 0.55, lt, 0.1);
      shoot([mo], V3(1.2, 1.3, 7.4), V3(1.2, 1.4, 5.6), V3(1.0, 1.3, 3.0), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'boing', { gain: 0.6 }); cue(st + ss + 0.4, 'badumtss', { gain: 0.7 }); cue(st + ss + 0.6, 'omg_bruh', { gain: 0.5, dur: 1.6 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
