﻿import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { AuthState } from '../contexts/authContext';

interface Props {
  authState: AuthState
  logout: () => void
}

const AccountTab: React.VFC<Props> = ({ authState, logout }) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  return (
    <>
      <Button
        onClick={(e) => setAnchorElement(e.currentTarget)}
        endIcon={<AccountCircle />}
        color="inherit"
      >
        {`${authState.given_name} ${authState.family_name}`}
      </Button>
      <Menu
        open={!!anchorElement}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(null)}
      >
        <MenuItem onClick={logout}>
          Logout
        </MenuItem>
      </Menu>
    </>

  );
};

export default AccountTab;
