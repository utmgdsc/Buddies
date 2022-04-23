import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface Props {
  open: boolean;
  closeDialog: () => void;
  onSubmit: () => void;
  title: string;
  content: string;
}

const ConfirmDialog: React.VFC<Props> = ({
  open,
  closeDialog,
  onSubmit,
  title,
  content,
}) => {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={() => {
          onSubmit();
          closeDialog();
        }}
        >
          Confirm
        </Button>
        <Button onClick={closeDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
