import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { authStore } from '../../stores/authStore';
import ProjectDashboard from '../../components/ProjectDashboard';
import {
  getProject, addMember, getUsers, inviteMember, removeMember, updateProjectSkills
} from '../../api';
import ProjectBuddies from '../../components/ProjectBuddies';
import Sidebar from '../../components/ProjectSidebar';
import { InviteUserRequest } from '../../api/model/inviteUserRequest';
import { Skillobject } from '../profiles/[pid]';

export type UserInfo = {
  FirstName: string,
  LastName: string,
  UserId: number,
  Email: string,
};

export type ProjectProfile = {
  Title: string,
  Description: string,
  Location: string,
  ProjectOwner: string,
  ProjectOwnerEmail: string,
  MaxMembers: number
  Category: string,
  MemberLst: UserInfo[],
  skills: Skillobject[],
  InvitedLst: UserInfo[]
};

export type Tabs = 'Dashboard' | 'Buddies';

const memberLst: UserInfo[] = [{
  FirstName: 'John',
  LastName: 'Doe',
  UserId: -1,
  Email: 'test@test.com',
}];
const SkillLst: Skillobject[] = [];
// default project that loads when project id is not found
const defaultProject: ProjectProfile = {
  Title: 'Not Found',
  Description: 'This error means the project that you are searching for was not found. There are many causes for this. First, check if the url is correct. Second, if the url is correct, it means the project owner has most likely deleted his account!',
  Location: 'Unknown',
  ProjectOwner: 'D.N.E',
  ProjectOwnerEmail: 'D.N.E',
  MaxMembers: 1,
  Category: 'Not Found',
  MemberLst: memberLst,
  skills: SkillLst,
  InvitedLst: [],
};

let projectId: string | string[] | undefined = '';
let currId: number; // id of the user viewing the page
const invitedIds: number[] = []; // list of userId's in the invited list
const memberIds: number[] = []; // list of userId's in the member list
let ownerId: number; // Id of the owner of the project

/* Project profile page. Responsible for putting all the components that make up the
  page together. It also sends GET requests to get a project by its id. And a
  PUT request, to let invited users join the project.
*/
const Project: React.VFC = () => {
  const [project, setProject] = React.useState<ProjectProfile>(defaultProject);
  const authState = authStore((state) => state.authState);
  const router = useRouter();

  /* Gets project by id and then creates necessary global data structures.
     (memberLst, invitedLst, project object)
  */
  function getAndMakeProject() {
    if (!(typeof projectId === 'string')) {
      alert('error');
      return;
    }
    getProject(projectId).then((res) => {
      const newMemberLst = [];
      for (let i = 0; i < res.data.members.length; i += 1) {
        newMemberLst.push({
          FirstName: res.data.members[i].firstName,
          LastName: res.data.members[i].lastName,
          UserId: res.data.members[i].userId,
          Email: res.data.members[i].email,
        });
        memberIds.push(res.data.members[i].userId);
        if (res.data.email === res.data.members[i].email) {
          ownerId = res.data.members[i].userId;
        }
      }
      const newInvitedLst = [];
      for (let i = 0; i < res.data.invitedUsers.length; i += 1) {
        newInvitedLst.push({
          FirstName: res.data.invitedUsers[i].firstName,
          LastName: res.data.invitedUsers[i].lastName,
          UserId: res.data.invitedUsers[i].userId,
          Email: res.data.invitedUsers[i].email,
        });
        invitedIds.push(res.data.invitedUsers[i].userId);
      }

      const newProject = {
        Title: res.data.title,
        Description: res.data.description,
        Location: res.data.location,
        ProjectOwner: res.data.username,
        ProjectOwnerEmail: res.data.email,
        MaxMembers: res.data.maxMembers,
        Category: res.data.category,
        MemberLst: newMemberLst,
        skills: res.data.skills || SkillLst,
        InvitedLst: newInvitedLst,
      };
      setProject(newProject);
      console.log(res.data.skills);
      console.log(newProject);
      // console.log(`${memberIds.length} ${project.MaxMembers}`);
    }).catch((error) => {
      alert(error);
    });
  }

  const addMemberToProject = async () => {
    if (!(typeof projectId === 'string')) {
      alert('error');
      return;
    }
    const res = await addMember(projectId, currId).catch((error) => {
      alert(error);
    });

    if (res) {
      getAndMakeProject();
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const submitInvite = (req: InviteUserRequest) => {
    inviteMember(projectId as string, req)
      .then(() => {
        getAndMakeProject();
        enqueueSnackbar('User invited.', { variant: 'success' });
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response) {
          enqueueSnackbar(err.response.data, { variant: 'error' });
        } else {
          enqueueSnackbar(err, { variant: 'error' });
        }
      });
  };

  const submitRemoval = (userId: number) => {
    removeMember(projectId as string, userId)
      .then(() => {
        getAndMakeProject();
        enqueueSnackbar('User removed.', { variant: 'success' });
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response) {
          enqueueSnackbar(err.response.data, { variant: 'error' });
        } else {
          enqueueSnackbar(err, { variant: 'error' });
        }
      });
  };

  const clone: ProjectProfile = JSON.parse(JSON.stringify(project));
  
  const updateUserProfile: VoidFunction = async () => {
    if (!(typeof projectId === 'string')) {
      alert('error');
      return;
    }
    
    const res = await updateProjectSkills(clone.skills, projectId).catch((error) => {
      alert(error);
    });
    if (res) {
      setProject(clone);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    const { pid } = router.query;
    projectId = pid; /* id of user */
    getAndMakeProject(); /* When the page loads, a get request is made to populate
        the project profile page accordingly */
  }, [router.isReady]);

  // checks if owner of the project is on the page
  // if this is null, then it means the user is not logged in.
  const authentication: boolean | null = (authState
        && parseInt(authState.nameid, 10) === ownerId);

  // gets the Id of the user viewing the page
  currId = (authState ? parseInt(authState.nameid, 10) : -1);

  // checks if the user has been invited to the project
  const isInvited: boolean = invitedIds.includes(currId);

  // checks if the user is a member of the project
  const inGroup: boolean = memberIds.includes(currId);

  const isFull: boolean = memberIds.length === project.MaxMembers;

  const [tab, setTab] = useState<Tabs>('Dashboard');

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getTabComponent = () => {
    switch (tab) {
      case 'Dashboard':
        return (
          <ProjectDashboard
            inGroup={inGroup}
            {...project}
            authentication={authentication}
            isInvited={isInvited}
            isFull={isFull}
            addMemberToProject={addMemberToProject}
            setSidebarOpen={setSidebarOpen}
            getUsers={getUsers}
            submitInvite={submitInvite}
            addSkills={updateUserProfile}
            projectprofile = {clone}
          />
        );
      case 'Buddies':
        return (
          <ProjectBuddies
            {...project}
            setSidebarOpen={setSidebarOpen}
            isOwner={ownerId.toString() === authState?.nameid}
            ownerId={ownerId}
            getUsers={getUsers}
            submitInvite={submitInvite}
            submitRemoval={submitRemoval}
            isFull={isFull}
          />
        );
      default:
        return 'Error';
    }
  };

  return (
    <Container>
      <Sidebar
        name={project.ProjectOwner}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        setTab={setTab}
      />
      {getTabComponent()}
    </Container>
  );
};

export default Project;
