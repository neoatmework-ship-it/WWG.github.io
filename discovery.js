/**
 * WWG Discovery Engine
 * Handles persistent unlocking of secret sites via localStorage.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // List of all 20 secret site IDs
    SITES: [
        'void', 'ghost', 'classified', 'backrooms',
        'limbo', 'static', 'deep', 'underground',
        'starlight', 'eclipse', 'mirror', 'blackhole',
        'chosen', 'useful', 'corner', 'braille',
        'glitch', 'voidvoid', 'terminal', 'blueprint', 'zenith',
        'gravity', 'timeloop', 'forest', 'observer'
    ],

    unlock: function (siteId) {
        if (!this.SITES.includes(siteId)) return;

        const discovered = this.getDiscovered();
        if (!discovered.includes(siteId)) {
            discovered.push(siteId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
            this.notify(siteId);
        }
    },

    getDiscovered: function () {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    notify: function (siteId) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(167, 139, 250, 0.9);
            color: #fff;
            padding: 15px 30px;
            border-radius: 50px;
            font-family: sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
            z-index: 99999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        `;
        toast.innerHTML = `✨ FRAGMENT SALVAGED: ${siteId.toUpperCase()}`;
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
        }, 3000);
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

// Auto-unlock based on filename if not already in a specific call
(function () {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');

    // Mapping specific filenames to IDs if they differ
    const map = {
        'the-chosen': 'chosen',
        'useful-button': 'useful',
        'dvd-secret': 'corner',
        'braille-translator': 'braille',
        'glitch-text': 'glitch',
        'glitch-void': 'voidvoid',
        'zen-garden': 'zenith',
        'gravity-shift': 'gravity',
        'time-loop': 'timeloop',
        'binary-forest': 'forest',
        'the-observer': 'observer'
    };

    const id = map[filename] || filename;
    if (Discovery.SITES.includes(id)) {
        Discovery.unlock(id);
    }
})();
