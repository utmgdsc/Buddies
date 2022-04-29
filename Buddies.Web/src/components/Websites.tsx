import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

interface Props {
  /**
   * variable to store email of
   * profile
   */
  email: string
}

const Websites: React.FC<Props> = ({ email }:
{ email: string }) => {
  return (
    <Card sx={{
      width: '100%',
      height: 150,
      border: 1,
      alignItems: 'center',
      padding: 2,
      boxShadow: 12,
      marginBottom: 5,
    }}
    >
      <Grid container>
        <Grid item xs={11}>
          <Typography color="inherit" variant="h6" gutterBottom>
            Contact Info
          </Typography>
        </Grid>
        <Grid item xs={1} />
      </Grid>
      <Typography variant="subtitle2" gutterBottom mt={3}>
        Email:
        {' '}
        {email}
      </Typography>
    </Card>
  );
};

export default Websites;
