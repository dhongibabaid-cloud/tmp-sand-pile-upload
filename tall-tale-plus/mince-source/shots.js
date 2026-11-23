// THE DEAD BODY THAT TRICKED HITLER: Tall Tale+ (Operation Mincemeat, 1943).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as BP from './core/mnc.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const MONT = { body: '#2E4E8A', hat: 'bowler', hatCol: '#222233', pattern: 'plain', extra: ['mustache'] };
const CHOL = { body: '#8A6A4A', hat: 'cap', hatCol: '#4A3A2A', pattern: 'plain', extra: ['glasses'] };
const CORP = { body: '#6B7A4A', hat: 'cap', hatCol: '#4A5A32', pattern: 'plain', extra: [] };
const SPY1 = { body: '#B5372E', hat: 'cap', hatCol: '#222222', pattern: 'plain', extra: ['mustache'] };
const SPY2 = { body: '#2A2A33', hat: 'beanie', hatCol: '#555B66', pattern: 'plain', extra: ['freckles'] };
const GER1 = { body: '#6A707A', hat: 'visor', hatCol: '#3A3F4A', pattern: 'plain', extra: ['monocle'] };
const GER2 = { body: '#3A3F4A', hat: 'bowler', hatCol: '#1A1A1A', pattern: 'stripes', patCol: '#6A707A', extra: ['glasses'] };
assertDistinct([MO, MONT, CHOL, CORP, SPY1, SPY2, GER1, GER2], 'mince cast');
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.35) => eob(clamp((lt - t0) / dur));

  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(4, 10, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; sc.children.forEach((c) => { if (c.geometry && c.geometry.type === 'CircleGeometry') c.visible = false; if (c.geometry && c.geometry.type === 'PlaneGeometry' && c.geometry.parameters.width === 200) c.position.y = -2.5; });
  const room = BP.room(); sc.add(room);
  const tbl = new THREE.Group(); bx(5, 0.14, 1.8, mat({ color: '#6A4A32' }), 0, 1.0, 0, tbl); [[-2.3, -0.8], [2.3, -0.8], [-2.3, 0.8], [2.3, 0.8]].forEach(([x, z]) => bx(0.12, 1.0, 0.12, mat({ color: '#3A3A44' }), x, 0.5, z, tbl)); tbl.position.set(0, 0, -1.0); sc.add(tbl);
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bYear = mk('1943', ['#2A2A33', '#F2E6CF']), bDead = mk('TRICKED HITLER WITH A DEAD BODY', ['#B5372E', '#FFFFFF']), bMajor = mk('FAKE MAJOR WILLIAM MARTIN', ['#2E4E8A', '#FFFFFF']), bChain = mk('CHAINED BRIEFCASE', ['#6A4A32', '#F2E6CF']), bLet = mk('FAKE LETTERS', ['#B8860B', '#FFFFFF']), bPhoto = mk('PHOTO OF A FIANCEE', ['#B5372E', '#FFFFFF']), bRing = mk('RING RECEIPT', ['#B8860B', '#FFFFFF']), bTix = mk('THEATER TICKETS', ['#B5372E', '#FFFFFF']), bSub = mk('SUBMARINE DROP', ['#2A2A33', '#F2E6CF']), bSpain = mk('OFF THE COAST OF SPAIN', ['#C9603F', '#FFFFFF']), bSpy = mk('SPIES FIND IT', ['#2A2A33', '#F2E6CF']), bSecret = mk('SECRET PAPERS', ['#B5372E', '#FFFFFF']), bGreece = mk('INVADE GREECE + SARDINIA', ['#2E4E8A', '#FFFFFF']), bMoved = mk('HITLER MOVED HIS TROOPS', ['#555B66', '#FFFFFF']), bSicily = mk('REAL TARGET: SICILY', ['#2E6A4A', '#FFFFFF']), bJuly = mk('LANDED IN JULY', ['#1F3FA0', '#FFFFFF']), bBelieve = mk('WOULD YOU BELIEVE HIM?', ['#2A2A33', '#F2E6CF']);
  const boards = [bYear, bDead, bMajor, bChain, bLet, bPhoto, bRing, bTix, bSub, bSpain, bSpy, bSecret, bGreece, bMoved, bSicily, bJuly, bBelieve]; boards.forEach((b) => sc.add(b));
  const mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2), mont = person(MONT), chol = person(CHOL), corp = person(CORP), spy1 = person(SPY1), spy2 = person(SPY2), ger1 = person(GER1), ger2 = person(GER2);
  const SP = [mo, mont, chol, corp, spy1, spy2, ger1, ger2]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const mp = BP.mapBoard(), bc = BP.briefcase(), PH = BP.paper('photo'), PR = BP.paper('ring'), PT = BP.paper('ticket'), PS = BP.paper('secret'), sb = BP.sub(), sea = BP.sea(), snd = BP.sand();
  const OBJ = [mp, bc, PH, PR, PT, PS, sb, sea, snd, tbl, room]; OBJ.forEach((o) => sc.add(o));
  const putMo = (x, y, z) => { mo.at(x, y, z); pcn.position.set(x - 0.33, y + 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, ...OBJ, ...boards].forEach((o) => vis(o, false)); corp.group.rotation.set(0, 0, 0); vis(room, true); };
  const idle = (p, x, y, z, t, i, o = {}) => { vis(p, true); p.at(x, y, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const lay = (x, y, z) => { vis(corp, true); corp.at(x, y, z).set({ mood: 'neutral', blink: 1, armL: [10, 0], armR: [10, 0] }); corp.group.rotation.set(0, 0, Math.PI / 2); };
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
  const TY = 1.07;
  const outdoors = () => { vis(room, false); vis(sea, true); sea.position.set(0, 0.06, -8); };

  // 01 · morgue-lab wide: corpse on the table, two officers plotting, Mo
  { const st = 0, yr = Wd('1943,', 0) - st, dd = Wd('dead', 0) - st;
    sbs('S01', st, 'lab wide: a body on the table under a lamp, two British officers whispering, Mo with popcorn; 1943 then DEAD BODY', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); lay(1.3, TY + 0.08, -1.0); idle(mont, -1.5, 0, 0.5, t, 1, { mood: 'sly', armR: [70, 0] }); idle(chol, -0.6, 0, 0.9, t, 2, { mood: 'smug', armL: [60, 0] }); putMo(1.7, 0, 0.8); mo.set({ mood: 'shock', blink: blink(t, 0.3) });
      board(bYear, lt > yr - 0.2 && lt < dd - 0.4, 0, 4.4, -1.0, 0.8, lt, yr - 0.2); board(bDead, lt > dd - 0.3, 0, 4.4, -1.0, 0.95, lt, dd - 0.3);
      shoot([mont, chol, mo], V3(0, 2.4, 10), V3(0, 2.2, 8.4), V3(0, 1.5, -0.3), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + yr, 'stamp', { gain: 0.5 }); cue(st + dd, 'bruh_clip', { gain: 0.6 }); }
  // 02 · dressed as a fake officer
  { const st = cut(1), mj = Wd('Major', 1) - st;
    sbs('S02', st, 'officers dress the corpse in an olive uniform with a cap; FAKE MAJOR WILLIAM MARTIN', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); lay(0.9, TY + 0.08, -1.0); idle(mont, -1.2, 0, 1.2, t, 1, { mood: 'proud', armR: [100 + Math.sin(t * 5) * 10, 0] }); idle(chol, 1.3, 0, 1.4, t, 2, { mood: 'happy', armL: [90, 0] });
      board(bMajor, lt > mj - 0.3, 0, 4.1, -0.4, 0.95, lt, mj - 0.3);
      shoot([mont, chol], V3(0, 2.2, 7.4), V3(0, 2.0, 5.8), V3(0, 1.4, -0.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 1.0, 'step', { gain: 0.4 }); cue(st + mj, 'stamp', { gain: 0.6 }); }
  // 03 · chained briefcase
  { const st = Wd('and', 1) - 0.05, ch = Wd('chained', 1) - st;
    sbs('S03', st, 'briefcase on the table with a chain locked around the corpse wrist; CHAINED BRIEFCASE', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); lay(1.1, TY + 0.08, -1.0); vis(bc, true); bc.position.set(-0.7, TY, -0.2); bc.scale.setScalar(1.5); idle(chol, -1.2, 0, 1.0, t, 2, { mood: 'smug', armL: [100, 0] });
      board(bChain, lt > ch - 0.2, 0, 3.9, -0.4, 0.95, lt, ch - 0.2);
      shoot([chol], V3(0, 2.0, 6.8), V3(0, 1.8, 5.4), V3(0, 1.4, -0.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ch, 'metal_gear', { gain: 0.5 }); }
  // 04 · fake letters in the briefcase
  { const st = cut(2), lt0 = Wd('letters,', 2) - st;
    sbs('S04', st, 'open briefcase, officers stuffing fake letters inside; FAKE LETTERS', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(bc, true); bc.position.set(0, TY, -0.4); bc.scale.setScalar(2.4); vis(PS, true); PS.position.set(0.1, TY + 0.7 + Math.sin(clamp(lt / 1.6) * Math.PI) * 0.4, -0.1); PS.rotation.set(-0.2, 0, 0.1); PS.scale.setScalar(1.3);
      idle(mont, -1.4, 0, 0.9, t, 1, { mood: 'sly', armR: [80, 0] }); idle(chol, 1.4, 0, 0.9, t, 2, { mood: 'happy', armL: [80, 0] });
      board(bLet, lt > 0.5, 0, 3.9, -0.3, 0.95, lt, 0.5);
      shoot([mont, chol], V3(0, 2.0, 6.8), V3(0, 1.8, 5.4), V3(0, 1.4, -0.2), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.6, 'pop', { gain: 0.5 }); cue(st + lt0, 'tock', { gain: 0.5 }); }
  // 05 · photo, ring receipt, theater tickets
  { const st = Wd('photo', 2) - 0.1, ph = Wd('photo', 2) - st, rg = Wd('ring', 2) - st, tk = Wd('theater', 2) - st;
    sbs('S05', st, 'three papers appear one by one: fiancee photo, ring receipt, theater tickets', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true);
      [[PH, ph, bPhoto, -1.0], [PR, rg, bRing, 0], [PT, tk, bTix, 1.0]].forEach(([p, t0, b, x]) => { const k = pop(lt, t0 + 0.1, 0.4); vis(p, lt > t0); p.position.set(x * 0.7, TY + 0.9 + 0.1 * Math.sin(t * 2 + x), -0.4); p.scale.setScalar(Math.max(0.01, 0.95 * k)); p.rotation.set(-0.15, x * 0.12, x * 0.06); });
      const cur = lt > tk - 0.1 ? bTix : lt > rg - 0.1 ? bRing : bPhoto, t0 = lt > tk - 0.1 ? tk : lt > rg - 0.1 ? rg : ph; board(cur, lt > ph - 0.1, 0, 4.0, -0.4, 0.95, lt, t0 - 0.1);
      idle(mont, -1.6, 0, 1.0, t, 1, { mood: 'proud', armR: [90, 0] });
      shoot([mont], V3(0, 2.0, 7.0), V3(0, 1.8, 5.6), V3(0, 1.5, -0.3), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ph, 'pop', { gain: 0.5 }); cue(st + rg, 'coin', { gain: 0.6 }); cue(st + tk, 'pop', { gain: 0.5 }); }
  // 06 · submarine
  { const st = cut(3), sbm = Wd('submarine', 3) - st;
    sbs('S06', st, 'grey submarine surfaced on blue sea; SUBMARINE DROP', (lt, d, t, blit) => {
      resetAll(); outdoors(); vis(sb, true); sb.position.set(0, 0.0, -1); sb.rotation.set(0, 0.5, 0); sb.position.y = 0.05 + Math.sin(t * 1.6) * 0.04;
      board(bSub, lt > sbm - 0.3, 0, 3.6, -0.5, 0.95, lt, sbm - 0.3);
      shoot([], V3(0, 2.2, 11), V3(0, 1.8, 9), V3(0, 1.0, -1), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + sbm, 'bubbles', { gain: 0.6, dur: 1.2 }); }
  // 07 · body slides into the water off Spain
  { const st = Wd('off', 3) - 0.05, cs = Wd('coast', 3) - st;
    sbs('S07', st, 'the body floats on the sea toward a sandy beach in Spain; OFF THE COAST OF SPAIN', (lt, d, t, blit) => {
      resetAll(); outdoors(); sea.position.set(0, 0.06, -6); vis(snd, true); snd.position.set(0, 0.07, 6); const k = clamp(lt / d); lay(lerp(1.6, -0.2, eio(k)), 0.15 + Math.sin(t * 2) * 0.03, lerp(-2.0, 1.4, eio(k)));
      board(bSpain, lt > cs - 0.5, 0, 3.7, 0.0, 0.95, lt, cs - 0.5);
      shoot([], V3(0, 2.6, 9), V3(0, 2.0, 7.4), V3(0, 0.7, 0.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'bubbles', { gain: 0.5, dur: 1.2 }); cue(st + 0.9, 'plop', { gain: 0.6 }); }
  // 08 · spies find it
  { const st = Wd('hoping', 3) - 0.1, fd = Wd('find', 3) - st;
    sbs('S08', st, 'two beachgoers stare at the body washed ashore, shocked; SPIES FIND IT', (lt, d, t, blit) => {
      resetAll(); outdoors(); sea.position.set(0, 0.06, -4); vis(snd, true); snd.position.set(0, 0.07, 6); lay(1.0, 0.12, -0.6); idle(spy1, -0.7, 0, 0.8, t, 5, { mood: lt > fd - 0.6 ? 'shock' : 'sly', armR: [150, 0] }); idle(spy2, 0.7, 0, 1.2, t, 6, { mood: 'shock', armL: [150, 0] });
      board(bSpy, lt > fd - 0.3, 0, 3.7, 0.3, 0.95, lt, fd - 0.3);
      shoot([spy1, spy2], V3(0, 2.0, 7.2), V3(0, 1.8, 5.8), V3(0, 1.1, 0.0), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + fd, 'omg_bruh', { gain: 0.7 }); }
  // 09 · German officers read the secret papers
  { const st = cut(4), sp_ = Wd('secret', 4) - st;
    sbs('S09', st, 'two German officers read a TOP SECRET paper, grinning; SECRET PAPERS', (lt, d, t, blit) => {
      resetAll(); idle(ger1, -0.7, 0, 1.2, t, 7, { mood: 'sly', armR: [100, 0] }); idle(ger2, 0.8, 0, 1.2, t, 8, { mood: 'happy', armL: [100, 0] }); vis(PS, true); PS.position.set(0, 2.0, 1.5); PS.scale.setScalar(1.25); PS.rotation.set(0, 0, Math.sin(t * 2) * 0.05);
      board(bSecret, lt > sp_ - 0.3, 0, 3.9, 0.4, 0.95, lt, sp_ - 0.3);
      shoot([ger1, ger2], V3(0, 1.9, 7.4), V3(0, 1.8, 5.8), V3(0, 1.4, 1.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.7, 'hehehehehehehe', { gain: 0.5 }); cue(st + sp_, 'stamp', { gain: 0.6 }); }
  // 10 · map: arrows to Greece and Sardinia
  { const st = Wd('invade', 4) - 0.1, gr = Wd('Greece', 4) - st, mv = Wd('moved', 4) - st;
    sbs('S10', st, 'a map with two red arrows pointing at Greece and Sardinia; INVADE GREECE + SARDINIA then HITLER MOVED HIS TROOPS', (lt, d, t, blit) => {
      resetAll(); vis(mp, true); mp.position.set(0, 0, -1.0); mp.arrows.visible = lt > gr - 0.3; mp.x.visible = false; mp.arrows.scale.setScalar(0.9 + 0.1 * Math.sin(t * 8));
      idle(ger1, -2.0, 0, 0.6, t, 7, { mood: 'smug', armR: [60, 0] });
      board(bGreece, lt > gr - 0.3 && lt < mv - 0.1, 0, 4.9, -0.8, 0.95, lt, gr - 0.3); board(bMoved, lt > mv - 0.1, 0, 4.9, -0.8, 0.95, lt, mv - 0.1);
      shoot([ger1], V3(0, 2.4, 8.8), V3(0, 2.3, 7.2), V3(0, 2.1, -0.8), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + gr, 'pop', { gain: 0.5 }); cue(st + mv, 'zip_', { gain: 0.6 }); }
  // 11 · real target Sicily
  { const st = cut(5), tg = Wd('target', 5) - st, ld = Wd('landed', 5) - st, jl = Wd('July.', 5) - st;
    sbs('S11', st, 'same map, a big red X lands on Sicily; REAL TARGET: SICILY then LANDED IN JULY', (lt, d, t, blit) => {
      resetAll(); vis(mp, true); mp.position.set(0, 0, -1.0); mp.arrows.visible = false; mp.x.visible = lt > tg; mp.x.scale.setScalar(Math.max(0.01, pop(lt, tg, 0.3) * (1 + 0.08 * Math.sin(t * 8))));
      idle(ger1, -2.0, 0, 0.6, t, 7, { mood: lt > tg ? 'shock' : 'smug', armR: [60, 0] });
      board(bSicily, lt > tg - 0.2 && lt < ld - 0.1, 0, 4.9, -0.8, 0.95, lt, tg - 0.2); board(bJuly, lt > ld - 0.1, 0, 4.9, -0.8, 0.95, lt, ld - 0.1);
      shoot([ger1], V3(0, 2.4, 8.8), V3(0, 2.3, 7.2), V3(0, 2.1, -0.8), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + tg, 'stamp', { gain: 0.8 }); cue(st + tg + 0.1, 'boom', { gain: 0.5 }); cue(st + ld, 'cheer', { gain: 0.4 }); }
  // 12 · loop: Mo looks at the corpse
  { const st = Wd('So,', 5) - 0.1, bl = Wd('believed', 5) - st, dm = Wd('man?', 5) - st;
    sbs('S12', st, 'Mo with popcorn eyeing the body on the table suspiciously; WOULD YOU BELIEVE HIM?', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); lay(1.3, TY + 0.08, -1.0); putMo(-0.5, 0, 1.2); mo.set({ mood: lt > dm - 0.4 ? 'worried' : 'sly', blink: blink(t, 0.3) });
      board(bBelieve, lt > bl - 0.3, 0, 4.2, -0.3, 0.95, lt, bl - 0.3);
      shoot([mo], V3(0, 2.1, 8.0), V3(0, 1.9, 6.4), V3(0, 1.4, 0.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + bl, 'tock', { gain: 0.5 }); cue(st + dm, 'bruh_clip', { gain: 0.6 }); cue(st + dm + 0.4, 'faaah', { gain: 0.7 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
