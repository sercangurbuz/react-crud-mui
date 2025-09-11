import { FieldValues } from 'react-hook-form';

import Modal, { ModalProps } from '../../modal/Modal';
import ListPageModalLayout from '../components/ListPageModalLayout';
import ListPage, { ListPageProps } from './ListPage';

export interface ListPageModalProps<
  TModel extends FieldValues,
  TFilter extends FieldValues = FieldValues,
> extends Omit<ListPageProps<TModel, TFilter>, 'onSelect'> {
  /**
   * Antd modal options
   */
  modalProps?: Omit<ModalProps, 'children' | 'open'>;
  /**
   * Shortcut to open prop of Modal
   */
  open?: boolean;
}

function ListPageModal<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  modalProps,
  open,
  onClose,
  ...lpProps
}: ListPageModalProps<TModel, TFilter>) {
  return (
    <Modal open={!!open} onClose={onClose} sx={{ maxWidth: 900 }} {...modalProps}>
      <ListPage
        enableCreateItem={false}
        enableClear
        onLayout={(props) => <ListPageModalLayout {...props} />}
        {...lpProps}
        onClose={onClose}
      />
    </Modal>
  );
}

export default ListPageModal;

ListPageModal.Layout = ListPageModalLayout;
