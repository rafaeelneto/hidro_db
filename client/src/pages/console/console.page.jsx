import React, { useState, useEffect } from 'react';
import { useTheme, makeStyles, Box, Snackbar, Collapse, IconButton } from '@material-ui/core/';
import { Route, Switch, Redirect } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';

import { ErrorBoundary } from 'react-error-boundary';

import { ChevronsLeft, ChevronsUp, ChevronsDown } from 'react-feather';

import CollapseSide from '../../themes/CollapseSide';

import MainSideBar from '../../components/main_sidebar/mainSidebar.component';
import SubSideBar from '../../components/sub_sidebar/subSidebar.component';
import Header from '../../components/header/header.component';

import Alert from '../../components/alert/alert.component';

import SettingsPage from '../settingsPage/settings.page';
import AboutPage from '../aboutPage/about.page';

import routesCategories from './routes';
import LoadingComponent from '../../components/loadingComponents/loading.component';

import mainFallbackComponent from '../../components/fallbackComponent/mainFallbackComponent';

import MunicipiosInfo from '../../components/municipios/municipios.component';

import { isLoadingVar, isSucessVar, sucessMsgVar, sideBarHiddenVar } from '../../graphql/cache';

import styles from './console.module.scss';

const SIDEBAR_WIDTH = '250px';

const useStyles = makeStyles((theme) => ({
  mainCanvas: {
    padding: '2px',
    flexGrow: 1,
    overflow: 'scroll',
  },
}));

const LOCAL_QUERY = gql`
  query IsUserLoggedIn {
    sideBarHidden @client
    isLoading @client
    isSucess @client
    sucessMsg @client
  }
`;

export default function ConsolePage() {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { mobileView, drawerOpen } = state;

  const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
  const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

  useEffect(() => {
    // eslint-disable-next-line no-confusing-arrow
    const setResponsiveness = () =>
      window.innerWidth < 768
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    setResponsiveness();
    window.addEventListener('resize', () => setResponsiveness());

    if (window.innerWidth < 768) {
      sideBarHiddenVar(true);
    }
  }, []);

  const { data } = useQuery(LOCAL_QUERY);
  let sideBarHidden = false;
  let isLoading = false;
  let isSucess = false;
  let sucessMsg = '';
  if (data) {
    sideBarHidden = data.sideBarHidden;
    isLoading = data.isLoading;
    isSucess = data.isSucess;
    sucessMsg = data.sucessMsg;
  } else {
    return <LoadingComponent />;
  }

  const onCloseSnackbar = () => {
    isLoadingVar(false);
    isSucessVar(false);
    sucessMsgVar('');
  };

  const snackbarMsg = () => {
    if (isSucess) return sucessMsg || 'Sucesso';

    if (isLoading) return 'Carregando...';
    return 'Carregando...';
  };

  return (
    <div className={styles.root}>
      <Header mobileView={state.mobileView} />
      <Snackbar
        open={isLoading || isSucess}
        autoHideDuration={isSucess ? 5000 : 1000}
        onClose={onCloseSnackbar}
      >
        <Alert onClose={onCloseSnackbar} severity={isSucess ? 'success' : 'info'}>
          {snackbarMsg()}
        </Alert>
      </Snackbar>
      <div className={styles.panel}>
        <Switch>
          <Route path="/configuracoes">
            <SettingsPage />
          </Route>
          <Route path="/sobre">
            <AboutPage />
          </Route>
          <Route path="/">
            <Box className={styles.panelContainer} boxShadow={2}>
              <aside className={styles.sidebar}>
                {state.mobileView ? (
                  <IconButton
                    className={`${styles.collapseBtn} ${
                      sideBarHidden ? styles.collapseBtnRotate : ''
                    }`}
                    onClick={() => {
                      sideBarHiddenVar(!sideBarHidden);
                    }}
                  >
                    {sideBarHidden ? (
                      <ChevronsUp className={styles.icon} />
                    ) : (
                      <ChevronsDown className={styles.icon} />
                    )}
                  </IconButton>
                ) : (
                  ''
                )}
                <div className={styles.mainSidebar}>
                  <MainSideBar
                    buttons={routesCategories.map((route) => ({
                      path: route.path,
                      name: route.name,
                      ...route.icons,
                    }))}
                    mobileView={state.mobileView}
                  />
                </div>

                {state.mobileView ? (
                  <Collapse in={!sideBarHidden}>
                    <div
                      className={`${styles.subRoutesSidebar} ${
                        !sideBarHidden ? styles.showSubsidebar : ''
                      }`}
                    >
                      <Switch>
                        {routesCategories.map(({ path: routePath, subRoutes }, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Route key={index} path={routePath}>
                            <SubSideBar subRoutes={subRoutes} />
                          </Route>
                        ))}
                      </Switch>
                    </div>
                  </Collapse>
                ) : (
                  <CollapseSide in={!sideBarHidden} size={SIDEBAR_WIDTH}>
                    <div className={styles.subRoutesSidebar}>
                      <Switch>
                        {routesCategories.map(({ path: routePath, subRoutes }, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <Route key={index} path={routePath}>
                            <SubSideBar subRoutes={subRoutes} />
                          </Route>
                        ))}
                      </Switch>
                    </div>
                  </CollapseSide>
                )}
              </aside>
            </Box>
            <ErrorBoundary FallbackComponent={mainFallbackComponent}>
              <div className={classes.mainCanvas}>
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/agua" />
                  </Route>
                  {routesCategories.map((route, index) => (
                    <Route key={index} path={route.path}>
                      {route.innerRouter(index)}
                    </Route>
                  ))}
                </Switch>
              </div>
            </ErrorBoundary>
          </Route>
        </Switch>
      </div>
    </div>
  );
}
