import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button'

{/* Buddy Score component. The buddy score will be passed in as a prop
*/}
const BScore = ( {score} ) => {  
    return (
        <Box p = {2} boxShadow={12} sx={{ width: '100%', height: 60, backgroundColor: 'white', border: 1, alignItems: "center", paddingRight: 3}}>
            <Grid container > 
                <Grid item xs={11}>
                    <Typography variant="h6" gutterBottom>
                        Buddy Score
                    </Typography> 
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" style={{color: 'white', backgroundColor: "green", maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                        {score}
                    </Button>
                </Grid>
            </Grid>
        </Box>     
    )
}
export default BScore;

