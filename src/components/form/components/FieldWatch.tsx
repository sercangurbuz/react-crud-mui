import { ReactNode } from 'react';
import { FieldPath, FieldValues, Path, useWatch } from 'react-hook-form';

import { BoxProps, Stack } from '@mui/material';

import { Small } from '../../typography';

interface FieldWatchProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  showAsJson?: boolean;
  render?: (value: Path<TFieldValues>) => ReactNode;
  label?: string;
  labelProps?: BoxProps;
  valueProps?: BoxProps;
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
}: FieldWatchProps<TFieldValues>) {
  const fieldValue = useWatch({ name });

  if (render) {
    return render(fieldValue);
  }

  if (showAsJson && fieldValue) {
    return <>{JSON.stringify(fieldValue)}</>;
  }

  if (label) {
    return (
      <Stack spacing={1} direction="row">
        <Small {...labelProps}>{label}</Small>
        <Small {...valueProps}>{fieldValue}</Small>
      </Stack>
    );
  }

  return <Small {...valueProps}>{fieldValue}</Small>;
}

export default FieldWatch;
