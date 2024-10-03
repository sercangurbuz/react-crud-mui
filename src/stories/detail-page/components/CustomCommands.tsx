import { Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';

import { DetailPageCommmandsSettings } from '../../../components/detail-page/pages/components/DetailPageCommands';
import { FlexBox } from '../../../components/flexbox';
import Add from '../../../components/icons/Add';

function CustomCommands({
  props: { onSave, onCreate, disabled, visible },
}: DetailPageCommmandsSettings) {
  return (
    <FlexBox justifyContent="flex-end" gap={1}>
      {visible.save ? (
        <LoadingButton color="info" startIcon={<Save />} onClick={onSave} disabled={disabled.save}>
          Save Person
        </LoadingButton>
      ) : null}
      {visible.create ? (
        <LoadingButton
          color="success"
          startIcon={<Add />}
          disabled={disabled.save}
          onClick={onCreate}
        >
          Create New Person
        </LoadingButton>
      ) : null}
    </FlexBox>
  );
}

export default CustomCommands;
