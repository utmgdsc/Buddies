import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from "axios";
import { useEffect, useState } from "react";


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

export default function NotificationBell() {
    const [total, setTotal] = useState(1);
    const [active, setActive] = useState(false);
    
    const checkNew = () => {
        const currNoti:notiObject[] = [];
        getapi
        .get(`${1}/${1}/`)
        .then(({ data } : any) => {
            if (total < data.totalPages) {
                setActive(true);
            } else {
                setActive(false);
            }
            setTotal(data.totalPages);
        })
        .catch((error) => {
            alert(error);
          });
        
        console.log("HI");
      };

      useEffect(() => {
        checkNew();
      }, []);

      setInterval(checkNew, 60000);
   
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