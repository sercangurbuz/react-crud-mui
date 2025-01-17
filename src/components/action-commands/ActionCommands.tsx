import { MouseEvent, ReactNode, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye';

import { NeedDataReason } from '../detail-page/pages/DetailPageContent';
import useTranslation from '../i18n/hooks/useTranslation';
import Copy from '../icons/Copy';
import TableMoreMenu, { TableMoreMenuProps } from '../table/components/TableMoreMenu';
import TableMoreMenuItem from '../table/components/TableMoreMenuItem';

export interface ActionCommandsProps<TModel extends FieldValues>
  extends Omit<TableMoreMenuProps, 'children' | 'open' | 'handleClose' | 'handleOpen'> {
  onEdit?: () => void;
  onView?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  canView?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canCopy?: boolean;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showCopy?: boolean;
  disabled?: boolean;
  confirmOnDelete?: boolean;
  model?: TModel;
  titles?: Record<NeedDataReason, string>;
  children?: (closeEvent: () => void) => ReactNode;
  index: number;
}

function ActionCommands<TModel extends FieldValues>({
  onDelete,
  onEdit,
  onCopy,
  onView,
  canView = true,
  canDelete = true,
  canEdit = true,
  canCopy = true,
  showCopy = true,
  showView = true,
  showEdit = true,
  showDelete = true,
  disabled,
  children,
  titles,
  ...tableMoreProps
}: ActionCommandsProps<TModel>) {
  const { t } = useTranslation();
  const [openMenuEl, setOpenMenuEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setOpenMenuEl(event.currentTarget);
  };

  const handleCloseOpenMenu = () => setOpenMenuEl(null);

  return (
    <TableMoreMenu
      open={openMenuEl}
      handleOpen={handleOpenMenu}
      handleClose={handleCloseOpenMenu}
      disabled={disabled}
      {...tableMoreProps}
    >
      {showView ? (
        <TableMoreMenuItem
          Icon={RemoveRedEye}
          title={titles?.['view'] ?? t('browse')}
          handleClick={() => {
            onView?.();
            handleCloseOpenMenu();
          }}
          disabled={!canView}
        />
      ) : null}
      {showEdit ? (
        <TableMoreMenuItem
          Icon={Edit}
          title={titles?.['fetch'] ?? t('edit')}
          handleClick={() => {
            onEdit?.();
            handleCloseOpenMenu();
          }}
          disabled={!canEdit}
        />
      ) : null}
      {showCopy ? (
        <TableMoreMenuItem
          Icon={Copy}
          title={titles?.['create'] ?? t('copyitem')}
          handleClick={() => {
            onCopy?.();
            handleCloseOpenMenu();
          }}
          disabled={!canCopy}
        />
      ) : null}
      {showDelete ? (
        <TableMoreMenuItem
          Icon={DeleteOutline}
          title={titles?.['view'] ?? t('delete')}
          color="error.main"
          sx={{ color: 'error.main' }}
          handleClick={() => {
            onDelete?.();
            handleCloseOpenMenu();
          }}
          disabled={!canDelete}
        />
      ) : null}
      {children ? children(handleCloseOpenMenu) : null}
    </TableMoreMenu>
  );
}

export default ActionCommands;
