import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AccountTab from './AccountTab';
import { logoutUser } from '../api';
import { authStore } from '../stores/authStore';
import NotificationBell from './NotificationBell';

const Navbar: React.VFC = () => {
  const authState = authStore((state) => state.authState);

  const router = useRouter();

  return (
    <AppBar position="static">
      <Toolbar variant="dense">
        <NextLink href="/" passHref>
          {// known issue: https://github.com/vercel/next.js/discussions/32233
              /* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <Link color="inherit" variant="h6" underline="none">Project Buddies</Link>
        </NextLink>
        <Tabs value={router.pathname} sx={{ paddingLeft: 3 }}>
          {authState && (
            // needed to inject value prop to NextLink
            // @ts-ignore
            <NextLink href="/create-project" passHref value="/create-project">
              <Tab label="Create Project" />
            </NextLink>
          )}
        </Tabs>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginLeft: 'auto' }}
        >
          {authState ? (
            <>
              <NextLink href="/notifications" passHref>
                <Button color="inherit" sx={{ marginLeft: 'auto' }}><NotificationBell /></Button>
              </NextLink>
              <AccountTab
                authState={authState}
                logout={() => {
                  router.push('/').then(() => logoutUser());
                }}
                profile={() => {
                  router.push(`/Profiles/${parseInt(authState.nameid, 10)}`).then(() => router.reload());
                }}
              />
            </>
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
