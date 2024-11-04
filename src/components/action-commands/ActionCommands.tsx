import { MouseEvent, PropsWithChildren, useState } from 'react';

import { DeleteOutline, Edit, RemoveRedEye } from '@mui/icons-material';

import useTranslation from '../i18n/hooks/useTranslation';
import Copy from '../icons/Copy';
import TableMoreMenu from '../table/components/TableMoreMenu';
import TableMoreMenuItem from '../table/components/TableMoreMenuItem';

export interface ActionCommandsProps extends PropsWithChildren {
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
}

function ActionCommands({
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
}: ActionCommandsProps) {
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
    >
      {showView ? (
        <TableMoreMenuItem
          Icon={RemoveRedEye}
          title={t('browse')}
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
          title={t('edit')}
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
          title={t('copyitem')}
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
          title="Delete"
          handleClick={() => {
            onDelete?.();
            handleCloseOpenMenu();
          }}
          disabled={!canDelete}
        />
      ) : null}
      {children}
    </TableMoreMenu>
  );
}

export default ActionCommands;
