import { darkPalette, lightPalette } from './colors';
import { THEMES } from './theme.constants';

const themesOptions = {
  [THEMES.LIGHT]: { palette: lightPalette },
  [THEMES.DARK]: { palette: darkPalette },
};

export default themesOptions;
