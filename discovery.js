/**
 * WWG Discovery Engine
 * Handles persistent unlocking of secret sites via localStorage.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // List of all secret site IDs (45 original + 55 new = 100 total)
    SITES: [
        'void', 'ghost', 'classified', 'backrooms',
        'limbo', 'static', 'deep', 'underground',
        'starlight', 'eclipse', 'mirror', 'blackhole',
        'chosen', 'useful', 'corner', 'braille',
        'glitch', 'voidvoid', 'terminal', 'blueprint', 'zenith',
        'gravity', 'timeloop', 'forest', 'observer',
        'analog', 'spectrum', 'cipher', 'echo',
        'fable', 'glimmer', 'horizon', 'imprint',
        'jigsaw', 'kinetic', 'lattice', 'monolith',
        'nebula', 'oracle', 'parallax', 'quartz',
        'resonance', 'solstice', 'tether', 'ultra',
        // --- 55 New Secrets ---
        'abyss', 'alchemy', 'anomaly', 'aurora', 'beacon',
        'bones', 'cascade', 'cataclysm', 'chronos', 'cobweb',
        'core', 'crypt', 'crystal', 'cube', 'dawn',
        'decay', 'dew', 'dimension', 'drift', 'dune',
        'ember', 'enigma', 'entropy', 'fault', 'flora',
        'flux', 'fossil', 'fracture', 'frost', 'geode',
        'glyph', 'halo', 'helix', 'hive', 'hollow',
        'illusion', 'inferno', 'ink', 'labyrinth', 'lucid',
        'magma', 'meteor', 'mirage', 'nexus', 'nomad',
        'oasis', 'omen', 'paradox', 'phantom', 'prism',
        'pulse', 'quantum', 'relic', 'siren', 'totem'
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
            background: #a78bfa;
            color: #fff;
            padding: 15px 30px;
            border-radius: 50px;
            font-family: sans-serif;
            font-weight: bold;
            letter-spacing: 2px;
            z-index: 999999;
            box-shadow: 0 10px 30px rgba(167, 139, 250, 0.5);
            backdrop-filter: blur(10px);
            animation: slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            text-transform: uppercase;
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
