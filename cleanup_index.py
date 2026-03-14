import os
import re

def full_cleanup():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all card blocks
    # We capture the optional comment and the <a> tag
    card_pattern = re.compile(r'(<!--.*?-->\s*)?<a href="([^"]+)" class="card"(?: data-tags="[^"]*")?>.*?</a>', re.DOTALL)
    
    matches = list(card_pattern.finditer(content))
    new_sites_removed = 0
    remaining_cards = []
    
    # We will remove any card that has "label-new" inside it
    for match in matches:
        block = match.group(0)
        href = match.group(2)
        
        if 'label-new' in block:
            print(f"Removing 'New' card and file: {href}")
            # Remove the file if it exists
            if os.path.exists(href):
                os.remove(href)
            content = content.replace(block, "")
            new_sites_removed += 1
        else:
            remaining_cards.append(href)

    # Secondary check: remove any cards for files that don't exist (ghost cards)
    matches_after = list(card_pattern.finditer(content))
    for match in matches_after:
        block = match.group(0)
        href = match.group(2)
        if not os.path.exists(href):
            print(f"Removing ghost card: {href}")
            content = content.replace(block, "")

    # Cleanup whitespace
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

    # Baseline was 68 sites
    baseline = 68
    
    # Force the counts back to 68
    content = re.sub(r'<div class="hero-count"><strong>\d+</strong> sites and counting</div>', 
                     f'<div class="hero-count"><strong>{baseline}</strong> sites and counting</div>', 
                     content)
    
    content = re.sub(r'placeholder="Search \d+\+ sites', 
                     f'placeholder="Search {baseline}+ sites', 
                     content)
    
    content = re.sub(r'<div class="filter-count" id="filter-count">Showing <strong>\d+</strong> of \d+ sites</div>', 
                     f'<div class="filter-count" id="filter-count">Showing <strong>{baseline}</strong> of {baseline} sites</div>', 
                     content)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Cleanup complete. Removed {new_sites_removed} 'New' sites.")

if __name__ == "__main__":
    full_cleanup()
