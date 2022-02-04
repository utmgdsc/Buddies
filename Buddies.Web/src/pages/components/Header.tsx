import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import CustomizedDialogs from './dialog';
import Headerform from './Headerform';
import type {UpdateProf} from './Profile';
import Button from '@material-ui/core/Button'
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard'


{/* Header component of the profile page. */} 
const Header = ({updateFunc, newProfile, logCheck, name, bio}: {updateFunc: VoidFunction, newProfile: UpdateProf, logCheck:boolean, name:string, bio:string}) => { 
    return (
        <>
        
        <Grid container> 
            
            <Box p = {2} sx={{ paddingLeft: 3, width: '100%', height: '90%', backgroundColor: 'black', marginBottom: 1}}>
                <Grid container>
                    <Grid container item xs={1} justifyContent= 'center'>
                        <Avatar alt="Remy Sharp" src="profile.png" sx={{ width: 74, height: 74 }}/>
                    </Grid>
                    <Grid container item xs={9}>
                        <Typography sx={{ marginTop: 5, marginLeft: 2}} style={{color: 'white'}} variant="subtitle2" gutterBottom>
                            {name} | {bio} {/* User's name + bio*/}
                        </Typography> 
                        {logCheck &&  
                            <CustomizedDialogs color="white">
                                <Headerform profileData={newProfile} onSubmit={({name, bio})=>{
                                    console.log(name, bio);
                                    newProfile.name = name;
                                    newProfile.bio = bio;
                                    console.log(newProfile);
                                    updateFunc();
                                }}/>
                            </CustomizedDialogs> 
                        } {/* if the user isn't logged in, then edit option dissappears */}
                    </Grid>
                    <Grid container item xs={2} justifyContent="flex-end"> 
                        
                        <CopyToClipboard text={'www.testurl.com'}>
                            <Button startIcon={<FileCopyIcon />} variant="contained" style={{marginTop: 10, height: 50}}>
                                Share
                            </Button>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        </>
        
       
    )
}
export default Header;

