/* eslint-disable react-refresh/only-export-components */
import React, { PropsWithChildren } from 'react';

import { act, render, RenderOptions } from '@testing-library/react';

import Provider from '../components/settings-provider';

const AllTheProviders = ({ children }: PropsWithChildren<any>) => {
  return <Provider>{children}</Provider>;
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const renderWithAct = async (ui: React.ReactElement, options?: RenderOptions) =>
  await act(async () => customRender(ui, options));

export * from '@testing-library/react';
export { customRender as render, renderWithAct };
