import { Box, IconButton } from '@mui/material';
import { ArrowLeftIcon, ArrowRightIcon } from '@mui/x-date-pickers/icons';
import { useConfirm } from 'material-ui-confirm';

import DetailPage from '../../../components/detail-page';
import { DetailPageModalProps } from '../../../components/detail-page/pages/DetailPageModal';
import { FlexBetween, FlexBox } from '../../../components/flexbox';
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
      onCommands={(props) => (
        <FlexBetween sx={{ width: '100%' }}>
          {props.options.reason === 'fetch' ? (
            <FlexBox>
              <IconButton onClick={() => props.onNavigate?.('prev')}>
                <ArrowLeftIcon />
              </IconButton>
              <IconButton onClick={() => props.onNavigate?.('next')}>
                <ArrowRightIcon />
              </IconButton>
            </FlexBox>
          ) : (
            <Box />
          )}
          <FlexBox gap={1}>
            <DetailPage.Commands {...props} />
          </FlexBox>
        </FlexBetween>
      )}
      {...props}
    >
      <FormContent />
    </DetailPage.Modal>
  );
}

export default EmbededDetailPage;
