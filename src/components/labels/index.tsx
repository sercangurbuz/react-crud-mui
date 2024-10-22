import * as React from 'react';

import CurrencyFormat from './CurrencyFormat';
import DateFormat from './DateFormat';
import NumberFormat from './NumberFormat';

interface LabelsProps {}

const Labels: React.FunctionComponent<LabelsProps> & {
  DateFormat: typeof DateFormat;
  CurrencyFormat: typeof CurrencyFormat;
  NumberFormat: typeof NumberFormat;
} = () => {
  throw new Error('Labels itself is NOT usable,Please use static helpers instead');
};

Labels.DateFormat = DateFormat;
Labels.CurrencyFormat = CurrencyFormat;
Labels.NumberFormat = NumberFormat;

export default Labels;