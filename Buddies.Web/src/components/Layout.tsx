import Box from '@mui/material/Box';
import React from 'react';
import Navbar from './Navbar';

const Layout: React.FC = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
    <Navbar />
    {children}
  </Box>
);

export default Layout;
