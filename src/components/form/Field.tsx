import React, { ReactNode, useMemo } from 'react';
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Mode,
  Path,
  PathValue,
  useController,
  UseControllerProps,
  useFormContext,
} from 'react-hook-form';

import isNil from '../misc/isNil';
import usePage from '../page/hooks/usePage';
import FieldGroupProvider from './components/FieldGroupProvider';
import FieldWatch from './components/FieldWatch';
import FieldWithProvider from './components/FieldWithProvider';
import FormButton from './components/FormButton';
import FormControl, { FormControlProps } from './components/FormControl';
import FormCheckbox from './controls/FormCheckbox';
import FormComboBox from './controls/FormComboBox';
import FormDatePicker from './controls/FormDatePicker';
import FormInput from './controls/FormInput';
import FormMaskedInput from './controls/FormMaskedInput';
import FormMoneyInput from './controls/FormMoneyInput';
import FormNumberInput from './controls/FormNumberInput';
import FormPanelSelect from './controls/FormPanelSelect';
import FormPhoneInput from './controls/FormPhoneInput';
import FormRadioGroup from './controls/FormRadioGroup';
import FormSearchInput from './controls/FormSearchInput';
import FormSelect from './controls/FormSelect';
import FormSwitch from './controls/FormSwitch';
import { useFormStatesContext } from './hooks';
import useFieldWithContext from './hooks/useFieldWithContext';
import useRegisterField from './hooks/useRegisterField';
import useValidationOptionsContext from './hooks/useValidationOptionsContext';

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
  validationMode?: Mode;
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
  validationMode = 'onChange',
  shouldUnregister,
  formControlProps,
}: FieldProps<TFieldValues>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { fields, callOutVisibility } = useValidationOptionsContext();
  const { setValue, trigger } = useFormContext<TFieldValues>();
  const { getName } = useFieldWithContext();
  const { setTouched } = useFormStatesContext();

  const fieldName = useMemo(() => {
    return getName(name) as Path<TFieldValues>;
  }, [getName, name]);

  /* ------------------------- RHF controller register ------------------------ */

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { disabled, ...field },
    fieldState,
  } = useController({
    name: fieldName,
    control,
    defaultValue,
    shouldUnregister,
    rules,
  });

  // register extra field data like group and label
  useRegisterField({ name: fieldName });

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
    (callOutVisibility === 'selected-fields' && fields?.includes(fieldName));

  /* -------------------------------------------------------------------------- */
  /*                               Control Render                               */
  /* -------------------------------------------------------------------------- */

  const renderControl = children ?? render;

  if (!renderControl) {
    throw new Error(`missing render function in field ${fieldName}`);
  }

  const fieldStates =
    isEnabledFieldCallout && !disabledProp?.disabled
      ? fieldState
      : { ...fieldState, error: undefined };
  const fieldProps =
    validationMode === 'onBlur'
      ? {
          ...field,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setValue(fieldName, e.target.value as PathValue<TFieldValues, Path<TFieldValues>>);
            setTouched(true);
          },
          onBlur: () => {
            field.onBlur();
            void trigger();
          },
        }
      : {
          ...field,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            field.onChange(e);
            setTouched(true);
          },
        };
  const controlNode = renderControl?.({ ...fieldProps, ...disabledProp }, fieldStates);

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  return formControlProps?.label ? (
    <FormControl {...formControlProps} {...fieldStates} {...disabledProp}>
      {controlNode}
    </FormControl>
  ) : (
    controlNode
  );
}

export default Field;

Field.Input = FormInput;
Field.MaskedInput = FormMaskedInput;
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
Field.PanelSelect = FormPanelSelect;

Field.Button = FormButton;
Field.Watch = FieldWatch;
Field.Group = FieldGroupProvider;
Field.With = FieldWithProvider;
