import { NextPage } from 'next';
import Box from '@mui/material/Box';
import { SubmitHandler, useForm } from 'react-hook-form';
import CreateProjectForm from '../components/CreateProjectForm';
import { CreateProjectRequest } from '../api/model/createProjectRequest';
import {
  createProject, getCategories, getLocations, getUsers,
} from '../api';
import withAuth from '../components/hocs/withAuth';
import { authStore } from '../stores/authStore';

const CreateProject: NextPage = () => {
  const authState = authStore((state) => state.authState);

  const formMethods = useForm<CreateProjectRequest>({
    defaultValues: {
      title: '',
      description: '',
      invitedUsers: [authState!.email],
      location: '',
      category: '',
      maxMembers: 1,
    },
  });

  const onSubmit: SubmitHandler<CreateProjectRequest> = async (data) => {
    // todo: try catch error handling
    await createProject(data);
  };

  return (
    <Box sx={{
      width: 0.75, flexGrow: 1, alignSelf: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}
    >
      <CreateProjectForm
        onSubmit={onSubmit}
        formMethods={formMethods}
        getCategories={getCategories}
        getLocations={getLocations}
        getUsers={getUsers}
        authState={authState!}
      />
    </Box>
  );
};

export default withAuth(CreateProject);
