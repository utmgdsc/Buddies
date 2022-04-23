import React, { useState } from 'react';
import { Card, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import GroupIcon from '@mui/icons-material/Group';
import CategorySharpIcon from '@mui/icons-material/CategorySharp';
import Avatar from '@mui/material/Avatar';
import CardActionArea from '@mui/material/CardActionArea';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import InviteDialog from './dialogs/InviteDialog';
import { SearchFunc } from '../api';
import { InviteUserRequest } from '../api/model/inviteUserRequest';
import { ProjectProfileResponse } from '../api/model/projectProfileResponse';

interface Props extends ProjectProfileResponse {
  inGroup: boolean;
  isInvited: boolean;
  isFull: boolean;
  isOwner: boolean;
  addMemberToProject: () => Promise<void>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getUsers: SearchFunc;
  submitInvite: (req: InviteUserRequest) => void;
}

/* Displays all the necessary information for the project profile page
*/
const ProjectDashboard: React.VFC<Props> = ({
  title,
  username: owner,
  email: ownerEmail,
  description,
  location,
  maxMembers,
  members,
  category,
  inGroup,
  isInvited,
  isFull,
  addMemberToProject,
  setSidebarOpen,
  getUsers,
  submitInvite,
  isFinished,
  isOwner,
}) => {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <Grid container justifyContent="center" marginTop={3} spacing={3}>
        <Grid item xs={8}>
          <Card elevation={10} sx={{ height: 100 }}>
            <Container sx={{ display: 'flex' }}>
              <Typography variant="h4">
                {title}
              </Typography>
              {inGroup && (
              <Button onClick={() => setSidebarOpen((prevState) => !prevState)}>
                {' '}
                <SettingsIcon />
                {' '}
              </Button>
              )}
            </Container>

            <div style={{ display: 'flex', marginTop: 25, marginLeft: 22 }}>
              <LocationOnSharpIcon />
              <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                {location}
              </Typography>
              <CategorySharpIcon />
              <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                {category}
              </Typography>
              <GroupIcon />
              <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                {members.length}
                /
                {maxMembers}
              </Typography>
            </div>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card elevation={10} sx={{ height: 100 }}>
            <Avatar sx={{ margin: 'auto', marginTop: 1 }} />
            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2} align="center">
              {owner}
            </Typography>
            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2} align="center">
              {ownerEmail}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container justifyContent="center" marginTop={3} spacing={3}>
        <Grid item xs={10}>
          <Card elevation={10} sx={{ height: 300 }}>
            <Container sx={{ display: 'flex' }}>
              <Typography variant="h4">
                Description
              </Typography>
            </Container>

            <Container sx={{ maxHeight: 200, overflow: 'auto', marginTop: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ wordWrap: 'break-word' }}>
                {description}
              </Typography>
            </Container>

          </Card>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" marginTop={2} spacing={3} marginBottom={5}>
        <Grid item xs={10}>
          <Card elevation={10}>
            <Grid container p={1} spacing={2} justifyContent="center">
              {members.map((member) => {
                return (
                  <Grid item xs={2}>
                    <Card sx={{ border: 1, height: 80 }}>
                      <CardActionArea href={`../Profiles/${member.userId}`}>
                        <Avatar sx={{ margin: 'auto', marginTop: 1 }} />
                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                          {`${member.firstName} ${member.lastName}`}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
              {!isFull && !isFinished && isOwner
                  && (
                  <Grid item xs={2}>
                    <Card sx={{ border: 1, height: 80 }}>
                      <CardActionArea onClick={() => setInviteOpen(true)}>
                        <AddIcon sx={{ marginLeft: '40%', marginTop: 1, cursor: 'pointer' }} />
                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                          Invite More Users
                        </Typography>
                      </CardActionArea>

                    </Card>
                  </Grid>
                  )}
              {isInvited && !inGroup && !isFull && !isFinished
                  && (
                  <Grid item xs={2}>
                    <Card sx={{ border: 1, height: 80 }}>
                      <CardActionArea onClick={addMemberToProject}>
                        <AddIcon sx={{ marginLeft: '40%', marginTop: 1, cursor: 'pointer' }} />
                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                          Join Project
                        </Typography>
                      </CardActionArea>

                    </Card>
                  </Grid>
                  )}

              {!isInvited && !inGroup && !isFull && !isFinished
                  && (
                  <Grid item xs={2}>
                    <Card sx={{ border: 1, height: 80 }}>
                      <CardActionArea>
                        <EmailIcon sx={{ marginLeft: '40%', marginTop: 1, cursor: 'pointer' }} />
                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                          Request to Join
                        </Typography>
                      </CardActionArea>

                    </Card>
                  </Grid>
                  )}
            </Grid>
          </Card>
        </Grid>
      </Grid>
      <InviteDialog
        open={inviteOpen}
        closeDialog={() => setInviteOpen(false)}
        getUsers={getUsers}
        onSubmit={submitInvite}
        currentMemberEmails={members.map((user) => user.email)}
      />
    </>
  );
};

export default ProjectDashboard;
