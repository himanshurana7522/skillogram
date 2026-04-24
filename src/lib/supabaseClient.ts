import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("[CONFIG] Testing Supabase Keys...");
if (!supabaseUrl) console.error("❌ NEXT_PUBLIC_SUPABASE_URL is missing!");
if (!supabaseAnonKey) console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing!");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Using placeholder keys. App will not function until keys are added to Vercel.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
