// TWO STATES WENT TO WAR OVER TOLEDO: Tall Tale+ (Toledo War, 1835-36).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as AL from './core/aln.js';
import * as TL from './core/tol.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);
const OH1 = { body: '#B5372E', hat: 'visor', hatCol: '#F2E6CF', pattern: 'plain', extra: ['mustache'] };
const OH2 = { body: '#B5372E', hat: 'cap', hatCol: '#222222', pattern: 'stripes', patCol: '#7A1F1A', extra: ['freckles'] };
const MI1 = { body: '#2E5AA8', hat: 'bowler', hatCol: '#222222', pattern: 'plain', extra: ['glasses'] };
const MI2 = { body: '#2E5AA8', hat: 'beanie', hatCol: '#F2E6CF', pattern: 'stripes', patCol: '#1F3F8A', extra: ['monocle'] };
const SHF = { body: '#C9A13B', hat: 'mailcap', hatCol: '#5A3A22', pattern: 'plain', extra: ['pencil', 'blush'] };
const JAK = { body: '#2A2A33', hat: 'tophat', hatCol: '#111111', pattern: 'plain', extra: ['mustache', 'monocle'] };
const CNG = { body: '#6A8A5A', hat: 'boater', hatCol: '#E2D08A', pattern: 'plain', extra: ['glasses', 'freckles'] };
assertDistinct([MO, OH1, OH2, MI1, MI2, SHF, JAK, CNG], 'toledo cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const fo = TL.flag('ohio'), fmi = TL.flag('mich'), mp = TL.stateMap(), ore = TL.ore(), snow = TL.snowland(), mg = TL.mug(), dl = TL.deal(), mus1 = TL.musket(), mus2 = TL.musket(), pf = TL.puff(), room = AL.home(), tbl = new THREE.Group(), band = new THREE.Group();
  bx(2.6, 0.12, 1.2, mat({ color: '#6A4A2A', roughness: 0.7 }), 0, 0.85, 0, tbl); [-1.1, 1.1].forEach((x) => bx(0.14, 0.85, 0.14, mat({ color: '#4A3018' }), x, 0.42, 0, tbl));
  bx(0.55, 0.12, 0.3, mat({ color: '#FFFFFF', roughness: 0.9 }), 0, 0, 0, band); bx(0.12, 0.3, 0.3, mat({ color: '#E85A5A', roughness: 0.9 }), 0, 0, 0.01, band);
  const OBJ = [fo, fmi, mp, ore, snow, mg, dl, mus1, mus2, pf, room, tbl, band]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('y1835', '1835', '#2A2A33'); bdc('almost', 'ALMOST WAR', '#B5372E'); bdc('charge', 'WAR!', '#B5372E'); bdc('toledo', 'TOLEDO', '#2E6A9A'); bdc('mil', 'TWO MILITIAS', '#2A2A33'); bdc('warn', 'WARNING SHOTS ONLY', '#B8860B'); bdc('cas', 'ONLY CASUALTY', '#B5372E'); bdc('brawl', 'TAVERN BRAWL', '#6A4A32'); bdc('jack', 'PRESIDENT JACKSON', '#2A2A33'); bdc('cong', 'CONGRESS', '#2E6A9A'); bdc('trade', 'TOLEDO FOR THE U.P.', '#2E6A4A'); bdc('up', 'UPPER PENINSULA', '#2E6A9A'); bdc('waste', 'WORTHLESS WASTELAND', '#6A707A'); bdc('until', 'UNTIL...', '#2A2A33'); bdc('ore', 'COPPER + IRON', '#B8860B'); bdc('who', 'WHO REALLY WON?', '#B5372E');
  const boards = Object.values(BD);
  const o1 = person(OH1), o2 = person(OH2), m1 = person(MI1), m2 = person(MI2), shf = person(SHF), jak = person(JAK), cng = person(CNG), mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const SP = [o1, o2, m1, m2, shf, jak, cng, mo]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
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
  // LINE 0: In 1835, Ohio and Michigan nearly went to war over the city of Toledo.
  shot('T01', 0, 1.7, 'y1835', [0, 4.8, 0], (lt, d, t) => { ext(); put(fo, -1.25, 0, -0.9); put(fmi, 1.25, 0, -0.9); wave(fo, t); wave(fmi, t); stand(o1, -1.0, t, 1, { mood: 'angry', armR: [150, 0] }); stand(o2, -0.35, t, 2, { mood: 'angry', armL: [140, 0] }); stand(m1, 0.35, t, 3, { mood: 'angry', armR: [140, 0] }); stand(m2, 1.0, t, 4, { mood: 'angry', armL: [150, 0] }); put(mus1, -0.55, 1.0, 0.3, 0, 0.3); put(mus2, 0.6, 1.0, 0.3, 0, -0.3); return [o1, o2, m1, m2]; }, CM(2.0, 7.0, 46), [[0, 'whoosh', 0.35]]);
  shot('T02', 1.7, 3.9, 'almost', [0, 4.8, 0], (lt, d, t) => { ext(); put(mp, 0, 0.1, -2.2); stand(o1, -1.1, t, 1, { mood: 'angry', armR: [160, 0] }); stand(m1, 1.1, t, 3, { mood: 'angry', armL: [160, 0] }); return [o1, m1]; }, [[0, 2.0, 6.4], [0, 1.95, 5.6], [0, 1.4, 0], 46]);
  shot('T03', 3.9, 5.05, 'charge', [0, 4.6, 0], (lt, d, t, k) => { ext(); const x = lerp(1.0, -0.1, k); stand(o1, -x, t, 1, { mood: 'angry', armR: [150, 0], armL: [150, 0] }); stand(m1, x, t, 3, { mood: 'angry', armR: [150, 0], armL: [150, 0] }); o1.at(-x, 0.4 + Math.abs(Math.sin(t * 14)) * 0.12, 0); m1.at(x, 0.4 + Math.abs(Math.sin(t * 14 + 1)) * 0.12, 0); return [o1, m1]; }, CM(2.0, 5.8), [[0.05, 'boom', 0.4]]);
  shot('T04', 5.05, 6.6, 'toledo', [0, 4.8, 0], (lt, d, t) => { ext(); put(mp, 0, 0.1, -1.3); const s = 1 + Math.sin(t * 8) * 0.04; mp.scale.setScalar(s); stand(shf, -0.9, t, 5, { mood: 'worried', armR: [150, 0] }); return [shf]; }, [[0, 2.0, 6.2], [0, 1.95, 5.4], [0, 1.5, 0], 46], [[0.4, 'pop', 0.4]]);
  // LINE 1: Both sent militias, but the only shots were warning shots, and the only casualty was a sheriff stabbed in a tavern brawl.
  shot('T05', 6.6, 8.55, 'mil', [0, 4.8, 0], (lt, d, t, k) => { ext(); put(fo, -1.2, 0, -0.9); put(fmi, 1.2, 0, -0.9); wave(fo, t); wave(fmi, t); const bob = (i) => Math.abs(Math.sin(t * 7 + i)) * 0.1; o1.at(-1.0, 0.4 + bob(0), 0); o2.at(-0.4, 0.4 + bob(1), 0); m1.at(0.4, 0.4 + bob(2), 0); m2.at(1.0, 0.4 + bob(3), 0); [o1, o2, m1, m2].forEach((p, i) => { vis(p, true); p.set({ mood: 'proud', armL: [20, 0], armR: [20, 0], blink: blink(t, i * 0.4) }); }); return [o1, o2, m1, m2]; }, CM(2.0, 7.0, 46), [[0, 'step', 0.3], [0.5, 'step', 0.3], [1.0, 'step', 0.3]]);
  shot('T06', 8.55, 11.0, 'warn', [0, 4.8, 0], (lt, d, t) => { ext(); const f = lt > 0.9; stand(m1, -0.9, t, 3, { mood: f ? 'smug' : 'angry', armR: [f ? 175 : 120, 0] }); put(mus1, -0.55, 1.2, 0.3, 0, 0.1); stand(o1, 0.9, t, 1, { mood: f ? 'shock' : 'angry', armL: f ? [160, 40] : [20, 0], lean: f ? 0.3 : 0 }); if (f) { vis(pf, true); pf.position.set(-0.4, 2.0, 0.3); pf.scale.setScalar(0.7 + (lt - 0.9) * 0.5); } o1.at(0.9, 0.4 + (f ? Math.max(0, Math.sin((lt - 0.9) * 6)) * 0.25 : 0), 0); return [m1, o1]; }, CM(2.0, 6.0), [[0.9, 'boom', 0.45]]);
  shot('T07', 11.0, 12.9, 'cas', [0, 4.5, 0], (lt, d, t) => { vis(room, true); put(tbl, 0, 0, -0.9); put(mg, -0.7, 0.97, -0.9); sit(shf, -0.1, t, { mood: lt > 0.8 ? 'shock' : 'worried', armL: [60, 0] }); shf.at(-0.1, 0.52, 0.4); vis(band, true); band.position.set(-0.1, 1.15, 0.7); const j = Math.sin(t * 16) * 0.05; stand(m1, -1.0 + j, t, 3, { mood: 'angry', armR: [150, 0] }); stand(o1, 1.0 - j, t, 1, { mood: 'angry', armL: [150, 0] }); return [shf, m1, o1]; }, [[0, 2.0, 6.8], [0, 1.95, 6.0], [0, 1.4, 0], 46], [[0.5, 'crunch', 0.4]]);
  shot('T08', 12.9, 13.97, 'brawl', [0, 4.5, 0], (lt, d, t) => { vis(room, true); put(tbl, 0, 0, -1.2); put(mg, 0.9, 0.97, -1.2); const s = Math.sin(t * 20) * 0.1; stand(m2, -0.5 + s, t, 4, { mood: 'angry', armR: [100, 0], armL: [110, 0] }); stand(o2, 0.5 - s, t, 2, { mood: 'angry', armR: [110, 0], armL: [100, 0] }); return [m2, o2]; }, [[0, 2.2, 5.6], [0, 2.1, 4.8], [0, 1.6, 0], 46], [[0.1, 'bruh_clip', 0.5]]);
  // LINE 2: President Jackson stepped in, and Congress offered Michigan a deal: give up Toledo, and take the Upper Peninsula.
  shot('T09', 13.97, 15.8, 'jack', [0, 4.8, 0], (lt, d, t) => { ext(); stand(jak, 0, t, 6, { mood: 'angry', armR: [170 + Math.sin(t * 6) * 8, 0], armL: [20, 0] }); stand(o1, -1.0, t, 1, { mood: 'worried' }); stand(m1, 1.0, t, 3, { mood: 'worried' }); return [jak, o1, m1]; }, CM(2.0, 6.2), [[0.1, 'stamp', 0.5]]);
  shot('T10', 15.8, 17.35, 'cong', [0, 4.6, 0], (lt, d, t) => { vis(room, true); put(tbl, 0, 0, -0.6); stand(cng, -0.7, t, 7, { mood: 'proud', armR: [100, 0] }); stand(jak, 0.7, t, 6, { mood: 'smug', armL: [90, 0] }); put(dl, 0, 0.99, -0.55); dl.rotation.x = -Math.PI / 2; return [cng, jak]; }, [[0, 2.2, 6.2], [0, 2.1, 5.4], [0, 1.3, 0], 46], [[0.05, 'whoosh', 0.3]]);
  shot('T11', 17.35, 19.45, 'trade', [0, 4.6, 0], (lt, d, t) => { vis(room, true); stand(m1, -0.9, t, 3, { mood: lt > 1.0 ? 'worried' : 'happy', armR: [100, 0] }); stand(cng, 0.9, t, 7, { mood: 'sly', armL: [100, 0] }); put(dl, 0, 1.6 + Math.sin(t * 3) * 0.08, 0.3); dl.scale.setScalar(1.4); return [m1, cng]; }, [[0, 2.2, 6.2], [0, 2.1, 5.2], [0, 1.5, 0], 46], [[1.0, 'coin', 0.35]]);
  shot('T12', 19.45, 20.57, 'up', [0, 4.8, 0], (lt, d, t) => { vis(snow, true); snow.update(t); stand(cng, -0.9, t, 7, { mood: 'proud', armR: [170, 0] }); stand(m2, 0.9, t, 4, { mood: 'shock' }); return [cng, m2]; }, [[0, 2.0, 6.4], [0, 1.95, 5.6], [0, 1.4, 0], 46], [[0.2, 'whoosh', 0.3]]);
  // LINE 3: Michiganders called it a worthless wasteland, until it turned out to be full of copper and iron.
  shot('T13', 20.57, 22.9, 'waste', [0, 4.8, 0], (lt, d, t) => { vis(snow, true); snow.update(t); const sh = Math.sin(t * 14) * 0.03; stand(m1, -0.9 + sh, t, 3, { mood: 'angry', armR: [150, 0], armL: [150, 0] }); stand(m2, 0.1 - sh, t, 4, { mood: 'angry', armR: [140, 0] }); stand(shf, 1.1 + sh, t, 5, { mood: 'angry', armL: [150, 0] }); return [m1, m2, shf]; }, CM(2.2, 7.4, 46), [[0.4, 'trombone', 0.4]]);
  shot('T14', 22.9, 24.85, 'until', [0, 4.6, 0], (lt, d, t) => { vis(snow, true); snow.update(t); const dig = Math.sin(t * 9); stand(m2, -0.5, t, 4, { mood: lt > 1.3 ? 'shock' : 'neutral', armR: [60 + dig * 40, 0] }); stand(m1, 0.7, t, 3, { mood: lt > 1.3 ? 'shock' : 'neutral', armL: [20, 0] }); return [m2, m1]; }, [[0, 2.0, 6.6], [0, 1.9, 5.4], [0, 1.3, 0], 46]);
  shot('T15', 24.85, 26.08, 'ore', [0, 4.2, 0], (lt, d, t) => { vis(snow, true); snow.update(t); put(ore, 0, 0.2, 0.1); ore.scale.setScalar(1 + Math.sin(t * 8) * 0.03); stand(m2, -1.1, t, 4, { mood: 'happy', armR: [170, 0] }); stand(m1, 1.1, t, 3, { mood: 'laugh', armL: [170, 0] }); return [m2, m1]; }, [[0, 2.0, 6.4], [0, 1.9, 5.5], [0, 1.0, 0], 46], [[0.1, 'coin', 0.45]]);
  // LINE 4: So, who really won the Toledo War?
  shot('T16', 26.08, 29.3, 'who', [0, 4.8, 0], (lt, d, t) => { ext(); put(fo, -1.3, 0, -1.4); put(fmi, 1.3, 0, -1.4); wave(fo, t); wave(fmi, t); mo.at(0, 0.4, 0.8).set({ mood: lt > 1.5 ? 'sly' : 'smug', armL: [10, 0], armR: [10, 0], blink: blink(t, 0.3) }); vis(mo, true); pcn.position.set(-0.3, 1.0, 1.1); vis(pcn, true); return [mo]; }, [[0, 2.0, 6.2], [0, 1.9, 5.4], [0, 1.6, 0], 46], [[2.0, 'faaah', 0.6]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
