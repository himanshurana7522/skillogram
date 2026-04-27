import { createClient } from '@supabase/supabase-js';

// Deep sanitize to remove ANY junk characters, spaces, or quotes
const sanitizeValue = (val: string | undefined) => {
  if (!val) return '';
  return val.replace(/['"]+/g, '').trim().replace(/\/$/, '');
};

let rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Fix double https:// if pasted by accident
if (rawUrl.startsWith('https://https://')) {
  rawUrl = rawUrl.replace('https://https://', 'https://');
}

const supabaseUrl = sanitizeValue(rawUrl);
const supabaseAnonKey = sanitizeValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

console.log("[CONFIG] Project Signal Status:", supabaseUrl ? 'ACTIVE' : 'DISCONNECTED');
if (supabaseUrl) {
  console.log(`[CONFIG] URL: ${supabaseUrl.substring(0, 15)}...`);
}
if (supabaseAnonKey) {
  console.log(`[CONFIG] Key Prefix: ${supabaseAnonKey.substring(0, 10)}... (Length: ${supabaseAnonKey.length})`);
}

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'placeholder') {
  console.warn("⚠️ Signal lost. Check Vercel project environment variables or .env.local.");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
