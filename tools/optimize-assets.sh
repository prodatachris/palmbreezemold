#!/usr/bin/env bash
# Turn the raw generated assets in raw-assets/ into web-ready files in
# public/assets/{img,video}/.
#
#   ./tools/optimize-assets.sh
#
# Images  -> WebP at three widths + a JPEG fallback at the largest width.
# Videos  -> silent H.264 MP4 + VP9 WebM. No poster; see the note below.
#
# Requires cwebp (brew install webp) and ffmpeg (brew install ffmpeg).
# Re-running is safe; everything is overwritten from the raw sources.

set -euo pipefail
cd "$(dirname "$0")/.."

RAW=raw-assets
IMG=public/assets/img
VID=public/assets/video
mkdir -p "$IMG" "$VID"

for t in cwebp ffmpeg; do
  command -v "$t" >/dev/null || { echo "missing: $t"; exit 1; }
done

# ── Images ───────────────────────────────────────────────────────────────────
# 1376 is the native width of the generated stills — never upscale past it.
WIDTHS=(1376 960 640)

shopt -s nullglob
for src in "$RAW"/*.png; do
  name=$(basename "$src" .png)
  for w in "${WIDTHS[@]}"; do
    cwebp -quiet -q 78 -resize "$w" 0 -m 6 -metadata none \
      "$src" -o "$IMG/${name}-${w}.webp"
  done
  # JPEG fallback at the largest width, for anything that cannot take WebP.
  ffmpeg -loglevel error -y -i "$src" -vf "scale=${WIDTHS[0]}:-2" \
    -q:v 6 "$IMG/${name}-${WIDTHS[0]}.jpg"
  printf '%-24s %s\n' "$name" \
    "$(du -h "$IMG/${name}-${WIDTHS[0]}.webp" | cut -f1) webp / $(du -h "$IMG/${name}-${WIDTHS[0]}.jpg" | cut -f1) jpg"
done

# ── Brand ────────────────────────────────────────────────────────────────────
# Lossless, deliberately, not the -q 78 used above. The lockup is flat colour on
# transparency, which is the case lossy WebP handles worst. Encoded with the
# photographic settings it came out LARGER than the PNG it was meant to replace
# — 27,764 bytes against 22,085 — and because <source type="image/webp"> wins,
# every visitor downloaded the bigger file. The reversed lockup was worse still,
# 11,588 against 4,724. Lossless gives 16,276 and 2,106.
#
# Regenerated from the shipped PNG rather than the raw source, so the two
# renditions cannot drift apart.
BRAND=public/assets/brand
for name in lockup lockup-reversed; do
  src="$BRAND/${name}.png"
  [ -f "$src" ] || continue
  cwebp -quiet -lossless -exact -m 6 -metadata none "$src" -o "$BRAND/${name}.webp"
  printf '%-24s %s\n' "$name" \
    "$(du -h "$BRAND/${name}.webp" | cut -f1) webp / $(du -h "$src" | cut -f1) png"
done

# ── Video ────────────────────────────────────────────────────────────────────
# These are ambient background clips sitting behind a scrim, so they are
# encoded for size rather than fidelity. Audio is stripped outright: the markup
# autoplays them, and an autoplaying clip with an audio track is both a browser
# blocking condition and a hostile thing to do to a visitor.
for src in "$RAW"/*.mp4; do
  name=$(basename "$src" .mp4)

  # Ping-pong: play forward, then backward. Every one of these clips is a slow
  # one-directional push or drift, and a plain `loop` on that snaps hard back to
  # the start every four seconds — which is the single thing that makes a
  # background video read as cheap. Forward-then-reverse loops seamlessly and
  # doubles the runtime for free.
  PP='[0:v]scale=1280:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]'

  ffmpeg -loglevel error -y -i "$src" -filter_complex "$PP" -map "[v]" \
    -an -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -crf 31 -preset slow -movflags +faststart \
    "$VID/${name}.mp4"

  ffmpeg -loglevel error -y -i "$src" -filter_complex "$PP" -map "[v]" \
    -an -c:v libvpx-vp9 -b:v 0 -crf 37 -row-mt 1 \
    -deadline good -cpu-used 2 \
    "$VID/${name}.webm"

  # No poster frame is generated, deliberately. A <video poster> would be the
  # obvious way to cover the gap before playback, but mediaHero already paints a
  # responsive <img> from the image registry behind the clip and never removes
  # it — that still is the LCP element, and it is what a reduced-motion,
  # Save-Data, narrow-viewport or no-JS visitor sees. A poster would duplicate
  # it at a second set of dimensions. This script used to emit one in WebP and
  # JPEG for every clip; nothing ever referenced them and they cost 411 KB.

  printf '%-24s %s\n' "$name" \
    "$(du -h "$VID/${name}.mp4" | cut -f1) mp4 / $(du -h "$VID/${name}.webm" | cut -f1) webm"
done

echo
echo "images -> $IMG"
echo "video  -> $VID"
