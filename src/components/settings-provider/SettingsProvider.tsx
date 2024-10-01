import { PropsWithChildren } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import merge from 'lodash.merge';

import '../dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import ThemeProvider from '../theme/provider/ThemeProvider';
import getDefaultSettings, { type Settings } from './settings';
import SettingsContext from './SettingsContext';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface SettingsProviderProps extends Partial<Settings> {}

//https://tkdodo.eu/blog/react-query-fa-qs#2-the-queryclient-is-not-stable
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, gcTime: 0 } },
});

/**
 * All Providers needed for @arkas/ui components.This is client component obviously
 * @description Respectively Antd ConfigProvider => Emotion themeProvider => App =>
 */
function SettingsProvider({ children, ...rest }: PropsWithChildren<SettingsProviderProps>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const contextValue = merge(getDefaultSettings(), rest) as Settings;

  const { theme, responsiveFontSizes, direction } = contextValue;

  return (
    <SettingsContext.Provider value={contextValue}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider
          theme={theme}
          responsiveFontSizes={responsiveFontSizes}
          direction={direction}
        >
          <QueryClientProvider client={queryClient}>
            <HotkeysProvider>{children}</HotkeysProvider>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
              position="bottom"
            />
          </QueryClientProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;
