/* ============================================================
   incident.js
   Owns the incident log: seed/mock data, the report form,
   rendering incident cards, status changes, and filtering.
   Exposes window.IncidentBoard so sos.js can push SOS entries
   into the same log.
   ============================================================ */

(function () {
    const STATUSES = ['Reported', 'In Progress', 'Resolved'];
    let activeFilter = 'All';

    // ---- Mock/local seed data, shown on first load ----
    const seedIncidents = [
        {
            id: CitizenSOS.generateId('INC'),
            title: 'Pothole causing traffic slowdown',
            category: 'Infrastructure',
            location: 'Ring Road, near Sector 9 flyover',
            description: 'Large pothole in the fast lane, vehicles swerving to avoid it.',
            status: 'In Progress',
            isSOS: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
        },
        {
            id: CitizenSOS.generateId('INC'),
            title: 'Streetlight outage on Elm Avenue',
            category: 'Utility',
            location: 'Elm Avenue, blocks 4-6',
            description: 'Three consecutive streetlights out since last night.',
            status: 'Reported',
            isSOS: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20)
        },
        {
            id: CitizenSOS.generateId('INC'),
            title: 'Water logging after heavy rain',
            category: 'Environment',
            location: 'Lakeview Colony, Gate 2',
            description: 'Ankle-deep water blocking the pedestrian path.',
            status: 'Resolved',
            isSOS: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
        }
    ];

    CitizenSOS.state.incidents = seedIncidents;

    const listEl = document.getElementById('incidentList');
    const emptyStateEl = document.getElementById('emptyState');
    const form = document.getElementById('incidentForm');
    const filterChips = document.querySelectorAll('.filter-chip');

    /** Add a new incident (used by both the report form and SOS submissions). */
    function addIncident({ title, category, location, description, status, isSOS }) {
        const incident = {
            id: CitizenSOS.generateId(isSOS ? 'SOS' : 'INC'),
            title,
            category,
            location,
            description: description || 'No additional description provided.',
            status: status || 'Reported',
            isSOS: !!isSOS,
            createdAt: new Date()
        };
        CitizenSOS.state.incidents.unshift(incident); // newest first
        renderIncidents();
        return incident;
    }

    /** Build the DOM for a single incident card. */
    function buildCard(incident) {
        const card = document.createElement('article');
        card.className = 'incident-card';
        card.dataset.id = incident.id;

        const idBlock = document.createElement('div');
        idBlock.className = 'incident-card__id';
        idBlock.textContent = incident.id;

        const middle = document.createElement('div');
        const title = document.createElement('p');
        title.className = 'incident-card__title';
        title.textContent = (incident.isSOS ? '🚨 ' : '') + incident.title;

        const meta = document.createElement('p');
        meta.className = 'incident-card__meta';
        meta.textContent = `${incident.category} · ${incident.location} · ${CitizenSOS.formatTimestamp(incident.createdAt)}`;

        const desc = document.createElement('p');
        desc.className = 'incident-card__desc';
        desc.textContent = incident.description;

        middle.appendChild(title);
        middle.appendChild(meta);
        middle.appendChild(desc);

        const right = document.createElement('div');
        right.className = 'incident-card__right';

        const chip = document.createElement('span');
        chip.className = `status-chip status-chip--${CitizenSOS.statusToClass(incident.status)}`;
        chip.textContent = incident.status;

        const select = document.createElement('select');
        select.className = 'status-select';
        select.setAttribute('aria-label', `Update status for ${incident.id}`);
        STATUSES.forEach((status) => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (status === incident.status) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener('change', () => {
            incident.status = select.value;
            chip.textContent = incident.status;
            chip.className = `status-chip status-chip--${CitizenSOS.statusToClass(incident.status)}`;
            // Re-render if the current filter would now hide this card.
            if (activeFilter !== 'All' && activeFilter !== incident.status) {
                renderIncidents();
            }
        });

        right.appendChild(chip);
        right.appendChild(select);

        card.appendChild(idBlock);
        card.appendChild(middle);
        card.appendChild(right);

        return card;
    }

    /** Redraw the incident list based on the active filter. */
    function renderIncidents() {
        const incidents = CitizenSOS.state.incidents.filter(
            (incident) => activeFilter === 'All' || incident.status === activeFilter
        );

        listEl.innerHTML = '';

        if (incidents.length === 0) {
            emptyStateEl.hidden = false;
            return;
        }

        emptyStateEl.hidden = true;
        incidents.forEach((incident) => listEl.appendChild(buildCard(incident)));
    }

    /** Wire up the filter chip buttons. */
    function setupFilters() {
        filterChips.forEach((chip) => {
            chip.addEventListener('click', () => {
                filterChips.forEach((c) => c.classList.remove('is-active'));
                chip.classList.add('is-active');
                activeFilter = chip.dataset.filter;
                renderIncidents();
            });
        });
    }

    /** Wire up the "Report incident" form. */
    function setupForm() {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const title = document.getElementById('incidentTitle').value.trim();
            const category = document.getElementById('incidentCategory').value;
            const location = document.getElementById('incidentLocation').value.trim();
            const description = document.getElementById('incidentDescription').value.trim();

            if (!title || !category || !location) return;

            addIncident({ title, category, location, description, status: 'Reported', isSOS: false });
            form.reset();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupFilters();
        setupForm();
        renderIncidents();
    });

    // Expose a small API so sos.js can add SOS entries into the same log.
    window.IncidentBoard = { addIncident };
})();