// THE WAR OVER ONE PIG: shot list (Tall Tale+). One line = one shot; cut(i) = just before line i.
import * as THREE from 'three';
import { clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as PR from './core/props.js';
import * as DC from './core/decor.js';
import * as PW from './core/pigwar.js';
import { assertDistinct } from './core/cast.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mix = (a, b, k) => a.clone().lerp(b, k);
const blink = (t, off = 0) => (((t + off) % 3.3) < 0.12 ? 1 : 0);

// every character has its OWN look (assertDistinct below enforces it)
const LOOK = {
  farmer: { body: '#C97B4A', pattern: 'overalls', patCol: '#3E5FA8', hat: 'boater', hatCol: '#E8C77A', band: '#B5372E', extra: ['mustache'] },        // Lyman Cutlar
  griffin: { body: '#7A4A8A', pattern: 'vest', patCol: '#3A2A4A', hat: 'bowler', hatCol: '#2A2030', extra: ['glasses'] },                              // the Hudson's Bay man
  u1: { body: '#2E4E8A', hat: 'cap', hatCol: '#1B2F57', extra: ['mustache'] },
  u2: { body: '#4F78C4', hat: 'beanie', hatCol: '#E2B33C', extra: ['freckles'] },
  u3: { body: '#1F3A6E', hat: 'visor', hatCol: '#B5372E', extra: ['glasses'] },
  u4: { body: '#6A8FD0', pattern: 'vest', patCol: '#2E4E8A', hat: 'none', extra: ['blush', 'pencil'] },
  b1: { body: '#B5372E', hat: 'tophat', hatCol: '#222222', extra: ['monocle', 'mustache'] },
  b2: { body: '#9E2E3A', hat: 'boater', hatCol: '#F2E6CF', band: '#2E4E8A', extra: ['freckles'] },
  b3: { body: '#E26A5A', hat: 'mailcap', hatCol: '#7A1F28', extra: ['glasses'] },
  b4: { body: '#A8322E', pattern: 'apron', patCol: '#F2E6CF', hat: 'flower', hatCol: '#F2C230', extra: ['blush'] },
  kaiser: { body: '#3A3A48', pattern: 'vest', patCol: '#C9A13B', hat: 'bowler', hatCol: '#1F1C33', neck: 'collar', neckCol: '#F2E6CF', extra: ['mustache'] },
  c1: { body: '#4E7A6A', hat: 'visor', hatCol: '#E8C77A', extra: ['glasses', 'freckles'] },
  c2: { body: '#7A5A3A', hat: 'cap', hatCol: '#3A2A1A', extra: ['monocle'] },
  mo: { body: '#17171C', hat: 'none', neck: 'none', pattern: 'plain', hairCol: '#2A1A14', extra: ['blush'] },                                          // recurring sidekick
};
assertDistinct(Object.values(LOOK), 'pig-war cast');
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
  const vis = (o, v) => { (o.group || o).visible = v; }, show = (a) => a.forEach((o) => vis(o, true)), hide = (a) => a.forEach((o) => vis(o, false));
  const pop = (lt, t0, dur = 0.35) => eob(clamp((lt - t0) / dur));       // 0 → overshoot → 1

  // ── the island (day) and (sunset) ──
  const mkIsland = (sunset) => {
    const F = WD.meadow(E, { sunset, fenceOn: false, treesOn: false, flowers: true });
    F.scene.add(PW.sea(160, 60, -37));
    const cabin = PR.house({ wall: '#C9A06A', roof: '#7A3E26', trim: '#F2E6CF', door: '#3C6FB6' }); cabin.position.set(-7.5, 0, -3); cabin.scale.setScalar(1.3); F.scene.add(cabin);
    { const f = WD.fence(9); f.position.set(-5.5, 0, 0.4); f.rotation.y = 0.08; F.scene.add(f); const f2 = WD.fence(7); f2.position.set(3.2, 0, 0.9); f2.rotation.y = -0.12; F.scene.add(f2); }
    const bar = WD.barrel(); bar.position.set(-4.2, 0, 1.6); F.scene.add(bar); const cr = WD.crate(0.6); cr.position.set(-3.5, 0, 1.9); cr.rotation.y = 0.5; F.scene.add(cr); const cr2 = WD.crate(0.4); cr2.position.set(-3.55, 0.6, 1.9); F.scene.add(cr2);
    const post = WD.signBoard('POTATOES', { w: 1.4, h: 0.4, bg: '#6B4A2E', fg: '#F2E6CF' }); post.position.set(-2.9, 0.9, 1.6); post.rotation.y = 0.3; F.scene.add(post);
    { const sc = new THREE.Group(); const m = WD.mat({ color: '#6B4A2E' }); const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), m); pl.position.y = 0.8; sc.add(pl); const ar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), m); ar.rotation.z = Math.PI / 2; ar.position.y = 1.25; sc.add(ar);
      const hd = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), WD.mat({ color: '#E8D49A' })); hd.position.y = 1.75; sc.add(hd); const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 14), WD.mat({ color: '#C9A13B' })); hat.position.y = 1.9; sc.add(hat); const top = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.16, 12), WD.mat({ color: '#C9A13B' })); top.position.y = 1.98; sc.add(top);
      sc.position.set(3.4, 0, 1.5); sc.rotation.y = -0.4; F.scene.add(sc); }
    F.sun.key.position.set(sunset ? -9 : 7, sunset ? 5 : 12, 8); F.sun.key.target.position.set(0, 0, 2);
    Object.assign(F.sun.key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14 }); F.sun.key.shadow.camera.updateProjectionMatrix();
    F.bf = PW.butterflies(7, 4, sunset ? 3 : 1); F.bf.position.set(0, 0, 3.5); F.scene.add(F.bf); F.br = PW.birds(5); F.scene.add(F.br);
    return F;
  };
  const FD = mkIsland(false), SF = mkIsland(true);
  const mkMo = (scene) => { const mo = person('mo', { height: 1.5 }); const pc = PW.popcorn(1.2); scene.add(mo.group, pc); mo.pc = pc; mo.put = (x, y, z) => { mo.at(x, y, z); pc.position.set(x - 0.33, y + 0.82, z + 0.2); return mo; }; return mo; };

  // ── cast in the day field ──
  const farmer = person('farmer'), griffin = person('griffin'), US = ['u1', 'u2', 'u3', 'u4'].map((k) => person(k)), BR = ['b1', 'b2', 'b3', 'b4'].map((k) => person(k)), moF = mkMo(FD.scene);
  [farmer, griffin, ...US, ...BR].forEach((p) => FD.scene.add(p.group));
  const patch = PW.potatoPatch(5, 2.6, 2); patch.position.set(0, 0, 2.5); FD.scene.add(patch);
  const pig = PW.pig(0.85); FD.scene.add(pig); const gp = PW.ghostPig(1.0); FD.scene.add(gp);
  const gun = PW.rifle(1.2); FD.scene.add(gun);
  const ships = [[-3.6, -9], [-0.8, -12.5], [2.2, -10], [4.8, -15], [-6.5, -16]].map(([x, z], i) => { const s = PW.ship(1.25, i % 2 ? '#B5372E' : '#2E4E8A'); s.position.set(x, 0, z); s.rotation.y = 0.35 - i * 0.12; FD.scene.add(s); return s; });
  const cannons = [-2.0, -0.7, 0.7, 2.0].map((x, i) => { const c = PW.cannon(0.95); c.position.set(x, 0, 1.9 + (i % 2) * 0.3); c.rotation.y = i < 2 ? 0 : Math.PI; FD.scene.add(c); return c; });
  const tents = [[-5.0, 3.0], [-6.2, 4.4], [5.4, 3.2]].map(([x, z], i) => { const t = PW.tent(i < 2 ? '#C9B48A' : '#E8D9D0', 1.3); t.position.set(x, 0, z); FD.scene.add(t); return t; });
  const board = (txt, x, y, z) => { const b = WD.signBoard(txt, { w: 1.7, h: 0.5, bg: '#2E4E3F', fg: '#F2D37A' }); b.position.set(x, y, z); FD.scene.add(b); return b; };
  const boards = [board('400 SOLDIERS', -0.9, 3.0, 3.2), board('8 CANNONS', 0.9, 3.7, 3.2), board('5 WARSHIPS', 0.0, 4.4, 3.2)];
  // calendar for the 12-year glare
  const calC = document.createElement('canvas'); calC.width = 512; calC.height = 256; const calT = new THREE.CanvasTexture(calC); let calYear = '';
  const cal = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.9), new THREE.MeshBasicMaterial({ map: calT })); cal.position.set(0, 2.85, 3.1); FD.scene.add(cal);
  const drawCal = (y) => { if (y === calYear) return; calYear = y; const g = calC.getContext('2d'); g.fillStyle = '#F4EBD6'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#B5372E'; g.fillRect(0, 0, 512, 62); g.fillStyle = '#F4EBD6'; g.font = 'bold 44px Caladea, serif'; g.textAlign = 'center'; g.fillText('STILL GLARING', 256, 48); g.fillStyle = '#1F1C33'; g.font = 'bold 130px Caladea, serif'; g.fillText(y, 256, 200); calT.needsUpdate = true; };
  const tumble = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), new THREE.MeshStandardMaterial({ color: '#B89A5E', wireframe: true })); FD.scene.add(tumble);
  const allF = [farmer, griffin, ...US, ...BR, moF];
  const resetF = () => { hide(allF); hide(ships); hide(cannons); hide(boards); [pig, gp, gun, cal, tumble, moF.pc].forEach((o) => vis(o, false)); pig.reset(); pig.rotation.set(0, 0, 0); gun.flash.visible = false; };

  // ── the German emperor's office ──
  const OF = WD.interior(E, { w: 7, depth: 6, wall: '#3F5A7A', motif: '#4E6A8A', ceiling: '#2A2638', floor: '#6B3E26', signText: 'ARBITRATION  1872', counterOn: false, litter: false, picture: false });
  DC.dress(OF, { seed: 11, rugCols: ['#6B2E2E', '#E8D9A0', '#2E4E8A'], skip: ['rug2'] });
  const dk = PR.desk(2.6); dk.position.set(0.2, 0, -3.1); OF.scene.add(dk);
  const kai = person('kaiser'), c1 = person('c1'), c2 = person('c2'), oGrif = person('griffin'), oFarm = person('farmer'), moO = mkMo(OF.scene);
  [kai, c1, c2, oGrif, oFarm].forEach((p) => OF.scene.add(p.group));
  const mapQ = PR.poster(['SAN JUAN', 'ISLANDS', 'WHOSE??'], { w: 1.7, h: 2.0, bg: '#F4EBD6' }), mapA = PR.poster(['SAN JUAN', 'ISLANDS', 'USA!'], { w: 1.7, h: 2.0, bg: '#F4EBD6', accent: '#2E4E8A' });
  [mapQ, mapA].forEach((m) => { m.position.set(-2.3, 2.1, -5.7); m.scale.setScalar(0.85); OF.scene.add(m); });
  const stamp = new THREE.Group(); { const hd = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.22), WD.mat({ color: '#B5372E' })); hd.position.y = 0.0; const kn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.25, 10), WD.mat({ color: '#6B3E26' })); kn.position.y = 0.18; stamp.add(hd, kn); } OF.scene.add(stamp);
  const confetti = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.01, 0.04), new THREE.MeshBasicMaterial(), 120); { const c = new THREE.Color(); for (let i = 0; i < 120; i++) confetti.setColorAt(i, c.set(['#F2C230', '#D8343F', '#3C6FB6', '#FFFFFF', '#3E9A4A'][i % 5])); }
  OF.scene.add(confetti); const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), eul = new THREE.Euler();
  const rn = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  // ── sunset: the grave ──
  const sFarm = person('farmer'), sGrif = person('griffin'), moS = mkMo(SF.scene), tomb = PW.tombstone(['R.I.P.', 'PIG', '1859'], 1.2), sGhost = PW.ghostPig(0.75);
  [sFarm, sGrif].forEach((p) => SF.scene.add(p.group)); tomb.position.set(0, 0, 3.0); SF.scene.add(tomb, sGhost);
  { const fl = [['#F2C230', -0.5], ['#D8343F', -0.25], ['#F29BB5', 0.3], ['#FFFFFF', 0.55]]; fl.forEach(([c, x]) => { const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), WD.mat({ color: c })); s.position.set(x, 0.12, 3.5); SF.scene.add(s); const st = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.12, 5), WD.mat({ color: '#3E9A4A' })); st.position.set(x, 0.05, 3.5); SF.scene.add(st); }); }

  // ── 1 · hook: the pig in the potatoes, Mo with popcorn ──
  { const st = cut(0), cas = Wd('casualty?', 0) - st, pg = Wd('pig.', 0) - st;
    add({ id: 'S01', at: st, note: 'hook: close on a pig munching potatoes, Mo watches with popcorn; punch-in on "A pig."', draw(lt, d, t, blit) {
      resetF(); show([moF]); vis(moF.pc, true); vis(pig, true); pig.position.set(-0.25, 0, 3.4); pig.rotation.y = -Math.PI / 2 + 0.25; pig.munch(t);
      moF.put(0.7, 0, 4.7).set({ mood: lt > pg ? 'shock' : 'sly', blink: blink(t, 0.4), armR: [20, 0] });
      FD.bf.update(t); FD.br.update(t); patch.dig(t, -0.25, 3.4 - 2.5, lt > 0.5);
      const k = eio(clamp(lt / d)), punch = lt > pg ? eo(clamp((lt - pg) / 0.18)) : 0;
      shoot(FD.scene, [moF], V3(0.5, 1.0, 9.2), V3(0.3, 0.9, 7.0), V3(0.2, 0.7, 3.6), null, k, { ...LK.field, fov: 38 - 10 * punch }); blit();
    } });
    cue(st + 0.05, 'whoosh', { gain: 0.4 }); cue(st + cas, 'dundun', { gain: 0.7 }); cue(st + pg, 'scratch', { gain: 0.9 }); }

  // ── 2 · the farmer catches the pig digging ──
  { const st = cut(1), fa = Wd('farmer', 1) - st, po = Wd('potatoes.', 1) - st;
    add({ id: 'S02', at: st, note: 'farmer fuming at the potato patch while the pig digs; potatoes fly', draw(lt, d, t, blit) {
      resetF(); show([farmer, moF]); vis(moF.pc, true); vis(pig, true); pig.position.set(0.55, 0, 2.6); pig.rotation.y = 0.3; pig.munch(t * 1.2);
      farmer.at(-0.9, 0, 4.3).set({ mood: lt > fa + 0.3 ? 'angry' : 'worried', sweat: lt > fa ? 1 : 0, armR: lt > po ? [150, 10] : [40, -10], armL: [20, 10], blink: blink(t) });
      moF.put(1.05, 0, 5.0).set({ mood: lt > po ? 'tired' : 'sly', blink: blink(t, 0.4) });
      FD.bf.update(t); FD.br.update(t, -8, 9, -20); patch.dig(t, 0.55, 2.6 - 2.5, true);
      shoot(FD.scene, [farmer, moF], V3(-1.0, 1.1, 10.6), V3(0.6, 1.5, 9.8), V3(0.2, 1.0, 3.5), null, eio(clamp(lt / d)), { ...LK.field, fov: 40 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + fa, 'pop', { gain: 0.6 }); cue(st + po, 'bruh', { gain: 0.8 }); }

  // ── 3 · he shoots it; the pig was British ──
  { const st = cut(2), sh = Wd('it.', 2) - st, br = Wd('British.', 2) - st, bl = Wd('belonged', 2) - st;
    add({ id: 'S03', at: st, note: 'farmer aims, BANG, pig falls, ghost pig rises with a halo; the British man arrives, shocked', draw(lt, d, t, blit) {
      resetF(); show([farmer, moF]); vis(moF.pc, true); vis(pig, true); vis(gun, true);
      const fall = eo(clamp((lt - sh) / 0.35)); pig.position.set(0.7, 0, 2.6); pig.rotation.y = 0.3; if (lt < sh) pig.munch(t * 1.2); else pig.fall(fall);
      const kick = lt > sh && lt < sh + 0.25 ? 1 - (lt - sh) / 0.25 : 0;
      farmer.at(-0.95, 0, 4.3).set({ mood: lt > sh ? 'shock' : 'angry', armR: [70, -10], armL: [60, 20], blink: blink(t) });
      gun.position.set(-0.3 - kick * 0.1, 1.1, 4.2); gun.rotation.set(0, 0.7, 0); gun.flash.visible = lt > sh && lt < sh + 0.1;
      moF.put(-1.4, 0, 5.2).set({ mood: 'shock', blink: blink(t, 0.4) });
      if (lt > sh + 0.2) { vis(gp, true); const g = clamp((lt - sh - 0.2) / 1.6); gp.position.set(0.7, 0.5 + eo(g) * 1.5, 2.6); gp.rotation.y = -Math.PI / 2 + 0.3; gp.halo.rotation.z = t * 2; gp.idle(t); }
      if (lt > bl) { vis(griffin, true); const a = eo(clamp((lt - bl) / 0.7)); griffin.at(lerp(4.0, 1.4, a), 0, 4.1).set({ mood: lt > br ? 'shock' : 'worried', sweat: lt > br ? 1 : 0, armL: [30, 10], armR: lt > br ? [150, 20] : [20, 0], blink: blink(t, 1), legs: a < 1 ? 'walk' : 'stand', phase: t * 10 }); }
      const kz = eio(clamp((lt - br + 0.15) / 0.5));
      FD.bf.update(t); FD.br.update(t, -8, 9, -20);
      shoot(FD.scene, [farmer, griffin, moF], V3(-0.2, 1.3, 12.0), V3(-0.2, 1.3, 12.0), V3(0.2, 1.2, 3.2), V3(1.4, 1.5, 4.1), kz, { ...LK.field, fov: lerp(40, 30, kz) }); blit();
    } });
    cue(st + 0.05, 'whoosh', { gain: 0.4 }); cue(st + sh, 'slam', { gain: 0.8 }); cue(st + sh + 0.55, 'sparkle', { gain: 0.6 }); cue(st + br, 'stinger', { gain: 0.8 }); }

  // ── 4 · 64 American soldiers march in; Britain answers with warships ──
  { const st = cut(3), sx = Wd('sixty-four', 3) - st, wr = Wd('warships.', 3) - st, bn = Wd('Britain', 3) - st;
    add({ id: 'S04', at: st, note: 'four distinct soldiers march in; the camera whips to the sea where warships sail up', draw(lt, d, t, blit) {
      resetF(); show(US); show(tents.length ? [] : []); show([moF]); vis(moF.pc, true); show(ships.slice(0, 2));
      const k = clamp(lt / d);
      US.forEach((s, i) => s.at(-4.0 + eo(clamp(lt / 2.4)) * 2.8 + i * 0.75, 0, 3.4 - (i % 2) * 0.3).set({ legs: lt < 2.6 ? 'walk' : 'stand', phase: t * 9 + i * 1.3, mood: lt > wr ? 'shock' : 'proud', armL: [25, 0], armR: [25, 0], blink: blink(t, i) }));
      moF.put(1.5, 0, 5.2).set({ mood: lt > wr ? 'shock' : 'tired', blink: blink(t, 0.3) });
      ships.slice(0, 2).forEach((s, i) => { s.sway(t, i); s.position.z = lerp(-26, i ? -12.5 : -9, eo(clamp((lt - bn) / 1.6))) ; });
      FD.bf.update(t); FD.br.update(t, -8, 9, -20);
      const kk = eio(clamp((lt - bn + 0.2) / 0.9));
      shoot(FD.scene, [...US, moF], V3(0.2, 1.4, 11.6), V3(0.2, 1.6, 11.6), V3(-0.2, 1.2, 3.4), V3(0.4, 1.7, -11), kk, { ...LK.field, fov: 42 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.5 }); [0.5, 0.95, 1.4, 1.85].forEach((o) => cue(st + o, 'tock', { gain: 0.5 })); cue(st + sx, 'ding', { gain: 0.5 }); cue(st + wr, 'airhorn', { gain: 0.8 }); }

  // ── 5 · it escalates: 400 soldiers, 8 cannons, 5 warships, all for one pig ──
  { const st = cut(4), a4 = Wd('four', 4) - st, a8 = Wd('eight', 4) - st, a5 = Wd('five', 4) - st, pg = Wd('pig.', 4) - st;
    add({ id: 'S05', at: st, note: 'crane up: both armies line up, cannons, 5 ships; number boards pop in; tiny ghost pig in the middle', draw(lt, d, t, blit) {
      resetF(); show(US); show(BR); show(cannons); show(ships); show([moF]); vis(moF.pc, true); vis(boards[0], lt > a4); vis(boards[1], lt > a8); vis(boards[2], lt > a5);
      US.forEach((s, i) => s.at(-1.55 + i * 0.5, 0, 3.4).set({ mood: lt > pg ? 'shock' : 'angry', armR: [60, 0], armL: [20, 0], blink: blink(t, i), legs: 'stand', flip: 0 }));
      BR.forEach((s, i) => s.at(0.5 + i * 0.5, 0, 3.4).set({ mood: lt > pg ? 'shock' : 'angry', armR: [20, 0], armL: [60, 0], blink: blink(t, i + 2), legs: 'stand', flip: 1 }));
      moF.put(1.7, 0, 5.4).set({ mood: lt > pg ? 'tired' : 'worried', blink: blink(t, 0.3) });
      ships.forEach((s, i) => { s.position.z = [-9, -12.5, -10, -15, -16][i]; s.sway(t, i * 1.3); });
      [[boards[0], a4], [boards[1], a8], [boards[2], a5]].forEach(([b, t0]) => b.scale.setScalar(Math.max(0.01, pop(lt, t0))));
      if (lt > pg) { vis(gp, true); const g = eo(clamp((lt - pg) / 0.4)); gp.position.set(-0.05, 0.9 * g + Math.sin(t * 3) * 0.05, 4.3); gp.scale.setScalar(0.9 * g); gp.rotation.y = -Math.PI / 2; gp.halo.rotation.z = t * 2; gp.idle(t); }
      FD.bf.update(t); FD.br.update(t, -8, 9, -20);
      const k = eio(clamp(lt / d));
      shoot(FD.scene, [...US, ...BR, moF], V3(0, 1.0, 12.8), V3(0, 3.8, 13.8), V3(0, 1.8, 0.5), V3(0, 2.6, 0.0), k, { ...LK.field, fov: 48 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + a4, 'stamp', { gain: 0.7 }); cue(st + a8, 'stamp', { gain: 0.8 }); cue(st + a5, 'stamp', { gain: 0.9 }); cue(st + pg, 'boom', { gain: 0.9 }); }

  // ── 6 · twelve years of glaring ──
  { const st = cut(5), sh = Wd('shot', 5) - st, gl = Wd('glared', 5) - st, tw = Wd('twelve', 5) - st;
    add({ id: 'S06', at: st, note: 'standoff: armies glare, calendar flips 1859 to 1871, tumbleweed, Mo yawns with popcorn', draw(lt, d, t, blit) {
      resetF(); show(US); show(BR); show([moF]); vis(moF.pc, true); vis(cal, true); vis(tumble, true); vis(ships[1], true); vis(ships[2], true);
      const yrs = lt > gl ? 1859 + Math.floor(eio(clamp((lt - gl) / (d - gl))) * 13.99) : 1859; drawCal(String(Math.min(1872, yrs)));
      const stare = (i) => ['angry', 'angry', 'tired', 'angry'][i];
      US.forEach((s, i) => s.at(-1.55 + i * 0.52, 0, 3.4).set({ mood: lt > gl ? stare(i) : 'worried', armR: [25, 0], armL: [25, 0], blink: blink(t, i), legs: 'stand', sweat: i === 3 && lt > gl ? 1 : 0 }));
      BR.forEach((s, i) => s.at(0.55 + i * 0.52, 0, 3.4).set({ mood: lt > gl ? stare(3 - i) : 'worried', armR: [25, 0], armL: [25, 0], blink: blink(t, i + 2), legs: 'stand', flip: 1 }));
      moF.put(0.0, 0, 4.9).set({ mood: lt > tw ? 'tired' : 'sly', blink: blink(t, 0.3) });
      tumble.position.set(-4.5 + ((t * 1.1) % 9), 0.3, 4.5); tumble.rotation.z = -t * 3.5;
      ships[1].sway(t, 1); ships[2].sway(t, 2); FD.bf.update(t); FD.br.update(t, -8, 9, -20);
      shoot(FD.scene, [...US, ...BR, moF], V3(0, 1.4, 11.8), V3(0, 1.5, 10.2), V3(0, 1.7, 3.4), null, eio(clamp(lt / d)), { ...LK.field, fov: 44 }); blit();
    } });
    cue(st, 'crickets', { gain: 0.8, dur: 2.2 }); cue(st + sh, 'tock', { gain: 0.6 }); cue(st + gl + 0.4, 'tock', { gain: 0.5 }); cue(st + tw, 'glitch', { gain: 0.8 }); }

  // ── 7 · the emperor's committee rules ──
  { const st = cut(6), cm = Wd('committee', 6) - st, il = Wd('island', 6) - st, am = Wd('America.', 6) - st;
    add({ id: 'S07', at: st, note: 'office: emperor stamps the map USA, American cheers, British man sobs, confetti', draw(lt, d, t, blit) {
      mapQ.visible = lt < il + 0.2; mapA.visible = lt >= il + 0.2;
      const sk = lt > il - 0.35 && lt < il + 0.15 ? 1 - Math.abs((lt - il + 0.1) / 0.25) : 0;
      kai.at(0.2, 0, -4.2).set({ mood: lt > il ? 'proud' : 'smug', armR: [110, -20], blink: blink(t), legs: 'stand' });
      c1.at(-1.0, 0, -3.9).set({ mood: 'neutral', blink: blink(t, 1) }); c2.at(1.4, 0, -3.9).set({ mood: lt > am ? 'happy' : 'neutral', blink: blink(t, 2) });
      oFarm.at(-0.7, 0, -2.5).set({ mood: lt > am ? 'laugh' : 'worried', armL: lt > am ? [150, 10] : [30, 0], armR: lt > am ? [150, 10] : [30, 0], blink: blink(t, 0.5) });
      oGrif.at(0.7, 0, -2.4).set({ mood: lt > am ? 'sad' : 'worried', tears: lt > am ? 1 : 0, blink: blink(t, 1.5) });
      moO.put(1.5, 0, -1.4).set({ mood: lt > am ? 'sly' : 'tired', blink: blink(t, 0.3) });
      stamp.position.set(-0.5, 0.95 + 0.9 * (1 - sk), -3.0); stamp.rotation.y = 0.3;
      for (let i = 0; i < 120; i++) { const g = lt > am ? clamp((lt - am) * 0.55 + rn(i + 40) * 0.1) : 0; const vis2 = g > 0 && g < 1; m4.compose(V3(-3 + rn(i) * 6, vis2 ? 4.2 - g * 4.1 : -9, -5.2 + rn(i + 7) * 4.2), q.setFromEuler(eul.set(t * 3 + i, t * 2 + i * 0.4, i)), V3(1, 1, 1)); confetti.setMatrixAt(i, m4); } confetti.instanceMatrix.needsUpdate = true;
      shoot(OF.scene, [kai, c1, c2, oFarm, oGrif, moO], V3(0.8, 1.7, 3.6), V3(-0.4, 1.7, 3.2), V3(0.2, 1.3, -3.3), null, eio(clamp(lt / d)), { ...LK.room, fov: 46 }); blit();
    } });
    cue(st, 'whoosh', { gain: 0.4 }); cue(st + cm, 'ding', { gain: 0.6 }); cue(st + il, 'stamp', { gain: 1.0 }); cue(st + am, 'sparkle', { gain: 0.9 }); cue(st + am + 0.2, 'airhorn', { gain: 0.5, dur: 0.7 }); }

  // ── 8 · one pig dead, zero winners: the grave, and the loop back ──
  { const st = cut(7), de = Wd('dead.', 7) - st, ze = Wd('Zero', 7) - st, th = Wd('that?', 7) - st;
    add({ id: 'S08', at: st, note: 'sunset grave: ghost pig floats over the tombstone, both men mourn, Mo eats popcorn; ghost turns to camera on "that?"', draw(lt, d, t, blit) {
      sFarm.at(-1.05, 0, 3.9).set({ mood: 'sad', tears: 1, blink: blink(t), armR: [30, 10], armL: [30, 10] }); sGrif.at(0.95, 0, 3.9).set({ mood: 'sad', tears: 1, blink: blink(t, 1), armR: [30, 10], armL: [30, 10] });
      moS.put(1.35, 0, 5.2).set({ mood: lt > ze ? 'tired' : 'neutral', blink: blink(t, 0.3) });
      sGhost.position.set(0, 1.9 + Math.sin(t * 1.8) * 0.12, 3.0); const turn = eo(clamp((lt - th) / 0.3)); sGhost.rotation.y = -Math.PI / 2 + (1 - turn) * 0.9; sGhost.halo.rotation.z = t * 2; sGhost.idle(t);
      SF.bf.update(t); SF.br.update(t, -8, 9, -20);
      shoot(SF.scene, [sFarm, sGrif, moS], V3(0.3, 1.4, 11.8), V3(0.1, 1.6, 9.6), V3(0, 1.4, 3.4), V3(0, 1.7, 3.2), eio(clamp(lt / d)), { ...LK.field, bloom: 0.3, fov: 40 }, 9); blit();
    } });
    cue(st + de, 'dundun', { gain: 0.6 }); cue(st + ze, 'trombone', { gain: 0.9 }); cue(st + th, 'boing', { gain: 0.8 }); }

  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: CUES };
}
