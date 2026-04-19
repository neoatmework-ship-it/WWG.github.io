/**
 * GASTER FRAGMENT HOOK (v1.0)
 * Handles hidden collectibles that reward the player and unlock avatars.
 */
const GasterHook = {
    checkCollection: function() {
        const discovered = JSON.parse(localStorage.getItem('wwg_discovered_secrets') || '[]');
        const fragmentCount = discovered.filter(id => id.startsWith('fragment-')).length;
        
        if (fragmentCount >= 5) {
            const avatarData = JSON.parse(localStorage.getItem('wwg_avatar_data') || '{}');
            if (!avatarData.unlocked?.includes('the-collector')) {
                avatarData.unlocked = [...(avatarData.unlocked || []), 'the-collector'];
                localStorage.setItem('wwg_avatar_data', JSON.stringify(avatarData));
                this.notifyCollector();
            }
        }
    },

    spawnFragment: function(id, top, left, parent = document.body) {
        const discovered = JSON.parse(localStorage.getItem('wwg_discovered_secrets') || '[]');
        if (discovered.includes(id)) return;

        const frag = document.createElement('div');
        frag.innerHTML = '☠︎'; // Wingdings-ish skull
        frag.style.cssText = `
            position: absolute; top: ${top}; left: ${left};
            font-size: 2rem; color: #fff; cursor: pointer;
            z-index: 9999; opacity: 0.1; filter: grayscale(1);
            transition: 0.3s; user-select: none;
            text-shadow: 0 0 10px #fff;
        `;
        
        frag.onmouseover = () => frag.style.opacity = '0.8';
        frag.onmouseout = () => frag.style.opacity = '0.1';
        
        frag.onclick = () => {
            frag.style.transform = 'scale(5) rotate(360deg)';
            frag.style.opacity = '0';
            setTimeout(() => frag.remove(), 300);
            
            // Logic
            if (typeof Economy !== 'undefined') Economy.addCoins(500);
            if (typeof Discovery !== 'undefined') Discovery.unlock(id);
            
            this.checkCollection();
        };

        parent.appendChild(frag);
    },

    notifyCollector: function() {
        alert("YOU HAVE REASSEMBLED THE SHATTERED MAN. 'COLLECTOR' IDENTITY UNLOCKED.");
    }
};

// Auto-check on load
document.addEventListener('DOMContentLoaded', () => GasterHook.checkCollection());
