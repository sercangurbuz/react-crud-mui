import { forwardRef } from 'react';

import { KeyboardArrowDown } from '@mui/icons-material';
import { Card, type CardProps } from '@mui/material';

import { FlexBox } from '../flexbox';
import { ExpandMore } from '../table/components/ExpandButton';

export interface SwitcherLabelProps extends CardProps {
  open?: boolean;
  cardRef?: React.Ref<HTMLDivElement>;
}

function SwitcherLabel({ cardRef, open, children, ...cardProps }: SwitcherLabelProps) {
  return (
    <Card
      {...cardProps}
      ref={cardRef}
      sx={{
        py: 1.5,
        px: 2,
        pr: 0,
        cursor: 'pointer',
        borderBottomLeftRadius: open ? 0 : undefined,
        borderBottomRightRadius: open ? 0 : undefined,
        minHeight: 60,
        ...cardProps.sx,
      }}
    >
      <FlexBox justifyContent="space-between" alignItems="center" gap={2}>
        {children}
        <ExpandMore expand={!!open} disableRipple>
          <KeyboardArrowDown sx={{ color: 'text.secondary' }} />
        </ExpandMore>
      </FlexBox>
    </Card>
  );
}

export default forwardRef<HTMLDivElement, SwitcherLabelProps>((props, ref) => (
  <SwitcherLabel {...props} cardRef={ref} />
));
