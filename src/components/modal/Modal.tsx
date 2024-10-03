import { BoxProps } from '@mui/material/Box';
import MuiModal from '@mui/material/Modal';

// STYLED COMPONENT
import { StyledScrollbar, Wrapper } from './styles';

// ===========================================================================
export interface ModalProps extends BoxProps {
  open: boolean;
  onClose: () => void;
}
// ===========================================================================

export default function Modal({ children, open, onClose, ...props }: ModalProps) {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Wrapper {...props}>{children}</Wrapper>
    </MuiModal>
  );
}

Modal.Scroll = StyledScrollbar;
