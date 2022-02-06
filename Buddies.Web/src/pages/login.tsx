import React from 'react';
import Box from '@mui/material/Box';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useRouter } from 'next/router';
import { LoginRequest } from '../api/model/loginRequest';
import { loginUser, fetchToken } from '../api';
import LoginForm from '../components/LoginForm';

const Login: React.VFC = () => {
  const formMethods = useForm<LoginRequest>({
    defaultValues: {
      password: '',
      email: '',
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      await loginUser(data);
      await fetchToken();
      router.push('/').then();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === StatusCodes.UNAUTHORIZED) {
        formMethods.setError('email', { message: 'Email or password incorrect.' });
        formMethods.setError('password', { message: 'Email or password incorrect.' });
      }
    }
  };

  return (
    <Box sx={{
      width: 0.25, flexGrow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <LoginForm formMethods={formMethods} onSubmit={onSubmit} />
    </Box>
  );
};

export default Login;
