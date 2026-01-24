#!/usr/bin/env python3
"""
Generate silhouette images from PNG files.
Adapted from scripts/silhouettes.py for generic processing.

Usage:
    python process-silhouettes.py --dir <folder>
"""

import cv2
import numpy as np
import os
import argparse

# Processing parameters (from scripts/silhouettes.py)
TARGET_CANVAS = (450, 685)  # width, height
PLACE_RECT = (50, 100, 440, 550)  # (x1, y1, x2, y2)
TARGET_COLOR = (161, 161, 161, 255)  # #a1a1a1 with full alpha

def process_image(input_path, output_path):
    """
    Process a single PNG file to create a silhouette.

    Steps:
    1. Recolor all non-transparent pixels to #a1a1a1
    2. Resize proportionally (max dimension 335px)
    3. Place on transparent 450x685 canvas
    4. Apply Gaussian blur
    """
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)  # keep alpha channel
    if img is None or img.shape[2] < 4:
        print(f"  ✗ Error: Invalid image or no alpha channel")
        return False

    # --- Step 1: recolor all non-transparent pixels to #a1a1a1 ---
    b, g, r, a = cv2.split(img)
    gray_img = np.zeros_like(img)
    gray_img[:, :, 0:3] = TARGET_COLOR[:3]
    gray_img[:, :, 3] = a  # preserve alpha

    # --- Step 2: resize proportionally (longer side = 335 px) ---
    h, w = gray_img.shape[:2]
    scale = 335.0 / max(w, h)
    new_w, new_h = int(w * scale), int(h * scale)
    resized = cv2.resize(gray_img, (new_w, new_h), interpolation=cv2.INTER_AREA)

    # --- Step 3: place resized image onto transparent canvas ---
    canvas = np.zeros((TARGET_CANVAS[1], TARGET_CANVAS[0], 4), dtype=np.uint8)
    x1, y1, x2, y2 = PLACE_RECT
    box_w, box_h = x2 - x1, y2 - y1
    offset_x = x1 + (box_w - new_w) // 2
    offset_y = y1 + (box_h - new_h) // 2

    y2p = offset_y + new_h
    x2p = offset_x + new_w

    # alpha blending
    alpha_r = resized[:, :, 3:] / 255.0
    alpha_bg = 1.0 - alpha_r
    canvas[offset_y:y2p, offset_x:x2p, :3] = (
        alpha_r * resized[:, :, :3] +
        alpha_bg * canvas[offset_y:y2p, offset_x:x2p, :3]
    )
    canvas[offset_y:y2p, offset_x:x2p, 3:] = (
        (alpha_r + alpha_bg * canvas[offset_y:y2p, offset_x:x2p, 3:] / 255.0) * 255
    )

    # --- Step 4: apply Gaussian blur (alpha-aware) ---
    rgb = canvas[:, :, :3].astype(np.float32)
    alpha = canvas[:, :, 3:].astype(np.float32) / 255.0  # shape (H, W, 1)

    # Blur both color and alpha separately
    blurred_rgb = cv2.GaussianBlur(rgb * alpha, (31, 31), 20)
    blurred_alpha = cv2.GaussianBlur(alpha, (31, 31), 20)

    # Ensure blurred_alpha has 3D shape for broadcasting
    if blurred_alpha.ndim == 2:
        blurred_alpha = blurred_alpha[:, :, np.newaxis]

    # Avoid division by zero
    blurred_alpha_3 = np.clip(blurred_alpha, 1e-5, 1.0)

    # Divide color by alpha to normalize
    normalized = blurred_rgb / blurred_alpha_3

    # Recombine RGB + alpha
    blurred = np.dstack([normalized, blurred_alpha * 255]).astype(np.uint8)

    # --- Step 5: save result ---
    cv2.imwrite(output_path, blurred)
    return True

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Generate silhouette images from PNG files'
    )
    parser.add_argument(
        '--dir',
        required=True,
        help='Input directory containing processed PNG files (e.g., Hummingbirds_processed)'
    )

    args = parser.parse_args()

    # Setup paths
    input_dir = args.dir

    # Create output directory as sibling of input directory
    parent_dir = os.path.dirname(input_dir)
    dir_name = os.path.basename(input_dir)

    # Remove _processed suffix if present and add _silhouettes
    if dir_name.endswith("_processed"):
        base_name = dir_name[:-10]  # Remove "_processed"
        output_dir = os.path.join(parent_dir, f"{base_name}_silhouettes")
    else:
        output_dir = os.path.join(parent_dir, f"{dir_name}_silhouettes")

    print("=" * 70)
    print("SILHOUETTE GENERATOR")
    print("=" * 70)

    # Check input directory
    if not os.path.exists(input_dir):
        print(f"\n✗ ERROR: Input folder not found: {input_dir}")
        print("  Please run organize-hummingbirds.py first.")
        return 1

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    print(f"\n✓ Input folder:  {input_dir}")
    print(f"✓ Output folder: {output_dir}")

    # Get all PNG files
    png_files = [f for f in os.listdir(input_dir) if f.lower().endswith(".png")]
    png_files.sort()

    print(f"✓ Found {len(png_files)} PNG files to process")

    if len(png_files) == 0:
        print("\n✗ ERROR: No PNG files found in input folder")
        return 1

    print("\n" + "=" * 70)
    print("PROCESSING IMAGES")
    print("=" * 70)

    # Process each file
    success_count = 0
    failed_count = 0

    for fname in png_files:
        input_path = os.path.join(input_dir, fname)
        output_path = os.path.join(output_dir, fname)

        print(f"Processing: {fname}...", end=" ")

        if process_image(input_path, output_path):
            print("✓ Done")
            success_count += 1
        else:
            print("✗ Failed")
            failed_count += 1

    # Final summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total files:      {len(png_files)}")
    print(f"Processed:        {success_count}")
    print(f"Failed:           {failed_count}")
    print(f"\nOutput directory: {output_dir}")
    print("=" * 70)

    if failed_count > 0:
        print(f"\n⚠ WARNING: {failed_count} file(s) failed to process")
        return 1

    print("\n✅ SUCCESS: All silhouettes generated successfully!")
    return 0

if __name__ == "__main__":
    exit(main())
