import React from 'react';
import { FieldValues } from 'react-hook-form';

import Modal, { ModalProps } from '../../modal/Modal';
import Page from '../../page/Page';
import DetailPageRoute, { DetailPageRouteProps } from './DetailPageRoute';

export interface DetailPageRouteModalProps<TModel extends FieldValues>
  extends DetailPageRouteProps<TModel> {
  /**
   * Antd modal options
   */
  modalProps?: Omit<ModalProps, 'children'>;
}

function DetailPageRouteModal<TModel extends FieldValues>({
  modalProps,
  ...dpProps
}: DetailPageRouteModalProps<TModel>) {
  return (
    <Modal open={true} {...modalProps}>
      <DetailPageRoute<TModel>
        defaultSaveMode="save-close"
        enableClose
        enableDelete
        enableDiscardChanges={false}
        commandsPosition="bottom-right"
        onLayout={(props) => (
          <Page.Layout
            {...props}
            content={<Modal.Scroll autoHide={false}>{props.content}</Modal.Scroll>}
          />
        )}
        {...dpProps}
      />
    </Modal>
  );
}

export default DetailPageRouteModal;
