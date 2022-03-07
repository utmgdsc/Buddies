import React from 'react'
import { Card, CardHeader, Typography } from '@mui/material'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container';
import Sidebar from './ProjectSidebar'
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import GroupIcon from '@mui/icons-material/Group';
import CategorySharpIcon from '@mui/icons-material/CategorySharp';
import Avatar from '@mui/material/Avatar';

export default function Dashboard({ inGroup, title,
    location, category, total, curr, desc, pOwner, pEmail }:
    {inGroup: boolean, title: string, location: string,
    category: string, total: number, curr: number, desc: string,
    pOwner: string, pEmail: string}) {

    return (
        <>
            <Grid container justifyContent='center' marginTop={5} spacing={3}>
                <Grid item xs={8}>
                    <Card elevation={10} sx={{height:100}}>
                        <Container sx={{display: 'flex'}}>
                            <Typography variant='h4'>
                                {title}
                            </Typography>
                            {inGroup && <Sidebar />}
                        </Container>

                        <div style={{display: 'flex', marginTop:25, marginLeft:22}}>
                            <LocationOnSharpIcon/>
                            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                                {location}
                            </Typography>
                            <CategorySharpIcon/>   
                            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                                {category}
                            </Typography> 
                            <GroupIcon/> 
                            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                                {curr}/{total}
                            </Typography>                   
                        </div>              
                    </Card>
                </Grid>
                <Grid item xs={2}>
                    <Card elevation={10} sx={{height:100}}>
                        <Avatar sx={{margin: 'auto', marginTop: 1}}/>
                        <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2} align="center">
                                {pOwner}
                        </Typography> 
                        <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2} align="center">
                                {pEmail}
                        </Typography> 
                    </Card>
                </Grid>
            </Grid>

            <Grid container justifyContent='center' marginTop={3} spacing={3}>
                <Grid item xs={10}>
                    <Card elevation={10} sx={{height:300}}>
                        <Container sx={{display: 'flex'}}>
                            <Typography variant='h4'>
                                Description
                            </Typography>
                        </Container>

                        <Container sx={{maxHeight: 200, overflow: 'auto', marginTop:3}}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ wordWrap: 'break-word' }}>
                                {desc}
                            </Typography>
                        </Container>
           
                    </Card>
                </Grid>
            </Grid>
        </>
    )

}