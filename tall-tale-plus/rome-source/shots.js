// THE ROMAN EMPEROR WHO TAXED PEE: Tall Tale+ upgraded (living market, walking tracking shot, crowd, ambience, ~2 s cuts).
import * as THREE from 'three';
import { clamp, lerp, eo, eio, eob } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PW from './core/pigwar.js';
import * as CD from './core/cad.js';
import * as CA from './core/cash.js';
import * as RM from './core/rome.js';
import { assertDistinct, cast } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);
const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const KEY = {
  vesp: { body: '#7A2E8A', pattern: 'vest', patCol: '#C9A13B', hat: 'tophat', hatCol: '#C9A13B', band: '#7A2E8A', extra: ['mustache'] },
  titus: { body: '#EFE6D6', hat: 'none', extra: ['freckles', 'blush'] },
  coll: { body: '#8A6A3A', hat: 'cap', hatCol: '#5A3A22', extra: ['mustache', 'pencil'] },
  fuller: { body: '#4E8A9A', pattern: 'apron', patCol: '#F2E6CF', hat: 'bun', hatCol: '#3A2A1E', extra: ['freckles'] },
  tann: { body: '#A8965C', hat: 'visor', hatCol: '#2A2A33', extra: ['glasses'] },
  mo: { body: '#7A7F8A', hat: 'beanie', hatCol: '#3A3F4A', neck: 'none', pattern: 'plain', extra: ['blush'] },
};
const HATS = ['bowler', 'cap', 'beanie', 'visor', 'boater', 'bun', 'none', 'flower', 'mailcap', 'bow'], EXTRAS = [[], ['mustache'], ['glasses'], ['freckles'], ['blush'], ['pencil'], ['mustache', 'glasses'], ['freckles', 'blush']], PATS = ['plain', 'vest', 'apron', 'overalls'];
const CROWD = Array.from({ length: 16 }, (_, i) => ({ body: `hsl(${(i * 47 + 12) % 360},${50 + (i % 3) * 8}%,${42 + (i % 4) * 5}%)`, hat: HATS[i % HATS.length], hatCol: `hsl(${(i * 83 + 200) % 360},45%,${28 + (i % 3) * 10}%)`, pattern: PATS[i % 4], patCol: '#F2E6CF', extra: EXTRAS[(i * 3) % EXTRAS.length] }));
assertDistinct([...Object.values(KEY), ...CROWD], 'rome cast');
const person = (l, o) => new Toon({ ...l, extra: [...(l.extra || [])] }, o);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36), LK = { bloom: 0.16, aperture: 0.0010, maxblur: 0.007 };
  const vis = (o, v) => { (o.group || o).visible = v; }, show = (a) => a.forEach((o) => vis(o, true)), hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.35) => eob(clamp((lt - t0) / dur));

  const W = WD.meadow(E, { sunset: false, fenceOn: false, treesOn: false, flowers: false });
  W.sun.key.position.set(9, 14, 10); W.sun.key.target.position.set(0, 0, 0); Object.assign(W.sun.key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16 }); W.sun.key.shadow.camera.updateProjectionMatrix();
  const sc = W.scene; sc.children.forEach((c) => { if (c.geometry && c.geometry.type === 'CircleGeometry') c.visible = false; if (c.geometry && c.geometry.type === 'PlaneGeometry' && c.geometry.parameters.width === 200) c.position.y = -2.5; }); sc.add(RM.street());
  const col = RM.colosseum(); col.position.set(6, 0, -40); col.scale.setScalar(1.6); sc.add(col);
  const birds = PW.birds(6); sc.add(birds);
  const SHOPCOL = ['#C9764A', '#D9A441', '#EAD9B5', '#D98C7A', '#B8A07A', '#C98A5A'], AWN = [['#B5372E', '#F2E6CF'], ['#2E4E8A', '#F2E6CF'], ['#3E8A5A', '#F2E6CF'], ['#E2B33C', '#B5372E']];
  for (let i = 0, x = -25; x < 26; i++, x += 3.3) { if (x > 7.5 && x < 11.5) continue; const s = RM.shop(3.0, 2.6 + rn(i) * 0.5, SHOPCOL[i % 6], ...AWN[i % 4], i); s.position.set(x, 0, -3.7); sc.add(s); }
  [[-6, 'cloth'], [-2.5, 'bread'], [1.5, 'pots'], [5, 'fruit'], [13, 'fish'], [-22, 'fruit']].forEach(([x, g], i) => { const s = RM.stall(2.0, ...AWN[i % 4], g, i); s.position.set(x, 0, -1.9); sc.add(s); });
  [[-8.5, 2.7], [-3.4, 3.1], [0.4, 2.9], [3.8, 3.2], [7.6, 2.8], [12.2, 3.0], [-19.5, 3.0], [-13, 2.9]].forEach(([x, z], i) => { const a = RM.amphora(1.1 + rn(i) * 0.5, ['#C9764A', '#B5603A', '#D9A441'][i % 3]); a.position.set(x, 0, z); sc.add(a); if (i % 2) { const b = WD.barrel(); b.position.set(x + 0.55, 0, z + 0.1); b.scale.setScalar(0.65); sc.add(b); } });
  const lat = RM.latrine(); lat.position.set(9.5, 0, -3.2); sc.add(lat);
  // emperor's forum corner: pillars, banners
  [-19.4, -14.6].forEach((x) => { const p = CD.pillar(3.4, 1.3); p.position.set(x, 0, -2.6); sc.add(p); }); [-18, -15.9].forEach((x, i) => { const b = CD.banner('', i ? '#2E4E8A' : '#9E2E3A'); b.position.set(x, 2.3, -2.5); sc.add(b); });
  const desk = RM.desk(), chest = RM.chest(); desk.position.set(-10.5, 0, -1.2); chest.position.set(-9.0, 0, -1.4); sc.add(desk, chest);
  const bTax = WD.signBoard('PEE TAX', { w: 1.7, h: 0.5, bg: '#7A1F28', fg: '#F2D37A' }); bTax.position.set(-10.5, 2.2, -1.6); sc.add(bTax);
  const tub = RM.tub(1.0); tub.position.set(14, 0, -1.2); sc.add(tub); const rack = RM.rack(1.0); rack.position.set(18, 0, -1.4); sc.add(rack);
  const dog = RM.dog(); sc.add(dog); const fl = CD.flies(4); sc.add(fl); const bucket = CD.bucket(); sc.add(bucket); const amph = RM.amphora(1.4); sc.add(amph);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), new THREE.MeshBasicMaterial({ color: '#F2D95A' })); sc.add(stream);
  const coinH = RM.coin(0.2); sc.add(coinH); const coinsI = CA.coins(110); sc.add(coinsI); const coinFly = RM.coin(0.1); sc.add(coinFly);
  const bBan = WD.signBoard('ANCIENT ROME · 70 A.D.', { w: 2.8, h: 0.55, bg: '#7A1F28', fg: '#F2D37A' }), bDid = WD.signBoard('IT DID.', { w: 1.5, h: 0.5, bg: '#2E4E3F', fg: '#F2D37A' }), bSm = WD.signBoard('DOES IT SMELL?', { w: 2.4, h: 0.5, bg: '#3A5A2A', fg: '#FFFFFF' }), bNo = WD.signBoard('NO.', { w: 1.0, h: 0.5, bg: '#B5372E', fg: '#FFFFFF' }), bPec = WD.signBoard('PECUNIA NON OLET', { w: 2.8, h: 0.55, bg: '#2E4E8A', fg: '#F2D37A' }), bMon = WD.signBoard('MONEY DOES NOT STINK', { w: 2.9, h: 0.5, bg: '#2E7A3A', fg: '#FFFFFF' }), bAD = WD.signBoard('ANNO 70', { w: 1.5, h: 0.5, bg: '#2E4E8A', fg: '#F2D37A' });
  [bBan, bDid, bSm, bNo, bPec, bMon, bAD].forEach((b) => sc.add(b));

  const vesp = person(KEY.vesp), titus = person(KEY.titus), coll = person(KEY.coll), fuller = person(KEY.fuller), tann = person(KEY.tann), mo = person(KEY.mo, { height: 1.5 }), pcn = PW.popcorn(1.2);
  const crowd = CROWD.map((l) => person(l)); const SP = [vesp, titus, coll, fuller, tann, mo]; [...SP, ...crowd].forEach((p) => sc.add(p.group)); sc.add(pcn);
  // crowd roles: 0-5 walkers along the street, 6-11 shoppers at stalls, 12-15 vendors behind stalls
  const W0 = crowd.slice(0, 6).map((p, i) => ({ p, x0: -22 + i * 8 + rn(i) * 4, z: [0.9, 1.6, 0.3, 1.2, -0.2, 1.9][i], v: (i % 2 ? -1 : 1) * (0.55 + rn(i + 3) * 0.4) }));
  const SHP = [[-6, -0.9], [-2.5, -0.9], [1.5, -0.9], [5, -0.9], [13, -0.8], [-22, -0.9]].map(([x, z], i) => ({ p: crowd[6 + i], x: x + (i % 2 ? 0.5 : -0.5), z }));
  const VEN = [[-6, -2.45], [-2.5, -2.45], [1.5, -2.45], [5, -2.45]].map(([x, z], i) => ({ p: crowd[12 + i], x, z }));
  const placeCrowd = (t, cx, hideIds = []) => {
    const vis2 = (p, v) => { p.group.visible = v; };
    W0.forEach((w, i) => { const x = ((w.x0 + w.v * t + 24) % 48 + 48) % 48 - 24; const on = Math.abs(x - cx) < 5.0; vis2(w.p, on); if (on) w.p.at(x, Math.abs(Math.sin(t * 7 + i)) * 0.04, w.z).set({ mood: i % 3 ? 'neutral' : 'happy', legs: 'walk', phase: t * 7.3 + i * 1.7, flip: w.v < 0 ? 1 : 0, armL: [10 + Math.sin(t * 7 + i) * 12, 0], armR: [10 - Math.sin(t * 7 + i) * 12, 0], blink: blink(t, i) }); });
    SHP.forEach((w, i) => { const on = Math.abs(w.x - cx) < 5.0 && !hideIds.includes(w.p); vis2(w.p, on); if (on) w.p.at(w.x, 0, w.z).set({ mood: i % 2 ? 'happy' : 'neutral', armR: [Math.sin(t * 2 + i) > 0.3 ? 70 : 15, 0], armL: [15, 0], bob: Math.abs(Math.sin(t * 3 + i)) * 0.02, blink: blink(t, i), talk: Math.sin(t * 9 + i) > 0.4 }); });
    VEN.forEach((w, i) => { const on = Math.abs(w.x - cx) < 5.0; vis2(w.p, on); if (on) w.p.at(w.x, 0, w.z).set({ mood: 'happy', armR: [120 + Math.sin(t * 5 + i) * 25, 0], armL: [20, 0], talk: Math.sin(t * 11 + i) > 0, blink: blink(t, i + 2) }); });
  };
  const putMo = (x, z) => { mo.at(x, 0, z); pcn.position.set(x - 0.33, 0.82, z + 0.2); vis(pcn, true); vis(mo, true); };
  const resetAll = () => { hide(SP); [pcn, bBan, bDid, bSm, bNo, bPec, bMon, bAD, coinH, coinsI, coinFly, dog, fl, bucket, amph, stream].forEach((o) => vis(o, false)); };
  const shoot = (people, from, to, at, at2, k, fov, pull = 1) => {
    if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix(); }
    const tgt = at2 ? mix(at, at2, k) : at; cam.position.copy(tgt.clone().add(mix(from, to, k).sub(tgt).multiplyScalar(pull))); cam.lookAt(tgt);
    people.forEach((p) => p.face(cam)); E.render(sc, cam, { ...LK, focus: cam.position.distanceTo(tgt) });
  };
  const board = (b, on, x, y, z, s, lt, t0) => { vis(b, on); b.position.set(x, y, z); b.scale.setScalar(Math.max(0.01, s * pop(lt, t0))); };
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eu = new THREE.Euler();
  const rain = (t, g0, x0, z0, spread = 3, h = 5) => { coinsI.visible = g0 >= 0; for (let i = 0; i < 110; i++) { const g = ((g0 * 1.1 + rn(i) * 1.4) % 1.4) / 1.4; m4.compose(V3(x0 + (rn(i + 3) - 0.5) * spread, h - g * (h - 0.1), z0 + (rn(i + 6) - 0.5) * 2), q.setFromEuler(eu.set(t * 6 + i, i, t * 4)), V3(1, 1, 1)); coinsI.setMatrixAt(i, m4); } coinsI.instanceMatrix.needsUpdate = true; };
  const env = (t, cx) => { col.sway(t); birds.update(t, -10, 10, -20); dog.position.set(cx + 1.4 + Math.sin(t * 0.7) * 0.4, 0, 2.2); dog.tail.rotation.x = Math.sin(t * 14) * 0.5; };
  const sbs = (id, at, note, draw) => add({ id, at, note, draw });
  const lineEnd = (i, a) => cut(i);

  // 01 · wide crane: ancient Rome, descend
  { const st = cut(0), pe = Wd('pee?', 0) - st;
    sbs('S01', st, 'wide market with Colosseum behind, crane down to street, ANCIENT ROME banner', (lt, d, t, blit) => {
      resetAll(); placeCrowd(t, -2); env(t, -2); show([vesp]); vesp.at(-1.6, 0, 0.9).set({ mood: 'smug', armR: [20, 0], armL: [20, 0], blink: blink(t) }); putMo(1.6, 3.4); mo.set({ mood: 'sly', blink: blink(t, 0.3) });
      board(bBan, lt > 0.05, -2, 3.55 - eo(clamp(lt / d)) * 0.9, 1.5, 0.9, lt, 0.05);
      shoot([vesp, mo], V3(-2, 9.5, 13), V3(-2, 1.6, 8.6), V3(-2, 2.8, -2), V3(-2, 1.6, 0), eio(clamp(lt / d)), 48); blit(); });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.35, 'creak', { gain: 0.3 }); cue(st + 0.9, 'stinger', { gain: 0.6 }); }
  // 02 · "It did."
  { const st = cut(0) + (Wd('pee?', 0) - cut(0)), d0 = Wd('did.', 0) - st;
    sbs('S02', st, 'push-in on smirking Vespasian, IT DID. board, record scratch', (lt, d, t, blit) => {
      resetAll(); placeCrowd(t, -2); env(t, -2); show([vesp]); vesp.at(-2.0, 0, 0.8).set({ mood: lt > d0 ? 'smug' : 'sly', armR: [lt > d0 ? 150 : 20, 0], blink: blink(t), talk: lt < d0 ? Math.sin(t * 13) > 0 : 0 });
      board(bDid, lt > d0, -1.4, 2.0, 0.8, 0.6, lt, d0);
      shoot([vesp], V3(-1.8, 1.5, 7.0), V3(-1.95, 1.5, 4.8), V3(-2.0, 1.3, 0.8), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st + d0 - 0.05, 'scratch', { gain: 0.8 }); cue(st + d0 + 0.05, 'dundun', { gain: 0.7 }); cue(st, 'whoosh', { gain: 0.3 }); }
  // 03 · walking tracking shot: collector with amphora through the market
  { const st = cut(1), co = Wd('collected', 1) - st, tl = Wd('toilets', 1) - st;
    sbs('S03', st, 'tracking shot: collector walks through the market with an amphora; crowd, stalls, dog, Colosseum above the roofs', (lt, d, t, blit) => {
      resetAll(); const x = lerp(-5.5, 5.5, lt / d), ph = t * 7.3; placeCrowd(t, x, []); env(t, x); show([coll]); vis(amph, true);
      coll.at(x, Math.abs(Math.sin(ph)) * 0.03, 0.4).set({ mood: 'happy', legs: 'walk', phase: ph, armR: [30, 0], armL: [70, 0], blink: blink(t), talk: 0 }); amph.position.set(x + 0.33, 0.55, 0.5);
      vis(dog, true); putMo(x - 1.6, 3.4); mo.set({ mood: 'sly', legs: 'walk', phase: ph + 1, blink: blink(t, 0.3) });
      shoot([coll, mo], V3(x + 0.1, 1.5, 6.8), V3(x + 0.1, 1.5, 6.8), V3(x + 0.5, 1.9, 0), null, 0, 42); blit(); });
    for (let k = 0; k < 6; k++) cue(st + 0.1 + k * 0.43, 'step', { gain: 0.5, pan: k % 2 ? 0.2 : -0.2 }); cue(st, 'whoosh', { gain: 0.3 }); cue(st + 1.0, 'creak', { gain: 0.25 }); }
  // 04 · the public latrine, pour
  { const st = Wd('toilets', 1) - 0.06, tp = 0.5;
    sbs('S04', st, 'public latrine: collector pours a bucket into the amphora, flies buzzing', (lt, d, t, blit) => {
      resetAll(); const cx = 8.6; placeCrowd(t, cx); env(t, cx); show([coll]); vis(bucket, true); vis(amph, true); vis(fl, true); vis(dog, false);
      const pour = clamp((lt - 0.4) / 0.8); coll.at(cx - 0.3, 0, 0.3).set({ mood: 'proud', armR: [100, 0], armL: [60, 0], blink: blink(t), bob: Math.abs(Math.sin(t * 4)) * 0.02 });
      bucket.position.set(cx + 0.15, 1.05, 0.5); bucket.rotation.z = -pour * 1.0; amph.position.set(cx + 0.6, 0, 0.5); vis(stream, pour > 0.2 && pour < 1); stream.position.set(cx + 0.35, 0.8, 0.5); fl.position.set(cx + 0.4, 1.7, 0.4); fl.buzz(t);
      shoot([coll], V3(cx + 1.1, 1.5, 6.6), V3(cx + 0.5, 1.5, 5.4), V3(cx + 0.1, 1.2, 0.2), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st + 0.3, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'bubbles', { gain: 0.5, dur: 0.9 }); cue(st + 0.55, 'plop', { gain: 0.6 }); cue(st + 1.0, 'gulp', { gain: 0.5 }); }
  // 05 · launderers and leather makers
  { const st = Wd('launderers', 1) - 0.06, ta = Wd('leather', 1) - st;
    sbs('S05', st, 'fuller stomps togas in a tub; tanner stretches a hide; crowd shops', (lt, d, t, blit) => {
      resetAll(); const cx = 14.5; placeCrowd(t, cx); env(t, cx); show([fuller, tann]); vis(dog, true);
      fuller.at(13.9, Math.abs(Math.sin(t * 8)) * 0.1 + 0.55, -1.0).set({ mood: 'happy', legs: 'walk', phase: t * 8, armL: [100, 0], armR: [100, 0], blink: blink(t), talk: 0 }); tub.liquid && 0;
      tann.at(17.7, 0, -0.5).set({ mood: lt > ta ? 'proud' : 'neutral', armR: [100 + Math.sin(t * 6) * 20, 0], armL: [90, 0], blink: blink(t, 1) });
      shoot([fuller, tann], V3(cx - 1.0, 1.7, 8.4), V3(cx + 0.4, 1.6, 7.0), V3(cx + 0.5, 1.3, -0.5), V3(cx + 1.4, 1.3, -0.5), eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 4; k++) cue(st + 0.2 + k * 0.3, 'plop', { gain: 0.45 }); cue(st + ta, 'pop', { gain: 0.6 }); }
  // 06 · ammonia whitens togas
  { const st = cut(2), wh = Wd('whitened', 2) - st, tg = Wd('togas', 2) - st;
    sbs('S06', st, 'fuller wrings a dingy toga that flashes white with sparkles', (lt, d, t, blit) => {
      resetAll(); const cx = 14; placeCrowd(t, cx); env(t, cx); show([fuller]); const w = clamp((lt - wh) / 0.3);
      tub.cloth.material.color.set(new THREE.Color('#8A7A5A').lerp(new THREE.Color('#FFFFFF'), w));
      fuller.at(14.0, 0, -0.3).set({ mood: lt > wh ? 'proud' : 'tired', armL: [100 + Math.sin(t * 9) * 20, 0], armR: [100 - Math.sin(t * 9) * 20, 0], blink: blink(t), bob: Math.abs(Math.sin(t * 9)) * 0.03 });
      shoot([fuller], V3(14.3, 1.5, 5.6), V3(14.05, 1.35, 4.2), V3(14.0, 1.0, -0.8), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + wh, 'sparkle', { gain: 0.9 }); cue(st + wh + 0.1, 'ding', { gain: 0.5 }); }
  // 07 · tanned hides
  { const st = Wd('tanned', 2) - 0.06, hi = Wd('hides.', 2) - st;
    sbs('S07', st, 'tanner flips three hides from pale to brown on the rack', (lt, d, t, blit) => {
      resetAll(); const cx = 18; placeCrowd(t, cx); env(t, cx); show([tann]); rack.hides.forEach((h, i) => { const k = clamp((lt - hi * 0.4 - i * 0.18) / 0.3); h.material.color.set(new THREE.Color('#F0E6CF').lerp(new THREE.Color('#9A6A3A'), k)); h.rotation.y = Math.sin(t * 3 + i) * 0.1 + (k > 0 && k < 1 ? 0.5 : 0); });
      tann.at(17.9, 0, -0.1).set({ mood: lt > hi ? 'proud' : 'neutral', armR: [lt > hi ? 150 : 100, 0], armL: [60, 0], blink: blink(t) });
      shoot([tann], V3(18.5, 1.5, 6.2), V3(18.1, 1.5, 4.6), V3(18.0, 1.2, -0.6), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let i = 0; i < 3; i++) cue(st + hi * 0.4 + i * 0.18, 'pop', { gain: 0.5 }); cue(st + hi, 'stamp', { gain: 0.6 }); }
  // 08 · Vespasian announces the tax
  { const st = cut(3), ta = Wd('taxed', 3) - st;
    sbs('S08', st, 'Emperor Vespasian at the forum corner reads a decree; ANNO 70 board', (lt, d, t, blit) => {
      resetAll(); const cx = -17; placeCrowd(t, cx); env(t, cx); show([vesp]); vesp.at(-17.0, 0, 0.3).set({ mood: 'proud', armR: [150 + Math.sin(t * 8) * 10, 0], armL: [60, 0], blink: blink(t), talk: Math.sin(t * 12) > 0 });
      board(bAD, lt > 0.5, -16.2, 2.45, 0.3, 0.85, lt, 0.5);
      shoot([vesp], V3(-16.6, 1.6, 6.8), V3(-16.9, 1.55, 5.2), V3(-17.0, 1.3, 0.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 0.5, 'stamp', { gain: 0.8 }); cue(st + ta, 'knock', { gain: 0.6 }); }
  // 09 · tax desk, coins into the chest
  { const st = Wd('taxed', 3) - 0.06, tr = Wd('treasury.', 3) - st;
    sbs('S09', st, 'tax desk: Romans pay coins into a chest that overflows; crowd grumbles', (lt, d, t, blit) => {
      resetAll(); const cx = -10; placeCrowd(t, cx); env(t, cx); show([vesp, coll]); vis(coinFly, true);
      vesp.at(-10.5, 0, -2.0).set({ mood: 'smug', armR: [lt > tr ? 150 : 20, 0], blink: blink(t) }); coll.at(-11.8, 0, 0.5).set({ mood: 'sad', sweat: 1, armR: [90, 0], blink: blink(t, 1) });
      const c = (t * 2.2) % 1; coinFly.position.set(lerp(-11.5, -9.2, c), 1.3 + Math.sin(c * Math.PI) * 0.6, lerp(0.4, -1.3, c)); coinFly.rotation.y = t * 8; chest.pile.scale.set(1.5, 0.45 + 0.2 * Math.min(1, lt / d), 0.9);
      rain(t, lt > 0.8 ? (lt - 0.8) / 1.2 : -1, -9.0, -1.4, 1.2, 3);
      shoot([vesp, coll], V3(-10.5, 1.8, 7.0), V3(-10.2, 1.6, 5.6), V3(-10.4, 1.3, -1.3), null, eio(clamp(lt / d)), 42); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 5; k++) cue(st + 0.2 + k * 0.45, 'coin', { gain: 0.6 }); cue(st + tr, 'ding', { gain: 0.8 }); cue(st + tr + 0.1, 'sparkle', { gain: 0.6 }); }
  // 10 · Titus: disgusting
  { const st = cut(4), di = Wd('disgusting.', 4) - st;
    sbs('S10', st, 'Titus pinches his nose, turns green: disgusting', (lt, d, t, blit) => {
      resetAll(); const cx = -16.6; placeCrowd(t, cx); env(t, cx); show([titus, vesp]); titus.at(-16.1, 0, 0.5).set({ mood: lt > di - 0.4 ? 'angry' : 'worried', sweat: 1, armR: [155, 0], armL: [10, 0], blink: blink(t), lean: lt > di ? -8 : 0, talk: lt < di ? Math.sin(t * 12) > 0 : 0 });
      vesp.at(-17.6, 0, 0.2).set({ mood: 'sly', armR: [20, 0], blink: blink(t, 1) });
      shoot([titus, vesp], V3(-16.9, 1.5, 6.4), V3(-16.3, 1.45, 4.4), V3(-16.9, 1.2, 0.3), null, eio(clamp(lt / d)), 40); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.5, 'gasp', { gain: 0.8 }); cue(st + di, 'bruh', { gain: 0.7 }); }
  // 11 · coin held up
  { const st = Wd('So', 4) - 0.06 || 0, ho = Wd('coin', 4) - st;
    sbs('S11', st, 'Vespasian lifts a gold coin, it glints', (lt, d, t, blit) => {
      resetAll(); const cx = -17; placeCrowd(t, cx); env(t, cx); show([vesp, titus]); vis(coinH, lt > ho - 0.4);
      vesp.at(-17.5, 0, 0.3).set({ mood: 'smug', armR: [lt > ho - 0.4 ? 165 : 20, 0], blink: blink(t), talk: Math.sin(t * 12) > 0 && lt < ho }); titus.at(-16.0, 0, 0.5).set({ mood: 'worried', armR: [100, 0], blink: blink(t, 1) });
      coinH.position.set(-17.1, 2.0 + Math.sin(t * 3) * 0.03, 0.5); coinH.rotation.y = 0.5 + Math.sin(t * 2) * 0.4; coinH.scale.setScalar(Math.max(0.01, pop(lt, ho - 0.4)) * 1.0);
      shoot([vesp, titus], V3(-16.8, 1.7, 6.4), V3(-17.0, 1.8, 4.2), V3(-17.0, 1.5, 0.3), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + ho - 0.4, 'coin', { gain: 0.9 }); cue(st + ho - 0.35, 'sparkle', { gain: 0.6 }); }
  // 12 · "does it smell?" close on coin and nose
  { const st = Wd('coin', 4) + 0.35, sm = Wd('smell?', 4) - st;
    sbs('S12', st, 'extreme close: coin under Titus\'s nose, DOES IT SMELL? board', (lt, d, t, blit) => {
      resetAll(); const cx = -16.3; placeCrowd(t, cx); env(t, cx); show([titus, vesp]); vis(coinH, true);
      titus.at(-16.3, 0, 0.5).set({ mood: lt > sm ? 'shock' : 'worried', sweat: 1, armR: [10, 0], blink: blink(t), lean: 0 }); vesp.at(-17.5, 0, 0.3).set({ mood: 'smug', armR: [150, 0], blink: blink(t, 1), talk: Math.sin(t * 12) > 0 });
      const k = eo(clamp(lt / (d * 0.7))); coinH.position.set(lerp(-17.0, -16.7, k), lerp(1.95, 1.35, k), 0.75); coinH.rotation.y = 0.3; coinH.scale.setScalar(0.6);
      board(bSm, lt > sm - 0.5, -16.4, 2.4, 0.6, 0.85, lt, sm - 0.5);
      shoot([titus, vesp], V3(-16.5, 1.7, 3.6), V3(-16.4, 1.5, 2.4), V3(-16.4, 1.5, 0.5), null, eio(clamp(lt / d)), 30); blit(); });
    cue(st + 0.3, 'whoosh', { gain: 0.35 }); cue(st + sm - 0.5, 'pop', { gain: 0.7 }); cue(st + sm, 'stinger', { gain: 0.6 }); }
  // 13 · Titus sniffs: no
  { const st = cut(5), no = Wd('no.', 5) - st;
    sbs('S13', st, 'Titus sniffs the coin and says NO.', (lt, d, t, blit) => {
      resetAll(); const cx = -16.3; placeCrowd(t, cx); env(t, cx); show([titus, vesp]); vis(coinH, true);
      titus.at(-16.3, 0, 0.5).set({ mood: lt > no ? 'neutral' : 'worried', sweat: lt > no ? 0 : 1, armR: [10, 0], blink: blink(t), lean: lt < no ? 10 + Math.sin(t * 14) * 4 : 0, talk: lt > no - 0.2 && lt < no + 0.2 }); vesp.at(-17.5, 0, 0.3).set({ mood: 'sly', armR: [150, 0], blink: blink(t, 1) });
      coinH.position.set(-16.75, 1.35, 0.75); coinH.scale.setScalar(0.6); board(bNo, lt > no - 0.1, -16.3, 2.35, 0.6, 0.85, lt, no - 0.1);
      shoot([titus, vesp], V3(-16.5, 1.55, 3.4), V3(-16.4, 1.5, 3.0), V3(-16.4, 1.45, 0.5), null, eio(clamp(lt / d)), 32); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); for (let k = 0; k < 3; k++) cue(st + 0.1 + k * 0.17, 'step', { gain: 0.25 }); cue(st + no, 'tock', { gain: 0.7 }); cue(st + no, 'stamp', { gain: 0.5 }); }
  // 14 · yet it comes from urine
  { const st = Wd('replied,', 5) - 0.06, yt = Wd('urine.', 5) - st;
    sbs('S14', st, 'Vespasian smirks; Titus realises and recoils', (lt, d, t, blit) => {
      resetAll(); const cx = -16.8; placeCrowd(t, cx); env(t, cx); show([titus, vesp]); vis(coinH, lt < yt + 0.2);
      vesp.at(-17.5, 0, 0.3).set({ mood: lt > yt ? 'laugh' : 'smug', armR: [150, 0], blink: blink(t), talk: lt < yt ? Math.sin(t * 12) > 0 : 0 }); titus.at(-16.1, 0, 0.5).set({ mood: lt > yt ? 'shock' : 'neutral', sweat: lt > yt ? 1 : 0, armR: [lt > yt + 0.15 ? 155 : 10, 0], blink: blink(t, 1), lean: lt > yt ? -12 : 0 });
      coinH.position.set(-17.0, 2.0, 0.5); coinH.scale.setScalar(1.4);
      shoot([titus, vesp], V3(-16.9, 1.6, 6.0), V3(-16.8, 1.6, 4.8), V3(-16.8, 1.4, 0.3), null, eio(clamp(lt / d)), 38); blit(); });
    cue(st + 0.1, 'whoosh', { gain: 0.3 }); cue(st + yt - 0.05, 'dundun', { gain: 0.8 }); cue(st + yt + 0.1, 'gasp', { gain: 0.8 }); cue(st + yt + 0.5, 'badumtss', { gain: 0.6 }); }
  // 15 · PECUNIA NON OLET + coin rain
  { const st = cut(6), sy = Wd('saying,', 6) - st;
    sbs('S15', st, 'banner PECUNIA NON OLET over the forum, gold coin rain', (lt, d, t, blit) => {
      resetAll(); const cx = -16.8; placeCrowd(t, cx); env(t, cx); show([vesp, titus]); vesp.at(-17.4, 0, 0.3).set({ mood: 'proud', armR: [160 + Math.sin(t * 6) * 10, 0], armL: [150, 0], blink: blink(t) }); titus.at(-16.1, 0, 0.5).set({ mood: 'tired', armR: [10, 0], blink: blink(t, 1) });
      board(bPec, lt > 0.1, -16.8, 3.15, -0.5, 0.9, lt, 0.1); rain(t, lt / d, -16.8, 0.6, 3, 5);
      shoot([vesp, titus], V3(-16.8, 1.8, 7.4), V3(-16.8, 2.1, 6.2), V3(-16.8, 1.9, 0.2), V3(-16.8, 2.2, 0.2), eio(clamp(lt / d)), 44); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 0.1, 'stinger', { gain: 0.7 }); for (let k = 0; k < 5; k++) cue(st + 0.5 + k * 0.28, 'coin', { gain: 0.45 }); }
  // 16 · money does not stink: crowd cheers
  { const st = Wd('money', 6) - 0.06, mo2 = 0.3;
    sbs('S16', st, 'crowd cheers in the market, MONEY DOES NOT STINK sign', (lt, d, t, blit) => {
      resetAll(); const cx = -2; placeCrowd(t, cx); env(t, cx); show([vesp]); vesp.at(-1.6, 0, 0.9).set({ mood: 'laugh', armR: [160, 0], armL: [160, 0], blink: blink(t), bob: Math.abs(Math.sin(t * 8)) * 0.05 }); putMo(1.5, 3.4); mo.set({ mood: 'laugh', blink: blink(t, 0.3) });
      board(bMon, lt > mo2, -1.8, 2.6, 0.9, 0.9, lt, mo2); rain(t, lt / d, -1.8, 0.8, 3.4, 5);
      shoot([vesp, mo], V3(-1.9, 1.6, 8.2), V3(-1.9, 1.7, 7.0), V3(-1.9, 1.8, 0), null, eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.3 }); cue(st + 0.2, 'cheer', { gain: 0.9, dur: 1.6 }); cue(st + mo2, 'airhorn', { gain: 0.45 }); }
  // 17 · loop wide
  { const st = cut(7), ro = Wd('Rome', 7) - st;
    sbs('S17', st, 'wide market again, Mo with popcorn, Colosseum behind: "tax pee? It did"', (lt, d, t, blit) => {
      resetAll(); const cx = -2.5; placeCrowd(t, cx); env(t, cx); show([vesp]); vesp.at(-2.6, 0, 0.8).set({ mood: 'smug', armR: [20, 0], armL: [20, 0], blink: blink(t) }); putMo(0.4, 3.0); mo.set({ mood: 'sly', blink: blink(t, 0.3) }); vis(dog, true);
      shoot([vesp, mo], V3(-2.5, 1.5, 9.2), V3(-2.5, 1.5, 7.4), V3(-2.5, 2.2, -1), V3(-2.5, 1.7, 0), eio(clamp(lt / d)), 46); blit(); });
    cue(st, 'whoosh', { gain: 0.35 }); cue(st + 0.15, 'dundun', { gain: 0.5 }); cue(st + 1.0, 'crunch', { gain: 0.5 }); }
  // 18 · wink and gag
  { const st = Wd('money', 7) - 0.12, we = Wd('better.', 7) - st;
    sbs('S18', st, 'Vespasian winks at the camera and tosses a coin; sparkle; badumtss', (lt, d, t, blit) => {
      resetAll(); const cx = -2.2; placeCrowd(t, cx); env(t, cx); show([vesp]); vis(coinH, true); vesp.at(-2.2, 0, 0.8).set({ mood: lt > we - 0.4 ? 'happy' : 'smug', armR: [lt > we - 0.4 ? 160 : 120, 0], blink: lt > we - 0.3 && lt < we - 0.1 ? 1 : 0 });
      const fl2 = clamp((lt - we + 0.5) / 0.6); coinH.position.set(-1.8, 1.7 + Math.sin(fl2 * Math.PI) * 0.9, 0.8); coinH.rotation.x = t * 14; coinH.scale.setScalar(1.2);
      shoot([vesp], V3(-2.2, 1.5, 6.2), V3(-2.2, 1.6, 3.8), V3(-2.2, 1.4, 0.8), null, eio(clamp(lt / d)), 36); blit(); });
    cue(st + 0.1, 'whoosh', { gain: 0.3 }); cue(st + we - 0.5, 'coin', { gain: 0.8 }); cue(st + we - 0.1, 'sparkle', { gain: 0.9 }); cue(st + we, 'ding', { gain: 0.7 }); cue(st + we + 0.3, 'badumtss', { gain: 0.7 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
