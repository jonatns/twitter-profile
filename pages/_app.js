import React from 'react';
import App from 'next/app';
import jsHttpCookie from 'cookie';
import jsCookie from 'js-cookie';

import { ThemeContext, themes } from '../components/theme-context';

const MyApp = ({ initialTheme, Component, pageProps }) => {
  const [theme, setTheme] = React.useState(
    themes[initialTheme] || themes.light
  );
  const [checked, setChecked] = React.useState(
    initialTheme === 'dark' ? true : false
  );

  const toggleTheme = () => {
    const newTheme = checked ? 'light' : 'dark';
    setTheme(themes[newTheme]);
    setChecked(!checked);
    jsCookie.set('theme', newTheme);
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

MyApp.getInitialProps = async (appContext) => {
  let initialTheme = 'light';

  const appProps = await App.getInitialProps(appContext);

  if (appContext.ctx.req && appContext.ctx.req.headers) {
    const cookies = appContext.ctx.req.headers.cookie;
    if (typeof cookies === 'string') {
      const cookiesJSON = jsHttpCookie.parse(cookies);
      if (cookiesJSON.theme) {
        initialTheme = cookiesJSON.theme;
      }
    }
  }

  return { ...appProps, initialTheme };
};

export default MyApp;
