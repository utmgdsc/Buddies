import Grid from '@material-ui/core/grid';
import Container from '@material-ui/core/Container';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authStore } from '../../stores/authStore';
import ProjectProfile from '../../components/Dashboard';
import { TokenResponse } from '../../api/model/tokenResponse';

// const api = axios.create({
//     baseURL: '/api/v1/projects/',
//     headers: {
//       Accept: 'application/json',
//       'Content-type': 'application/json',
//     },
//   });

const baseURL = '/api/v1/projects/'
type UserInfo = {
    FirstName: string,
    LastName: string,
    UserId: number
}

type ProjectProfile = {
    Title: string,
    Description: string,
    Location: string,
    ProjectOwner: string,
    ProjectOwnerEmail: string,
    MaxMembers: number
    Category: string,
    MemberLst: UserInfo[],
    InvitedLst: UserInfo[]
};

let memberLst: UserInfo[] = [{
    FirstName: "John",
    LastName: "Doe",
    UserId: -1
}];

let defaultProject: ProjectProfile = {
    Title: "Not Found",
    Description: "This error means the project that you are searching for was not found. There are many causes for this. First, check if the url is correct. Second, if the url is correct, it means the project owner has most likely deleted his account!",
    Location: "Unknown",
    ProjectOwner: "D.N.E",
    ProjectOwnerEmail: "D.N.E",
    MaxMembers: 1,
    Category: "Not Found",
    MemberLst: memberLst,
    InvitedLst: []
}


let projectId: string | string[] | undefined = '';
let currId: number;
let invitedIds: number[] = [];
let memberIds: number[] = [];
let ownerId: number;

const Project: React.VFC = () => {
    const [project, setProject] = React.useState<ProjectProfile>(defaultProject);
    const authState = authStore((state: { authState: any; }) => state.authState);
    const router = useRouter();

    function getProject() {
        if (!(typeof projectId === 'string')) {
            alert('error');
            return;
        }
        axios.get(baseURL + projectId).then((res) => {
            console.log(res.data);
            let newMemberLst = []
            for (let i = 0; i < res.data.members.length; i += 1) {
                newMemberLst.push({
                    FirstName: res.data.members[i].firstName,
                    LastName: res.data.members[i].lastName,
                    UserId: res.data.members[i].userId
                });
                memberIds.push(res.data.members[i].userId);
                if (res.data.email == res.data.members[i].email) {
                    ownerId = res.data.members[i].userId;
                }
            }
            console.log("hdshzzzzzzzzzzzzzzzzzzzzziasdihsda");
            let newInvitedLst = []
            for (let i = 0; i < res.data.invitedUsers.length; i += 1) {
                
                newInvitedLst.push({
                    FirstName: res.data.invitedUsers[i].firstName,
                    LastName: res.data.invitedUsers[i].lastName,
                    UserId: res.data.invitedUsers[i].userId
                });
                invitedIds.push(res.data.invitedUsers[i].userId);
            }
            
            let newProject = {
                Title: res.data.title,
                Description: res.data.description,
                Location: res.data.location,
                ProjectOwner: res.data.username,
                ProjectOwnerEmail: res.data.email,
                MaxMembers: res.data.maxMembers,
                Category: res.data.category,
                MemberLst: newMemberLst,
                InvitedLst: newInvitedLst
            }
            setProject(newProject);
        }).catch((error) => {
            console.log("errorrororor");
            alert(error);
        });
    };

    const addMember = async () => {
        if (!(typeof projectId === 'string')) {
          alert('error');
          return;
        }
        // const res2 = await api.get<TokenResponse>('/api/v1/users/refresh');
        // api.defaults.headers.common.Authorization = `Bearer ${res2.data.accessToken}`;
        console.log('hi');
        const res = await axios.post(baseURL + projectId + "/join/", currId).catch((error) => {
          alert(error);
        });
        if (true && res) {
            getProject();
        };
    };

    const inviteMember = async (memberId: number) => {
        if (!(typeof projectId === 'string')) {
          alert('error');
          return;
        }
        const res = await axios.post(baseURL + projectId + "/invite/" + memberId).catch((error) => {
          alert(error);
        });
        if (true && res) {
            getProject();
        };
    };

    useEffect(() => {
        if (!router.isReady) return;
        const { pid } = router.query;
        projectId = pid; /* id of user */
        getProject(); /* When the page loads, a get request is made to populate
        the project profile page accordingly */
    }, [router.isReady]);

    const authentication: boolean | null = (authState
        && parseInt(authState.nameid, 10) === ownerId);
    currId = (authState?parseInt(authState.nameid, 10):-1);
    console.log(currId);
    const isInvited: boolean = invitedIds.includes(currId);
    const inGroup: boolean = memberIds.includes(currId);
    const isFull: boolean = memberIds.length == project.MaxMembers;
    console.log(invitedIds);
    return (
        <Container>
            <ProjectProfile inGroup={inGroup} title={project.Title} location = {project.Location}
            category = {project.Category} total={project.MaxMembers}
            curr={project.MemberLst.length} desc={project.Description}
            pOwner={project.ProjectOwner} pEmail={project.ProjectOwnerEmail}/>

            <Grid container justifyContent='center' marginTop={2} spacing={3} marginBottom={5}>
                <Grid item xs={10}>
                    <Card elevation={10}> 
                            <Grid container p={1} spacing={2} justifyContent="center">
                                {project.MemberLst.map((member: UserInfo) => {
                                    return (
                                            <Grid item xs={2}>
                                                <Card sx={{border: 1, height: 80}}>
                                                    <CardActionArea href={"../Profiles/" + member.UserId}>
                                                        <Avatar sx={{margin: 'auto', marginTop: 1}}/>
                                                        <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                                                            {member.FirstName + " " + member.LastName}
                                                        </Typography>
                                                    </CardActionArea>
                                                </Card>
                                            </Grid>
                                        );
                                })}
                                {authentication && !isFull &&
                                <Grid item xs={2}>
                                    <Card sx={{border: 1, height: 80}}>
                                        <CardActionArea>
                                            <AddIcon sx={{marginLeft: '40%', marginTop: 1, cursor: 'pointer'}}/>
                                            <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                                                Invite More Users
                                            </Typography>
                                        </CardActionArea>
                                        
                                    </Card>
                                </Grid>
                                }
                                {!authentication && isInvited && !inGroup && !isFull &&
                                <Grid item xs={2}>
                                    <Card sx={{border: 1, height: 80}}>
                                        <CardActionArea onClick={addMember}>
                                            <AddIcon sx={{marginLeft: '40%', marginTop: 1, cursor: 'pointer'}}/>
                                            <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                                                Join Project
                                            </Typography>
                                        </CardActionArea>
                                        
                                    </Card>
                                </Grid>
                                }

                                {!authentication && !isInvited && !inGroup && !isFull &&
                                <Grid item xs={2}>
                                    <Card sx={{border: 1, height: 80}}>
                                        <CardActionArea>
                                            <EmailIcon sx={{marginLeft: '40%', marginTop: 1, cursor: 'pointer'}}/>
                                            <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
                                                Request to Join
                                            </Typography>
                                        </CardActionArea>
                                        
                                    </Card>
                                </Grid>
                                }
                            </Grid>
                        </Card>
                </Grid>
            </Grid>
        </Container>

        // <Container>
        //     <Grid container spacing={5}>
        //         <Grid item xs={12}>
        //             <Card sx={{
        //             padding: 2,
        //             width: '100%',
        //             height: 500,
        //             border: 1,
        //             alignItems: 'center',
        //             paddingRight: 3,
        //             boxShadow: 12,
        //             marginTop: 5
        //             }}
        //             >
        //                 <Typography color="inherit" variant="h4" gutterBottom>
        //                     {project.Title}
        //                 </Typography>
        //                 <Card>
        //                     <Typography color="inherit" variant="subtitle1" gutterBottom sx={{marginTop: 1, marginLeft: 2}}>
        //                         Details:
        //                     </Typography>
        //                     <Grid container p={1} spacing={2}>
        //                         <Grid item xs={6}>
        //                             <Typography color="inherit" variant="caption" gutterBottom sx={{marginTop: 1, marginLeft: 1}}>
        //                                 Project Owner: {project.ProjectOwner}
        //                             </Typography>
        //                         </Grid>
        //                         <Grid item xs={6}>
        //                             <Typography color="inherit" variant="caption" gutterBottom sx={{marginTop: 1, marginLeft: 1}}>
        //                                 Location: {project.Location}
        //                             </Typography>
        //                         </Grid>
        //                         <Grid item xs={6}>
        //                             <Typography color="inherit" variant="caption" gutterBottom sx={{marginTop: 1, marginLeft: 1}}>
        //                                 Email: {project.ProjectOwnerEmail}
        //                             </Typography>
        //                         </Grid>
        //                         <Grid item xs={6}>
        //                             <Typography color="inherit" variant="caption" gutterBottom sx={{marginTop: 1, marginLeft: 1}}>
        //                                 Category: {project.Category}
        //                             </Typography>
        //                         </Grid>
        //                         <Grid item xs={12}>
        //                             <Typography color="inherit" variant="body2" gutterBottom sx={{marginTop: 1, marginLeft: 1}}>
        //                                 Description:
        //                             </Typography>
        //                             <Typography color="inherit" variant="caption" gutterBottom sx={{marginLeft: 1}}>
        //                                 {project.Description}
        //                             </Typography>
        //                         </Grid>
                                
        //                     </Grid>
        //                 </Card>
        //                 <Typography color="inherit" variant="h6" gutterBottom>
        //                     Members
        //                 </Typography>
        //                 <Card> 
        //                     <Grid container p={1} spacing={2} justifyContent="center">
        //                         {project.MemberLst.map((member: UserInfo) => {
        //                             return (
        //                                     <Grid item xs={2}>
        //                                         <Card sx={{border: 1, height: 80}}>
        //                                             <CardActionArea href={"Profiles/" + member.UserId}>
        //                                                 <Avatar sx={{margin: 'auto', marginTop: 1}}/>
        //                                                 <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
        //                                                     {member.FirstName + " " + member.LastName}
        //                                                 </Typography>
        //                                             </CardActionArea>
        //                                         </Card>
        //                                     </Grid>
        //                                 );
        //                         })}
        //                         {authentication &&
        //                         <Grid item xs={2}>
        //                             <Card sx={{border: 1, height: 80}}>
        //                                 <CardActionArea>
        //                                     <AddIcon sx={{marginLeft: '40%', marginTop: 1, cursor: 'pointer'}}/>
        //                                     <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
        //                                         Invite More Users
        //                                     </Typography>
        //                                 </CardActionArea>
                                        
        //                             </Card>
        //                         </Grid>
        //                         }
        //                         {!authentication && isInvited && !inGroup &&
        //                         <Grid item xs={2}>
        //                             <Card sx={{border: 1, height: 80}}>
        //                                 <CardActionArea onClick={addMember}>
        //                                     <AddIcon sx={{marginLeft: '40%', marginTop: 1, cursor: 'pointer'}}/>
        //                                     <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
        //                                         Join Project
        //                                     </Typography>
        //                                 </CardActionArea>
                                        
        //                             </Card>
        //                         </Grid>
        //                         }

        //                         {!authentication && !isInvited &&
        //                         <Grid item xs={2}>
        //                             <Card sx={{border: 1, height: 80}}>
        //                                 <CardActionArea>
        //                                     <EmailIcon sx={{marginLeft: '40%', marginTop: 1, cursor: 'pointer'}}/>
        //                                     <Typography color="inherit" variant="subtitle2" gutterBottom align="center" mt={1}>
        //                                         Request to Join
        //                                     </Typography>
        //                                 </CardActionArea>
                                        
        //                             </Card>
        //                         </Grid>
        //                         }
                                
                    
        //                     </Grid>
        //                 </Card>
        //             </Card>
        //         </Grid>
        //     </Grid>
        // </Container>
    );
};

export default Project;