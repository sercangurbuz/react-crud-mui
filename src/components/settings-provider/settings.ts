import { RawAxiosRequestHeaders } from 'axios';

import { ThemeSettings } from '../theme';
import { THEMES } from '../theme/theme.constants';

export type MatchedParams = { [index: string]: string };
export interface CommonHotKeys {
  save: string;
  saveAndNewItem: string;
  nextStep: string;
  prevStep: string;
  search: string;
  clear: string;
  applyFilter_1: string;
  applyFilter_2: string;
  applyFilter_3: string;
  saveClose: string;
  delete: string;
  newItem: string;
  showExtraFilter: string;
  saveFilter: string;
  showFilterPanel: string;
  showColSettingsPanel: string;
  closeModal: string;
  close: string;
  tabchangeNext: string;
  tabchangePrev: string;
}

export type Settings = {
  requestCommonHeaders?: RawAxiosRequestHeaders;
  responsePropName?: string;
  enableDevTool?: boolean;
  enableFloatingLabel?: boolean;
  appTitle?: string;
  uniqueIdParamName: string;
  segmentParamName: string;
  keyFieldName: string;
  hotkeys: CommonHotKeys;
  pageSize: number;
  storedFilterLimit: number;
  removeFalsyFilterValues: boolean;
  rowKey: string;
  pageSizes: number[] | ((count: number) => number[]);
  newItemParamValue: string;
  spinnerDelay: number;
  debounceTime: number;
  dateFormat: string;
  dateLongFormat?: string;
  dateTimeFormat?: string;
  dateTimeLongFormat?: string;
  convertToLocaleDateTime?: boolean;
  monthFormat?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  disableValidationTooltip?: boolean;
} & ThemeSettings;

export default (): Settings => ({
  theme: THEMES.LIGHT,
  direction: 'ltr',
  responsiveFontSizes: true,
  enableFloatingLabel: false,
  enableDevTool: true,
  removeFalsyFilterValues: false,
  appTitle: 'Arkas React Starter',
  dateFormat: 'DD.MM.YYYY',
  dateLongFormat: 'dddd, DD MMMM YYYY',
  dateTimeFormat: 'DD.MM.YYYY HH:mm',
  dateTimeLongFormat: 'dddd, DD MMMM YYYY, h:mm:ss a',
  monthFormat: 'MM.YYYY',
  convertToLocaleDateTime: true,
  newItemParamValue: 'new',
  thousandSeparator: ',',
  decimalSeparator: '.',
  spinnerDelay: 1800,
  hotkeys: {
    save: 'ctrl+enter, ctrl+s',
    saveAndNewItem: 'ctrl+shift+i',
    nextStep: 'ctrl+enter',
    prevStep: 'ctrl+shift+enter',
    search: 'ctrl+enter, ctrl+s',
    clear: 'ctrl+shift+c, ctrl+backspace',
    applyFilter_1: 'ctrl+1',
    applyFilter_2: 'ctrl+2',
    applyFilter_3: 'ctrl+3',
    saveClose: 'ctrl+shift+enter, ctrl+shift+s',
    delete: 'ctrl+del, ctrl+d',
    newItem: 'ctrl+i',
    showExtraFilter: 'ctrl+m',
    saveFilter: 'ctrl+shift+s',
    showFilterPanel: 'ctrl+shift+f',
    showColSettingsPanel: 'ctrl+o',
    close: 'shift+backspace',
    closeModal: 'esc',
    tabchangeNext: 'shift+pageup',
    tabchangePrev: 'shift+pagedown',
  },
  uniqueIdParamName: 'id',
  segmentParamName: 's',
  keyFieldName: 'id',
  pageSize: 25,
  storedFilterLimit: 5,
  debounceTime: 400,
  rowKey: 'id',
  pageSizes: [25, 50, 75, 150],
});
