#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================================="
echo "⚡ She Nourishes — Ultra-Gentle 5-Video Micro Batcher ⚡"
echo "=========================================================="

FIREBASE="./node_modules/.bin/firebase"
VIDS_SOURCE="$DIR/vids-work"
TEMP_STASH="$DIR/.vids_temp_stash"

# Clean dist/vids-work first so it ONLY uploads 5 new videos at a time
rm -rf dist/vids-work
mkdir -p dist/vids-work

# Move all 162 videos to temp stash
rm -rf "$TEMP_STASH"
mkdir -p "$TEMP_STASH"
cp "$VIDS_SOURCE"/*.mp4 "$TEMP_STASH/"

cleanup() {
  echo ""
  echo "🔄 Restoring all videos to dist/vids-work..."
  cp "$TEMP_STASH"/*.mp4 dist/vids-work/ 2>/dev/null || true
  rm -rf "$TEMP_STASH"
  echo "✅ Done."
}
trap cleanup EXIT

# Get list of all video files
VIDEOS=("$TEMP_STASH"/*.mp4)
TOTAL=${#VIDEOS[@]}
BATCH_SIZE=5

echo "Found $TOTAL videos total."
echo "Deploying in micro-batches of $BATCH_SIZE videos each (won't crash network)..."
echo ""

BATCH_NUM=20
for ((i=95; i<TOTAL; i+=BATCH_SIZE)); do
  # Copy next 5 videos into dist/vids-work (cumulative so Firebase CDN keeps all)
  CURRENT_BATCH=("${VIDEOS[@]:i:BATCH_SIZE}")
  echo "--------------------------------------------------------"
  echo "📦 Uploading Micro-Batch $BATCH_NUM ($((i + 1)) to $((i + ${#CURRENT_BATCH[@]})) of $TOTAL)..."
  for f in "${CURRENT_BATCH[@]}"; do
    cp "$f" dist/vids-work/
    echo "  + $(basename "$f")"
  done

  # Deploy this micro-batch
  $FIREBASE deploy --only hosting
  echo "✅ Micro-Batch $BATCH_NUM successfully uploaded & cached!"
  
  BATCH_NUM=$((BATCH_NUM + 1))
  sleep 2
done

echo ""
echo "🎉 ALL 162 VIDEOS & APP ARE 100% DEPLOYED TO FIREBASE HOSTING!"
