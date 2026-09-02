import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dzbxeicrhxcqkavijapa.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6YnhlaWNyaHhjcWthdmlqYXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNzg2MjAsImV4cCI6MjEwMzk1NDYyMH0.A6-YhxxEPbqlnPuRPqUh3dJddtVcAvAx0QOFl6TaGC8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
