import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CustomizedDialogs from './dialog';
import type { UpdateProf } from '../pages/profiles/[pid]';
import Skillform from './Skillform';
import { ProjectProfileResponse } from '../api/model/projectProfileResponse';

/* Skills component. */
const Skills = ({ updateFunc, newProfile, logCheck }: { updateFunc: VoidFunction,
  newProfile: UpdateProf | ProjectProfileResponse, logCheck: boolean | null }) => {
  let userOrProject: boolean = newProfile.members ? true : false
  return (
    <Card sx={{
      width: '100%', height: '30%', border: 1, alignItems: 'center', padding: 2, boxShadow: 12,
    }}
    >
      <Grid container>
        <Grid item xs={11}>
          <Typography color="inherit" variant="h6" gutterBottom>
            {userOrProject ? 'Skills Required' : 'Skills'}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {logCheck
                        && (
                        <CustomizedDialogs color="inherit" topmarg={0}>
                          <Skillform submitFunc={updateFunc} profileData={newProfile} />

                        </CustomizedDialogs>
                        )}
          {' '}
          {/* Only a logged in user has access to edit */}

        </Grid>
      </Grid>
      <Typography variant="subtitle2" gutterBottom>
        <Grid container>
          {newProfile.skills?.map((skill) => {
            return (
              <div className="skills" key={skill.id + 1}>
                {' '}
                {/* We have another list that is being rendered in the skilllist
                component. So to make the keys different for this list,
                we can just add one to each id.  */}
                <Box
                  p={2}
                  m={1}
                  sx={{
                    border: 1,
                    borderRadius: 8,
                    height: userOrProject ? '50%' : '10%',
                    paddingTop: 0,
                    marginBottom: userOrProject ? 0 : -2,
                    marginRight: 0,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontSize={userOrProject ? 25 : 12}>
                    {skill.name}
                  </Typography>
                </Box>
              </div>
            );
          })}
        </Grid>
      </Typography>
    </Card>
  );
};

export default Skills;
