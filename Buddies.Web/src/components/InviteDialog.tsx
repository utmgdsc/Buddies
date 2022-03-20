import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import { makeThrottledSearch } from '../api/utils';
import { SearchFunc } from '../api';
import { scrollHandler } from './utils';

interface Props {
  open: boolean;
  closeDialog: () => void;
  getUsers: SearchFunc;
  onSubmit: SubmitHandler<InviteUserRequest>;
  currentMemberEmails: string[];
}

const InviteDialog: React.VFC<Props> = ({
  open,
  closeDialog,
  getUsers,
  onSubmit,
  currentMemberEmails,
}) => {
  const {
    control, handleSubmit, reset, formState: { isSubmitting },
  } = useForm<InviteUserRequest>({
    defaultValues: {
      userEmail: '',
    },
  });

  const handleClose = () => {
    closeDialog();
    reset();
  };

  const handleInvite = () => {
    handleSubmit(onSubmit)()
      .then(() => handleClose());
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
                filterOptions={(options) => {
                  return options.filter((option) => !currentMemberEmails.includes(option));
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
        <LoadingButton
          onClick={handleInvite}
          loading={isSubmitting}
        >
          Invite
        </LoadingButton>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDialog;
