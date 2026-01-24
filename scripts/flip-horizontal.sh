#!/bin/bash

# Script to flip images horizontally in interactive mode
# Usage: ./flip-horizontal.sh
# Then paste image paths when prompted (supports paths with spaces)
# Press Enter on empty line to exit

echo "========================================="
echo "Interactive Image Flipper (Horizontal)"
echo "========================================="
echo "Paste image paths to flip them horizontally"
echo "Press Enter on empty line to exit"
echo "Press Ctrl+C to quit anytime"
echo ""

# Trap Ctrl+C for clean exit
trap 'echo ""; echo "Exiting..."; exit 0' INT

# Main loop
while true; do
    # Read input with prompt
    read -r -p "Image path: " IMAGE_PATH

    # Exit on empty input
    if [ -z "$IMAGE_PATH" ]; then
        echo "Exiting..."
        break
    fi

    # Check if file exists
    if [ ! -f "$IMAGE_PATH" ]; then
        echo "❌ Error: File '$IMAGE_PATH' not found"
        echo ""
        continue
    fi

    # Flip the image horizontally using ImageMagick's convert command
    # -flop flips the image horizontally (mirror)
    convert "$IMAGE_PATH" -flop "$IMAGE_PATH"

    if [ $? -eq 0 ]; then
        echo "✅ Successfully flipped: $IMAGE_PATH"
    else
        echo "❌ Error: Failed to flip image"
    fi

    echo ""
done
