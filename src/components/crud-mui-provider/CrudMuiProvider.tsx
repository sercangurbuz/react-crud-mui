import { PropsWithChildren } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';

import merge from 'lodash.merge';

import '../dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import ValidationOptionsProvider from '../form/components/ValidationOptionsProvider';
import ThemeProvider from '../theme/provider/ThemeProvider';
import getDefaultSettings, { type Settings } from './settings';
import SettingsContext from './SettingsContext';

import 'simplebar-react/dist/simplebar.min.css';

import { enableMapSet } from 'immer';

import i18nInstance from '../i18n';

enableMapSet();

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type CrudMuiProviderProps = Partial<Settings>;

/**
 * All Providers needed for @arkas/ui components.This is client component obviously
 * @description Respectively Antd ConfigProvider => Emotion themeProvider => App =>
 */
function CrudMuiProvider({
  children,
  validationOptions,
  ...rest
}: PropsWithChildren<CrudMuiProviderProps>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const contextValue = merge(getDefaultSettings(), rest) as Settings;
  const { theme, themeOptions, responsiveFontSizes, direction } = contextValue;

  return (
    <SettingsContext.Provider value={contextValue}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18nInstance.language}>
        <ThemeProvider
          theme={theme}
          themeOptions={themeOptions}
          responsiveFontSizes={responsiveFontSizes}
          direction={direction}
        >
          <HotkeysProvider>
            <ValidationOptionsProvider {...validationOptions}>{children}</ValidationOptionsProvider>
          </HotkeysProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </SettingsContext.Provider>
  );
}

export default CrudMuiProvider;
