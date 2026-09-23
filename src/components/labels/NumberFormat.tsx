import { forwardRef, ReactNode, Ref, useMemo } from 'react';

import Box, { BoxProps } from '@mui/material/Box';
import numeral from 'numeral';

import useSettings from '../crud-mui-provider/hooks/useSettings';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface NumberFormatProps extends Omit<BoxProps, 'prefix' | 'suffix'> {
  value?: number | string;
  suffix?: ReactNode;
  prefix?: ReactNode;
  format?: string;
  decimalDigit?: number;
}

/* -------------------------------------------------------------------------- */
/*                          CurrencyFormat Component                          */
/* -------------------------------------------------------------------------- */

function NumberFormat(
  { value, suffix, prefix, decimalDigit = 0, format, ...rest }: NumberFormatProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: Ref<any>,
) {
  const { thousandSeparator, decimalSeparator } = useSettings();

  const numFormat = useMemo(() => {
    const decimalPart = Array.from({ length: decimalDigit }).reduce<string>((m) => (m += '0'), '');
    const numFormat = `0${thousandSeparator}0${decimalSeparator}${decimalPart}`;
    return numFormat;
  }, [decimalDigit, decimalSeparator, thousandSeparator]);

  const text = useMemo(() => {
    const num = numeral(value).format(format ?? numFormat);
    return num;
  }, [numFormat, value, format]);

  return (
    <Box title={text} {...rest} ref={ref}>
      {prefix}
      {text}
      {suffix}
    </Box>
  );
}

export default forwardRef(NumberFormat);
