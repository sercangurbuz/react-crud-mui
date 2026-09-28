import React, { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Paper } from '@mui/material';
import Autocomplete, {
  type AutocompleteCloseReason,
  type AutocompleteProps,
} from '@mui/material/Autocomplete';

import { PopperComponent, StyledInput } from './styled';

export interface SwitcherAutoCompleteProps<TData>
  extends Partial<Omit<AutocompleteProps<TData, false, false, false>, 'onClose'>> {
  data?: TData[];
  onClose?: () => void;
  onRender: (
    props: React.HTMLAttributes<HTMLLIElement>,
    data: TData,
    onClose?: () => void,
  ) => ReactNode;
  placeholder?: string;
  noOptionsText?: string;
  onRenderCreateOption?: () => ReactNode;
}

function SwitcherAutoComplete<TData>({
  onClose,
  onChange,
  loading,
  data,
  onRender,
  onRenderCreateOption,
  placeholder,
  noOptionsText,
  ...autoCompleteProps
}: SwitcherAutoCompleteProps<TData>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const [value, setValue] = useState<TData>();

  return (
    <Autocomplete
      {...autoCompleteProps}
      open
      onClose={(_event: React.SyntheticEvent, reason: AutocompleteCloseReason) => {
        if (reason === 'escape' || reason === 'selectOption') {
          onClose?.();
        }
      }}
      value={value}
      loading={loading}
      loadingText={t('common:please-wait')}
      onChange={(event, newValue, reason) => {
        if (
          event.type === 'keydown' &&
          (event as React.KeyboardEvent).key === 'Backspace' &&
          reason === 'removeOption'
        ) {
          return;
        }

        setValue(newValue as TData);
        //redirect
        onChange?.(event, newValue, reason);
      }}
      noOptionsText={noOptionsText ?? t('nodatafound')}
      renderOption={(props, option) => {
        return onRender(props, option, onClose);
      }}
      options={data || []}
      slots={{
        popper: PopperComponent,
        paper(props) {
          return (
            <Paper {...props}>
              {props.children}
              {onRenderCreateOption?.()}
            </Paper>
          );
        },
      }}
      getOptionLabel={() => ''}
      renderInput={(params) => (
        <Box sx={{ px: '20px', pb: 2, position: 'relative' }}>
          <StyledInput
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus
            placeholder={placeholder ?? t('common:search')}
          />
        </Box>
      )}
    />
  );
}

export default SwitcherAutoComplete;
