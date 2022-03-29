import React from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import type { Projectobject } from '../pages/Profiles/[pid]';
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
/* Projects section */
const Projects = ({ projectlist }: { projectlist: Projectobject[] }) => {
  return (
    <Card sx={{
      width: '100%',
      minHeight: 300,
      border: 1,
      padding: 2,
      boxShadow: 12,
      overflowY: 'auto',
    }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography color="inherit" variant="h6" gutterBottom>
            Projects
          </Typography>
        </Grid>
        {projectlist.map((project) => {
          return (
            <Grid item xs={12} key={project.projectId}> 
              <Card sx={{marginTop: 1, marginBottom: 2, maxHeight: '180px'}}>
                <CardActionArea href={`../projects/${project.projectId}`}>
                  <Grid container> 
                    <Typography variant="body1" color="textSecondary" marginTop={0.6} marginLeft={2} marginRight={2} style={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    <LocationOnSharpIcon sx={{marginTop:0, marginLeft:-1}}/>
                    <Typography variant="body2" color="textSecondary" marginTop={0.9} marginLeft={0.5} marginRight={2}>
                      {project.location}
                    </Typography>
                  </Grid>
                  <Typography variant="body2" color="textSecondary" marginTop={0} marginLeft={2} marginRight={2}>
                      {project.currentMembers} members
                  </Typography>
                  <Typography variant="body2" color="textSecondary" marginTop={1.5} marginLeft={2} marginRight={2} style={{textOverflow:"ellipsis", overflow: 'hidden', display: "-webkit-box", "-webkit-line-clamp": '4', "-webkit-box-orient": "vertical"}}>
                      {project.description}
                  </Typography>
                </CardActionArea>
              </Card>
            </Grid>
          );
          })}
        { projectlist.length === 0 &&
          <>
          <Grid item xs={5} />
          <Grid item xs={4}>
            <Typography variant="subtitle2" gutterBottom style={{ marginTop: 90, color: 'grey' }}>
              No Projects
              
            </Typography>
            
          </Grid>
          <Grid item xs={4} />
          </>
        }
      </Grid>
    </Card>
  );
};
export default Projects;
