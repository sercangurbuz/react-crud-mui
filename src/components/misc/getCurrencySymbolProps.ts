export type Currency = 'USD' | 'EUR' | 'GBP' | 'TRY';

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

export const CurrencySymbols: Record<Currency, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  TRY: '₺',
};

export const DEFAULT_DECIMAL_DIGIT = 2;
export const DEFAULT_CURRENCY: Currency = 'TRY';

export function getCurrencySymbolProps(currency: Currency) {
  const currSymbol = CurrencySymbols[currency];

  return {
    prefix: currSymbol,
  };
}
