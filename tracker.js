const BEACON_NAMESPACE = 'wwg_gallery_pikav_uuid';
const BEACON_API = `https://api.counterapi.dev/v1/${BEACON_NAMESPACE}`;

(function initBeaconTracker() {
    // ── Owner exclusion: if this device is marked as the owner, skip all tracking ──
    if (localStorage.getItem('wwg_is_owner') === 'true') return;

    // ── Unique visitor (once per browser) ────────────────────────────────────────
    if (!localStorage.getItem('wwg_beacon_visited')) {
        fetch(`${BEACON_API}/visitors/up`, { method: 'GET', mode: 'cors' }).catch(() => {});
        localStorage.setItem('wwg_beacon_visited', 'true');
    }

    // ── Click tracking ───────────────────────────────────────────────────────────
    document.addEventListener('click', (e) => {
        fetch(`${BEACON_API}/clicks/up`, { method: 'GET', mode: 'cors' }).catch(() => {});

        if (e.target.closest('.card')) {
            fetch(`${BEACON_API}/click_card/up`, { method: 'GET', mode: 'cors' }).catch(() => {});
        } else if (e.target.closest('#wwg-title')) {
            fetch(`${BEACON_API}/click_title/up`, { method: 'GET', mode: 'cors' }).catch(() => {});
        } else if (e.target.closest('.filter-pill')) {
            fetch(`${BEACON_API}/click_filter/up`, { method: 'GET', mode: 'cors' }).catch(() => {});
        } else if (e.target.closest('.wwg-nav')) {
            fetch(`${BEACON_API}/click_nav/up`, { method: 'GET', mode: 'cors' }).catch(() => {});
        }
    });
})();
