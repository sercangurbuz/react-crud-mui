import { ReactNode } from 'react';

import { ErrorOutline } from '@mui/icons-material';

import { FlexBox } from '../../flexbox';

interface FieldErrorProps {
  message?: ReactNode;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <FlexBox gap={0.5} alignItems="center">
      <ErrorOutline sx={{ color: 'inherit', width: 14 }} /> {message}
    </FlexBox>
  );
}

export default FieldError;
