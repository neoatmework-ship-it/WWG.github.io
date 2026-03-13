const BEACON_NAMESPACE = 'wwg_telemetry_pikav';
const BEACON_API = `https://api.counterapi.dev/v1/${BEACON_NAMESPACE}`;

(function initBeaconTracker() {
    // ── Owner exclusion: if this device is marked as the owner, skip all tracking ──
    if (localStorage.getItem('wwg_is_owner') === 'true') return;

    const beaconFetch = (key) => {
        const target = `${BEACON_API}/${key}/up`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
        fetch(proxyUrl, { method: 'GET' }).catch(() => {});
    };

    // ── Unique visitor (once per browser) ────────────────────────────────────────
    if (!localStorage.getItem('wwg_beacon_visited')) {
        beaconFetch('visitors');
        localStorage.setItem('wwg_beacon_visited', 'true');
    }

    // ── Click tracking ───────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        beaconFetch('clicks');

        if (e.target.closest('.card')) {
            beaconFetch('click_card');
        } else if (e.target.closest('#wwg-title')) {
            beaconFetch('click_title');
        } else if (e.target.closest('.filter-pill')) {
            beaconFetch('click_filter');
        } else if (e.target.closest('.wwg-nav')) {
            beaconFetch('click_nav');
        }
    });
})();
