import { Currency, DEFAULT_CURRENCY, DEFAULT_DECIMAL_DIGIT } from './getCurrencySymbolProps';

type MoneyFormatOptions = {
  currency?: Currency;
  decimalDigit?: number;
};

const moneyFormat = (
  value: string | number,
  { currency = DEFAULT_CURRENCY, decimalDigit = DEFAULT_DECIMAL_DIGIT }: MoneyFormatOptions = {},
  lang?: string,
) => {
  const formatter = new Intl.NumberFormat(lang ?? 'tr', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: decimalDigit,
    maximumFractionDigits: decimalDigit,
  });

  const formattedValue = formatter.format(Number(value ?? 0) || 0);
  return formattedValue;
};

export default moneyFormat;
