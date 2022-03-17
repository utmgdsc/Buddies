import React from 'react';
import { ListItemIcon, ListItemText, Typography } from '@mui/material';
import Container from '@material-ui/core/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 250;

/* Sidebar of the project profile page
*/

const Sidebar = ({name}:{name: string}) => {
  const [state, setState] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setState(open);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon htmlColor="Primary" sx={{ fill: '#759be6' }} />,
      path: '/',
    },
    {
      text: 'Buddies',
      icon: <GroupIcon htmlColor="Primary" sx={{ fill: '#759be6' }} />,
      path: '/create',
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
        {menuItems.map((item) => (
          <ListItem>
            <Button variant="outlined" href={item.path} sx={{ width: '100%' }}>
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
      <Button onClick={toggleDrawer(true)}>
        {' '}
        <SettingsIcon />
        {' '}
      </Button>
      <Drawer
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        anchor="left"
        open={state}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default Sidebar;
