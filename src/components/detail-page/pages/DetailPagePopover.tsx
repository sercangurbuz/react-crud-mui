import { FieldValues } from 'react-hook-form';

import { Popover, PopoverProps } from '@mui/material';

import DetailPage, { DetailPageProps } from './DetailPage';

/* ---------------------------------- Types --------------------------------- */

export interface DetailPagePopoverProps<TModel extends FieldValues>
  extends DetailPageProps<TModel> {
  popoverOptions?: PopoverProps;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

/* ------------------------ DetailPageModal Component ----------------------- */

function DetailPagePopover<TModel extends FieldValues>({
  popoverOptions,
  children,
  onClose,
  anchorEl,
  ...rest
}: DetailPagePopoverProps<TModel>) {
  /* ------------------------------- Main Hooks ------------------------------- */

  const handleClose = () => {
    onClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'detailpage-popover' : undefined;

  /* --------------------------------- Methods -------------------------------- */

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      {...popoverOptions}
    >
      <DetailPage<TModel>
        onAfterSave={() => handleClose()}
        onAfterDelete={() => handleClose()}
        showHeader={false}
        commandsPosition="bottom-right"
        onClose={() => handleClose()}
        {...rest}
      >
        {children}
      </DetailPage>
    </Popover>
  );
}

export default DetailPagePopover;