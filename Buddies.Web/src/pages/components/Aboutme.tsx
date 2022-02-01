import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';

 
const Aboutme = ({desc}) => {  
    return (
        <Box p = {2} boxShadow={12} sx={{ width: '100%', overflow: 'auto', backgroundColor: 'white', border: 1}}>
            <Grid container > 
                <Grid item>
                    <Typography variant="h6" gutterBottom>
                        About me
                    </Typography> 
                    <Typography variant="subtitle2" gutterBottom>
                        {desc}
                    </Typography> 
                </Grid>
            </Grid>
        </Box>     
    )
}
export default Aboutme;

