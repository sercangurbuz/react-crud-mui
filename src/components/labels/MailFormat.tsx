import Email from '@mui/icons-material/Email';
import Box, { BoxProps } from '@mui/material/Box';

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
        {showIcon ? <Email sx={{ fontSize: '1.2em', color: 'currentColor' }} /> : null}
        <a style={{ color: 'inherit' }} href={`mailto:${email}`}>
          {email}
        </a>
      </FlexBox>
    </Box>
  );
}

export default MailFormat;
