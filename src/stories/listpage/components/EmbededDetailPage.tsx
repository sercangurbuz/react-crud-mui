import { useConfirm } from 'material-ui-confirm';

import DetailPage from '../../../components/detail-page';
import { DetailPageModalProps } from '../../../components/detail-page/pages/DetailPageModal';
import FormContent from '../../detail-page/components/FormContent';
import { UserDefaultValues } from '../../utils/api';
import { UserSchema, userSchema } from '../../utils/schema';

function EmbededDetailPage(props: DetailPageModalProps<UserSchema>) {
  const confirm = useConfirm();
  return (
    <DetailPage.Modal
      title="New Item"
      enableDelete
      defaultValues={UserDefaultValues}
      schema={userSchema}
      onSave={async () => {
        await confirm({
          description: 'ddw',
        });
      }}
      {...props}
    >
      <FormContent />
    </DetailPage.Modal>
  );
}

export default EmbededDetailPage;
