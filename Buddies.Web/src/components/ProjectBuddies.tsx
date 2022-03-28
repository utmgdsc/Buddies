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
import InviteDialog from './dialogs/InviteDialog';
import { SearchFunc } from '../api';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import { ProjectProfileResponse } from '../api/model/projectProfileResponse';
import { UserInfoResponse } from '../api/model/userInfoResponse';
import ConfirmDialog from './dialogs/ConfirmDialog';

interface Props extends ProjectProfileResponse {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  getUsers: SearchFunc;
  submitInvite: (req: InviteUserRequest) => void;
  submitRemoval: (userId: number) => void;
  isFull: boolean;
}

export type Dialogs = '' | 'Invite' | 'Remove';

const ProjectBuddies: React.VFC<Props> = ({
  setSidebarOpen,
  members,
  isOwner,
  email: ownerEmail,
  getUsers,
  submitInvite,
  invitedUsers,
  submitRemoval,
  isFull,
}) => {
  const [dialog, setDialog] = useState<Dialogs>('');

  const [userToRemove, setUserToRemove] = useState<UserInfoResponse | null>(null);

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
          {members.map((member) => {
            return (
              <ListItem>
                <ListItemText primary={`${member.firstName} ${member.lastName}`} />
                {isOwner && member.email !== ownerEmail
                  && (
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => {
                      setUserToRemove(member);
                      setDialog('Remove');
                    }}
                  >
                    Remove
                  </Button>
                  )}
              </ListItem>
            );
          })}
          {invitedUsers.map((user) => {
            return (
              <ListItem>
                <ListItemText primary={`${user.firstName} ${user.lastName} (Invited)`} />
              </ListItem>
            );
          })}
          {isOwner && !isFull && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDialog('Invite')}>
                <ListItemText sx={{ textAlign: 'center' }}>Invite User</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Card>
      <InviteDialog
        open={dialog === 'Invite'}
        closeDialog={() => setDialog('')}
        getUsers={getUsers}
        onSubmit={submitInvite}
        currentMemberEmails={members.map((member) => member.email)}
      />
      {userToRemove && (
      <ConfirmDialog
        open={dialog === 'Remove'}
        closeDialog={() => setDialog('')}
        onSubmit={() => submitRemoval(userToRemove.userId)}
        title="Remove User"
        content={`Are you sure you want to remove ${userToRemove.firstName} ${userToRemove.lastName} from your group?`}
      />
      )}
    </>
  );
};

export default ProjectBuddies;
