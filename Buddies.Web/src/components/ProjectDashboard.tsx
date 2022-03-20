import React from 'react';
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
import type { ProjectProfile } from '../pages/projects/[pid]';

interface Props extends ProjectProfile {
  inGroup: boolean;
  authentication: boolean | null;
  isInvited: boolean;
  isFull: boolean;
  addMemberToProject: () => Promise<void>;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* Displays all the neccessary information for the project profile page
*/
const ProjectDashboard: React.VFC<Props> = ({
  Title,
  ProjectOwner,
  Description,
  ProjectOwnerEmail,
  Location,
  MaxMembers,
  MemberLst,
  Category,
  inGroup,
  authentication,
  isInvited,
  isFull,
  addMemberToProject,
  setSidebarOpen,
}) => {
  return (
    <>
      <Grid container justifyContent="center" marginTop={3} spacing={3}>
        <Grid item xs={8}>
          <Card elevation={10} sx={{ height: 100 }}>
            <Container sx={{ display: 'flex' }}>
              <Typography variant="h4">
                {Title}
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
                {Location}
              </Typography>
              <CategorySharpIcon />
              <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                {Category}
              </Typography>
              <GroupIcon />
              <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                {MemberLst.length}
                /
                {MaxMembers}
              </Typography>
            </div>
          </Card>
        </Grid>
        <Grid item xs={2}>
          <Card elevation={10} sx={{ height: 100 }}>
            <Avatar sx={{ margin: 'auto', marginTop: 1 }} />
            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2} align="center">
              {ProjectOwner}
            </Typography>
            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2} align="center">
              {ProjectOwnerEmail}
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
                {Description}
              </Typography>
            </Container>

          </Card>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" marginTop={2} spacing={3} marginBottom={5}>
        <Grid item xs={10}>
          <Card elevation={10}>
            <Grid container p={1} spacing={2} justifyContent="center">
              {MemberLst.map((member) => {
                return (
                  <Grid item xs={2}>
                    <Card sx={{ border: 1, height: 80 }}>
                      <CardActionArea href={`../Profiles/${member.UserId}`}>
                        <Avatar sx={{ margin: 'auto', marginTop: 1 }} />
                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                          {`${member.FirstName} ${member.LastName}`}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
              {authentication && !isFull
                  && (
                  <Grid item xs={2}>
                    <Card sx={{ border: 1, height: 80 }}>
                      <CardActionArea>
                        <AddIcon sx={{ marginLeft: '40%', marginTop: 1, cursor: 'pointer' }} />
                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                          Invite More Users
                        </Typography>
                      </CardActionArea>

                    </Card>
                  </Grid>
                  )}
              {!authentication && isInvited && !inGroup && !isFull
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

              {!authentication && !isInvited && !inGroup && !isFull && authentication != null
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
    </>
  );
};

export default ProjectDashboard;
