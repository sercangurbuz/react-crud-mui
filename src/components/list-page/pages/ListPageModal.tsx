import { FieldValues } from 'react-hook-form';

import Modal, { ModalProps } from '../../modal/Modal';
import Page from '../../page/Page';
import ListPage, { ListPageProps } from './ListPage';

export interface ListPageModalProps<
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
}

function ListPageModal<TModel extends FieldValues, TFilter extends FieldValues = FieldValues>({
  modalProps,
  open,
  onClose,
  ...lpProps
}: ListPageModalProps<TModel, TFilter>) {
  return (
    <Modal open={open} onClose={onClose} sx={{ maxWidth: 900 }} {...modalProps}>
      <ListPage
        enableCreateItem={false}
        enableClear
        {...lpProps}
        onClose={onClose}
        onLayout={(props) => (
          <>
            <Page.Layout
              {...props}
              content={<Modal.Scroll autoHide={false}>{props.content}</Modal.Scroll>}
            />
          </>
        )}
      />
    </Modal>
  );
}

export default ListPageModal;
