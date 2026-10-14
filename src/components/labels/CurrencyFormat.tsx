import { forwardRef, Ref, useMemo } from 'react';
import type { ReactNode } from 'react';

import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box';
import numeral from 'numeral';

import { Currency } from '../..';
import useSettings from '../crud-mui-provider/hooks/useSettings';
import { DEFAULT_CURRENCY } from '../misc/getCurrencySymbolProps';

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
  {
    decimalDigit = 2,
    currency,
    prefix = '',
    suffix = '',
    value,
    format,
    sx,
    ...rest
  }: CurrencyFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
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

  const text = useMemo(() => {
    if (format) {
      return numeral(value).format(format);
    }

    const formattedValue = formatter.format(Number(value ?? 0) || 0);
    return formattedValue;
  }, [format, formatter, value]);

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
