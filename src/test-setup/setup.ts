import '@testing-library/jest-dom';

import { setProjectAnnotations } from '@storybook/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

import globalStorybookConfig from '../../.storybook/preview';

expect.extend(matchers);

setProjectAnnotations(globalStorybookConfig);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

// FAIL LOUDLY on unhandled promise rejections / errors
process.on('unhandledRejection', (reason) => {
  console.log(`FAILED TO HANDLE PROMISE REJECTION`);
  throw reason;
});
