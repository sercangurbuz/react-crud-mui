import React from 'react';
import { FieldValues } from 'react-hook-form';

import { Box } from '@mui/material';

import { FlexBox } from '../../flexbox';
import OvalCheckedIcon from '../../icons/OvalCheckedIcon';
import Page from '../../page/Page';
import { H6, Small } from '../../typography';

export interface SuccessPanelProps<T extends FieldValues = FieldValues> {
  title: string;
  helperText?: string;
  onCommands?: (model?: T) => React.ReactNode;
  model?: T;
  icon?: React.ReactNode;
}

function SuccessPanel<T extends FieldValues = FieldValues>({
  icon,
  title,
  helperText,
  onCommands,
  model,
}: SuccessPanelProps<T>) {
  return (
    <Page.Content>
      <FlexBox flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px">
        <Box
          sx={{
            textAlign: 'center',
            flex: 1,
            mt: 3,
          }}
        >
          {icon ?? (
            <OvalCheckedIcon
              sx={{
                fontSize: 100,
                marginBottom: 2,
                color: 'primary.main',
              }}
            />
          )}
          <H6 fontSize={22}>{title}</H6>
          <Small marginTop={1} display="block" marginBottom={5} color="text.secondary">
            {helperText}
          </Small>
        </Box>
        <Box>{onCommands?.(model)}</Box>
      </FlexBox>
    </Page.Content>
  );
}

export default SuccessPanel;
