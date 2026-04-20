import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY?.trim() || '';
const supabaseSchema = process.env.EXPO_PUBLIC_SUPABASE_SCHEMA;
const effectiveSchema = supabaseSchema || 'public';

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey);

if (!hasSupabaseConfig) {
    console.warn(
        'Supabase env vars are missing. Push-token sync is disabled. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY to enable it.'
    );
}

export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey, {
          db: { schema: effectiveSchema },
          auth: {
              storage: AsyncStorage,
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: false,
              lock: processLock,
          },
      })
    : null;

export const isSupabaseConfigured = hasSupabaseConfig;
