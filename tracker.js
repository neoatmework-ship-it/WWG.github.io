const BEACON_NAMESPACE = 'wwg_gallery_pikav_uuid'; // Unique namespace to avoid collisions

// Base URL for the free API (No authentication needed)
const BEACON_API = `https://api.counterapi.dev/v1/${BEACON_NAMESPACE}`;

// We run this logic wrapped in an IIFE to keep the global scope clean
(function initBeaconTracker() {
    // Determine if this is a fresh unique visitor by checking localStorage
    if (!localStorage.getItem('wwg_beacon_visited')) {
        // Increment unique visitors
        fetch(`${BEACON_API}/visitors/up`, { method: 'GET', mode: 'cors' }).catch(() => { });
        localStorage.setItem('wwg_beacon_visited', 'true');
    }

    // Global click tracking
    document.addEventListener('click', (e) => {
        // Increment total global clicks passively
        fetch(`${BEACON_API}/clicks/up`, { method: 'GET', mode: 'cors' }).catch(() => { });

        // Track specific elements
        if (e.target.closest('.card')) {
            fetch(`${BEACON_API}/click_card/up`, { method: 'GET', mode: 'cors' }).catch(() => { });
        } else if (e.target.closest('#wwg-title')) {
            fetch(`${BEACON_API}/click_title/up`, { method: 'GET', mode: 'cors' }).catch(() => { });
        } else if (e.target.closest('.filter-pill')) {
            fetch(`${BEACON_API}/click_filter/up`, { method: 'GET', mode: 'cors' }).catch(() => { });
        } else if (e.target.closest('.wwg-nav')) {
            fetch(`${BEACON_API}/click_nav/up`, { method: 'GET', mode: 'cors' }).catch(() => { });
        }
    });

    // Notify that a user has opened a page (Active pulse to calculate active users)
    // We just increment an "active_pulses" metric that drops off historically, or we simulate "active" 
    // by reading the total clicks in the last hour... counterapi doesn't do timeseries cleanly.
})();
