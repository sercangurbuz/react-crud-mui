import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';

import CssBaseline from '@mui/material/CssBaseline';
import MuiThemeProvider from '@mui/material/styles/ThemeProvider';

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
