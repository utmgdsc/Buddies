import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';
import axios from 'axios';
import { RegisterRequest } from '../api/model/registerRequest';
import { ValidationProblemDetails } from '../api/model/validationProblemDetails';

const passwordSchema = new PasswordValidator();
/* eslint-disable newline-per-chained-call */
passwordSchema
  .has().digits(1, 'Password must contain a number.')
  .has().lowercase(1, 'Password must contain a lowercase letter.')
  .has().symbols(1, 'Password must contain a symbol.')
  .has().uppercase(1, 'Password must contain an uppercase letter.')
  .is().min(6, 'Password must be at least 6 characters long.');

interface Props {
  onSubmit: SubmitHandler<RegisterRequest>
}

const RegisterForm: React.VFC<Props> = ({ onSubmit }) => {
  const {
    handleSubmit, control, setError, formState: { isSubmitting },
  } = useForm<RegisterRequest>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const processValidationProblems = (problems: ValidationProblemDetails) => {
    if (problems.errors) {
      Object.keys(problems.errors).forEach((errorField) => {
        if (errorField === 'firstName'
            || errorField === 'lastName'
            || errorField === 'email'
            || errorField === 'password') {
          const errorMsg = problems.errors![errorField].join('\n');
          setError(errorField, { message: errorMsg });
        }
      });
    }
  };

  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onSubmit={(event: any) => handleSubmit(onSubmit)(event)
        .then() // todo: complete this once login backend is functional
        .catch((error) => {
          if (axios.isAxiosError(error) && error.response) {
            const response = error.response.data as ValidationProblemDetails;
            processValidationProblems(response);
          }
        })}
      noValidate // for consistency, we disable native validation UI for MUI validation UI
    >
      <Typography variant="h3" sx={{ marginBottom: 6 }}>Project Buddies</Typography>
      <Controller
        control={control}
        name="firstName"
        render={({ field, fieldState }) => {
          return (
            <TextField
              {...field}
              label="First Name"
              fullWidth
              sx={{ marginBottom: 2 }}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          );
        }}
        rules={{
          required: { value: true, message: 'A first name is required.' },
          minLength: { value: 2, message: 'Names must be at least 2 characters long.' },
        }}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field, fieldState }) => {
          return (
            <TextField
              {...field}
              label="Last Name"
              fullWidth
              sx={{ marginBottom: 2 }}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          );
        }}
        rules={{
          required: { value: true, message: 'A last name is required.' },
          minLength: { value: 2, message: 'Names must be at least 2 characters long.' },
        }}
      />
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => {
          return (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              sx={{ marginBottom: 2 }}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          );
        }}
        rules={{
          required: { value: true, message: 'An email is required.' },
          validate: {
            email: (value) => EmailValidator.validate(value) || 'Email is not valid.',
          },
        }}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => {
          return (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          );
        }}
        rules={{
          required: { value: true, message: 'A password is required.' },
          validate: {
            password: (value) => {
              const results = passwordSchema.validate(
                value,
                { list: true, details: true },
              ) as any[];

              if (results.length === 0) {
                return true;
              }
              const errMsgs: string[] = [];

              results.forEach((result) => {
                errMsgs.push(result.message);
              });

              return errMsgs.join('\n');
            },
          },
        }}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isSubmitting}
      >
        Register
      </LoadingButton>
    </Box>
  );
};

export default RegisterForm;
