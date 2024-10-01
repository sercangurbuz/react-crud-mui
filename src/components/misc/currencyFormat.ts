import isNil from './isNil';

const DEFAULT_THOUSAND_SEP = ',';
const DEFAULT_DECIMAL_SEP = '.';
export const DEFAULT_DECIMAL_DIGIT = 2;

//https://blog.abelotech.com/posts/number-currency-formatting-javascript/
function currencyFormat(
  value?: number | string,
  thousandSeperator: string = DEFAULT_THOUSAND_SEP,
  decimalSeperator: string = DEFAULT_DECIMAL_SEP,
  currency: string = '',
  decimalDigit: number = DEFAULT_DECIMAL_DIGIT,
) {
  if (isNil(value) || value === '') {
    return '';
  }

  let valueNum: number = 0;
  if (typeof value === 'string') {
    valueNum = parseFloat(value);
  } else {
    valueNum = value;
  }

  return `${valueNum
    .toFixed(decimalDigit)
    .replace('.', decimalSeperator)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandSeperator}`)} ${currency}`;
}

export default currencyFormat;
