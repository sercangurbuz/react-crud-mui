import { forwardRef, ReactNode, Ref } from 'react';
import { FieldValues } from 'react-hook-form';

import {
  Avatar,
  AvatarProps,
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
} from '@mui/material';
import { get, groupBy } from 'lodash';

import useComboboxTemplate, { ComboboxTemplate } from '../combobox/hooks/useComboboxTemplate';
import { FlexBox } from '../flexbox';
import useTranslation from '../i18n/hooks/useTranslation';
import isNil from '../misc/isNil';
import { Tiny } from '../typography';

export type SelectProps<T extends FieldValues = FieldValues> = Partial<MuiSelectProps> & {
  dropDownHeight?: number;
  allowClear?: boolean;
  valueField?: string;
  groupBy?: (model: T) => string;
  data?: T[];
  onFilter?: (keyword: string, model: T) => boolean;
  optionTemplate: ComboboxTemplate<T>;
  displayTemplate?: ComboboxTemplate<T>;
  descriptionTemplate?: ComboboxTemplate<T>;
  optionImg?: string;
  optionImgProps?: AvatarProps;
  helperText?: ReactNode;
  selectRef?: Ref<unknown>;
};

function Select<T extends FieldValues>({
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
  onClose,
  onFilter,
  optionImg,
  optionImgProps,
  optionTemplate,
  selectRef,
  sx,
  value,
  valueField = 'id',
  ...rest
}: SelectProps<T>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  const { t } = useTranslation();
  const { renderDisplay, renderOption, renderDescription } = useComboboxTemplate({
    optionTemplate,
    displayTemplate,
    descriptionTemplate,
  });

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
    return collection?.map((item) => {
      const idValue = get(item, valueField);
      const textNode = renderOption(item);
      const descNode = renderDescription?.(item);
      const imgNode = optionImg ? get(item, optionImg) : null;

      let optionNode = (
        <Box width="100%" height="100%">
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
        <MenuItem value={idValue} key={idValue} sx={{ paddingLeft: indent }}>
          {optionNode}
        </MenuItem>
      );
    });
  };

  const findModelByKey = (key: number) => {
    return data?.find((item) => get(item, valueField) === key);
  };

  const renderValue = (value: number) => {
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
        error={error}
        ref={selectRef}
        labelId={`${id}-label`}
        id={`${id}-select`}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        MenuProps={{
          PaperProps: { sx: { maxHeight: dropDownHeight } },
          autoFocus: false,
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
        <MenuItem value={null as any}>
          <em>{t('combobox.selectnone')}</em>
        </MenuItem>
        {children ?? (groupByFn ? renderGroupOptions(data) : renderOptions(data))}
      </MuiSelect>
    );
  };

  const renderErrorMessage = () => {
    return helperText ? <FormHelperText error>{helperText}</FormHelperText> : null;
  };

  const renderLabelWrapper = (content: ReactNode) => {
    return (
      <FormControl fullWidth error={!!error}>
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        {content}
      </FormControl>
    );
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */

  const selectContent = renderSelect();
  const content = label ? renderLabelWrapper(selectContent) : selectContent;

  return (
    <>
      {content}
      {renderErrorMessage()}
    </>
  );
}

export default forwardRef<typeof Select, SelectProps>((props, ref) => (
  <Select {...props} selectRef={ref} />
)) as typeof Select;