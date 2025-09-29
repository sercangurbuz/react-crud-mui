import Email from '@mui/icons-material/Email';
import Box, { BoxProps } from '@mui/material/Box';

import { FlexBox } from '../flexbox';

interface MailLabelProps extends BoxProps {
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

function MailFormat({
  value: email,
  showIcon = true,
  showUndefinedMessage = false,
  unDefinedMessage = '-',
  ...rest
}: MailLabelProps) {
  if (!email) {
    return showUndefinedMessage ? unDefinedMessage : null;
  }

  return (
    <Box {...rest}>
      <FlexBox gap={0.8} alignItems="center">
        {showIcon ? <Email sx={{ fontSize: '1.2em', color: 'currentColor' }} /> : null}
        <a style={{ color: 'inherit' }} href={`mailto:${email}`}>
          {email}
        </a>
      </FlexBox>
    </Box>
  );
}

export default MailFormat;
