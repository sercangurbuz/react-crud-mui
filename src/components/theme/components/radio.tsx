import { Components } from '@mui/material/styles/components';

// CUSTOM ICON COMPONENTS
import RadioButtonChecked from '../../icons/RadioButtonChecked';
import RadioButtonIcon from '../../icons/RadioButtonIcon';

// ==============================================================
declare module '@mui/material/Radio' {
  interface RadioPropsSizeOverrides {
    large: true;
  }
}
// ==============================================================

const Radio = (): Components['MuiRadio'] => ({
  defaultProps: {
    icon: <RadioButtonIcon />,
    checkedIcon: <RadioButtonChecked />,
  },
  styleOverrides: {
    root: { padding: 6 },
  },
  variants: [
    {
      props: { size: 'large' },
      style: { '.MuiSvgIcon-root': { fontSize: '1.75rem' } },
    },
  ],
});

export default Radio;
