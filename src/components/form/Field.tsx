import { ReactNode } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  useController,
  UseControllerProps,
} from 'react-hook-form';

import isNil from '../misc/isNil';
import { useFormDisabled } from './hooks';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ControlCommonProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldProps<TFieldValues>['name'];
  fieldProps?: Omit<FieldProps<TFieldValues>, 'name'>;
};

export interface FieldRender<TFieldValues extends FieldValues> {
  (
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>,
    fieldState: ControllerFieldState,
  ): ReactNode;
}

export type FieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  UseControllerProps<TFieldValues>,
  'disabled'
> & {
  render?: FieldRender<TFieldValues>;
  children?: FieldRender<TFieldValues>;
  disabled?: boolean;
};

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

/**
 * This components integrates react-hook-form
 */
function Field<TFieldValues extends FieldValues = FieldValues>({
  children,
  control,
  defaultValue,
  disabled: fieldDisabled,
  name,
  render,
  rules,
  shouldUnregister,
}: FieldProps<TFieldValues>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  /* ------------------------- RHF controller register ------------------------ */

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { disabled, ...field },
    fieldState,
  } = useController({
    name,
    control,
    defaultValue,
    shouldUnregister,
    rules,
  });

  /* ------------------------------- Is disabled ------------------------------ */

  const { disabled: formDisable } = useFormDisabled();

  const disabledProp = isNil(fieldDisabled)
    ? formDisable === true
      ? { disabled: true }
      : undefined
    : { disabled: fieldDisabled };

  /* -------------------------------------------------------------------------- */
  /*                               Control Render                               */
  /* -------------------------------------------------------------------------- */

  const renderControl = children ?? render;

  if (!renderControl) {
    throw new Error(`missing render function in field ${name}`);
  }

  const controlNode = renderControl?.({ ...field, ...disabledProp }, fieldState);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return controlNode;
}

export default Field;
