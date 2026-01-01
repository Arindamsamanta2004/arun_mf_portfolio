// Check if Supabase is available
if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
    console.error('Supabase config missing. Make sure config.js is loaded.');
} else {
    // Initialize Supabase
    const supabaseAuth = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // ADMIN LOGIN FORM HANDLER
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const statusDiv = document.getElementById('adminAuthStatus');

            statusDiv.innerHTML = 'Verifying credentials...';
            statusDiv.className = 'auth-status';

            try {
                // 1. Sign In
                const { data: { user }, error: signInError } = await supabaseAuth.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (signInError) throw signInError;

                // 2. Check Role in Profiles Table
                const { data: profile, error: profileError } = await supabaseAuth
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    throw new Error('Could not verify access level.');
                }

                if (profile && profile.role === 'admin') {
                    statusDiv.innerHTML = 'Access Granted. Redirecting...';
                    statusDiv.classList.add('success');
                    setTimeout(() => {
                        window.location.href = 'admin.html';
                    }, 1000);
                } else {
                    // Not an admin - sign out immediately
                    await supabaseAuth.auth.signOut();
                    throw new Error('Access Denied: You do not have administrator privileges.');
                }

            } catch (error) {
                statusDiv.innerHTML = `Error: ${error.message}`;
                statusDiv.classList.add('error');
            }
        });
    }

    // LOGIN FORM HANDLER (User)
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
                // 1. Sign In
                const { data: { user }, error } = await supabaseAuth.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                // 2. Check Role to decide where to go
                const { data: profile } = await supabaseAuth
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                statusDiv.innerHTML = 'Success! Redirecting...';
                statusDiv.classList.add('success');

                setTimeout(() => {
                    if (profile && profile.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'appointment.html';
                    }
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

                statusDiv.innerHTML = 'Account created! Please log in.';
                statusDiv.classList.add('success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

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
            window.location.href = 'index.html'; // Redirect to home
        });
    }
}
