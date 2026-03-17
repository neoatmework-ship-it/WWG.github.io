const BEACON_NAMESPACE = 'wwg_telemetry_pikav';
const BEACON_API = `https://api.counterapi.dev/v1/${BEACON_NAMESPACE}`;

(function initBeaconTracker() {
    // ── Owner exclusion: if this device is marked as the owner, skip all tracking ──
    if (localStorage.getItem('wwg_is_owner') === 'true') return;

    const beaconFetch = async (key) => {
        const targetBase = `${BEACON_API}/${key}/up`;
        const proxies = [
            (url) => url, // Direct
            (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
            (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
            (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        ];

        for (let getProxyUrl of proxies) {
            try {
                const cb = Date.now() + Math.random();
                const target = `${targetBase}?cb=${cb}`;
                const res = await fetch(getProxyUrl(target), { method: 'GET' });
                if (res.ok) return;
            } catch (e) {}
        }
    };

    // ── Total Visits (every page load) ──────────────────────────────────────────
    beaconFetch('total_visits');

    // ── Unique visitor (once per browser) ────────────────────────────────────────

    const now = Date.now();
    let firstVisit = localStorage.getItem('wwg_first_visit');
    
    if (!firstVisit) {
        firstVisit = now;
        localStorage.setItem('wwg_first_visit', firstVisit);
        beaconFetch('visitors');
        localStorage.setItem('wwg_beacon_visited', 'true');
    } else {
        firstVisit = parseInt(firstVisit);
    }

    // ── Retention Logic (D1, D3, D7) ──────────────────────────────────────────
    const diffHours = (now - firstVisit) / (1000 * 60 * 60);
    
    const checkRetention = (dayNum, key) => {
        const storageKey = `wwg_retention_d${dayNum}`;
        const minH = dayNum * 24;
        const maxH = (dayNum + 1) * 24;
        
        if (diffHours >= minH && diffHours < maxH && !localStorage.getItem(storageKey)) {
            beaconFetch(key);
            localStorage.setItem(storageKey, 'true');
        }
    };

    checkRetention(1, 'retention_d1');
    checkRetention(3, 'retention_d3');
    checkRetention(7, 'retention_d7');

    // ── Click tracking ───────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        beaconFetch('clicks');

        const card = e.target.closest('.card');
        if (card) {
            beaconFetch('click_card');
            const href = card.getAttribute('href');
            if (href) {
                const siteId = href.replace('.html', '').split('/').pop();
                beaconFetch(`card_${siteId}`);
            }
        } else if (e.target.closest('#wwg-title')) {
            beaconFetch('click_title');
        } else {
            const pill = e.target.closest('.filter-pill');
            if (pill) {
                beaconFetch('click_filter');
                const filter = pill.getAttribute('data-filter') || pill.textContent.trim().toLowerCase();
                beaconFetch(`filter_${filter}`);
            } else if (e.target.closest('.wwg-nav')) {
                beaconFetch('click_nav');
            }
        }
    });
})();
