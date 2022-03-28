import { Card, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import CardActionArea from '@mui/material/CardActionArea';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useEffect, useState } from "react";


const api = axios.create({
    baseURL: '/api/v1/projects/notifications/',
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
    },
});

type notiObject = {
    'noti_id': number,
    'message': string,
    'sender_id': number,
    'sender_name': string,
    'project_id': number,
    'noti_type': string,
};

type notiList = {
    'notifications': notiObject[],
    'totalpages': number,
    'currentPage': number,
}

export default function Home() {
    let currentPage = 0;
    let size = 20;
    const [notis, setNotis] = useState([]);
    
    const loadNotis = () => {
        const currNoti:notiObject[] = [];
        api
        .get(`${currentPage}/${size}/`)
        .then(({ data } : any) => {
        data.notifications.forEach((p: notiObject) => currNoti.push(p));
        setNotis((noti: any) => [...noti, ...currNoti]);
        });
        currentPage += 1;
      };

    const handleScroll = (e:any) => {
        console.log(e.type)
        if (Math.ceil(e.target.documentElement.scrollTop + window.innerHeight)
            >= e.target.documentElement.scrollHeight) {
            loadNotis();
        }
    };

    useEffect(() => {
        loadNotis();
        window.addEventListener("scroll", handleScroll);
      }, []);

    return (
        <Grid container justifyContent="center" marginTop={3} spacing={3}>
            <Grid item xs={6}>
                <Container sx={{ display: 'flex' }}> 
                    <Typography variant="h3">
                        Notifications
                    </Typography>
                    <NotificationsIcon sx={{marginBottom: 1, fontSize: 40}}/>
                </Container>
                {notis.map((p:notiObject) => {
                    return (
                    <Card sx={{marginBottom: 2, marginTop: 5}}>
                        <Container sx={{display: 'flex', marginLeft: 0}}>
                            <a href={`../Profiles/${p.sender_id}`}>
                            <Avatar sx={{marginRight: 1}}/>
                            </a>
                            <Typography variant="h6" sx={{marginTop: 1}}>
                                {p.sender_name}
                            </Typography>
                        </Container>
                        <Typography variant="h5" sx={{marginTop: 1}}>
                            {p.message}
                        </Typography>
                        {
                        p.noti_type == 'Project' &&
                        <Typography>
                            <a href={`../Projects/${p.project_id}`}>
                                Project Link
                            </a>
                        </Typography>
                        } 
                    </Card>
                    );
                })}
            </Grid>
        </Grid>
    );
}