import Close from '@mui/icons-material/Close';
import type { BoxProps } from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MuiModal, { ModalProps as MuiModalProps } from '@mui/material/Modal';

import useTranslation from '../i18n/hooks/useTranslation';
// STYLED COMPONENT
import { ModalSize, StyledScrollbar, Wrapper } from './styles';

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
  size?: ModalSize;
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
