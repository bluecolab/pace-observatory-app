import AsyncStorage from '@react-native-async-storage/async-storage';

import { isSupabaseConfigured, supabase } from './supabase';

const supabaseTable = process.env.EXPO_PUBLIC_SUPABASE_TABLE || '';
const LAST_SYNCED_EXPO_PUSH_TOKEN_KEY = 'last-synced-expo-push-token';

async function ensureAnonAuthSession() {
    if (!supabase) return;

    const { data } = await supabase.auth.getSession();
    if (data.session) return;

    const { error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
}

export async function sendExpoPushToken(token: string) {
    if (!token) return;
    if (!isSupabaseConfigured || !supabaseTable) return;
    if (!supabase) return;

    const normalizedToken = token.trim();
    if (!normalizedToken) return;

    const lastSyncedToken = await AsyncStorage.getItem(LAST_SYNCED_EXPO_PUSH_TOKEN_KEY);
    if (lastSyncedToken === normalizedToken) {
        return;
    }

    await ensureAnonAuthSession();

    const { error } = await supabase.from(supabaseTable).insert({
        expo_token: normalizedToken,
        level: 'general_alert',
    });

    if (error && (error as any).code !== '23505') {
        throw error;
    }

    await AsyncStorage.setItem(LAST_SYNCED_EXPO_PUSH_TOKEN_KEY, normalizedToken);
}
