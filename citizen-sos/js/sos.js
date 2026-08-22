/* ============================================================
   sos.js
   Handles the Citizen SOS button: opening the emergency form,
   validating + "submitting" it (mock, local only), and showing
   the confirmation state.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const sosButton = document.getElementById('sosButton');
    const sosForm = document.getElementById('sosForm');
    const cancelSos = document.getElementById('cancelSos');
    const sosConfirm = document.getElementById('sosConfirm');
    const sendAnother = document.getElementById('sendAnotherSos');

    const confirmId = document.getElementById('confirmId');
    const confirmType = document.getElementById('confirmType');
    const confirmLocation = document.getElementById('confirmLocation');

    // 1. Tapping the big SOS button reveals the emergency form.
    sosButton.addEventListener('click', () => {
        sosButton.parentElement.hidden = true; // hide the trigger + hint
        sosForm.hidden = false;
        document.getElementById('emergencyType').focus();
    });

    // 2. Cancel returns to the resting SOS button.
    cancelSos.addEventListener('click', () => {
        sosForm.hidden = true;
        sosForm.reset();
        sosButton.parentElement.hidden = false;
    });

    // 3. Submitting the SOS form "sends" the alert (mock) and shows confirmation.
    sosForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const type = document.getElementById('emergencyType').value;
        const location = document.getElementById('sosLocation').value.trim();
        const description = document.getElementById('sosDescription').value.trim();

        if (!type || !location) {
            return; // native required-field validation already covers this, this is a safety net
        }

        const id = CitizenSOS.generateId('SOS');
        CitizenSOS.state.sosCount += 1;

        // Fill in the confirmation panel.
        confirmId.textContent = id;
        confirmType.textContent = type;
        confirmLocation.textContent = location;

        sosForm.hidden = true;
        sosConfirm.hidden = false;

        // Also drop this SOS into the shared incident log so it's trackable,
        // tagged with a high-priority category and "Reported" status.
        if (window.IncidentBoard && typeof window.IncidentBoard.addIncident === 'function') {
            window.IncidentBoard.addIncident({
                title: `SOS: ${type}`,
                category: 'Public Safety',
                location,
                description: description || 'No additional description provided.',
                status: 'Reported',
                isSOS: true
            });
        }

        sosForm.reset();
    });

    // 4. "Send another SOS" resets everything back to the initial button state.
    sendAnother.addEventListener('click', () => {
        sosConfirm.hidden = true;
        sosButton.parentElement.hidden = false;
    });
});