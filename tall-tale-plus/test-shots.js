// TALL TALE+ detail test: three frames (top-down, eye-level, low wide).
import * as THREE from 'three';
import { camera } from './core/engine.js';
import * as WD from './core/world.js';
import * as DC from './core/decor.js';
import { Toon } from './core/toon.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const LOOK = {
  hero: { body: '#7FC8E8', hat: 'beanie', hatCol: '#D8343F', neck: 'collar', pattern: 'plain', extra: ['blush'] },
  pal: { body: '#6FA35A', pattern: 'overalls', patCol: '#3E5FA8', hat: 'boater', hatCol: '#E8C77A', band: '#B5372E', extra: ['mustache'] },
  cook: { body: '#F2F2F2', hat: 'tophat', hatCol: '#FFFFFF', neck: 'bowtie', neckCol: '#D8343F', pattern: 'apron', patCol: '#FFFFFF' },
};
export function buildShots(E) {
  const S = [], add = (o) => (S.push(o), o);
  const cam = camera(34);
  const IN = WD.interior(E, { wall: '#C98A52', motif: '#D9A06A', floor: '#8E5A38', ceiling: '#E8DCC0', signText: 'KITCHEN · OPEN LATE', picture: false, litter: false });
  DC.dress(IN, { seed: 2, rugCols: ['#2E6F8A', '#F2E6CF', '#B5372E'] });
  const hero = new Toon(LOOK.hero), pal = new Toon(LOOK.pal), cook = new Toon(LOOK.cook);
  [hero, pal, cook].forEach((p) => IN.scene.add(p.group));
  const ceilBits = []; IN.scene.traverse((o) => { if (o.isMesh && o.position.y > 4.15) ceilBits.push(o); });
  const render = (from, at, up = V3(0, 1, 0), fov = 34, look = {}) => { cam.fov = fov; cam.updateProjectionMatrix(); cam.up.copy(up); cam.position.copy(from); cam.lookAt(at); E.render(IN.scene, cam, { bloom: 0.12, aperture: 0.0008, maxblur: 0.006, focus: from.distanceTo(at), ...look }); };
  add({ id: 'A', at: 0, note: 'top-down: two lie on the rug', draw(lt, d, t, blit) {
    ceilBits.forEach((o) => (o.visible = false)); hero.at(-1.1, 0, -3.4).lay(0.5); pal.at(0.1, 0, -3.5).lay(-0.3); cook.group.visible = false;
    render(V3(-0.5, 11, -3.4), V3(-0.5, 0, -3.5), V3(0, 0, -1), 30, { aperture: 0 }); blit(); } });
  add({ id: 'B', at: 4, note: 'eye level, three people, dressed room', draw(lt, d, t, blit) {
    ceilBits.forEach((o) => (o.visible = true)); cook.group.visible = true; hero.lay(0, false).at(-1.2, 0, -3.2); pal.lay(0, false).at(0.2, 0, -3.0); cook.at(1.6, 0, -3.6);
    [hero, pal, cook].forEach((p) => p.face(cam)); cam.position.set(1.4, 1.5, 0.6);
    render(V3(1.6, 1.45, 0.7), V3(-0.6, 1.2, -3.6), V3(0, 1, 0), 38); [hero, pal, cook].forEach((p) => p.face(cam)); render(V3(1.6, 1.45, 0.7), V3(-0.6, 1.2, -3.6), V3(0, 1, 0), 38); blit(); } });
  add({ id: 'C', at: 8, note: 'low wide angle across the room', draw(lt, d, t, blit) {
    ceilBits.forEach((o) => (o.visible = true)); hero.lay(0, false).at(-0.8, 0, -4.2); pal.lay(0, false).at(-2.2, 0, -3.2); cook.at(1.0, 0, -5.0);
    cam.position.set(1.0, 0.7, 0.9); [hero, pal, cook].forEach((p) => p.face(cam)); render(V3(1.0, 0.75, 0.9), V3(-0.8, 1.1, -4.2), V3(0, 1, 0), 40); blit(); } });
  S.sort((a, b) => a.at - b.at);
  return { shots: S, cues: [] };
}
