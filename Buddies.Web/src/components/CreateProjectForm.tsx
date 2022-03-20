import React, { useEffect, useState } from 'react';
import { SubmitHandler, UseFormReturn, Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import { CreateProjectRequest } from '../api/model/createProjectRequest';
import { AuthState } from '../stores/authStore';
import { makeThrottledSearch } from '../api/utils';
import { SearchFunc } from '../api';
import { scrollHandler } from './utils';

const count = 10;

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
   * Function for getting more categories.
   */
  getCategories: SearchFunc
  /**
   * Function for getting more locations.
   */
  getLocations: SearchFunc
  /**
   * Function for getting more users.
   */
  getUsers: SearchFunc
  authState: AuthState
}

const CreateProjectForm: React.VFC<Props> = ({
  onSubmit,
  formMethods: { handleSubmit, control, formState: { isSubmitting } },
  getCategories,
  getLocations,
  getUsers,
  authState,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState('');

  const [locations, setLocations] = useState<string[]>([]);
  const [locationSearch, setLocationSearch] = useState('');

  const [users, setUsers] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState('');

  const [nextCategoriesPage, setNextCategoriesPage] = useState(1);
  const [nextLocationsPage, setNextLocationsPage] = useState(1);
  const [nextUsersPage, setNextUsersPage] = useState(1);

  const getMoreCategories = makeThrottledSearch(getCategories, setCategories, count);
  const getMoreLocations = makeThrottledSearch(getLocations, setLocations, count);
  const getMoreUsers = makeThrottledSearch(getUsers, setUsers, count);

  useEffect(() => {
    setNextCategoriesPage(1);
    if (categorySearch !== '') {
      getMoreCategories(categorySearch, nextCategoriesPage);
      setNextCategoriesPage((prevState) => prevState + 1);
    } else {
      setCategories([]);
    }
  }, [categorySearch]);

  useEffect(() => {
    setNextLocationsPage(1);
    if (locationSearch !== '') {
      getMoreLocations(locationSearch, nextLocationsPage);
      setNextLocationsPage((prevState) => prevState + 1);
    } else {
      setLocations([]);
    }
  }, [locationSearch]);

  useEffect(() => {
    setNextUsersPage(1);
    if (userSearch !== '') {
      getMoreUsers(userSearch, nextUsersPage);
      setNextUsersPage((prevState) => prevState + 1);
    } else {
      setUsers([]);
    }
  }, [userSearch]);

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
          name="maxMembers"
          render={({ field, fieldState }) => {
            return (
              <TextField
                {...field}
                label="Max Members"
                fullWidth
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                type="number"
              />
            );
          }}
          rules={{
            required: { value: true, message: 'A member limit is required.' },
            min: { value: 2, message: 'Member limit must be greater than or equal to 2.' },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="category"
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                options={categories}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="Category"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                    />
                  );
                }}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                onInputChange={(_, value) => setCategorySearch(value)}
                ListboxProps={{
                  onScroll: (e) => scrollHandler(e, () => {
                    if (categorySearch !== '') {
                      getMoreCategories(categorySearch, nextCategoriesPage);
                      setNextCategoriesPage((prevState) => prevState + 1);
                    }
                  }),
                  role: 'list-box',
                }}
              />
            );
          }}
          rules={{
            required: { value: true, message: 'A category is required.' },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="location"
          render={({ field, fieldState }) => {
            return (
              <Autocomplete
                options={locations}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="Location"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                    />
                  );
                }}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                onInputChange={(_, value) => setLocationSearch(value)}
                ListboxProps={{
                  onScroll: (e) => scrollHandler(e, () => {
                    if (locationSearch !== '') {
                      getMoreLocations(locationSearch, nextLocationsPage);
                      setNextLocationsPage(nextLocationsPage + 1);
                    }
                  }),
                  role: 'list-box',
                }}
              />
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
              <Autocomplete
                multiple
                filterSelectedOptions
                options={users}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label="Buddies"
                      error={fieldState.invalid}
                      helperText={fieldState.error?.message}
                    />
                  );
                }}
                value={field.value}
                onChange={(_, value) => {
                  field.onChange(
                    [authState.email].concat(value.filter((email) => email !== authState.email)),
                  );
                }}
                onInputChange={(_, value) => setUserSearch(value)}
                renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => {
                  return (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      disabled={option === authState.email}
                    />
                  );
                })}
                ListboxProps={{
                  onScroll: (e) => scrollHandler(e, () => {
                    if (userSearch !== '') {
                      getMoreUsers(userSearch, nextUsersPage);
                      setNextUsersPage((prevState) => prevState + 1);
                    }
                  }),
                  role: 'list-box',
                }}
              />
            );
          }}
          rules={{
            required: { value: true, message: 'A list of invited users is required.' },
            minLength: { value: 1, message: 'A project must have at least 1 member.' },
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
