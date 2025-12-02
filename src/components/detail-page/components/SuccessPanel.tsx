import React from 'react';

import { Box } from '@mui/material';

import { FlexBox } from '../../flexbox';
import OvalCheckedIcon from '../../icons/OvalCheckedIcon';
import Page from '../../page/Page';
import { H6, Small } from '../../typography';

export interface SuccessPanelProps {
  title: string;
  helperText?: string;
  commands?: React.ReactNode;
  icon?: React.ReactNode;
}

function SuccessPanel({ icon, title, helperText, commands }: SuccessPanelProps) {
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
        <Box>{commands}</Box>
      </FlexBox>
    </Page.Content>
  );
}

export default SuccessPanel;
