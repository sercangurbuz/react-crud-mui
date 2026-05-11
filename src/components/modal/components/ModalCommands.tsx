import { useTranslation } from 'react-i18next';

import Close from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface ModalCommandsProps {
  closable?: boolean;
  onClose?: () => void;
}

function ModalCommands({ closable, onClose }: ModalCommandsProps) {
  const { t } = useTranslation();
  return (
    closable && (
      <IconButton
        onClick={onClose}
        title={t('close')}
        disableRipple
        sx={{
          position: 'absolute',
          right: 5,
          top: 5,
          color: 'grey.400',
          '&:hover': {
            color: 'grey.500',
          },
        }}
      >
        <Close />
      </IconButton>
    )
  );
}

export default ModalCommands;
