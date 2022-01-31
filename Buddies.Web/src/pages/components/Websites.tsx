import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button'


const Websites = () => {
    return (
        <Box p = {2} boxShadow={12} sx={{ width: '75%', height: 207, backgroundColor: 'white', border: 1, alignItems: "center"}}>
            <Grid container > 
                <Grid item>
                    <Typography variant="h6" gutterBottom>
                        Websites
                    </Typography> 
                    <Typography variant="subtitle2" gutterBottom>
                        ...
                    </Typography>
                </Grid>
                
            </Grid>
        </Box>     
    )
}

export default Websites;

