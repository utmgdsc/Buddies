import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Grid from '@mui/material/Grid';
import axios from 'axios';

import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

/* Notification page. Displays a list of notifications
   for the logged in user.
*/

type NotiObject = {
  'notificationId': number,
  'message': string,
  'senderId': number,
  'senderName': string,
  'projectId': number,
  'isRead': boolean,
  'timeCreated': string
};

const Notifications = () => {
  let currentPage = 1;
  const size = 20;
  const [notis, setNotis] = useState<NotiObject[]>([]);
  const [isBot, setIsBot] = useState<boolean>(false);
  const loadNotis = () => {
    const currNoti:NotiObject[] = [];
    axios
      .get(`/api/v1/notifications/${currentPage}/${size}/`)
      .then(({ data } : any) => {
        if (data.totalPages === data.currentPage) {
          setIsBot(true);
        }
        data.notifications.forEach((p: NotiObject) => currNoti.push(p));
        setNotis((noti : NotiObject[]) => [...noti, ...currNoti]);
      })
      .catch(() => {
        alert('Uh oh, something went wrong...');
      });
    currentPage += 1;
  };

  const handleScroll = (e: any) => {
    if (isBot) {
      return;
    }
    if (Math.ceil(e.target.documentElement.scrollTop + window.innerHeight)
            >= e.target.documentElement.scrollHeight) {
      loadNotis();
    }
  };

  const deleteNoti = (id:number, e:NotiObject, index:number) => {
    axios.put(`/api/v1/notifications/read/${id}`)
      .then(() => {
        const newNotis:NotiObject[] = [...notis];
        e.isRead = true;
        newNotis[index] = e;
        setNotis((newNotis));
      });
  };

  useEffect(() => {
    loadNotis();
    window.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <Grid container justifyContent="center" marginTop={3} spacing={3}>
      <Grid item xs={6}>
        <Container sx={{ display: 'flex' }}>
          <Typography variant="h3">
            Notifications
          </Typography>
          <NotificationsIcon sx={{ marginTop: 1.25, fontSize: 40 }} />
        </Container>
        {notis.map((p:NotiObject, index) => {
          return (
            <Card sx={{ marginBottom: 2, marginTop: 5, color: p.isRead ? 'gray' : 'default' }}>
              <Container sx={{ display: 'flex', marginLeft: 0 }}>
                <Grid item xs={11}>
                  <Container sx={{ display: 'flex', marginLeft: -2 }}>
                    <a href={`../profiles/${p.senderId}`}>
                      <Avatar sx={{ marginTop: 2 }} />
                    </a>
                    <Container>
                      <Typography variant="h6" sx={{ marginTop: 1 }}>
                        {p.senderName}
                      </Typography>
                      <Typography variant="caption">
                        {p.timeCreated}
                      </Typography>
                    </Container>
                  </Container>
                </Grid>
                {
                            p.isRead === false
                            && (
                            <Button
                              variant="outlined"
                              color="secondary"
                              onClick={
                                () => deleteNoti(p.notificationId, p, index)
}
                            >
                              Read
                            </Button>
                            )
                            }
              </Container>
              <CardContent sx={{ marginLeft: 2 }}>
                <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                  {p.message}
                </Typography>
                <CardActionArea href={`../projects/${p.projectId}`}>
                  <Typography variant="subtitle2">
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
};

export default Notifications;
