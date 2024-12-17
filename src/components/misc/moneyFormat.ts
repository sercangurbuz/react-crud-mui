import numeral from 'numeral';

import {
  Currency,
  DEFAULT_CURRENCY,
  DEFAULT_DECIMAL_DIGIT,
  getCurrencySymbolProps,
} from './getCurrencySymbolProps';

type MoneyFormatOptions = {
  currency: Currency;
  decimalDigit?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
};

const moneyFormat = (
  value: string | number,
  {
    currency = DEFAULT_CURRENCY,
    decimalDigit = DEFAULT_DECIMAL_DIGIT,
    decimalSeparator = '.',
    thousandSeparator = ',',
  }: MoneyFormatOptions,
) => {
  const decimalPart = Array.from({ length: decimalDigit }).reduce<string>((m) => (m += '0'), '');
  const numFormat = `0${thousandSeparator}0${decimalSeparator}${decimalPart}`;

  const { prefix = '', suffix = '' } = getCurrencySymbolProps(currency);

  const num = numeral(value).format(numFormat);
  const formattedValue = [prefix, num, suffix].filter(Boolean).join('');
  return formattedValue;
};

export default moneyFormat;
