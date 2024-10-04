import React, { useCallback, useState } from 'react';

import {
  Autocomplete,
  AutocompleteFreeSoloValueMapping,
  AutocompleteProps,
  AutocompleteRenderOptionState,
  Box,
  createFilterOptions,
  FilterOptionsState,
  InputAdornment,
  StandardTextFieldProps,
  TextField,
} from '@mui/material';

import useTranslation from '../i18n/hooks/useTranslation';
import useComboboxTemplate from './hooks/useComboboxTemplate';

export interface ComboBoxProps<T extends CreatableModel, Creatable extends boolean = false, WP = {}>
  extends Partial<AutocompleteProps<T, false, true, Creatable>>,
    Pick<StandardTextFieldProps, 'autoFocus'> {
  data?: T[];
  valueField?: string;
  direction?: 'row' | 'column';
  optionTemplate: string;
  displayTemplate?: string;
  descriptionTemplate?: string;
  creatable?: Creatable;
  onCreate?: (text: string) => Promise<T>;
  InputWrapper?: React.ComponentType<WP>;
  inputWrapperProps?: Partial<WP>;
}

const addValueField = Symbol('addValueField');
const addDisplayTextField = Symbol('addDisplayTextField');

type CreatableModelProps = {
  [addValueField]?: string;
  [addDisplayTextField]?: string;
};

export type CreatableModel = Record<string, any> & CreatableModelProps;

const filter = createFilterOptions();

function ComboBox<T extends CreatableModel, Creatable extends boolean>({
  data = [],
  valueField = 'id',
  direction = 'column',
  optionTemplate,
  displayTemplate,
  descriptionTemplate,
  renderOption,
  getOptionLabel,
  loading,
  autoFocus,
  creatable,
  onCreate,
  InputWrapper,
  inputWrapperProps,
  onBlur,
  ...rest
}: ComboBoxProps<T, Creatable>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const [showNewItemTag, setShowNewItemTag] = useState<boolean>();
  const [optionRender, descriptionRender, displayRender] = useComboboxTemplate({
    optionTemplate,
    descriptionTemplate,
    displayTemplate,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const isCreatableOption = useCallback((option: T) => {
    return option && addValueField in option && addDisplayTextField in option;
  }, []);

  const renderOptionItem = useCallback(
    (
      props: React.HTMLAttributes<HTMLLIElement>,
      option: T,
      state: AutocompleteRenderOptionState,
    ) => {
      // creatable item mi render ediliyor ?
      if (isCreatableOption(option)) {
        return (
          <li {...props}>
            <H5 sx={{ lineHeight: 1.2 }}>{option[addDisplayTextField]}</H5>
          </li>
        );
      }

      // Custom render option ?
      if (renderOption) {
        return renderOption(props, option, state);
      }

      const textNode = optionRender?.(option);
      const descNode = descriptionRender?.(option);

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
          {typeof textNode === 'string' ? <H5 sx={{ lineHeight: 1.2 }}>{textNode}</H5> : textNode}
          {typeof descNode === 'string' && descNode ? (
            <Tiny color="text.disabled">{descNode}</Tiny>
          ) : (
            descNode
          )}
        </Box>
      );
    },
    [descriptionRender, direction, isCreatableOption, optionRender, renderOption],
  );

  const renderSelectedText = useCallback(
    (option: T | AutocompleteFreeSoloValueMapping<typeof creatable>) => {
      if (typeof option === 'string') {
        return option;
      }

      if (isCreatableOption(option)) {
        return option[addValueField];
      }

      if (getOptionLabel) {
        return getOptionLabel(option);
      }

      const optionText = (displayRender ?? optionRender)(option);
      return optionText as string;
    },
    [displayRender, getOptionLabel, isCreatableOption, optionRender],
  );

  const handleFilterOptions = useCallback(
    (options: T[], params: FilterOptionsState<T>) => {
      const filtered = filter(options, params);
      const { inputValue } = params;

      //Eger hic bir kayit eşleşmiyorsa ve daha onceden öneri option eklenmemiş ise
      if (creatable) {
        if (inputValue !== '' && !filtered.length) {
          filtered.push({
            [addValueField]: inputValue,
            [addDisplayTextField]: formatMessage(
              { defaultMessage: 'Ekle "{inputValue}"' },
              { inputValue },
            ),
          } as T);

          setShowNewItemTag(true);
        } else {
          setShowNewItemTag(false);
        }
      }

      return filtered as T[];
    },
    [creatable, formatMessage],
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <Autocomplete<T, false, true, typeof creatable>
      {...rest}
      options={data}
      noOptionsText={t('nodatafound')}
      data-testid={name}
      autoComplete
      loading={loading}
      freeSolo={creatable}
      selectOnFocus={creatable}
      handleHomeEndKeys={creatable}
      clearOnBlur={creatable}
      //value={selValue}
      getOptionLabel={renderSelectedText}
      onBlur={() => {
        setShowNewItemTag(false);
        onBlur();
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

        if (item && isCreatableOption(item)) {
          item = await onCreate?.(item[addValueField]);
          // hide new item tag
          setShowNewItemTag(false);
        }

        rest.onChange?.(event, item, reason, details);
        onChange(item ? getRowKey(item) : null);
      }}
      forcePopupIcon
      filterOptions={handleFilterOptions}
      renderOption={renderOptionItem}
      renderInput={(params) => {
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
                  {formatMessage({ defaultMessage: 'YENİ' })}
                </Tiny>
              </InputAdornment>
            ),
          };
        }

        const textfieldNode = (
          <TextField
            placeholder={placeholder ?? formatMessage({ defaultMessage: 'Seçim yapınız' })}
            {...params}
            fullWidth
            inputRef={ref}
            autoFocus={autoFocus}
            error={!!error}
            helperText={error?.message}
            sx={{
              '.MuiInputBase-root': showNewItemTag ? { paddingRight: '10px !important' } : null,
            }}
            InputProps={{
              ...params.InputProps,
              ...newItemAdornment,
            }}
          />
        );

        return InputWrapper ? (
          <InputWrapper {...inputWrapperProps}>{textfieldNode}</InputWrapper>
        ) : (
          textfieldNode
        );
      }}
    />
  );
}

export default ComboBox;
