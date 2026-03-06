const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/pikav/OneDrive/Desktop/websites';

// 1. Get the list of all normal pages in order from index.html
const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const cardRegex = /<a href="([^"]+\.html)" class="card"/g;
let match;
const pages = [];
while ((match = cardRegex.exec(indexHtml)) !== null) {
    if (!pages.includes(match[1])) {
        pages.push(match[1]);
    }
}
console.log('Found ' + pages.length + ' pages in index.html to add prev/next buttons.');

// 2. Inject Next/Prev into every page
pages.forEach((page, i) => {
    let prev = i > 0 ? pages[i - 1] : pages[pages.length - 1];
    let next = i < pages.length - 1 ? pages[i + 1] : pages[0];
    
    let filePath = path.join(dir, page);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove existing if any (in case of re-run)
        content = content.replace(/<!-- WWG_NAV_START -->[\s\S]*?<!-- WWG_NAV_END -->/g, '');
        
        const navHtml = `
<!-- WWG_NAV_START -->
<style>
.wwg-nav {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 99999;
}
.wwg-nav a {
    background: rgba(10, 10, 15, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #a78bfa;
    padding: 8px 16px;
    border-radius: 20px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
}
.wwg-nav a:hover {
    background: rgba(167, 139, 250, 0.2);
    border-color: rgba(167, 139, 250, 0.4);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
}
</style>
<div class="wwg-nav">
    <a href="${prev}">← Prev</a>
    <a href="${next}">Next →</a>
</div>
<!-- WWG_NAV_END -->
</body>`;
        
        content = content.replace(/<\/body>/i, navHtml);
        fs.writeFileSync(filePath, content);
    }
});

// 3. Update useless-buttons.html
const uPath = path.join(dir, 'useless-buttons.html');
let uHtml = fs.readFileSync(uPath, 'utf8');
if (!uHtml.includes('konamiCode')) {
    uHtml = uHtml.replace('renderAchPanel();', `
        // Secret: Konami
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        window.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    document.body.style.transition = 'opacity 2s ease';
                    document.body.style.opacity = '0';
                    setTimeout(() => window.location.href = 'useful-button.html', 1500);
                }
            } else {
                konamiIndex = 0;
            }
        });
        
        renderAchPanel();`);
    fs.writeFileSync(uPath, uHtml);
    console.log('injected konami code into useless-buttons.html');
}

// 4. Update index.html spoiler count
let idxHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
idxHtml = idxHtml.replace(/>Spoilers \(11\)<\/a>/g, '>Spoilers (13)</a>');
fs.writeFileSync(path.join(dir, 'index.html'), idxHtml);

// 5. Update cheatsheet.html
const cheatPath = path.join(dir, 'cheatsheet.html');
let cheatHtml = fs.readFileSync(cheatPath, 'utf8');
if (!cheatHtml.includes('The Corner Room')) {
    cheatHtml = cheatHtml.replace('11 hidden web pages', '13 hidden web pages');
    const newSecrets = `
        <div class="secret-card">
            <div class="sc-header">
                <div class="sc-title">12. The Corner Room</div>
                <div class="sc-icon">💽</div>
            </div>
            <div class="sc-trigger"><strong>Website:</strong> DVD Simulator<br><strong>Trigger:</strong> Adjust speed and size until the DVD logo hits exactly into the corner of the screen <strong>1 time</strong>.</div>
            <div class="sc-desc"><strong>What it is:</strong> A room celebrating the ultimate satisfaction of the perfect corner bounce.</div>
        </div>

        <div class="secret-card">
            <div class="sc-header">
                <div class="sc-title">13. The Useful Button</div>
                <div class="sc-icon">🟢</div>
            </div>
            <div class="sc-trigger"><strong>Website:</strong> Useless Buttons<br><strong>Trigger:</strong> Type the classic Konami code anywhere on the page: <strong style="color:var(--accent)">Up, Up, Down, Down, Left, Right, Left, Right, B, A</strong>.</div>
            <div class="sc-desc"><strong>What it is:</strong> Finally, a button that actually does something productive (sort of).</div>
        </div>

    </div>`;
    cheatHtml = cheatHtml.replace('</div>\n\n</body>', newSecrets + '\n\n</body>');
    fs.writeFileSync(cheatPath, cheatHtml);
}

console.log('Update Complete.');
