// THE GREAT EMU WAR: shot list (Tall Tale+). One line = one shot; cut(i) = just before line i.
import * as THREE from 'three';
import { clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as DC from './core/decor.js';
import * as EM from './core/emu.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

const LOOK = {
  sold: { body: '#A8965C', hat: 'cap', hatCol: '#6E6038', neck: 'none', pattern: 'plain' },
  major: { body: '#8E8A4E', hat: 'cap', hatCol: '#5E5A32', neck: 'collar', neckCol: '#E8D9A0', extra: ['mustache', 'monocle'] },
  farmer: { body: '#C97B4A', pattern: 'overalls', patCol: '#3E5FA8', hat: 'boater', hatCol: '#E8C77A', band: '#B5372E', extra: ['mustache'] },
  farmer2: { body: '#6FA35A', pattern: 'vest', patCol: '#5A3A22', hat: 'bowler', hatCol: '#5A3A22', extra: ['glasses'] },
  farmer3: { body: '#7FA3C8', pattern: 'check', patCol: '#3E5FA8', hat: 'visor', hatCol: '#B5372E' },
  boy: { body: '#17171C', hat: 'none', neck: 'none', pattern: 'plain', hairCol: '#2A1A14', extra: ['blush'] },
};
const person = (k, o) => new Toon({ ...LOOK[k], extra: [...(LOOK[k].extra || [])] }, o);

export function buildShots(E) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.06);
  const cam = camera(36);
  const LK = { field: { bloom: 0.15, aperture: 0.0010, maxblur: 0.007 }, room: { bloom: 0.12, aperture: 0.0009, maxblur: 0.007 } };
  const shoot = (scene, people, from, to, at, at2, k, look, focus, up = V3(0, 1, 0)) => {
    if (cam.fov !== (look.fov || 36)) { cam.fov = look.fov || 36; cam.updateProjectionMatrix(); }
    cam.up.copy(up); cam.position.copy(mix(from, to, k)); const tgt = at2 ? mix(at, at2, k) : at; cam.lookAt(tgt);
    people.forEach((p) => p.face(cam));
    E.render(scene, cam, { ...look, focus: focus ?? cam.position.distanceTo(tgt) });
  };

  // ── the wheat field (day) and (sunset) ──
  const mkField = (sunset) => {
    const F = WD.meadow(E, { sunset, fenceOn: false, treesOn: false, flowers: false });
    const gold = new THREE.Mesh(new THREE.PlaneGeometry(70, 80), WD.mat({ map: WD.T.grass(sunset ? '#D8A24A' : '#D9B04A', [14, 16]) })); gold.rotation.x = -Math.PI / 2; gold.position.set(0, 0.015, -12); gold.receiveShadow = true; F.scene.add(gold);
    F.scene.add(EM.wheat(-30, 30, -42, 5, { n: 11000, clear: [[-6, 6, -9, 6]], seed: sunset ? 7 : 1 }));
    const dirt = new THREE.Mesh(new THREE.PlaneGeometry(14, 26), WD.mat({ map: WD.T.dirt('#B98A52', [3, 6]) })); dirt.rotation.x = -Math.PI / 2; dirt.position.set(0, 0.02, 2); dirt.receiveShadow = true; F.scene.add(dirt);
    const barn = PR.house({ wall: '#B5372E', roof: '#6B3E26', trim: '#F2E6CF', door: '#F2E6CF' }); barn.position.set(-13, 0, -22); barn.scale.setScalar(1.8); F.scene.add(barn);
    { const f = WD.fence(14); f.position.set(8, 0, -12); f.rotation.y = 0.15; F.scene.add(f); const f2 = WD.fence(10); f2.position.set(-9, 0, -8); F.scene.add(f2); }
    F.sun.key.position.set(sunset ? -9 : 7, sunset ? 5 : 12, 8); F.sun.key.target.position.set(0, 0, -2);
    Object.assign(F.sun.key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); F.sun.key.shadow.camera.updateProjectionMatrix();
    return F;
  };
  const FD = mkField(false), SF = mkField(true);
  const emuLine = (scene, n, seed = 1) => Array.from({ length: n }, (_, i) => { const e = EM.emu(0.95 + ((i * 37 + seed) % 10) / 80); scene.add(e); return e; });
  const place = (e, x, z, ry) => { e.position.set(x, 0, z); e.rotation.y = ry; };

  // cast in the day field
  const fSold = [person('sold'), person('sold'), person('sold')], fBoy = person('boy', { height: 1.5 }), fMaj = person('major');
  [...fSold, fBoy, fMaj].forEach((p) => FD.scene.add(p.group));
  const fEmu = emuLine(FD.scene, 26, 3), fGun = EM.lewisGun(1.6), fFlash = EM.flash(); fGun.add(fFlash); FD.scene.add(fGun);
  const truck = WD.car('#5E6B3A'); FD.scene.add(truck); const tSold = person('sold'); FD.scene.add(tSold.group);
  const fPeople = [...fSold, fBoy, fMaj, tSold];
  // sunset
  const sEmu = emuLine(SF.scene, 7, 9), sSold = [person('sold'), person('sold')], sBoy = person('boy', { height: 1.5 }), sMaj = person('major');
  [...sSold, sBoy, sMaj].forEach((p) => SF.scene.add(p.group));
  const medal = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 18), new THREE.MeshStandardMaterial({ color: '#F2C230', emissive: '#7A5A10', metalness: 0.5, roughness: 0.4 })); medal.rotation.x = Math.PI / 2; medal.position.set(0, 1.18, 0.62); sEmu[3].add(medal);

  // farm kitchen (farmers meet)
  const KI = WD.interior(E, { w: 8, depth: 7, wall: '#C98A52', motif: '#D9A06A', floor: '#8E5A38', ceiling: '#E8DCC0', signText: 'WESTERN AUSTRALIA WHEAT CO.', picture: false, litter: false, counterOn: false,
    view: null });
  DC.dress(KI, { seed: 5, rugCols: ['#2E6F8A', '#F2E6CF', '#B5372E'] });
  const kF = [person('farmer'), person('farmer2'), person('farmer3')]; kF.forEach((p) => KI.scene.add(p.group));
  const tel = PR.poster(['TELEGRAM', 'WE NEED', 'MACHINE GUNS'], { w: 0.9, h: 0.7, bg: '#F4EBD6' }); tel.position.set(-2.4, 1.0, -4.0); tel.rotation.x = -1.2; KI.scene.add(tel);

  // army office
  const OF = WD.interior(E, { w: 7, depth: 6, wall: '#5E6B3A', motif: '#6E7B48', ceiling: '#2A2638', floor: '#6B3E26', signText: 'MINISTER OF DEFENCE', counterOn: false, litter: false, picture: false });
  DC.dress(OF, { seed: 9, rugCols: ['#6B2E2E', '#E8D9A0', '#3A4A2E'], skip: ['rug2'] });
  const dk = PR.desk(2.6); dk.position.set(0.4, 0, -3.0); OF.scene.add(dk);
  const oGun = [EM.lewisGun(1.1), EM.lewisGun(1.1)]; oGun.forEach((g, i) => { g.position.set(-0.3 + i * 1.3, 0.9, -3.0); g.rotation.y = 0.2 - i * 0.4; OF.scene.add(g); });
  for (let i = 0; i < 10; i++) { const c = PR.parcel(0.5, 0.3, 0.35, false); c.position.set(1.8 + (i % 2) * 0.55, 0.15 + Math.floor(i / 2) * 0.32, -4.6); OF.scene.add(c); }
  const oMaj = person('major'), oSold = person('sold'); oMaj.at(0.4, 0, -3.9); oSold.at(-2.2, 0, -3.4); OF.scene.add(oMaj.group, oSold.group);
  const board = PR.poster(['REPORT', '986 EMUS', '9,860 ROUNDS'], { w: 1.5, h: 1.9, bg: '#F4EBD6' }); board.position.set(-2.55, 2.0, -5.7); board.scale.setScalar(0.85); OF.scene.add(board);
  const tallyOf = [oMaj, oSold];

  // sign for the bounties (in the day field)
  const bSign = new THREE.Group(); { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 8), WD.mat({ color: '#6B3E26' })); pole.position.y = 1.2; bSign.add(pole); const sb = WD.signBoard('BOUNTY: 57,034 EMUS', { w: 2.6, h: 0.9, bg: '#2E4E3F', fg: '#F2E6CF' }); sb.position.set(0, 2.2, 0.1); bSign.add(sb); bSign.position.set(1.8, 0, -3.2); FD.scene.add(bSign); bSign.visible = false; }
  const farmersF = [person('farmer'), person('farmer2'), person('farmer3')]; farmersF.forEach((p) => FD.scene.add(p.group)); fPeople.push(...farmersF);

  const vis = (o, v) => { (o.group || o).visible = v; }, hide = (arr) => arr.forEach((o) => vis(o, false)), show = (arr) => arr.forEach((o) => vis(o, true));
  const resetField = () => { [...fSold, fBoy, fMaj, tSold, ...farmersF].forEach((p) => (p.group.visible = false)); hide(fEmu); fGun.visible = false; truck.visible = false; bSign.visible = false; };

  // ── 1 · hook: soldiers face a row of emus ──
  { const st = cut(0), bd = Wd('birds', 0) - st;
    add({ id: 'S01', at: st, note: 'soldiers face a line of emus in the wheat field; boy cameo shocked', draw(lt, d, t, blit) {
      resetField(); show([...fSold, fBoy]); show(fEmu.slice(0, 6));
      fSold.forEach((s, i) => { s.at(-1.0 + i * 0.8, 0, 3.0 - (i % 2) * 0.3).set({ mood: lt > 0.5 ? 'worried' : 'proud', armR: [50, 10], armL: [20, 5], blink: blink(t, i), legs: 'stand' }); });
      fBoy.at(1.3, 0, 4.6).set({ mood: lt > bd ? 'shock' : 'neutral', blink: blink(t, 0.7) });
      fEmu.slice(0, 6).forEach((e, i) => { place(e, -1.7 + (i % 4) * 1.15, -1.6 - Math.floor(i / 4) * 1.8, 0.1 * (i - 2) + Math.PI); e.idle(t, i); });
      const k = eio(clamp(lt / d));
      shoot(FD.scene, fPeople, V3(0.4, 1.3, 9.6), V3(0.1, 1.4, 8.0), V3(0.0, 1.2, 0.0), null, k, { ...LK.field, fov: 40 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + bd, 'chirp', { gain: 0.6 }); }

  // ── 2 · 20,000 emus trampling wheat (top-down) ──
  { const st = cut(1), tw = Wd('Twenty', 1) - st;
    add({ id: 'S02', at: st, note: 'top-down: a flock of emus stampedes across the wheat', draw(lt, d, t, blit) {
      resetField(); show(fEmu);
      fEmu.forEach((e, i) => { const sp = 1.4 + (i % 5) * 0.15, x = -3.5 + (i % 6) * 1.4 + Math.sin(i) * 0.5, z0 = -12 - Math.floor(i / 6) * 3.2 - ((i * 7) % 5) * 0.4; place(e, x, z0 - lt * 1.6 * sp + 4, Math.PI + Math.sin(i * 3) * 0.2); e.run(t + i * 0.3, sp * 0.8); });
      shoot(FD.scene, [], V3(0, 15, -17), V3(0, 11, -23), V3(0, 0, -17), V3(0, 0, -23), eio(clamp(lt / d)), { ...LK.field, fov: 36, aperture: 0 }, null, V3(0, 0, -1)); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + tw, 'chirp', { gain: 0.6 }); cue(st + tw + 0.4, 'chirp', { gain: 0.5 }); }

  // ── 3 · farmers ask for machine guns (kitchen) ──
  { const st = cut(2), vt = Wd('veterans', 2) - st, mg = Wd('machine', 2) - st;
    add({ id: 'S03', at: st, note: 'three farmers around a table with a telegram; they ask for machine guns', draw(lt, d, t, blit) {
      kF[0].at(-0.6, 0, -3.2).set({ mood: lt > mg ? 'proud' : 'worried', sweat: lt < mg ? 1 : 0, armR: lt > mg ? [140, 0] : [30, -20], blink: blink(t) });
      kF[1].at(-1.9, 0, -3.8).set({ mood: lt > vt ? 'proud' : 'sad', armL: [30, -30], blink: blink(t, 1) });
      kF[2].at(0.7, 0, -4.0).set({ mood: lt > mg ? 'angry' : 'worried', armR: [50, -50], blink: blink(t, 2) });
      shoot(KI.scene, kF, V3(1.6, 1.6, 0.9), V3(0.5, 1.5, -0.2), V3(-0.8, 1.2, -3.5), null, eio(clamp(lt / d)), { ...LK.room, fov: 40 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + vt, 'pop', { gain: 0.5 }); cue(st + mg, 'stamp', { gain: 0.7 }); }

  // ── 4 · the army sends a major, two guns, 10,000 rounds ──
  { const st = cut(3), mj = Wd('major', 3) - st, rd = Wd('rounds', 3) - st;
    add({ id: 'S04', at: st, note: 'Major at the desk, two machine guns, crates of ammo', draw(lt, d, t, blit) {
      oMaj.set({ mood: lt > mj ? 'proud' : 'smug', armR: [30, -30], blink: blink(t) }); oSold.set({ mood: 'neutral', armL: [150, 0], blink: blink(t, 1) });
      shoot(OF.scene, tallyOf, V3(-2.2, 1.7, 0.7), V3(1.0, 1.7, 0.4), V3(0.8, 1.2, -3.4), null, eio(clamp(lt / d)), { ...LK.room, fov: 40 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + mj, 'ding', { gain: 0.7 }); cue(st + rd, 'stamp', { gain: 0.6 }); }

  // ── 5 · emus fast, split up, soldiers miss ──
  { const st = cut(4), sp = Wd('split', 4) - st, ms = Wd('missing', 4) - st;
    add({ id: 'S05', at: st, note: 'gunner fires, emus scatter in all directions, soldiers shocked', draw(lt, d, t, blit) {
      resetField(); show([fSold[0], fSold[1], fSold[2]]); fGun.visible = true; show(fEmu.slice(0, 14));
      fGun.position.set(0, 0, 3.6); fGun.rotation.y = Math.PI; fGun.scale.setScalar(1.0); fFlash.visible = Math.sin(t * 45) > 0.2 && lt > 0.4 && lt < sp + 1;
      fSold.forEach((s, i) => s.at(-1.0 + i * 1.0, 0, 3.0 + (i % 2) * 0.2).set({ mood: lt > ms ? 'shock' : 'angry', armR: [40, 10], armL: [30, 10], sweat: lt > ms ? 1 : 0, blink: blink(t, i) }));
      fEmu.slice(0, 14).forEach((e, i) => { const a = (i / 14) * Math.PI - Math.PI / 2 + Math.sin(i * 2.1) * 0.3, r = lerp(0.5, 5, eo(clamp((lt - 0.4 - i * 0.04) / 2.2))); place(e, Math.sin(a) * r * 0.9, -2.0 - Math.cos(a) * r * 1.4 - 0.5, a < 0 ? -Math.PI / 2 - 0.4 : Math.PI / 2 + 0.4); if (lt < 0.4) e.idle(t, i); else e.run(t + i, 1); });
      shoot(FD.scene, fPeople, V3(0.3, 1.2, 11.2), V3(0.0, 1.5, 10.2), V3(0, 1.2, -4), null, eio(clamp(lt / d)), { ...LK.field, fov: 42 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + 0.4, 'chug', { gain: 0.5 }); cue(st + sp, 'chirp', { gain: 0.6 }); cue(st + ms, 'boing', { gain: 0.6 }); }

  // ── 6 · gun jams, truck can't catch them ──
  { const st = cut(5), jm = Wd('jammed', 5) - st, tk = Wd('truck', 5) - st;
    add({ id: 'S06', at: st, note: 'jammed gun puff, then a truck chases speeding emus and loses', draw(lt, d, t, blit) {
      resetField(); fGun.visible = lt < tk - 0.2; show([tSold]); truck.visible = lt >= tk - 0.2; show(fEmu.slice(0, 8));
      if (lt < tk - 0.2) { fGun.position.set(0, 0, 4.3); fGun.rotation.y = Math.PI; fGun.scale.setScalar(1.0); fFlash.visible = false; fSold[0].group.visible = true; fSold[0].at(0.9, 0, 5.2).set({ mood: lt > jm ? 'angry' : 'neutral', sweat: lt > jm ? 1 : 0, armR: [40, 0] }); tSold.group.visible = false; }
      const k = clamp((lt - (tk - 0.2)) / (d - tk + 0.2)), tx = lerp(-5, 3.2, k);
      truck.position.set(tx, 0, 2.0); truck.rotation.y = Math.PI / 2; tSold.at(tx - 0.9, 1.15, 2.0).set({ mood: 'angry', armR: [150, 0], armL: [150, 0], sweat: 1 });
      fEmu.slice(0, 8).forEach((e, i) => { place(e, tx + 2.2 + k * 6 + (i % 4) * 1.0 + (lt > tk - 0.2 ? 0 : -30), 0, -0.2 - Math.floor(i / 4) * 1.4 - (i % 2) * 0.6, Math.PI / 2); e.run(t + i * 0.4, 1.2); });
      shoot(FD.scene, fPeople, V3(0, 1.5, 10.5), V3(0.6, 1.5, 9.6), V3(0.3, 1.0, 0.5), null, eio(clamp(lt / d)), { ...LK.field, fov: 40 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + jm, 'boing', { gain: 0.6 }); cue(st + tk, 'chug', { gain: 0.6 }); }

  // ── 7 · army out, back, out again ──
  { const st = cut(6), bk = Wd('back', 6) - st;
    add({ id: 'S07', at: st, note: 'soldiers march left, then right, then left again, emus watch', draw(lt, d, t, blit) {
      resetField(); show(fSold); show(fEmu.slice(0, 5));
      const k = clamp(lt / d), dx = -Math.sin(3 * Math.PI * k);
      fSold.forEach((s, i) => s.at(1.5 * Math.cos(3 * Math.PI * k) + i * 0.8 * (dx < 0 ? 1 : -1), 0, 3.2 - i * 0.3).set({ legs: 'walk', phase: t * 9 + i, mood: 'tired', flip: dx > 0 ? 1 : 0, armL: [25, 10], armR: [25, 10] }));
      fEmu.slice(0, 5).forEach((e, i) => { place(e, -1.6 + i * 0.9, -2.5 - (i % 2) * 1.4, Math.PI + 0.2 * Math.sin(i)); e.idle(t, i); });
      shoot(FD.scene, fPeople, V3(0, 1.3, 9.6), V3(0.2, 1.4, 9.0), V3(0, 1.2, 0), null, eio(k), { ...LK.field, fov: 42 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + bk, 'pop', { gain: 0.5 }); cue(L(7) - 0.5, 'whoosh', { gain: 0.4 }); }

  // ── 8 · major claims 986 emus ──
  { const st = cut(7), cl = Wd('claimed', 7) - st, bu = Wd('bullets', 7) - st;
    add({ id: 'S08', at: st, note: 'Major smug in front of the report board: 986 emus, 9,860 rounds', draw(lt, d, t, blit) {
      oGun.forEach((g) => (g.visible = false)); oMaj.at(-1.0, 0, -4.4).set({ mood: 'smug', armR: [110, -20], blink: blink(t), legs: 'stand' }); oSold.at(-2.8, 0, -3.8).set({ mood: lt > bu ? 'tired' : 'neutral', blink: blink(t, 1) });
      shoot(OF.scene, tallyOf, V3(0.2, 1.7, 0.4), V3(-0.6, 1.8, -0.5), V3(-1.7, 1.7, -5.0), null, eio(clamp(lt / d)), { ...LK.room, fov: 40 }); blit(); oGun.forEach((g) => (g.visible = true));
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + cl, 'ding', { gain: 0.7 }); cue(st + bu, 'stamp', { gain: 0.6 }); }

  // ── 9 · bounties, 57,034 ──
  { const st = cut(8), bo = Wd('Bounties.', 8) - st, nm = Wd('fifty-seven', 8) - st;
    add({ id: 'S09', at: st, note: 'farmers cheer beside a BOUNTY 57,034 sign, a few emus flee', draw(lt, d, t, blit) {
      resetField(); show(farmersF); bSign.visible = true; show(fEmu.slice(0, 4));
      farmersF.forEach((p, i) => p.at(-0.95 + i * 0.95, 0, 4.2 - (i % 2) * 0.3).set({ mood: lt > bo ? 'laugh' : 'worried', armL: lt > bo ? [150, 10] : [30, 0], armR: lt > bo ? [150, 10] : [30, 0], blink: blink(t, i) }));
      fEmu.slice(0, 4).forEach((e, i) => { place(e, -3 + ((lt * 2.4 + i * 3) % 10), -5.5 - i * 0.7, Math.PI / 2); e.run(t + i, 1); });
      bSign.position.set(0, 0, -1.0); bSign.scale.setScalar(0.85);
      shoot(FD.scene, fPeople, V3(0, 1.6, 10.2), V3(0, 1.8, 9.0), V3(0.0, 1.6, 0.0), null, eio(clamp(lt / d)), { ...LK.field, fov: 42 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + bo, 'ding', { gain: 0.7 }); cue(st + nm, 'stamp', { gain: 0.7 }); }

  // ── 10 · the emus won (sunset) ──
  { const st = cut(9), won = Wd('emus.', 9) - st, nw = Wd('never', 9) - st;
    add({ id: 'S10', at: st, note: 'sunset: emus stand proud, one wears a medal, soldiers sulk, boy shrugs', draw(lt, d, t, blit) {
      sEmu.forEach((e, i) => { place(e, -1.9 + (i % 4) * 1.25, -1.6 - Math.floor(i / 4) * 1.6, Math.PI + 0.1 * Math.sin(i * 2)); e.idle(t, i); });
      sSold.forEach((s, i) => s.at(-1.0 + i * 0.75, 0, 3.4).set({ mood: 'sad', tears: 0, blink: blink(t, i), legs: 'stand' }));
      sMaj.at(0.7, 0, 4.0).set({ mood: lt > won ? 'dizzy' : 'angry', blink: blink(t, 2) }); sBoy.at(1.4, 0, 5.0).set({ mood: lt > nw ? 'smug' : 'neutral', blink: blink(t, 0.6) });
      shoot(SF.scene, [...sSold, sMaj, sBoy], V3(0, 1.3, 10.4), V3(0.2, 1.5, 9.0), V3(0.1, 1.2, 0.5), null, eio(clamp(lt / d)), { ...LK.field, bloom: 0.3, fov: 42 }, 9); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + nw, 'pop', { gain: 0.5 }); cue(st + won, 'ding', { gain: 0.8 }); cue(st + won + 0.3, 'chirp', { gain: 0.6 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
