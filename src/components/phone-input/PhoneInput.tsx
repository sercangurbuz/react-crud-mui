import 'react-international-phone/style.css';

import React, { forwardRef } from 'react';
import {
  CountryIso2,
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
  UsePhoneInputConfig,
} from 'react-international-phone';

import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField, { BaseTextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import useTranslation from '../i18n/hooks/useTranslation';
import useFloatingLabelProps from '../input/hooks/useFloatingLabelProps';

export interface PhoneInputProps extends BaseTextFieldProps {
  value?: string;
  onChange?: UsePhoneInputConfig['onChange'];
  phoneInputconfig?: UsePhoneInputConfig;
  getRef?: React.MutableRefObject<typeof PhoneInput>;
}

const DEFAULT_COUNTRY = 'tr';

function PhoneInput({
  value,
  onChange,
  phoneInputconfig,
  onBlur,
  onFocus,
  sx,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRef,
  ...restProps
}: PhoneInputProps) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const { t } = useTranslation();
  const floatingLabelProps = useFloatingLabelProps({ value, onBlur, onFocus });

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    value,
    countries: defaultCountries,
    onChange,
    disableDialCodeAndPrefix: true,
    defaultCountry: DEFAULT_COUNTRY,
    ...phoneInputconfig,
  });

  return (
    <TextField
      label={t('phone_number')}
      value={inputValue}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" style={{ marginRight: '2px', marginLeft: '-8px' }}>
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country.iso2}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => <FlagImage iso2={value} style={{ display: 'flex' }} />}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagImage iso2={country.iso2} style={{ marginRight: '8px' }} />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-input': {
          fontVariantNumeric: 'tabular-nums',
          pl: 1,
        },
        '& > .MuiInputLabel-root[data-shrink="false"]': {
          left: 50,
        },
        ...sx,
      }}
      {...restProps}
      {...floatingLabelProps}
    />
  );
}

export default forwardRef<typeof PhoneInput, PhoneInputProps>((props, ref) => (
  <PhoneInput {...props} getRef={ref as React.MutableRefObject<typeof PhoneInput>} />
));
