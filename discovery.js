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
            html { 
                filter: invert(0.2) sepia(1) saturate(10) hue-rotate(-60deg) contrast(1.5) !important; 
                background: #000 !important;
            }
            body::before {
                content: "";
                position: fixed;
                inset: 0;
                background: 
                    repeating-linear-gradient(0deg, rgba(255,0,0,0.05) 0px, transparent 1px, transparent 2px),
                    radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 150%);
                pointer-events: none;
                z-index: 999999;
                animation: scanline 15s linear infinite, pulseVignette 4s ease-in-out infinite;
                mix-blend-mode: multiply;
            }
            @keyframes scanline { from { transform: translateY(-100vh); } to { transform: translateY(100vh); } }
            @keyframes pulseVignette { 
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }
            .wwg-back-btn, .wwg-nav a, .back-link { 
                border-color: #ff0000 !important; 
                color: #ff0000 !important; 
                text-shadow: 0 0 10px #ff0000 !important;
                background: rgba(0,0,0,0.8) !important;
            }
            /* Override common element colors to red */
            h1, h2, h3, .name, .title, .btn { color: #ff0000 !important; text-shadow: 0 0 15px rgba(255,0,0,0.5) !important; }
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
    },

    // Custom behaviors for Tainted sites
    customTaintedLogic: {
        'void': () => {
            setInterval(() => {
                document.body.style.transform = `translate(${(Math.random() - 0.5) * 15}px, ${(Math.random() - 0.5) * 15}px)`;
                if (Math.random() > 0.9) document.body.style.filter = 'invert(1) contrast(2)';
                else document.body.style.filter = '';
            }, 50);
            document.title = "ERROR: THE VOID";
        },
        'starlight': () => {
            document.body.style.background = '#200';
            const h1 = document.querySelector('h1');
            if (h1) {
                h1.textContent = "THE BLOOD SKY";
                h1.style.color = "#ff0000";
                h1.style.textShadow = "0 0 20px #f00";
            }
            const s = document.createElement('style');
            s.textContent = `canvas { filter: hue-rotate(-120deg) saturate(5) contrast(2); animation: starsShake 0.1s infinite; }
                             @keyframes starsShake { 0% { transform: translate(1px,1px); } 50% { transform: translate(-1px,-1px); } }`;
            document.head.appendChild(s);
        },
        'mirror': () => {
            const s = document.createElement('style');
            s.textContent = `body { background: #000 !important; } 
                             canvas { opacity: 0.3; filter: grayscale(1) contrast(5); }`;
            document.head.appendChild(s);
            document.title = "BROKEN_REALITY";
        },
        'chosen': () => {
            const s = document.createElement('style');
            s.textContent = `body { background: radial-gradient(circle, #300 0%, #000 70%) !important; }
                             .chosen-aura { box-shadow: 0 0 100px #f00 !important; }`;
            document.head.appendChild(s);
        }
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

        // Run custom logic if it exists
        if (isTainted && Discovery.customTaintedLogic[id]) {
            Discovery.customTaintedLogic[id]();
        }
    }
})();
