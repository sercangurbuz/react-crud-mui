import Modal, { ModalProps } from '../modal/Modal';
import Page, { PageProps } from './Page';

export interface PageModalProps extends PageProps {
  /**
   * Antd modal options
   */
  modalProps?: Omit<ModalProps, 'children' | 'open' | 'onClose'>;
  /**
   * Shortcut to open prop of Modal
   */
  open?: boolean;
}

function PageModal({ modalProps, open, onClose, ...pageProps }: PageModalProps) {
  return (
    <Modal open={!!open} onClose={() => onClose?.('backdrop')} closable {...modalProps}>
      <Page
        commandsPosition="bottom-right"
        bordered
        onLayout={(props) => (
          <>
            <Page.Layout
              {...props}
              content={<Modal.Scroll autoHide={false}>{props.content}</Modal.Scroll>}
            />
          </>
        )}
        {...pageProps}
        onClose={onClose}
      />
    </Modal>
  );
}

export default PageModal;
