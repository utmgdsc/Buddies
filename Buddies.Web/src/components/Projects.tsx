import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';

 {/* Projects section
*/}
const Projects = () => {  
    return (
        <Box p = {2} boxShadow={12} bgcolor="primary.light" sx={{ width: '100%', height: 300, maxHeight:"300px", border: 1,
         alignItems: "center", overflowY:'auto'}}>
            <Grid container > 
                <Grid item xs={12}>
                    <Typography color="inherit" variant="h6" gutterBottom>
                        Projects
                    </Typography> 
                </Grid> 
                
                <Grid item xs={5}>
                    
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="subtitle2" gutterBottom style={{marginTop: 90, color: "grey"}}>
                        No Projects
                    </Typography> 
                </Grid>
                <Grid item xs={4}>
                    
                </Grid>
            </Grid>
        </Box>     
    )
}
export default Projects;

