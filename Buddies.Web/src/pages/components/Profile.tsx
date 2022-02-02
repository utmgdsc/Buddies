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
import { makeStyles } from '@material-ui/core'
import React, { useState } from 'react';

{/* Profile page. I intend to add api end points, and using those I want
  to get the specific User that's logged in. Then I can pass in his information
  into each component as a prop. Currently, I'm just using default values. 
*/}

const desc: string = "Hello my Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.dsaadsdjddsklfjklfdaskjlfdasfddfkladsfkjfsdkjldfsklajfdslkfdjskldskdfljdfskjlfdjfdfdffdfdfffffff";
const Profile = () =>  {
  const [profile, setprofile] = useState([]);

  {/* Get and Put Requests. I will later modify this to use a specific id,
    to get the id of the user profile being accessed. For testing,
    I am just using hard coded values. 
*/}
  function getProfile() {
    const url: string = "https://localhost:7128/api/v1/Profiles/3"

    fetch(url, {
      method: 'GET'
    }).then(response => response.json())
    .then(profileFomServer => {
      console.log(profileFomServer);
      setprofile(profileFomServer);
    }).catch((error) => {
      console.log(error);
      alert(error);
    });
  }

  const postToUpdate = {
    "id": 1,
    "name": 'Bill',
    "email": "john@gmail.com",
    "occup": 'boy'
  }

  function updateProfile() {
    const url: string = "https://localhost:7128/api/v1/Profiles/1"

    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(postToUpdate)
      
    }).then(response => response.json())
    .then(profileFomServer => {
      console.log(profileFomServer);
      
    }).catch((error) => {
      console.log(error);
      alert(error);
    });
  }

   
  return (
  <>
    <Navbar /> 
    <button onClick={getProfile}></button> {/* Ignore this. Just for testing */}
    <button onClick={updateProfile}></button> 
    <Box p = {5} >
      <Container>
        <Grid container spacing={5} alignItems ='center' justifyContent= 'center'>
          <Header name={profile.name} email={profile.email} occupation={profile.occup}/>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <BScore score={81} />  
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
            <Aboutme desc={desc}/> 
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Skills />
            <br />
            <Websites />
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
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
