// Distinct-cast generator: every call returns looks that never share body colour AND hat AND extras with each other.
const BODY = ['#E8734A', '#4FA3C7', '#7BB661', '#E2B33C', '#B57EDC', '#E27A9A', '#5C6BC0', '#8D6E63', '#26A69A', '#C0504D', '#A8965C', '#F28C38'];
const HAT = ['cap', 'bowler', 'boater', 'beanie', 'visor', 'tophat', 'bow', 'mailcap', 'flower', 'bun', 'none'];
const HATCOL = ['#6E6038', '#5A3A22', '#E8C77A', '#B5372E', '#2E4E8A', '#222', '#E2B33C', '#7A4A8A', '#3E8A5A'];
const PAT = ['plain', 'overalls', 'vest', 'apron', 'check'];
const EXTRA = [[], ['mustache'], ['glasses'], ['freckles'], ['blush'], ['pencil'], ['monocle'], ['mustache', 'glasses'], ['freckles', 'blush']];
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function cast(n, seed = 1, fixed = []) {
  const out = [], used = { body: new Set(), hat: new Set(), sig: new Set() };
  fixed.forEach((l) => { out.push(l); used.body.add(l.body); used.hat.add(l.hat || 'none'); });
  let i = 0;
  while (out.length < n + fixed.length && i < 400) {
    const r = (k) => rnd(seed * 97 + i * 13 + k);
    const look = { body: BODY[Math.floor(r(1) * BODY.length)], hat: HAT[Math.floor(r(2) * HAT.length)], hatCol: HATCOL[Math.floor(r(3) * HATCOL.length)], pattern: PAT[Math.floor(r(4) * PAT.length)], patCol: HATCOL[Math.floor(r(5) * HATCOL.length)], extra: [...EXTRA[Math.floor(r(6) * EXTRA.length)]], band: '#B5372E' };
    i++;
    const sig = look.hat + '|' + look.extra.join();
    if (used.body.has(look.body) || used.hat.has(look.hat) && look.hat !== 'none' || used.sig.has(sig)) continue;
    used.body.add(look.body); used.hat.add(look.hat); used.sig.add(sig); out.push(look);
  }
  return out.slice(fixed.length);
}
/** throws if two looks are identical in body AND hat AND extras; call once with the whole scene cast */
export function assertDistinct(looks, label = 'cast') {
  const seen = new Map();
  looks.forEach((l, i) => { const k = [l.body, l.hat || 'none', (l.extra || []).join(), l.pattern || 'plain'].join('|'); if (seen.has(k)) throw new Error(label + ': characters ' + seen.get(k) + ' and ' + i + ' look identical'); seen.set(k, i); });
  const bodies = looks.map((l) => l.body); if (new Set(bodies).size < bodies.length) console.warn(label + ': two characters share a body colour');
}
