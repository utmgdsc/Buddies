import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const RegisterForm: React.VFC = () => {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" sx={{ marginBottom: 6 }}>Project Buddies</Typography>
      <TextField label="First Name" fullWidth sx={{ marginBottom: 2 }} />
      <TextField label="Last Name" fullWidth sx={{ marginBottom: 2 }} />
      <TextField label="Email" fullWidth sx={{ marginBottom: 2 }} />
      <TextField label="Password" type="password" fullWidth />
      <Button type="submit" variant="contained" sx={{ marginTop: 4 }}>Register</Button>
    </Box>
  );
};

export default RegisterForm;
