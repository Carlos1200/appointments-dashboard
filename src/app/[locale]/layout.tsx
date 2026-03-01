import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {DashboardLayout} from '@/components/DashboardLayout';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
 
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body className="antialiased bg-slate-900 text-white">
        <NextIntlClientProvider messages={messages}>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
