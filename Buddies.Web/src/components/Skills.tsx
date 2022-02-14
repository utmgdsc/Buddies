import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button'
import CustomizedDialogs from './dialog';
import type {UpdateProf} from '../pages/Profiles/[pid]';
import Skillform from './Skillform';

{/* Skills component.
*/}

const Skills = ({updateFunc, newProfile, logCheck}: {updateFunc: VoidFunction, newProfile: UpdateProf, logCheck: boolean|null}) => {
    return (
        <Box p = {2} boxShadow={12} bgcolor="primary.light" sx={{ width: '100%', height: '30%', border: 1, alignItems: "center"}}>
            <Grid container > 
                <Grid item xs={11}>
                    <Typography color="inherit" variant="h6" gutterBottom>
                        Skills
                    </Typography> 
                </Grid> 
                <Grid item xs={1}>
                    {logCheck &&
                        <CustomizedDialogs color="inherit" topmarg={0}>
                            <Skillform submitFunc={updateFunc} profileData={newProfile}/>
                            
                        </CustomizedDialogs>
                    } {/* Only a logged in user has access to edit */}
                    
                </Grid>
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
                <Grid container > 
                    {newProfile.skills?.map(skill => {
                        return <div className="skills" key={skill.id + 1}> {/* We have another list that is being rendered in the skilllist 
                        component. So to make the keys different for this list, we can just add one to each id.  */}
                                    <Box p = {2} m = {1} sx={{border: 1, borderRadius: 8, height: '10%', paddingTop: 0, marginBottom: -2,
                                     marginRight: 0}} >
                                        <Typography variant="h6" gutterBottom fontSize={12}>
                                            {skill.name}
                                        </Typography> 
                                    </Box>
                                </div>  
                    })}
                </ Grid> 
            </Typography>
        </Box>     
    )
}

export default Skills;

