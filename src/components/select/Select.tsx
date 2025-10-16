import { forwardRef, ReactNode, Ref, useMemo } from 'react';
import { FieldValues, Path } from 'react-hook-form';

import ClearRounded from '@mui/icons-material/ClearRounded';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { SelectProps as MuiSelectProps, SelectChangeEvent } from '@mui/material/Select';
import { get, groupBy } from 'lodash';

import { DEFAULT_OPTION_TEMPLATE } from '../combobox/ComboBox';
import useComboboxTemplate, { ComboboxTemplate } from '../combobox/hooks/useComboboxTemplate';
import { FlexBox } from '../flexbox';
import useFormInitEffect from '../form/hooks/useFormInitEffect';
import { toNull } from '../misc';
import isNil from '../misc/isNil';
import { Tiny } from '../typography';

export type SelectSize = MuiSelectProps['size'] | 'smaller';

export type SelectProps<T extends FieldValues = FieldValues> = Partial<
  Omit<MuiSelectProps, 'size'>
> & {
  dropDownHeight?: number;
  allowClear?: boolean;
  valueField?: string;
  groupBy?: (model: T) => string;
  data?: T[];
  optionTemplate?: ComboboxTemplate<T>;
  displayTemplate?: ComboboxTemplate<T>;
  descriptionTemplate?: ComboboxTemplate<T>;
  optionImg?: Path<T>;
  optionImgProps?: AvatarProps;
  helperText?: ReactNode;
  selectRef?: Ref<unknown>;
  optionAsValue?: boolean;
  size?: SelectSize;
  selectInitialOption?: boolean | ((model: T) => boolean);
  labelWrapperProps?: Omit<FormControlProps, 'children'>;
};

function Select<T extends FieldValues = FieldValues>({
  allowClear = true,
  children,
  data,
  descriptionTemplate,
  disabled,
  displayTemplate,
  dropDownHeight,
  error,
  groupBy: groupByFn,
  helperText,
  labelWrapperProps,
  id,
  label,
  onChange,
  optionImg,
  optionImgProps,
  optionTemplate = DEFAULT_OPTION_TEMPLATE,
  optionAsValue,
  readOnly,
  selectInitialOption,
  selectRef,
  sx,
  value,
  valueField = 'id',
  multiple,
  size = 'small',
  ...rest
}: SelectProps<T>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { renderDisplay, renderOption, renderDescription } = useComboboxTemplate({
    optionTemplate,
    displayTemplate,
    descriptionTemplate,
  });

  const selectedValue = useMemo(() => {
    let currentValue = value;

    if (optionAsValue) {
      currentValue = multiple
        ? (value as T[])?.map((item) => get(item, valueField))
        : get(value as T, valueField);
    }

    return toNull(currentValue);
  }, [multiple, optionAsValue, value, valueField]);

  useFormInitEffect(() => {
    if (data?.length && selectInitialOption) {
      const model =
        typeof selectInitialOption === 'function' ? data.find(selectInitialOption) : data[0];
      const initialValue = get(model, valueField);

      if (initialValue) {
        handleChange({ target: { value: initialValue } } as SelectChangeEvent<unknown>, null);
      }
    }
  }, [data]);

  /* -------------------------------------------------------------------------- */
  /*                                   Events                                   */
  /* -------------------------------------------------------------------------- */

  const renderGroupOptions = (collection?: T[]) => {
    const groupCollection = groupBy(collection, groupByFn);

    return Object.keys(groupCollection)
      .sort()
      .reduce<ReactNode[]>((result, groupName) => {
        result.push(<ListSubheader key={groupName}>{groupName}</ListSubheader>);
        const items = renderOptions(groupCollection[groupName], 3);
        if (items) {
          result.push(...items);
        }
        return result;
      }, []);
  };

  const renderOptions = (collection?: T[], indent?: number) => {
    return collection?.map((item, index) => {
      const idValue = get(item, valueField);
      const textNode = renderOption(item);
      const descNode = renderDescription?.(item);
      const imgNode = optionImg ? get(item, optionImg) : null;

      let optionNode = multiple ? (
        textNode
      ) : (
        <Box
          width="100%"
          height="100%"
          sx={{ fontSize: size === 'smaller' ? 'smaller' : undefined }}
        >
          {textNode}
          {typeof descNode === 'string' ? <Tiny color="text.secondary">{descNode}</Tiny> : descNode}
        </Box>
      );

      if (imgNode) {
        optionNode = (
          <FlexBox alignItems="center" gap={1}>
            <Avatar
              src={imgNode}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: (theme) => theme.palette.action.disabledBackground,
              }}
              variant="rounded"
              {...optionImgProps}
            />
            {optionNode}
          </FlexBox>
        );
      }

      return (
        <MenuItem
          value={idValue}
          key={idValue}
          sx={{ paddingLeft: indent }}
          autoFocus={value ? value === idValue : index === 0}
        >
          {optionNode}
        </MenuItem>
      );
    });
  };

  const findModelByKey = (key: number | string) => {
    return data?.find((item) => get(item, valueField) === key) as T;
  };

  const renderValue = (value: number | string | T) => {
    if (!value) {
      return null;
    }
    const model = optionAsValue ? value : findModelByKey(value as number | string);
    return model ? renderDisplay?.(model as T) : null;
  };

  const handleChange = (e: SelectChangeEvent<unknown>, child: React.ReactNode) => {
    const selValue = e.target.value;

    if (optionAsValue) {
      if (selValue) {
        const selectedModel = Array.isArray(selValue)
          ? selValue.map((record) => findModelByKey(record))
          : findModelByKey(selValue as number);

        onChange?.({ target: { value: selectedModel } } as unknown as SelectChangeEvent, child);
        return;
      }
    }

    onChange?.(e, child);
  };

  const renderSelect = () => {
    return (
      <MuiSelect
        {...rest}
        readOnly={readOnly}
        notched={multiple ? !!(value as Array<unknown>)?.length : !!value}
        error={error}
        multiple={multiple}
        ref={selectRef}
        labelId={`${id}-label`}
        id={`${id}-select`}
        label={label}
        value={selectedValue}
        onChange={handleChange}
        disabled={disabled}
        MenuProps={{
          PaperProps: { sx: { maxHeight: dropDownHeight } },
          autoFocus: false,
        }}
        endAdornment={
          <IconButton
            sx={{
              display: allowClear && !disabled && !readOnly && value ? '' : 'none',
              marginRight: 2.5,
            }}
            size="small"
            onClick={() =>
              onChange?.(
                { target: { value: multiple ? [] : null } } as unknown as SelectChangeEvent,
                null,
              )
            }
          >
            <ClearRounded sx={{ fontSize: size === 'small' ? '0.8em' : '1em' }} />
          </IconButton>
        }
        sx={{
          width: '100%',
          '& .MuiIconButton-root': {
            visibility: 'hidden',
          },
          '&:hover .MuiIconButton-root': {
            visibility: value ? 'visible' : 'hidden',
          },
          '& > .MuiSelect-select': {
            padding: size === 'smaller' ? '8px 12px' : undefined,
          },
          ...sx,
        }}
        size="small"
        inputProps={{
          size: 'small',
        }}
        renderValue={
          isNil(value)
            ? () => null
            : displayTemplate
              ? () => renderValue(value as number | string | T)
              : undefined
        }
      >
        {children}
        {groupByFn ? renderGroupOptions(data) : renderOptions(data)}
      </MuiSelect>
    );
  };

  const renderErrorMessage = () => {
    return helperText ? <FormHelperText error>{helperText}</FormHelperText> : null;
  };

  const renderLabelWrapper = (content: ReactNode, errorMessage: ReactNode) => (
    <FormControl fullWidth {...labelWrapperProps} error={!!error} size="small">
      <InputLabel
        shrink={multiple ? !!(value as Array<unknown>)?.length : !!value}
        id={`${id}-label`}
        sx={{
          lineHeight: size === 'smaller' ? 1.4 : undefined,
        }}
      >
        {label}
      </InputLabel>
      {content}
      {errorMessage}
    </FormControl>
  );

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const selectContent = renderSelect();
  const errorMessage = renderErrorMessage();
  const content = label ? (
    renderLabelWrapper(selectContent, errorMessage)
  ) : (
    <>
      {selectContent}
      {errorMessage}
    </>
  );

  return content;
}

export default forwardRef<typeof Select, SelectProps>((props, ref) => (
  <Select {...props} selectRef={ref} />
)) as typeof Select;
