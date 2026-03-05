import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Run the i18n middleware to get the localized response (sets cookies, headers, locale redirects)
  const i18nResponse = handleI18nRouting(request);

  // 2. Validate session and refresh tokens if necessary using our SSR wrapper
  const { supabaseResponse, user } = await updateSession(request, i18nResponse);

  // 3. Routing Protection Logic
  const url = request.nextUrl.clone();
  // Strip the locale for easy checking: "/es/appointments" -> "/appointments"
  const pathname = url.pathname;
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/register');
  const pathWithoutLocale = pathname.replace(/^\/(en|es)/, '') || '/';

  if (!user && !isAuthRoute) {
    // If not logged in and trying to access a protected route (anything other than login)
    // Redirect to the language-aware login page
    const locale = pathname.match(/^\/(en|es)/)?.[1] || 'es';
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    // If logged in and trying to go to login/register, push to dashboard
    const locale = pathname.match(/^\/(en|es)/)?.[1] || 'es';
    url.pathname = `/${locale}/appointments`;
    return NextResponse.redirect(url);
  }

  // 4. If all good, return the composite response
  return supabaseResponse;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en)/:path*']
};
