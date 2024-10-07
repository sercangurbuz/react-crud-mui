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
import usePage from '../page/hooks/usePage';
import FormControl, { FormControlProps } from './components/FormControl';
import FormCheckbox from './controls/FormCheckbox';
import FormSwitch from './controls/FormSwitch';
import FormTextField from './controls/FormTextField';
import useValidationOptionsContext from './hooks/useValidationOptionsContext';
import FormComboBox from './controls/FormComboBox';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type ControlCommonProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldProps<TFieldValues>['name'];
  fieldProps?: Omit<FieldProps<TFieldValues>, 'name'>;
  formControlProps?: FieldProps<TFieldValues>['formControlProps'];
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
  formControlProps?: FormControlProps;
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
  formControlProps,
}: FieldProps<TFieldValues>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { fields, callOutVisibility } = useValidationOptionsContext();

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

  /* -------------------------------------------------------------------------- */
  /*                                   States                                   */
  /* -------------------------------------------------------------------------- */

  const { disabled: pageDisable } = usePage();

  const disabledProp = isNil(fieldDisabled)
    ? pageDisable === true
      ? { disabled: true }
      : undefined
    : { disabled: fieldDisabled };

  const isEnabledFieldCallout =
    callOutVisibility === 'all' ||
    (callOutVisibility === 'selected-fields' && fields?.includes(name));

  /* -------------------------------------------------------------------------- */
  /*                               Control Render                               */
  /* -------------------------------------------------------------------------- */

  const renderControl = children ?? render;

  if (!renderControl) {
    throw new Error(`missing render function in field ${name}`);
  }

  const controlNode = renderControl?.(
    { ...field, ...disabledProp },
    isEnabledFieldCallout ? fieldState : { ...fieldState, error: undefined },
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return formControlProps ? (
    <FormControl {...formControlProps}>{controlNode}</FormControl>
  ) : (
    controlNode
  );
}

export default Field;

Field.Input = FormTextField;
Field.Checkbox = FormCheckbox;
Field.Switch = FormSwitch;
Field.Combobox = FormComboBox;
