import { useEffect } from 'react';

import type { Preview } from '@storybook/react';

import { i18n } from '../src';
import SettingsProvider from '../src/components/settings-provider/SettingsProvider';
import { THEMES } from '../src/components/theme/theme.constants';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: THEMES.DARK,
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'light', title: 'Light', icon: 'circlehollow' },
          { value: 'dark', title: 'Dark', icon: 'circle' },
        ],
      },
    },
    lang: {
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English', right: 'en' },
          { value: 'tr', title: 'Türkçe', right: 'tr' },
        ],
      },
    },
  },
  parameters: {
    docs: {
      source: {
        // any non-empty string here will skip jsx rendering, see:
        // https://github.com/storybookjs/storybook/blob/next/code/renderers/react/src/docs/jsxDecorator.tsx#L165
        code: 'hello world',
      },
    },
    backgrounds: { disable: true },
    // actions: { argTypesRegex: '^noWay.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globals: {
    backgrounds: {
      grid: true,
    },
  },
  decorators: [
    (Story, context) => {
      useEffect(() => {
        context.globals.lang && i18n.changeLanguage(context.globals.lang);
      }, [context.globals.lang]);

      return (
        <SettingsProvider theme={context.globals.theme} removeFalsyFilterValues>
          <Story />
        </SettingsProvider>
      );
    },
  ],
};

export default preview;