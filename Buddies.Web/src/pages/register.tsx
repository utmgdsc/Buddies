import React from 'react';
import Box from '@mui/material/Box';
import { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import RegisterForm from '../components/RegisterForm';
import { RegisterRequest } from '../api/model/registerRequest';

const Register: React.VFC = () => {
  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    await axios.post('/api/v1/users/register', data);
  };

  return (
    <Box sx={{
      width: 0.25, flexGrow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <RegisterForm onSubmit={onSubmit} />
    </Box>
  );
};

export default Register;
