# Tall Tale+ (default look for every Short, from 2026-11-18)

Reference: the user's screenshot of a detailed cartoon style: egg-head stick people with long thin legs in richly lit, textured 3D rooms, varied camera angles (top-down, eye level, low wide), clutter, rugs, shelves, plants, one lower-third caption at a time. Characters are the user's own (3D boy sheet as the lead), never the reference's characters.

Built on the faceless-shorts `tall-tale` style (copy it with `new_video.sh tall-tale <name>`), plus:
1. `decor.js` -> copy to `src/core/decor.js`. `DC.dress(IN, { seed, rugCols })` fills a `WD.interior(...)` room (use `litter: false`); parts: rug, plant, shelf, artFrame, floorLamp, stool, roundTable, mug, bookStack, wallClock.
2. `Toon.lay(angle, on)`: add to `class Toon` in `src/core/toon.js` before `tint(col)`:
   `lay(ang = 0, on = true) { this.pivot.rotation.set(on ? -Math.PI / 2 : 0, 0, 0); this.group.rotation.y = on ? ang : 0; this.blob.visible = !on; this.pivot.position.y = on ? 0.03 : 0; return this; }`
   Top-down shot: camera at (x, 11, z), `cam.up = (0,0,-1)`, fov 30, hide ceiling meshes (position.y > 4.15), do not call `.face()` on laying people.
3. Cover frame: in `src/main.js` `draw(t)`, add `if (t < 0.15) t = Math.min(1.3, T.dur * 0.5);` after the clamp and use `const fade = clamp((T.dur - t) / 0.4);` (no fade-in) so the Instagram cover is never black.
4. Natural scene colors always (water blue, day sky blue, etc.). Render: `SOFTWARE_GL=1 QS='&res=0.6&aa=0&shadow=1024' FPS=24` (~2 s per frame, so a 40 s Short is ~1 h; run it in the background).

`test-shots.js` is the test scene used to make `test-frames.jpg`.
