/**
 * WWG Page Transition Engine
 * Handles smooth fade-to-void transitions between gallery levels.
 */
(function() {
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'wwg-page-transition';
    overlay.style.cssText = `
        position: fixed; inset: 0; background: #000;
        z-index: 100000; pointer-events: none;
        opacity: 1; transition: opacity 0.5s ease;
    `;
    document.documentElement.appendChild(overlay);

    // Fade in on load
    window.addEventListener('load', () => {
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 100);
    });

    // Intercept clicks on links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link || !link.href) return;
        
        // Don't intercept external links or same-page hashes
        const isInternal = link.href.includes(window.location.origin) || link.href.startsWith('/') || !link.href.includes('://');
        const isSamePage = link.href.includes('#') && link.href.split('#')[0] === window.location.href.split('#')[0];
        const isNewTab = link.target === '_blank';

        if (isInternal && !isSamePage && !isNewTab) {
            e.preventDefault();
            overlay.style.opacity = '1';
            setTimeout(() => {
                window.location.href = link.href;
            }, 400);
        }
    });

    // Handle browser back/forward
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            overlay.style.opacity = '0';
        }
    });
})();
