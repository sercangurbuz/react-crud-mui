import Save from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';

import { useDetailPageStates } from '../../..';
import { DetailPageCommandsProps } from '../../../components/detail-page/components/DetailPageCommands';
import { FlexBox } from '../../../components/flexbox';
import Add from '../../../components/icons/Add';

function CustomCommands({ onSave, onCreate }: DetailPageCommandsProps) {
  const { visible, disabled } = useDetailPageStates();
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
          disabled={disabled.create}
          onClick={onCreate}
        >
          Create New Person
        </LoadingButton>
      ) : null}
    </FlexBox>
  );
}

export default CustomCommands;
