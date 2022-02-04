import Navbar from './Navbar';
import Header from './Header';
import BScore from './BScore';
import Aboutme from './Aboutme';
import Projects from './Projects';
import Skills from './Skills';
import Websites from './Websites';
import { Container } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: "https://localhost:7128/api/v1/Profiles/1",
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  }
})

type Skillobject = {
  "id": number,
  "name": string,
  "delete": boolean
}

type UpdateProf = {
  "id": number,
  "name": string,
  "bio": string,
  "aboutme": string,
  "skills": Skillobject[]
}


{/* Profile page. Responsible for putting all the components that make up the profile
  page together. It also sends GET requests to get a user's profile by his id. And a
  PUT request, to update a user's profile, if he makes any changes. 
*/}

const Profile = () =>  {

  const [userProfile, setProfile] = useState([{"id": 0, "name": "joe", "bio": "n/a", "aboutme": "n/a", "skills": [{"id": 1, "name": "Data Structures", "delete": false}, {"id": 2, "name": "C++", "delete": false}, {"id": 3, "name": "Python", "delete": false}]}]);

  let loggedin: boolean = true; {/* Since the log in feature has not been created yet, I use a boolean to toggle
     on and off the functionality for a user thats logged in and logged out. (The logged in functionality only
      allows for edit access)
     */}

  useEffect(() => { {/* When the page loads, a get request is made to populate the profile page accordingly */}
    getProfile();
  }, [])

  const profileToUpdate: UpdateProf = {  
    "id": userProfile.id,
    "name": userProfile.name,
    "bio": userProfile.bio,
    "aboutme": userProfile.aboutme,
    "skills": userProfile.skills
  }
    {/* Get and Put Requests. I will later modify this to use a specific id,
    to get the id of the user profile being accessed. For testing,
    I am just using hard coded values.
  */}
  function getProfile() {
    api.get('/').then(res => {
      console.log(res.data)
      res.data.skills = profileToUpdate.skills;
      setProfile(res.data);
      console.log(userProfile.name);
    }).catch((error) => {
      console.log(error);
      alert(error);
    });

    
  }

  let updateProfile: VoidFunction = async () => {
    let res = await api.put(`/`, profileToUpdate).catch((error) => {
      console.log(error);
      alert(error);
    });
    console.log(res);
    console.log(profileToUpdate);
    res.data.skills = profileToUpdate.skills;
    console.log(res.data);
    setProfile(res.data);

    console.log(userProfile);
  }


  return (
  <>
    <Navbar /> 
    <Box p = {5} >
      <Container>
        <Grid container spacing={5} alignItems ='center' justifyContent= 'center'>
          <Header updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} name={userProfile.name} bio={userProfile.bio}/>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <BScore score={0} />  
            <br />
            <Skills updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} />
            <br />
            <Websites logCheck={loggedin} />
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
            <Aboutme updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} desc={userProfile.aboutme}/>
            <br />
            <Projects /> 
          </Grid>
         
        </Grid> 
      </Container>   
    </Box>
  </>
  );
};

export default Profile;
export type { UpdateProf };