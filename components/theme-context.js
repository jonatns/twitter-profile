import React from 'react';

export const themes = {
  light: {
    primary: '#fff',
    secondary: 'rgb(230, 236, 240)',
    text: 'rgb(20, 23, 26)',
    subText: 'rgb(101, 119, 134)',
    blue: '#1DA1F2',
    headerBorder: '#b0bec5',
    border: 'rgb(204, 214, 221)'
  },
  dark: {
    primary: 'rgb(28, 41, 56)',
    secondary: 'rgb(16, 23, 30)',
    text: '#fff',
    subText: 'rgb(136, 153, 166)',
    blue: '#1DA1F2',
    headerBorder: 'rgba(0, 0, 0, 0.3)',
    border: 'rgb(56, 68, 77)'
  }
};

export const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () => {}
});
