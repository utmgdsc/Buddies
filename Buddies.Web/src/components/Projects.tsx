import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/* Projects section */
const Projects = () => {
  return (
    <Card sx={{
      width: '100%',
      height: 300,
      maxHeight: '300px',
      border: 1,
      padding: 2,
      boxShadow: 12,
      alignItems: 'center',
      overflowY: 'auto',
    }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography color="inherit" variant="h6" gutterBottom>
            Projects
          </Typography>
        </Grid>

        <Grid item xs={5} />
        <Grid item xs={4}>
          <Typography variant="subtitle2" gutterBottom style={{ marginTop: 90, color: 'grey' }}>
            No Projects
          </Typography>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    </Card>
  );
};
export default Projects;
