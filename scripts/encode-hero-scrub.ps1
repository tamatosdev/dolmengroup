# Re-encode hero video for smooth scroll-scrubbing.
# Requires ffmpeg on PATH: https://ffmpeg.org/download.html
#
# Why: browsers can only seek cheaply to keyframes. Normal MP4s put a
# keyframe every few seconds → scroll scrub looks like a stutter/"jerk".
# All-intra (-g 1) makes every frame a keyframe so currentTime seeks smoothly.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "public\dolmen-video-2.mp4"
$out = Join-Path $root "public\dolmen-video-2.scrub.mp4"

if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Error "ffmpeg not found. Install it, then re-run this script."
}

if (-not (Test-Path $src)) {
  Write-Error "Missing source: $src"
}

Write-Host "Encoding scrub-optimized hero video..."
# -g 1        every frame is a keyframe (best scrub smoothness)
# -bf 0       no B-frames (simpler random access)
# -pix_fmt    yuv420p for broad browser support
# -movflags   faststart so playback can begin sooner
# -an         drop audio (hero is muted)
# scale       keep under ~1600px wide so file stays manageable
ffmpeg -y -i $src `
  -vf "scale='min(1600,iw)':-2" `
  -c:v libx264 -preset slow -crf 18 `
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 `
  -pix_fmt yuv420p `
  -movflags +faststart `
  -an `
  $out

Copy-Item $out $src -Force
Remove-Item $out -Force
Write-Host "Done. Replaced public/dolmen-video-2.mp4 with scrub-optimized encode."
