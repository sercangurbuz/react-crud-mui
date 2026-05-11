import { FieldValues } from 'react-hook-form';

import FormDirtyTracker from '../../form/components/FormDirtyTracker';
import Modal, { DRAGGABLE_HANDLE_CLASS, ModalProps } from '../../modal/Modal';
import DetailPageHeader from '../components/DetailPageHeader';
import DetailPageModalLayout from '../components/DetailPageModalLayout';
import useFormConfirmDirtyChange from '../hooks/useFormConfirmDirtyChange';
import { UseFormPromptProps } from '../hooks/useFormPrompt';
import DetailPage, { DetailPageProps } from './DetailPage';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface DetailPageModalProps<TModel extends FieldValues = FieldValues>
  extends DetailPageProps<TModel> {
  /**
   * Antd modal options
   */
  modalProps?: Omit<ModalProps, 'children' | 'open'>;
  /**
   * Shortcut to open prop of Modal
   */
  open?: boolean;
  /**
   * Whether to leave modal without saving when form is dirty,default true
   */
  promptOptions?: UseFormPromptProps;
  /**
   * Whether to show close button and allow closing modal, default false
   */
  draggable?: boolean;
}

function DetailPageModal<TModel extends FieldValues>({
  modalProps,
  onClose,
  draggable,
  open,
  enableClose = true,
  promptOptions,
  onLayout,
  ...dpProps
}: DetailPageModalProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // Confirm dirty changes either leave or stay on form
  const { setFormDirtyChange, handleCloseEvent } = useFormConfirmDirtyChange({
    ...promptOptions,
    onClose,
  });

  return (
    <Modal
      open={!!open}
      onClose={() => handleCloseEvent('backdrop')}
      closable={enableClose}
      draggable={draggable}
      {...modalProps}
    >
      <DetailPage<TModel>
        defaultSaveMode="save-close"
        enableClose={enableClose}
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
        onLayout={(layoutProps) => (
          <>
            <FormDirtyTracker onDirtyStateChange={setFormDirtyChange} />
            {onLayout ? onLayout(layoutProps) : <DetailPageModalLayout {...layoutProps} />}
          </>
        )}
        bordered={!dpProps.tabs}
        {...dpProps}
        onClose={handleCloseEvent}
      />
    </Modal>
  );
}

DetailPageModal.Layout = DetailPageModalLayout;
export default DetailPageModal;
