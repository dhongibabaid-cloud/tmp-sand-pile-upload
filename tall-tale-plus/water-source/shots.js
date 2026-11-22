// THE CITY THAT RAN OUT OF WATER: Tall Tale+ (Cape Town Day Zero, 2018).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as WT from './core/water.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const MO = { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] };
const GUARD = { body: '#2E4E8A', hat: 'cap', hatCol: '#1F2A4A', pattern: 'vest', extra: ['mustache'] };
const CRL = cast(8, 7);
assertDistinct([MO, GUARD, ...CRL], 'water cast');
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
  const cty = WT.city(); sc.add(cty);
  const gnd = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: '#B5A47C', roughness: 1 })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = 0.0; gnd.receiveShadow = true; sc.add(gnd);
  const snk = WT.tap(), wt = WT.wallTaps(3), dm = WT.dam(), pd = WT.pod(), sh = WT.shower(), pl = WT.pool(), fn = WT.fountain();
  const bks = [WT.bucket(1), WT.bucket(1), WT.bucket(0.5)], bk1 = WT.bucket(0);
  [snk, wt, dm, pd, sh, pl, fn, ...bks, bk1].forEach((o) => sc.add(o));
  const mk = (t, c) => WD.signBoard(t, { w: Math.max(1.6, t.length * 0.2), h: 0.55, bg: c[0], fg: c[1] });
  const bDry = mk('THE WHOLE CITY RAN DRY', ['#1E3A5A', '#F2E6CF']), bCape = mk('CAPE TOWN · 2018', ['#2E4E3F', '#F2E6CF']), b90 = mk('90 DAYS TO SHUTOFF', ['#B5372E', '#FFFFFF']), bPeople = mk('4,000,000 PEOPLE', ['#2E3E6A', '#F2E6CF']), bTaps = mk('TAPS ABOUT TO GO DRY', ['#6A4A32', '#F2E6CF']), bDZ = mk('DAY ZERO', ['#B5372E', '#FFFFFF']), b200 = mk('200 GUARDED WATER POINTS', ['#2E7ACF', '#FFFFFF']), b25 = mk('25 LITRES PER PERSON', ['#1F5AA8', '#FFFFFF']), bBk = mk('= 2½ BUCKETS', ['#B8860B', '#FFFFFF']), b50 = mk('50 LITRES A DAY', ['#2E6A4A', '#FFFFFF']), b2m = mk('2-MINUTE SHOWERS', ['#2E7A8A', '#FFFFFF']), bPool = mk('POOLS BANNED', ['#B5372E', '#FFFFFF']), bFn = mk('FOUNTAINS OFF', ['#6A4A32', '#F2E6CF']), bApr = mk('APRIL 21', ['#2A2A33', '#F2E6CF']), bMay = mk('MAY 11', ['#7A3A8A', '#FFFFFF']), bCut = mk('EVERYONE CUT WATER USE', ['#2E6A4A', '#FFFFFF']), bNev = mk('NEVER CAME', ['#B5372E', '#FFFFFF']), b80 = mk('OVER 80% FULL', ['#2E7ACF', '#FFFFFF']), bWhat = mk('NOW WHAT?', ['#2A2A33', '#F2E6CF']), bMin = mk('2 MINUTES', ['#B5372E', '#FFFFFF']), bDZ2 = mk('DAY ZERO', ['#B5372E', '#FFFFFF']);
  const boards = [bDry, bCape, b90, bPeople, bTaps, bDZ, b200, b25, bBk, b50, b2m, bPool, bFn, bApr, bMay, bCut, bNev, b80, bWhat, bMin, bDZ2]; boards.forEach((b) => sc.add(b));
  const mo = person(MO, { height: 1.5 }), pcn = PW.popcorn(1.2), gd = person(GUARD), CR = CRL.map((l) => person(l));
  const SP = [mo, gd, ...CR]; SP.forEach((p) => sc.add(p.group)); sc.add(pcn);
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, snk, wt, dm, pd, sh, pl, fn, ...bks, bk1, ...boards].forEach((o) => vis(o, false)); cty.visible = true; gnd.visible = false; };
  const idle = (p, x, z, t, i, o = {}) => { vis(p, true); p.at(x, 0, z).set({ mood: 'neutral', armL: [10, 0], armR: [10, 0], blink: blink(t, i * 0.5), ...o }); };
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

  // 01 · Mo at a sink in the middle of the street: water, then nothing
  { const st = cut(0), cy_ = Wd('city', 0) - st;
    sbs('S01', st, 'Mo turns a tap on a sink in the street: water sputters then dies; THE WHOLE CITY RAN DRY', (lt, d, t, blit) => {
      resetAll(); vis(snk, true); snk.position.set(0.7, 0, 2.2); snk.set(lt < 1.2 ? 1 : lt < 2.0 ? 0.2 : 0, t); putMo(-0.4, 2.5); mo.set({ mood: lt > 1.9 ? 'shock' : 'happy', armR: [105, 0], blink: blink(t, 0.3), sweat: lt > 2.2 ? 1 : 0 });
      board(bDry, lt > cy_ - 0.3, 0.2, 3.5, 2.4, 0.95, lt, cy_ - 0.3);
      shoot([mo], V3(0, 1.9, 8.2), V3(0, 1.7, 6.6), V3(0.1, 1.2, 2.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st + 0.1, 'bubbles', { gain: 0.5, dur: 1.0 }); cue(st + 1.2, 'error', { gain: 0.7 }); cue(st + 1.6, 'plop', { gain: 0.5 }); cue(st + 2.1, 'bruh_clip', { gain: 0.7 }); }
  // 02 · Cape Town wide, mountain, 90 days
  { const st = Wd('Cape', 0) - 0.08, cp = 0, nn = Wd('ninety', 0) - st;
    sbs('S02', st, 'wide street, Table Mountain behind; CAPE TOWN · 2018 then 90 DAYS TO SHUTOFF', (lt, d, t, blit) => {
      resetAll(); [[0, -2.6, 2.4], [1, 2.6, 2.4], [2, -1.0, 3.4], [3, 1.2, 3.6]].forEach(([i, x, z]) => idle(CR[i], x, z, t, i, { mood: MOODS[i], armL: [30, 0] })); putMo(0, 4.4); mo.set({ mood: 'worried', blink: blink(t, 0.3) });
      board(bCape, lt > 0.15, 0, 5.6, 0.5, 1.0, lt, 0.15); board(b90, lt > nn - 0.1, 0, 4.4, 1.2, 0.95, lt, nn - 0.1);
      shoot([mo, ...CR.slice(0, 4)], V3(0, 3.0, 12), V3(0, 2.6, 9.4), V3(0, 2.6, 0), null, eio(clamp(lt / d)), 50); blit(); });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + 0.2, 'pop', { gain: 0.6 }); cue(st + nn - 0.1, 'alarm', { gain: 0.4, dur: 1.0 }); cue(st + nn + 0.2, 'core', { gain: 0.6 }); }
  // 03 · 4 million people crowd
  { const st = cut(1), mi = Wd('million', 1) - st;
    sbs('S03', st, 'crowd of eight different people with empty bottles; 4,000,000 PEOPLE', (lt, d, t, blit) => {
      resetAll(); CR.forEach((p, i) => idle(p, -3.1 + (i % 4) * 2.05 + (i > 3 ? 0.9 : 0), 2.4 + (i > 3 ? -1.4 : 0.5), t, i, { mood: MOODS[i], armR: [60 + Math.sin(t * 5 + i) * 20, 0], flip: i % 2 }));
      board(bPeople, lt > mi - 0.2, 0, 4.6, 0.4, 0.95, lt, mi - 0.2);
      shoot(CR, V3(0, 2.6, 12), V3(0, 2.3, 9.8), V3(0, 1.5, 1.5), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + mi - 0.2, 'pop', { gain: 0.7 }); cue(st + mi, 'crunch', { gain: 0.3 }); }
  // 04 · taps about to go dry
  { const st = Wd('Taps', 1) - 0.1, dy = Wd('dry.', 1) - st;
    sbs('S04', st, 'row of dry wall taps dripping, sweating guy; TAPS ABOUT TO GO DRY', (lt, d, t, blit) => {
      resetAll(); vis(wt, true); wt.position.set(0, 0, 0.2); wt.set(t); idle(CR[3], 0.7, 1.4, t, 3, { mood: lt > dy - 0.2 ? 'shock' : 'worried', sweat: 1, armR: [120, 0], flip: 1 });
      board(bTaps, lt > 0.1, 0, 3.6, 0.5, 0.85, lt, 0.1);
      shoot([CR[3]], V3(0.9, 1.9, 6.4), V3(0.2, 1.7, 4.8), V3(0.4, 1.5, 0.4), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 4; k++) cue(st + 0.4 + k * 0.5, 'plop', { gain: 0.35 }); cue(st + dy, 'error', { gain: 0.6 }); }
  // 05 · Day Zero
  { const st = Wd('named', 1) - 0.2, dz = Wd('Zero.', 1) - st;
    sbs('S05', st, 'giant DAY ZERO sign, Mo with popcorn crunching in front', (lt, d, t, blit) => {
      resetAll(); putMo(0, 2.7); mo.set({ mood: lt > dz ? 'shock' : 'smug', armR: [60, 0], blink: blink(t, 0.3), sweat: lt > dz ? 1 : 0 });
      board(bDZ, lt > 0.5, 0, 3.0, 0.6, 1.5, lt, 0.5);
      shoot([mo], V3(0, 1.8, 9.5), V3(0, 2.0, 7.6), V3(0, 2.1, 1.6), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st + 0.5, 'pop', { gain: 0.7 }); cue(st + 0.9, 'crunch', { gain: 0.5 }); cue(st + dz, 'core', { gain: 0.8 }); cue(st + dz + 0.3, 'heartbeat', { gain: 0.4, dur: 1.0 }); }
  // 06 · 200 water points
  { const st = cut(2), hu = Wd('hundred', 2) - st;
    sbs('S06', st, 'guarded water point with blue tank, long queue; 200 GUARDED WATER POINTS', (lt, d, t, blit) => {
      resetAll(); vis(pd, true); pd.position.set(1.0, 0, 0.0); idle(gd, 3.0, 2.5, t, 1, { mood: 'angry', armL: [60, 0], armR: [60, 0] });
      [0, 1, 2, 4, 5].forEach((i, n) => idle(CR[i], -3.4 + n * 0.85, 2.6, t, i, { mood: MOODS[i], lean: 6, armR: [20 + Math.sin(t * 2 + i) * 10, 0] }));
      board(b200, lt > hu - 0.1, 0, 4.9, 0.2, 0.85, lt, hu - 0.1);
      shoot([gd, ...CR], V3(0.3, 2.6, 12.5), V3(0.5, 2.3, 10), V3(0, 1.4, 1.5), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + hu - 0.1, 'stamp', { gain: 0.8 }); cue(st + hu + 0.2, 'metal_gear', { gain: 0.4 }); }
  // 07 · 25 litres
  { const st = Wd('twenty-five', 2) - 0.1, l25 = 0.3;
    sbs('S07', st, 'person fills one bucket at the tank; 25 LITRES PER PERSON', (lt, d, t, blit) => {
      resetAll(); vis(pd, true); pd.position.set(-1.6, 0, 0.3); idle(CR[2], 0.1, 1.8, t, 2, { mood: 'happy', armR: [70, 0] }); vis(bk1, true); bk1.position.set(-0.4, 0, 2.2); bk1.fill(clamp(lt / (d - 0.2)));
      board(b25, lt > 0.1, 0.4, 3.5, 0.8, 0.85, lt, 0.1);
      shoot([CR[2]], V3(0.6, 1.9, 9.2), V3(0.1, 1.6, 7.4), V3(-0.5, 1.1, 1.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'bubbles', { gain: 0.5, dur: 2.2 }); cue(st + l25, 'pop', { gain: 0.6 }); }
  // 08 · 2.5 buckets
  { const st = Wd('About', 2) - 0.1, bu = Wd('two', 2) - st, ev = Wd('everything.', 2) - st;
    sbs('S08', st, 'three buckets (2 full, 1 half); = 2½ BUCKETS; Mo worried', (lt, d, t, blit) => {
      resetAll(); bks.forEach((b, i) => { vis(b, true); b.position.set(-0.7 + i * 0.7, 0, 1.7); }); putMo(1.5, 1.2); mo.set({ mood: lt > ev - 0.1 ? 'shock' : 'worried', armR: [90, 0], blink: blink(t, 0.3), sweat: 1 });
      board(bBk, lt > bu - 0.1, 0, 2.7, 1.6, 0.8, lt, bu - 0.1);
      shoot([mo], V3(0.4, 1.5, 6), V3(0.2, 1.3, 4.5), V3(0.2, 0.9, 1.6), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + bu, 'plop', { gain: 0.5 }); cue(st + bu + 0.4, 'plop', { gain: 0.5 }); cue(st + bu + 0.8, 'plop', { gain: 0.4 }); cue(st + ev, 'omg_bruh', { gain: 0.6, dur: 1.6 }); }
  // 09 · 50 litres
  { const st = cut(3), ft = Wd('fifty', 3) - st;
    sbs('S09', st, 'person hugging a bucket proudly; 50 LITRES A DAY', (lt, d, t, blit) => {
      resetAll(); idle(CR[5], 0, 1.4, t, 5, { mood: 'proud', armL: [100, 0], armR: [100, 0] }); vis(bk1, true); bk1.position.set(0, 0.9, 1.9); bk1.fill(1);
      board(b50, lt > ft - 0.2, 0, 3.3, 0.8, 0.9, lt, ft - 0.2);
      shoot([CR[5]], V3(0, 1.8, 7), V3(0, 1.7, 5.4), V3(0, 1.4, 1.2), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ft - 0.2, 'pop', { gain: 0.6 }); cue(st + ft + 0.3, 'tock', { gain: 0.5 }); }
  // 10 · 2-minute shower
  { const st = Wd('Two-minute', 3) - 0.1;
    sbs('S10', st, 'shower stall with a clock sweeping, person rushing; 2-MINUTE SHOWERS', (lt, d, t, blit) => {
      resetAll(); vis(sh, true); sh.position.set(0, 0, 0.4); sh.set(lt < d - 0.1, clamp(lt / d)); idle(CR[6], 0, 0.5, t, 6, { mood: 'shock', armL: [140 + Math.sin(t * 12) * 20, 0], armR: [140 - Math.sin(t * 12) * 20, 0] });
      board(b2m, lt > 0.1, 0, 4.4, 0.6, 0.85, lt, 0.1);
      shoot([CR[6]], V3(0.5, 2.2, 10), V3(0.2, 2.0, 8), V3(0.2, 1.7, 0.4), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.1, 'bubbles', { gain: 0.5, dur: 1.0 }); for (let k = 0; k < 4; k++) cue(st + 0.2 + k * 0.28, 'tock', { gain: 0.4 }); }
  // 11 · pools banned
  { const st = Wd('Pools', 3) - 0.1;
    sbs('S11', st, 'above-ground pool draining dry, sad swimmer with towel; POOLS BANNED', (lt, d, t, blit) => {
      resetAll(); vis(pl, true); pl.position.set(0, 0, 1.0); pl.fill(1 - clamp(lt / (d - 0.1))); idle(CR[7], 2.9, 1.6, t, 7, { mood: 'sad', armR: [60, 0], flip: 1 }); 
      board(bPool, lt > 0.1, 0, 3.6, 0.4, 0.9, lt, 0.1);
      shoot([CR[7]], V3(0.6, 3.0, 9), V3(0.3, 2.6, 7), V3(0.4, 0.9, 1.0), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.15, 'stamp', { gain: 0.8 }); cue(st + 0.4, 'bubbles', { gain: 0.5, dur: 0.6 }); }
  // 12 · fountains off
  { const st = Wd('Fountains', 3) - 0.1, off = Wd('off.', 3) - st;
    sbs('S12', st, 'stone fountain gushing then switched off, Mo with popcorn disappointed; FOUNTAINS OFF', (lt, d, t, blit) => {
      resetAll(); vis(fn, true); fn.position.set(0, 0, 0.8); fn.on(lt < off ? 1 : 0); putMo(2.0, 2.2); mo.set({ mood: lt > off ? 'sad' : 'happy', blink: blink(t, 0.3) });
      board(bFn, lt > 0.1, 0, 4.2, 0.6, 0.9, lt, 0.1);
      shoot([mo], V3(0.4, 2.2, 8.5), V3(0.2, 2.0, 6.8), V3(0.4, 1.2, 1.0), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'bubbles', { gain: 0.5, dur: 0.8 }); cue(st + off, 'switch', { gain: 0.5, dur: 1.2 }); cue(st + off + 0.5, 'bruh_clip', { gain: 0.6 }); }
  // 13 · April 21
  { const st = cut(4), mv = Wd('moving.', 4) - st;
    sbs('S13', st, 'board APRIL 21 slides away; Mo worried behind', (lt, d, t, blit) => {
      resetAll(); putMo(0, 2.7); mo.set({ mood: 'worried', blink: blink(t, 0.3), sweat: 1 });
      board(bApr, lt < d - 0.05, lt > mv ? (lt - mv) * 2.4 : 0, 2.9, 0.6, 1.1, lt, 0.1);
      shoot([mo], V3(0, 1.9, 9.8), V3(0, 2.0, 8.0), V3(0, 2.0, 1.0), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.3, 'tock', { gain: 0.6 }); cue(st + mv, 'whoosh', { gain: 0.5 }); }
  // 14 · May 11
  { const st = Wd('May.', 4) - 0.1;
    sbs('S14', st, 'MAY 11 slams in', (lt, d, t, blit) => {
      resetAll(); putMo(0, 2.7); mo.set({ mood: 'shock', blink: blink(t, 0.3), sweat: 1 });
      board(bMay, true, 0, 2.9, 0.6, 1.1, lt, 0.05);
      shoot([mo], V3(0, 1.9, 9.8), V3(0, 2.0, 8.0), V3(0, 2.0, 1.0), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st + 0.05, 'slam', { gain: 0.7 }); cue(st + 0.2, 'faaah', { gain: 0.7 }); }
  // 15 · city cuts water use
  { const st = cut(5), ct = Wd('cut', 5) - st;
    sbs('S15', st, 'crowd cheering, taps trickle; EVERYONE CUT WATER USE', (lt, d, t, blit) => {
      resetAll(); vis(snk, true); snk.position.set(3.2, 0, 1.6); snk.set(0.2, t); CR.slice(0, 6).forEach((p, i) => idle(p, -3 + i * 1.1, 2.4 + (i % 2) * 0.8, t, i, { mood: 'happy', armL: [150 + Math.sin(t * 8 + i) * 15, 0], armR: [150 - Math.sin(t * 8 + i) * 15, 0] }));
      board(bCut, lt > ct - 0.1, 0, 4.6, 0.4, 0.9, lt, ct - 0.1);
      shoot(CR.slice(0, 6), V3(0, 2.4, 10.5), V3(0, 2.1, 8.2), V3(0, 1.5, 1.5), null, eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ct, 'cheer', { gain: 0.6 }); cue(st + ct + 0.4, 'thats_why_hes_the_goat', { gain: 0.6, dur: 2.4 }); }
  // 16 · Day Zero never came
  { const st = Wd('Day', 5) - 0.12, nv = Wd('never', 5) - st;
    sbs('S16', st, 'DAY ZERO board topples over and NEVER CAME lands; Mo laughs with popcorn', (lt, d, t, blit) => {
      resetAll(); putMo(0, 2.8); mo.set({ mood: lt > nv ? 'laugh' : 'worried', blink: blink(t, 0.3) });
      const f = clamp((lt - nv) / 0.5); board(bDZ2, true, -f * 1.4, 3.4 - f * f * 2.3, 0.6, 1.25, lt, 0.05); bDZ2.rotation.z = f * 1.1;
      board(bNev, lt > nv + 0.2, 0.3, 4.7, 0.9, 0.9, lt, nv + 0.2);
      shoot([mo], V3(0, 1.9, 9.8), V3(0, 2.0, 8.0), V3(0, 2.0, 1.2), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st + nv, 'wasted', { gain: 0.8 }); cue(st + nv + 0.25, 'thud', { gain: 0.6 }); cue(st + nv + 0.6, 'cheer', { gain: 0.5 }); }
  // 17 · dam refills
  { const st = cut(6), ei = Wd('eighty', 6) - st, so = Wd('So', 6) - st;
    sbs('S17', st, 'dam wall, reservoir rising from mud to full; OVER 80% FULL', (lt, d, t, blit) => {
      resetAll(); cty.visible = false; gnd.visible = true; vis(dm, true); dm.position.set(0, 0, -3); dm.level(lerp(0.2, 0.86, eio(clamp(lt / (ei + 0.4)))));
      board(b80, lt > ei - 0.2, 0, 4.2, 6.0, 1.2, lt, ei - 0.2);
      shoot([], V3(6, 5, 16), V3(3, 4.5, 12.5), V3(0, 1.8, 2), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 0.3, 'bubbles', { gain: 0.5, dur: 2.5 }); cue(st + ei - 0.1, 'cheer', { gain: 0.6 }); cue(st + ei, 'pop', { gain: 0.6 }); }
  // 18 · now what? Mo in street
  { const st = Wd('So', 6) - 0.1, nw = Wd('what', 6) - st;
    sbs('S18', st, 'wide street, Mo shrugs with popcorn among waiting people; NOW WHAT?', (lt, d, t, blit) => {
      resetAll(); [[0, -2.8, 2.4], [1, 2.8, 2.4], [2, -1.2, 3.2], [4, 1.4, 3.4]].forEach(([i, x, z]) => idle(CR[i], x, z, t, i, { mood: MOODS[i], armL: [30, 0] })); vis(snk, true); snk.position.set(3.4, 0, 1.0); snk.set(0, t); putMo(0, 4.3); mo.set({ mood: 'confused', blink: blink(t, 0.3), armR: [120, 0] });
      board(bWhat, lt > nw - 0.1, 0, 4.2, 1.0, 0.85, lt, nw - 0.1);
      shoot([mo, ...CR.slice(0, 5)], V3(0, 3.0, 13), V3(0, 2.4, 10), V3(0, 1.5, 2), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + nw, 'pop', { gain: 0.6 }); }
  // 19 · loop: Mo showers in 2 minutes
  { const st = Wd('Four', 6) - 0.1, mn = Wd('minutes.', 6) - st;
    sbs('S19', st, 'Mo showers in a stall with clock; 2 MINUTES (loops to the opening hook)', (lt, d, t, blit) => {
      resetAll(); vis(sh, true); sh.position.set(0, 0, 0.4); sh.set(lt < mn + 0.1, clamp(lt / (mn + 0.2))); putMo(0, 0.5); mo.set({ mood: lt > mn ? 'shock' : 'laugh', armR: [140 + Math.sin(t * 12) * 20, 0], blink: blink(t, 0.3) });
      pcn.position.set(-0.4, 1.4, 0.8);
      board(bMin, lt > 0.9, 0, 4.4, 0.6, 0.9, lt, 0.9);
      shoot([mo], V3(0.5, 2.2, 10), V3(0.2, 2.0, 8), V3(0.2, 1.7, 0.4), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'bubbles', { gain: 0.5, dur: 1.5 }); cue(st + mn, 'error', { gain: 0.6 }); cue(st + mn + 0.4, 'badumtss', { gain: 0.7 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
