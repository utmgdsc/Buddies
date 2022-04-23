import React, { useEffect, useMemo, useState } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { authStore } from '../../stores/authStore';
import ProjectDashboard from '../../components/ProjectDashboard';
import {
  getProject, addMember, getUsers, inviteMember, removeMember,
  terminateProject, rateMembers, joinRequest,
} from '../../api';
import ProjectBuddies from '../../components/ProjectBuddies';
import Sidebar from '../../components/ProjectSidebar';
import { InviteUserRequest } from '../../api/model/inviteUserRequest';
import { ProjectProfileResponse } from '../../api/model/projectProfileResponse';
import { RateBuddiesRequest } from '../../api/model/rateBuddiesRequest';

export type Tabs = 'Dashboard' | 'Buddies';

/* Project profile page. Responsible for putting all the components that make up the
  page together. It also sends GET requests to get a project by its id. And a
  PUT request, to let invited users join the project.
*/
const Project: React.VFC = () => {
  const [projectId, setProjectId] = useState<string>();
  const [project, setProject] = useState<ProjectProfileResponse>();
  const authState = authStore((state) => state.authState);
  const router = useRouter();

  /* Gets project by id and then creates necessary global data structures.
     (memberLst, invitedLst, project object)
  */
  function getAndMakeProject() {
    if (!(typeof projectId === 'string')) {
      alert('Uh oh, something went wrong...');
      return;
    }
    getProject(projectId).then((res) => {
      setProject(res.data);
    }).catch(() => {
      alert('Uh oh, something went wrong...');
    });
  }

  useEffect(() => {
    if (!router.isReady) return;
    const { pid } = router.query;
    setProjectId(pid as string);
  }, [router.isReady]);

  useEffect(() => {
    if (projectId) getAndMakeProject();
  }, [projectId]);

  const addMemberToProject = async () => {

    if (!(typeof projectId === 'string') || !authState) {
      alert('Uh oh, something went wrong...');
      return;
    }
    const res = await addMember(projectId, parseInt(authState.nameid, 10))
      .catch(() => alert('Uh oh, something went wrong...'));

    if (res) {
      getAndMakeProject();
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const displayErrorNotif = (err: any) => {
    if (axios.isAxiosError(err) && err.response) {
      enqueueSnackbar(err.response.data, { variant: 'error' });
    } else {
      enqueueSnackbar(err, { variant: 'error' });
    }
  };

  const submitInvite = (req: InviteUserRequest) => {
    inviteMember(projectId!, req)
      .then(() => {
        getAndMakeProject();
        enqueueSnackbar('User invited.', { variant: 'success' });
      })
      .catch((err) => displayErrorNotif(err));
  };

  const submitRemoval = (userId: number) => {
    removeMember(projectId!, userId)
      .then(() => {
        getAndMakeProject();
        enqueueSnackbar('User removed.', { variant: 'success' });
      })
      .catch((err) => displayErrorNotif(err));
  };

  const submitTerminate = () => {
    terminateProject(projectId!)
      .then(() => {
        getAndMakeProject();
        enqueueSnackbar('Project terminated.', { variant: 'success' });
      })
      .catch((err) => displayErrorNotif(err));
  };

  const submitRatings = (req: RateBuddiesRequest) => {
    rateMembers(projectId!, req)
      .then(() => {
        getAndMakeProject();
        enqueueSnackbar('Members rated.', { variant: 'success' });
      })
      .catch((err) => displayErrorNotif(err));
  };

  const requestToJoin = async () => {
    if (!(typeof projectId === 'string')) {
      alert('Uh oh, something went wrong...');
      return;
    }
    const res = await joinRequest(projectId)
      .catch(() => alert('Uh oh, something went wrong...'));

    if (res) {
      getAndMakeProject();
    }
  };

  const [tab, setTab] = useState<Tabs>('Dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const inGroup = useMemo(() => {
    return !!project?.members.find((member) => member.userId.toString() === authState?.nameid);
  }, [project, authState]);

  const isInvited = useMemo(() => {
    return !!project?.invitedUsers.find((member) => member.userId.toString() === authState?.nameid);
  }, [project, authState]);

  const isOwner = useMemo(() => project?.email === authState?.email, [project, authState]);

  const isFull = useMemo(() => project?.members.length === project?.maxMembers, [project]);

  const getTabComponent = () => {
    switch (tab) {
      case 'Dashboard':
        return (
          <ProjectDashboard
            inGroup={inGroup}
            {...project!}
            isInvited={isInvited}
            isFull={isFull}
            addMemberToProject={addMemberToProject}
            setSidebarOpen={setSidebarOpen}
            getUsers={getUsers}
            submitInvite={submitInvite}
            requestToJoin={requestToJoin}
            isOwner={isOwner}
          />
        );
      case 'Buddies':
        return (
          <ProjectBuddies
            {...project!}
            setSidebarOpen={setSidebarOpen}
            isOwner={isOwner}
            getUsers={getUsers}
            submitInvite={submitInvite}
            submitRemoval={submitRemoval}
            isFull={isFull}
            submitRatings={submitRatings}
          />
        );
      default:
        return 'Error';
    }
  };

  return (
    <Container>
      {project ? (
        <>
          <Sidebar
            name={project.username}
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            setTab={setTab}
            isOwner={isOwner}
            submitTerminate={submitTerminate}
            projFinished={project.isFinished}
          />
          {getTabComponent()}
        </>
      ) : <CircularProgress />}
    </Container>
  );
};

export default Project;
