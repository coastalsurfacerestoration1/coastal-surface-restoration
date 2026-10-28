"""CSR short renderer. Spec: recipes/csr-short.md.

Usage (from C:\\Code\\csr-brag):
  python recipes/csr-short/render.py check   jobs/<job>   # rule checks only
  python recipes/csr-short/render.py propose jobs/<job>   # no short.txt yet: pick windows, write short.draft.txt
  python recipes/csr-short/render.py review  jobs/<job>   # contact sheet for the eyewear/faces/plates check
  python recipes/csr-short/render.py approve jobs/<job>   # record that the review sheet was checked
  python recipes/csr-short/render.py render  jobs/<job>   # all outputs to brag-output/<job>/

Renders are previews only. Nothing here uploads or posts anything.
"""
import hashlib
import json
import re
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
CFG = json.loads((HERE / "config.json").read_text(encoding="utf-8"))
NAVY, AQUA, LINE = CFG["brand"]["navy"], CFG["brand"]["aqua"], CFG["brand"]["wipe_line"]
W = 1080
VENC = "-color_range tv -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -r 30".split()
AENC = "-c:a aac -b:a 192k -ar 48000 -ac 2".split()
SIZES = {
    # band height, caption font size, caption y, crop applied to the Fiverr video, photo area height
    "9x16": dict(H=1920, BAND=400, FS=60, TY="220+(180-text_h)/2", LCROP="null", PHOTO_MAX=1100),
    "4x5": dict(H=1350, BAND=204, FS=64, TY="(204-text_h)/2", LCROP="crop=1080:1350:0:160", PHOTO_MAX=1146),
}
AI_WORDS = ["elevate", "seamless", "unleash", "unlock", "transform", "revolution", "cutting-edge",
            "game-changer", "game changer", "effortless", "journey", "delve", "testament", "meticulous",
            "state-of-the-art", "next-level", "next level", "innovative", "magic", "stunning", "breathtaking"]
BANNED = ["certified", "certification", "eco-friendly", "eco friendly", "non-toxic", "nontoxic",
          "only", "first", "price", "prices", "pricing", "rate", "rates", "cheap", "cheapest", "discount"]
TOOL_WORDS = ["laser", "heat gun", "torch", "blast"]


class Refuse(Exception):
    pass


# ---------- helpers ----------

def run(args, capture=False):
    r = subprocess.run([str(a) for a in args], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise RuntimeError(f"command failed: {' '.join(map(str, args))[:300]}\n{r.stderr[-2000:]}")
    return (r.stdout + r.stderr) if capture else None


def ff(*args):
    run(["ffmpeg", "-v", "error", "-y", *args])


def duration(p):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], True).strip())


def size(p):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
               "-of", "csv=p=0", p], True).strip().split(",")
    return int(out[0]), int(out[1])


def loudness(p):
    out = run(["ffmpeg", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"], True)
    i = float(re.findall(r"^\s+I:\s+(-?[\d.]+) LUFS", out, re.M)[-1])
    peak = float(re.findall(r"^\s+Peak:\s+(-?[\d.inf]+) dBFS", out, re.M)[-1])
    return i, peak


def integrated(args):
    out = run(["ffmpeg", *args, "-af", "ebur128", "-f", "null", "-"], True)
    return float(re.findall(r"^\s+I:\s+(-?[\d.]+) LUFS", out, re.M)[-1])


def sha(p):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def esc(p):
    """Path for use inside a filtergraph option value."""
    return str(p).replace("\\", "/").replace(":", "\\:")


def num(x):
    return f"{x:g}"


def even(x):
    return int(round(x / 2)) * 2


# ---------- job file ----------

def parse_job(job):
    f = job / "short.txt"
    if not f.exists():
        raise Refuse(f"{f} is missing. Run 'propose' to pick clip windows, draft captions, and get Tyler's OK first.")
    spec = {"captions": [], "clips": [], "speed": 1.25, "music": "B", "frame916": {}, "frame45": {},
            "photo916": {}, "photo45": {}, "raw": f.read_text(encoding="utf-8")}
    for n, line in enumerate(spec["raw"].splitlines(), 1):
        line = line.split("#", 1)[0].strip()
        if not line:
            continue
        if ":" not in line:
            raise Refuse(f"short.txt line {n}: expected 'key: value', got '{line}'")
        key, val = [s.strip() for s in line.split(":", 1)]
        key = key.lower()
        if re.fullmatch(r"caption[123]", key):
            spec["captions"].append(val)
        elif key == "clip":
            m = re.fullmatch(r"(\S+)\s+([\d.]+)\s*-\s*([\d.]+)", val)
            if not m:
                raise Refuse(f"short.txt line {n}: clip must look like 'clip.mp4 2.0-9.5'")
            spec["clips"].append((m.group(1), float(m.group(2)), float(m.group(3))))
        elif key == "speed":
            spec["speed"] = float(val.rstrip("x"))
        elif key in ("music", "method", "permission", "subject"):
            spec[key] = val
        elif key in ("frame916", "frame45"):
            name, *opts = val.split()
            spec[key][name] = {k: float(v) for k, v in (o.split("=") for o in opts)}
        elif key in ("photo916", "photo45"):
            spec[key] = {k: int(v) for k, v in (o.split("=") for o in val.split())}
        else:
            raise Refuse(f"short.txt line {n}: unknown key '{key}'")
    return spec


def pairs(job):
    out = []
    for b in sorted(job.glob("before*.jpg")):
        a = job / b.name.replace("before", "after")
        if not a.exists():
            raise Refuse(f"{b.name} has no matching {a.name}")
        out.append((b, a))
    return out


# ---------- rules ----------

def caption_width(text, fs):
    """Rendered pixel extents of a caption at the given size: (left, right)."""
    font = CFG["assets"]["font"]["path"]
    tmp = ROOT / "brag-output" / "_caption_width.txt"
    tmp.parent.mkdir(exist_ok=True)
    tmp.write_text(text, encoding="utf-8")
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-f", "lavfi", "-i", "color=black:s=1600x200", "-frames:v", "1", "-vf",
         f"drawtext=fontfile='{esc(ROOT / font)}':textfile='{esc(tmp)}':fontsize={fs}:fontcolor=white:x=0:y=50,format=gray",
         "-f", "rawvideo", "-"], capture_output=True).stdout
    tmp.unlink()
    cols = [i % 1600 for i, v in enumerate(out) if v > 75]
    return (min(cols), max(cols)) if cols else (0, 0)


def check(job, spec):
    errors, warnings = [], []
    caps = spec["captions"]
    if len(caps) != 3:
        errors.append(f"need exactly 3 captions (caption1-3), found {len(caps)}")
    tool_hits = 0
    for i, c in enumerate(caps, 1):
        low = c.lower()
        words = len(c.split())
        if words > 6:
            errors.append(f"caption{i} has {words} words; keep it to about 5")
        if "\u2014" in c or "\u2013" in c or "--" in c:
            errors.append(f"caption{i} has a dash; no em dashes")
        if "!" in c:
            errors.append(f"caption{i} has an exclamation point")
        if re.search(r"\d|\$|%", c):
            errors.append(f"caption{i} has a number or symbol; no prices, rates, house numbers or plates")
        for w in BANNED:
            if re.search(rf"\b{re.escape(w)}\b", low):
                errors.append(f"caption{i} uses '{w}'")
        for w in AI_WORDS:
            if re.search(rf"\b{re.escape(w)}", low):
                errors.append(f"caption{i} uses '{w}', which reads as AI copy")
        if "chemical" in low and spec.get("method", "").lower() != "laser":
            errors.append(f"caption{i} claims no chemicals, but 'method: laser' is not set; that claim is only true for the laser step")
        if any(t in low for t in TOOL_WORDS):
            tool_hits += 1
        left, right = caption_width(c.upper(), SIZES["9x16"]["FS"])
        if right - left > 840:
            errors.append(f"caption{i} is {right - left} px wide at 60 px; it must fit 840 px to stay clear of the right 120 px. Shorten it.")
    if tool_hits > 1:
        errors.append(f"{tool_hits} captions name the tool; restoration first, the tool can be named once at most")

    perm = spec.get("permission", "").strip().lower()
    haystack = " ".join([job.name, spec["raw"], *[p.name for p in job.iterdir()]]).lower()
    client = next((c for c in CFG["clients"] if re.search(rf"\b{re.escape(c)}\b", haystack)), None)
    approved = re.fullmatch(r"client approved photos: yes, \d{4}-\d{2}-\d{2}", perm)
    if not perm:
        errors.append("no permission line; add 'permission: own piece' or 'permission: client approved photos: yes, YYYY-MM-DD'")
    elif client and not approved:
        errors.append(f"this looks like a client job ('{client}'); Tyler must confirm permission and the line must read 'client approved photos: yes, YYYY-MM-DD'")
    elif perm != "own piece" and not approved:
        errors.append(f"permission line not understood: '{spec['permission']}'")

    if spec.get("music", "B") not in CFG["music"]:
        errors.append(f"music '{spec['music']}' is not in config.json; add the Pixabay track there first (page URL, hash, start)")
    if not spec["clips"]:
        errors.append("no clip windows; add 'clip: <file> <in>-<out>' lines")
    for name, a, b in spec["clips"]:
        if not (job / name).exists():
            errors.append(f"clip file {name} not found in the job folder")
        elif b > duration(job / name) + 0.01:
            errors.append(f"clip window {name} {a}-{b} runs past the end of the file")
    clip_len = sum((b - a) / spec["speed"] for _, a, b in spec["clips"])
    if not 15 <= clip_len <= 18.05:
        errors.append(f"clip section is {clip_len:.1f} s at {spec['speed']}x; it must be 15 to 18 s")
    if not pairs(job):
        errors.append("no before.jpg / after.jpg pair")

    for key in ("fiverr", "font"):
        a = CFG["assets"][key]
        if not (ROOT / a["path"]).exists() or sha(ROOT / a["path"]) != a["sha256"]:
            errors.append(f"shared asset {a['path']} is missing or changed (hash mismatch)")
    m = CFG["music"].get(spec.get("music", "B"))
    if m and (not (ROOT / m["path"]).exists() or sha(ROOT / m["path"]) != m["sha256"]):
        errors.append(f"music file {m['path']} is missing or changed (hash mismatch)")
    return errors, warnings


def input_hash(job, spec):
    h = hashlib.sha256(spec["raw"].encode())
    files = {n for n, _, _ in spec["clips"]} | {p.name for pr in pairs(job) for p in pr}
    for name in sorted(files):
        h.update(name.encode() + sha(job / name).encode())
    return h.hexdigest()


# ---------- work-point tracking ----------

def track(src, a, b, fps=4):
    """Laser spark (brightest small cluster) per frame, else motion centroid. Source pixel coords."""
    sw, sh = size(src)
    aw = 180
    ah = even(sh * aw / sw)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", num(a), "-t", num(b - a), "-i", str(src), "-vf",
                          f"fps={fps},scale={aw}:{ah},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    n = len(raw) // (aw * ah)
    pts, prev = [], None
    for i in range(n):
        f = raw[i * aw * ah:(i + 1) * aw * ah]
        mx = max(f)
        if mx >= 245:
            sel = [j for j, v in enumerate(f) if v >= mx - 3]
        elif prev is not None:
            sel = [j for j in range(len(f)) if abs(f[j] - prev[j]) > 40]
        else:
            sel = []
        prev = f
        if sel:
            pts.append((sum(j % aw for j in sel) / len(sel) * sw / aw, sum(j // aw for j in sel) / len(sel) * sh / ah))
    return pts


def spread(vals, lo=0.05, hi=0.95):
    v = sorted(vals)
    return v[int(lo * (len(v) - 1))], v[int(hi * (len(v) - 1))]


def frame_for(job, spec, name, sz, notes):
    """Scale and crop for one clip file in one size."""
    s = SIZES[sz]
    CH = s["H"] - s["BAND"]
    sw, sh = size(job / name)
    over = spec["frame916" if sz == "9x16" else "frame45"].get(name)
    pts = [p for n, a, b in spec["clips"] if n == name for p in track(job / name, a, b)]
    xs, ys = ([p[0] for p in pts], [p[1] for p in pts]) if pts else ([sw / 2], [sh / 2])
    (x0p, x1p), (y0p, y1p) = spread(xs), spread(ys)
    if sz == "9x16":
        zoom = over.get("zoom", 1.3) if over else 1.3
        k = zoom * CH / sh
        if sw * k < W:
            k = W / sw
        ssw, ssh = int(sw * k), int(sh * k)
        if over:
            x, y = int(over["x"]), int(over["y"])
        else:
            # work point centered near frame x 480 (clear of the right 120 px) and y 960
            x = int(min(max((x0p + x1p) / 2 * k - 480, 0), ssw - W))
            y = int(min(max((y0p + y1p) / 2 * k - (960 - s["BAND"]), 0), ssh - 2))
            notes.append(f"{name} 9:16 framing picked automatically: zoom {zoom}, crop x {x}, y {y}")
        ch = min(CH, ssh - y) // 2 * 2
        f = f"scale={ssw}:{ssh}:flags=lanczos,crop={W}:{ch}:{x}:{y},pad={W}:{CH}:0:0:color={NAVY}"
        mapper = lambda px, py: (px * k - x, s["BAND"] + py * k - y)
    else:
        k = W / sw if sw / sh <= W / CH else CH / sh
        ssw, ssh = int(sw * k), int(sh * k)
        if over:
            x, y = int(over.get("x", 0)), int(over["y"])
        else:
            x = int(min(max((x0p + x1p) / 2 * k - W / 2, 0), ssw - W))
            y = int(min(max((y0p + y1p) / 2 * k - CH / 2, 0), ssh - CH))
            notes.append(f"{name} 4:5 framing picked automatically: crop x {x}, y {y}")
        f = f"scale={W}:{ssh}:flags=lanczos,crop={W}:{CH}:{x}:{y}" if ssw == W else \
            f"scale={ssw}:{ssh}:flags=lanczos,crop={W}:{CH}:{x}:{y}"
        mapper = lambda px, py: (px * k - x, s["BAND"] + py * k - y)
    if sz == "9x16" and pts:
        fx = [mapper(px, py)[0] for px, py in pts]
        fy = [mapper(px, py)[1] for px, py in pts]
        notes.append(f"{name} 9:16 work point lands at x {min(fx):.0f}-{max(fx):.0f}, y {min(fy):.0f}-{max(fy):.0f}")
        if max(fx) >= 960 or min(fy) < 300 or max(fy) > 1500:
            raise Refuse(f"{name}: the work point leaves the 9:16 safe area (x {min(fx):.0f}-{max(fx):.0f}, "
                         f"y {min(fy):.0f}-{max(fy):.0f}); set frame916 by hand")
    return f


# ---------- render ----------

def render(job, spec, out, notes):
    work = out / "_work"
    work.mkdir(parents=True, exist_ok=True)
    fiv = CFG["assets"]["fiverr"]
    logo = ROOT / fiv["path"]
    font = f"fontfile='{esc(ROOT / CFG['assets']['font']['path'])}'"
    music = CFG["music"][spec.get("music", "B")]
    gain = f"{num(fiv['gain_db'])}dB"
    for i, c in enumerate(spec["captions"], 1):
        (work / f"c{i}.txt").write_text(c.upper(), encoding="utf-8")
    (work / "before.txt").write_text("BEFORE", encoding="utf-8")
    (work / "after.txt").write_text("AFTER", encoding="utf-8")
    sp = num(spec["speed"])
    clip_len = sum((b - a) / spec["speed"] for _, a, b in spec["clips"])
    results = {}

    for sz, s in SIZES.items():
        H, BAND = s["H"], s["BAND"]
        T = work / sz
        T.mkdir(exist_ok=True)

        def cap(fname, a, b, color="white"):
            return (f"drawtext={font}:textfile='{esc(work / fname)}':fontsize={s['FS']}:fontcolor={color}:"
                    f"x=(w-text_w)/2:y={s['TY']}:enable='between(t,{num(a)},{num(b)})':"
                    f"alpha='min(1,(t-{num(a)})/0.25)*min(1,({num(b)}-t)/0.25)'")

        # intro and outro
        ff("-ss", num(fiv["intro_start"]), "-i", logo, "-vf", f"fps=30,{s['LCROP']},setsar=1,scale=out_range=tv,format=yuv420p",
           "-af", f"volume={gain},afade=t=in:d=0.15", *VENC, *AENC, T / "1_intro.mp4")
        ff("-i", logo, "-vf", f"fps=30,{s['LCROP']},setsar=1,scale=out_range=tv,format=yuv420p",
           "-af", f"volume={gain}", *VENC, *AENC, T / "4_outro.mp4")

        # clip windows
        frames = {name: frame_for(job, spec, name, sz, notes) for name in {n for n, _, _ in spec["clips"]}}
        segs = []
        for i, (name, a, b) in enumerate(spec["clips"], 1):
            seg = T / f"2_seg{i}.mp4"
            ff("-ss", num(a), "-t", num(b - a), "-i", job / name, "-an", "-vf",
               f"setpts=PTS/{sp},fps=30,{frames[name]},eq=contrast=1.05:saturation=1.08,setsar=1", *VENC, seg)
            segs.append(seg)
        (T / "segs.txt").write_text("".join(f"file '{p.as_posix()}'\n" for p in segs), encoding="utf-8")
        slot = clip_len / 3
        caps = ",".join(cap(f"c{i + 1}.txt", i * slot + (0.3 if i == 0 else 0.2), (i + 1) * slot - (0.4 if i == 2 else 0.2))
                        for i in range(3))
        ff("-f", "concat", "-safe", "0", "-i", T / "segs.txt", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
           "-filter_complex", f"[0]pad={W}:{H}:0:{BAND}:color={NAVY},fade=t=in:st=0:d=0.3,{caps},scale=out_range=tv,format=yuv420p[v]",
           "-map", "[v]", "-map", "1:a", "-t", num(clip_len), *VENC, *AENC, T / "2_clip.mp4")

        # before/after pairs
        ps = spec["photo916" if sz == "9x16" else "photo45"]
        PM = s["PHOTO_MAX"]

        def ba(before, after, hold, fade, color, dest):
            pw, ph = size(before)
            if ps:
                iw = ps["width"]
                ih = even(iw * ph / pw)
                top = ps.get("crop_top", 0)
            else:  # fit uncropped inside 85% width x photo area
                iw = min(918 if sz == "9x16" else 1026, even(PM * pw / ph))
                ih = even(iw * ph / pw)
                top = 0
            vh = min(PM, ih - top)
            ix, iy = (W - iw) // 2, BAND + (PM - vh) // 2
            imgf = f"scale={iw}:{ih},crop={iw}:{vh}:0:{top},pad={W}:{H}:{ix}:{iy}:color={NAVY},setsar=1,fps=30,scale=out_range=tv,format=yuv420p"
            ln, fst = 2.9 + hold + fade, 2.9 + hold
            ff("-loop", "1", "-t", "3.0", "-i", before, "-loop", "1", "-t", num(ln), "-i", after,
               "-f", "lavfi", "-t", num(ln), "-i", "anullsrc=r=48000:cl=stereo", "-filter_complex",
               f"[0]{imgf}[b];[1]{imgf}[a];[b][a]xfade=transition=wiperight:duration=1.4:offset=1.5[x];"
               f"[x]drawbox=x='if(between(t,1.5,2.9),{ix}+(t-1.5)/1.4*{iw}-4,-20)':y={iy}:w=8:h={vh}:color={LINE}:t=fill,"
               f"drawbox=x=0:y=0:w={W}:h={BAND}:color={NAVY}:t=fill,"
               f"{cap('before.txt', 0, 1.8)},{cap('after.txt', 2.6, ln + 0.5, AQUA)},"
               f"fade=t=in:d=0.2,fade=t=out:st={num(fst)}:d={num(fade)}:color={color},scale=out_range=tv,format=yuv420p[v]",
               "-map", "[v]", "-map", "2:a", "-t", num(ln), *VENC, *AENC, dest)
            return dict(width=iw, visible=vh, crop_top=top, y=iy)

        prs = pairs(job)
        ba_parts, gbp_parts, photo = [], [], None
        for i, (bf, af) in enumerate(prs):
            last = i == len(prs) - 1
            p = T / f"3_ba{i + 1}.mp4"
            photo = ba(bf, af, 3.0 if last else 1.5, 0.2, "black", p)
            ba_parts.append(p)
            if sz == "9x16":
                if last:
                    g = T / f"3_ba{i + 1}_google.mp4"
                    ba(bf, af, 2.5, 0.5, "white", g)
                    gbp_parts.append(g)
                else:
                    gbp_parts.append(p)
        if not ps:
            notes.append(f"{sz} photos sized automatically: {photo['width']} px wide, uncropped")

        # join and music
        nom = out / f"{job.name}-{sz}-nomusic.mp4"
        concat(T, [T / "1_intro.mp4", T / "2_clip.mp4", *ba_parts, T / "4_outro.mp4"], nom)
        di, do, dt = duration(T / "1_intro.mp4"), duration(T / "4_outro.mp4"), duration(nom)
        mstart = di - 0.4
        mlen = dt - do + 0.5 - mstart
        mus = out / f"{job.name}-{sz}.mp4"
        mix(nom, music, mstart, mlen, mlen - 1.0, 1.0, mus)
        results[sz] = dict(music=mus, nomusic=nom, intro=di, clip_end=di + clip_len, outro_start=dt - do, total=dt, photo=photo)

        if sz == "9x16":
            gtmp = T / "google_nomusic.mp4"
            concat(T, [T / "1_intro.mp4", T / "2_clip.mp4", *gbp_parts], gtmp)
            gt = duration(gtmp)
            glen = gt - mstart
            gout = out / f"{job.name}-google-9x16.mp4"
            mix(gtmp, music, mstart, glen, glen - 1.5, 1.5, gout)
            results["google"] = dict(music=gout, total=duration(gout))
            if results["google"]["total"] >= 30:
                notes.append(f"WARNING: the Google cut is {results['google']['total']:.2f} s, not under 30 s; trim the clip windows")
    return results


def concat(T, parts, dest):
    lst = T / f"{dest.stem}.txt"
    lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
    ff("-f", "concat", "-safe", "0", "-i", lst, *VENC, *AENC, "-movflags", "+faststart", dest)


def mix(nom, music, mstart, mlen, fade_st, fade_d, dest):
    """Music under the Fiverr audio: in on its downbeat as the intro ends, levelled so the mix lands on -14 LUFS."""
    src = ROOT / music["path"]
    delay = int(mstart * 1000)
    mg = -14.5 - integrated(["-ss", num(music["start"]), "-t", num(mlen), "-i", src])
    for _ in range(2):
        ff("-i", nom, "-ss", num(music["start"]), "-t", num(mlen), "-i", src, "-filter_complex",
           f"[1:a]aresample=48000,volume={num(mg)}dB,afade=t=in:d=0.4,afade=t=out:st={num(fade_st)}:d={num(fade_d)},"
           f"adelay={delay}|{delay}[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.79:level=false[a]",
           "-map", "0:v", "-map", "[a]", "-c:v", "copy", *AENC, "-movflags", "+faststart", dest)
        mg += -14 - integrated(["-i", dest])


# ---------- frames, review, report ----------

SAFE = ("drawbox=x=0:y=0:w=1080:h=220:color=red@0.25:t=fill,drawbox=x=0:y=1540:w=1080:h=380:color=red@0.25:t=fill,"
        "drawbox=x=960:y=0:w=120:h=1920:color=red@0.25:t=fill,drawbox=x=0:y=218:w=1080:h=4:color=red:t=fill,"
        "drawbox=x=0:y=1538:w=1080:h=4:color=red:t=fill,drawbox=x=958:y=0:w=4:h=1920:color=red:t=fill")


def grab(src, t, dest, vf=None):
    ff("-ss", num(round(t, 2)), "-i", src, "-frames:v", "1", *(["-vf", vf] if vf else []), "-q:v", "3", dest)


def frames(job, res, out):
    fd = out / "frames"
    fd.mkdir(exist_ok=True)
    for sz in SIZES:
        r = res[sz]
        npairs = len(pairs(job))
        ba_start = r["clip_end"]
        last_ba = ba_start + (npairs - 1) * 4.6
        shots = {"1-intro-end": r["intro"] - 0.2, "2-clip-a": r["intro"] + (r["clip_end"] - r["intro"]) / 6,
                 "2-clip-mid": (r["intro"] + r["clip_end"]) / 2, "2-clip-c": r["clip_end"] - (r["clip_end"] - r["intro"]) / 6,
                 "3-before": last_ba + 0.9, "3-wipe": last_ba + 2.1, "3-after": last_ba + 4.5,
                 "4-outro-end": r["total"] - 0.2}
        for k, t in shots.items():
            grab(r["music"], t, fd / f"{sz}-{k}.jpg")
        ins = []
        for k in shots:
            ins += ["-i", fd / f"{sz}-{k}.jpg"]
        n = len(shots)
        ff(*ins, "-filter_complex", "".join(f"[{i}]scale=-2:640[s{i}];" for i in range(n)) +
           "".join(f"[s{i}]" for i in range(n)) + f"hstack={n}", "-q:v", "3", fd / f"contact-sheet-{sz}.jpg")
        if sz == "9x16":
            for k in ("2-clip-mid", "3-before", "3-after"):
                grab(r["music"], shots[k], fd / f"safezone-9x16-{k[2:]}.jpg", SAFE)
    g = res["google"]
    grab(g["music"], g["total"] - 0.7, fd / "google-9x16-after.jpg")
    grab(g["music"], g["total"] - 0.05, fd / "google-9x16-last-frame.jpg")


def review_sheet(job, spec, dest):
    """Frames every 1 s of each clip window plus the photos, for the eyewear/faces/plates check."""
    dest.mkdir(parents=True, exist_ok=True)
    imgs = []
    for i, (name, a, b) in enumerate(spec["clips"], 1):
        t = a
        while t < b:
            p = dest / f"w{i}_{t:05.1f}.jpg"
            grab(job / name, t, p, "scale=-2:480")
            imgs.append(p)
            t += 1.0
    for b, a in pairs(job):
        for p in (b, a):
            q = dest / f"photo_{p.stem}.jpg"
            ff("-i", p, "-vf", "scale=-2:480", q)
            imgs.append(q)
    cols = 8
    rows = -(-len(imgs) // cols)
    ins = []
    for p in imgs:
        ins += ["-i", p]
    pad = cols * rows - len(imgs)
    fc = "".join(f"[{i}]scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2[s{i}];" for i in range(len(imgs)))
    fc += "".join(f"color=black:s=270x480:d=1[p{i}];" for i in range(pad))
    labels = [f"[s{i}]" for i in range(len(imgs))] + [f"[p{i}]" for i in range(pad)]
    layout = "|".join(f"{(i % cols) * 270}_{(i // cols) * 480}" for i in range(len(labels)))
    ff(*ins, "-filter_complex", fc + "".join(labels) + f"xstack=inputs={len(labels)}:layout={layout}", "-frames:v", "1",
       "-q:v", "3", dest / "review-sheet.jpg")
    return dest / "review-sheet.jpg"


def report(job, spec, res, out, notes):
    m = CFG["music"][spec.get("music", "B")]
    (out / "music-license.txt").write_text(
        f"Music for {job.name}\n\nTrack:  {m['title']}\nArtist: {m['artist']}\nPage:   {m['page']}\n"
        f"Check:  {m['checked']}\n\n" + (HERE / "pixabay-license-summary.txt").read_text(encoding="utf-8"), encoding="utf-8")
    lines = [f"# {job.name}", "", f"Rendered {date.today().isoformat()}. Preview only, not posted.", "", "## Files", ""]
    for key in ("9x16", "4x5"):
        for kind in ("music", "nomusic"):
            p = res[key][kind]
            i, pk = loudness(p)
            lines.append(f"- `{p.relative_to(ROOT)}`: {duration(p):.2f} s, {i:.1f} LUFS, true peak {pk:.1f} dB")
    g = res["google"]["music"]
    i, pk = loudness(g)
    lines.append(f"- `{g.relative_to(ROOT)}`: {duration(g):.2f} s, {i:.1f} LUFS, true peak {pk:.1f} dB")
    r = res["9x16"]
    lines += ["", "## Timeline", "",
              f"- Intro 0 to {r['intro']:.2f} s; clip to {r['clip_end']:.2f} s; before/after to {r['outro_start']:.2f} s; outro to {r['total']:.2f} s",
              "", "## Captions", ""] + [f"{n}. {c.upper()}" for n, c in enumerate(spec["captions"], 1)]
    lines += ["", "## Frames", "", "- `frames/` per-section grabs and contact sheets for both sizes",
              "- 9:16 safe-zone frames: `frames/safezone-9x16-clip-mid.jpg`, `frames/safezone-9x16-before.jpg`, `frames/safezone-9x16-after.jpg`",
              "", "## Picked automatically or worth checking", ""] + ([f"- {n}" for n in notes] or ["- nothing"])
    (out / "report.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    return "\n".join(lines)


# ---------- propose ----------

def propose(job):
    clips = sorted(job.glob("clip*.mp4"))
    if not clips:
        raise Refuse("no clip*.mp4 in the job folder")
    best = []
    for c in clips:
        d = duration(c)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(c), "-vf", "fps=2,scale=90:-2,format=gray", "-f", "rawvideo", "-"],
                             capture_output=True).stdout
        sw, sh = size(c)
        fh = even(sh * 90 / sw)
        n = len(raw) // (90 * fh)
        fr = [raw[i * 90 * fh:(i + 1) * 90 * fh] for i in range(n)]
        # activity score per half second: laser spark present plus motion
        score = [(1.0 if max(f) >= 245 else 0.0) + (sum(abs(f[j] - fr[i - 1][j]) for j in range(0, len(f), 7)) / len(f) * 7 / 20 if i else 0)
                 for i, f in enumerate(fr)]
        for start in range(0, n - 15):
            best.append((sum(score[start:start + 15]), c.name, start / 2))
    best.sort(reverse=True)
    picked = []
    for s, name, t in best:
        if all(name != n or abs(t - u) >= 7.5 for _, n, u in picked):
            picked.append((s, name, t))
        if len(picked) == 3:
            break
    picked.sort(key=lambda p: (p[1], p[2]))
    draft = ["# Draft from 'propose'. Claude fills in captions; Tyler OKs; then rename to short.txt.",
             "caption1: TBD", "caption2: TBD", "caption3: TBD"]
    draft += [f"clip: {n} {t:.1f}-{t + 7.5:.1f}" for _, n, t in picked]
    draft += ["speed: 1.25", "music: B", "method: laser", "permission: TBD (own piece, or client approved photos: yes, YYYY-MM-DD)"]
    (job / "short.draft.txt").write_text("\n".join(draft) + "\n", encoding="utf-8")
    return "\n".join(draft)


# ---------- main ----------

def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("check", "propose", "review", "approve", "render"):
        print(__doc__)
        sys.exit(2)
    cmd, job = sys.argv[1], (ROOT / sys.argv[2]).resolve()
    out = ROOT / "brag-output" / job.name
    try:
        if cmd == "propose":
            print(propose(job))
            print(f"\nReview sheet: {review_sheet(job, parse_job_draft(job), out / '_review')}")
            return
        spec = parse_job(job)
        errors, warnings = check(job, spec)
        for w in warnings:
            print("warning:", w)
        if errors:
            raise Refuse("refusing to render:\n- " + "\n- ".join(errors))
        if cmd == "check":
            print("checks passed")
        elif cmd == "review":
            print(review_sheet(job, spec, out / "_review"))
        elif cmd == "approve":
            (job / "review-ok.txt").write_text(f"{input_hash(job, spec)}\n{date.today().isoformat()}\n", encoding="utf-8")
            print("review recorded")
        elif cmd == "render":
            ok = job / "review-ok.txt"
            if not ok.exists() or ok.read_text().split()[0] != input_hash(job, spec):
                raise Refuse("the eyewear/faces/plates review is missing or the inputs changed since it; run 'review', check the sheet, then 'approve'")
            notes = []
            res = render(job, spec, out, notes)
            frames(job, res, out)
            print(report(job, spec, res, out, notes))
    except Refuse as e:
        print(e)
        sys.exit(1)


def parse_job_draft(job):
    spec = {"clips": []}
    for line in (job / "short.draft.txt").read_text(encoding="utf-8").splitlines():
        m = re.match(r"clip:\s*(\S+)\s+([\d.]+)-([\d.]+)", line)
        if m:
            spec["clips"].append((m.group(1), float(m.group(2)), float(m.group(3))))
    return spec


if __name__ == "__main__":
    main()
