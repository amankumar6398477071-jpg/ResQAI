/* ============================================================
   app.js
   Shared application state and small utility helpers used by
   both sos.js and incident.js. Keep this file framework-free.
   ============================================================ */

// A single shared namespace so the other files don't need globals scattered around.
const CitizenSOS = {
    // In-memory "database" for this demo. Nothing is sent to a server.
    state: {
        sosCount: 0,
        incidents: [] // populated by incident.js with mock data on load
    },

    /** Generate a short, readable reference id like "SOS-4821" or "INC-1032". */
    generateId(prefix) {
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}-${random}`;
    },

    /** Format a Date as a friendly local time string, e.g. "14:05:32". */
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    },

    /** Format a Date as "Aug 19, 14:05" for compact display in cards. */
    formatTimestamp(date) {
        const datePart = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${datePart}, ${timePart}`;
    },

    /** Turn a status string into the CSS modifier class used for status chips. */
    statusToClass(status) {
        return status.toLowerCase().replace(/\s+/g, '-');
    }
};

/* ============ Live clock in the top bar ============ */
function startLiveClock() {
    const clockEl = document.getElementById('liveClock');
    if (!clockEl) return;

    function tick() {
        clockEl.textContent = CitizenSOS.formatTime(new Date());
    }

    tick();
    setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', startLiveClock);