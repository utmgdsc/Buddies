import React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';
import * as EmailValidator from 'email-validator';
import { LoginRequest } from '../api/model/loginRequest';

interface Props {
  /**
     * Method to execute upon submission of form.
     */
  onSubmit: SubmitHandler<LoginRequest>
  /**
     * React Hook Forms context.
     */
  formMethods: UseFormReturn<LoginRequest>
}

/**
 * Register form component.
 */
const LoginForm: React.VFC<Props> = ({
  onSubmit,
  formMethods: { handleSubmit, control, formState: { isSubmitting } },
}) => {
  return (
    <Box
      component="form"
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Typography variant="h3" sx={{ marginBottom: 6 }}>Project Buddies</Typography>
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
              FormHelperTextProps={{
                sx: { whiteSpace: 'pre-wrap' },
              }}
            />
          );
        }}
        rules={{
          required: { value: true, message: 'A password is required.' },
        }}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Box>
  );
};

export default LoginForm;
