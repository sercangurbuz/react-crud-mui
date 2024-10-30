import { FieldValues } from 'react-hook-form';

import DetailPage from '../../../components/detail-page';
import { DetailPageModalProps } from '../../../components/detail-page/pages/DetailPageModal';
import FormContent from '../../detail-page/components/FormContent';
import { UserDefaultValues } from '../../utils/api';
import { userSchema } from '../../utils/schema';

function EmbededDetailPage(props: DetailPageModalProps<FieldValues>) {
  return (
    <DetailPage.Modal
      title="New Item"
      enableDelete
      defaultValues={UserDefaultValues}
      schema={userSchema}
      {...props}
    >
      <FormContent />
    </DetailPage.Modal>
  );
}

export default EmbededDetailPage;
