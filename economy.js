/**
 * WWG Economy Controller
 * Manages virtual currency (Coins) across the gallery.
 */
const Economy = {
    STORAGE_KEY: 'wwg_coin_balance',
    
    getCoins: function() {
        const balance = localStorage.getItem(this.STORAGE_KEY);
        return balance ? parseInt(balance) : 0;
    },
    
    addCoins: function(amount) {
        const current = this.getCoins();
        const newBalance = current + amount;
        localStorage.setItem(this.STORAGE_KEY, newBalance);
        this.updateUI();
        return newBalance;
    },
    
    spendCoins: function(amount) {
        const current = this.getCoins();
        if (current >= amount) {
            const newBalance = current - amount;
            localStorage.setItem(this.STORAGE_KEY, newBalance);
            this.updateUI();
            return true;
        }
        return false;
    },
    
    updateUI: function() {
        // Update any elements with the 'coin-balance' class
        const balance = this.getCoins();
        document.querySelectorAll('.coin-balance-val').forEach(el => {
            el.textContent = balance.toLocaleString();
        });
        
        // Dispatch event for components to listen to
        window.dispatchEvent(new CustomEvent('economyUpdate', { detail: { balance } }));
    },

    logTransaction: function(type, amount, priceUSD) {
        const logs = JSON.parse(localStorage.getItem('wwg_transactions') || '[]');
        logs.push({
            id: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            timestamp: new Date().toISOString(),
            type: type,
            amount: amount,
            price: priceUSD,
            status: 'SUCCESS'
        });
        localStorage.setItem('wwg_transactions', JSON.stringify(logs.slice(-50))); // Keep last 50
    }
};

// Auto-initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    Economy.updateUI();
});
