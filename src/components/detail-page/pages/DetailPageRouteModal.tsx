import { FieldValues } from 'react-hook-form';

import Modal, { DRAGGABLE_HANDLE_CLASS, ModalProps } from '../../modal/Modal';
import DetailPageHeader from '../components/DetailPageHeader';
import DetailPageModalLayout from '../components/DetailPageModalLayout';
import DetailPageRoute, { DetailPageRouteProps } from './DetailPageRoute';

export interface DetailPageRouteModalProps<TModel extends FieldValues>
  extends DetailPageRouteProps<TModel> {
  /**
   * Antd modal options
   */
  modalProps?: Omit<ModalProps, 'children' | 'open'>;
  /**
   * Whether to show close button and allow closing modal, default false
   */
  draggable?: boolean;
}

function DetailPageRouteModal<TModel extends FieldValues>({
  modalProps,
  onLayout,
  draggable,
  ...dpProps
}: DetailPageRouteModalProps<TModel>) {
  return (
    <Modal open={true} {...modalProps} draggable={draggable}>
      <DetailPageRoute<TModel>
        defaultSaveMode="save-close"
        enableClose
        enableDelete
        enableDiscardChanges={false}
        commandsPosition="bottom-right"
        onHeader={(props) =>
          draggable ? (
            <div className={DRAGGABLE_HANDLE_CLASS} style={{ cursor: 'move' }}>
              <DetailPageHeader {...props} />
            </div>
          ) : (
            <DetailPageHeader {...props} />
          )
        }
        onLayout={(layoutProps) => {
          return onLayout ? onLayout(layoutProps) : <DetailPageModalLayout {...layoutProps} />;
        }}
        {...dpProps}
      />
    </Modal>
  );
}

export default DetailPageRouteModal;
