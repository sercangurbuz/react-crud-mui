import { forwardRef } from 'react';

import NumberInput, { NumberInputProps } from '../number-input/NumberInput';

type Currency = 'USD' | 'EUR' | 'GBP' | 'TL';
const CurrencySymbols: Record<Currency, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  TL: '₺',
};
/* ---------------------------------- Types --------------------------------- */

export type MoneyInputProps = NumberInputProps & { currency?: Currency };

const DEFAULT_DECIMAL_DIGIT = 2;
const DEFAULT_CURRENCY: Currency = 'TL';

/* -------------------------- MoneyInput Component -------------------------- */

function MoneyInput({ getRef, currency = DEFAULT_CURRENCY, ...rest }: MoneyInputProps) {
  let currProps: Pick<NumberInputProps, 'prefix' | 'suffix'> = {};
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

  return <NumberInput decimalScale={DEFAULT_DECIMAL_DIGIT} {...currProps} {...rest} ref={getRef} />;
}

const MoneyInputWrapper = forwardRef<typeof MoneyInput, MoneyInputProps>((props, ref) => (
  <MoneyInput {...props} getRef={ref} />
)) as typeof MoneyInput;

export default MoneyInputWrapper;
