import { PropsWithChildren, useMemo, useState } from 'react';
import { HotkeysProvider } from 'react-hotkeys-hook';

import '../dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import ValidationOptionsProvider from '../form/components/ValidationOptionsProvider';
import ThemeProvider from '../theme/provider/ThemeProvider';
import getDefaultSettings, { type Settings } from './settings';
import SettingsContext from './SettingsContext';

import 'simplebar-react/dist/simplebar.min.css';

import { enableMapSet } from 'immer';

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

  const [settings, setSettings] = useState<Settings>(() => ({
    ...getDefaultSettings(),
    ...rest,
  }));

  const contextValue = useMemo(
    () => ({
      ...settings,
      setSettings: (newSettings: Partial<Settings>) =>
        setSettings((currentSettings) => ({
          ...currentSettings,
          ...newSettings,
        })),
    }),
    [settings],
  );

  const { theme, themeOptions, responsiveFontSizes, direction, lang } = settings;
  return (
    <SettingsContext.Provider value={contextValue}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={lang}>
        <ThemeProvider
          theme={theme}
          themeOptions={themeOptions}
          responsiveFontSizes={responsiveFontSizes}
          direction={direction}
          lang={lang}
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
