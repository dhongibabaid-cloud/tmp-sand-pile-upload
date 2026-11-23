// IF YOU SAVED AN ALIEN AND BECAME FRIENDS: Tall Tale+ what-if.
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as BP from './core/aln.js';
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

import { dog as makeDog } from './core/rome.js';
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.16, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);

  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: true, flowers: true });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight); const grass = []; sc.children.forEach((c) => { if (c.geometry && c.geometry.type === 'CircleGeometry') grass.push(c); });
  const hs = BP.house(), hm = BP.home(), cch = BP.couch(), sau = BP.saucer(), al = BP.alien(1), apl = BP.apple(), pzz = BP.pizza(), clk = BP.clock(), glb = BP.globe(), trm = BP.tramp(), blk = BP.blanket(), rck = BP.rock(), rtr = BP.router(), hrt = BP.heart(), esl = BP.easel(), dg = makeDog();
  const stb = new THREE.Group(); bx(1.8, 0.1, 1.0, mat({ color: '#7A5A3A' }), 0, 0.8, 0, stb); [[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].forEach(([x, z]) => bx(0.08, 0.8, 0.08, mat({ color: '#3A3A44' }), x, 0.4, z, stb));
  const OBJ = [hs, hm, cch, sau, al, apl, pzz, clk, glb, trm, blk, rck, rtr, hrt, esl, dg, stb]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('crash', 'ALIEN CRASH LANDED', '#B5372E'); bdc('roof', 'ON YOUR ROOF', '#2E4E8A'); bdc('stare', 'STARING AT YOU', '#2E6A4A'); bdc('window', 'THROUGH YOUR WINDOW', '#6A4A32'); bdc('scream', "DON'T SCREAM", '#B5372E'); bdc('snack', 'OFFER A SNACK', '#B8860B'); bdc('pizza', 'PIZZA = RISKY', '#B5372E'); bdc('apple', 'START WITH AN APPLE', '#2E6A4A'); bdc('teach', 'TEACH IT ONE WORD', '#2E4E8A'); bdc('hello', 'HELLOOO', '#B8860B'); bdc('am3', 'LOUDLY AT 3 A.M.', '#2A2A33'); bdc('earth', 'SHOW IT EARTH', '#2E6A9A'); bdc('dogs', 'DOGS', '#8A5A2E'); bdc('tramp', 'TRAMPOLINES', '#2E4E8A'); bdc('inv', "HUMANITY'S GREATEST INVENTION", '#B5472E'); bdc('blanket', 'THE BLANKET', '#C9603F'); bdc('trust', 'IT TRUSTS YOU', '#E0457B'); bdc('gift', 'A GIFT', '#B8860B'); bdc('rock', 'GLOWING ROCK', '#1B8FA0'); bdc('wifi', 'WIFI FIXED FOREVER', '#1B9A3A'); bdc('repaired', 'SHIP REPAIRED', '#555B66'); bdc('leave', 'IT HAS TO LEAVE', '#2A2A33'); bdc('hug', 'GOODBYE HUG', '#E0457B'); bdc('first', 'ITS FIRST WORD...', '#2E4E8A'); bdc('friend', 'FRIEND.', '#E0457B'); bdc('letgo', 'WOULD YOU LET IT GO?', '#2A2A33');
  const boards = Object.values(BD);
  const mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2); sc.add(mo.group); sc.add(pcn);
  const putMo = (x, y, z, o = {}) => { mo.at(x, y, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], ...o }); pcn.position.set(x - 0.33, y + 0.82, z + 0.2); vis(pcn, !o.noPop); vis(mo, true); };
  const resetAll = () => { [mo, pcn, ...OBJ, ...boards].forEach((o) => vis(o, false)); worldKids.forEach((g) => (g.visible = false)); al.pose(); al.rotation.set(0, 0, 0); al.scale.setScalar(1); };
  const ext = () => { vis(hs, true); worldKids.forEach((g) => (g.visible = true)); vis(hm, false); };
  const inn = () => { vis(hm, true); };
  const alAt = (x, y, z, s = 1, ry = 0) => { vis(al, true); al.position.set(x, y, z); al.scale.setScalar(s); al.rotation.y = ry; };
  const shoot = (people, from, to, at, k, fov) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    cam.position.copy(mix(from, to, k)); cam.lookAt(at); cam.updateMatrixWorld(true);
    boards.forEach((b) => { if (!b.visible) return; const dist = cam.position.distanceTo(b.position), hh = dist * Math.tan(cam.fov * Math.PI / 360), hw = hh * 0.5625, wd = b.geometry.parameters.width, sMax = (1.7 * hw * 0.88) / wd; if (b.scale.x > sMax) b.scale.setScalar(sMax);
      const n = b.position.clone().project(cam), hn = (wd * b.scale.x / 2) / hw; const ov = Math.abs(n.x) + hn - 0.92; if (ov > 0) b.position.x -= Math.sign(n.x || 1) * ov * hw; if (n.y > 0.72) b.position.y -= (n.y - 0.72) * hh; });
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(at) });
  };
  const board = (key, on, x, y, z, s, lt, t0) => { const b = BD[key]; vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  // shot(): id, start, end, boardKey, boardWorldPos [x,y,z], setup(lt,d,t,k), cam [from,to,at,fov], sfx [[dt,name,gain]]
  const shot = (id, st, en, key, bp, setup, cm, sfx = [], note = '') => {
    add({ id, at: st, note: note || id, draw: (lt, d, t, blit) => {
      resetAll(); const k = eio(clamp(lt / d)); const ppl = setup(lt, d, t, k) || [];
      board(key, true, bp[0], bp[1], bp[2], bp[3] || 0.95, lt, 0.12);
      shoot(ppl, V(...cm[0]), V(...cm[1]), V(...cm[2]), k, cm[3]); blit(); } });
    sfx.forEach(([dt, n, g]) => cue(st + dt, n, { gain: g ?? 0.5 }));
  };
  const heartAt = (x, y, z, t, s = 1) => { vis(hrt, true); hrt.position.set(x, y + (t % 1.2) * 0.5, z); hrt.scale.setScalar(s * (0.6 + 0.4 * Math.sin(t * 6))); };

  // ---- LINE 0
  shot('S01', 0, 1.5, 'crash', [0, 7.6, 0], (lt, d, t, k) => { ext(); vis(sau, true); const e = eio(clamp(lt / 1.5)); sau.position.set(lerp(-2.6, 0, e), lerp(9, 5.7, e), 0); sau.rotation.set(0, lt * 3, lerp(-0.5, 0.15, e)); sau.smoke.forEach((s, i) => { s.visible = true; s.position.y = 1.2 + i * 0.5 + lt; }); return []; }, [[0, 4.5, 13], [0, 4.5, 11], [0, 5.2, 0], 46], [[0, 'whoosh', 0.5], [1.25, 'slam', 0.7]]);
  shot('S02', 1.5, 2.55, 'roof', [0, 8.6, 0], (lt, d, t) => { ext(); vis(sau, true); sau.position.set(0, 5.75 + Math.sin(t * 20) * 0.03, 0); sau.rotation.set(0, 0.6, 0.15); sau.smoke.forEach((s, i) => { s.position.y = 1.2 + i * 0.5 + (t * 0.8) % 1; s.scale.setScalar(1 + ((t * 0.8) % 1) * 0.4); }); return []; }, [[1, 6.5, 11], [0, 6.2, 9], [0, 5.5, 0], 44], [[0, 'boom', 0.6], [0.5, 'klonk', 0.6]]);
  shot('S03', 2.55, 3.95, 'stare', [1.4, 4.0, 3], (lt, d, t, k) => { ext(); alAt(1.6, 0.0, 3.0, 1.1, 0); al.pose({ tilt: Math.sin(t * 4) * 0.15, nod: -0.2 }); return []; }, [[1.6, 2.1, 7.2], [1.6, 2.0, 5.2], [1.6, 1.9, 2.8], 40], [[0, 'pop', 0.5], [0.8, 'bruh_clip', 0.5]]);
  shot('S04', 3.95, 4.85, 'window', [0, 5.9, -2.0], (lt, d, t) => { inn(); vis(cch, true); cch.position.set(0, 0, -2.4); alAt(0, 2.2, -4.15, 1.0, 0); al.pose({ aL: 1.6, aR: -1.6, tilt: Math.sin(t * 6) * 0.1 }); putMo(-0.3, 0, -0.7, { mood: 'shock', blink: blink(t, 0.3) }); return [mo]; }, [[0, 2.4, 6.6], [0, 2.3, 5.4], [0, 2.4, -2], 44], [[0, 'omg_bruh', 0.6]]);
  // ---- LINE 1
  shot('S05', 4.85, 5.6, 'scream', [0, 4.9, -1.2], (lt, d, t) => { inn(); vis(cch, true); cch.position.set(0, 0, -2.4); alAt(1.2, 0, -2.8, 1.0, -0.3); al.pose({ aL: 0.4, aR: -0.4 }); putMo(-0.6, 0, -0.5, { mood: 'shock', armR: [150, 0], blink: 0 }); return [mo]; }, [[0, 2.2, 6.0], [0, 2.1, 5.0], [0.3, 1.7, -1.0], 44], [[0, 'shocked', 0.6]]);
  shot('S06', 5.6, 6.7, 'snack', [0, 4.4, -0.6], (lt, d, t) => { inn(); vis(stb, true); stb.position.set(0, 0, -0.5); vis(pzz, true); pzz.position.set(-0.4, 0.88, -0.4); vis(apl, true); apl.position.set(0.4, 0.86, -0.4); alAt(1.5, 0, -1.3, 0.9, -0.5); al.pose({ aL: 0.9, tilt: 0.2 }); putMo(-1.4, 0, 0.0, { mood: 'happy', armR: [80, 0] }); return [mo]; }, [[0, 2.2, 6.4], [0, 2.0, 5.2], [0, 1.4, -0.4], 42], [[0, 'whoosh', 0.3], [0.5, 'pop', 0.5]]);
  shot('S07', 6.7, 8.4, 'pizza', [0, 3.6, -0.2], (lt, d, t, k) => { inn(); vis(stb, true); stb.position.set(0, 0, -0.5); vis(pzz, true); pzz.position.set(0, 0.9 + 0.1 * Math.sin(t * 3), -0.4); pzz.scale.setScalar(1.3); alAt(0.2, 0, -0.9, 1.0, 0); al.pose({ nod: 0.4 + Math.sin(t * 6) * 0.05, aL: 0.5, aR: -0.5, tilt: lt > 0.9 ? Math.sin(t * 14) * 0.2 : 0 }); return []; }, [[0, 1.8, 5.2], [0, 1.9, 4.2], [0, 1.5, -0.8], 42], [[0, 'whoosh', 0.3], [0.7, 'bruh', 0.5]]);
  shot('S08', 8.4, 9.05, 'apple', [0, 3.9, -0.3], (lt, d, t) => { inn(); alAt(0, 0, -0.8, 1.0, 0); al.pose({ aL: 0.2, aR: -1.0, xR: -0.9 }); vis(apl, true); apl.position.set(0.15, 1.45 - lt * 0.1, -0.2); apl.scale.setScalar(0.8); heartAt(0.4, 2.4, -0.5, t); return []; }, [[0, 1.8, 5.0], [0, 1.8, 4.0], [0, 1.6, -0.6], 42], [[0, 'crunch', 0.7], [0.3, 'crunch', 0.6]]);
  // ---- LINE 2
  shot('S09', 9.05, 10.55, 'teach', [0, 4.9, -1.2], (lt, d, t) => { inn(); vis(esl, true); esl.position.set(0.1, 0, -2.2); alAt(1.5, 0, -0.8, 0.9, -0.4); al.pose({ tilt: 0.2 }); putMo(-1.4, 0, -0.5, { mood: 'happy', armR: [100, 0] }); return [mo]; }, [[0, 2.4, 7.2], [0, 2.2, 5.8], [0, 1.7, -1.0], 42], [[0, 'whoosh', 0.3], [0.5, 'tock', 0.6]]);
  shot('S10', 10.55, 12.5, 'hello', [0, 3.6, -0.6], (lt, d, t) => { inn(); alAt(0.55, 0, -0.5, 0.95, -0.3); al.pose({ nod: 0.15 * Math.sin(t * 7), tilt: Math.sin(t * 3) * 0.1, aL: 0.6, aR: -0.6 }); putMo(-0.55, 0, -0.2, { mood: 'laugh', armR: [70, 0], blink: blink(t, 0.2) }); return [mo]; }, [[0, 1.9, 5.6], [0, 1.8, 4.6], [0, 1.4, -0.4], 42], [[0, 'whoosh', 0.3], [0.3, 'hehehehehehehe', 0.4], [1.2, 'pop', 0.5]]);
  shot('S11', 12.5, 14.35, 'am3', [0, 3.6, -0.6], (lt, d, t) => { inn(); vis(stb, true); stb.position.set(0, 0, -0.5); vis(clk, true); clk.position.set(-0.4, 0.86, -0.5); clk.scale.setScalar(1.1); alAt(0.5, 0, -0.1, 1.15, -0.2); al.pose({ aL: 1.4, aR: -1.4, nod: Math.sin(t * 12) * 0.05 }); putMo(-1.0, 0, -0.1, { mood: 'shock', armL: [120, 0], blink: 0, noPop: true }); return [mo]; }, [[0, 2.0, 6.0], [0, 1.9, 4.8], [0, 1.6, -0.1], 44], [[0, 'whoosh', 0.3], [0.2, 'aaaaaa', 0.6], [1.0, 'omg_bruh', 0.5]]);
  // ---- LINE 3
  shot('S12', 14.35, 15.5, 'earth', [0, 4.0, -0.6], (lt, d, t) => { inn(); vis(glb, true); glb.position.set(0, 0, -0.6); glb.ball.rotation.y = t * 1.2; alAt(1.2, 0, -0.2, 0.95, -0.5); al.pose({ aL: 1.5, tilt: 0.2 }); putMo(-1.3, 0, 0.0, { mood: 'proud', armR: [90, 0] }); return [mo]; }, [[0, 2.0, 6.2], [0, 1.9, 5.0], [0, 1.6, -0.4], 44], [[0, 'whoosh', 0.3], [0.3, 'pop', 0.5]]);
  shot('S13', 15.5, 15.95, 'dogs', [0, 3.5, -0.3], (lt, d, t) => { inn(); alAt(-0.3, 0, -0.3, 1.0, 0.3); al.pose({ aL: 0.9, aR: -0.5, tilt: 0.2 }); vis(dg, true); dg.position.set(0.7, 0, 0.2); dg.scale.setScalar(2); dg.rotation.y = -2.6; dg.tail.rotation.y = Math.sin(t * 25) * 0.6; heartAt(0.1, 2.3, 0, t, 0.8); return []; }, [[0, 1.7, 4.6], [0, 1.7, 4.0], [0.2, 1.4, 0], 42], [[0, 'pop', 0.6], [0.2, 'chicken_tree', 0.5]]);
  shot('S14', 15.95, 16.55, 'tramp', [0, 5.4, -0.4], (lt, d, t) => { inn(); vis(trm, true); trm.position.set(0, 0, -0.4); const y = 0.8 + Math.abs(Math.sin(lt * 5.5)) * 2.4; alAt(0, y, -0.4, 0.95, 0); al.pose({ aL: 2.4, aR: -2.4 }); return []; }, [[0, 2.2, 6.4], [0, 2.4, 5.6], [0, 2.4, -0.4], 46], [[0, 'boing', 0.7], [0.3, 'boing', 0.6]]);
  shot('S15', 16.55, 18.3, 'inv', [0, 4.6, -1.0], (lt, d, t) => { inn(); vis(cch, true); cch.position.set(0, 0, -2.4); vis(blk, true); blk.position.set(0.8, 0.8 + 0.1 * Math.sin(t * 4), -0.4); blk.scale.setScalar(0.9); putMo(-0.9, 0, -0.1, { mood: 'proud', armR: [110, 0] }); alAt(1.9, 0, -1.4, 0.9, -0.6); al.pose({ aL: 1.4, aR: -1.4 }); return [mo]; }, [[0, 2.4, 7.0], [0, 2.2, 5.6], [0, 1.6, -0.6], 42], [[0, 'whoosh', 0.3], [0.5, 'ohhhhhh', 0.5]]);
  shot('S16', 18.3, 19.25, 'blanket', [0, 3.8, -0.6], (lt, d, t) => { inn(); vis(blk, true); blk.position.set(0, 0, -0.6); blk.scale.setScalar(1.15); alAt(0, 0.1, -0.5, 1.0, 0); al.pose({ aL: 0.1, aR: -0.1, tilt: 0.1 }); al.scale.set(0.95, 0.6, 0.95); heartAt(1.1, 1.4, -0.2, t, 0.8); return []; }, [[0, 1.8, 5.2], [0, 1.8, 4.4], [0, 1.4, -0.6], 42], [[0, 'pop', 0.6], [0.3, 'thats_why_hes_the_goat', 0.5]]);
  // ---- LINE 4
  shot('S17', 19.25, 20.6, 'trust', [0, 4.9, -1.2], (lt, d, t) => { inn(); vis(cch, true); cch.position.set(0, 0, -2.4); putMo(-0.7, 0.35, -2.2, { mood: 'happy', blink: blink(t, 0.3) }); alAt(0.7, 0.35, -2.2, 0.8, -0.2); al.pose({ tilt: -0.25, aL: 0.3, aR: -0.3 }); heartAt(0.0, 2.5, -2.0, t, 1.2); return [mo]; }, [[0, 2.2, 6.0], [0, 2.1, 5.0], [0, 1.6, -2.2], 44], [[0, 'whoosh', 0.3], [0.4, 'pop', 0.5]]);
  shot('S18', 20.6, 21.8, 'gift', [0, 4.0, -0.4], (lt, d, t) => { inn(); alAt(0.5, 0, -0.4, 1.0, -0.2); al.pose({ aL: 0.6, aR: -0.6, xL: -1.3, xR: -1.3 }); vis(rck, true); rck.position.set(0.0, 0.85 + lt * 0.08, 0.15); rck.scale.setScalar(0.9); putMo(-1.2, 0, 0.1, { mood: 'shock', armR: [110, 0] }); return [mo]; }, [[0, 1.9, 5.6], [0, 1.8, 4.6], [0, 1.5, -0.2], 42], [[0, 'pop', 0.5], [0.4, 'coin', 0.7]]);
  shot('S19', 21.8, 23.2, 'rock', [0, 3.5, 0.0], (lt, d, t, k) => { inn(); vis(stb, true); stb.position.set(0, 0, 0); vis(rck, true); rck.position.set(0, 0.8, 0); rck.scale.setScalar(1.4); rck.rock.rotation.y = t * 1.5; rck.light.intensity = 1.5 + Math.sin(t * 6) * 0.4; return []; }, [[0, 1.8, 3.8], [0, 1.4, 2.6], [0, 1.2, 0], 40], [[0, 'whoosh', 0.3], [0.5, 'ohhhhhh', 0.5]]);
  shot('S20', 23.2, 24.4, 'wifi', [0, 3.9, -0.2], (lt, d, t) => { inn(); vis(stb, true); stb.position.set(0, 0, 0); vis(rtr, true); rtr.position.set(0.0, 0.85, 0); rtr.scale.setScalar(1.2); vis(rck, true); rck.position.set(0.9, 0.85, 0.1); putMo(-1.2, 0, 0.3, { mood: 'laugh', armR: [150, 0], blink: blink(t, 0.3) }); return [mo]; }, [[0, 1.9, 5.4], [0, 1.9, 4.6], [0, 1.6, 0], 42], [[0, 'coin', 0.7], [0.3, 'cheer', 0.5]]);
  // ---- LINE 5
  shot('S21', 24.4, 26.4, 'repaired', [0, 8.4, 0], (lt, d, t) => { ext(); vis(sau, true); sau.position.set(0, 5.75 + Math.sin(t * 6) * 0.06, 0); sau.rotation.set(0, t * 2.5, 0); sau.smoke.forEach((s) => (s.visible = false)); vis(sau, true); return []; }, [[-4, 6.5, 12], [3, 6.0, 10], [0, 5.5, 0], 44], [[0, 'switch', 0.6], [1.5, 'whoosh', 0.5]]);
  shot('S22', 26.4, 28.05, 'hug', [0, 4.6, -0.6], (lt, d, t) => { inn(); putMo(-0.35, 0, -0.5, { mood: 'sad', blink: blink(t, 0.3), armL: [120, 0], armR: [120, 0], noPop: true }); alAt(0.45, 0, -0.5, 0.95, -0.3); al.pose({ aL: -0.8, aR: 0.8, tilt: -0.2 }); heartAt(1.0, 1.0, -0.5, t, 0.9); return [mo]; }, [[0, 2.0, 6.0], [0, 1.9, 4.8], [0, 1.6, -0.5], 44], [[0, 'whoosh', 0.3], [0.5, 'pop', 0.5]]);
  shot('S23', 28.05, 29.75, 'first', [0, 3.5, 0.2], (lt, d, t) => { inn(); alAt(0, -0.4, -0.4, 1.9, 0); al.pose({ aL: 0.3, aR: -0.3, tilt: 0.1 + Math.sin(t * 3) * 0.05 }); if (lt > 1.15) { BD.first.visible = false; board('friend', true, 0, 3.6, 0.2, 1.0, lt, 1.15); } return []; }, [[0, 2.7, 3.6], [0, 2.7, 2.9], [0, 2.6, -0.4], 38], [[0, 'whoosh', 0.3], [1.2, 'faaah', 0.5]]);
  shot('S24', 29.75, 33.1, 'letgo', [0, 8.6, 0], (lt, d, t, k) => { ext(); vis(sau, true); const e = eio(clamp(lt / 3)); sau.position.set(lerp(0, 4, e), lerp(5.75, 14, e), lerp(0, -8, e)); sau.rotation.set(0, lt * 3, 0.1); sau.scale.setScalar(lerp(1, 0.5, e)); sau.smoke.forEach((s) => (s.visible = false)); putMo(-1.0, 0, 6.5, { mood: 'sad', armR: [160 + Math.sin(t * 8) * 15, 0], blink: blink(t, 0.3) }); return [mo]; }, [[0, 2.2, 13.5], [0, 2.6, 13.5], [0.2, 3.6, 1.0], 46], [[0, 'whoosh', 0.5], [1.0, 'bruh_clip', 0.5], [1.5, 'faaah', 0.7]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
