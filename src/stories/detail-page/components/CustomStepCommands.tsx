import { useFormContext, useFormState } from 'react-hook-form';

import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { DetailPageCommandsProps } from '../../../components/detail-page/components/DetailPageCommands';
import useDetailPage from '../../../components/detail-page/hooks/useDetailPage';
import { FlexRowAlign } from '../../../components/flexbox';
import { UserDefaultValues } from '../../utils/api';

function CustomStepCommands({
  onPrevClick,
  onNextClick,
  onSave,
  options,
}: DetailPageCommandsProps) {
  const { setActiveSegmentIndex, loading } = useDetailPage();
  const { reset, trigger } = useFormContext();
  const { activeStepIndex, nextButtonTitle, prevButtonTitle, currentForm } = options;
  const { isValid: isCurrentStepValid, errors } = useFormState({
    control: currentForm?.control,
    disabled: !currentForm,
  });

  console.log('CustomStepCommands errors:', errors);

  return (
    <>
      <Box>
        <FlexRowAlign gap={1}>
          {activeStepIndex > 0 ? (
            <>
              <Button
                key="prev"
                variant="outlined"
                onClick={onPrevClick}
                startIcon={<ArrowLeft />}
                color="secondary"
              >
                {prevButtonTitle}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  reset(UserDefaultValues);
                  setActiveSegmentIndex(0);
                  void trigger();
                }}
              >
                Cancel Wizard
              </Button>
            </>
          ) : null}
        </FlexRowAlign>
      </Box>
      <Box>
        <FlexRowAlign gap={1}>
          {activeStepIndex > 0 ? (
            <LoadingButton
              disabled={!isCurrentStepValid}
              color="success"
              loading={loading}
              onClick={() => {
                onSave?.();
                reset(UserDefaultValues);
                setActiveSegmentIndex(0);
              }}
            >
              Save Person
            </LoadingButton>
          ) : null}
          {nextButtonTitle ? (
            <LoadingButton
              key="next"
              onClick={onNextClick}
              color="primary"
              loading={loading}
              disabled={!isCurrentStepValid}
              endIcon={<ArrowRight />}
            >
              {nextButtonTitle}
            </LoadingButton>
          ) : null}
        </FlexRowAlign>
      </Box>
    </>
  );
}

export default CustomStepCommands;
