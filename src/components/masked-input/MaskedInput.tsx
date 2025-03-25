/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from 'react';
import ReactInputMask, { Props } from 'react-input-mask';

import capitalize from 'lodash.capitalize';

import Input, { InputProps } from '../input/Input';
import useCreateMask from './hooks/useCreateMask';

export type MaskedInputProps = Omit<InputProps, 'value' | 'onChange' | 'ref'> &
  Pick<Props, 'mask' | 'value' | 'onChange' | 'maskPlaceholder'> & {
    maskRepeat?: number;
    maskInputProps?: Props;
  };

function MaskedInput({
  caseType = 'normal',
  disabled,
  mask,
  maskRepeat,
  maskPlaceholder,
  maskInputProps,
  onBlur,
  value,
  onChange,
  getRef,
  ...inputProps
}: MaskedInputProps) {
  const maskValue = useCreateMask({ maskRepeat, mask });

  return (
    <ReactInputMask
      mask={maskValue}
      beforeMaskedStateChange={({ nextState }) => {
        if (caseType === 'normal') {
          return nextState;
        }

        let { value } = nextState;
        switch (caseType) {
          case 'firstUpper':
            value = value.split(' ').map(capitalize).join(' ');
            break;
          case 'upperCase':
            value = value.toUpperCase();
            break;
          case 'lowerCase':
            value = value.toLowerCase();
            break;
        }

        return {
          ...nextState,
          value,
        };
      }}
      disabled={disabled}
      maskPlaceholder={maskPlaceholder}
      inputRef={getRef}
      onBlur={onBlur}
      value={value}
      onChange={onChange}
      autoComplete="off"
      {...maskInputProps}
    >
      <Input {...inputProps} />
    </ReactInputMask>
  );
}

export default forwardRef<typeof MaskedInput, MaskedInputProps>((props, ref) => (
  <MaskedInput {...props} getRef={ref} />
));
