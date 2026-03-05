import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DashboardClient } from '@/components/DashboardClient';

export default async function DashboardHome({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const greeting = locale === 'es' ? 'Buenos días, Admin' : 'Good morning, Admin';
  const description = locale === 'es' ? 'Aquí tienes el resumen de tu clínica hoy.' : 'Here is your clinic overview for today.';

  return (
    <DashboardClient greeting={greeting} description={description} />
  );
}
