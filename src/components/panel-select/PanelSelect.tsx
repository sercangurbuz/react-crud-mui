import React from 'react';

import PanelSelectItem, { PanelSelectItemProps } from './PanelSelectItem';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type PanelSelectData = {
  value: string | number;
} & Pick<
  PanelSelectItemProps,
  'deleteable' | 'helperText' | 'icon' | 'rightContent' | 'selectedIcon' | 'label'
>;

export interface PanelSelectProps {
  data: PanelSelectData[];
  value: string | number;
  onChange: (value: string | number) => void;
  onDelete: (value: string | number) => void;
  disabled?: boolean;
}

function PanelSelect({ onDelete, data, onChange, value, disabled }: PanelSelectProps) {
  const items = data.map(
    ({ label, value: itemValue, deleteable, helperText, icon, rightContent, selectedIcon }) => (
      <PanelSelectItem
        key={itemValue}
        selected={itemValue === value}
        label={label}
        helperText={helperText}
        icon={icon}
        rightContent={rightContent}
        selectedIcon={selectedIcon}
        deleteable={deleteable}
        onDelete={() => onDelete?.(itemValue)}
        onChange={() => onChange?.(itemValue)}
      />
    ),
  );

  return items;
}

export default PanelSelect;
