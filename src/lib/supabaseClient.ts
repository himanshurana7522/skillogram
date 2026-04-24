import { createClient } from '@supabase/supabase-js';

// Safe trim to remove invisible spaces or quotes from Vercel
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

console.log("[CONFIG] Verifying Connection Frequency...");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Missing keys in Vercel. Please check your Project Settings.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
