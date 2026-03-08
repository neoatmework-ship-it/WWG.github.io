/**
 * WWG Discovery Engine
 * Handles persistent unlocking of secret sites via localStorage.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',
    TAINTED_KEY: 'wwg_tainted_secrets',

    // List of all 25 secret site IDs
    SITES: [
        'void', 'ghost', 'classified', 'backrooms',
        'limbo', 'static', 'deep', 'underground',
        'starlight', 'eclipse', 'mirror', 'blackhole',
        'chosen', 'useful', 'corner', 'braille',
        'glitch', 'voidvoid', 'terminal', 'blueprint', 'zenith',
        'gravity', 'timeloop', 'forest', 'observer'
    ],

    unlock: function (siteId, tainted = false) {
        if (!this.SITES.includes(siteId)) return;

        const key = tainted ? this.TAINTED_KEY : this.STORAGE_KEY;
        const discovered = this.getDiscovered(tainted);
        if (!discovered.includes(siteId)) {
            discovered.push(siteId);
            localStorage.setItem(key, JSON.stringify(discovered));
            this.notify(siteId, tainted);
        }
    },

    getDiscovered: function (tainted = false) {
        const key = tainted ? this.TAINTED_KEY : this.STORAGE_KEY;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    notify: function (siteId, tainted = false) {
        const toast = document.createElement('div');
        const color = tainted ? '#ef4444' : '#a78bfa';
        const glow = tainted ? 'rgba(239, 68, 68, 0.5)' : 'rgba(167, 139, 250, 0.5)';
        toast.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: #fff;
            padding: 15px 30px;
            border-radius: 50px;
            font-family: sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
            z-index: 999999;
            box-shadow: 0 10px 30px ${glow};
            backdrop-filter: blur(10px);
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            text-transform: uppercase;
        `;
        toast.innerHTML = `✨ ${tainted ? 'TAINTED' : 'FRAGMENT'} SALVAGED: ${siteId.toUpperCase()}`;
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

    isTainted: function () {
        return new URLSearchParams(window.location.search).get('tainted') === 'true';
    },

    applyTaintedEffects: function () {
        if (!this.isTainted()) return;

        const style = document.createElement('style');
        style.textContent = `
            html { filter: invert(0.1) sepia(1) saturate(5) hue-rotate(-50deg) contrast(1.2) !important; }
            body::before {
                content: "";
                position: fixed;
                inset: 0;
                background: repeating-linear-gradient(0deg, rgba(255,0,0,0.03) 0px, transparent 1px, transparent 2px);
                pointer-events: none;
                z-index: 999999;
                animation: scanline 10s linear infinite;
            }
            @keyframes scanline { from { transform: translateY(0); } to { transform: translateY(100vh); } }
            .wwg-back-btn, .wwg-nav a { border-color: #ef4444 !important; color: #ef4444 !important; }
        `;
        document.head.appendChild(style);
    },

    cheat_unlock_all: function () {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.SITES));
        localStorage.setItem(this.TAINTED_KEY, JSON.stringify(this.SITES));
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
    const isTainted = Discovery.isTainted();

    if (isTainted) Discovery.applyTaintedEffects();

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
        Discovery.unlock(id, isTainted);
    }
})();
