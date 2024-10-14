import { useFormContext } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button } from '@mui/material';

import { StepCommandsComponentProps } from '../../../components/detail-page/components/DetailPageStepCommands';
import useDetailPage from '../../../components/detail-page/hooks/useDetailPage';
import { FlexBetween, FlexRowAlign } from '../../../components/flexbox';
import useFormGroupIsInValid from '../../../components/form/hooks/useFormGroupIsInValid';
import { UserDefaultValues } from '../../utils/api';

function CustomStepCommands({ next, prev, onFinish, options }: StepCommandsComponentProps) {
  const { setActiveSegmentIndex } = useDetailPage();
  const { reset } = useFormContext();
  const isInValid = useFormGroupIsInValid({ groupName: options.currentKey });
  const { activeStepIndex } = options;

  return (
    <FlexBetween width="100%">
      <Box>
        <FlexRowAlign gap={1}>
          {prev}
          {activeStepIndex > 0 ? (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                reset(UserDefaultValues);
                setActiveSegmentIndex(0);
              }}
            >
              Cancel Wizard
            </Button>
          ) : null}
        </FlexRowAlign>
      </Box>
      <Box>
        <FlexRowAlign gap={1}>
          {activeStepIndex > 0 ? (
            <LoadingButton
              disabled={isInValid}
              color="success"
              loading={options.loading}
              onClick={async () => {
                await onFinish?.();
                reset(UserDefaultValues);
                setActiveSegmentIndex(0);
              }}
            >
              Save Person
            </LoadingButton>
          ) : null}
          {next}
        </FlexRowAlign>
      </Box>
    </FlexBetween>
  );
}

export default CustomStepCommands;
