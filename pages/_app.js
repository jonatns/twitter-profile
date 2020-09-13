import React from 'react';
import { parseCookies, setCookie } from 'nookies';
import { ThemeContext, themes } from '../components/theme-context';

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
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        checked,
      }}
    >
      <Component {...pageProps} />
    </ThemeContext.Provider>
  );
};

export default MyApp;
