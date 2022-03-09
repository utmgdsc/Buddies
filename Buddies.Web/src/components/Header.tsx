import React from 'react';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';
import Button from '@material-ui/core/Button';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CustomizedDialogs from './dialog';
import Headerform from './Headerform';
import type { UpdateProf } from '../pages/Profiles/[pid]';

/* Header component of the profile page. Includes the profile pic, name and headline */
const Header = ({
  updateFunc, newProfile, logCheck, fName, lName, hline,
}: { updateFunc: VoidFunction,
  newProfile: UpdateProf, logCheck:boolean | null, fName:string,
  lName:string, hline:string }) => {
  return (
    <Card sx={{
      padding: 2, paddingLeft: 3, width: '100%', height: '90%', marginBottom: 1, backgroundColor: 'primary.dark',
    }}
    >
      <Grid container>
        <Grid container item xs={1} justifyContent="center">
          <Avatar alt="Remy Sharp" src="profile.png" sx={{ width: 74, height: 74 }} />
        </Grid>
        <Grid container item xs={9}>
          <Typography sx={{ marginTop: 5, marginLeft: 2 }} color="inherit" variant="subtitle2" gutterBottom>
            {fName}
            {' '}
            {lName}
            {' '}
            |
            {' '}
            {hline}
            {' '}
            {/* User's name + bio */}
          </Typography>
          {logCheck
            && (
            <CustomizedDialogs color="inherit" topmarg={4}>
              <Headerform
                profileData={newProfile}
                onSubmit={({ firstName, lastName, headline }) => {
                  if (!(firstName === '')) {
                    newProfile.firstName = firstName; // eslint-disable-line no-param-reassign
                  } /* I could've added a required field on the textfield instead
                    of checking for an empty string. But If I did that, the user would
                    have to enter text into all three input when he may just want to
                    update one attribute. */
                  if (!(lastName === '')) {
                    newProfile.lastName = lastName; // eslint-disable-line no-param-reassign
                  }
                  if (!(headline === '')) {
                    newProfile.headline = headline; // eslint-disable-line no-param-reassign
                  }
                  updateFunc();
                }}
              />
            </CustomizedDialogs>
            )}
          {' '}
          {/* if the user isn't logged in, then edit option dissappears */}
        </Grid>
        <Grid container item xs={2} justifyContent="flex-end">

          <CopyToClipboard text="www.testurl.com">
            <Button
              startIcon={<FileCopyIcon />}
              color="inherit"
              variant="contained"
              style={{ marginTop: 10, height: 50, wordWrap: 'break-word' }}
            >
              Share
            </Button>
          </CopyToClipboard>
        </Grid>
      </Grid>
    </Card>
  );
};
export default Header;
