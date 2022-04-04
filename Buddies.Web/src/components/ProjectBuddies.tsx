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
import type { ProjectProfile, RecommendedUser, UserInfo } from '../pages/projects/[pid]';
import InviteDialog from './InviteDialog';
import { SearchFunc } from '../api';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import RemoveDialog from './RemoveDialog';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import CardActionArea from '@mui/material/CardActionArea';
import { UpdateProf } from '../pages/profiles/[pid]';

interface Props extends ProjectProfile {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  ownerId: number;
  getUsers: SearchFunc;
  submitInvite: (req: InviteUserRequest) => void;
  submitRemoval: (userId: number) => void;
  isFull: boolean;
  recommendations: RecommendedUser[];
}

export type Dialogs = '' | 'Invite' | 'Remove';

let data: UpdateProf[] = [];
for (let i = 0; i < 5; i += 1) {
  data.push({
  'firstName': 'man@gmail.com',
  'lastName': 'Ali',
  'userId': 1,
  'headline': 'bob',
  'aboutMe': 'job',
  'skills': [{ id: 1, name: 'Data Structures', delete: false },
  { id: 2, name: 'C++', delete: false }, { id: 3, name: 'Python', delete: false }],
  'projects': []
  });
}

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
  recommendations
}) => {
  const [dialog, setDialog] = useState<Dialogs>('');

  const [userToRemove, setUserToRemove] = useState<UserInfo | null>(null);

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
                      setUserToRemove(user);
                      setDialog('Remove');
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
              <ListItemButton onClick={() => setDialog('Invite')}>
                <ListItemText sx={{ textAlign: 'center' }}>Invite User</ListItemText>
              </ListItemButton>
            </ListItem>
          )}
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
        {recommendations.map((user) => {
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
        currentMemberEmails={MemberLst.map((user) => user.Email)}
      />
      {userToRemove && (
      <RemoveDialog
        open={dialog === 'Remove'}
        closeDialog={() => setDialog('')}
        onSubmit={() => submitRemoval(userToRemove.UserId)}
        name={`${userToRemove.FirstName} ${userToRemove.LastName}`}
      />
      )}
    </>
  );
};

export default ProjectBuddies;
