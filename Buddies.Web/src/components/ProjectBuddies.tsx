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
import type { ProjectProfile, UserInfo } from '../pages/projects/[pid]';
import InviteDialog from './InviteDialog';
import { SearchFunc } from '../api';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import RemoveDialog from './RemoveDialog';

interface Props extends ProjectProfile {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  ownerId: number;
  getUsers: SearchFunc;
  submitInvite: (req: InviteUserRequest) => void;
  submitRemoval: (userId: number) => void;
  isFull: boolean;
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
  submitRemoval,
  isFull,
}) => {
  const [openedDialog, setOpenedDialog] = useState<Dialogs>('');

  const [toRemove, setToRemove] = useState<UserInfo | null>(null);

  return (
    <>
      <Card elevation={10} sx={{ mt: 6 }}>
        <CardContent>
          <Stack direction="row">
            <Typography variant="h4">
              Project Members
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
                {isOwner && user.UserId !== ownerId
                  && (
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      setToRemove(user);
                      setOpenedDialog('Remove');
                    }}
                  >
                    Remove
                  </Button>
                  )}
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
          {isOwner && !isFull && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setOpenedDialog('Invite')}>
                <ListItemText sx={{ textAlign: 'center' }}>Invite User</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Card>
      <InviteDialog
        open={openedDialog === 'Invite'}
        closeDialog={() => setOpenedDialog('')}
        getUsers={getUsers}
        onSubmit={submitInvite}
        currentMemberEmails={MemberLst.map((user) => user.Email)}
      />
      {toRemove && (
      <RemoveDialog
        open={openedDialog === 'Remove'}
        closeDialog={() => setOpenedDialog('')}
        onSubmit={() => submitRemoval(toRemove.UserId)}
        name={`${toRemove.FirstName} ${toRemove.LastName}`}
      />
      )}
    </>
  );
};

export default ProjectBuddies;
