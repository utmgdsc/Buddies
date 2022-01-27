import React from 'react';
import Box from '@mui/material/Box';
import RegisterForm from '../components/RegisterForm';

const Register: React.VFC = () => {
  return (
    <Box sx={{
      width: 0.25, flexGrow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <RegisterForm />
    </Box>
  );
};

export default Register;
