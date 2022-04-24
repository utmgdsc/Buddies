import type { NextPage } from 'next';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import HomePage from '../components/home';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Buddies</title>
    </Head>

    <HomePage/>

  </>
);

export default Home;
