import { Email } from '@mui/icons-material';
import { Box, BoxProps } from '@mui/material';

import { FlexBox } from '../flexbox';

interface MailLabelProps extends BoxProps {
  value?: string;
  showIcon?: boolean;
}

function MailFormat({ value: email, showIcon = true, ...rest }: MailLabelProps) {
  if (!email) {
    return '';
  }

  return (
    <Box {...rest}>
      <FlexBox gap={0.8} alignItems="center">
        {showIcon ? <Email sx={{ fontSize: '1.2em', color: 'text.disabled' }} /> : null}
        <a style={{ color: 'inherit' }} href={`mailto:${email}`}>
          {email}
        </a>
      </FlexBox>
    </Box>
  );
}

export default MailFormat;
