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

    notify: function (siteId) {
        const names = {
            'phantom-signal': 'Phantom Signal',
            'void-fragment': 'Void Fragment',
            'oracle-machine': 'The Oracle Machine',
            'whisperer': 'The Whisperer',
            'pattern-breaker': 'Pattern Breaker',
            'night-mode': 'Night Mode',
            'forgotten': 'The Forgotten',
            'chaos-engine': 'Chaos Engine',
            'liar': 'The Liar',
            'grand-finale': '★ THE GRAND FINALE ★',
        };
        const name = names[siteId] || siteId;
        const isFinal = siteId === 'grand-finale';

        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isFinal ? 'linear-gradient(135deg,#ff6600,#a78bfa)' : '#a78bfa'};
            color: #fff;
            padding: ${isFinal ? '20px 48px' : '15px 30px'};
            border-radius: 50px;
            font-family: sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
            z-index: 999999;
            box-shadow: 0 10px 30px rgba(167, 139, 250, 0.5);
            backdrop-filter: blur(10px);
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            text-transform: uppercase;
            font-size: ${isFinal ? '1.1rem' : '0.9rem'};
        `;
        toast.innerHTML = `✨ SECRET FOUND: ${name}`;
        document.body.appendChild(toast);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { bottom: -100px; opacity: 0; }
                to { bottom: 40px; opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = '0.5s';
            setTimeout(() => toast.remove(), 500);
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
