// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Verify ARN Logic
const verifyBtn = document.getElementById('verifyBtn');
const copyBtn = document.getElementById('copyBtn');

if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText('257145').then(() => {
            const icon = copyBtn.querySelector('i');
            icon.classList.remove('fa-copy');
            icon.classList.add('fa-check');
            setTimeout(() => {
                icon.classList.remove('fa-check');
                icon.classList.add('fa-copy');
            }, 2000);
            alert("ARN Copied: 257145");
        });
    });
}

if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
        // Redirect to AMFI website
        window.open('https://www.amfiindia.com/locate-distributor', '_blank');
    });
}

// Contact Form Logic (Supabase)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        const formStatus = document.getElementById('formStatus');

        // Check if config variables are set
        if (typeof SUPABASE_URL === 'undefined' || SUPABASE_URL.includes('YOUR_SUPABASE') || typeof SUPABASE_ANON_KEY === 'undefined' || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
            formStatus.innerHTML = '<span style="color: red;">Error: Database configuration missing. Please update config.js.</span>';
            return;
        }

        // Initialize Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
            created_at: new Date().toISOString()
        };

        // Disable button
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
        formStatus.innerHTML = '';

        try {
            const { data, error } = await supabase
                .from('contacts') // Ensure this table exists in your Supabase project
                .insert([formData]);

            if (error) throw error;

            formStatus.innerHTML = '<span style="color: var(--primary-color);">Message sent successfully! I will contact you soon.</span>';
            contactForm.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.innerHTML = `<span style="color: red;">Failed to send message: ${error.message}</span>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });
}
