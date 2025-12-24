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
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const statusMessage = document.getElementById('statusMessage');
    
    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = '/dashboard.html';
    }
    
    // Tab switching
    loginTab.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginTab.className = 'pb-3 px-2 text-purple-400 border-b-2 border-purple-500 font-semibold';
        signupTab.className = 'pb-3 px-2 text-gray-400 hover:text-white transition';
        statusMessage.classList.add('hidden');
    });
    
    signupTab.addEventListener('click', () => {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        signupTab.className = 'pb-3 px-2 text-purple-400 border-b-2 border-purple-500 font-semibold';
        loginTab.className = 'pb-3 px-2 text-gray-400 hover:text-white transition';
        statusMessage.classList.add('hidden');
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } catch (error) {
            // Show error message
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 rounded-lg text-sm bg-red-900/30 border border-red-700 text-red-300';
            statusMessage.querySelector('div').textContent = error.message;
        }
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (error) throw error;
            
            // Show success message
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 rounded-lg text-sm bg-green-900/30 border border-green-700 text-green-300';
            statusMessage.querySelector('div').textContent = 'Account created! Signing you in...';
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
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
