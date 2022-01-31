import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import NextLink from 'next/link';

/**
 * Navbar component.
 */
const Navbar: React.VFC = () => (
  <AppBar position="static" style={{ background: 'black' }}>
    <Toolbar>
      <NextLink href="/" passHref>
        {// known issue: https://github.com/vercel/next.js/discussions/32233
        /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link color="inherit" variant="h6" underline="none">Project Buddies</Link>
      </NextLink>
      
    </Toolbar>
  </AppBar>
);

export default Navbar;