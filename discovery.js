/**
 * THE SECRET HUB ENGINE (v6.0)
 * Central management for all hidden collectibles across the system.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // Define all available secrets in the system
    SECRETS: [
        { 
            id: 'void-conqueror', 
            name: 'Void Conqueror', 
            description: 'You faced the judgement and survived.',
            icon: '⚖️',
            url: 'sans-fight.html'
        },
        { 
            id: 'the-terminal', 
            name: 'TermOS Terminal', 
            description: 'You accessed the restricted command-line interface.',
            icon: '⌨️',
            url: 'terminal.html'
        },
        {
            id: 'the-beacon',
            name: 'System Beacon',
            description: 'You breached the telemetry node. Data streams stabilized.',
            icon: '📡',
            url: 'beacon.html'
        }
    ],

    cheat_unlock_all: function() {
        const discovered = this.getDiscovered();
        this.SECRETS.forEach(s => { if(!discovered.includes(s.id)) discovered.push(s.id); });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
        console.log('[SYSTEM] ALL_RESTRICTIONS_LIFTED.');
    },

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
            border: 3px solid #ffff00; padding: 15px 30px;
            font-family: 'VT323', monospace;
            border-radius: 0; z-index: 10000;
            box-shadow: 0 0 40px rgba(255, 255, 0, 0.4);
            cursor: pointer; text-transform: uppercase; letter-spacing: 4px;
            font-weight: bold; font-size: 1.5rem;
            display: flex; align-items: center;
            animation: glitch-toast 0.2s infinite;
        `;
        
        const isEmoji = !secret.icon.startsWith('http');
        const iconHtml = isEmoji 
            ? `<span style="font-size: 2rem; margin-right: 15px;">${secret.icon}</span>`
            : `<img src="${secret.icon}" style="width: 32px; height: 32px; image-rendering: pixelated; vertical-align: middle; margin-right: 15px;">`;

        toast.innerHTML = `
            ${iconHtml}
            SECRET_UNLOCKED: ${secret.name.replace(/ /g, '_')} ★
        `;
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
