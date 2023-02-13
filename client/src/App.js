import React, { useState, useEffect } from 'react';
import { Snackbar } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';

import './App.css';

import Alert from './components/alert/alert.component';

import { refreshToken } from './utils/authetication';

import HomePage from './pages/home/home.page';
import LoginPage from './pages/loginPage/login.page';
import ConsolePage from './pages/console/console.page';
import ResetPage from './pages/resetPassword/reset.page';
import NewUserPage from './pages/newUser/newUser.page';
import ForgotPasswordPage from './pages/forgotPassword/forgotPassword.page';
import CustomTheme from './themes/custom_theme';

import AppLoading from './components/loadingComponents/AppLoading.component';

import styles from './App.module.scss';

function App() {
  // const { data, loading } = useQuery(GET_LOGIN_INFO);
  const [refresh, setRefresh] = useState();
  const [showSnackBar, setShowSnackBar] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const res = await refreshToken();
      setRefresh(res);
    };
    if (!refresh) {
      verifyToken();
    }
  }, [refresh]);

  if (refresh === undefined) {
    return (
      <ThemeProvider theme={CustomTheme}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingComponent}>
            <AppLoading />
          </div>
        </div>
      </ThemeProvider>
    );
  }

  window.addEventListener('offline', () => setShowSnackBar(true));
  window.addEventListener('online', () => setShowSnackBar(false));

  return (
    <BrowserRouter>
      <div className="App" style={{ height: '100%' }}>
        <ThemeProvider theme={CustomTheme}>
          <Switch>
            <Route path="/home/" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/reset/:resetToken" component={ResetPage} />
            <Route exact path="/novo-usuario/:resetToken" component={NewUserPage} />
            <Route exact path="/esqueceu-senha" component={ForgotPasswordPage} />
            <Route path="/">
              <ProtectRoutes />
            </Route>
          </Switch>
          <Snackbar open={showSnackBar} onClose={() => setShowSnackBar(false)}>
            <Alert onClose={() => setShowSnackBar(false)} severity="warning">
              Você está offline, verifique sua conexão antes de modificar ou atualizar qualquer
              coisa.
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </div>
    </BrowserRouter>
  );
}

const ProtectRoutes = () => {
  const GET_TOKEN = gql`
    query GetToken {
      userLoggedIn @client
    }
  `;

  const { data } = useQuery(GET_TOKEN);

  const { userLoggedIn } = data;

  // CHECK IF THE USER WAS A VISITING IN LOCALS
  const isUserVisitante = false;
  if (isUserVisitante) {
    // TODO render console visitante
  }

  // Check if the user was logged
  if (!userLoggedIn) {
    // return REDIRECTS TO HOMEPAGE
    return <Redirect to="/home" />;
  }

  return <ConsolePage />;
};

export default App;
