import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard'
 
const Header = ({name, email, occupation}) => {  {/* In the profile page, we're gonna pass in the users required info as a prop
                            then this component can use it. For now we have just entered default values
                            (John doe..etc)
                        */}
    return (
        <Grid container> 
            <Box p = {2} sx={{ paddingLeft: 3, width: '100%', height: '90%', backgroundColor: 'black', marginBottom: 1}}>
                <Grid container>
                    <Grid container item xs={1} justifyContent= 'center'>
                        <Avatar alt="Remy Sharp" src="profile.png" sx={{ width: 74, height: 74 }}/>
                    </Grid>
                    <Grid container item xs={9}>
                        <Typography sx={{ marginTop: 5, marginLeft: 2}} style={{color: 'white'}} variant="subtitle2" gutterBottom>
                            {name} | {email} | {occupation} {/* User's name + email + occupation */}
                        </Typography> 
                    </Grid>
                    <Grid container item xs={2} justify="flex-end"> 
                        
                        <CopyToClipboard text={'www.testurl.com'}>
                            <Button startIcon={<FileCopyIcon />} variant="contained" style={{marginTop: 10, height: 50}}>
                                Share
                            </Button>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
        
       
    )
}
export default Header;

