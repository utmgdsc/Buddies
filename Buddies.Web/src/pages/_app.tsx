import type { AppProps } from 'next/app';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '../components/Layout';
import { AuthProvider } from '../contexts/authContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
    },
  }), [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default MyApp;
