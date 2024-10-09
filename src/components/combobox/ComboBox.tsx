import React, { forwardRef, Ref, useCallback, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import {
  Autocomplete,
  AutocompleteFreeSoloValueMapping,
  AutocompleteOwnerState,
  AutocompleteProps,
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
  Box,
  createFilterOptions,
  FilterOptionsState,
  InputAdornment,
  StandardTextFieldProps,
  TextField,
} from '@mui/material';

import useTranslation from '../i18n/hooks/useTranslation';
import { H6, Tiny } from '../typography';
import useComboboxTemplate, { ComboboxTemplate } from './hooks/useComboboxTemplate';

/* -------------------------------------------------------------------------- */
/*                                  Creatable                                 */
/* -------------------------------------------------------------------------- */
export type CreatableModel = FieldValues & CreatableModelProps;

const addValueField = Symbol('addValueField');
const addDisplayTextField = Symbol('addDisplayTextField');

type CreatableModelProps = {
  [addValueField]?: string;
  [addDisplayTextField]?: string;
};

function isCreatableOption<T extends FieldValues>(option: T): boolean {
  return option && addValueField in option && addDisplayTextField in option;
}

/* --------------------------------- Filter --------------------------------- */

const filter = createFilterOptions();
const DEFAULT_VALUE_FIELD = 'id';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface ComboBoxProps<T extends CreatableModel, Creatable extends boolean = false>
  extends Partial<AutocompleteProps<T, false, true, Creatable>>,
    Pick<StandardTextFieldProps, 'autoFocus' | 'label' | 'error' | 'helperText'> {
  data?: T[];
  valueField?: string;
  direction?: 'row' | 'column';
  optionTemplate: ComboboxTemplate<T>;
  displayTemplate?: ComboboxTemplate<T>;
  descriptionTemplate?: ComboboxTemplate<T>;
  creatable?: Creatable;
  onCreate?: (text: string) => Promise<T>;
  selectRef?: Ref<unknown>;
}

function ComboBox<T extends CreatableModel, Creatable extends boolean>({
  autoFocus,
  creatable,
  data = [],
  descriptionTemplate,
  direction = 'column',
  displayTemplate,
  error,
  getOptionLabel,
  helperText,
  loading,
  onBlur,
  onCreate,
  optionTemplate,
  label,
  renderOption: onRenderOption,
  selectRef,
  valueField = DEFAULT_VALUE_FIELD,
  ...rest
}: ComboBoxProps<T, Creatable>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const [showNewItemTag, setShowNewItemTag] = useState<boolean>();
  const { renderDisplay, renderOption, renderDescription } = useComboboxTemplate({
    optionTemplate,
    displayTemplate,
    descriptionTemplate,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const renderOptionItem = useCallback(
    (
      props: React.HTMLAttributes<HTMLLIElement> & { key: any },
      option: T,
      state: AutocompleteRenderOptionState,
      ownerState: AutocompleteOwnerState<T, false, true, Creatable>,
    ) => {
      // creatable item mi render ediliyor ?
      if (isCreatableOption(option)) {
        return (
          <li {...props}>
            <H6 sx={{ lineHeight: 1.2 }}>{option[addDisplayTextField]}</H6>
          </li>
        );
      }

      // Custom render option ?
      if (onRenderOption) {
        return onRenderOption(props, option, state, ownerState);
      }

      const textNode = renderOption?.(option);
      const descNode = renderDescription?.(option);

      return (
        <Box
          {...props}
          component="li"
          sx={{
            '&.MuiAutocomplete-option': {
              gap: 0.5,
              flexDirection: direction,
              justifyContent: direction === 'column' ? 'flex-start' : 'space-between',
              alignItems: direction === 'column' ? 'flex-start' : 'center',
              py: 1.5,
            },
          }}
        >
          {textNode}
          {descNode ? <Tiny color="text.secondary">{descNode}</Tiny> : null}
        </Box>
      );
    },
    [renderDescription, direction, isCreatableOption, renderOption],
  );

  const renderSelectedText = useCallback(
    (option: T | AutocompleteFreeSoloValueMapping<typeof creatable>): string => {
      if (typeof option === 'string') {
        return option;
      }

      if (isCreatableOption(option)) {
        return option[addValueField] as string;
      }

      if (getOptionLabel) {
        return getOptionLabel(option);
      }

      const renderDisplayText = renderDisplay ?? renderOption;
      const optionText = renderDisplayText(option);
      return optionText as string;
    },
    [renderDisplay, getOptionLabel, isCreatableOption, renderOption],
  );

  const handleFilterOptions = useCallback(
    (options: T[], params: FilterOptionsState<T>) => {
      const filtered = filter(options, params as FilterOptionsState<unknown>);
      const { inputValue } = params;

      //Eger hic bir kayit eşleşmiyorsa ve daha onceden öneri option eklenmemiş ise
      if (creatable) {
        if (inputValue !== '' && !filtered.length) {
          filtered.push({
            [addValueField]: inputValue,
            [addDisplayTextField]: t('combobox.newItem', { inputValue }),
          } as T);

          setShowNewItemTag(true);
        } else {
          setShowNewItemTag(false);
        }
      }

      return filtered as T[];
    },
    [creatable, t],
  );

  const renderInput = (params: AutocompleteRenderInputParams) => {
    let newItemAdornment = {};

    if (showNewItemTag) {
      newItemAdornment = {
        endAdornment: (
          <InputAdornment position="end">
            <Tiny
              sx={{
                color: 'common.white',
                p: '0.2rem 0.6rem',
                borderRadius: 1,
                backgroundColor: 'success.main',
              }}
            >
              {t('combobox.newLabel')}
            </Tiny>
          </InputAdornment>
        ),
      };
    }

    const textfieldNode = (
      <TextField
        label={label}
        {...params}
        fullWidth
        inputRef={selectRef}
        autoFocus={autoFocus}
        error={error}
        helperText={helperText}
        sx={{
          '.MuiInputBase-root': showNewItemTag ? { paddingRight: '10px !important' } : null,
        }}
        slotProps={{
          input: {
            ...params.InputProps,
            ...newItemAdornment,
          },
        }}
      />
    );

    return textfieldNode;
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Autocomplete<T, false, true, typeof creatable>
      disablePortal
      {...rest}
      options={data}
      noOptionsText={t('nodatafound')}
      autoComplete
      loading={loading}
      freeSolo={creatable}
      selectOnFocus={creatable}
      handleHomeEndKeys={creatable}
      clearOnBlur={creatable}
      getOptionLabel={renderSelectedText}
      onBlur={(e) => {
        setShowNewItemTag(false);
        onBlur?.(e);
      }}
      sx={{
        '& .MuiListSubheader-root': {
          color: 'text.secondary',
        },
      }}
      onChange={async (event, item, reason, details) => {
        // Eger creatable item'da Enter'a basarsa,ignore ediyoruz
        if (typeof item === 'string') {
          rest.onChange?.(event, item, reason, details);
          return;
        }

        let result = item;
        if (item && isCreatableOption(item)) {
          if (!onCreate) {
            throw new Error('missing onCreate callback when createable is used');
          }
          result = await onCreate(item[addValueField] as string);
          // hide new item tag
          setShowNewItemTag(false);
        }

        rest.onChange?.(event, result, reason, details);
      }}
      forcePopupIcon
      filterOptions={handleFilterOptions}
      renderOption={renderOptionItem}
      renderInput={renderInput}
    />
  );
}

export default forwardRef<typeof ComboBox, ComboBoxProps<any, false>>((props, ref) => (
  <ComboBox {...props} selectRef={ref} />
)) as typeof ComboBox;