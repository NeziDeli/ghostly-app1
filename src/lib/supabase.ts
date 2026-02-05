
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase Environment Variables. Please restart your dev server!");
}

const isDev = process.env.NODE_ENV === 'development';

// Custom lock to prevent AbortNetwork errors in dev (disables locking)
const DebugLock = async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
    // Just run immediately without locking in dev
    return await fn();
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        lock: isDev ? DebugLock : undefined // Use custom lock in dev
    }
});
