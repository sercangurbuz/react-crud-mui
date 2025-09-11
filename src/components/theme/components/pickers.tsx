import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
// MUI ICON COMPONENTS
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Components } from '@mui/material/styles/components';

// ==============================================================
// DATE PICKER
// ==============================================================
export const DatePicker = (): Components['MuiDatePicker'] => ({
  defaultProps: {
    slots: {
      openPickerIcon: CalendarMonthOutlined,
      switchViewIcon: (props) => <KeyboardArrowDown {...props} fontSize="small" />,
      leftArrowIcon: (props) => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: (props) => <KeyboardArrowRight {...props} fontSize="small" />,
    },

    slotProps: {
      field: {
        sx: {
          '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': { ml: 0 },
          '& .MuiInputBase-input.Mui-disabled': {
            color: (theme) => theme.palette.grey[500],
            WebkitTextFillColor: (theme) => theme.palette.grey[500],
          },
        },
      },
    },
  },
});

export const DesktopDatePicker = (): Components['MuiDesktopDatePicker'] => ({
  defaultProps: {
    slots: DatePicker()?.defaultProps?.slots,
    slotProps: {
      desktopPaper: { sx: { borderRadius: 2, boxShadow: 4 } },
    },
  },
});

export const MobileDatePicker = (): Components['MuiMobileDatePicker'] => ({
  defaultProps: DatePicker()?.defaultProps,
});

export const StaticDatePicker = (): Components['MuiStaticDatePicker'] => ({
  defaultProps: DatePicker()?.defaultProps,
});

// ==============================================================
// TIME PICKER
// ==============================================================
export const TimePicker = (): Components['MuiTimePicker'] => ({
  defaultProps: {
    slots: {
      leftArrowIcon: (props) => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: (props) => <KeyboardArrowRight {...props} fontSize="small" />,
    },

    slotProps: {
      mobilePaper: {
        sx: {
          padding: 2,
          boxShadow: 4,
          borderRadius: 2,
          '.MuiPickersArrowSwitcher-spacer': { width: 10 },
          '.MuiClock-pmButton .MuiTypography-caption': { fontWeight: 600 },
          '.MuiClock-amButton .MuiTypography-caption': { fontWeight: 600 },
        },
      },
    },
  },
});

export const DesktopTimePicker = (): Components['MuiDesktopTimePicker'] => ({
  defaultProps: TimePicker()?.defaultProps,
});

// ==============================================================
// DATE TIME PICKER
// ==============================================================
export const DateTimePicker = (): Components['MuiDateTimePicker'] => ({
  defaultProps: {
    slotProps: {
      desktopPaper: {
        sx: { borderRadius: 2, boxShadow: 4 },
      },
    },
    slots: {
      openPickerIcon: CalendarMonthOutlined,
      switchViewIcon: (props) => <KeyboardArrowDown {...props} fontSize="small" />,
      leftArrowIcon: (props) => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: (props) => <KeyboardArrowRight {...props} fontSize="small" />,
    },
  },
});

export const DesktopDateTimePicker = (): Components['MuiDesktopDateTimePicker'] => ({
  defaultProps: {
    slotProps: {
      desktopPaper: {
        sx: { borderRadius: 2, boxShadow: 4 },
      },
    },
    slots: {
      openPickerIcon: CalendarMonthOutlined,
      switchViewIcon: (props) => <KeyboardArrowDown {...props} fontSize="small" />,
      leftArrowIcon: (props) => <KeyboardArrowLeft {...props} fontSize="small" />,
      rightArrowIcon: (props) => <KeyboardArrowRight {...props} fontSize="small" />,
    },
  },
});
