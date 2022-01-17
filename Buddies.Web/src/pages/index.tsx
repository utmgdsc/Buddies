import type { NextPage } from 'next';
import Head from 'next/head';
import Typography from '@mui/material/Typography';

const Home: NextPage = () => (
  <>
    <Head>
      <title>Buddies</title>
    </Head>

    <Typography
      variant="h2"
      sx={{
        textAlign: 'center',
      }}
    >
      Buddies
    </Typography>

  </>
);

export default Home;
