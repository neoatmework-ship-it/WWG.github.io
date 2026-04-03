/**
 * WWG Discovery Engine
 * Handles persistent unlocking of secrets via localStorage.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // 10 secrets — each earned through a unique action
    SITES: [
        'phantom-signal',   // Click the page title 7 times
        'void-fragment',    // Stay for 60 seconds without clicking anything
        'oracle-machine',   // Type "FUTURE" anywhere on index
        'whisperer',        // Type your name (3+ chars) into search and press Enter
        'pattern-breaker',  // Click 4 screen corners in order (TL→TR→BR→BL)
        'night-mode',       // Visit between midnight and 01:00
        'forgotten',        // Search for something with 0 results, then wait 15s
        'chaos-engine',     // Type "CHAOS" anywhere on index
        'liar',             // Let Liar's Clicker count reach a displayed 100
        'grand-finale',     // Unlock all 9 other secrets
    ],

    unlock: function (siteId) {
        if (!this.SITES.includes(siteId)) return;

        const discovered = this.getDiscovered();
        if (!discovered.includes(siteId)) {
            discovered.push(siteId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
            this.notify(siteId);

            // Auto-unlock grand finale when all 9 others are found
            const others = this.SITES.filter(s => s !== 'grand-finale');
            const allOthers = others.every(s => discovered.includes(s) || s === siteId);
            if (allOthers && !discovered.includes('grand-finale')) {
                setTimeout(() => this.unlock('grand-finale'), 2000);
            }
        }
    },

    getDiscovered: function () {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const discovered = data ? JSON.parse(data) : [];
        return discovered.filter(id => this.SITES.includes(id));
    },

    notify: function (id) {
        // Glitch Toast Implementation
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 40px; right: 40px;
            background: #000; color: #a78bfa;
            border: 1px solid #a78bfa; padding: 20px 30px;
            font-family: 'JetBrains Mono', monospace;
            border-radius: 8px; z-index: 10000;
            box-shadow: 0 0 30px rgba(167, 139, 250, 0.4);
            animation: toast-glitch 0.3s cubic-bezier(.25,.46,.45,.94) both;
            cursor: pointer; text-transform: uppercase; letter-spacing: 2px;
        `;
        
        toast.innerHTML = `
            <div style="font-size: 0.6rem; opacity: 0.5; margin-bottom: 5px;">[FRAGMENT_SALVAGED]</div>
            <div style="font-weight: bold;">FRAGMENT_STABILIZED</div>
        `;

        toast.addEventListener('click', () => window.location.href = 'archive.html');
        document.body.appendChild(toast);

        if (!document.getElementById('discovery-glitch-style')) {
            const style = document.createElement('style');
            style.id = 'discovery-glitch-style';
            style.innerHTML = `
                @keyframes toast-glitch {
                    0% { transform: translate(0); clip-path: inset(0 0 0 0); }
                    20% { transform: translate(-5px, 5px); clip-path: inset(10% 0 50% 0); }
                    40% { transform: translate(5px, -5px); clip-path: inset(40% 0 20% 0); }
                    60% { transform: translate(-2px, 2px); clip-path: inset(80% 0 5% 0); }
                    100% { transform: translate(0); clip-path: inset(0 0 0 0); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = '0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 5000);

        console.log(`%c[SYSTEM_LOG] %cFragment sequence detected. Stabilizing...`, "color:#a78bfa; font-weight:bold", "color:#888");
    }, isFinal ? 6000 : 3500);
    },

    cheat_unlock_all: function () {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.SITES));
    },

    CHEATSHEET_KEY: 'wwg_cheatsheet_unlocked',

    unlockCheatsheet: function () {
        localStorage.setItem(this.CHEATSHEET_KEY, 'true');
    },

    isCheatsheetUnlocked: function () {
        return localStorage.getItem(this.CHEATSHEET_KEY) === 'true';
    }
};

// Auto-unlock based on filename (for page-visit secrets)
(function () {
    // Night-mode secret: unlock if visited between 00:00 and 01:00
    const hour = new Date().getHours();
    if (hour === 0) Discovery.unlock('night-mode');

    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    const map = {
    };
    const id = map[filename] || filename;
    if (Discovery.SITES.includes(id)) {
        Discovery.unlock(id);
    }
})();
