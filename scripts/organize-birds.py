#!/usr/bin/env python3
"""
Organize PNG files by:
1. Extracting -0 versions
2. Removing _Edit and -0 suffixes
3. Matching with JSON data
4. Renaming using ID field from JSON

Usage:
    python organize-hummingbirds.py --dir <folder> --json <json_file>
"""

import os
import shutil
import json
import glob
import argparse
from difflib import SequenceMatcher

def normalize_name(name):
    """
    Normalize bird name for fuzzy matching.
    Removes special characters, spaces, and converts to lowercase.
    """
    # Remove common suffixes
    name = name.replace("_Edit", "").replace("-0", "").replace("-1", "")
    # Convert to lowercase and remove non-alphanumeric characters
    normalized = ''.join(c.lower() for c in name if c.isalnum())
    return normalized

def similarity_score(str1, str2):
    """Calculate similarity between two strings (0-1)."""
    return SequenceMatcher(None, str1, str2).ratio()

def clean_filename(filename):
    """Remove _Edit and -0 suffixes from filename."""
    # Remove extension
    name = os.path.splitext(filename)[0]
    # Remove suffixes
    name = name.replace("_Edit-0", "").replace("-0", "")
    return name

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description='Organize PNG files by matching with JSON data and renaming with IDs'
    )
    parser.add_argument(
        '--dir',
        required=True,
        help='Input directory containing PNG files (e.g., Hummingbirds)'
    )
    parser.add_argument(
        '--json',
        required=True,
        help='Path to JSON file with bird data (e.g., src/assets/data/hummingbirds.json)'
    )

    args = parser.parse_args()

    # Setup paths
    input_dir = args.dir
    json_path = args.json

    # Create output directory as sibling of input directory
    parent_dir = os.path.dirname(input_dir)
    dir_name = os.path.basename(input_dir)
    output_dir = os.path.join(parent_dir, f"{dir_name}_processed")

    print("=" * 70)
    print("PNG ASSET ORGANIZER")
    print("=" * 70)

    # Validate input directory
    if not os.path.exists(input_dir):
        print(f"\n✗ ERROR: Input directory not found: {input_dir}")
        return 1

    # Validate JSON file
    if not os.path.exists(json_path):
        print(f"\n✗ ERROR: JSON file not found: {json_path}")
        return 1

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    print(f"\n✓ Input directory:  {input_dir}")
    print(f"✓ Output directory: {output_dir}")

    # Load JSON data
    print(f"✓ Loading JSON data from: {json_path}")
    with open(json_path, 'r') as f:
        birds_data = json.load(f)

    print(f"✓ Loaded {len(birds_data)} items from JSON")

    # Find all -0.png files
    pattern = os.path.join(input_dir, "*-0.png")
    png_files = glob.glob(pattern)
    print(f"✓ Found {len(png_files)} PNG files with -0 suffix")

    if len(png_files) != len(birds_data):
        print(f"\n⚠ WARNING: File count ({len(png_files)}) != JSON count ({len(birds_data)})")

    # Create mapping dictionaries
    file_to_bird = {}
    matched_count = 0
    unmatched_files = []

    print("\n" + "=" * 70)
    print("MATCHING FILES TO JSON DATA")
    print("=" * 70)

    # Process each PNG file
    for png_path in png_files:
        filename = os.path.basename(png_path)
        clean_name = clean_filename(filename)
        normalized_file = normalize_name(clean_name)

        # Try to find matching bird in JSON
        best_match = None
        best_score = 0

        for bird in birds_data:
            bird_name = bird["Common name"]
            normalized_bird = normalize_name(bird_name)

            # Check for exact match
            if normalized_file == normalized_bird:
                best_match = bird
                best_score = 1.0
                break

            # Check for substring match (in case of abbreviations)
            if normalized_file in normalized_bird or normalized_bird in normalized_file:
                score = similarity_score(normalized_file, normalized_bird)
                if score > best_score:
                    best_match = bird
                    best_score = score

            # Check similarity score
            score = similarity_score(normalized_file, normalized_bird)
            if score > best_score and score > 0.75:  # 75% similarity threshold
                best_match = bird
                best_score = score

        if best_match:
            file_to_bird[png_path] = best_match
            matched_count += 1
            print(f"✓ {clean_name:40s} → {best_match['Common name']:40s} [ID: {best_match['id']}] (score: {best_score:.2f})")
        else:
            unmatched_files.append((png_path, clean_name))
            print(f"✗ {clean_name:40s} → NO MATCH FOUND")

    # Report unmatched files
    if unmatched_files:
        print("\n" + "=" * 70)
        print(f"⚠ UNMATCHED FILES ({len(unmatched_files)})")
        print("=" * 70)
        for png_path, clean_name in unmatched_files:
            print(f"  - {clean_name}")
            print(f"    Normalized: {normalize_name(clean_name)}")

    # Copy and rename files
    print("\n" + "=" * 70)
    print(f"COPYING AND RENAMING FILES")
    print("=" * 70)

    copied_count = 0
    for png_path, bird in file_to_bird.items():
        bird_id = bird["id"]
        output_filename = f"{bird_id}.png"
        output_path = os.path.join(output_dir, output_filename)

        shutil.copy2(png_path, output_path)
        copied_count += 1
        print(f"✓ Copied: {os.path.basename(png_path)} → {output_filename}")

    # Final summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total PNG files found:    {len(png_files)}")
    print(f"Successfully matched:     {matched_count}")
    print(f"Failed to match:          {len(unmatched_files)}")
    print(f"Files copied to output:   {copied_count}")
    print(f"\nOutput directory: {output_dir}")
    print("=" * 70)

    if len(unmatched_files) > 0:
        print("\n⚠ WARNING: Some files were not matched. Review the list above.")
        return 1

    print("\n✅ SUCCESS: All files organized successfully!")
    return 0

if __name__ == "__main__":
    exit(main())
