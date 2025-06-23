import React from 'react';

import { Delete } from '@mui/icons-material';
import { Box, Collapse, SxProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { FlexBetween } from '../flexbox';
import CheckmarkCircle from '../icons/CheckmarkCircle';
import { Paragraph } from '../typography';
import { StyledCard } from './styles';

export interface PanelSelectItemProps {
  disabled?: boolean;
  icon?: React.ReactNode;
  selectedIcon?: React.ReactNode;
  label: React.ReactNode;
  helperText?: React.ReactNode;
  selected?: boolean;
  deleteable?: boolean;
  rightContent?: React.ReactNode;
  onChange?: () => void;
  onDelete?: () => void;
  sx?: SxProps;
  children?: React.ReactNode;
}

function PanelSelectItem({
  deleteable,
  disabled,
  helperText,
  icon,
  label,
  onChange,
  onDelete,
  rightContent,
  selected,
  selectedIcon,
  sx,
  children,
}: PanelSelectItemProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <StyledCard onClick={onChange} selected={selected} sx={sx} disabled={disabled}>
      <FlexBetween>
        <div>
          <div className="place">
            {icon}
            <Paragraph className="panel-label" fontWeight={500}>
              {label}
            </Paragraph>
          </div>

          <Paragraph color="text.secondary" className="panel-helper-label" fontWeight={400}>
            {helperText}
          </Paragraph>
        </div>

        {selected ? (
          (selectedIcon ?? <div className="check-mark">{<CheckmarkCircle />}</div>)
        ) : deleteable ? (
          <IconButton onClick={(e) => handleDelete(e)}>
            <Delete color="action" />
          </IconButton>
        ) : (
          rightContent
        )}
      </FlexBetween>
      <Collapse in={selected}>{children ? <Box sx={{ mt: 2 }}>{children}</Box> : null}</Collapse>
    </StyledCard>
  );
}

export default PanelSelectItem;
