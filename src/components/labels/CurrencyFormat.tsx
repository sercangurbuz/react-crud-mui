import { forwardRef, Ref, useMemo } from 'react';
import type { ReactNode } from 'react';

import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';

import { Currency, useMoneyFormatter } from '../..';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface CurrencyFormatProps extends Omit<BoxProps, 'prefix' | 'suffix'> {
  value?: number | string;
  suffix?: ReactNode;
  prefix?: ReactNode;
  format?: string;
  decimalDigit?: number;
  currency?: Currency;
}

/* -------------------------------------------------------------------------- */
/*                          CurrencyFormat Component                          */
/* -------------------------------------------------------------------------- */

function CurrencyFormat(
  { decimalDigit = 2, currency, prefix = '', suffix = '', value, sx, ...rest }: CurrencyFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
  const formatter = useMoneyFormatter({ currency, decimalDigit });

  const text = useMemo(() => {
    const formattedValue = formatter.format(Number(value ?? 0) || 0);
    return formattedValue;
  }, [formatter, value]);

  return (
    <Box
      title={text}
      {...rest}
      ref={ref}
      sx={{
        color: value ? undefined : 'text.secondary',
        ...sx,
      }}
    >
      {prefix}
      {text}
      {suffix}
    </Box>
  );
}

export default forwardRef(CurrencyFormat);
