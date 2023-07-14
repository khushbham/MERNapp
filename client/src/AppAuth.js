import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Routes from './components/routing/Routes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './App.css';
// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser,getDropdownValues } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//<h1>Hello world</h1>
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App =() => {

  // A custom theme for this app
const theme = createTheme ({
  palette: {
    primary: {
        main: '#82005e'
    },
    secondary: {
      main: '#6a7187',
    },
    customgrey: {
      main: '#6a7187',
     }
  },
  typography: {
    fontFamily: ['Rubik Regular'].join(','),
    button: {
      textTransform: 'Capitalize',
    },
    body1: {
      fontSize: 13,
    },
    body2: {
      fontSize: 14,
      fontFamily: ['Rubik Medium'].join(','),
    },
    h3: {
      fontFamily: ['Rubik-Semibold'].join(','),
      fontSize: 26,
   },
   h5: {
    fontFamily: ['Rubik Bold'].join(','),
    fontSize: 16,
    color: '#495057',
   },
   h6: {
    fontFamily: ['Rubik Medium'].join(','),
    fontSize: 13,
    color: '#6a7187',
   },
   fntEleven: {
    fontSize: 11,
   },
   fntThirteen: {
    fontSize: 13,
   },
   lightbck:{
    backgroundColor: 'rgba(106, 113, 135, 0.1)',
   }
  }
  
});

  
  useEffect(() => {
    
    if (localStorage.UserRole == 'ADMIN') {
      store.dispatch(loadUser());
      store.dispatch(getDropdownValues());
      //store.dispatch(loadSubUser());
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <Route component={Routes} />
      </Router>
    </Provider>
    </ThemeProvider>
  );
}

export default App;