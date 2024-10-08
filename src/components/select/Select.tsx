import { ReactNode, useMemo, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import { ClearRounded } from '@mui/icons-material';
import {
  Avatar,
  AvatarProps,
  Box,
  FormHelperText,
  IconButton,
  InputBase,
  ListSubheader,
  MenuItem,
  Select as MuiSelect,
  SelectProps as MuiSelectProps,
  SelectChangeEvent,
  styled,
} from '@mui/material';
import { get, groupBy } from 'lodash';

import useComboboxTemplate, { ComboboxTemplate } from '../combobox/hooks/useComboboxTemplate';
import { FlexBox } from '../flexbox';
import useTranslation from '../i18n/hooks/useTranslation';
import SearchInput from '../search-input/SearchInput';
import { Tiny } from '../typography';

export type SelectProps<T extends FieldValues> = Partial<MuiSelectProps> & {
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
};

export const StyledSelectInput = styled(InputBase)(({ theme, size }) => ({
  height: size === 'small' ? 37 : 53,
  fontSize: 14,
  width: '100%',
  fontWeight: 500,
  padding: '0 8px',
  border: '1px solid',
  borderRadius: '8px',
  color: theme.palette.text.primary,
  borderColor: theme.palette.action.disabled,
  '& .MuiPopover-paper': { boxShadow: 'none' },
  '&:hover:not(.Mui-disabled)': {
    borderColor: theme.palette.mode === 'dark' ? '#E5EAF2' : theme.palette.common.black,
  },
  '&&.Mui-error': {
    borderColor: theme.palette.error.main,
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.main,
  },
  '& > .MuiSelect-select': { paddingRight: '0 !important' },
}));

function Select<T extends FieldValues>({
  allowClear = true,
  children,
  data,
  descriptionTemplate,
  disabled,
  displayTemplate,
  dropDownHeight,
  groupBy: groupByFn,
  helperText,
  onChange,
  onClose,
  onFilter,
  optionImg,
  optionImgProps,
  optionTemplate,
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

  const [keyword, setKeyword] = useState<string>();
  const filteredData = useMemo<T[] | undefined>(() => {
    if (!keyword || !onFilter || !data) {
      return data;
    }
    return data.filter((model) => onFilter(keyword, model));
  }, [data, keyword, onFilter]);

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

  /* -------------------------------------------------------------------------- */
  /*                                   Render                                   */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <MuiSelect
        {...rest}
        value={value}
        onChange={onChange}
        disabled={disabled}
        MenuProps={{
          PaperProps: { sx: { maxHeight: dropDownHeight } },
          autoFocus: false,
        }}
        onClose={(event) => {
          onClose?.(event);
          setKeyword('');
        }}
        endAdornment={
          <IconButton
            disableRipple
            sx={{
              display: allowClear && !disabled && value ? '' : 'none',
              marginRight: 2.5,
            }}
            size={rest.size}
            onClick={() =>
              onChange?.({ target: { value: null } } as unknown as SelectChangeEvent, null)
            }
          >
            <ClearRounded sx={{ fontSize: rest.size === 'small' ? '0.8em' : '1em' }} />
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
          //  '&:hover .MuiSelect-iconOutlined': { display: field.value ? 'none' : '' },
          ...sx,
        }}
        size="small"
        //input={<StyledSelectInput />}
        inputProps={{
          size: 'small',
        }}
        displayEmpty
        renderValue={
          value
            ? displayTemplate
              ? () => renderValue(value as number)
              : undefined
            : () => <Box color="text.secondary">{t('combobox.select')}</Box>
        }
      >
        {onFilter && (
          <ListSubheader sx={{ px: 1 }}>
            <SearchInput
              size="small"
              autoFocus
              sx={{
                border: 'none',
              }}
              fullWidth
              onSearch={setKeyword}
              onKeyDown={(e) => {
                if (e.key !== 'Escape') {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
            />
          </ListSubheader>
        )}
        {children ?? (groupByFn ? renderGroupOptions(filteredData) : renderOptions(filteredData))}
      </MuiSelect>
      {helperText ? <FormHelperText error>{helperText}</FormHelperText> : null}
    </>
  );
}

export default Select;
