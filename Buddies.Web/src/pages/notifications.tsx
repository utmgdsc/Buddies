import { Card, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import axios from "axios";
import { useEffect, useState } from "react";
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';


// const getapi = axios.create({
//     baseURL: '/api/v1/notifications/',
//     headers: {
//         Accept: 'application/json',
//         'Content-type': 'application/json',
//     },
// });

type notiObject = {
    'notificationId': number,
    'message': string,
    'senderId': number,
    'senderName': string,
    'projectId': number,
    'isRead': boolean,
    'timeCreated': string
};

type notiList = {
    'notifications': notiObject[],
    'totalPages': number,
    'currentPage': number,
}

export default function Notifications() {
    let currentPage = 1;
    let size = 20;
    const [notis, setNotis] = useState<notiObject[]>([]); 
    console.log(notis)
    const [bot, setBot] = useState<boolean>(false);
    const loadNotis = () => {
        const currNoti:notiObject[] = [];
        axios
        .get(`/api/v1/notifications/${currentPage}/${size}/`)
        .then(({ data } : any) => {
            if (data.totalPages == data.currentPage) {
                setBot(true);
            }
            data.notifications.forEach((p: notiObject) => currNoti.push(p));
            setNotis((noti) => [...noti, ...currNoti]);
        })
        .catch((error) => {
            alert(error);
          });
        currentPage += 1;
      };

    const handleScroll = (e:any) => {
        if (bot) {
            return;
        }
        if (Math.ceil(e.target.documentElement.scrollTop + window.innerHeight)
            >= e.target.documentElement.scrollHeight) {
            loadNotis();
        }
    };

    const deleteNoti = (id:number, e:notiObject, index:number) => {
        axios.put('/api/v1/notifications/read/' + id)
        .then(() => {
            let newNotis:notiObject[] = [...notis];
            e.isRead = true;
            newNotis[index] = e;
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
                {notis.map((p:notiObject, index) => {
                    return (
                    <Card sx={{marginBottom: 2, marginTop: 5, color: p.isRead ? "gray" : "default"}}>
                        <Container sx={{display: 'flex', marginLeft: 0}}>
                            <Grid item xs={11}>
                            <Container sx={{display: 'flex', marginLeft: -2}}>
                                <a href={`../Profiles/${p.senderId}`}>
                                <Avatar sx={{marginTop: 2}}/>
                                </a>
                                <Container>
                                    <Typography variant="h6" sx={{marginTop: 1}}>
                                        {p.senderName}
                                    </Typography>
                                    <Typography variant="caption" >
                                        {p.timeCreated}
                                    </Typography>
                                </Container>
                            </Container>
                            </Grid>
                            {
                            p.isRead == false &&
                            <Button variant="outlined" color="secondary" onClick={
                                () => deleteNoti(p.notificationId, p, index)}
                            >Read</Button>
                            }
                        </Container>
                        <CardContent sx={{marginLeft: 2}}>
                            <Typography variant="subtitle2" sx={{marginTop: 1}}>
                                {p.message}
                            </Typography>
                            <CardActionArea href={`../projects/${p.projectId}`}>
                                <Typography variant="subtitle2" >
                                    Project Link
                                </Typography>
                            </CardActionArea>
                        </CardContent>
                    </Card>
                    );
                })}
            </Grid>
        </Grid>
    );
}