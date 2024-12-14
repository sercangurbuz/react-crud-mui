import React, { useMemo } from 'react';

import { LocalPhone } from '@mui/icons-material';
import { Box, BoxProps } from '@mui/material';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

import { FlexBox } from '../flexbox';

interface PhoneLabelProps extends BoxProps {
  value?: string;
  showIcon?: boolean;
}

function PhoneFormat({ value: phoneNumber, showIcon = true, ...rest }: PhoneLabelProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const formattedPhoneNumber = useMemo(() => {
    if (!phoneNumber) {
      return '';
    }
    const phone = parsePhoneNumberWithError(phoneNumber);
    return phone.formatInternational();
  }, [phoneNumber]);

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
        {showIcon && <LocalPhone sx={{ fontSize: '1.2em', color: 'currentColor' }} />}
        <a style={{ color: 'inherit' }} href={`tel:${phoneNumber}`}>
          {formattedPhoneNumber}
        </a>
      </FlexBox>
    </Box>
  );
}

export default PhoneFormat;
