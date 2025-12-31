const SUPABASE_URL = window.ENV?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || SUPABASE_URL.includes('REPLACE_WITH_YOUR_URL')) {
    document.body.innerHTML = `
        <div class="min-h-screen bg-black text-red-600 flex items-center justify-center p-10 text-center font-black uppercase tracking-tighter">
            <div>
                <h1 class="text-9xl mb-10">ERROR</h1>
                <p class="text-4xl mb-6">YOU FORGOT THE SUPABASE KEYS, YOU ABSOLUTE MORON.</p>
                <p class="text-xl text-gray-600">Go read the README before I delete your browser.</p>
            </div>
        </div>
    `;
    throw new Error("Missing Supabase configuration. Read the README, idiot.");
}

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
