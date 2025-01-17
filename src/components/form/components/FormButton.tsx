import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';

import Button, { ButtonProps } from '@mui/material/Button';

export type FormButtonProps<TFieldValues extends FieldValues = FieldValues> = {
  onClick: (
    formMethods: UseFormReturn<TFieldValues>,
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => void;
} & Omit<ButtonProps, 'onClick'>;

/**
 * Helper component to display form field as label - value pair
 */
function FormButton<TFieldValues extends FieldValues = FieldValues>({
  onClick,
  ...buttonProps
}: FormButtonProps<TFieldValues>) {
  const formMethods = useFormContext<TFieldValues>();
  return <Button {...buttonProps} onClick={(e) => onClick(formMethods, e)} />;
}

export default FormButton;
