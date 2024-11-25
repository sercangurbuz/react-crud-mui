import * as React from 'react';

import CurrencyFormat from './CurrencyFormat';
import DateFormat from './DateFormat';
import MailFormat from './MailFormat';
import NumberFormat from './NumberFormat';
import PhoneFormat from './PhoneFormat';

const Labels: React.FunctionComponent & {
  DateFormat: typeof DateFormat;
  CurrencyFormat: typeof CurrencyFormat;
  NumberFormat: typeof NumberFormat;
  PhoneFormat: typeof PhoneFormat;
  MailFormat: typeof MailFormat;
} = () => {
  throw new Error('Labels itself is NOT usable,Please use static helpers instead');
};

Labels.DateFormat = DateFormat;
Labels.CurrencyFormat = CurrencyFormat;
Labels.NumberFormat = NumberFormat;
Labels.PhoneFormat = PhoneFormat;
Labels.MailFormat = MailFormat;

export default Labels;
