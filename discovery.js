/**
 * THE SECRET HUB ENGINE (v6.0)
 * Central management for all hidden collectibles across the system.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // Define all available secrets in the system
    SECRETS: [
        { 
            id: 'the-underground', 
            name: 'The Underground', 
            description: 'A reality-glitched archive from another timeline.',
            icon: '💀',
            url: 'underground.html'
        },
        { 
            id: 'the-void', 
            name: 'The Void', 
            description: 'Where deleted data goes to rest.',
            icon: '🌀',
            url: 'glitch-void.html'
        },
        {
            id: 'legacy-fragment',
            name: 'Old World Memory',
            description: 'A fragment from the ancient expansion era.',
            icon: '🛡️',
            url: 'cheatsheet.html'
        }
    ],

    unlock: function (id) {
        const secret = this.SECRETS.find(s => s.id === id);
        if (!secret) return;

        const discovered = this.getDiscovered();
        if (!discovered.includes(id)) {
            discovered.push(id);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
            this.notify(secret);
        }
    },

    getDiscovered: function () {
        const data = localStorage.getItem(this.STORAGE_KEY);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    isUnlocked: function(id) {
        return this.getDiscovered().includes(id);
    },

    notify: function (secret) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
            background: #000; color: #ffff00;
            border: 3px solid #ffff00; padding: 20px 40px;
            font-family: 'VT323', monospace;
            border-radius: 0; z-index: 10000;
            box-shadow: 0 0 40px rgba(255, 255, 0, 0.4);
            cursor: pointer; text-transform: uppercase; letter-spacing: 4px;
            font-weight: bold; font-size: 1.5rem;
            animation: glitch-toast 0.2s infinite;
        `;
        
        toast.innerHTML = `${secret.icon} SECRET_UNLOCKED: ${secret.name.replace(/ /g, '_')} ★`;
        toast.onclick = () => window.location.href = 'secret-hub.html';
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 8000);
        console.log(`%c[SYSTEM] ${secret.name} ADDED TO ARCHIVE.`, "color:#ffff00; font-weight:bold");
    }
};

// Global Animation for Toasts
const style = document.createElement('style');
style.textContent = `@keyframes glitch-toast { 
    0% { transform: translate(-50%, 0); }
    50% { transform: translate(-52%, 2px); }
    100% { transform: translate(-48%, -2px); }
}`;
document.head.appendChild(style);
