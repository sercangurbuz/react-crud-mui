import Save from '@mui/icons-material/Save';
import Button from '@mui/material/Button';

import DetailPage from '../../../components/detail-page';
import { DetailPageDrawerProps } from '../../../components/detail-page/pages/DetailPageDrawer';
import FormContent from '../../detail-page/components/FormContent';
import { UserDefaultValues } from '../../utils/api';
import { UserSchema, userSchema } from '../../utils/schema';

function EmbededDrawerDetailPage(props: DetailPageDrawerProps<UserSchema>) {
  return (
    <DetailPage.Drawer
      title="New Item"
      enableDelete
      defaultValues={UserDefaultValues}
      schema={userSchema}
      commandsPosition="bottom"
      onCommands={({ onSaveClose }) => (
        <Button fullWidth startIcon={<Save />} onClick={onSaveClose}>
          {props.reason === 'create' ? 'Create User' : 'Update User'}
        </Button>
      )}
      {...props}
    >
      <FormContent />
    </DetailPage.Drawer>
  );
}

export default EmbededDrawerDetailPage;
