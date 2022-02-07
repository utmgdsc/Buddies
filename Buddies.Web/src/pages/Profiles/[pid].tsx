import Header from '../../components/Header';
import BScore from '../../components/BScore';
import Aboutme from '../../components/Aboutme';
import Projects from '../../components/Projects';
import Skills from '../../components/Skills';
import Websites from '../../components/Websites';
import { Container } from '@material-ui/core';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'

const api = axios.create({
  baseURL: "http://localhost:5128/api/v1/Profiles/",
  headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json'
  }
})

let profileId: string | string[] | undefined = "";

type Skillobject = {
  "id": number,
  "name": string,
  "delete": boolean
}

type UpdateProf = {
  "firstName": string,
  "lastName": string,
  "userId": number,
  "headline": string,
  "aboutMe": string,
  "skills": Skillobject[],
  "success": number
}




{/* Profile page. Responsible for putting all the components that make up the profile
  page together. It also sends GET requests to get a user's profile by his id. And a
  PUT request, to update a user's profile, if he makes any changes. 
*/}

const Profile = () =>  {

  const [userProfile, setProfile] = useState<UpdateProf>({"FirstName": "Default", "LastName": "User", "UserId": -1, "Headline": "n/a", "AboutMe": "n/a", "Skills": [{"id": 1, "name": "Data Structures", "delete": false}, {"id": 2, "name": "C++", "delete": false}, {"id": 3, "name": "Python", "delete": false}], "success": 0});
  
  const router = useRouter(); {/* When the page loads, a get request is made to populate the profile page accordingly */}
  useEffect(()=>{
      if(!router.isReady) return;
      const { pid } = router.query;
      profileId = pid;
      getProfile();
  
  }, [router.isReady]);


  
  const profileToUpdate: UpdateProf = {  
    "firstName": userProfile.firstName,
    "lastName": userProfile.lastName,
    "userId": userProfile.userId,
    "headline": userProfile.headline,
    "aboutMe": userProfile.aboutMe,
    "skills": userProfile.skills,
    "success": userProfile.success
  }

  let loggedin: boolean; {/* Since the log in feature has not been created yet, I use a boolean to toggle
    on and off the functionality for a user thats logged in and logged out. (The logged in functionality only
     allows for edit access)
    */}
  if (userProfile.success === 0) {
    loggedin = false;
  }else {
    loggedin = true;
  }
    {/* Get and Put Requests. I will later modify this to use a specific id,
    to get the id of the user profile being accessed. For testing,
    I am just using hard coded values.
  */}
  function getProfile() {
    if (!(typeof profileId == "string")){
      return alert('error')
    }
    console.log(profileId)
    api.get(profileId).then(res => {
      console.log(res.data)
      setProfile(res.data);
      console.log(userProfile.firstName);
    }).catch((error) => {
      console.log(error);
      alert(error);
    });

    
  }

  let updateProfile: VoidFunction = async () => {
    if (!(typeof profileId == "string")){
      return alert('error')
    }
    let res = await api.put('/', profileToUpdate).catch((error) => {
      console.log(error);
      alert(error);
    });
    if (true && res) {
      console.log(res);
      console.log(profileToUpdate);
      console.log(res.data);
      setProfile(profileToUpdate);
      console.log(userProfile);
    }

  }


  return (
  <>
    <Box p = {5} >
      <Container>
        <Grid container spacing={5} >
          <Header updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} firstName={userProfile.firstName} lastName={userProfile.lastName} headline={userProfile.headline}/>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{marginBottom: 75}}> 
            <BScore score={0} />  
            <br />
            <Skills updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} />
            <br />
            <Websites logCheck={loggedin} />
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
            <Aboutme updateFunc={updateProfile} newProfile={profileToUpdate} logCheck={loggedin} desc={userProfile.aboutMe}/>
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
export type { UpdateProf, Skillobject };