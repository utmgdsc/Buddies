import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { AuthState } from '../stores/authStore';

interface Props {
  /**
   * Authentication info from global state.
   */
  authState: AuthState
  /**
   * Function to execute in order to logout.
   */
  logout: () => void
  /**
   * Function to execute in order to view profile.
   */
  profile: () => void
}

/**
 * Account tab component containing menus for logout etc.
 */
const AccountTab: React.VFC<Props> = ({ authState, logout, profile }) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <>
      <Button
        onClick={(e) => setAnchorElement(e.currentTarget)}
        endIcon={<AccountCircle />} // when profile pictures are implemented, include here
        color="inherit"
      >
        {`${authState.given_name} ${authState.family_name}`}
      </Button>
      <Menu
        open={!!anchorElement}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(null)}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={profile}>
          Profile
        </MenuItem>

        <MenuItem onClick={logout}>
          Logout
        </MenuItem>
      </Menu>
    </>

  );
};

export default AccountTab;
