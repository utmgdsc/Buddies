import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import CustomizedDialogs from './dialog';
import Aboutmeform from './Aboutmeform';
import type {UpdateProf} from '../pages/Profiles/[pid]';



{/* About me component.*/}
const Aboutme = ({updateFunc, newProfile, logCheck, desc}: {updateFunc: VoidFunction, newProfile: UpdateProf, logCheck: boolean, desc: string}) => {  
    return (
        <Box p = {2} boxShadow={12} sx={{ width: '100%', overflow: 'auto', backgroundColor: 'white', border: 1}}>
            <Grid container > 
                <Grid item xs={11}>
                    <Typography variant="h6" gutterBottom>
                        About me
                    </Typography> 
                </Grid> 
                <Grid item xs={1}>
                    {logCheck &&
                        <CustomizedDialogs color="black" topmarg={0}>
                            <Aboutmeform profileData={newProfile} onSubmit={({aboutme})=>{
                                console.log(aboutme);
                                if (!(aboutme === '')) {
                                    newProfile.AboutMe = aboutme;
                                    console.log(newProfile);
                                    updateFunc();
                                }
                            }}/>
                        </CustomizedDialogs>
                    }
                </Grid>
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
                    {desc}
            </Typography> 
        </Box>     
    )
}
export default Aboutme;

