import { MouseEvent, PropsWithChildren, useState } from 'react';
import { FieldArrayPath, FieldValues, UseFieldArrayReturn } from 'react-hook-form';

import { Delete } from '@mui/icons-material';

import { UNIQUE_IDENTIFIER_FIELD_NAME } from '../../form/hooks/useArrayFieldHelpers';
import useTranslation from '../../i18n/hooks/useTranslation';
import Add from '../../icons/Add';
import TableMoreMenu from '../../table/components/TableMoreMenu';
import TableMoreMenuItem from '../../table/components/TableMoreMenuItem';

export interface EditableListCommandsProps<
  TModel extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
> {
  onCreate: () => void;
  onDeleteAll: () => void;
  enableDeleteAllButton?: boolean;
  disabled?: boolean;
  newItemTitle?: string;
  api: UseFieldArrayReturn<TModel, TFieldArrayName, typeof UNIQUE_IDENTIFIER_FIELD_NAME>;
}

function EditableListCommands<
  TModel extends FieldValues,
  TFieldArrayName extends FieldArrayPath<TModel> = FieldArrayPath<TModel>,
>({
  onCreate,
  onDeleteAll,
  enableDeleteAllButton = true,
  newItemTitle,
  disabled,
  children,
}: PropsWithChildren<EditableListCommandsProps<TModel, TFieldArrayName>>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
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
      <TableMoreMenuItem
        Icon={Add}
        title={newItemTitle ?? t('newitem')}
        handleClick={() => {
          handleCloseOpenMenu();
          onCreate();
        }}
        disabled={disabled}
      />
      {enableDeleteAllButton ? (
        <TableMoreMenuItem
          Icon={Delete}
          title={t('editablelistform.deleteall')}
          handleClick={() => {
            handleCloseOpenMenu();
            onDeleteAll();
          }}
          disabled={disabled}
        />
      ) : null}
      {children}
    </TableMoreMenu>
  );
}

export default EditableListCommands;
