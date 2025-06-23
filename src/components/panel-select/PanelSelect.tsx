import { cardClasses, Stack, StackProps } from '@mui/material';

import PanelSelectItem, { PanelSelectItemProps } from './PanelSelectItem';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type PanelSelectData = {
  value: string | number;
} & Pick<
  PanelSelectItemProps,
  | 'deleteable'
  | 'helperText'
  | 'icon'
  | 'rightContent'
  | 'selectedIcon'
  | 'label'
  | 'sx'
  | 'children'
>;

export type PanelSelectSize = 'small' | 'normal' | 'large';
export type PanelSelectDirection = 'vertical' | 'horizontal';

export interface PanelSelectProps extends Omit<StackProps, 'onChange' | 'direction'> {
  data: PanelSelectData[];
  value?: string | number;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  onDelete?: (value: string | number) => void;
  size?: PanelSelectSize;
  direction?: PanelSelectDirection;
}

function PanelSelect({
  onDelete,
  data,
  onChange,
  value,
  disabled,
  size = 'normal',
  direction = 'vertical',
  ...stackProps
}: PanelSelectProps) {
  const items = data.map(
    ({
      label,
      value: itemValue,
      deleteable,
      helperText,
      icon,
      rightContent,
      selectedIcon,
      sx,
      children,
    }) => (
      <PanelSelectItem
        key={itemValue}
        selected={itemValue === value}
        label={label}
        disabled={disabled}
        helperText={helperText}
        icon={icon}
        rightContent={rightContent}
        selectedIcon={direction === 'horizontal' ? '' : selectedIcon}
        deleteable={direction === 'horizontal' ? false : deleteable}
        sx={sx}
        // eslint-disable-next-line react/no-children-prop
        children={children}
        onDelete={() => {
          if (disabled) {
            return;
          }
          onDelete?.(itemValue);
        }}
        onChange={() => {
          if (disabled || itemValue === value) {
            return;
          }

          onChange?.(itemValue);
        }}
      />
    ),
  );

  return (
    <Stack
      gap={size === 'small' ? 1 : 2}
      sx={{
        width: '100%',
        fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
        [`& .${cardClasses.root}`]: {
          padding: size === 'small' ? '.87em' : size === 'large' ? '1.3em' : '1em',
        },
      }}
      direction={direction === 'vertical' ? 'column' : 'row'}
      {...stackProps}
    >
      {items}
    </Stack>
  );
}

export default PanelSelect;
