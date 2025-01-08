import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import MuiModal, { ModalProps as MuiModalProps } from '@mui/material/Modal';

import useTranslation from '../i18n/hooks/useTranslation';
// STYLED COMPONENT
import { StyledScrollbar, Wrapper } from './styles';

// ===========================================================================
export interface ModalProps
  extends BoxProps,
    Pick<
      MuiModalProps,
      | 'disableAutoFocus'
      | 'disablePortal'
      | 'disableScrollLock'
      | 'disableEnforceFocus'
      | 'disableEscapeKeyDown'
      | 'disableRestoreFocus'
    > {
  open: boolean;
  onClose?: () => void;
  closable?: boolean;
}
// ===========================================================================

export default function Modal({
  children,
  open,
  onClose,
  closable,
  disableAutoFocus,
  disablePortal,
  disableScrollLock,
  disableEnforceFocus,
  disableEscapeKeyDown,
  disableRestoreFocus,
  ...props
}: ModalProps) {
  const { t } = useTranslation();
  return (
    <MuiModal
      open={open}
      onClose={onClose}
      disableAutoFocus={disableAutoFocus}
      disablePortal={disablePortal}
      disableScrollLock={disableScrollLock}
      disableEnforceFocus={disableEnforceFocus}
      disableEscapeKeyDown={disableEscapeKeyDown}
      disableRestoreFocus={disableRestoreFocus}
    >
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
