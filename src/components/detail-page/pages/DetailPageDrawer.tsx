import { FieldValues } from 'react-hook-form';

import Drawer, { DrawerProps } from '@mui/material/Drawer';

import FormDirtyTracker from '../../form/components/FormDirtyTracker';
import DetailPageDrawerCommands from '../components/DetailPageDrawerCommands';
import DetailPageDrawerLayout from '../components/DetailPageDrawerLayout';
import useFormConfirmDirtyChange from '../hooks/useFormConfirmDirtyChange';
import DetailPage from './DetailPage';
import { DetailPageModalProps } from './DetailPageModal';

export interface DetailPageDrawerProps<TModel extends FieldValues = FieldValues>
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
  promptOptions,
  ...dpProps
}: DetailPageDrawerProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */

  // Confirm dirty change either leave or stay on form
  const { setFormDirtyChange, handleCloseEvent } = useFormConfirmDirtyChange({
    ...promptOptions,
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
        style={{ width: 450, flex: 1, display: 'flex', flexDirection: 'column' }}
        defaultSaveMode="save-close"
        onCommands={(props) => <DetailPageDrawerCommands {...props} />}
        onLayout={(props) => (
          <>
            <FormDirtyTracker onDirtyStateChange={setFormDirtyChange} />
            <DetailPageDrawerLayout {...props} />
          </>
        )}
        enableCreate={false}
        enableClose={false}
        enableDelete={false}
        bordered={!dpProps.tabs}
        {...dpProps}
        onClose={handleCloseEvent}
      />
    </Drawer>
  );
}

export default DetailPageDrawer;
DetailPageDrawer.Commands = DetailPageDrawerCommands;
DetailPageDrawer.Layout = DetailPageDrawerLayout;
