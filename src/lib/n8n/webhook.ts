import { supabase } from '@/lib/supabase/client';

export type WebhookEvent = 'appointment.created' | 'appointment.updated' | 'appointment.cancelled';

/**
 * Dispatches an event to the configured n8n Webhook URL.
 * Fails silently if no URL is configured or if the request errors out,
 * ensuring the main application flow is not interrupted.
 */
export async function dispatchWebhook(event: WebhookEvent, payload: any) {
  try {
    // 1. Fetch the URL from Settings
    const { data: settings, error } = await supabase
      .from('settings')
      .select('n8n_webhook_url')
      .eq('id', 1)
      .single();

    if (error || !settings?.n8n_webhook_url) {
      console.log(`[Webhook] Skipped ${event}: No valid Webhook URL configured.`);
      return;
    }

    const targetUrl = settings.n8n_webhook_url;

    // 2. Dispatch the POST request
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // We wrap the payload inside an event envelope
      body: JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload
      }),
    });

    if (!response.ok) {
        console.warn(`[Webhook] n8n returned non-ok status: ${response.status}`);
    } else {
        console.log(`[Webhook] Successfully dispatched ${event}`);
    }

  } catch (err) {
    // We catch and log so that it doesn't crash the UI Promise chain
    console.error(`[Webhook] Failed to dispatch ${event}:`, err);
  }
}
