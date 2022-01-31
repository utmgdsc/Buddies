import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button'

{/* Buddy Score component. The buddy score will be passed in as a prop
*/}
const BScore = ( {score} ) => {  
    return (
        <Box p = {2} boxShadow={12} sx={{ width: '75%', height: 60, backgroundColor: 'white', border: 1, alignItems: "center"}}>
            <Grid container > 
                <Grid item>
                    <Typography  sx={{ marginTop: 1 }} variant="subtitle2" gutterBottom>
                        Buddy Score
                    </Typography> 
                </Grid>
                <Grid item>
                    <Button variant="contained" style={{marginLeft: 60, color: 'white', backgroundColor: "green", maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px'}}>
                        {score}
                    </Button>
                </Grid>
            </Grid>
        </Box>     
    )
}
export default BScore;

