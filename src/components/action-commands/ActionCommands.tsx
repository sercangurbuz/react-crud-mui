import { MouseEvent, PropsWithChildren, useState } from 'react';
import { FieldValues } from 'react-hook-form';

import { DeleteOutline, Edit, RemoveRedEye } from '@mui/icons-material';

import { NeedDataReason } from '../detail-page/pages/DetailPageContent';
import useTranslation from '../i18n/hooks/useTranslation';
import Copy from '../icons/Copy';
import TableMoreMenu from '../table/components/TableMoreMenu';
import TableMoreMenuItem from '../table/components/TableMoreMenuItem';

export interface ActionCommandsProps<TModel extends FieldValues> extends PropsWithChildren {
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
    >
      {showView ? (
        <TableMoreMenuItem
          Icon={RemoveRedEye}
          title={titles ? titles['view'] : t('browse')}
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
          title={titles ? titles['fetch'] : t('edit')}
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
          title={titles ? titles['create'] : t('copyitem')}
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
          title={titles ? titles['view'] : t('delete')}
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
