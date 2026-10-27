#!/usr/bin/env bash
set -e

# Base directory
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=================================================="
echo "⚡ She Nourishes — Smooth Batched Video Deployer ⚡"
echo "=================================================="

# Ensure dist exists
if [ ! -d "dist" ]; then
  echo "📦 Building application first..."
  npm run build
fi

FIREBASE="./node_modules/.bin/firebase"
VIDS_BACKUP="$DIR/.vids_temp_storage"

# Step 1: Temporarily stash all videos out of dist/vids-work
echo "📂 Preparing batches..."
rm -rf "$VIDS_BACKUP"
mkdir -p "$VIDS_BACKUP"
mv dist/vids-work/*.mp4 "$VIDS_BACKUP/" 2>/dev/null || true

# Function to restore all videos on exit or error
cleanup() {
  echo ""
  echo "🔄 Restoring all videos to dist/vids-work..."
  cp "$VIDS_BACKUP"/*.mp4 dist/vids-work/ 2>/dev/null || true
  rm -rf "$VIDS_BACKUP"
  echo "✅ All video assets restored."
}
trap cleanup EXIT

# BATCH 0: Core App Code & Database Rules
echo ""
echo "🚀 [1/6] Deploying Core App Code + Database Rules (Fast & light)..."
$FIREBASE deploy --only database,hosting
echo "✅ Core application live!"

# BATCH 1: Videos A to C (~29 videos)
echo ""
echo "🚀 [2/6] Deploying Video Batch 1 (A-C: ~29 videos)..."
cp "$VIDS_BACKUP"/[a-c]*.mp4 dist/vids-work/
$FIREBASE deploy --only hosting
echo "✅ Batch 1 uploaded and cached!"

# BATCH 2: Videos D to G (~33 videos)
echo ""
echo "🚀 [3/6] Deploying Video Batch 2 (D-G: ~33 videos)..."
cp "$VIDS_BACKUP"/[d-g]*.mp4 dist/vids-work/
$FIREBASE deploy --only hosting
echo "✅ Batch 2 uploaded and cached!"

# BATCH 3: Videos H to L (~20 videos)
echo ""
echo "🚀 [4/6] Deploying Video Batch 3 (H-L: ~20 videos)..."
cp "$VIDS_BACKUP"/[h-l]*.mp4 dist/vids-work/
$FIREBASE deploy --only hosting
echo "✅ Batch 3 uploaded and cached!"

# BATCH 4: Videos M to R + Seated (~32 videos)
echo ""
echo "🚀 [5/6] Deploying Video Batch 4 (M-R + Seated: ~32 videos)..."
cp "$VIDS_BACKUP"/[m-r]*.mp4 "$VIDS_BACKUP"/seated*.mp4 dist/vids-work/
$FIREBASE deploy --only hosting
echo "✅ Batch 4 uploaded and cached!"

# BATCH 5: Videos S to Z (~48 videos)
echo ""
echo "🚀 [6/6] Deploying Video Batch 5 (S-Z: ~48 videos)..."
cp "$VIDS_BACKUP"/*.mp4 dist/vids-work/
$FIREBASE deploy --only hosting
echo "✅ Batch 5 uploaded!"

echo ""
echo "🎉 ALL 162 VIDEOS & APP FULLY DEPLOYED TO FIREBASE HOSTING SUCCESSFULLY!"
