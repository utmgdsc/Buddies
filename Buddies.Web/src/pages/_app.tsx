import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, {
  useEffect, useMemo, useState,
} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout';
import { fetchToken } from '../api';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchToken().catch((err) => err).finally(() => setLoaded(true));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
        {loaded
          && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
          )}
    </ThemeProvider>
  );
};

export default MyApp;
