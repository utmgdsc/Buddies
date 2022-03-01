import React from 'react';
import { SubmitHandler, UseFormReturn, Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import { CreateProjectRequest } from '../api/model/createProjectRequest';
import {FormHelperText} from "@mui/material";

// for location autocomplete if necessary
// import Autocomplete from "@mui/material/Autocomplete";

interface Props {
  /**
     * Method to execute upon submission of form.
     */
  onSubmit: SubmitHandler<CreateProjectRequest>
  /**
     * React Hook Forms context.
     */
  formMethods: UseFormReturn<CreateProjectRequest>
  /**
   * List of "valid" locations.
   */
  locations: string[]
}

const CreateProjectForm: React.VFC<Props> = ({
  onSubmit,
  formMethods: { handleSubmit, control, formState: { isSubmitting } },
  locations,
}) => {
  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      spacing={2}
    >
      <Grid item xs={6}>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => {
            return (
              <TextField
                {...field}
                label="Title"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            );
          }}
          rules={{
            required: { value: true, message: 'A title is required.' },
            maxLength: { value: 50, message: 'Title must be less than or equal to 50 characters.' },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="location"
          render={({ field, fieldState }) => {
            return (
              <FormControl fullWidth error={fieldState.invalid}>
                <InputLabel id="select-location">Location</InputLabel>
                <Select
                  {...field}
                  labelId="select-location"
                  label="Location"
                >
                  {locations.map((value) => {
                    return <MenuItem value={value}>{value}</MenuItem>;
                  })}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            );
          }}
          rules={{
            required: { value: true, message: 'A location is required.' },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="invitedUsers"
          render={({ field, fieldState }) => {
            return (
              <TextField
                {...field}
                label="Buddies"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => {
            return (
              <TextField
                {...field}
                label="Description"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                multiline
                minRows={5}
              />
            );
          }}
          rules={{
            required: { value: true, message: 'A description is required.' },
            maxLength: { value: 1000, message: 'Description must be less than or equal to 1000 characters.' },
          }}
        />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Create Project
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default CreateProjectForm;
