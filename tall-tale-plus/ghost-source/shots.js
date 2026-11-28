// GHOST STORY: Tall Tale+ story short (Emma voice for girl lines).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as RX from './core/rex.js';
import * as GR from './core/gir.js';
import * as GH from './core/gh.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';
import { bx, cy, sp } from './core/boston.js';
import { mat } from './core/world.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);
const YOU = { body: '#E2663C', hat: 'cap', hatCol: '#222222', pattern: 'stripes', patCol: '#A8401F', extra: ['freckles'] };
const GHOST = { body: '#EAF0FF', head: '#E4ECFF', hat: 'bun', hatCol: '#1E1E28', pattern: 'plain', extra: ['blush'] };
const FRIEND = { body: '#4F9A5A', hat: 'beanie', hatCol: '#2E4E8A', pattern: 'check', patCol: '#2E6A3A', extra: ['glasses'] };
const NEI = { body: '#7A4A9A', hat: 'visor', hatCol: '#F2E6CF', pattern: 'plain', extra: ['mustache'] };
const COP = { body: '#2E4E8A', hat: 'mailcap', hatCol: '#1E2E5A', pattern: 'vest', patCol: '#E2B33C', extra: ['mustache'] };
const KID = { body: '#E27A9A', head: '#F7F7FA', hat: 'bow', hatCol: '#B5372E', pattern: 'plain', extra: ['freckles'], kid: true };
assertDistinct([YOU, GHOST, FRIEND, NEI, COP], 'ghost cast');
export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cam = camera(36), LK = { bloom: 0.14, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; };
  const pop = (lt, t0, dur = 0.3) => eob(clamp((lt - t0) / dur));
  const V = (x, y, z) => V3(x, y, z);
  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(5, 11, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; const worldKids = sc.children.filter((c) => !c.isLight && !(c.geometry && c.geometry.type === 'SphereGeometry' && c.geometry.parameters.radius > 100));
  const LR = GR.livingroom(), BRm = GH.bedroom(), BED = GH.bed(), CLK = GH.clock(), PH = GH.phone(), RG = GH.ring(), RG2 = GH.ring(), SI = GH.siren();
  const FG = cy(0.13, 0.12, 1.2, mat('#F2C9A0', 0.8), 0, 0, 0, null, 12); FG.rotation.z = Math.PI / 2; const OBJ = [LR, BRm, BED, CLK, PH, RG, RG2, SI, FG]; OBJ.forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const BD = {}; const bdc = (k, t, bg) => { BD[k] = mk(t, [bg, '#FFFFFF']); sc.add(BD[k]); };
  bdc('wake', 'WOKE UP AT 3 AM', '#2E3A7A'); bdc('clock', '3:00 AM', '#B5372E'); bdc('girl', 'A GIRL BESIDE MY BED', '#7A4A9A'); bdc('smile', 'SHE SMILED', '#7A4A9A');
  bdc('final', "FINALLY, YOU'RE AWAKE", '#2A2A33'); bdc('yrs', '200 YEARS', '#B5372E'); bdc('marry', 'TO MARRY YOU', '#C2477A');
  bdc('scream', 'AAAAAH!', '#B5372E'); bdc('police', 'POLICE CALLED', '#2E4E8A'); bdc('gone', 'SHE VANISHED', '#2A2A33');
  bdc('morning', 'NEXT MORNING', '#2E6A9A'); bdc('told', 'TOLD MY BEST FRIEND', '#2E6A4A'); bdc('laugh', 'HAHAHA', '#F28C28'); bdc('reject', 'REJECTED BY GHOSTS', '#2A2A33'); bdc('single', 'OFFICIALLY SINGLE', '#B5372E');
  bdc('ring', 'A WEDDING RING?!', '#C28A00'); bdc('phone', 'PHONE RANG', '#2E6A4A'); bdc('unk', 'UNKNOWN NUMBER', '#2A2A33'); bdc('daddy', 'DADDY?', '#C2477A');
  bdc('froze', 'I FROZE', '#2E6A9A'); bdc('bf', 'MY BEST FRIEND SAID', '#2E6A4A'); bdc('wife', 'YOU DONT HAVE A WIFE?', '#B5372E'); bdc('turn', 'I TURNED SLOWLY', '#2A2A33'); bdc('same', 'SAME RING', '#C28A00');
  bdc('lights', 'LIGHTS OUT', '#2A2A33'); bdc('voice', 'A VOICE WHISPERED', '#7A4A9A'); bdc('two', 'TWO HUSBANDS', '#B5372E'); bdc('one', 'ONE WIFE', '#C2477A'); bdc('reunion', 'FAMILY REUNION', '#7A4A9A');
  const boards = Object.values(BD);
  const you = person(YOU), gho = person(GHOST), fr = person(FRIEND), nei = person(NEI), cop = person(COP), kid = person(KID);
  const SP = [you, gho, fr, nei, cop, kid]; SP.forEach((p) => sc.add(p.group));
  const hemi = W.sun.group.children.find((c) => c.isHemisphereLight); const H0 = hemi.intensity, S0 = W.sun.key.intensity;
  const light = (k) => { hemi.intensity = k <= 1 ? lerp(H0, 0.5, k) : lerp(0.5, 0.1, Math.min(1, k - 1)); const dk = k > 1; k = Math.min(k, 1); hemi.color.set(k > 0.4 ? '#9AA8FF' : '#FFE9D2'); hemi.groundColor.set(k > 0.4 ? '#2A2A4A' : '#5A3A2A'); W.sun.key.intensity = lerp(S0, 0.3, k); W.sun.key.color.set(k > 0.4 ? '#8A9AFF' : '#FFFFFF'); if (dk) W.sun.key.intensity = 0.08; sc.environmentIntensity = dk ? 0.07 : lerp(0.25, 0.1, k); };
  const resetAll = () => { [...SP, ...OBJ, ...boards].forEach((o) => vis(o, false)); worldKids.forEach((g) => (g.visible = false)); W.sun.group.visible = true; };
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
  const KC0 = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const KC = (x, y, z, ty = 1.4, fov = 46) => [[x, y, z], [x, y - 0.1, z - 0.9], [x, ty, 0], fov];
  const room = () => { vis(LR, true); };
  const bath = (cr = 0) => { vis(BR, true); put(TB, 0, 0, -0.8); TB.crack(cr); };
  const cp = (o, x, y, z, ry, t, a = {}, s = 0.9) => { put(o, x, y, z, ry); o.scale.setScalar(s * 0.6); o.anim(t, a); };
  const bird = (x, y, z, ry = 0) => put(BI, x, y, z, ry);
  const HOOK = (lt, d, t) => { room(); cp(CA, -0.6, 0, -0.3, 0.0, t, { open: 0.3 }, 0.9); bird(-0.2, 1.05 + Math.abs(Math.sin(t * 5)) * 0.04, -0.3); stand(you, 0.95, t, 1, { mood: 'shock', armL: [170, 0], armR: [170, 0] }); return [you]; };
  const nt = (k = 1) => { light(k); vis(BRm, true); put(BED, 0, 0, -1.5); put(CLK, 2.4, 1.3, -2.5); };
  const dy = () => { light(0); vis(LR, true); };
  const inbed = (t, o = {}) => idle(you, -0.3, 1.0, -1.5, t, 1, { legs: 'sit', ...o });
  const ghost = (x, t, o = {}, z = -0.3) => idle(gho, x, 0.55 + Math.sin(t * 2) * 0.06, z, t, 3, { mood: 'sly', ...o });
  const NIGHT = (cx = 0, cy_ = 2.4, cz = 7.8, ty = 1.6, fov = 46) => [[cx, cy_, cz], [cx, cy_ - 0.1, cz - 0.9], [cx, ty, 0], fov];
  const finger = (x, y, z, rot = 0) => { put(FG, x, y, z, 0, Math.PI / 2 + rot); };
  // LINE 0 (0.25-3.67)
  shot('S01', 0, 1.2, 'wake', [0, 4.6, 0], (lt, d, t) => { nt(); inbed(t, { mood: 'tired' }); return [you]; }, NIGHT(-0.1, 2.0, 5.6, 1.5, 44), [[0.1, 'creak', 0.3]]);
  shot('S02', 1.2, 2.4, 'clock', [2.3, 3.0, 0], (lt, d, t) => { nt(); inbed(t, { mood: 'tired' }); return [you]; }, [[1.3, 1.9, 4.6], [1.4, 1.9, 3.8], [1.8, 1.4, 0], 42], [[0.1, 'tock', 0.4], [0.7, 'heartbeat', 0.4]]);
  shot('S03', 2.4, 3.9, 'girl', [0.4, 4.6, 0], (lt, d, t) => { nt(); inbed(t, { mood: 'shock', armL: [150, 0], armR: [150, 0] }); ghost(1.4, t); return [you, gho]; }, NIGHT(0.4, 2.0, 5.8, 1.5, 44), [[0.1, 'whoosh', 0.4]]);
  // LINE 1 (3.85-4.92)
  shot('S04', 3.9, 5.05, 'smile', [0.8, 3.6, 0], (lt, d, t) => { nt(); ghost(0.8, t, { mood: 'happy', armL: [20, 0] }); return [gho]; }, [[0.8, 1.6, 4.6], [0.8, 1.6, 3.8], [0.8, 1.4, 0], 40], [[0.1, 'pop', 0.3]]);
  // LINE 2 (5.02-8.88)
  shot('S05', 5.05, 6.8, 'final', [0.6, 3.6, 0], (lt, d, t) => { nt(); ghost(0.7, t, { mood: 'happy', armL: [30, 0], armR: [30, 0] }); return [gho]; }, [[0.7, 1.6, 5.4], [0.7, 1.6, 4.6], [0.7, 1.3, 0], 40], []);
  shot('S06', 6.8, 7.95, 'yrs', [0.6, 4.4, 0], (lt, d, t) => { nt(); ghost(1.1, t, { mood: 'sly' }); inbed(t, { mood: 'worried' }); return [you, gho]; }, NIGHT(0.4, 2.0, 5.8, 1.5, 44), [[0.1, 'stamp', 0.5]]);
  shot('S07', 7.95, 9.06, 'marry', [0.4, 4.4, 0], (lt, d, t) => { nt(); ghost(1.3, t, { mood: 'proud', armL: [100, 0] }); put(RG, 1.0, 1.7 + Math.sin(t * 3) * 0.05, -0.1, 0.3); RG.scale.setScalar(1.3); inbed(t, { mood: 'shock' }); return [you, gho]; }, NIGHT(0.4, 2.0, 5.6, 1.5, 44), [[0.2, 'boing', 0.4]]);
  // LINE 3 (9.06-11.81)
  shot('S08', 9.06, 10.3, 'scream', [0, 4.4, 0], (lt, d, t) => { nt(); inbed(t, { mood: 'shock', armL: [170, 0], armR: [170, 0], talk: 1 }); return [you]; }, [[-0.3, 2.2, 5.4], [-0.3, 2.2, 4.4], [-0.3, 1.9, 0], 42], [[0.05, 'aaaaaa', 0.55]]);
  shot('S09', 10.3, 12.0, 'police', [0, 4.4, 0], (lt, d, t) => { light(0.7); vis(LR, true); stand(nei, -0.9, t, 2, { mood: 'angry', armL: [150, 0] }); stand(cop, 0.9, t, 4, { mood: 'neutral', armL: [20, 0] }); return [nei, cop]; }, KC(0, 2.4, 7.2, 1.6, 46), [[0.1, 'knock', 0.4], [0.6, 'alarm', 0.3]]);
  // LINE 4 (11.99-13.39)
  shot('S10', 12.0, 13.57, 'gone', [0, 4.4, 0], (lt, d, t) => { nt(); inbed(t, { mood: 'worried', look: [1, 0] }); return [you]; }, NIGHT(-0.2, 2.0, 5.6, 1.5, 44), [[0.2, 'pop', 0.4]]);
  // LINE 5 (13.57-16.04)
  shot('S11', 13.57, 15.0, 'morning', [0, 4.4, 0], (lt, d, t) => { dy(); stand(you, -0.7, t, 1, { mood: 'tired', armL: [10, 0] }); stand(fr, 0.7, t, 2, { mood: 'happy' }); return [you, fr]; }, KC(0, 2.2, 7.0, 1.5, 46), [[0.1, 'whoosh', 0.35]]);
  shot('S12', 15.0, 16.22, 'told', [0, 4.2, 0], (lt, d, t) => { dy(); stand(you, -0.7, t, 1, { mood: 'worried', armL: [120 + Math.sin(t * 8) * 20, 0], armR: [120 - Math.sin(t * 8) * 20, 0], talk: 1 }); stand(fr, 0.7, t, 2, { mood: 'neutral' }); return [you, fr]; }, KC(0, 2.0, 6.4, 1.5, 44), []);
  // LINE 6-7 (16.22-20.39)
  shot('S13', 16.22, 17.14, 'laugh', [0.5, 3.6, 0], (lt, d, t) => { dy(); stand(fr, 0.5, t, 2, { mood: 'laugh', armL: [90, 0], bob: Math.abs(Math.sin(t * 12)) * 6 }); return [fr]; }, [[0.5, 1.7, 4.8], [0.5, 1.7, 4.0], [0.5, 1.5, 0], 42], []);
  shot('S14', 17.14, 18.9, 'single', [0.5, 3.8, 0], (lt, d, t) => { dy(); stand(fr, 0.6, t, 2, { mood: 'laugh', armL: [100, 0], armR: [40, 0], talk: 1 }); stand(you, -0.9, t, 1, { mood: 'sad' }); return [fr, you]; }, KC(0, 1.9, 6.0, 1.5, 44), [[0.1, 'pop', 0.3]]);
  shot('S15', 18.9, 20.57, 'reject', [0, 4.2, 0], (lt, d, t) => { dy(); stand(fr, 0.8, t, 2, { mood: 'laugh', bob: Math.abs(Math.sin(t * 12)) * 6 }); stand(you, -0.8, t, 1, { mood: 'sad', armL: [20, 0] }); return [fr, you]; }, KC(0, 2.2, 7.0, 1.5, 46), [[0.2, 'badumtss', 0.5]]);
  // LINE 8 (20.57-23.32)
  shot('S16', 20.57, 21.9, 'ring', [0, 4.0, 0], (lt, d, t) => { dy(); stand(you, -0.2, t, 1, { mood: lt < 0.7 ? 'laugh' : 'shock', armL: [100, 0], armR: [100, 0] }); return [you]; }, KC(-0.2, 2.0, 5.6, 1.5, 44), []);
  shot('S17', 21.9, 23.5, 'ring', [0, 3.2, 0], (lt, d, t) => { dy(); finger(0, 1.5, 0.4); put(RG, 0.1, 1.5, 0.4, 0, 1.57); RG.scale.setScalar(1.6); return []; }, [[0, 1.6, 3.4], [0, 1.6, 2.8], [0, 1.5, 0], 40], [[0.2, 'coin', 0.5]]);
  // LINE 9 (23.5-26.25)
  shot('S18', 23.5, 24.9, 'phone', [0, 4.0, 0], (lt, d, t) => { dy(); put(PH, 0.5, 1.6, 0.5, 0); PH.scale.setScalar(1.4); PH.ring(t); stand(you, -0.7, t, 1, { mood: 'worried', look: [1, 0] }); return [you]; }, KC(0, 2.0, 6.0, 1.5, 44), [[0.1, 'alarm', 0.35], [0.5, 'alarm', 0.35]]);
  shot('S19', 24.9, 26.43, 'unk', [0, 3.6, 0], (lt, d, t) => { dy(); put(PH, 0, 1.6, 0.5, 0); PH.scale.setScalar(2.0); PH.ring(t); return []; }, [[0, 1.7, 4.2], [0, 1.7, 3.4], [0, 1.6, 0], 40], [[0.1, 'heartbeat', 0.5]]);
  // LINE 10 (26.43-28.19)
  shot('S20', 26.43, 28.37, 'daddy', [0, 4.2, 0], (lt, d, t) => { light(0.5); vis(LR, true); put(PH, -0.3, 1.5, 0.6, 0); PH.scale.setScalar(1.3); idle(kid, 0.7, 0.4, 0, t, 5, { mood: 'sad', armL: [20, 0], armR: [20, 0] }); stand(you, -0.9, t, 1, { mood: 'shock', armL: [140, 0] }); return [kid, you]; }, KC(0, 2.0, 6.4, 1.4, 44), [[0.1, 'whoosh', 0.3]]);
  // LINE 11 (28.37-30.65)
  shot('S21', 28.37, 29.6, 'froze', [0, 4.0, 0], (lt, d, t) => { dy(); stand(you, 0, t, 1, { mood: 'shock', armL: [10, 0], armR: [10, 0], blink: 0 }); return [you]; }, [[0, 1.8, 5.6], [0, 1.8, 4.8], [0, 1.6, 0], 42], [[0.1, 'heartbeat', 0.5]]);
  shot('S22', 29.6, 30.75, 'bf', [0.5, 3.8, 0], (lt, d, t) => { dy(); stand(fr, 0.6, t, 2, { mood: 'worried', armL: [20, 0] }); stand(you, -0.9, t, 1, { mood: 'shock' }); return [fr, you]; }, KC(0, 2.0, 6.2, 1.5, 44), []);
  // LINE 12 (30.75-32.18)
  shot('S23', 30.75, 32.36, 'wife', [0.4, 3.6, 0], (lt, d, t) => { dy(); stand(fr, 0.4, t, 2, { mood: 'worried', armL: [60, 0], talk: 1 }); return [fr]; }, [[0.4, 1.7, 4.8], [0.4, 1.7, 4.0], [0.4, 1.5, 0], 40], [[0.1, 'tock', 0.3]]);
  // LINE 13 (32.36-36.27)
  shot('S24', 32.36, 33.8, 'turn', [0, 4.0, 0], (lt, d, t) => { dy(); stand(you, -0.6, t, 1, { mood: 'worried', lean: 6 }); stand(fr, 0.7, t, 2, { mood: 'neutral', look: [-1, 0] }); return [you, fr]; }, KC(0, 2.0, 6.6, 1.5, 44), [[0.2, 'creak', 0.4]]);
  shot('S25', 33.8, 35.2, 'same', [0, 3.2, 0], (lt, d, t) => { dy(); finger(0, 1.5, 0.4); put(RG, 0.1, 1.5, 0.4, 0, 1.57); RG.scale.setScalar(1.6); return []; }, [[0, 1.6, 3.4], [0, 1.6, 2.8], [0, 1.5, 0], 40], [[0.1, 'thud', 0.5]]);
  shot('S26', 35.2, 36.45, 'same', [0, 4.2, 0], (lt, d, t) => { dy(); stand(fr, 0.6, t, 2, { mood: 'shock', armL: [100, 0] }); stand(you, -0.7, t, 1, { mood: 'shock', armL: [100, 0] }); put(RG, 0.1, 2.0, 0.6, 0.2); put(RG2, -0.3, 2.0, 0.6, 0.2); return [fr, you]; }, KC(0, 2.0, 6.6, 1.5, 44), [[0.1, 'bruh_clip', 0.4]]);
  // LINE 14 (36.45-37.57)
  shot('S27', 36.45, 37.75, 'lights', [0, 4.2, 0], (lt, d, t) => { light(lt < 0.5 ? 0 : 2); vis(LR, true); stand(fr, 0.6, t, 2, { mood: 'shock' }); stand(you, -0.7, t, 1, { mood: 'shock' }); return [fr, you]; }, KC(0, 2.0, 6.6, 1.5, 44), [[0.5, 'switch', 0.5]]);
  // LINE 15-16 (37.75-42.73)
  shot('S28', 37.75, 39.07, 'voice', [0, 4.0, 0], (lt, d, t) => { light(2); vis(LR, true); stand(you, 0, t, 1, { mood: 'shock' }); return [you]; }, [[0, 1.8, 5.4], [0, 1.8, 4.6], [0, 1.6, 0], 42], [[0.2, 'whoosh', 0.3]]);
  shot('S29', 39.07, 40.9, 'two', [0, 4.2, 0], (lt, d, t) => { light(1.8); vis(LR, true); ghost(0.9, t, { mood: 'sly', armL: [80, 0] }, -0.2); stand(you, -0.9, t, 1, { mood: 'shock' }); stand(fr, 0.1, t, 2, { mood: 'shock' }); return [you, fr, gho]; }, KC(0, 2.0, 6.6, 1.5, 46), [[0.1, 'pop', 0.4]]);
  shot('S30', 40.9, 43.4, 'one', [0, 4.2, 0], (lt, d, t) => { light(1.8); vis(LR, true); ghost(0, t, { mood: 'happy', armL: [120, 0], armR: [120, 0] }, 0.2); stand(you, -1.0, t, 1, { mood: 'shock' }); stand(fr, 1.0, t, 2, { mood: 'shock' }); return [you, fr, gho]; }, KC(0, 2.0, 6.6, 1.5, 46), [[0.2, 'ohhhhhh', 0.5]]);

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
