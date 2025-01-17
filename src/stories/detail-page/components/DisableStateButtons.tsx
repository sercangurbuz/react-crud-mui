import CancelOutlined from '@mui/icons-material/CancelOutlined';
import Check from '@mui/icons-material/Check';
import Button from '@mui/material/Button';

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
