import createTheme, { ThemeOptions } from '@mui/material/styles/createTheme';
import responsiveFontSizes from '@mui/material/styles/responsiveFontSizes';
import merge from 'lodash.merge';

import componentsOverride from './components';
import shadows from './shadows';
import { THEMES } from './theme.constants';
import themesOptions from './themeOptions';

const baseOptions = {
  direction: 'ltr',
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
};

// ==============================================================
export type ThemeSettings = {
  theme: string;
  direction: 'ltr' | 'rtl';
  responsiveFontSizes?: boolean;
  themeOptions?: ThemeOptions;
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

  const mergedThemeOptions = merge(
    {},
    baseOptions,
    themeOptions,
    {
      direction: settings.direction,
    },
    settings.themeOptions,
  );

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
