import { supabase } from './supabase.js';

export async function checkAuthentication() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        // Allow access to timer and settings without login
        const publicPages = ['timer.html', 'settings.html'];
        const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));
        
        if (isPublicPage) {
            return null;
        }
        window.location.href = '/login.html';
        return null;
    }
    
    return session;
}

export async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
}

if (window.location.pathname.includes('login.html')) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const statusMessage = document.getElementById('statusMessage');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = '/dashboard.html';
    }
    
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
            
            window.location.href = '/dashboard.html';
        } catch (error) {
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 border-2 border-red-600 bg-red-900/20 text-red-500 font-black uppercase tracking-tighter';
            statusMessage.querySelector('div').textContent = `ACCESS DENIED: ${error.message.toUpperCase()}. TRY NOT BEING AN IDIOT.`;
        }
    });
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        
        if (password.length < 6) {
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 border-2 border-red-600 bg-red-900/20 text-red-500 font-black uppercase tracking-tighter';
            statusMessage.querySelector('div').textContent = 'PASSWORD TOO WEAK, JUST LIKE YOUR WILLPOWER. 6 CHARS MINIMUM.';
            return;
        }
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            
            if (error) throw error;
            
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 border-2 border-white bg-gray-800 text-white font-black uppercase tracking-tighter';
            statusMessage.querySelector('div').textContent = 'ACCOUNT CREATED. PREPARE FOR ETERNAL JUDGMENT.';
            
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
        } catch (error) {
            statusMessage.classList.remove('hidden');
            statusMessage.querySelector('div').className = 'p-4 border-2 border-red-600 bg-red-900/20 text-red-500 font-black uppercase tracking-tighter';
            statusMessage.querySelector('div').textContent = `SIGNUP FAILED: ${error.message.toUpperCase()}. EVEN THE DATABASE HATES YOU.`;
        }
    });
}

if (window.location.pathname.includes('dashboard.html')) {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}
