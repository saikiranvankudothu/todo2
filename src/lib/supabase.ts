import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kppeznwkdboezrzytryq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcGV6bndrZGJvZXpyenl0cnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MjIxMjYsImV4cCI6MjA0NzM5ODEyNn0.tayaXpVxp7DpzQUhx2xcqLDMPbodY50cj2leNKH2C_4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);