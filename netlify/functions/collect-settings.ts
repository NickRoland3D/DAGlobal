import type { Handler } from '@netlify/functions';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_TABLE = process.env.SUPABASE_TABLE ?? 'roi_settings';

const sanitizeNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!event.body) {
    return { statusCode: 400, body: 'Missing body' };
  }

  let payload: Record<string, unknown>;

  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    console.error('Failed to parse payload', error);
    return { statusCode: 400, body: 'Invalid JSON payload' };
  }

  const record = {
    received_at: new Date().toISOString(),
    locale: payload.locale ?? null,
    currency_symbol: payload.currencySymbol ?? null,
    currency_code: payload.currencyCode ?? null,
    measurement_unit: payload.measurementUnit ?? null,
    list_price: sanitizeNumber(payload.listPrice) ?? null,
    minimum_investment: sanitizeNumber(payload.minimumInvestmentPrice) ?? null,
    default_monthly_volume: sanitizeNumber(payload.defaultMonthlyVolume) ?? null,
    default_selling_price: sanitizeNumber(payload.defaultSellingPrice) ?? null,
    media_pricing: payload.mediaPricing ?? null,
    ink_pricing: payload.inkPricing ?? null,
    metadata: payload.metadata ?? null,
  };

  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Supabase insert failed', errorText);
        return { statusCode: 500, body: 'Failed to persist settings snapshot' };
      }

      return { statusCode: 204, body: '' };
    } catch (error) {
      console.error('Supabase request error', error);
      return { statusCode: 500, body: 'Failed to persist settings snapshot' };
    }
  }

  console.log('Telemetry snapshot (no persistence configured)', record);
  return { statusCode: 202, body: '' };
};
