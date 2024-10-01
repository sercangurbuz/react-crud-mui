import createTheme, { ThemeOptions } from '@mui/material/styles/createTheme';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import merge from 'lodash.merge';

// MUI COMPONENTS OVERRIDE
import componentsOverride from './components';
// THEME SHADOWS LIST
import shadows from './shadows';
// LIGHT & DARK THEME OPTIONS
import themesOptions from './themeOptions';
// FONT VARIANTS
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import { THEMES } from './theme.constants';

const baseOptions = {
  direction: 'ltr',
  typography: { fontFamily: "'Inter', sans-serif" },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
};

// ==============================================================
export type ThemeSettings = {
  theme: string;
  direction: 'ltr' | 'rtl';
  responsiveFontSizes?: boolean;
};
// ==============================================================

export const createCustomTheme = (settings: ThemeSettings) => {
  /**
   * settings.theme value is 'light' or 'dark'
   * update settings in contexts/settingsContext.tsx
   */
  let themeOptions = themesOptions[settings.theme];

  if (!themeOptions) {
    themeOptions = themesOptions[THEMES.LIGHT];
  }

  const mergedThemeOptions = merge({}, baseOptions, themeOptions, {
    direction: settings.direction,
  });

  let theme = createTheme(mergedThemeOptions as ThemeOptions);

  // OVERRIDE SHADOWS
  theme.shadows = shadows(theme);

  // OVERRIDE COMPONENTS
  theme.components = componentsOverride(theme);

  if (settings.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
