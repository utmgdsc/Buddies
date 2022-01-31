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
        <Grid container spacing={2}> 
          
          <Grid item xs={12}>
            <Box p = {2} sx={{ width: '100%', height: '90%', backgroundColor: 'black'}}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" src="profile.png" sx={{ width: 64, height: 64 }}/>
                    </Grid>
                    <Grid item xs={10}>
                    <br />
                    <Typography style={{color: 'white'}} variant="subtitle2" gutterBottom>
                        {name} | {email} | {occupation} {/* User's name + email + occupation */}
                    </Typography> 
                    </Grid>
                    <Grid item> 
                        <br />
                        <CopyToClipboard text={'www.testurl.com'}>
                            <Button startIcon={<FileCopyIcon />} variant="contained">
                                Share
                            </Button>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
            </Box>
          </Grid>
        </Grid>
        
       
    )
}
export default Header;

