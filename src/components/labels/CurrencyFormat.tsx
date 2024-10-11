/* eslint-disable react-refresh/only-export-components */
import { forwardRef, Ref } from 'react';

import { Currency, DEFAULT_CURRENCY, getCurrencySymbolProps } from '../misc/getCurrencySymbolProps';
import NumberFormat, { NumberFormatProps } from './NumberFormat';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface CurrencyFormatProps extends NumberFormatProps {
  currency?: Currency;
}

/* -------------------------------------------------------------------------- */
/*                          CurrencyFormat Component                          */
/* -------------------------------------------------------------------------- */

function CurrencyFormat(
  { decimalDigit = 2, currency = DEFAULT_CURRENCY, ...rest }: CurrencyFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
  return (
    <NumberFormat
      decimalDigit={decimalDigit}
      ref={ref}
      {...getCurrencySymbolProps(currency)}
      {...rest}
    />
  );
}

export default forwardRef(CurrencyFormat);
