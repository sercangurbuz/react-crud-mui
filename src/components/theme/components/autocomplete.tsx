// MUI ICON COMPONENT
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Components } from '@mui/material/styles/components';

const Autocomplete = (): Components['MuiAutocomplete'] => {
  return {
    defaultProps: {
      popupIcon: <ExpandMore />,
      slotProps: {
        paper: {
          sx: {
            marginTop: 1,
            borderRadius: 2,
          },
        },
      },
    },
    styleOverrides: {
      option: {
        padding: 10,
        fontSize: 14,
        borderRadius: 8,
        marginInline: 10,
      },
      tag: { maxWidth: 130 },
      inputRoot: {
        paddingTop: '9px !important',
        paddingBottom: '9px !important',
      },
    },
  };
};

export default Autocomplete;
