import { forwardRef, Ref, useMemo } from 'react';

import { Box } from '@mui/material';
import { BoxProps } from '@mui/system/Box';
import numeral from 'numeral';

import useSettings from '../crud-mui-provider/hooks/useSettings';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface NumberFormatProps extends BoxProps {
  value?: number | string;
  suffix?: string;
  prefix?: string;
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
    const formattedValue = [prefix, num, suffix].filter(Boolean).join('');
    return formattedValue;
  }, [prefix, suffix, numFormat, value, format]);

  return (
    <Box title={text} {...rest} ref={ref}>
      {text}
    </Box>
  );
}

export default forwardRef(NumberFormat);
