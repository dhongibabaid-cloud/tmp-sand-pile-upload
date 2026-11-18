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

## Worked example: The Great Emu War (2026-11-18)
`emu-war-source/` holds its shots.js, emu.js (emu, wheat field, Lewis gun props) and script.json. Lessons: the frame is a narrow portrait (about 22 degrees horizontal), so keep all people inside a ~3 m wide column in front of a camera 9 to 11 m back; show/hide Toons through `toon.group.visible`, not `toon.visible`; keep wheat stalks out of the camera's near zone; a 50 s Short renders in about 35 minutes at res 0.6.

## Upgrades (Pig War video)
- `decor.js`: rugs now sit at y 0.04 / 0.065 with polygonOffset, so they no longer z-fight with the floor (the "blinking carpet"). `dress()` passes the y value through.
- `cast.js`: `assertDistinct(looks)` throws if two characters share body + hat + extras + pattern; `cast(n, seed)` generates distinct looks. Give EVERY character its own look.
- `mix.py`: meme cues `boom scratch trombone airhorn stinger crickets bruh badumtss glitch dundun` (add to `cue(t,'boom')`). Vary them; never one effect all video.
- `flicker.py draft.mp4`: every-frame one-frame-blink detector. Render a low-res draft (`--draft`, `QS=&res=0.3`) and run it BEFORE the final render.
- Portrait frame is narrow (about 22 degrees horizontal): keep people in a 3 m column, camera 10 to 12 m back.
- Recurring character: Mo, the black-hoodie 3D boy cut-out, deadpan with a popcorn bucket, in every video.
- `pigwar.js` + `pig-war-source/`: worked example (props, shots, script).
