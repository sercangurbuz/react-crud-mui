import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';

import { Close } from '@mui/icons-material';
import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { ConfirmProvider } from 'material-ui-confirm';

import { createCustomTheme, ThemeSettings } from '..';
import { H3 } from '../../typography';

function ThemeProvider({
  theme,
  direction,
  responsiveFontSizes,
  children,
}: PropsWithChildren<ThemeSettings>) {
  const customTheme = createCustomTheme({ theme, direction, responsiveFontSizes });

  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: "'Montserrat', sans-serif",
      background: customTheme.palette.background.paper,
      color: customTheme.palette.text.primary,
    },
  };

  return (
    <MuiThemeProvider theme={customTheme}>
      <Toaster toastOptions={toasterOptions} position="bottom-right" />
      <CssBaseline />
      <ConfirmProvider
        defaultOptions={{
          allowClose: false,
          titleProps: {
            component: H3,
            fontWeight: 600,
          },
          contentProps: {
            sx: {
              '& > p': {
                fontWeight: 500,
              },
            },
          },
          confirmationButtonProps: {
            autoFocus: true,
            variant: 'contained',
            size: 'small',
            color: 'primary',
            sx: { py: 1 },
          },
          cancellationButtonProps: {
            variant: 'text',
            size: 'small',
            startIcon: <Close />,
            sx: {
              color: 'text.secondary',
            },
          },
        }}
      >
        {children}
      </ConfirmProvider>
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
