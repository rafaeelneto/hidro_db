import { createMuiTheme } from '@material-ui/core/styles';

// TODO check other user for custom colors
const theme = {
  palette: {
    primary: {
      main: '#27C4D9',
    },
    secondary: {
      main: '#FF9E2E',
    },
  },
  typography: {
    fontFamily: [
      'Lato',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    latoFontFamily: [
      'Lato',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    button: {
      fontWeight: '600',
      letterSpacing: '2px',
      fontFamily: 'Source Sans Pro',
    },
    // h5: {
    //   fontWeight: '600',
    //   marginBottom: '5px',
    // },
    // body1: {
    //   marginBottom: '5px',
    //   fontSize: '14px',
    // },
  },
};

// @ts-ignore
const customMuiTheme = createMuiTheme(theme);

export default customMuiTheme;
