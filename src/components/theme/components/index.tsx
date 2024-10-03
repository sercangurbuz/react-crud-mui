import { Components } from '@mui/material/styles/components';
import { Theme } from '@mui/material/styles/createTheme';

import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';

import BlankCheckBoxIcon from '../../icons/BlankCheckBoxIcon';
// CUSTOM ICON COMPONENTS
import CheckBoxIcon from '../../icons/CheckBoxIcon';
import CheckboxIndeterminateIcon from '../../icons/CheckboxIndeterminateIcon';
import { isDark } from '../theme.constants';
import { Accordion, AccordionDetails, AccordionSummery } from './accordion';
import Alert from './alert';
import Autocomplete from './autocomplete';
import { Avatar, AvatarGroup } from './avatar';
import Backdrop from './backdrop';
import Badge from './badge';
import Breadcrumbs from './breadcrumbs';
import { Button, ButtonBase, ButtonGroup, IconButton, LoadingButton } from './button';
import Chip from './chip';
import DataGrid from './dataGrid';
import { Dialog, DialogActions, DialogContent, DialogTitle } from './dialog';
import Fab from './fab';
import { FilledInput, Input, InputLabel, OutlinedInput } from './input';
import { ListItemIcon, ListItemText } from './list';
import { Menu, MenuItem } from './menu';
import { Pagination, PaginationItem, TablePagination } from './pagination';
import {
  DatePicker,
  DateTimePicker,
  DesktopDatePicker,
  DesktopDateTimePicker,
  DesktopTimePicker,
  MobileDatePicker,
  StaticDatePicker,
  TimePicker,
} from './pickers';
import Radio from './radio';
import Rating from './rating';
import Switch from './switch';
import { Tab, TabList, TabPanel, Tabs } from './tabs';

// CUSTOM UTILS METHOD

const componentsOverride = (theme: Theme): Components => {
  const { primary, grey, text } = theme.palette;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          scrollBehavior: 'smooth',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          MozOsxFontSmoothing: 'grayscale',
        },
        body: { width: '100%', height: '100%' },
        a: { color: primary.main, textDecoration: 'none' },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': { margin: 0, WebkitAppearance: 'none' },
            '&::-webkit-inner-spin-button': { margin: 0, WebkitAppearance: 'none' },
          },
        },
        '#root': {
          width: '100%',
          height: '100%',
          '& .apexcharts-xaxistooltip': { display: 'none' },
          '& .apexcharts-tooltip': { border: 'none', borderRadius: 8, boxShadow: theme.shadows[2] },
        },
        '#nprogress .bar': { zIndex: '9999 !important', backgroundColor: primary.main },
        '#nprogress .peg': { boxShadow: 'none' },

        // REUSABLE UTILS CLASSNAME
        '.h-full': { height: '100%' },
        '.p-3': { padding: theme.spacing(3) },
        '.pt-2': { paddingTop: theme.spacing(2) },
        '.pb-0': { paddingBottom: theme.spacing(0) },
        '.pb-4': { paddingBottom: theme.spacing(4) },
        '.py-10': { paddingBlock: theme.spacing(10) },
        '.py-12': { paddingBlock: theme.spacing(12) },
      },
    },
    MuiRadio: Radio(),
    MuiFab: Fab(theme),
    MuiChip: Chip(theme),
    MuiAlert: Alert(theme),
    MuiBadge: Badge(theme),
    MuiSwitch: Switch(theme),
    MuiRating: Rating(theme),
    MuiDataGrid: DataGrid(theme),
    MuiBackdrop: Backdrop(theme),
    MuiBreadcrumbs: Breadcrumbs(theme),
    MuiAutocomplete: Autocomplete(theme),
    // AVATAR
    MuiAvatar: Avatar(theme),
    MuiAvatarGroup: AvatarGroup(theme),
    // BUTTON
    MuiButton: Button(theme),
    MuiIconButton: IconButton(theme),
    MuiButtonBase: ButtonBase(theme),
    MuiButtonGroup: ButtonGroup(theme),
    MuiLoadingButton: LoadingButton(theme),
    // ACCORDION
    MuiAccordion: Accordion(theme),
    MuiAccordionSummary: AccordionSummery(theme),
    MuiAccordionDetails: AccordionDetails(theme),
    // PAGINATION
    MuiPagination: Pagination(),
    MuiPaginationItem: PaginationItem(theme),
    MuiTablePagination: TablePagination(theme),
    // DIALOG
    MuiDialog: Dialog(),
    MuiDialogTitle: DialogTitle(),
    MuiDialogContent: DialogContent(),
    MuiDialogActions: DialogActions(),
    // MENU
    MuiMenu: Menu(),
    MuiMenuItem: MenuItem(),
    // LIST
    MuiListItemText: ListItemText(),
    MuiListItemIcon: ListItemIcon(theme),
    // TAB & TABLIST
    MuiTab: Tab(theme),
    MuiTabs: Tabs(theme),
    MuiTabList: TabList(),
    MuiTabPanel: TabPanel(),
    // DATE PICKER
    MuiDatePicker: DatePicker(),
    MuiMobileDatePicker: MobileDatePicker(),
    MuiStaticDatePicker: StaticDatePicker(),
    MuiDesktopDatePicker: DesktopDatePicker(),
    // TIME PICKER
    MuiTimePicker: TimePicker(),
    MuiDateTimePicker: DateTimePicker(),
    MuiDesktopTimePicker: DesktopTimePicker(),
    MuiDesktopDateTimePicker: DesktopDateTimePicker(),
    // INPUT & LABEL
    MuiInput: Input(theme),
    MuiInputLabel: InputLabel(theme),
    MuiFilledInput: FilledInput(theme),
    MuiOutlinedInput: OutlinedInput(theme),

    MuiStepIcon: {
      styleOverrides: {
        root: { color: grey[400] },
      },
    },

    MuiStepConnector: {
      styleOverrides: {
        line: { borderColor: grey[300] },
      },
    },

    MuiSlider: {
      styleOverrides: {
        valueLabel: { borderRadius: 8 },
        markLabel: { color: grey[500], fontSize: 12, fontWeight: 500 },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: { borderRadius: 12, boxShadow: theme.shadows[2] },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'small' },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: { '& .secondary': { opacity: 0.4 } },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px',
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          border: 'none',
          color: grey[isDark(theme) ? 200 : 500],
        },
      },
      defaultProps: { padding: 'none' },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          flexGrow: 1,
          height: 6,
          borderRadius: 16,
          backgroundColor: isDark(theme) ? grey[700] : grey[200],
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'none',
        },
      },
    },

    MuiCheckbox: {
      defaultProps: {
        icon: <BlankCheckBoxIcon />,
        checkedIcon: <CheckBoxIcon />,
        indeterminateIcon: <CheckboxIndeterminateIcon />,
      },
      styleOverrides: {
        colorSecondary: { '&.Mui-checked': { color: grey[700] } },
      },
    },

    MuiTimelineDot: {
      defaultProps: { variant: 'filled', color: 'grey' },
      styleOverrides: {
        filledGrey: {
          backgroundColor: grey[isDark(theme) ? 100 : 300],
          '& .MuiSvgIcon-root': { color: grey[600] },
        },
      },
    },

    MuiTimelineConnector: {
      styleOverrides: {
        root: {
          backgroundColor: grey[isDark(theme) ? 700 : 100],
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          backgroundColor: isDark(theme) ? grey[700] : text.primary,
        },
        arrow: { color: isDark(theme) ? grey[700] : text.primary },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: grey[800],
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        // make drawer overlap modal overlay
        root: {
          zIndex: 1300,
          '& .MuiDrawer-paper': {
            [theme.breakpoints.down('md')]: {
              height: 'calc(100vh - 30px)',
              top: '15px',
              right: '15px',
              borderRadius: '4px',
            },
            [theme.breakpoints.up('md')]: {
              height: 'calc(100vh - 50px)',
              top: '25px',
              right: '25px',
              borderRadius: '8px',
            },
          },
        },
      },
    },
  };
};

export default componentsOverride;
