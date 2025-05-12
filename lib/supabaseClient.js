
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdonhvhemfaegsdrptit.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsIn...'; // gekürzt zur Sicherheit

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
