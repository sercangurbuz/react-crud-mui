export type Currency = 'USD' | 'EUR' | 'GBP' | 'TL';

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

export const CurrencySymbols: Record<Currency, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  TL: '₺',
};

export const DEFAULT_DECIMAL_DIGIT = 2;
export const DEFAULT_CURRENCY: Currency = 'TL';

export function getCurrencySymbolProps(currency: Currency) {
  let currProps: { suffix?: string; prefix?: string } = {};
  const currSymbol = CurrencySymbols[currency];

  switch (currency) {
    case 'EUR':
    case 'GBP':
    case 'USD':
      currProps = {
        prefix: currSymbol,
      };
      break;
    case 'TL':
      currProps = {
        suffix: ` ${currSymbol}`,
      };
      break;
  }

  return currProps;
}
