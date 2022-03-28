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
  name: string;
}

const RemoveDialog: React.VFC<Props> = ({
  open,
  closeDialog,
  onSubmit,
  name,
}) => {
  return (
    <Dialog
      open={open}
      onClose={closeDialog}
    >
      <DialogTitle>Remove User</DialogTitle>
      <DialogContent>
        {`Are you sure you want to remove ${name} from your group?`}
      </DialogContent>
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

export default RemoveDialog;
