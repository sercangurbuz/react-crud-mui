import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import MuiModal from '@mui/material/Modal';

import useTranslation from '../i18n/hooks/useTranslation';
// STYLED COMPONENT
import { StyledScrollbar, Wrapper } from './styles';

// ===========================================================================
export interface ModalProps extends BoxProps {
  open: boolean;
  onClose?: () => void;
  closable?: boolean;
}
// ===========================================================================

export default function Modal({ children, open, onClose, closable, ...props }: ModalProps) {
  const { t } = useTranslation();
  return (
    <MuiModal open={open} onClose={onClose}>
      <Wrapper {...props}>
        {closable && (
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
        )}
        {children}
      </Wrapper>
    </MuiModal>
  );
}

Modal.Scroll = StyledScrollbar;
