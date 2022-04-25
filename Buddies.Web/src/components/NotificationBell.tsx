import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from 'axios';
import { useEffect, useState } from 'react';

const NotificationBell = () => {
  const [active, setActive] = useState(false);

  const checkNew = () => {
    axios
      .get('/api/v1/notifications/1/1/')
      .then(({ data } : any) => {
        if (data.notifications.length !== 0) {
          if (data.notifications[0].isRead === false) {
            setActive(true);
          } else {
            setActive(false);
          }
        } else {
          setActive(false);
        }
      });
  };

  useEffect(() => {
    checkNew();
  }, []);

  setInterval(checkNew, 10000);

  return (
    <>
      {
            active === true
            && <NotificationsActiveIcon />
        }
      {
            active === false
            && <NotificationsNoneIcon />
        }
    </>
  );
};

export default NotificationBell;
