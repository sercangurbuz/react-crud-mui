 
import React, { PropsWithChildren } from 'react';

import { act, render, RenderOptions } from '@testing-library/react';

import Provider from '../components/crud-mui-provider/CrudMuiProvider';

const AllTheProviders = ({ children }: PropsWithChildren) => {
  return <Provider>{children}</Provider>;
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

const renderWithAct = async (ui: React.ReactElement, options?: RenderOptions) =>
  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => customRender(ui, options));

export * from '@testing-library/react';
export { customRender as render, renderWithAct };
