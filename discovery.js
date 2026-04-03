/**
 * THE UNDERGROUND ENGINE (v5.0)
 * Manages the singular master secret: The Underground.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // New singular secret
    SITES: [
        { id: 'the-underground', name: 'The Underground', theme: 'underground-mode' }
    ],

    unlock: function (siteId) {
        if (siteId !== 'the-underground') return;

        const discovered = this.getDiscovered();
        if (!discovered.includes(siteId)) {
            discovered.push(siteId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
            this.notify();
        }
    },

    getDiscovered: function () {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const discovered = data ? JSON.parse(data) : [];
        return discovered.filter(id => id === 'the-underground');
    },

    isUnlocked: function() {
        return this.getDiscovered().includes('the-underground');
    },

    notify: function () {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
            background: #000; color: #ffff00;
            border: 3px solid #ffff00; padding: 20px 40px;
            font-family: 'Courier New', monospace;
            border-radius: 0; z-index: 10000;
            box-shadow: 0 0 40px rgba(255, 255, 0, 0.4);
            cursor: pointer; text-transform: uppercase; letter-spacing: 4px;
            font-weight: bold; font-size: 1.5rem;
        `;
        
        toast.innerHTML = `★ ACCESS_GRANTED: THE_UNDERGROUND ★`;
        toast.onclick = () => window.location.href = 'underground.html';
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 8000);
        console.log("%c[SYSTEM] DETERMINATION_STABILIZED.", "color:#ffff00; font-weight:bold");
    },

    // Legacy support (safe-clear)
    cheat_unlock_all: function () {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(['the-underground']));
    }
};

// Initial check
(function() {
    if (Discovery.isUnlocked()) {
        console.log("%c[SYSTEM] WELCOME BACK TO THE UNDERGROUND.", "color:#ffff00; font-weight:bold");
    }
})();
