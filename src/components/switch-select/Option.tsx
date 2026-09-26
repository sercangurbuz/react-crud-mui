import React, { type PropsWithChildren } from 'react';

import { styled } from '@mui/material';

interface OptionProps
  extends React.HTMLAttributes<HTMLLIElement>, PropsWithChildren {
  selected: boolean;
}

const StyledItem = styled('li')<{ selected: boolean }>(
  ({ theme, selected }) => ({
    justifyContent: 'space-between !important',
    alignItems: 'center',
    marginInline: '0 !important',
    borderRadius: '0 !important',
    backgroundColor: selected
      ? theme.palette.action.selected
      : theme.palette.background.paper,
    '&:hover': {
      '.cb_toggle_favorite': {
        visibility: 'visible',
      },
    },
  }),
);

function Option({ selected, children, ...props }: OptionProps) {
  return (
    <StyledItem {...props} selected={selected}>
      {children}
    </StyledItem>
  );
}

export default Option;
