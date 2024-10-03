import { CancelOutlined, Check } from '@mui/icons-material';
import { Button } from '@mui/material';

interface DisableStateButtonsProps {
  isDisabled?: boolean;
  onDisabledChange(disable: boolean): void;
}

function DisableStateButtons({ onDisabledChange, isDisabled }: DisableStateButtonsProps) {
  return (
    <Button
      startIcon={isDisabled ? <Check /> : <CancelOutlined />}
      disabled={false}
      onClick={() => onDisabledChange(!isDisabled)}
      color={isDisabled ? 'success' : 'error'}
    >
      {isDisabled ? 'Enable page' : 'Disable page'}
    </Button>
  );
}

export default DisableStateButtons;
