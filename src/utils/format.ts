import { Settings } from '../types';

export interface FormatCurrencyOptions {
  compact?: boolean;
  includeSymbol?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

const FALLBACK_LOCALE = 'en-US';

export const normalizeCurrencyCode = (raw?: string) => {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return lettersOnly.slice(0, 3);
};

export const getCurrencyCode = (settings: Settings) =>
  normalizeCurrencyCode(settings.currency.code || settings.currency.symbol);

const normalizeLocale = (rawLocale?: string) => {
  if (!rawLocale) return FALLBACK_LOCALE;
  const trimmed = rawLocale.trim();
  if (!trimmed) return FALLBACK_LOCALE;
  // Replace underscores with hyphens to better align with BCP 47, e.g. en_US -> en-US.
  return trimmed.replace(/_/g, '-');
};

const getSafeLocale = (rawLocale?: string) => {
  const candidate = normalizeLocale(rawLocale);
  try {
    new Intl.NumberFormat(candidate);
    return candidate;
  } catch {
    return FALLBACK_LOCALE;
  }
};

const sanitizeFractionDigits = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(6, Math.max(0, Math.floor(value)));
};

const getFractionDigits = (
  settings: Settings,
  options?: Pick<FormatCurrencyOptions, 'minimumFractionDigits' | 'maximumFractionDigits'>
) => {
  const base = settings.currency.useDecimals ? sanitizeFractionDigits(settings.currency.decimalPlaces) : 0;
  const minimumFractionDigits = sanitizeFractionDigits(options?.minimumFractionDigits ?? base);
  const maximumFractionDigits = sanitizeFractionDigits(options?.maximumFractionDigits ?? base);

  return {
    minimumFractionDigits: Math.min(minimumFractionDigits, maximumFractionDigits),
    maximumFractionDigits,
  };
};

const getNumberFormatter = (
  settings: Settings,
  options: Intl.NumberFormatOptions & { compact?: boolean } = {}
) => {
  const locale = getSafeLocale(settings.currency.locale);
  const { compact, ...rest } = options;

  try {
    return new Intl.NumberFormat(locale, {
      notation: compact ? 'compact' : 'standard',
      ...rest,
    });
  } catch {
    return new Intl.NumberFormat(FALLBACK_LOCALE, {
      notation: compact ? 'compact' : 'standard',
      ...rest,
    });
  }
};

export const formatCurrency = (
  value: number,
  settings: Settings,
  options: FormatCurrencyOptions = {}
) => {
  const { compact, includeSymbol = true, minimumFractionDigits, maximumFractionDigits } = options;
  const fractionDigits = getFractionDigits(settings, { minimumFractionDigits, maximumFractionDigits });

  const formatter = getNumberFormatter(settings, {
    ...fractionDigits,
    compact,
  });

  const formattedNumber = formatter.format(value);

  const currencyCode = getCurrencyCode(settings);

  if (!includeSymbol || !currencyCode) {
    return formattedNumber;
  }

  return `${currencyCode} ${formattedNumber}`.trim();
};

export const formatNumber = (
  value: number,
  settings: Settings,
  options: Intl.NumberFormatOptions = {}
) => {
  const formatter = getNumberFormatter(settings, options);
  return formatter.format(value);
};
