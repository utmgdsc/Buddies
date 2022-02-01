import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button'


{/* Skills component. Each skill is gonna be it's own entity. A
list of skills are going to passed in as props. Then, i want to render
these in place of the dots. 
*/}

const Skills = () => {
    return (
        <Box p = {2} boxShadow={12} sx={{ width: '100%', height: 98, backgroundColor: 'white', border: 1, alignItems: "center"}}>
            <Grid container > 
                <Grid item>
                    <Typography variant="h6" gutterBottom>
                        Skills
                    </Typography> 
                    <Typography variant="subtitle2" gutterBottom>
                        ...
                    </Typography>
                </Grid>
                
            </Grid>
        </Box>     
    )
}

export default Skills;

