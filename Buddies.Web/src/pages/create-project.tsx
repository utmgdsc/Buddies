import { NextPage } from 'next';
import Box from '@mui/material/Box';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { useRouter } from 'next/router';
import CreateProjectForm from '../components/CreateProjectForm';
import { CreateProjectRequest } from '../api/model/createProjectRequest';
import {
  createProject, getCategories, getLocations, getUsers,
} from '../api';
import withAuth from '../components/hocs/withAuth';
import { authStore } from '../stores/authStore';
import { ValidationProblemDetails } from '../api/model/validationProblemDetails';

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

  const router = useRouter();

  const onSubmit: SubmitHandler<CreateProjectRequest> = async (data) => {
    try {
      const res = await createProject(data);
      router.push(`/projects/${res.data}`).then();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response
          && error.response.status === StatusCodes.BAD_REQUEST) {
        const problems = error.response as ValidationProblemDetails;
        if (problems.errors) {
          Object.keys(problems.errors).forEach((errorField) => {
            if (['title', 'description', 'invitedUsers', 'location', 'category', 'maxMembers'].includes(errorField)) {
              const errorMsg = problems.errors![errorField].join('\n');
              formMethods.setError(errorField as keyof CreateProjectRequest, { message: errorMsg });
            }
          });
        }
      }
    }
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
