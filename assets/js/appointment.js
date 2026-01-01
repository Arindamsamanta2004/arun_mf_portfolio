document.addEventListener('DOMContentLoaded', async () => {
    // Check if Supabase is available
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
        console.error('Supabase config missing.');
        return;
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 1. Check Session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // 2. Load Appointments
    await loadAppointments(supabase, session.user.id);

    // 3. Handle Form Submission
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const date = document.getElementById('date').value;
            const time = document.getElementById('time').value;
            const reason = document.getElementById('reason').value;
            const statusDiv = document.getElementById('formStatus');

            statusDiv.innerHTML = 'Booking...';
            statusDiv.className = 'auth-status';

            try {
                const { data, error } = await supabase
                    .from('appointments')
                    .insert([{
                        user_id: session.user.id,
                        appointment_date: date,
                        appointment_time: time,
                        reason: reason
                    }]);

                if (error) throw error;

                statusDiv.innerHTML = 'Appointment booked successfully!';
                statusDiv.classList.add('success');
                form.reset();

                // Reload list
                await loadAppointments(supabase, session.user.id);

            } catch (error) {
                console.error(error);
                statusDiv.innerHTML = `Error: ${error.message}`;
                statusDiv.classList.add('error');
            }
        });
    }
});

async function loadAppointments(supabase, userId) {
    const loading = document.getElementById('loading');
    const tableWrapper = document.getElementById('appointmentsTableWrapper');
    const tbody = document.getElementById('appointmentsTableBody');

    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', userId)
            .order('appointment_date', { ascending: true });

        if (error) throw error;

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No upcoming appointments.</td></tr>';
        } else {
            tbody.innerHTML = data.map(appt => `
                <tr>
                    <td>${new Date(appt.appointment_date).toLocaleDateString()}</td>
                    <td>${appt.appointment_time}</td>
                    <td>${appt.reason}</td>
                    <td><span class="status-badge ${appt.status}">${appt.status}</span></td>
                </tr>
            `).join('');
        }

        loading.style.display = 'none';
        tableWrapper.style.display = 'block';

    } catch (error) {
        console.error('Error loading appointments:', error);
        loading.innerHTML = 'Failed to load appointments.';
        loading.style.color = 'red';
    }
}
