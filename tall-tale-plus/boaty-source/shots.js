// THE INTERNET NAMED A SHIP BOATY MCBOATFACE: Tall Tale+ goofy (2016).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as BP from './core/ocn.js';
import * as TL from './core/tol.js';
import * as BT from './core/bty.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);
const OFF = { body: '#2A2A33', hat: 'tophat', hatCol: '#111111', pattern: 'plain', extra: ['mustache', 'monocle'] };
const NET1 = { body: '#E2663C', hat: 'cap', hatCol: '#222222', pattern: 'stripes', patCol: '#A8401F', extra: ['freckles'] };
const NET2 = { body: '#8A4AB5', hat: 'beanie', hatCol: '#F2E6CF', pattern: 'plain', extra: ['glasses'] };
const NET3 = { body: '#2E9A6A', hat: 'visor', hatCol: '#F2E6CF', pattern: 'plain', extra: ['blush', 'mustache'] };
const ATT = { body: '#C9B27A', hat: 'bun', hatCol: '#F4F4F4', pattern: 'plain', extra: ['glasses'] };
const SCI = { body: '#F4F4F4', hat: 'boater', hatCol: '#E2D08A', pattern: 'plain', extra: ['glasses', 'freckles'] };
assertDistinct([MO, OFF, NET1, NET2, NET3, ATT, SCI], 'boaty cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; };
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const oc = BP.ocean(), wc = BP.whitecaps(), shp = PW.ship(1.6, '#B5372E'), sub = BT.sub(0.8), cht = BT.chart(), bal = BT.ballots(), pen = BT.penguin(1.1), lap = [BT.laptop(), BT.laptop(), BT.laptop()], deep = BT.deepblue(), ice = BT.iceland(), mug = TL.stateMap();
  const OBJ = [oc, wc, shp, sub, cht, bal, pen, ...lap, deep, ice]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('brit', 'BRITAIN ASKS...', '#2E3F8A'); bdc('name', 'NAME OUR SHIP!', '#2E6A9A'); bdc('mil', '$300 MILLION', '#2E6A4A'); bdc('sci', 'RESEARCH SHIP', '#2A2A33'); bdc('wait', 'UH OH', '#B8860B'); bdc('net', 'THE INTERNET', '#8A4AB5'); bdc('boaty', 'BOATY MCBOATFACE!', '#F28C28');
  bdc('votes', '124,000 VOTES', '#2E6A4A'); bdc('poll', 'LANDSLIDE', '#B5372E'); bdc('x10', '10x MORE', '#F28C28'); bdc('david', 'ATTENBOROUGH: 11,000', '#6A707A'); bdc('sad', 'OOF', '#6A707A'); bdc('win', 'WINNER!', '#2E6A4A');
  bdc('panic', 'PANIC!!!', '#B5372E'); bdc('rej', 'REJECTED', '#B5372E'); bdc('rrs', 'RRS SIR DAVID ATTENBOROUGH', '#2A2A33');
  bdc('rev', 'BOATY GETS REVENGE', '#F28C28'); bdc('give', 'THE NAME GOES TO...', '#2E6A9A'); bdc('tiny', 'A TINY SUBMARINE', '#F5C518'); bdc('dive', 'DIVING DEEP', '#1B6FA8'); bdc('ant', 'ANTARCTICA', '#2E6A9A');
  bdc('moral', 'MORAL:', '#2A2A33'); bdc('never', 'NEVER', '#B5372E'); bdc('any', 'LET THE INTERNET NAME ANYTHING', '#F28C28');
  const boards = Object.values(BD);
  const off = person(OFF), n1 = person(NET1), n2 = person(NET2), n3 = person(NET3), att = person(ATT), sci = person(SCI), mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const SP = [off, n1, n2, n3, att, sci, mo]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
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
  const sea = (t, sh = true) => { vis(oc, true); vis(wc, true); wc.update(t); if (sh) { put(shp, 0, 0.05 + Math.sin(t * 1.6) * 0.06, -1.2); shp.rotation.z = Math.sin(t * 1.3) * 0.04; } };
  const lapOn = (t, xs) => lap.forEach((l, i) => { put(l, xs[i], 0.0, 0.6); });
  // LINE 0 (0.30-7.36)
  shot('B01', 0, 1.4, 'brit', [0, 4.8, 0], (lt, d, t) => { ext(); stand(off, 0, t, 0, { mood: 'proud', armR: [165 + Math.sin(t * 9) * 8, 0] }); return [off]; }, [[0, 2.0, 6.0], [0, 2.0, 5.0], [0, 1.6, 0], 46], [[0.1, 'whoosh', 0.35]]);
  shot('B02', 1.4, 2.7, 'name', [0, 4.8, 0], (lt, d, t) => { ext(); put(cht, 0, 0, -1.2); cht.set(0.05, 0.05); stand(n1, -1.0, t, 1, { mood: 'laugh', armL: [150 + Math.sin(t * 10) * 10, 0] }); stand(n2, 1.0, t, 2, { mood: 'happy', armR: [150, 0] }); return [n1, n2]; }, [[0, 2.0, 7.0], [0, 1.9, 6.0], [0, 1.6, 0], 46], [[0.2, 'pop', 0.4]]);
  shot('B03', 2.7, 3.65, 'mil', [0, 4.6, 0], (lt, d, t) => { sea(t); shp.scale.setScalar(1.0 + lt * 0.2); return []; }, [[0, 3.0, 11], [0, 2.8, 9.5], [0, 1.6, -1], 44], [[0.1, 'coin', 0.4]]);
  shot('B04', 3.65, 4.65, 'sci', [0, 4.6, 0], (lt, d, t) => { ext(); stand(sci, 0, t, 5, { mood: 'proud', armL: [150, 0], armR: [20, 0] }); stand(att, 1.2, t, 6, { mood: 'happy' }); put(pcn, -9, 0, 0); return [sci, att]; }, [[0, 2.0, 6.2], [0, 2.0, 5.4], [0, 1.6, 0], 46]);
  shot('B05', 4.65, 5.25, 'wait', [0, 4.6, 0], (lt, d, t) => { ext(); stand(off, 0, t, 0, { mood: 'worried', armL: [20, 0], armR: [20, 0] }); return [off]; }, [[0, 1.9, 5.0], [0, 1.9, 4.6], [0, 1.6, 0], 46], [[0, 'boing', 0.4]]);
  shot('B06', 5.25, 6.3, 'net', [0, 4.8, 0], (lt, d, t) => { ext(); const j = Math.sin(t * 22) * 0.05; stand(n1, -1.0 + j, t, 1, { mood: 'shock', armL: [160, 0], armR: [160, 0] }); stand(n2, 0.0 - j, t, 2, { mood: 'laugh', armL: [150, 0], armR: [150, 0] }); stand(n3, 1.0 + j, t, 3, { mood: 'shock', armL: [160, 0], armR: [160, 0] }); return [n1, n2, n3]; }, [[0, 2.0, 7.0], [0, 1.95, 6.0], [0, 1.5, 0], 46], [[0.1, 'cheer', 0.45]]);
  shot('B07', 6.3, 7.6, 'boaty', [0, 4.6, 0], (lt, d, t) => { sea(t); shp.scale.setScalar(1.1); n1.at(0, 0, 0); return []; }, [[0, 3.2, 12], [0, 2.6, 8.5], [0, 1.8, -1], 44], [[0.3, 'boing', 0.5]]);
  // LINE 1 (7.61-14.03)
  shot('B08', 7.6, 8.9, 'votes', [0, 4.8, 0], (lt, d, t) => { ext(); put(bal, 0, 0, 0); bal.update(t); stand(n3, -1.2, t, 3, { mood: 'happy', armR: [150, 0] }); return [n3]; }, [[0, 2.4, 7.4], [0, 2.3, 6.6], [0, 1.8, 0], 46], [[0.1, 'whoosh', 0.35]]);
  shot('B09', 8.9, 9.95, 'poll', [0, 4.8, 0], (lt, d, t) => { ext(); put(cht, 0, 0, -0.5); cht.set(clamp(lt / 0.8), 0.1); stand(n2, 1.4, t, 2, { mood: 'shock', armR: [150, 0] }); return [n2]; }, [[0, 2.2, 7.4], [0, 2.1, 6.4], [0, 1.6, 0], 46]);
  shot('B10', 9.95, 11.0, 'x10', [0, 4.8, 0], (lt, d, t) => { ext(); put(cht, 0, 0, -0.5); cht.set(1, 0.1); cht.scale.setScalar(1 + Math.sin(t * 12) * 0.02); stand(n1, -1.4, t, 1, { mood: 'laugh', armL: [160, 0] }); return [n1]; }, [[0, 2.2, 7.0], [0, 2.1, 6.0], [0, 1.6, 0], 46], [[0.1, 'pop', 0.4]]);
  shot('B11', 11.0, 12.1, 'david', [0, 4.6, 0], (lt, d, t) => { ext(); stand(att, 0, t, 6, { mood: 'neutral', armL: [30, 0], armR: [30, 0] }); return [att]; }, [[0, 1.9, 5.4], [0, 1.9, 4.6], [0, 1.6, 0], 46]);
  shot('B12', 12.1, 13.3, 'sad', [0, 4.6, 0], (lt, d, t) => { ext(); stand(att, 0, t, 6, { mood: 'sad', armL: [10, 0], armR: [10, 0] }); put(cht, 1.7, 0, -0.5); cht.set(0.15, 0.06); cht.scale.setScalar(0.5); return [att]; }, [[0, 1.9, 5.6], [0, 1.9, 4.8], [0, 1.6, 0], 46], [[0.1, 'trombone', 0.45]]);
  shot('B13', 13.3, 14.28, 'win', [0, 4.8, 0], (lt, d, t) => { ext(); const j = Math.abs(Math.sin(t * 10)) * 0.25; n1.at(-1.0, 0.4 + j, 0); n2.at(0, 0.4 + Math.abs(Math.sin(t * 10 + 1)) * 0.25, 0); n3.at(1.0, 0.4 + Math.abs(Math.sin(t * 10 + 2)) * 0.25, 0); [n1, n2, n3].forEach((p, i) => { vis(p, true); p.set({ mood: 'laugh', armL: [165, 0], armR: [165, 0], blink: blink(t, i * 0.4) }); }); return [n1, n2, n3]; }, [[0, 2.0, 7.0], [0, 2.0, 6.0], [0, 1.6, 0], 46], [[0.1, 'cheer', 0.5]]);
  // LINE 2 (14.28-17.6)
  shot('B14', 14.28, 15.3, 'panic', [0, 4.8, 0], (lt, d, t) => { ext(); const a = t * 8; off.at(Math.sin(a) * 0.9, 0.4 + Math.abs(Math.sin(a * 2)) * 0.15, 0); vis(off, true); off.set({ mood: 'shock', armL: [170, 0], armR: [170, 0] }); n1.at(-Math.sin(a) * 0.9, 0.4 + Math.abs(Math.cos(a * 2)) * 0.15, 0); vis(n1, true); n1.set({ mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [off, n1]; }, [[0, 2.0, 6.6], [0, 1.9, 5.8], [0, 1.6, 0], 46], [[0.0, 'alarm', 0.4]]);
  shot('B15', 15.3, 16.4, 'rej', [0, 4.6, 0], (lt, d, t) => { ext(); stand(off, 0, t, 0, { mood: 'angry', armR: [60 + Math.max(0, Math.sin(lt * 8)) * 80, 0], armL: [20, 0] }); return [off]; }, [[0, 1.9, 5.4], [0, 1.9, 4.6], [0, 1.6, 0], 46], [[0.45, 'stamp', 0.55]]);
  shot('B16', 16.4, 17.85, 'rrs', [0, 4.8, 0], (lt, d, t) => { sea(t); stand(att, -0.1, t, 6, {}); vis(att, false); return []; }, [[0, 3.0, 12], [0, 2.8, 10], [0, 1.6, -1], 44], [[0.1, 'whoosh', 0.3]]);
  // LINE 3 (17.85-23.51)
  shot('B17', 17.85, 19.15, 'rev', [0, 4.8, 0], (lt, d, t) => { ext(); stand(mo, 0, t, 7, { mood: 'sly', armL: [10, 0], armR: [10, 0] }); return [mo]; }, [[0, 1.8, 5.2], [0, 1.8, 4.2], [0, 1.4, 0], 46], [[0.2, 'hehehehehehehe', 0.5]]);
  shot('B18', 19.15, 20.7, 'give', [0, 4.8, 0], (lt, d, t) => { sea(t, false); put(sub, lerp(-4, -0.2, eio(clamp(lt / 1.0))), 0.1 + Math.sin(t * 4) * 0.05, 1.6); sub.spin(t); return []; }, [[0, 2.6, 8.6], [0, 2.4, 7.2], [0, 1.1, 0.8], 44], [[0.2, 'whoosh', 0.35]]);
  shot('B19', 20.7, 21.7, 'tiny', [0, 4.6, 0], (lt, d, t) => { ext(); put(sub, 0, 0.4 + Math.sin(t * 6) * 0.08, 0.5); sub.rotation.y = 0.5 + Math.sin(t * 3) * 0.2; sub.spin(t); sub.scale.setScalar(0.5 + pop(lt, 0, 0.3) * 0.6); return []; }, [[0, 2.0, 5.8], [0, 1.9, 5.0], [0, 1.2, 0], 46], [[0.1, 'pop', 0.4]]);
  shot('B20', 21.7, 22.95, 'dive', [0, 4.6, 0], (lt, d, t, k) => { vis(deep, true); deep.update(t); put(sub, lerp(-2, 2, k), 1.2 + Math.sin(t * 3) * 0.15, 0.4); sub.rotation.y = Math.PI; sub.spin(t); return []; }, [[0, 1.6, 7.0], [0, 1.6, 6.0], [0, 1.2, 0], 46], [[0.0, 'bubbles', 0.4]]);
  shot('B21', 22.95, 23.76, 'ant', [0, 4.6, 0], (lt, d, t) => { vis(ice, true); put(pen, -0.8, 0.2 + Math.abs(Math.sin(t * 8)) * 0.15, 0.4); pen.rotation.y = 0.4; put(sub, 1.0, 0.5, 0.2); sub.rotation.y = -0.6; sub.scale.setScalar(0.7); return []; }, [[0, 2.0, 6.4], [0, 1.9, 5.6], [0, 1.1, 0], 46], [[0.1, 'whoosh', 0.3]]);
  // LINE 4 (23.76-26.7)
  shot('B22', 23.76, 24.74, 'moral', [0, 4.8, 0], (lt, d, t) => { ext(); mo.at(0, 0.4, 0.8).set({ mood: 'smug', armL: [10, 0], armR: [10, 0], blink: blink(t, 0.3) }); vis(mo, true); put(pcn, -0.3, 1.0, 1.1); vis(pcn, true); return [mo]; }, [[0, 2.0, 5.6], [0, 1.9, 4.8], [0, 1.4, 0], 46]);
  shot('B23', 24.74, 25.8, 'never', [0, 4.8, 0], (lt, d, t) => { ext(); stand(n1, -1.0, t, 1, { mood: 'happy', armL: [160, 0] }); stand(n3, 1.0, t, 3, { mood: 'laugh', armR: [160, 0] }); mo.at(0, 0.4, -0.3).set({ mood: 'worried', armL: [10, 0], armR: [10, 0] }); vis(mo, true); return [n1, n3, mo]; }, [[0, 2.0, 6.6], [0, 1.9, 5.8], [0, 1.5, 0], 46], [[0.1, 'bruh', 0.4]]);
  shot('B24', 25.8, 27.3, 'any', [0, 4.8, 0], (lt, d, t) => { ext(); put(sub, -2.2, 0.3, 0.2); sub.rotation.y = 0.5; sub.scale.setScalar(0.6); put(pen, 2.0, 0.1, 0.2); mo.at(0, 0.5 + Math.abs(Math.sin(t * 8)) * 0.15, 1.2).set({ mood: 'laugh', armL: [165, 0], armR: [165, 0] }); vis(mo, true); put(pcn, 0.6, 1.2, 1.2); vis(pcn, true); return [mo]; }, [[0, 2.4, 7.4], [0, 2.2, 6.4], [0, 1.4, 0.5], 46], [[1.1, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
