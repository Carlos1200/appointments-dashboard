'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function register(formData: FormData, locale: string = 'es') {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        // Automatically injects into `auth.users`, but we need it in `public.profiles`.
        // A common pattern is inserting the profile directly here, or letting a DB trigger do it.
        // Since we don't have a trigger configured in the script, we will insert it manually.
        data: {
            full_name: fullName
        }
    }
  });

  if (error) {
    return { error: error.message }
  }

  // If signUp is successful and auto-confirms or sends email:
  if (data.user) {
     // Manually insert into profiles
     const { error: profileError } = await supabase.from('profiles').insert({
         id: data.user.id,
         full_name: fullName,
         role_id: null // Admin has to assign the role
     });
     
     if (profileError) {
         console.error("Failed to map user to public profile:", profileError);
     }
  }

  revalidatePath('/', 'layout')
  redirect(`/${locale}/appointments`)
}
