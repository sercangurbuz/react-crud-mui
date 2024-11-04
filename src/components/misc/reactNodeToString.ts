// https://github.com/sunknudsen/react-node-to-string/blob/master/src/index.ts

import React, { isValidElement } from 'react';

const reactNodeToString = function (reactNode: React.ReactNode): string {
  let string = '';
  if (typeof reactNode === 'string') {
    string = reactNode;
  } else if (typeof reactNode === 'number') {
    string = reactNode.toString();
  } else if (reactNode instanceof Array) {
    reactNode.forEach(function (child) {
      string += reactNodeToString(child as React.ReactNode);
    });
  } else if (isValidElement(reactNode)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    string += reactNodeToString(reactNode.props.children);
  }
  return string;
};

export default reactNodeToString;
