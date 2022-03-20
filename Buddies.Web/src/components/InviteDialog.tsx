import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { Dialogs } from './ProjectBuddies';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import { makeThrottledSearch } from '../api/utils';
import { SearchFunc } from '../api';
import { scrollHandler } from './utils';

interface Props {
  open: boolean;
  setOpenedDialog: React.Dispatch<React.SetStateAction<Dialogs>>;
  getUsers: SearchFunc;
  onSubmit: SubmitHandler<InviteUserRequest>;
}

const InviteDialog: React.VFC<Props> = ({
  open,
  setOpenedDialog,
  getUsers,
  onSubmit,
}) => {
  const { control, handleSubmit, reset } = useForm<InviteUserRequest>({
    defaultValues: {
      userEmail: '',
    },
  });

  const handleClose = () => {
    setOpenedDialog('');
    reset();
  };

  const [users, setUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState('');

  const [nextUsersPage, setNextUsersPage] = useState(1);

  const getMoreUsers = makeThrottledSearch(getUsers, setUsers, 10);

  useEffect(() => {
    setNextUsersPage(1);
    if (userSearch !== '') {
      getMoreUsers(userSearch, nextUsersPage);
      setNextUsersPage((prevState) => prevState + 1);
    } else {
      setUsers([]);
    }
  }, [userSearch]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Invite User</DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        <Controller
          control={control}
          name="userEmail"
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                options={users}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="User"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                      sx={{ mt: 1 }}
                    />
                  );
                }}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                onInputChange={(_, value) => setUserSearch(value)}
                ListboxProps={{
                  onScroll: (e) => scrollHandler(e, () => {
                    if (userSearch !== '') {
                      getMoreUsers(userSearch, nextUsersPage);
                      setNextUsersPage(nextUsersPage + 1);
                    }
                  }),
                  role: 'list-box',
                }}
              />
            );
          }}
          rules={{
            required: { value: true, message: 'Email of invited user is required.' },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3 }}>
        <Button onClick={handleSubmit(onSubmit)}>Invite</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDialog;
