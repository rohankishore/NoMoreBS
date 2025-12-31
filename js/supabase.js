const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
