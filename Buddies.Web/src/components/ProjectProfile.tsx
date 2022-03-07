import React from 'react'
import { Card, CardHeader, Typography } from '@mui/material'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container';
import Sidebar from '../Components/ProjectSidebar'
import LocationOnSharpIcon from '@mui/icons-material/LocationOnSharp';
import GroupIcon from '@mui/icons-material/Group';
import CategorySharpIcon from '@mui/icons-material/CategorySharp';

export default function Dashboard() {

    return (
        <Container>
            <Grid container justifyContent='center' marginTop={5} spacing={3}>
                <Grid item xs={10}>
                    <Card elevation={10} sx={{height:100}}>
                        <Container sx={{display: 'flex'}}>
                            <Typography variant='h4'>
                                Project Title
                            </Typography>
                            <Sidebar></Sidebar>
                        </Container>

                        <div style={{display: 'flex', marginTop:25, marginLeft:22}}>
                            <LocationOnSharpIcon/>
                            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                                Toronto, Ontario
                            </Typography>
                            <CategorySharpIcon/>   
                            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                                Computer Science
                            </Typography> 
                            <GroupIcon/> 
                            <Typography variant="body2" color="textSecondary" marginTop={0.6} marginLeft={0.5} marginRight={2}>
                                3/4
                            </Typography>                   
                        </div>              
                    </Card>
                </Grid>
            </Grid>

            <Grid container justifyContent='center' marginTop={5} spacing={3}>
                <Grid item xs={10}>
                    <Card elevation={3} sx={{height:300}}>
                        <Container sx={{display: 'flex'}}>
                            <Typography variant='h4'>
                                Description
                            </Typography>
                        </Container>

                        <Container sx={{maxHeight: 200, overflow: 'auto', marginTop:3}}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ wordWrap: 'break-word' }}>
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
                            </Typography>
                        </Container>
           
                    </Card>
                </Grid>
            </Grid>

        </Container>
    )

}