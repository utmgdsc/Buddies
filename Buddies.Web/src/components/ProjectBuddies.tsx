import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import type { ProjectProfile } from '../pages/projects/[pid]';
import InviteDialog from './InviteDialog';
import { SearchFunc } from '../api';
import { InviteUserRequest } from '../api/model/inviteUserRequest';

interface Props extends ProjectProfile {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  ownerId: number;
  getUsers: SearchFunc;
  submitInvite: (req: InviteUserRequest) => Promise<any>;
}

export type Dialogs = '' | 'Invite' | 'Remove';

const ProjectBuddies: React.VFC<Props> = ({
  setSidebarOpen,
  MemberLst,
  isOwner,
  ownerId,
  getUsers,
  submitInvite,
  InvitedLst,
}) => {
  const [openedDialog, setOpenedDialog] = useState<Dialogs>('');

  const { enqueueSnackbar } = useSnackbar();

  const onSubmitInvite = (req: InviteUserRequest) => {
    submitInvite(req)
      .then(() => {
        enqueueSnackbar('User invited.', { variant: 'success' });
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response) {
          enqueueSnackbar(err.response.data, { variant: 'error' });
        } else {
          enqueueSnackbar(err, { variant: 'error' });
        }
      });
  };

  return (
    <>
      <Card elevation={10} sx={{ mt: 6 }}>
        <CardContent>
          <Stack direction="row">
            <Typography variant="h4">
              Project Buddies
            </Typography>
            <Button onClick={() => setSidebarOpen((prevState) => !prevState)}>
              <SettingsIcon />
            </Button>
          </Stack>
        </CardContent>
        <List>
          {MemberLst.map((user) => {
            return (
              <ListItem>
                <ListItemText primary={`${user.FirstName} ${user.LastName}`} />
                {isOwner && user.UserId !== ownerId && <Button color="error">Remove</Button>}
              </ListItem>
            );
          })}
          {InvitedLst.map((user) => {
            return (
              <ListItem>
                <ListItemText primary={`${user.FirstName} ${user.LastName} (Invited)`} />
              </ListItem>
            );
          })}
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenedDialog('Invite')}>
              <ListItemText sx={{ textAlign: 'center' }}>Invite User</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Card>
      <InviteDialog
        open={openedDialog === 'Invite'}
        setOpenedDialog={setOpenedDialog}
        getUsers={getUsers}
        onSubmit={onSubmitInvite}
      />
    </>
  );
};

export default ProjectBuddies;
