import * as React from 'react';
import Grid from '@material-ui/core/grid';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <Grid container >
      <Grid item xs={10}>
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
          {children}
        
        </DialogTitle>
      </Grid>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
              
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </Grid>
  );
};

export default function CustomizedDialogs({children, color, topmarg}: {children: React.ReactNode, color: string, topmarg: number}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ModeEditOutlinedIcon sx={{marginTop: topmarg, color: {color}, '&:hover': { color: '#add8e6', cursor: 'pointer' } }} onClick={handleClickOpen}/> {/* onClick={} pop up */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Make Changes
        </BootstrapDialogTitle>
        <DialogContent dividers>
            {children}
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
