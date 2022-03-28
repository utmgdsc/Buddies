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

export default function Home() {
    let currentPage = 0;
    let size = 0;
    const [notis, setNotis] = useState([]);
    
    const loadNotis = () => {
        const currNoti:any[] = [];
        api
          .get(`${currentPage}/${size}/`)
          .then(({ data }) => {
            data.results.forEach((p) => currNoti.push(p.name));
            setNotis((noti:any[]) => [...noti, ...currNoti]);
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
        <div></div>
      );
}