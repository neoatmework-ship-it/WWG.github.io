/**
 * WEIRD_WEBSITE_GALLERY TELEMETRY ENGINE (v2.0)
 * Unified module for data ingestion (tracking) and retrieval (dashboard).
 */
const Telemetry = {
    NAMESPACE: 'wwg_telemetry_pikav',
    API_BASE: 'https://api.counterapi.dev/v1/wwg_telemetry_pikav',

    /**
     * Internal Proxy Fetcher
     * Supports multi-tier CORS bypass for high reliability.
     */
    _proxyFetch: async function(target, mode = 'GET') {
        const isUp = target.endsWith('/up');
        const proxies = [
            (url) => url, // Direct
            (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
            (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        ];

        for (let getProxyUrl of proxies) {
            try {
                const cb = Date.now() + Math.random();
                const urlWithCb = target + (target.includes('?') ? '&' : '?') + `cb=${cb}`;
                const res = await fetch(getProxyUrl(urlWithCb), { method: 'GET' });
                if (res.ok) {
                    if (isUp) return true;
                    return await res.json();
                }
            } catch (e) {}
        }
        throw new Error("TELEMETRY_LINK_FAILURE");
    },

    /**
     * Send tracking event (Increment)
     */
    track: async function(key) {
        if (localStorage.getItem('wwg_is_owner') === 'true') return;
        try {
            await this._proxyFetch(`${this.API_BASE}/${key}/up`);
        } catch (e) {
            console.warn(`[TELEMETRY] Failed to track ${key}`);
        }
    },

    /**
     * Retrieve total count (Dashboard)
     */
    fetch: async function(key) {
        try {
            const data = await this._proxyFetch(`${this.API_BASE}/${key}`);
            return data.count || 0;
        } catch (e) {
            console.warn(`[TELEMETRY] Failed to fetch ${key}`);
            return "ERR";
        }
    },

    /**
     * Automatic Site-Wide Initialization
     */
    init: function() {
        if (localStorage.getItem('wwg_is_owner') === 'true') return;

        // 1. Record Page Visit
        this.track('total_visits');

        // 2. Continuous Click Tracking
        document.addEventListener('click', (e) => {
            this.track('clicks');

            const card = e.target.closest('.card');
            if (card) {
                this.track('click_card');
                const href = card.getAttribute('href');
                if (href) {
                    const siteId = href.replace('.html', '').split('/').pop();
                    this.track(`card_${siteId}`);
                }
            } else if (e.target.closest('#wwg-title')) {
                this.track('click_title');
            } else {
                const pill = e.target.closest('.filter-pill');
                if (pill) {
                    this.track('click_filter');
                    const filter = pill.getAttribute('data-filter') || pill.textContent.trim().toLowerCase();
                    this.track(`filter_${filter}`);
                }
            }
        });

        // 3. Unique Visitor & Retention
        const now = Date.now();
        let firstVisit = localStorage.getItem('wwg_first_visit');
        
        if (!firstVisit) {
            firstVisit = now;
            localStorage.setItem('wwg_first_visit', firstVisit);
            this.track('visitors');
        } else {
            firstVisit = parseInt(firstVisit);
            const diffHours = (now - firstVisit) / (1000 * 60 * 60);

            const checkRetention = (dayNum, key) => {
                const storageKey = `wwg_retention_d${dayNum}`;
                const minH = dayNum * 24;
                const maxH = (dayNum + 1) * 24;
                if (diffHours >= minH && diffHours < maxH && !localStorage.getItem(storageKey)) {
                    this.track(key);
                    localStorage.setItem(storageKey, 'true');
                }
            };

            checkRetention(1, 'retention_d1');
            checkRetention(3, 'retention_d3');
            checkRetention(7, 'retention_d7');
        }
    }
};

// Global Exposure & Auto-Run
window.Telemetry = Telemetry;
window.WWG_BEACON = (key) => Telemetry.track(key); // Legacy support for WWG_BEACON
Telemetry.init();
