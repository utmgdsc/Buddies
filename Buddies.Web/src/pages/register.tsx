import React from 'react';
import Box from '@mui/material/Box';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useRouter } from 'next/router';
import RegisterForm from '../components/RegisterForm';
import { RegisterRequest } from '../api/model/registerRequest';
import { ValidationProblemDetails } from '../api/model/validationProblemDetails';
import { registerUser, fetchToken } from '../api';

const Register: React.VFC = () => {
  const formMethods = useForm<RegisterRequest>({
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      await registerUser(data);
      await fetchToken();
      router.push('/').then();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response
          && error.response.status === StatusCodes.BAD_REQUEST) {
        const problems = error.response as ValidationProblemDetails;
        if (problems.errors) {
          Object.keys(problems.errors).forEach((errorField) => {
            if (errorField === 'firstName'
                || errorField === 'lastName'
                || errorField === 'email'
                || errorField === 'password') {
              const errorMsg = problems.errors![errorField].join('\n');
              formMethods.setError(errorField, { message: errorMsg });
            }
          });
        }
      }
    }
  };

  return (
    <Box sx={{
      width: 0.25, flexGrow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <RegisterForm formMethods={formMethods} onSubmit={onSubmit} />
    </Box>
  );
};

export default Register;
