import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dein-projekt.supabase.co'
const supabaseAnonKey = 'dein-öffentlicher-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
