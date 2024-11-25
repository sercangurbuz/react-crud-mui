import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';

import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';

import { createCustomTheme, ThemeSettings } from '..';

function ThemeProvider({
  theme,
  themeOptions,
  direction,
  responsiveFontSizes,
  children,
}: PropsWithChildren<ThemeSettings>) {
  const customTheme = createCustomTheme({ theme, themeOptions, direction, responsiveFontSizes });

  const toasterOptions = {
    style: {
      fontWeight: 500,
      fontFamily: customTheme.typography.fontFamily,
      background: customTheme.palette.background.paper,
      color: customTheme.palette.text.primary,
    },
  };

  return (
    <MuiThemeProvider theme={customTheme}>
      <Toaster toastOptions={toasterOptions} position="bottom-right" />
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;
