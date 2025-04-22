import React from 'react';

import { Delete } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';

import CheckmarkCircle from '../icons/CheckmarkCircle';
import { H6, Paragraph } from '../typography';
import { StyledCard } from './styles';

export interface PanelSelectItemProps {
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  label: React.ReactNode;
  helperText?: React.ReactNode;
  selected?: boolean;
  deleteable?: boolean;
  rightContent?: React.ReactNode;
  onChange?: () => void;
  onDelete?: () => void;
}

function PanelSelectItem({
  deleteable,
  helperText,
  icon,
  label,
  onChange,
  onDelete,
  rightContent,
  selected,
  selectedIcon,
}: PanelSelectItemProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <StyledCard onClick={onChange} selected={selected}>
      <div>
        <div className="place">
          {icon}
          <H6 fontSize={16}>{label}</H6>
        </div>

        <Paragraph color="text.secondary" lineHeight={1.8}>
          {helperText}
        </Paragraph>
      </div>

      {selected ? (
        <div className="check-mark">{selectedIcon ?? <CheckmarkCircle />}</div>
      ) : deleteable ? (
        <IconButton onClick={(e) => handleDelete(e)}>
          <Delete color="action" />
        </IconButton>
      ) : (
        rightContent
      )}
    </StyledCard>
  );
}

export default PanelSelectItem;
