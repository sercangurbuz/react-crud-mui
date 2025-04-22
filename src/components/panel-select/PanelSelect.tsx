import { Stack, StackProps } from '@mui/material';

import PanelSelectItem, { PanelSelectItemProps } from './PanelSelectItem';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type PanelSelectData = {
  value: string | number;
} & Pick<
  PanelSelectItemProps,
  'deleteable' | 'helperText' | 'icon' | 'rightContent' | 'selectedIcon' | 'label' | 'sx'
>;

export interface PanelSelectProps extends Omit<StackProps, 'onChange'> {
  data: PanelSelectData[];
  value: string | number;
  disabled?: boolean;
  onChange: (value: string | number) => void;
  onDelete: (value: string | number) => void;
}

function PanelSelect({
  onDelete,
  data,
  onChange,
  value,
  disabled,
  ...stackProps
}: PanelSelectProps) {
  const items = data.map(
    ({ label, value: itemValue, deleteable, helperText, icon, rightContent, selectedIcon, sx }) => (
      <PanelSelectItem
        key={itemValue}
        selected={itemValue === value}
        label={label}
        disabled={disabled}
        helperText={helperText}
        icon={icon}
        rightContent={rightContent}
        selectedIcon={selectedIcon}
        deleteable={deleteable}
        sx={sx}
        onDelete={() => {
          if (disabled) {
            return;
          }

          onDelete?.(itemValue);
        }}
        onChange={() => {
          if (disabled) {
            return;
          }
          onChange?.(itemValue);
        }}
      />
    ),
  );

  return (
    <Stack gap={2} {...stackProps}>
      {items}
    </Stack>
  );
}

export default PanelSelect;
