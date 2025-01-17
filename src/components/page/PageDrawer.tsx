import Box from '@mui/material/Box';
import Drawer, { DrawerProps } from '@mui/material/Drawer';

import Scrollbar from '../scrollbar';
import DefaultLayout from './components/DefaultLayout';
import Page from './Page';
import { PageModalProps } from './PageModal';

export interface PageDrawerProps extends Omit<PageModalProps, 'modalProps'> {
  /**
   * Antd drawer options
   */
  drawerProps?: DrawerProps;
}

function PageDrawer({ drawerProps, open, onClose, ...pageProps }: PageDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={() => onClose?.('backdrop')} {...drawerProps}>
      <Page
        style={{ width: 450, flex: 1, display: 'flex', flexDirection: 'column' }}
        commandsPosition="bottom-right"
        onLayout={(props) => (
          <DefaultLayout
            {...props}
            content={
              <Box sx={{ flex: 1, position: 'relative' }}>
                <Scrollbar
                  style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute' }}
                  autoHide={false}
                >
                  {props.content}
                </Scrollbar>
              </Box>
            }
          />
        )}
        bordered
        {...pageProps}
        onClose={onClose}
      />
    </Drawer>
  );
}

export default PageDrawer;
