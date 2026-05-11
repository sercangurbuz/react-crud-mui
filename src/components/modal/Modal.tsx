import Draggable, { DraggableProps } from 'react-draggable';

import type { BoxProps } from '@mui/material/Box';
import MuiModal, { ModalProps as MuiModalProps } from '@mui/material/Modal';

import ModalCommands from './components/ModalCommands';
// STYLED COMPONENT
import { ModalPosition, ModalSize, StyledScrollbar } from './styles';

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
  draggable?: boolean;
}
// ===========================================================================

export const DRAGGABLE_HANDLE_CLASS = 'draggable-handle';
export default function Modal({
  children,
  draggable,
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
      <ModalPosition {...props}>
        <DraggableModal disabled={!draggable}>
          <ModalCommands closable={closable} onClose={onClose} />
          {children}
        </DraggableModal>
      </ModalPosition>
    </MuiModal>
  );
}

function DraggableModal({ children, ...props }: Partial<DraggableProps>) {
  return (
    <Draggable {...props} handle={`.${DRAGGABLE_HANDLE_CLASS}`}>
      <div>{children}</div>
    </Draggable>
  );
}

Modal.Scroll = StyledScrollbar;
