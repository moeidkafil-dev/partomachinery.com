#!/usr/bin/env bash
# =============================================================================
# Parto Plastic — HTE75 media pipeline
# Copies user-supplied source media into the project media zone (originals are
# never modified), then generates web derivatives:
#   - public/media/frames/desktop/frame_###.webp  (640x384, scrub sequence)
#   - public/media/frames/mobile/frame_###.webp   (416x250, scrub sequence)
#   - public/media/video/hte75_hero_cropped.mp4   (watermark-free, faststart)
#   - public/media/posters/*                      (poster + OG image)
#   - media/thumbnails/contact_sheet_*.jpg        (inspection sheets)
#   - media/processed/hte75_source_metadata.json  (ffprobe dump)
# Usage: bash scripts/media_pipeline.sh
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${ROOT}/upload/extracted/IMMERSIVE_INDUSTRIAL_WEB_PRD/media"
MEDIA="${ROOT}/media"
PUB="${ROOT}/public/media"

REF_IN="${SRC}/reference_videos/PixVerse_Pixverse-c1_Image_Text_360P_Create_a_.mp4"
NEW_IN="${SRC}/videos_to_upload/PixVerse_Pixverse-c1_Image_Text_360P_Create_a_.mp4"
LOGO_IN="${SRC}/brand/parto_plastic_logo.jpg"
FRAMES_DIR_DESKTOP="${PUB}/frames/desktop"
FRAMES_DIR_MOBILE="${PUB}/frames/mobile"

# Any additional clips dropped into videos_to_upload are detected by checksum.
echo "==> 1. Copying source media into project media zone (originals preserved)"
mkdir -p "${MEDIA}"/{reference_videos,videos_to_upload,processed,thumbnails,brand}
cp -n "${REF_IN}" "${MEDIA}/reference_videos/" 2>/dev/null || true
if [ -f "${NEW_IN}" ]; then
  NEW_NAME="${NEW_IN##*/}"
  if [ ! -f "${MEDIA}/videos_to_upload/${NEW_NAME}" ]; then
    cp "${NEW_IN}" "${MEDIA}/videos_to_upload/${NEW_NAME}"
  fi
fi
cp -n "${LOGO_IN}" "${MEDIA}/brand/" 2>/dev/null || true

# Choose the upload-inbox clip as the active hero source (fallback: reference)
HERO_SRC="${MEDIA}/videos_to_upload/PixVerse_Pixverse-c1_Image_Text_360P_Create_a_.mp4"
[ -f "${HERO_SRC}" ] || HERO_SRC="${MEDIA}/reference_videos/PixVerse_Pixverse-c1_Image_Text_360P_Create_a_.mp4"
echo "    Active hero source: ${HERO_SRC}"

echo "==> 2. ffprobe metadata -> media/processed/hte75_source_metadata.json"
ffprobe -v error -print_format json -show_format -show_streams "${HERO_SRC}" \
  > "${MEDIA}/processed/hte75_source_metadata.json"

echo "==> 3. Extracting scrub frame sequences (fps=8, crop top 48px to drop generator watermark)"
# Source: 640x432 @24fps, 15.0417s. fps=8 -> 1 frame per 0.125s of source time.
# Crop 640x432 -> 640x384 (y+48) removes the intermittent top-right watermark.
rm -rf "${FRAMES_DIR_DESKTOP}" "${FRAMES_DIR_MOBILE}"
mkdir -p "${FRAMES_DIR_DESKTOP}" "${FRAMES_DIR_MOBILE}"
ffmpeg -y -v error -i "${HERO_SRC}" \
  -vf "crop=640:384:0:48,fps=8" -start_number 0 \
  -c:v libwebp -quality 78 -compression_level 6 \
  "${FRAMES_DIR_DESKTOP}/frame_%03d.webp"
ffmpeg -y -v error -i "${HERO_SRC}" \
  -vf "crop=640:384:0:48,fps=8,scale=416:250:flags=lanczos" -start_number 0 \
  -c:v libwebp -quality 70 -compression_level 6 \
  "${FRAMES_DIR_MOBILE}/frame_%03d.webp"
N_DESKTOP=$(ls "${FRAMES_DIR_DESKTOP}" | wc -l)
N_MOBILE=$(ls "${FRAMES_DIR_MOBILE}" | wc -l)
echo "    desktop frames: ${N_DESKTOP} | mobile frames: ${N_MOBILE}"

echo "==> 4. Optimized hero MP4 derivative (H.264, CRF 21, faststart, no audio)"
mkdir -p "${PUB}/video"
ffmpeg -y -v error -i "${HERO_SRC}" \
  -vf "crop=640:384:0:48" -c:v libx264 -profile:v high -preset slow -crf 21 \
  -pix_fmt yuv420p -an -movflags +faststart \
  "${PUB}/video/hte75_hero_cropped.mp4"

echo "==> 5. Posters and OG image"
mkdir -p "${PUB}/posters"
ffmpeg -y -v error -ss 0 -i "${HERO_SRC}" -frames:v 1 \
  -vf "crop=640:384:0:48" -q:v 2 "${PUB}/posters/hero_poster.jpg"
ffmpeg -y -v error -ss 0 -i "${HERO_SRC}" -frames:v 1 \
  -vf "crop=640:384:0:48,scale=1200:720:flags=lanczos" -q:v 3 "${PUB}/posters/og_image.jpg"
ffmpeg -y -v error -ss 13.8 -i "${HERO_SRC}" -frames:v 1 \
  -vf "crop=640:384:0:48" -q:v 2 "${PUB}/posters/hero_end_frame.jpg"

echo "==> 6. Contact sheets for visual inspection"
ffmpeg -y -v error -i "${HERO_SRC}" \
  -vf "crop=640:384:0:48,fps=8,scale=320:192,tile=6x5" -frames:v 1 \
  -q:v 4 "${MEDIA}/thumbnails/contact_sheet_sequence.jpg"
ffmpeg -y -v error -i "${HERO_SRC}" \
  -vf "select='not(mod(n,36))',scale=427:288,tile=4x3" -frames:v 1 \
  -q:v 4 "${MEDIA}/thumbnails/contact_sheet_timeline.jpg"

echo "==> 7. Frame manifest (count + byte sizes) -> media/processed/frame_manifest.json"
node -e '
const fs = require("fs"), path = require("path");
const root = process.argv[1];
function scan(dir){ return fs.readdirSync(dir).filter(f=>f.endsWith(".webp")).map(f=>{
  const st = fs.statSync(path.join(dir,f)); return {file:f, bytes:st.size}; }); }
const d = scan(path.join(root,"public/media/frames/desktop"));
const m = scan(path.join(root,"public/media/frames/mobile"));
const out = {
  fps: 8, stepSeconds: 0.125, crop: {x:0,y:48,w:640,h:384},
  desktop: {count:d.length, totalBytes:d.reduce((a,b)=>a+b.bytes,0), files:d},
  mobile:  {count:m.length, totalBytes:m.reduce((a,b)=>a+b.bytes,0), files:m}
};
fs.writeFileSync(path.join(root,"media/processed/frame_manifest.json"), JSON.stringify(out,null,2));
console.log("    desktop total:", (out.desktop.totalBytes/1048576).toFixed(2), "MB | mobile total:", (out.mobile.totalBytes/1048576).toFixed(2), "MB");
' "${ROOT}"

echo "==> Done. Originals untouched in media/{reference_videos,videos_to_upload}."
