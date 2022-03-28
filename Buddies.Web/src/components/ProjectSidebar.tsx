import React, { useState } from 'react';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import CloseIcon from '@mui/icons-material/Close';
import type { Tabs } from '../pages/projects/[pid]';
import ConfirmDialog from './dialogs/ConfirmDialog';

const drawerWidth = 250;

/* Sidebar of the project profile page
*/

export interface SidebarProps {
  name: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTab: React.Dispatch<React.SetStateAction<Tabs>>;
  isOwner: boolean;
  submitTerminate: () => void;
  projFinished: boolean;
}

const Sidebar: React.VFC<SidebarProps> = ({
  name,
  open,
  setOpen,
  setTab,
  isOwner,
  submitTerminate,
  projFinished,
}) => {
  const [terminateOpen, setTerminateOpen] = useState(false);

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon htmlColor="Primary" sx={{ fill: '#759be6' }} />,
      onClick: () => setTab('Dashboard'),
    },
    {
      text: 'Buddies',
      icon: <GroupIcon htmlColor="Primary" sx={{ fill: '#759be6' }} />,
      onClick: () => setTab('Buddies'),
    },
    {
      text: 'Terminate',
      icon: <CloseIcon color="error" />,
      onClick: () => setTerminateOpen(true),
    },
  ];

  const list = () => (
    <div>
      <Container>
        <Typography variant="h5" align="center" sx={{ marginTop: 2 }}>Manage Project</Typography>
      </Container>
      <Container sx={{ marginTop: 4 }}>
        <Avatar />
        <Typography sx={{ marginTop: 1 }}>{name}</Typography>
      </Container>

      <List>
        {(!isOwner || projFinished ? menuItems.filter((item) => item.text !== 'Terminate') : menuItems)
          .map((item) => (
            <ListItem>
              <Button
                variant="outlined"
                onClick={item.onClick}
                sx={{ width: '100%' }}
                color={item.text === 'Terminate' ? 'error' : 'primary'}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </Button>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <div>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        {list()}
      </Drawer>
      <ConfirmDialog
        open={terminateOpen}
        closeDialog={() => setTerminateOpen(false)}
        title="Terminate Project"
        content="Are you sure you want to terminate this project?"
        onSubmit={submitTerminate}
      />
    </div>
  );
};

export default Sidebar;
