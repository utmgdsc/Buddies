import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import type { ProjectProfile } from '../pages/projects/[pid]';

interface Props extends ProjectProfile {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean;
  ownerId: number;
}

const ProjectBuddies: React.VFC<Props> = ({
  setSidebarOpen,
  MemberLst,
  isOwner,
  ownerId,
}) => {
  return (
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
      </List>
    </Card>
  );
};

export default ProjectBuddies;
