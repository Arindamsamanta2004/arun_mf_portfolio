// Check if Supabase is available
if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
    console.error('Supabase config missing. Make sure config.js is loaded.');
} else {
    // Initialize Supabase
    const supabaseAuth = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // LOGIN FORM HANDLER
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const statusDiv = document.getElementById('authStatus');

            statusDiv.innerHTML = 'Logging in...';
            statusDiv.className = 'auth-status'; // reset class

            try {
                const { data, error } = await supabaseAuth.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                statusDiv.innerHTML = 'Success! Redirecting...';
                statusDiv.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);

            } catch (error) {
                statusDiv.innerHTML = `Error: ${error.message}`;
                statusDiv.classList.add('error');
            }
        });
    }

    // REGISTRATION FORM HANDLER
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const statusDiv = document.getElementById('authStatus');

            if (password !== confirmPassword) {
                statusDiv.innerHTML = 'Passwords do not match.';
                statusDiv.classList.add('error');
                return;
            }

            statusDiv.innerHTML = 'Creating account...';
            statusDiv.className = 'auth-status';

            try {
                const { data, error } = await supabaseAuth.auth.signUp({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                statusDiv.innerHTML = 'Account created! Please check your email to confirm, then log in.';
                statusDiv.classList.add('success');

            } catch (error) {
                statusDiv.innerHTML = `Error: ${error.message}`;
                statusDiv.classList.add('error');
            }
        });
    }

    // LOGOUT HANDLER
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabaseAuth.auth.signOut();
            window.location.href = 'login.html';
        });
    }
}
