import { ColorSemantics } from '../utils';

const kinds: ColorSemantics[] = [
  'success',
  'info',
  'warning',
  'error',
  'primary'
];

/**
 * Utility for picking semantic color in order 'success', 'info', 'warning', 'error', 'primary'
 */
export default (
  kind?: ColorSemantics,
  values: string[] = [],
  defaultColor?: string
) => {
  return (kind && values[kinds.indexOf(kind)]) || defaultColor;
};
