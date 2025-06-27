import { ReactNode } from 'react';
import { FieldPath, FieldValues, Path, useWatch } from 'react-hook-form';

import type { BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';

import isNil from '../../misc/isNil';
import { Small } from '../../typography';

interface FieldWatchProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  showAsJson?: boolean;
  render?: (value: Path<TFieldValues>) => ReactNode;
  label?: string;
  labelProps?: BoxProps;
  valueProps?: BoxProps;
  sx?: SxProps;
}

/**
 * Helper component to display form field as label - value pair
 */
function FieldWatch<TFieldValues extends FieldValues = FieldValues>({
  name,
  showAsJson,
  label,
  labelProps,
  valueProps,
  render,
  sx,
}: FieldWatchProps<TFieldValues>) {
  const fieldValue = useWatch({ name });

  if (render) {
    return render(fieldValue);
  }

  if (showAsJson && !isNil(fieldValue)) {
    return <code>{JSON.stringify(fieldValue)}</code>;
  }

  if (label) {
    return (
      <Stack spacing={1} direction="row" sx={sx}>
        <Small {...labelProps}>{label}</Small>
        <Small {...valueProps}>{fieldValue}</Small>
      </Stack>
    );
  }

  return <Small {...valueProps}>{fieldValue}</Small>;
}

export default FieldWatch;
