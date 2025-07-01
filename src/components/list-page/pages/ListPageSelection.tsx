import { useState } from 'react';
import { FieldValues } from 'react-hook-form';

import DoneAll from '@mui/icons-material/DoneAll';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import { RowSelectionState } from '@tanstack/react-table';

import useTranslation from '../../i18n/hooks/useTranslation';
import Modal, { ModalProps } from '../../modal/Modal';
import Page from '../../page/Page';
import ListPage, { ListPageProps } from './ListPage';

export interface ListPageSelectionProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends Omit<ListPageProps<TModel, TFilter>, 'onSelect'> {
  /**
   * Antd modal options
   */
  modalProps?: Omit<ModalProps, 'children'>;
  /**
   * Shortcut to open prop of Modal
   */
  open: boolean;
  defaultRowSelection?: RowSelectionState;
  onSelect?: (selections: RowSelectionState) => void;
}

function ListPageSelection<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  modalProps,
  onSelect,
  defaultRowSelection = {},
  open,
  onClose,
  tableProps,
  ...lpProps
}: ListPageSelectionProps<TModel, TFilter>) {
  const { t } = useTranslation();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(defaultRowSelection);
  const selCount = Object.keys(rowSelection).length;

  return (
    <Modal open={open} onClose={onClose} sx={{ maxWidth: 900 }} {...modalProps}>
      <ListPage
        enableCreateItem={false}
        enableClear
        {...lpProps}
        onClose={onClose}
        tableProps={{
          enableRowSelection: true,
          state: {
            rowSelection,
          },
          onRowSelectionChange: setRowSelection,
          skeletonRows: 5,
          size: 'small',
          ...tableProps,
        }}
        onLayout={(props) => (
          <>
            <Page.Layout
              {...props}
              content={<Modal.Scroll autoHide={false}>{props.content}</Modal.Scroll>}
            />
          </>
        )}
        onClear={() => setRowSelection({})}
        onCommands={(props) => (
          <>
            <ListPage.Commands {...props} />
            <Badge badgeContent={selCount} color="primary">
              <Button
                startIcon={<DoneAll />}
                color="success"
                onClick={() => onSelect?.(rowSelection)}
                disabled={!selCount}
              >
                {t('listpage.selection.selectClose')}
              </Button>
            </Badge>
          </>
        )}
      />
    </Modal>
  );
}

export default ListPageSelection;
