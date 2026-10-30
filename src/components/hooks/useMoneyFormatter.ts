import { useMemo } from 'react';

import useSettings from '../crud-mui-provider/hooks/useSettings';
import { Currency, DEFAULT_CURRENCY } from '../misc/getCurrencySymbolProps';

interface UseMoneyFormatterOptions {
  decimalDigit?: number;
  currency?: Currency;
}

function useMoneyFormatter({ currency, decimalDigit = 2 }: UseMoneyFormatterOptions) {
  const { defaultCurrency, lang } = useSettings();

  const selectedCurrency = currency ?? defaultCurrency ?? DEFAULT_CURRENCY;

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(lang ?? 'tr', {
        style: 'currency',
        currency: selectedCurrency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: decimalDigit,
        maximumFractionDigits: decimalDigit,
      }),
    [decimalDigit, lang, selectedCurrency],
  );

  return formatter;
}

export default useMoneyFormatter;
