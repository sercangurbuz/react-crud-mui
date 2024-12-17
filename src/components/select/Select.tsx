import { forwardRef, ReactNode, Ref, useMemo } from 'react';
import { FieldValues, Path } from 'react-hook-form';

import { ClearRounded } from '@mui/icons-material';
import {
  Avatar,
  AvatarProps,
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
} from '@mui/material';
import { get, groupBy } from 'lodash';

import { DEFAULT_OPTION_TEMPLATE } from '../combobox/ComboBox';
import useComboboxTemplate, { ComboboxTemplate } from '../combobox/hooks/useComboboxTemplate';
import { FlexBox } from '../flexbox';
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
  id,
  label,
  onChange,
  optionImg,
  optionImgProps,
  optionTemplate = DEFAULT_OPTION_TEMPLATE,
  optionAsValue,
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
    if (optionAsValue) {
      return multiple
        ? (value as T[])?.map((item) => get(item, valueField))
        : get(value as T, valueField);
    }

    return value;
  }, [multiple, optionAsValue, value, valueField]);

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

      let optionNode = (
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

  const renderValue = (value: number | string) => {
    if (!value) {
      return;
    }
    const model = findModelByKey(value);
    return model ? renderDisplay?.(model) : null;
  };

  const renderSelect = () => {
    return (
      <MuiSelect
        {...rest}
        notched={!!value}
        error={error}
        multiple={multiple}
        ref={selectRef}
        labelId={`${id}-label`}
        id={`${id}-select`}
        label={label}
        value={selectedValue}
        onChange={(e, child) => {
          if (optionAsValue) {
            const selValue = e.target.value as string;

            if (selValue) {
              const selectedModel = Array.isArray(selValue)
                ? selValue.map((record) => findModelByKey(record))
                : findModelByKey(selValue);

              onChange?.(
                { target: { value: selectedModel } } as unknown as SelectChangeEvent,
                child,
              );
              return;
            }
          }

          onChange?.(e, child);
        }}
        disabled={disabled}
        MenuProps={{
          PaperProps: { sx: { maxHeight: dropDownHeight } },
          autoFocus: false,
        }}
        endAdornment={
          <IconButton
            sx={{
              display: allowClear && !disabled && value ? '' : 'none',
              marginRight: 2.5,
            }}
            size="small"
            onClick={() =>
              onChange?.({ target: { value: null } } as unknown as SelectChangeEvent, null)
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
              ? () => renderValue(value as number)
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
    <FormControl fullWidth error={!!error} size="small">
      <InputLabel shrink={!!value} id={`${id}-label`}>
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
