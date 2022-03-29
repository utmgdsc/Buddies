import { Card, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useEffect, useState } from "react";
import CardContent from '@mui/material/CardContent';


const getapi = axios.create({
    baseURL: '/api/v1/notifications/',
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
    'totalPages': number,
    'currentPage': number,
}

export default function Notifications() {
    let currentPage = 0;
    let size = 20;
    const [notis, setNotis] = useState([]);
    const [total, setTotal] = useState(1);
    const loadNotis = () => {
        const currNoti:notiObject[] = [];
        getapi
        .get(`${currentPage}/${size}/`)
        .then(({ data } : any) => {
            setTotal(data.totalPages);
            data.notifications.forEach((p: notiObject) => currNoti.push(p));
            setNotis((noti) => [...noti, ...currNoti]);
        })
        .catch((error) => {
            alert(error);
          });
        currentPage += 1;
      };

    const handleScroll = (e:any) => {
        if (currentPage >= total) {
            return;
        }
        if (Math.ceil(e.target.documentElement.scrollTop + window.innerHeight)
            >= e.target.documentElement.scrollHeight) {
            loadNotis();
        }
    };

    const deleteNoti = (id:number) => {
        fetch('/api/v1/notifications/' + id,
        {
            method: 'DELETE'
        }).then(() => {
            const newNotis = notis.filter((noti: notiObject) => noti.noti_id != id);
            setNotis((newNotis))
        })
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
                    <NotificationsIcon sx={{marginTop: 1.25, fontSize: 40}}/>
                </Container>
                {notis.map((p:notiObject) => {
                    return (
                    <Card sx={{marginBottom: 2, marginTop: 5}}>
                        <Container sx={{display: 'flex', marginLeft: 0}}>
                            <Grid item xs={11}>
                            <Container sx={{display: 'flex', marginLeft: 0}}>
                                <a href={`../Profiles/${p.sender_id}`}>
                                <Avatar sx={{marginRight: 1}}/>
                                </a>
                                <Typography variant="h6" sx={{marginTop: 1}}>
                                    {p.sender_name}
                                </Typography>
                                </Container>
                            </Grid>
                            <Button variant="outlined" color="secondary" onClick={
                                () => deleteNoti(p.noti_id)}
                            >Read</Button>
                        </Container>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{marginTop: 1}}>
                                {p.message}
                            </Typography>
                            {
                            p.noti_type == 'Project' &&
                            <Typography variant="subtitle2">
                                <a href={`../Projects/${p.project_id}`}>
                                    Project Link
                                </a>
                            </Typography>
                            } 
                        </CardContent>
                    </Card>
                    );
                })}
            </Grid>
        </Grid>
    );
}