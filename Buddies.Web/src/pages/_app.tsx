import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, {
  useEffect, useMemo, useReducer, useState,
} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout';
import {
  AuthAction, AuthContext, authReducer, AuthState,
} from '../contexts/authContext';
import { fetchToken } from '../api';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  const [loaded, setLoaded] = useState(false);
  const [authState, dispatch] = useReducer(authReducer, null);

  useEffect(() => {
    fetchToken().then((res) => {
      dispatch({ type: 'LOGIN', data: res });
    }).catch((err) => err).finally(() => setLoaded(true));
  }, []);

  const authContext = useMemo<[AuthState | null, React.Dispatch<AuthAction>]>(
    () => [authState, dispatch],
    [authState],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AuthContext.Provider value={authContext}>
        {loaded
          && (
          <Layout>
            <Component {...pageProps} />
          </Layout>
          )}
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default MyApp;
