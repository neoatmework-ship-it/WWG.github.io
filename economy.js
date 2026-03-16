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
    }
};

// Auto-initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    Economy.updateUI();
});
