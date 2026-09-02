import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dzbxeicrhxcqkavijapa.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YnhlaWNyaHhjcWthdmlqYXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNzg2MjAsImV4cCI6MjEwMzk1NDYyMH0.A6-YhxxEPbqlnPuRPqUh3dJddtVcAvAx0QOFl6TaGC8';

// Safe storage adapter that wraps every AsyncStorage call in try/catch.
// In the Expo Go / web preview environment the JS object is non-null but the
// underlying native bridge is a stub that throws on every actual read/write.
// Wrapping each method means the Supabase auth layer (including the
// autoRefreshToken tick) degrades gracefully to an in-memory session instead
// of crashing in a loop.
const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.log('[Supabase] AsyncStorage.getItem unavailable (native module null), using in-memory session');
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // Silently ignore — session will not persist across restarts in this env
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // Silently ignore
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
