import { NextPage } from 'next';
import Box from '@mui/material/Box';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import CreateProjectForm from '../components/CreateProjectForm';
import { CreateProjectRequest } from '../api/model/createProjectRequest';
import { createProject } from '../api';

const CreateProject: NextPage = () => {
  const formMethods = useForm<CreateProjectRequest>({
    defaultValues: {
      title: '',
      description: '',
      invitedUsers: [],
      location: '',
    },
  });

  const onSubmit: SubmitHandler<CreateProjectRequest> = async (data) => {
    // todo: try catch error handling
    await createProject(data);
  };

  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    // todo: replace placeholder data
    setLocations(['Temp 1', 'Temp 2', 'Temp 3']);
  }, []);

  return (
    <Box sx={{
      width: 0.75, flexGrow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <CreateProjectForm onSubmit={onSubmit} formMethods={formMethods} locations={locations} />
    </Box>
  );
};

export default CreateProject;
