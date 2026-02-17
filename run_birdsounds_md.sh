#!/bin/bash

# Script to generate birdsounds.md from birdnames.txt using Xeno Canto data

echo "🐦 Bird Sounds Markdown Generator"
echo "================================="

if [[ "$1" == "--test" ]]; then
    echo "Running in TEST mode (first 5 birds with real scraping)"
    python3 generate_birdsounds_md.py --test
elif [[ "$1" == "--full" ]]; then
    echo "Running in FULL mode (all birds, live scraping)"
    echo "⚠️  This will take a long time and may hit Cloudflare protection"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python3 generate_birdsounds_md.py --full
    else
        echo "Cancelled."
    fi
else
    echo "Usage:"
    echo "  $0 --test    # Test mode: process first 5 birds with real scraping"
    echo "  $0 --full    # Full mode: process all birds by scraping live site"
fi