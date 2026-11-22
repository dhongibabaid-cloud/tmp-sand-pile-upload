// THE ARMY TRAINED PIGEONS TO STEER MISSILES: Tall Tale+ (Project Pigeon, B. F. Skinner, 1943).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as BP from './core/pgn.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const SKIN = { body: '#8A6A4A', hat: 'bowler', hatCol: '#3A2A1E', pattern: 'plain', extra: ['glasses', 'mustache'] };
const OF1 = { body: '#9A8A5A', hat: 'cap', hatCol: '#5A4A2A', pattern: 'plain', extra: ['mustache'] };
const OF2 = { body: '#2E4E8A', hat: 'visor', hatCol: '#E8E4D8', pattern: 'plain', extra: ['glasses', 'freckles'] };
const ASS = { body: '#F4F4F4', hat: 'bun', hatCol: '#5A3A22', pattern: 'plain', extra: ['freckles', 'pencil'] };
assertDistinct([MO, SKIN, OF1, OF2, ASS], 'pigeon cast');
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
  sc.add(BP.room());
  const tbl = new THREE.Group(); bx(5, 0.14, 1.8, mat({ color: '#6A4A32' }), 0, 1.0, 0, tbl); [[-2.3, -0.8], [2.3, -0.8], [-2.3, 0.8], [2.3, 0.8]].forEach(([x, z]) => bx(0.12, 1.0, 0.12, mat({ color: '#3A3A44' }), x, 0.5, z, tbl)); tbl.position.set(0, 0, -1.0); sc.add(tbl);
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bWar = mk('WORLD WAR II', ['#2A2A33', '#F2E6CF']), bMis = mk('PIGEONS IN A MISSILE?!', ['#B5372E', '#FFFFFF']), bSk = mk('B. F. SKINNER', ['#2E4E8A', '#FFFFFF']), bPeck = mk('PECK THE TARGET', ['#B5372E', '#FFFFFF']), bGrain = mk('PECK = GRAIN', ['#B8860B', '#FFFFFF']), b3 = mk('3 PIGEON PILOTS', ['#2E6A4A', '#FFFFFF']), bTurn = mk('PECK = TURN', ['#B5372E', '#FFFFFF']), bCash = mk('$25,000', ['#2E6A2A', '#FFFFFF']), bPass = mk('PASSED THE TESTS', ['#2E6A4A', '#FFFFFF']), bCrazy = mk('TOO CRAZY', ['#6A4A32', '#F2E6CF']), bShut = mk('SHUT DOWN', ['#2A2A33', '#F2E6CF']), bYears = mk('YEARS LATER', ['#2E4E8A', '#FFFFFF']), bStill = mk('STILL PECKING PERFECTLY', ['#2E6A4A', '#FFFFFF']), bOrcon = mk('PROJECT ORCON', ['#1F3FA0', '#FFFFFF']), bElec = mk('ELECTRONICS WIN', ['#555B66', '#FFFFFF']), bTrust = mk('TRUST A PIGEON?', ['#2A2A33', '#F2E6CF']);
  const boards = [bWar, bMis, bSk, bPeck, bGrain, b3, bTurn, bCash, bPass, bCrazy, bShut, bYears, bStill, bOrcon, bElec, bTrust]; boards.forEach((b) => sc.add(b));
  const mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2), skin = person(SKIN), of1 = person(OF1), of2 = person(OF2), ass = person(ASS);
  const SP = [mo, skin, of1, of2, ass]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const ms = BP.missile(), ck = BP.cockpit(), ez = BP.easel(), ds = BP.dish(), bg = BP.bag(), cg = BP.cage(), ro = BP.rosette(), cp = BP.chip(), ship = PW.ship(0.6, '#5A5F6A');
  const P = [0, 1, 2, 3, 4, 5].map(() => BP.pigeon(1));
  const OBJ = [ms, ck, ez, ds, bg, cg, ro, cp, ship, tbl, ...P]; OBJ.forEach((o) => sc.add(o));
  const putMo = (x, y, z) => { mo.at(x, y, z); pcn.position.set(x - 0.33, y + 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, ...OBJ, ...boards].forEach((o) => vis(o, false)); };
  const idle = (p, x, y, z, t, i, o = {}) => { vis(p, true); p.at(x, y, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
  const pg = (i, x, y, z, s, ry, o = {}) => { const p = P[i]; vis(p, true); p.position.set(x, y, z); p.scale.setScalar(s); p.rotation.y = ry; if (o.peck !== undefined) p.peck(o.peck); else p.peck(0); };
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
  const TY = 1.07; // tabletop

  // 01 · wide lab: missile on the table with pigeons on top; Skinner and Mo
  { const st = 0, wr = Wd('World', 0) - st;
    sbs('S01', st, 'lab wide: missile on the table with three pigeons on it, Skinner smug, Mo with popcorn; WORLD WAR II', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(ms, true); ms.position.set(0, TY + 0.55, -1.0); ms.rotation.set(0, 0.2, 0); ms.scale.setScalar(0.75);
      [-0.7, 0.1, 0.8].forEach((x, i) => pg(i, x, TY + 0.8, -1.0, 0.5, 0.3 + i * 0.4, { peck: ((lt * 1.5 + i * 0.3) % 1) }));
      idle(skin, -1.5, 0, 0.6, t, 1, { mood: 'smug', armR: [60, 0] }); putMo(1.5, 0, 0.7); mo.set({ mood: 'happy', blink: blink(t, 0.3) });
      board(bWar, lt > wr - 0.2, 0, 4.4, -1.0, 0.95, lt, wr - 0.2);
      shoot([skin, mo], V3(0, 2.4, 10), V3(0, 2.2, 8.2), V3(0, 1.6, -0.5), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + wr, 'stamp', { gain: 0.5 }); cue(st + 1.8, 'pop', { gain: 0.4 }); }
  // 02 · close: pigeons on a missile
  { const st = Wd('pigeons', 0) - 0.1, ms_ = Wd('missile,', 0) - st;
    sbs('S02', st, 'close-up: three pigeons sitting on a missile nose, one looks at camera; PIGEONS IN A MISSILE?!', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(ms, true); ms.position.set(0.2, TY + 0.55, -1.0); ms.rotation.set(0, 0.5, 0);
      [-0.6, 0.35, 1.2].forEach((x, i) => pg(i, x, TY + 0.95 + i * 0.03, -0.8, 0.75, 0.2 + i * 0.5, { peck: (lt * 1.2 + i * 0.35) % 1 }));
      idle(skin, -1.7, 0, -0.3, t, 1, { mood: 'proud', armR: [90, 0] });
      board(bMis, lt > ms_ - 0.5, 0, 4.0, -0.4, 0.9, lt, ms_ - 0.5);
      shoot([skin], V3(0.2, 2.3, 6.4), V3(0.1, 2.2, 5.0), V3(0.2, 1.8, -0.8), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'pop', { gain: 0.5 }); cue(st + ms_ - 0.5, 'boing', { gain: 0.6 }); cue(st + ms_, 'bruh_clip', { gain: 0.5 }); }
  // 03 · Skinner intro
  { const st = cut(1), nm = Wd('B.', 1) - st;
    sbs('S03', st, 'Skinner proud, pointing at the blackboard; B. F. SKINNER', (lt, d, t, blit) => {
      resetAll(); idle(skin, 0, 0, 1.2, t, 1, { mood: lt > nm ? 'proud' : 'smug', armR: [100, 0] }); vis(ez, false);
      board(bSk, lt > nm - 0.2, 0, 3.9, 0.4, 0.9, lt, nm - 0.2);
      shoot([skin], V3(0.2, 1.9, 7), V3(0.1, 1.8, 5.4), V3(0.1, 1.5, 1.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + nm, 'tock', { gain: 0.5 }); }
  // 04 · training: pigeon pecks target on easel
  { const st = Wd('He', 1) - 0.05, pk = Wd('peck', 1) - st, d1 = Wd('and', 1) - st;
    sbs('S04', st, 'pigeon on the table pecks at a bullseye on an easel; PECK THE TARGET', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(ez, true); ez.position.set(0, TY, -1.2); ez.scale.setScalar(1.0);
      pg(0, 0, TY, -0.5, 1.3, Math.PI, { peck: (lt * 2.2) % 1 }); idle(ass, -1.3, 0, 0.8, t, 3, { mood: 'happy', armR: [70, 0] }); putMo(1.4, 0, 0.8); mo.set({ mood: 'happy', blink: blink(t, 0.3) });
      board(bPeck, lt > pk - 0.2, 0, 4.2, -0.6, 0.9, lt, pk - 0.2);
      shoot([ass, mo], V3(0, 2.3, 7.6), V3(0, 2.0, 6.0), V3(0, 1.5, -0.3), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 5; k++) cue(st + 0.9 + k * 0.45, 'tock', { gain: 0.45 }); cue(st + pk, 'pop', { gain: 0.5 }); }
  // 05 · grain reward
  { const st = Wd('and', 1) - 0.05, gr = Wd('grain.', 1) - st;
    sbs('S05', st, 'pigeon eats grain from a dish, happy; PECK = GRAIN', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(ds, true); ds.position.set(0.1, TY, 0.2); ds.scale.setScalar(1.6);
      pg(0, 0.1, TY + 0.0, -0.5, 0.95, 0.0, { peck: (lt * 3) % 1 });
      idle(skin, -1.3, 0, 0.9, t, 1, { mood: 'happy', armR: [120, 0] }); idle(ass, 1.3, 0, 0.9, t, 3, { mood: 'laugh' });
      board(bGrain, lt > gr - 0.8, 0, 4.0, -0.4, 0.9, lt, gr - 0.8);
      shoot([skin, ass], V3(0, 2.2, 6.6), V3(0, 1.9, 5.2), V3(0, 1.5, -0.2), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 6; k++) cue(st + 0.3 + k * 0.3, 'crunch', { gain: 0.35 }); cue(st + gr - 0.8, 'coin', { gain: 0.6 }); }
  // 06 · nose cone cockpit
  { const st = cut(2), th = Wd('three', 2) - st;
    sbs('S06', st, 'inside the nose cone: three pigeon pilots seen from behind, watching a screen; 3 PIGEON PILOTS', (lt, d, t, blit) => {
      resetAll(); vis(ck, true); ck.position.set(0, 0, 0); [-0.8, 0, 0.8].forEach((x, i) => pg(i, x, 0.62, -0.5, 0.7, Math.PI, { peck: lt > th ? ((lt * 1.6 + i * 0.3) % 1) : 0 }));
      board(b3, lt > th - 0.2, 0, 3.4, -0.5, 0.85, lt, th - 0.2);
      shoot([], V3(0, 2.1, 5.6), V3(0, 1.9, 4.4), V3(0, 1.4, -1.2), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + th, 'pop', { gain: 0.5 }); cue(st + th + 0.2, 'pop', { gain: 0.4 }); cue(st + th + 0.4, 'pop', { gain: 0.3 }); }
  // 07 · pecks, missile turns toward ship
  { const st = Wd('When', 2) - 0.05, mt = Wd('missile', 2) - st;
    sbs('S07', st, 'cockpit pecking, then missile curves toward a ship; PECK = TURN', (lt, d, t, blit) => {
      resetAll();
      if (lt < mt) { vis(ck, true); ck.position.set(0, 0, 0); [-0.8, 0, 0.8].forEach((x, i) => pg(i, x, 0.62, -0.5, 0.7, Math.PI, { peck: (lt * 3 + i * 0.25) % 1 })); shoot([], V3(0, 2.0, 5.2), V3(0, 1.8, 4.2), V3(0, 1.4, -1.2), null, eio(clamp(lt / d)), 40); }
      else { const k = clamp((lt - mt) / (d - mt)); vis(ms, true); const mx = lerp(-2.4, 1.8, eio(k)), my = lerp(4.2, 1.3, eio(k)); ms.position.set(mx, my, -1); ms.rotation.set(0, 0, -Math.atan2(4.2 - 1.3, 4.2) * eio(k) * 0.9 - 0.05); vis(ship, true); ship.position.set(2.0, 0.35, -1); ship.rotation.y = 0.5; ship.scale.setScalar(0.5);
        board(bTurn, true, 0, 6.3, -1.2, 0.95, lt, mt - 0.1); shoot([], V3(0, 2.8, 15), V3(0, 2.8, 14), V3(0, 2.4, -1), null, 0.5, 44); }
      blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 6; k++) cue(st + 0.2 + k * 0.28, 'tock', { gain: 0.4 }); cue(st + mt, 'zip_', { gain: 0.6 }); cue(st + mt + 0.6, 'whoosh', { gain: 0.5 }); }
  // 08 · cash bag
  { const st = cut(3), cs = Wd('twenty', 3) - st;
    sbs('S08', st, 'officer hands Skinner a bag of money; $25,000', (lt, d, t, blit) => {
      resetAll(); idle(of1, 0.95, 0, 1.2, t, 2, { mood: 'smug', armR: [90, 0] }); idle(skin, -0.95, 0, 1.2, t, 1, { mood: 'happy', armL: [90, 0] }); vis(bg, true); bg.position.set(0.0, 0.5 + Math.sin(clamp(lt / 1.2) * Math.PI) * 0.2, 1.9); bg.scale.setScalar(0.9);
      board(bCash, lt > cs - 0.2, 0, 3.9, 0.4, 0.95, lt, cs - 0.2);
      shoot([of1, skin], V3(0, 1.9, 7.4), V3(0, 1.8, 5.8), V3(0, 1.4, 1.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + cs, 'coin', { gain: 0.8 }); cue(st + cs + 0.3, 'coin', { gain: 0.6 }); }
  // 09 · passed the tests
  { const st = Wd('birds', 3) - 0.1, ps = Wd('passed', 3) - st;
    sbs('S09', st, 'pigeons wearing a gold rosette, proud, lined up on a table; PASSED THE TESTS', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); [-1.0, 0, 1.0].forEach((x, i) => pg(i, x, TY, -0.8, 0.8, 0.1 * (i - 1), { peck: lt > ps ? ((lt * 1.4 + i * 0.3) % 1) : 0 })); vis(ro, true); ro.position.set(0.0, TY + 1.15, -0.4); ro.scale.setScalar(1.3); ro.rotation.y = Math.sin(t * 2) * 0.3;
      idle(ass, -2.0, 0, 0.0, t, 3, { mood: 'proud', armR: [80, 0] });
      board(bPass, lt > ps - 0.2, 0, 3.9, -0.4, 0.9, lt, ps - 0.2);
      shoot([ass], V3(0, 2.2, 6.6), V3(0, 2.0, 5.2), V3(0, 1.6, -0.6), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ps, 'cheer', { gain: 0.5 }); cue(st + ps + 0.3, 'pop', { gain: 0.5 }); }
  // 10 · too crazy, shut down
  { const st = Wd('but', 3) - 0.1, cz = Wd('crazy,', 3) - st, sd = Wd('shut', 3) - st;
    sbs('S10', st, 'two officers shaking their heads, one facepalms; TOO CRAZY then SHUT DOWN', (lt, d, t, blit) => {
      resetAll(); idle(of1, -0.85, 0, 1.2, t, 2, { mood: lt > cz ? 'angry' : 'worried', armR: [20, 0], armL: [150, 0] }); idle(of2, 0.85, 0, 1.2, t, 4, { mood: lt > cz ? 'laugh' : 'smug', armL: [100, 0] });
      board(bCrazy, lt > cz - 0.3 && lt < sd, 0, 3.9, 0.5, 0.95, lt, cz - 0.3); board(bShut, lt > sd - 0.1, 0, 3.9, 0.5, 0.95, lt, sd - 0.1);
      shoot([of1, of2], V3(0, 1.9, 7.4), V3(0, 1.8, 5.8), V3(0, 1.4, 1.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + cz - 0.3, 'bruh', { gain: 0.5 }); cue(st + sd, 'slam', { gain: 0.7 }); cue(st + sd + 0.2, 'trombone', { gain: 0.5 }); }
  // 11 · years later, still perfect
  { const st = cut(4), yr = Wd('years', 4) - st;
    sbs('S11', st, 'Skinner proudly beside a cage of pigeons; STILL PECKING PERFECTLY', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(cg, true); cg.position.set(-1.0, TY, -0.2); [0, 1].forEach((i) => pg(i, -1.5 + i * 1.0, TY + 0.08, -0.2, 0.6, 0.1, { peck: (lt * 2 + i * 0.4) % 1 })); vis(ez, true); ez.position.set(1.7, TY, -1.2); ez.scale.setScalar(0.8); pg(2, 1.7, TY, 0.0, 0.6, Math.PI, { peck: (lt * 2.4) % 1 });
      idle(skin, 0, 0, 1.5, t, 1, { mood: 'proud', armR: [40, 0] });
      board(bYears, lt > yr - 1.0 && lt < yr + 0.6, 0, 4.2, -0.4, 0.9, lt, yr - 1.0); board(bStill, lt > yr + 0.5, 0, 4.2, -0.4, 0.95, lt, yr + 0.5);
      shoot([skin], V3(0, 2.4, 7.4), V3(0, 2.1, 5.8), V3(0, 1.6, 0.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + yr, 'tock', { gain: 0.5 }); for (let k = 0; k < 4; k++) cue(st + yr + 0.5 + k * 0.4, 'tock', { gain: 0.35 }); }
  // 12 · Navy revives: Project Orcon
  { const st = cut(5), oc = Wd('Project', 5) - st;
    sbs('S12', st, 'naval officer salutes beside the missile on a stand; PROJECT ORCON', (lt, d, t, blit) => {
      resetAll(); vis(ms, true); ms.position.set(0.2, 1.6, -0.5); ms.rotation.set(0, 0.5, 0); ms.scale.setScalar(0.6); idle(of2, -0.9, 0, 0.9, t, 4, { mood: 'proud', armR: [165, 0] }); pg(0, 0.5, 2.05, -0.5, 0.45, 0.3, { peck: (lt * 1.5) % 1 });
      board(bOrcon, lt > oc - 0.2, 0, 4.2, -0.2, 0.95, lt, oc - 0.2);
      shoot([of2], V3(0, 2.4, 7.8), V3(0, 2.2, 6.2), V3(0, 1.6, 0.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + oc, 'stamp', { gain: 0.6 }); cue(st + oc + 0.2, 'cheer', { gain: 0.35 }); }
  // 13 · electronics replace the birds
  { const st = Wd('until', 5) - 0.1, el = Wd('electronics', 5) - st, bd = Wd('birds.', 5) - st;
    sbs('S13', st, 'a big circuit chip on the table, pigeon waves goodbye with a tiny suitcase; ELECTRONICS WIN', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(cp, true); cp.position.set(0.1, TY + 0.05, -0.3); cp.scale.setScalar(2.4); cp.rotation.y = t * 0.8; pg(0, 0.9 + Math.max(0, lt - bd) * 0.6, TY, 0.2, 0.7, -1.2 + Math.PI / 2 * 0, { peck: 0 }); P[0].rotation.y = 1.1;
      idle(of1, -1.0, 0, 0.9, t, 2, { mood: 'laugh', armR: [100, 0] });
      board(bElec, lt > el - 0.3, 0, 3.9, -0.4, 0.9, lt, el - 0.3);
      shoot([of1], V3(0, 2.3, 6.6), V3(0, 2.1, 5.2), V3(0, 1.6, -0.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + el, 'switch', { gain: 0.5 }); cue(st + bd, 'trombone', { gain: 0.5 }); }
  // 14 · loop: Mo and a pigeon at the missile
  { const st = Wd('So,', 5) - 0.1, tr = Wd('trust', 5) - st, mi = Wd('missile?', 5) - st;
    sbs('S14', st, 'Mo with popcorn eyeing a pigeon sitting on a missile; TRUST A PIGEON?', (lt, d, t, blit) => {
      resetAll(); vis(tbl, true); vis(ms, true); ms.position.set(0, TY + 0.55, -0.8); ms.rotation.set(0, 0.3, 0); pg(0, 0.0, TY + 1.0, -0.8, 0.85, 0.2, { peck: (lt * 1.3) % 1 }); P[0].peck((lt * 2.5) % 1);
      putMo(0, 0, 1.6); mo.set({ mood: lt > mi - 0.4 ? 'worried' : 'sly', blink: blink(t, 0.3) });
      board(bTrust, lt > tr - 0.3, 0, 4.4, -0.4, 0.95, lt, tr - 0.3);
      shoot([mo], V3(0, 2.2, 8.2), V3(0, 2.0, 6.6), V3(0, 1.6, 0.4), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + tr - 0.2, 'tock', { gain: 0.5 }); cue(st + mi, 'bruh_clip', { gain: 0.6 }); cue(st + mi + 0.4, 'faaah', { gain: 0.7 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
