import React from 'react';
import App, { Container } from 'next/app';
import jsHttpCookie from 'cookie';
import jsCookie from 'js-cookie';

import { ThemeContext, themes } from '../components/theme-context';

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx, req }) {
    let pageProps = {};
    let theme = 'light';

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (ctx.req && ctx.req.headers) {
      const cookies = ctx.req.headers.cookie;
      if (typeof cookies === 'string') {
        const cookiesJSON = jsHttpCookie.parse(cookies);
        if (cookiesJSON.theme && theme !== '') {
          theme = cookiesJSON.theme;
        }
      }
    }

    return { pageProps, theme };
  }

  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(
        state => ({
          theme: state.checked ? themes.light : themes.dark,
          checked: !state.checked
        }),
        () => {
          jsCookie.set(
            'theme',
            this.state.theme === themes.dark ? 'dark' : 'light'
          );
        }
      );
    };

    console.log('theme', props.theme || 'light');

    this.state = {
      theme: themes[props.theme] || themes.light,
      toggleTheme: this.toggleTheme,
      checked: props.theme === 'dark' ? true : false
    };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <ThemeContext.Provider value={this.state}>
          <Component {...pageProps} />
        </ThemeContext.Provider>
      </Container>
    );
  }
}
