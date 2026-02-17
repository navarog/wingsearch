#!/usr/bin/env python3
"""
Script to scrape bird sounds from Xeno Canto and generate birdsounds.md

Usage:
  python generate_birdsounds_md.py --test    # Process first 5 birds for testing
  python generate_birdsounds_md.py --full    # Process all birds
"""

import argparse
import requests
import re
import time
from bs4 import BeautifulSoup
from urllib.parse import quote_plus
import sys
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.common.exceptions import TimeoutException
    from webdriver_manager.chrome import ChromeDriverManager
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

def read_birdnames(filename='birdnames.txt'):
    """Read bird names from the text file."""
    try:
        with open(filename, 'r') as f:
            lines = f.readlines()

        birds = []
        for line in lines:
            line = line.strip()
            if '→' in line:
                # Format is: "   1→Papasula abbotti"
                name = line.split('→')[1].strip()
                birds.append(name)
            elif line and not line.startswith('#'):
                # Fallback: if no arrow, just use the line as-is (skip comments)
                birds.append(line)

        return birds
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        return []

def get_recordings_from_html(html_content, debug=False):
    """Parse HTML content to extract recordings with durations and links."""
    soup = BeautifulSoup(html_content, 'html.parser')

    recordings = []

    # Find all tbody elements and look for the one with recordings
    tbodies = soup.find_all('tbody')
    if debug:
        print(f"    DEBUG: Found {len(tbodies)} tbody elements")

    for tbody_idx, tbody in enumerate(tbodies):
        rows = tbody.find_all('tr')
        if debug:
            print(f"    DEBUG: tbody[{tbody_idx}] has {len(rows)} rows")

        # Check if this tbody has recording data by looking for audio elements
        has_audio = tbody.find('audio', class_='xc-mini-player')
        if not has_audio:
            if debug:
                print(f"    DEBUG: tbody[{tbody_idx}] has no audio elements, skipping")
            continue

        if debug:
            print(f"    DEBUG: Found recordings tbody[{tbody_idx}] with audio elements")

        for i, row in enumerate(rows):
            tds = row.find_all('td')
            if len(tds) < 3:
                if debug:
                    print(f"    DEBUG: Row {i} has only {len(tds)} columns, skipping")
                continue

            if debug and i < 3:  # Show first 3 rows for debugging
                print(f"    DEBUG: Row {i} columns:")
                for j, td in enumerate(tds):
                    text = td.get_text(strip=True)
                    print(f"      Column {j}: '{text[:50]}{'...' if len(text) > 50 else ''}'")

            # Get duration from 3rd column (index 2)
            duration_cell = tds[2]
            duration_text = duration_cell.get_text(strip=True)

            # Check if duration matches x:xx pattern (not xx:xx)
            duration_match = re.match(r'^(\d):(\d{2})$', duration_text)
            if not duration_match:
                if debug:
                    print(f"    DEBUG: Row {i} duration '{duration_text}' doesn't match x:xx pattern")
                continue

            # Get direct MP3 link from audio element in first column
            audio_cell = tds[0]
            audio_elem = audio_cell.find('audio', class_='xc-mini-player')
            if not audio_elem:
                if debug:
                    print(f"    DEBUG: Row {i} no audio element found in first column")
                continue

            mp3_src = audio_elem.get('src')
            if not mp3_src:
                if debug:
                    print(f"    DEBUG: Row {i} audio element has no src attribute")
                continue

            # Convert relative URLs to absolute URLs
            if mp3_src.startswith('//'):
                mp3_url = 'https:' + mp3_src
            elif mp3_src.startswith('/'):
                mp3_url = 'https://xeno-canto.org' + mp3_src
            else:
                mp3_url = mp3_src

            # Check for Creative Commons licensing in the last column
            last_cell = tds[-1]
            cc_link = last_cell.find('a', href=re.compile(r'creativecommons\.org/licenses'))
            is_cc_licensed = cc_link is not None

            if not is_cc_licensed:
                if debug:
                    print(f"    DEBUG: Row {i} not CC licensed, skipping: {duration_text} - {mp3_url}")
                continue

            # Extract CC license type for display
            cc_license_type = "Non-CC"
            if cc_link:
                cc_href = cc_link.get('href', '')
                if 'by-nc-sa' in cc_href:
                    cc_license_type = "CC BY-NC-SA"
                elif 'by-nc' in cc_href:
                    cc_license_type = "CC BY-NC"
                elif 'by-sa' in cc_href:
                    cc_license_type = "CC BY-SA"
                elif 'by' in cc_href:
                    cc_license_type = "CC BY"
                else:
                    cc_license_type = "CC (other)"

            recordings.append({
                'duration': duration_text,
                'link': mp3_url,
                'duration_seconds': int(duration_match.group(1)) * 60 + int(duration_match.group(2)),
                'cc_licensed': is_cc_licensed,
                'cc_type': cc_license_type
            })

            if debug:
                print(f"    DEBUG: Row {i} FOUND CC recording: {duration_text} - {mp3_url}")

        # If we found recordings in this tbody, we're done
        if recordings:
            break

    return recordings

def scrape_bird_sounds_selenium(bird_name):
    """Scrape bird sounds using Selenium to handle JavaScript challenges."""
    if not SELENIUM_AVAILABLE:
        print(f"  ❌ Selenium not available, falling back to requests")
        return scrape_bird_sounds_requests(bird_name)

    print(f"  Using browser automation to handle JavaScript challenges")

    # Build the URL
    encoded_name = quote_plus(bird_name)
    url = f"https://xeno-canto.org/explore?query={encoded_name}"

    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in background
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

    driver = None
    try:
        # Use webdriver manager to handle Chrome driver installation
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        print(f"  Loading: {url}")
        driver.get(url)

        # Wait for the page to load and handle any JavaScript challenges
        # Look for the results or wait for JavaScript to complete
        wait = WebDriverWait(driver, 30)  # Wait up to 30 seconds

        try:
            # Wait for either results table or "no results" message
            wait.until(
                lambda d:
                d.find_element(By.TAG_NAME, "tbody") or
                "no results" in d.page_source.lower() or
                "results from" in d.page_source.lower()
            )
            print(f"  ✅ Page loaded successfully")
        except TimeoutException:
            print(f"  ⚠️  Timeout waiting for page content, proceeding anyway")

        # Get the final HTML after JavaScript execution
        html_content = driver.page_source
        print(f"  📄 Retrieved HTML content ({len(html_content)} chars)")

        return get_recordings_from_html(html_content, debug=False)

    except Exception as e:
        print(f"  ❌ Selenium error: {e}")
        return []
    finally:
        if driver:
            driver.quit()

def scrape_bird_sounds_requests(bird_name):
    """Fallback method using requests (may not work with JavaScript challenges)."""
    # Build the URL
    encoded_name = quote_plus(bird_name)
    url = f"https://xeno-canto.org/explore?query={encoded_name}"

    try:
        # Add comprehensive headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
        }

        # Make the request with session for better handling
        session = requests.Session()
        session.headers.update(headers)

        print(f"  Fetching: {url}")
        response = session.get(url, timeout=30)
        response.raise_for_status()

        # Check for bot protection
        if "anubis" in response.text.lower() or "making sure you're not a bot" in response.text.lower():
            print(f"  ⚠️  Anubis bot protection detected - need browser automation")
            return []

        print(f"  Successfully fetched data ({len(response.text)} chars)")
        return get_recordings_from_html(response.text, debug=False)

    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return []

def scrape_bird_sounds(bird_name, use_local_html=False):
    """Scrape bird sounds from Xeno Canto for a given bird name."""
    print(f"Processing: {bird_name}")

    if use_local_html:
        # For testing, use the local HTML file
        try:
            with open('search-results-xeno-canto.html', 'r', encoding='utf-8') as f:
                html_content = f.read()
            print(f"  Using local HTML file for testing")
            return get_recordings_from_html(html_content, debug=False)
        except Exception as e:
            print(f"  Error reading local HTML: {e}")
            return []

    # Try selenium first, then fall back to requests
    return scrape_bird_sounds_selenium(bird_name)

def bird_entry_exists(bird_name, output_file):
    """Check if a bird entry already exists in the markdown file."""
    try:
        with open(output_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Look for the bird name as a heading
        heading = f"# {bird_name}"
        return heading in content
    except FileNotFoundError:
        return False
    except Exception:
        return False

def generate_bird_entry(bird_name, recordings):
    """Generate markdown entry for a single bird."""
    if not recordings:
        return f"# {bird_name}\n\nNo recordings found.\n\n"

    # Sort by duration (shortest first)
    recordings.sort(key=lambda x: x['duration_seconds'])

    lines = [f"# {bird_name}\n"]

    # Add all recordings with CC status
    for recording in recordings:
        cc_status = recording.get('cc_type', 'Unknown')
        lines.append(f"{recording['duration']} - {cc_status} - <{recording['link']}>")

    # Add shortest duration with its link and CC status
    shortest = recordings[0]
    shortest_cc = shortest.get('cc_type', 'Unknown')
    lines.append(f"\nShortest: {shortest['duration']} - {shortest_cc} - <{shortest['link']}>")

    lines.append("")  # Empty line after each bird

    return "\n".join(lines) + "\n"

def main():
    parser = argparse.ArgumentParser(description='Scrape bird sounds from Xeno Canto')
    parser.add_argument('--test', action='store_true',
                       help='Test mode: process only first 5 birds using local HTML')
    parser.add_argument('--full', action='store_true',
                       help='Full mode: process all birds by scraping live site')

    args = parser.parse_args()

    if not args.test and not args.full:
        print("Please specify either --test or --full mode")
        sys.exit(1)

    # Read bird names
    print("Reading bird names...")
    birds = read_birdnames()

    if not birds:
        print("No bird names found!")
        sys.exit(1)

    print(f"Found {len(birds)} birds")

    # Determine how many birds to process
    if args.test:
        birds = birds[:5]
        use_local_html = False
        print(f"Test mode: processing first {len(birds)} birds by scraping live site")
    else:
        use_local_html = False
        print(f"Full mode: processing all {len(birds)} birds by scraping live site")

    # Initialize output file - only create if it doesn't exist
    output_file = 'birdsounds.md'
    try:
        # Only create/truncate if file doesn't exist or is empty
        file_exists = False
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                file_exists = len(content) > 0
        except FileNotFoundError:
            file_exists = False

        if not file_exists:
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write('')  # Empty file to start fresh
            print(f"📝 Created new {output_file} for incremental writing")
        else:
            print(f"📝 Appending to existing {output_file}")
    except Exception as e:
        print(f"Error initializing {output_file}: {e}")
        sys.exit(1)

    # Process each bird and write incrementally
    for i, bird_name in enumerate(birds, 1):
        print(f"\n[{i}/{len(birds)}] Processing: {bird_name}")

        # Check if this bird already exists in the file
        if bird_entry_exists(bird_name, output_file):
            print(f"  ⏭️  Entry already exists, skipping")
            continue

        # For live scraping, add delay to be respectful
        if not use_local_html and i > 1:
            print("  Waiting 2 seconds to be respectful to the server...")
            time.sleep(2)

        # Scrape recordings
        recordings = scrape_bird_sounds(bird_name, use_local_html)

        # Filter to only CC licensed recordings (already done in parsing)
        cc_recordings = [r for r in recordings if r.get('cc_licensed', False)]

        if len(recordings) > len(cc_recordings):
            print(f"  📋 Filtered from {len(recordings)} to {len(cc_recordings)} CC-licensed recordings")

        # Generate entry
        entry = generate_bird_entry(bird_name, cc_recordings)

        # Append this bird's entry to the file immediately
        try:
            with open(output_file, 'a', encoding='utf-8') as f:
                f.write(entry)
            print(f"  ✅ Found {len(cc_recordings)} CC-licensed recordings - written to file")
        except Exception as e:
            print(f"  ❌ Error writing entry for {bird_name}: {e}")

    print(f"\n📄 Successfully wrote {output_file}")
    print(f"✅ Processed {len(birds)} birds")

if __name__ == '__main__':
    main()