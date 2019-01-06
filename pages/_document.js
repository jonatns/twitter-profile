import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import flush from 'styled-jsx/server';
import { AppRegistry } from 'react-native';

// Force Next-generated DOM elements to fill their parent's height.
// Not required for using of react-native-web, but helps normalize
// layout for top-level wrapping elements.
const normalizeNextElements = `
  body > div:first-child,
  #__next {
    height: 100%;
  }
`;

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent('Main', () => Main);
    const { getStyleElement } = AppRegistry.getApplication('Main');

    const page = renderPage();
    const styles = [
      <style key="_next-styles" dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
      getStyleElement({ key: '_react-native-web-styles' })
    ];
    return { ...page, styles };
  }

  render() {
    const styles = flush();

    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          {styles}
        </Head>
        <body>
          <Main />
          <NextScript />
          <style jsx>{`
            :global(html) {
              font-size: 15px !important;
              fontfamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif' !important;
            }
            :global(body) {
              height: 100%;
              width: 100%;
              overflow-y: scroll;
              overscroll-behavior-y: none;
              background-color: #fff;
            }
          `}</style>
        </body>
      </html>
    );
  }
}
