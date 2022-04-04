import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from "axios";
import { useEffect, useState } from "react";


type notiObject = {
    'notificationId': number,
    'message': string,
    'senderId': number,
    'senderName': string,
    'projectId': number,
    'isRead': boolean,
    'timeCreated': string,
};

type notiList = {
    'notifications': notiObject[],
    'totalPages': number,
    'currentPage': number,
}

export default function NotificationBell() {
    const [active, setActive] = useState(false);
    
    const checkNew = () => {
        const currNoti:notiObject[] = [];
        axios
        .get(`/api/v1/notifications/1/1/`)
        .then(({ data } : any) => {
            if (data.notifications.length != 0) {
                if (data.notifications[0].isRead == false) {
                    setActive(true);
                } else {
                    setActive(false);
                }
            } else {
                setActive(false);
            }
        })
        .catch((error) => {
            alert(error);
          });
      };

      useEffect(() => {
        checkNew();
      }, []);

      setInterval(checkNew, 10000);
   
    return (
        <>
        {
            active == true &&
            <NotificationsActiveIcon/>
        } 
        {
            active == false &&
            <NotificationsNoneIcon/>
        }
        </>
    );
}