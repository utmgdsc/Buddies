import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import AccountTab from './AccountTab';
import { logoutUser } from '../api';
import { authStore } from '../stores/authStore';

const Navbar: React.VFC = () => {
  const authState = authStore((state) => state.authState);

  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar>
        <NextLink href="/" passHref>
          {// known issue: https://github.com/vercel/next.js/discussions/32233
              /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link color="inherit" variant="h6" underline="none">Project Buddies</Link>
        </NextLink>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginLeft: 'auto' }}
        >
          {authState ? (
            <AccountTab
              authState={authState}
              logout={() => {
                logoutUser().then(() => router.push('/'));
              }}
            />
          )
            : (
              <>
                <NextLink href="/register" passHref>
                  <Button color="inherit" sx={{ marginLeft: 'auto' }}>Register</Button>
                </NextLink>
                <NextLink href="/login" passHref>
                  <Button color="inherit" sx={{ marginLeft: 1 }}>Login</Button>
                </NextLink>
              </>
            )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
