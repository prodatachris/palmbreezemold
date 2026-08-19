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
# These clips are SCRUBBED BY SCROLL, not played, and every setting below
# follows from that.
#
#   -g 1        every frame a keyframe. Scrubbing seeks to an arbitrary time on
#               every scroll frame; with the default GOP these clips carried a
#               single keyframe each, so every seek decoded from frame zero and
#               the picture snapped instead of moving.
#   no reverse  the old ping-pong existed so a LOOPING clip would not snap back
#               at the join. A scrubbed clip never loops — its frame is a
#               function of scroll position — so the reversed half is dead
#               weight, and dropping it paid for the keyframes: the worst clip
#               went 1.2M ping-ponged to 1.1M all-keyframe.
#   960 / 12fps it sits behind a heavy navy scrim as decoration, and the frame
#               shown is chosen by scroll position rather than by time, so
#               temporal resolution buys nothing.
#   mp4 only    no WebM. Maintaining a second all-keyframe encode to save bytes
#               on a file that must be fully buffered before it is smooth is the
#               wrong trade, and the VP9 encodes lost to their MP4 counterparts
#               on 7 of 9 clips anyway.
#
# Audio is stripped: the markup never plays these, and a track would be dead
# bytes on a file that is downloaded in full.
for src in "$RAW"/*.mp4; do
  name=$(basename "$src" .mp4)

  ffmpeg -loglevel error -y -i "$src" -vf "scale=960:-2" -an \
    -c:v libx264 -profile:v main -pix_fmt yuv420p \
    -g 1 -crf 33 -r 12 -preset slow -movflags +faststart \
    "$VID/${name}.mp4"

  # No poster frame, deliberately. mediaHero already paints a responsive <img>
  # from the image registry behind the clip and never removes it — that still
  # is the LCP element, and it is what a reduced-motion, Save-Data,
  # narrow-viewport or no-JS visitor sees.

  kf=$(ffprobe -v error -select_streams v:0 -show_frames -show_entries frame=key_frame -of csv=p=0 "$VID/${name}.mp4" 2>/dev/null | grep -c '^1')
  printf '%-24s %s  (%s keyframes)\n' "$name" "$(du -h "$VID/${name}.mp4" | cut -f1)" "$kf"
done

echo
echo "images -> $IMG"
echo "video  -> $VID"
