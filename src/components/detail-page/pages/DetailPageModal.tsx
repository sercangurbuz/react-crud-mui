import { FieldValues } from 'react-hook-form';

import FormDirtyTracker from '../../form/components/FormDirtyTracker';
import Modal, { ModalProps } from '../../modal/Modal';
import Page from '../../page/Page';
import useFormConfirmDirtyChange from '../hooks/useFormConfirmDirtyChange';
import { UseFormPromptProps } from '../hooks/useFormPrompt';
import DetailPage, { DetailPageProps } from './DetailPage';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export interface DetailPageModalProps<TModel extends FieldValues> extends DetailPageProps<TModel> {
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
}

function DetailPageModal<TModel extends FieldValues>({
  modalProps,
  onClose,
  open,
  enableClose = true,
  promptOptions,
  ...rest
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
      {...modalProps}
    >
      <DetailPage<TModel>
        defaultSaveMode="save-close"
        enableClose={enableClose}
        enableDelete
        enableDiscardChanges={false}
        commandsPosition="bottom-right"
        onLayout={(props) => (
          <>
            <FormDirtyTracker onDirtyStateChange={setFormDirtyChange} />
            <Page.Layout
              {...props}
              content={<Modal.Scroll autoHide={false}>{props.content}</Modal.Scroll>}
            />
          </>
        )}
        bordered
        {...rest}
        onClose={handleCloseEvent}
      />
    </Modal>
  );
}

export default DetailPageModal;
