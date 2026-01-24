#!/bin/bash

# Script to export all PSD files in a directory to PNG using ImageMagick
# Usage: ./export-to-png.sh --dir <directory-name>

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dir)
      DIR="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: ./export-to-png.sh --dir <directory-name>"
      exit 1
      ;;
  esac
done

# Check if directory argument was provided
if [ -z "$DIR" ]; then
  echo "Error: No directory specified"
  echo "Usage: ./export-to-png.sh --dir <directory-name>"
  exit 1
fi

# Get the script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Full path to the target directory
TARGET_DIR="$SCRIPT_DIR/$DIR"

# Check if directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "Error: Directory '$TARGET_DIR' does not exist"
  exit 1
fi

# Find and convert all PSD files
echo "Converting PSD files in: $TARGET_DIR"
echo "----------------------------------------"

PSD_COUNT=0
for file in "$TARGET_DIR"/*.psd; do
  # Check if any PSD files exist
  if [ ! -e "$file" ]; then
    echo "No PSD files found in $TARGET_DIR"
    exit 0
  fi

  # Get filename without extension
  filename=$(basename "$file" .psd)
  output="$TARGET_DIR/$filename.png"

  echo "Converting: $filename.psd -> $filename.png"
  convert "$file" "$output"

  if [ $? -eq 0 ]; then
    echo "  ✓ Success"
    ((PSD_COUNT++))
  else
    echo "  ✗ Failed"
  fi
done

echo "----------------------------------------"
echo "Converted $PSD_COUNT PSD file(s) to PNG"
