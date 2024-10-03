import React from 'react';
import { FieldValues } from 'react-hook-form';

import { Box, Drawer, DrawerProps } from '@mui/material';

import FormDirtyTracker from '../../form/components/FormDirtyTracker';
import Scrollbar from '../../scrollbar';
import useFormConfirmDirtyChange from '../hooks/useFormConfirmDirtyChange';
import DetailPage from './DetailPage';
import { DetailPageModalProps } from './DetailPageModal';

export interface DetailPageDrawerProps<TModel extends FieldValues>
  extends Omit<DetailPageModalProps<TModel>, 'modalProps'> {
  /**
   * Drawer options
   */
  drawerProps?: DrawerProps;
}

function DetailPageDrawer<TModel extends FieldValues>({
  drawerProps,
  open,
  onClose,
  confirmDirtyChanges = true,
  ...dpProps
}: DetailPageDrawerProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // Confirm dirty change either leave or stay on form
  const { setFormDirtyChange, handleCloseEvent } = useFormConfirmDirtyChange({
    enabled: confirmDirtyChanges,
    onClose,
  });
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => handleCloseEvent('backdrop')}
      {...drawerProps}
    >
      <DetailPage<TModel>
        style={{ width: 450, display: 'flex', flexDirection: 'column' }}
        defaultSaveMode="save-close"
        
        //onCommands={(props) => <DetailPageDrawerCommands {...props} />}
        onContentLayout={(props) => (
          <Box
            sx={{
              flex: 1,
            }}
          >
            <Scrollbar style={{ maxHeight: '100%' }}>
              <FormDirtyTracker onDirtyStateChange={setFormDirtyChange} />
              <DetailPage.Layout {...props} />
            </Scrollbar>
          </Box>
        )}
        {...dpProps}
        /*  pageHeader={(props) => {
          return <DetailPageDrawerHeader {...props} />;
        }} */
        enableClose={false}
        showHeader
        commandsPosition="footer"
        onClose={handleCloseEvent}
      />
    </Drawer>
  );
}

export default DetailPageDrawer;
