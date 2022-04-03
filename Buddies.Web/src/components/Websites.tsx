import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CustomizedDialogs from './dialog';

interface Props {
  /**
   * variable to track whether a user is logged in
   * and viewing his profile
   */
  isViewingOwnProfile: boolean | null
}

const Websites: React.FC<Props> = ({ isViewingOwnProfile }:
{ isViewingOwnProfile: boolean | null }) => {
  return (
    <Card sx={{
      width: '100%',
      height: 207,
      border: 1,
      alignItems: 'center',
      padding: 2,
      boxShadow: 12,
    }}
    >
      <Grid container>
        <Grid item xs={11}>
          <Typography color="inherit" variant="h6" gutterBottom>
            Websites
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {isViewingOwnProfile && <CustomizedDialogs color="inherit" topmarg={0}>{undefined}</CustomizedDialogs>}
        </Grid>
      </Grid>
      <Typography variant="subtitle2" gutterBottom>
        ...
      </Typography>
    </Card>
  );
};

export default Websites;
