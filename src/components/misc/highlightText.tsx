import React from 'react';

import getIndicesOf from './getIndicesOf';

/**
 * Convert option text to get highlighted
 * @param itemText Option text
 */
const highlight = ({
  text: itemText,
  keyword,
}: {
  keyword?: string;
  text?: string;
}): React.ReactNode => {
  if (!keyword || !itemText) {
    return itemText;
  }

  const occuranceIndx = getIndicesOf(keyword, itemText);

  const result = [];
  let currentPosition = 0;
  const keywordLen = keyword.length;

  occuranceIndx.forEach((ind, index) => {
    const stringPart = itemText.slice(currentPosition, ind);
    const markedPart = itemText.substr(ind, keywordLen);

    result.push(stringPart, <mark key={String(index)}>{markedPart}</mark>);
    currentPosition = ind + keywordLen;
  });

  const restPart = itemText.slice(currentPosition);
  result.push(restPart);

  return result;
};

export default highlight;
