import React from 'react';

import { Select } from 'antd';

const isValidSelectOption = (node: React.ReactNode) => {
  return (
    React.isValidElement(node) && (node.type === Select.Option || node.type === Select.OptGroup)
  );
};

export default isValidSelectOption;
