import React, { useState, useMemo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import type { RecommendedUser } from '../pages/projects/[pid]';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import { UpdateProf } from '../pages/profiles/[pid]';
import InviteDialog from './dialogs/InviteDialog';
import { SearchFunc } from '../api';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import { ProjectProfileResponse } from '../api/model/projectProfileResponse';
import { UserInfoResponse } from '../api/model/userInfoResponse';
import ConfirmDialog from './dialogs/ConfirmDialog';
import { authStore } from '../stores/authStore';
import RateDialog from './dialogs/RateDialog';
import { RateBuddiesRequest } from '../api/model/rateBuddiesRequest';

interface Props extends ProjectProfileResponse {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  getUsers: SearchFunc;
  submitInvite: (req: InviteUserRequest) => void;
  submitRemoval: (userId: number) => void;
  isFull: boolean;
  recommendations: RecommendedUser[];
  submitRatings: (req: RateBuddiesRequest) => void;
}

export type Dialogs = '' | 'Invite' | 'Remove' | 'Rate';

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
  recommendations,
  isFinished,
  membersYetToRate,
  submitRatings,
}) => {
  const [dialog, setDialog] = useState<Dialogs>('');

  const [userToRemove, setUserToRemove] = useState<UserInfoResponse | null>(null);

  const authState = authStore((state) => state.authState)!;

  const rated = useMemo(() => {
    return !membersYetToRate.find((member) => member.email === authState.email);
  }, [membersYetToRate, authState]);

  return (
    <>
      <Card elevation={10} sx={{ mt: 6 }}>
        <CardContent>
          <Stack direction="row">
            <Typography variant="h4">
              Project Members
            </Typography>
            <Button
              onClick={() => setSidebarOpen((prevState) => !prevState)}
              sx={{ marginRight: 'auto' }}
            >
              <SettingsIcon />
            </Button>
            {isOwner && !isFull && !isFinished && (
              <Button onClick={() => setDialog('Invite')} variant="outlined">
                Invite User
              </Button>
            )}
            {isFinished && (
              <Button
                onClick={() => setDialog('Rate')}
                variant="outlined"
                disabled={rated}
              >
                {rated ? 'Already Rated' : 'Rate Members'}
              </Button>
            )}
          </Stack>
        </CardContent>
        <List>
          {members.map((member) => {
            return (
              <ListItem>
                <ListItemText primary={`${member.firstName} ${member.lastName}`} />
                {isOwner && member.email !== ownerEmail && !isFinished
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
        </List>
      </Card>
      <Card elevation={10} sx={{ mt: 6, paddingBottom: 3 }}>
        <CardContent>
          <Stack direction="row">
            <Typography variant="h5">
              Top Recommended Users
            </Typography>
          </Stack>
        </CardContent>
        <Container>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant="h6">
                Users
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                Skills
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                Recommendation Score
              </Typography>
            </Grid>
          </Grid>
        </Container>
        {recommendations.map((user: RecommendedUser) => {
            return ( 
              <Container sx={{margin: 1}} key={user.userId}>
                <CardActionArea href={`/Profiles/${user.userId}`}>
                  <Grid container>
                    <Grid item xs={4}>
                      <Grid container>
                        <Avatar />
                        <Typography variant="body1" sx={{ marginTop: 1, marginLeft: 1 }}>
                            {user.email}
                        </Typography>
                        <Button
                        variant="contained"
                        style={{
                          color: 'white',
                          backgroundColor: 'green',
                          maxWidth: '25px',
                          maxHeight: '25px',
                          minWidth: '25px',
                          minHeight: '25px',
                          marginLeft: 5,
                          marginTop: 5,
                        }}
                        >
                        {user.buddyScore}
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={3}>
                      <div className="skills">
                          {' '}
                          {/* We have another list that is being rendered in the skilllist
                          component. So to make the keys different for this list,
                          we can just add one to each id.  */}
                          
                            <Typography variant="body1" noWrap gutterBottom sx={{ marginTop: 1}}> 
                              {user.skills.map((skill) => {return <>{skill.name}, </>})}
                            </Typography>
                      
                        </div>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={4} sx={{color: 'green', marginTop: 1}}>
                      {user.match}
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Container>
            );})}
        
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
      <RateDialog
        open={dialog === 'Rate'}
        closeDialog={() => setDialog('')}
        onSubmit={submitRatings}
        peers={members.filter((member) => member.email !== authState.email)}
      />
    </>
  );
};

export default ProjectBuddies;
