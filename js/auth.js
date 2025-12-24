import { supabase } from './supabase.js';

// Check if user is authenticated, redirect to login if not
export async function checkAuthentication() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        window.location.href = '/login.html';
        return null;
    }
    
    return session;
}

// Handle logout
export async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
}

// Initialize login page
if (window.location.pathname.includes('login.html')) {
    const loginForm = document.getElementById('loginForm');
    const statusMessage = document.getElementById('statusMessage');
    
    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = '/dashboard.html';
    }
    
    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin + '/dashboard.html'
                }
            });
            
            if (error) throw error;
            
            // Show success message
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 rounded-lg text-sm bg-green-900/30 border border-green-700 text-green-300';
            statusMessage.querySelector('div').textContent = 'Check your email for the magic link!';
            
            // Clear form
            loginForm.reset();
        } catch (error) {
            // Show error message
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 rounded-lg text-sm bg-red-900/30 border border-red-700 text-red-300';
            statusMessage.querySelector('div').textContent = error.message;
        }
    });
}

// Initialize dashboard logout button
if (window.location.pathname.includes('dashboard.html')) {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}
