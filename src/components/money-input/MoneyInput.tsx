import { forwardRef } from 'react';

import { DEFAULT_DECIMAL_DIGIT } from '../misc/currencyFormat';
import { Currency, DEFAULT_CURRENCY, getCurrencySymbolProps } from '../misc/getCurrencySymbolProps';
import NumberInput, { NumberInputProps } from '../number-input/NumberInput';

/* ---------------------------------- Types --------------------------------- */

export type MoneyInputProps = NumberInputProps & { currency?: Currency };

/* -------------------------- MoneyInput Component -------------------------- */

function MoneyInput({ getRef, currency = DEFAULT_CURRENCY, ...rest }: MoneyInputProps) {
  return (
    <NumberInput
      decimalScale={DEFAULT_DECIMAL_DIGIT}
      {...getCurrencySymbolProps(currency)}
      {...rest}
      ref={getRef}
    />
  );
}

const MoneyInputWrapper = forwardRef<typeof MoneyInput, MoneyInputProps>((props, ref) => (
  <MoneyInput {...props} getRef={ref} />
)) as typeof MoneyInput;

export default MoneyInputWrapper;
