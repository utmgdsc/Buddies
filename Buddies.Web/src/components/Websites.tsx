import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import CustomizedDialogs from './dialog';


const Websites = ({logCheck}:{logCheck: boolean|null}) => {
    return (
        <Box p = {2} bgcolor="primary.light" boxShadow={12} sx={{ width: '100%', height: 207, border: 1, alignItems: "center"}}>
            <Grid container > 
                <Grid item xs={11}>
                    <Typography color="inherit" variant="h6" gutterBottom>
                    Websites
                    </Typography> 
                </Grid> 
                <Grid item xs={1}>
                    {logCheck &&
                        <CustomizedDialogs color="inherit" topmarg={0}>
                            
                        </CustomizedDialogs>
                    }
                </Grid>               
            </Grid>
            <Typography variant="subtitle2" gutterBottom>
                ...
            </Typography>
        </Box>     
    )
}

export default Websites;

