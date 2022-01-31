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


{/* Profile page. I intend to add api end points, and using those I want
  to get the specific User that's logged in. Then I can pass in his information
  into each component as a prop. Currently, I'm just using default values. 
*/}

const desc: string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.";
const Profile = () =>  (
  <>
    <Navbar />
    <Box p = {5} >
      <Container>
        <Grid container spacing={2}>
          <Header name={'John Doe'} email={'john.doe@mail.utoronto.ca'} occupation={'CS @ Uoft'}/>
          <Grid item xs={3}>
            <BScore score={81} />  
            <br />
            <Skills />
            <br />
            <Websites />
          </Grid>
          <Grid item xs={9}>
            <Aboutme desc={desc}/> 
            <br />
            <Projects />
          </Grid>
        </Grid> 
      </Container>   
    </Box>
  </>
);

export default Profile;
