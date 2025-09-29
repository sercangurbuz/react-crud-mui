import React, { useMemo } from 'react';

import LocalPhone from '@mui/icons-material/LocalPhone';
import Box, { BoxProps } from '@mui/material/Box';
import { parsePhoneNumberWithError } from 'libphonenumber-js';

import { FlexBox } from '../flexbox';

interface PhoneLabelProps extends BoxProps {
  value?: string;
  showIcon?: boolean;
  /**
   * Whether to show undefined message or not
   */
  showUndefinedMessage?: boolean;
  /**
   * Message to show when date is undefined
   */
  unDefinedMessage?: string;
}

function PhoneFormat({
  value: phoneNumber,
  showIcon = true,
  showUndefinedMessage = false,
  unDefinedMessage = '-',
  ...rest
}: PhoneLabelProps) {
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
    return showUndefinedMessage ? unDefinedMessage : null;
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
