#!/usr/bin/env bash
set -euo pipefail
OUT_DIR="$(cd "$(dirname "$0")" && pwd)/media-sample"
mkdir -p "$OUT_DIR"
OUT="$OUT_DIR/sample.mp4"
if [[ ! -f "$OUT" ]]; then
  ffmpeg -y -f lavfi -i color=c=#1e293b:s=640x360:d=3 \
    -f lavfi -i sine=f=440:d=3 \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$OUT" 2>/dev/null
fi
echo "$OUT_DIR"
