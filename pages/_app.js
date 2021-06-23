import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { parseCookies, setCookie } from 'nookies';
import { ThemeContext, themes } from '../components/theme-context';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
  const cookies = parseCookies();

  const [theme, setTheme] = React.useState(
    themes[cookies.theme] || themes.light
  );
  const [checked, setChecked] = React.useState(cookies.theme === 'dark');

  const toggleTheme = () => {
    const newTheme = checked ? 'light' : 'dark';
    setTheme(themes[newTheme]);
    setChecked(!checked);
    setCookie(null, 'theme', newTheme, {
      maxAge: 30 * 24 * 60 * 60,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme,
          checked,
        }}
      >
        <Component {...pageProps} />
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};

export default MyApp;
