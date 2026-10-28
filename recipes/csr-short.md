# CSR short recipe

Trigger: Tyler says "make a short from <folder>". Every render is a preview for Tyler's review. Never upload, post or send a video anywhere.

Renderer: `recipes/csr-short/render.py` (Python + ffmpeg, no extra packages). Same inputs give the same file, byte for byte: the skillet job reproduces first-post v5 exactly.

## 1. Job folder

`C:\Code\csr-brag\jobs\<YYYY-MM-DD>-<short-name>\`

| File | Required | Notes |
|---|---|---|
| `clip*.mp4` | yes | one or more work clips, any orientation |
| `before.jpg`, `after.jpg` | yes | same framing; extra pairs `before2.jpg`/`after2.jpg` play in order |
| `short.txt` | yes before rendering | see below |

`jobs/` and `assets/` each hold an untracked `.gitignore` of `*`, so job media and shared media never reach git.

### short.txt

```
caption1: Laser surface restoration     # 3 lines, about 5 words each, written in any case; rendered in caps
caption2: Rust off. No chemicals.
caption3: Down to clean iron
clip: clip.mp4 2.0-9.5                 # source in-out seconds; one line per window, played in order
clip: clip.mp4 19.0-26.5
clip: clip.mp4 32.0-39.5
speed: 1.25                            # default 1.25; windows must total 15 to 18 s after speed
music: B                               # key in config.json; default B
method: laser                          # laser or heat gun; "no chemicals" needs laser
permission: own piece                  # or: client approved photos: yes, YYYY-MM-DD
subject: cast iron skillet             # optional, for the report
frame916: clip.mp4 zoom=1.3 x=31 y=660 # optional: hand framing per clip file (9:16)
frame45: clip.mp4 y=700                # optional: hand framing per clip file (4:5)
photo916: width=896 crop_top=9         # optional: photo width and rows trimmed off the top (9:16)
photo45: width=1026 crop_top=40        # optional (4:5)
```

## 2. Steps

1. Tyler names the folder. Read `short.txt`. If it is missing:
   - run `python recipes/csr-short/render.py propose jobs/<job>`. It picks three 7.5 s windows with the most laser action, writes `short.draft.txt` and a review sheet.
   - Look at the review sheet, adjust the windows if needed, and draft 3 captions that follow the rules below.
   - **Stop.** Show Tyler the windows and captions and wait for his OK. Only then rename the draft to `short.txt`.
2. If any file name, folder name, subject or caption suggests a client (Avison Young, William Allen, or any other client), **ask Tyler in chat to confirm permission before rendering.** Never write the `client approved photos` line yourself unless he has confirmed it in this session.
3. `python recipes/csr-short/render.py check jobs/<job>`: copy rules, permission, clip length, caption width and asset hashes. On any refusal, stop and tell Tyler why.
4. `python recipes/csr-short/render.py review jobs/<job>` makes `brag-output/<job>/_review/review-sheet.jpg` (a frame every second of each window, plus the photos). **Look at it.**
   - Refuse, and tell Tyler why, if:
     - anyone in frame lacks eyewear while the beam is on;
     - a face other than Tyler's shows;
     - a license plate, house number, street sign, address or customer name is readable.
   - If it is clean, run `python recipes/csr-short/render.py approve jobs/<job>`. That records a hash of the inputs, so any later change to the clips, photos or `short.txt` forces a new review.
5. `python recipes/csr-short/render.py render jobs/<job>`. It takes about 2 minutes, writes everything to `brag-output/<job>/`, and prints the report (also saved as `report.md`).
6. Open the three 9:16 safe-zone frames and the contact sheets and check them yourself, especially when framing was picked automatically. Automatic framing centers on the work point and can crop the object (for example, the top of a skillet handle). If so, set `frame916`/`frame45` by hand and render again.
7. Reply to Tyler using the report format in section 6, and send him the safe-zone frames and the 9:16 video.

## 3. Locked spec

- **Intro:** the Fiverr video with the tagline (`assets/anima_CSR_V2_with_tag_coastalsurface1_VERTICAL.mp4`) from 2.3 s (the beams converging into the logo flash) to its end, about 3 s, with its own sound and a 0.15 s fade-in.
- **Outro:** the full Fiverr video, untouched. Nothing designed by us after the outro.
  - The Fiverr audio is turned down 3.2 dB everywhere, because the original peaks at +0.9 dBFS.
  - In 4:5 the Fiverr video is cropped to rows 160 to 1510; the logo and tagline stay whole.
- **Clip:** 15 to 18 s of action, no clip audio, contrast 1.05, saturation 1.08, 30 fps.
  - 9:16: zoom 1.3x over fit-to-height, crop so the work point stays between y 300 and 1500 and left of x 960. Navy fills any space below the footage. The renderer tracks the laser spot and refuses if it leaves those bounds.
  - 4:5: fill the width, crop the height around the work point.
- **Captions:** navy band (#0E273E) at the top, Jost Regular caps, white.
  - 9:16: band 0 to 400 px, 60 px text, centered between y 220 and 400, at most 840 px wide (clear of the right 120 px).
  - 4:5: band 0 to 204 px, 64 px text.
  - Three equal slots across the clip, with short fades. Never over the footage.
- **Before/after:** BEFORE fully on screen 1.5 s, then a 1.4 s left-to-right wipe with a light cyan line, then AFTER fully on screen 3 s, then a 0.2 s fade.
  - Labels sit in the band: BEFORE in white, AFTER in #1B9AAA.
  - 9:16 photos about 85% width, between the band and y 1500, so the subject stays above y 1540. Default fits the photo uncropped; use `photo916` to go wider and trim the top.
  - Extra pairs hold AFTER 1.5 s each, and the last pair holds 3 s.
- **Music:** Pixabay instrumental from `config.json` (default B, Upbeat Funk by Kulakovka).
  - It comes in on its downbeat 0.4 s before the intro ends, runs under the clip and before/after, and fades over the first 0.5 s of the outro so the Fiverr sound plays clean.
  - Level: -14 LUFS integrated, limiter at -2 dBFS, so the true peak stays below -1 dB.
- **Outputs** in `brag-output/<job>/`:
  - `<job>-9x16.mp4` and `<job>-4x5.mp4` (with music), plus `-nomusic` versions of each
  - `<job>-google-9x16.mp4`: ends on AFTER (2.5 s hold, 0.5 s fade to white), no outro, music fading over the last 1.5 s. It must be under 30 s.
  - `music-license.txt`, `report.md`, `frames/` (per-section grabs, contact sheets, 9:16 safe-zone frames for mid-clip, BEFORE and AFTER), and `_work/` (intermediate files)

## 4. Hard rules (refuse to render, and tell Tyler why)

The script enforces what it can; the rest is your job at steps 2, 4 and 6.

- **Copy:** no prices or rates, no numbers, never "certified", no em dashes, no exclamation points, no AI-sounding words, no customer names, addresses, house numbers or license plates. No faces of anyone but Tyler.
- **Claims stay true to the clip:**
  - "No chemicals" only when the clip is the laser step (`method: laser`).
  - Never "eco-friendly", "non-toxic", "only" or "first".
- **Restoration first:** captions describe the result. The tool (laser, heat gun) is named in one caption at most and should not be the headline every time; vary it across shorts.
- **Client property** needs `permission: client approved photos: yes, YYYY-MM-DD`. Avison Young and William Allen are client jobs: no render until Tyler confirms permission in chat.
- **Eyewear:** no footage of the beam on while anyone in frame lacks eyewear.
- **Safety gates from CLAUDE.local.md still apply to anything a short shows or says:**
  - pre-1978 paint is lead until a negative swab;
  - check the historic registry;
  - plated surfaces get no laser;
  - no over-water marine work.

## 5. Changing shared pieces

- **New music:** Tyler names a track, or you search Pixabay Music for an upbeat instrumental.
  - Skip any track whose page shows "Content ID Registered" or "AI generated".
  - Download it to `assets/music/` and add an entry to `config.json`: title, artist, page URL, path, sha256, start (0.4 s before its first strong downbeat) and the check note.
  - The license summary in `pixabay-license-summary.txt` is copied into every output folder.
- **New Fiverr file or font:** put it in `assets/` and update the path and sha256 in `config.json`. The old jobs will no longer reproduce byte for byte; say so in the report.
- **Hashes:** the renderer refuses if a shared asset's hash changes. That's what keeps renders repeatable.
- **ffmpeg version:** byte-identical output was confirmed with ffmpeg 9.0.1 (gyan.dev full build). A different ffmpeg build may change bytes but not the look.

## 6. Report every run

- File paths and lengths, loudness and true peak (from `report.md`)
- The 9:16 safe-zone frames (top 220, bottom 380, right 120 drawn on) for mid-clip, BEFORE and AFTER
- The captions used
- Anything picked automatically or guessed (the "worth checking" list in `report.md`, plus your own)
- A "For HQ:" block
