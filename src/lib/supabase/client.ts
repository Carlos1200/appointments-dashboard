import { createBrowserClient } from '@supabase/ssr';

// Client-side / Standard singleton client leveraging SSR cookies
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
