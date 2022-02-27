import { Container } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import BScore from '../../components/BScore';
import Aboutme from '../../components/Aboutme';
import Projects from '../../components/Projects';
import Skills from '../../components/Skills';
import Websites from '../../components/Websites';
import '../../api/index';
import { authStore } from '../../stores/authStore';

const api = axios.create({
  baseURL: '/api/v1/Profiles/',
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
  },
});

let profileId: string | string[] | undefined = '';

type Skillobject = {
  'id': number,
  'name': string,
  'delete': boolean
};

type UpdateProf = {
  'firstName': string,
  'lastName': string,
  'userId': number,
  'headline': string,
  'aboutMe': string,
  'skills': Skillobject[],
  'success': number
};

/* Profile page. Responsible for putting all the components that make up the profile
  page together. It also sends GET requests to get a user's profile by his id. And a
  PUT request, to update a user's profile, if he makes any changes.
*/

const Profile: React.VFC = () => {
  const [userProfile, setProfile] = useState<UpdateProf>({
    firstName: 'Default',
    lastName: 'User',
    userId: -1,
    headline: 'n/a',
    aboutMe: 'n/a',
    skills: [{ id: 1, name: 'Data Structures', delete: false },
      { id: 2, name: 'C++', delete: false }, { id: 3, name: 'Python', delete: false }],
    success: 0,
  }); // default user profile
    // it's used when someone tries to access a profile that does not exist

  function getProfile() {
    if (!(typeof profileId === 'string')) {
      alert('error');
      return;
    }
    api.get(profileId).then((res) => {
      setProfile(res.data);
    }).catch((error) => {
      alert(error);
    });
  }

  const profileToUpdate: UpdateProf = {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    userId: userProfile.userId,
    headline: userProfile.headline,
    aboutMe: userProfile.aboutMe,
    skills: userProfile.skills,
    success: userProfile.success,
  };

  const updateProfile: VoidFunction = async () => {
    if (!(typeof profileId === 'string')) {
      alert('error');
      return;
    }
    const res = await api.put('/', profileToUpdate).catch((error) => {
      alert(error);
    });
    if (true && res) {
      setProfile(profileToUpdate);
    }
  };

  const authState = authStore((state) => state.authState);
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const { pid } = router.query;
    profileId = pid; /* id of user */
    getProfile(); /* When the page loads, a get request is made to populate
    the profile page accordingly */
  }, [router.isReady]);

  const loggedin: boolean | null = (authState
    && parseInt(authState.nameid, 10) === userProfile.userId);
  // this boolean toggles the edit functionality on and off for a user. (If someone is logged in
  // and viewing their profile then they can edit their profile. But if someone is logged out,
  // or is not viewing their profile, the user won't be able to edit the profile)

  return (
    <Box p={5}>
      <Container>
        <Grid container spacing={5}>
          <Header
            updateFunc={updateProfile}
            newProfile={profileToUpdate}
            logCheck={loggedin}
            fName={userProfile.firstName}
            lName={userProfile.lastName}
            hline={userProfile.headline}
          />
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <BScore score={0} />
            <br />
            <Skills updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} />
            <br />
            <Websites logCheck={loggedin} />
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
            <Aboutme
              updateFunc={updateProfile}
              newProfile={profileToUpdate}
              logCheck={loggedin}
              desc={userProfile.aboutMe}
            />
            <br />
            <Projects />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;
export type { UpdateProf, Skillobject };
