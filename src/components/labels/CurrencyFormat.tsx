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
  {
    decimalDigit = 2,
    currency = DEFAULT_CURRENCY,
    prefix = '',
    suffix = '',
    ...rest
  }: CurrencyFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
  const { prefix: currPrefix = '', suffix: currSuffix = '' } = getCurrencySymbolProps(currency);

  return (
    <NumberFormat
      decimalDigit={decimalDigit}
      ref={ref}
      prefix={`${prefix} ${currPrefix}`}
      suffix={`${currSuffix} ${suffix}`}
      {...rest}
    />
  );
}

export default forwardRef(CurrencyFormat);
