#!/usr/bin/env python3
"""Every-frame flicker check. usage: python3 tools/flicker.py draft.mp4 [out_dir]
A one-frame blink = frame i differs from BOTH neighbours while the neighbours match each other.
Writes review/flicker/*.jpg of the offending frames (with neighbours) and exits 1 if any are found."""
import subprocess, sys, numpy as np, pathlib
v = sys.argv[1]; out = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'review/flicker'); out.mkdir(parents=True, exist_ok=True)
W, H = 90, 160
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', v, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
f = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32); n = len(f); print(n, 'frames')
d = np.abs(f[1:] - f[:-1]).mean((1, 2))            # d[i] = diff between frame i and i+1
bad = []
for i in range(1, n - 1):
    a, b, c = d[i - 1], d[i], np.abs(f[i + 1] - f[i - 1]).mean()
    if min(a, b) > 1.5 and min(a, b) > 3 * (c + 0.3): bad.append((i, round(float(min(a, b)), 2)))
print('blinks:', bad[:40])
for i, s in bad[:40]:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', v, '-vf', f'select=between(n\\,{i-1}\\,{i+1}),scale=270:480,tile=3x1', '-frames:v', '1', str(out / f'blink_{i:05d}.jpg')])
sys.exit(1 if bad else 0)
