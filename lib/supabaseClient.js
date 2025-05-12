import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pdonhvhemfaegsdrptit.supabase.co';
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkb25odmhlbWZhZWdzZHJwdGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMzg0NjksImV4cCI6MjA2MjYxNDQ2OX0.AjEIH_-dWlZOfmwCL56ZvRrAr4HYnhwv0UBWdIUGYrk;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
