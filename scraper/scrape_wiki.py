import requests
from bs4 import BeautifulSoup
import json
import re
import time

# ─────────────────────────────────────────────────────────────────────────────
# Full page list — keyed to fact IDs used in parser.js LORE_MAP
# Format: "Wiki_Page_Title"
# ─────────────────────────────────────────────────────────────────────────────
PAGES = [
    # Main quests — Act 1
    "The_Rescue",
    "The_Ripperdoc",
    "The_Pickup",
    "The_Information",
    "The_Heist",

    # Main quests — Act 2
    "Playing_for_Time",
    "Ghost_Town",
    "Lightning_Breaks",
    "Life_During_Wartime",
    "Automatic_Love",
    "The_Space_in_Between",
    "Disasterpiece",
    "Double_Life",
    "M%27ap_Tann_P%C3%A8len",   # "M'ap Tann Pèlen" URL-encoded
    "I_Walk_the_Line",
    "Transmission",
    "Never_Fade_Away_(quest)",
    "Down_on_the_Street",
    "Gimme_Danger",
    "Play_It_Safe",
    "Search_and_Destroy",
    "Tapeworm",

    # Act 3 / Endings
    "Nocturne_Op55N1",
    "Chippin%27_In_(quest)",     # "Chippin' In"
    "Changes",
    "Endings",
    "Where_is_My_Mind%3F",       # Devil
    "All_Along_the_Watchtower",  # Star
    "Path_of_Glory",             # Sun
    "New_Dawn_Fades",            # Temperance

    # Phantom Liberty
    "Phantom_Liberty_(quest)",
    "Dog_Eat_Dog",
    "Hole_in_the_Sky",
    "Firestarter",
    "The_Killing_Moon",
    "Black_Steel_In_The_Hour_of_Chaos",
    "Somewhat_Damaged",
    "Leave_in_Silence",
    "Things_Done_Changed",       # Tower ending

    # Romance / companion side quests
    "Riders_on_the_Storm",
    "With_a_Little_Help_from_My_Friends",
    "Queen_of_the_Highway",
    "Both_Sides%2C_Now",         # Judy
    "Ex-Factor",
    "Pisces",
    "Pyramid_Song",
    "Rebel!_Rebel!",
    "Boat_Drinks",
    "I_Fought_the_Law",
    "The_Hunt",
    "Following_the_River",
    "Sinnerman",
    "Heroes",
    "Human_Nature",
    "Don%27t_Lose_Your_Mind",

    # Characters
    "V_(Cyberpunk_2077)",
    "Johnny_Silverhand",
    "Jackie_Welles",
    "Panam_Palmer",
    "Judy_%C3%81lvarez",         # Judy Álvarez
    "Kerry_Eurodyne",
    "River_Ward",
    "Rogue_Amendiares",
    "Goro_Takemura",
    "Hanako_Arasaka",
    "Songbird",
    "Solomon_Reed",
    "Alt_Cunningham",
    "Misty_Olszewski",
    "Viktor_Vektor",
]

API_URL = "https://cyberpunk.fandom.com/api.php"

def clean_text(text):
    """Remove infobox noise, collapse whitespace, strip wiki cruft."""
    # Kill lines that are just single words (infobox labels)
    lines = text.split('\n')
    cleaned = []
    for line in lines:
        line = line.strip()
        # Skip short infobox-style lines and navigation noise
        if len(line) < 20 and not line.endswith('.'):
            continue
        # Skip lines that are all-caps labels like "QUEST GIVER" 
        if line.isupper() and len(line) < 40:
            continue
        cleaned.append(line)
    text = ' '.join(cleaned)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Truncate at a reasonable limit — 4000 chars per page is plenty for retrieval
    return text[:4000]

def build_corpus():
    corpus = []
    print(f"Scraping {len(PAGES)} pages from Cyberpunk Wiki...\n")

    for title in PAGES:
        print(f"  [{len(corpus)+1}/{len(PAGES)}] {title}")

        params = {
            "action": "parse",
            "page": title,
            "format": "json",
            "redirects": 1,
            "prop": "text",
        }

        try:
            headers = {"User-Agent": "CP2077_Save_Chatbot/2.0 (personal project)"}
            response = requests.get(API_URL, params=params, headers=headers, timeout=10)

            if response.status_code != 200:
                print(f"    ✗ HTTP {response.status_code}")
                continue

            data = response.json()

            if "error" in data:
                print(f"    ✗ API error: {data['error'].get('info', '?')}")
                continue

            html_content = data.get("parse", {}).get("text", {}).get("*", "")
            if not html_content:
                print(f"    ✗ No HTML content")
                continue

            soup = BeautifulSoup(html_content, 'html.parser')

            # Remove infobox tables, navboxes, references
            for tag in soup.select('.infobox, .navbox, .references, .reflist, sup, .mw-editsection'):
                tag.decompose()

            paragraphs = soup.find_all('p')
            text = ' '.join(p.get_text() for p in paragraphs)

            if not text.strip():
                print(f"    ✗ No paragraph text")
                continue

            cleaned = clean_text(text)
            # Use the actual resolved title from the API if available
            resolved_title = data.get("parse", {}).get("title", title)

            corpus.append({
                "title": resolved_title,
                "slug": title,      # keep original slug for matching
                "text": cleaned,
                "chars": len(cleaned),
            })
            print(f"    ✓ {len(cleaned)} chars — {resolved_title}")

        except Exception as e:
            print(f"    ✗ Error: {e}")

        # Be polite to the wiki server
        time.sleep(0.4)

    # Write JS output
    output = [{k: v for k, v in p.items() if k != 'chars'} for p in corpus]
    js = f"const LORE_CORPUS = {json.dumps(output, indent=2, ensure_ascii=False)};"

    with open("scraper/lore_corpus.js", "w", encoding="utf-8") as f:
        f.write(js)

    total_chars = sum(p['chars'] for p in corpus)
    print(f"\nDone — {len(corpus)}/{len(PAGES)} pages, {total_chars:,} chars total")
    print(f"Output: scraper/lore_corpus.js ({len(js):,} bytes)")

if __name__ == "__main__":
    build_corpus()