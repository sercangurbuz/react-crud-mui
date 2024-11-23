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
import FieldGroupProvider from './components/FieldGroupProvider';
import FieldWatch from './components/FieldWatch';
import FormButton from './components/FormButton';
import FormControl, { FormControlProps } from './components/FormControl';
import FormCheckbox from './controls/FormCheckbox';
import FormComboBox from './controls/FormComboBox';
import FormDatePicker from './controls/FormDatePicker';
import FormInput from './controls/FormInput';
import FormMoneyInput from './controls/FormMoneyInput';
import FormNumberInput from './controls/FormNumberInput';
import FormPhoneInput from './controls/FormPhoneInput';
import FormRadioGroup from './controls/FormRadioGroup';
import FormSearchInput from './controls/FormSearchInput';
import FormSelect from './controls/FormSelect';
import FormSwitch from './controls/FormSwitch';
import useRegisterField from './hooks/useRegisterField';
import useValidationOptionsContext from './hooks/useValidationOptionsContext';
import * as schemas from './schema';

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

  // register extra field data like group and label
  useRegisterField({ name });

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

  const fieldStates = isEnabledFieldCallout ? fieldState : { ...fieldState, error: undefined };
  const controlNode = renderControl?.({ ...field, ...disabledProp }, fieldStates);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return formControlProps?.label ? (
    <FormControl {...formControlProps} {...fieldStates}>
      {controlNode}
    </FormControl>
  ) : (
    controlNode
  );
}

export default Field;

Field.Input = FormInput;
Field.Search = FormSearchInput;
Field.NumberInput = FormNumberInput;
Field.MoneyInput = FormMoneyInput;
Field.PhoneInput = FormPhoneInput;
Field.Checkbox = FormCheckbox;
Field.Switch = FormSwitch;
Field.Combobox = FormComboBox;
Field.Select = FormSelect;
Field.RadioGroup = FormRadioGroup;
Field.DatePicker = FormDatePicker;

Field.Button = FormButton;
Field.Watch = FieldWatch;

Field.schemas = schemas;
Field.Group = FieldGroupProvider;
