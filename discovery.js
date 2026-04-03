/**
 * WWG Discovery Engine
 * Handles persistent unlocking of secrets via localStorage.
 */
const Discovery = {
    STORAGE_KEY: 'wwg_discovered_secrets',

    // 10 fragments — each with unique rewards
    SITES: [
        { id: 'phantom-signal', name: 'Phantom Signal', theme: 'phantom-mode' },
        { id: 'void-fragment', name: 'Void Fragment', theme: 'void-mode' },
        { id: 'oracle-machine', name: 'The Oracle Machine', theme: 'oracle-effect' },
        { id: 'whisperer', name: 'The Whisperer', theme: 'echo-mode' },
        { id: 'pattern-breaker', name: 'Pattern Breaker', theme: 'grid-glitch' },
        { id: 'night-mode', name: 'Night Mode', theme: 'starlight' },
        { id: 'forgotten', name: 'The Forgotten', theme: 'ghost-mode' },
        { id: 'chaos-engine', name: 'Chaos Engine', theme: 'chaos-mode' },
        { id: 'liar', name: 'The Liar', theme: 'deception-filter' },
        { id: 'grand-finale', name: '★ THE GRAND FINALE ★', theme: 'universal-god' },
    ],

    unlock: function (siteId) {
        const site = this.SITES.find(s => s.id === siteId);
        if (!site) return;

        const discovered = this.getDiscovered();
        if (!discovered.includes(siteId)) {
            discovered.push(siteId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(discovered));
            
            // SUPER COOL FEEDBACK
            this.playRewardSound();
            this.triggerGlitch();
            
            if (siteId === 'grand-finale') {
                this.triggerFinale();
            } else {
                this.notify(siteId);
            }

            // Auto-unlock grand finale
            const others = this.SITES.filter(s => s.id !== 'grand-finale');
            const allFound = others.every(s => discovered.includes(s.id));
            if (allFound && !discovered.includes('grand-finale')) {
                setTimeout(() => this.unlock('grand-finale'), 3000);
            }
        }
    },

    triggerFinale: function() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; background: #000; z-index: 1000000;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: gold; font-family: 'Space Grotesk', sans-serif; opacity: 0; transition: 2s;
        `;
        overlay.innerHTML = `
            <div style="font-size: 5rem; text-shadow: 0 0 50px gold; animation: pulse 2s infinite;">💎</div>
            <div style="font-size: 2rem; font-weight: 700; letter-spacing: 15px; margin-top: 30px;">SINGULARITY_STABILIZED</div>
            <div style="font-size: 0.8rem; margin-top: 20px; color: #fff; letter-spacing: 5px; opacity: 0.5;">THE CORE HAS BEN SALVAGED.</div>
            <button onclick="this.parentElement.remove()" style="margin-top: 50px; background: none; border: 1px solid gold; color: gold; padding: 10px 40px; cursor: pointer; font-family: inherit; text-transform: uppercase;">Acknowledge</button>
        `;
        document.body.appendChild(overlay);
        setTimeout(() => overlay.style.opacity = '1', 100);
    },

    playRewardSound: function() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(40, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch(e) {}
    },

    triggerGlitch: function() {
        const body = document.body;
        body.style.filter = 'contrast(200%) brightness(150%) hue-rotate(90deg)';
        body.style.transform = 'translate(10px, -5px) scale(1.02)';
        
        let i = 0;
        const interval = setInterval(() => {
            body.style.transform = `translate(${Math.random()*20-10}px, ${Math.random()*20-10}px)`;
            body.style.filter = `hue-rotate(${Math.random()*360}deg) brightness(${100 + Math.random()*100}%)`;
            if (++i > 10) {
                clearInterval(interval);
                body.style.filter = '';
                body.style.transform = '';
                body.style.transition = '0.5s';
                setTimeout(() => body.style.transition = '', 500);
            }
        }, 40);
    },

    getDiscovered: function () {
        const data = localStorage.getItem(this.STORAGE_KEY);
        const discovered = data ? JSON.parse(data) : [];
        const validIds = this.SITES.map(s => s.id);
        return discovered.filter(id => validIds.includes(id));
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
        }, id === 'grand-finale' ? 6000 : 3500);

        console.log(`%c[SYSTEM_LOG] %cFragment sequence detected. Stabilizing...`, "color:#a78bfa; font-weight:bold", "color:#888");
    },

    getActiveTheme: function() {
        return localStorage.getItem('wwg_active_theme') || 'default';
    },

    setActiveTheme: function(theme) {
        localStorage.setItem('wwg_active_theme', theme);
        document.body.className = theme;
    },

    cheat_unlock_all: function () {
        const ids = this.SITES.map(s => s.id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
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
