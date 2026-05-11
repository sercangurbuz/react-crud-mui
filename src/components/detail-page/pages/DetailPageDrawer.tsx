import { FieldValues } from 'react-hook-form';

import { Theme, useMediaQuery } from '@mui/material';
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
const DEFAULT_WIDTH = 450;
function DetailPageDrawer<TModel extends FieldValues>({
  drawerProps,
  open,
  onClose,
  promptOptions,
  onLayout,
  ...dpProps
}: DetailPageDrawerProps<TModel>) {
  /* -------------------------------------------------------------------------- */
  /*                                    Hooks                                   */
  /* -------------------------------------------------------------------------- */
  const downSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

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
        style={{
          width: downSm ? '100%' : DEFAULT_WIDTH,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        defaultSaveMode="save-close"
        onCommands={(props) => <DetailPageDrawerCommands {...props} />}
        onLayout={(props) => (
          <>
            <FormDirtyTracker onDirtyStateChange={setFormDirtyChange} />
            {onLayout ? onLayout(props) : <DetailPageDrawerLayout {...props} />}
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
