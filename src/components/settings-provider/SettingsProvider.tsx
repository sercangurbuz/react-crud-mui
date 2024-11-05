import { PropsWithChildren } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

import i18n from '../i18n';

enableMapSet();

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type SettingsProviderProps = Partial<Settings>;

//https://tkdodo.eu/blog/react-query-fa-qs#2-the-queryclient-is-not-stable
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, gcTime: 0 } },
});

/**
 * All Providers needed for @arkas/ui components.This is client component obviously
 * @description Respectively Antd ConfigProvider => Emotion themeProvider => App =>
 */
function SettingsProvider({
  children,
  validationOptions,
  ...rest
}: PropsWithChildren<SettingsProviderProps>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const contextValue = merge(getDefaultSettings(), rest) as Settings;
  const { theme, responsiveFontSizes, direction } = contextValue;

  return (
    <SettingsContext.Provider value={contextValue}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
        <ThemeProvider
          theme={theme}
          responsiveFontSizes={responsiveFontSizes}
          direction={direction}
        >
          <QueryClientProvider client={queryClient}>
            <HotkeysProvider>
              <ValidationOptionsProvider {...validationOptions}>
                {children}
              </ValidationOptionsProvider>
            </HotkeysProvider>
            {/* <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
              position="bottom"
            /> */}
          </QueryClientProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
