import React, { useMemo } from 'react';

import { LocalPhone } from '@mui/icons-material';
import { Box, BoxProps } from '@mui/material';

import { FlexBox } from '../flexbox';

interface PhoneLabelProps extends BoxProps {
  value?: string;
  showIcon?: boolean;
}

export const formatPhoneNumber = (phoneNumber: string) => {
  const a = phoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  if (!a) {
    return phoneNumber;
  }

  const result = !a[2]
    ? a[1]
    : '(' + a[1] + ') ' + a[2] + (a[3] ? '-' + a[3] : '') + (a[4] ? '-' + a[4] : '');
  return result;
};

function PhoneFormat({ value: phoneNumber, showIcon = true, ...rest }: PhoneLabelProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const formattedPhoneNumber = useMemo(
    () => (phoneNumber ? formatPhoneNumber(phoneNumber) : ''),
    [phoneNumber],
  );

  if (!formattedPhoneNumber) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <Box {...rest} onClick={handleClick}>
      <FlexBox gap={0.5} alignItems="center">
        {showIcon && <LocalPhone sx={{ fontSize: '1.2em', color: 'text.secondary' }} />}
        <a style={{ color: 'inherit' }} href={`tel:${phoneNumber}`}>
          {formattedPhoneNumber}
        </a>
      </FlexBox>
    </Box>
  );
}

export default PhoneFormat;
