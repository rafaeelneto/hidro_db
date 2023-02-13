import React from 'react';
import {
  useTheme,
  makeStyles,
  Box,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Button,
} from '@material-ui/core/';

import { Switch, Route, Link, Redirect, BrowserRouter, useHistory } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { ChevronLeft } from 'react-feather';

import PropTypes from 'prop-types';

import LoadingComponent from '../../components/loadingComponents/loading.component';

import enums from '../../models/enums';

import UsersSettingsComponent from '../../components/userSettings/usersSettings.component';

import styles from './settings.module.scss';

const useStyles = makeStyles((theme) => ({
  tabs: {
    paddingTop: '10px',
    borderRight: `1px solid ${theme.palette.divider}`,
    width: '250px',
    '& .MuiTab-wrapper': {
      alignItems: 'flex-end',
    },
  },
  tabPanel: {
    width: '100%',
  },
  tabPanelBox: {
    padding: '10px 10px 10px 20px',
  },
  [theme.breakpoints.down('md')]: {
    container: {},
  },
}));

function TabPanel({ children, value, index, ...other }) {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div
      role="tabpanel"
      className={classes.tabPanel}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.tabPanelBox} p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const SettingsPage = () => {
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles(theme);

  const GET_DATA = gql`
    query {
      userInfo @client
    }
  `;

  const {
    data: { userInfo },
    loading,
  } = useQuery(GET_DATA);

  if (loading) return <LoadingComponent />;

  const allTabs = [
    {
      label: 'Perfil',
      path: '/perfil',
      component: () => (
        <div>
          <h3>Seu perfil não pode ser configurado ainda</h3>
        </div>
      ),
      show: true,
    },
    {
      label: 'Gerenciar Usuários',
      path: '/gerenciar-usuarios',
      component: () => <UsersSettingsComponent />,
      show: userInfo && enums.createUsersRoles.includes(userInfo.role),
    },
  ];

  return (
    <div className={styles.root}>
      <BrowserRouter basename="/configuracoes">
        <div className={styles.container}>
          <div className={styles.innerContainer}>
            <Button
              className={styles.backBtn}
              startIcon={<ChevronLeft />}
              onClick={() => {
                history.goBack();
              }}
            >
              VOLTAR
            </Button>
          </div>
          <Route
            path="/"
            render={({ location }) => (
              <div className={styles.tabsContainer}>
                <Tabs
                  value={location.pathname}
                  orientation="vertical"
                  variant="scrollable"
                  aria-label="Vertical tabs example"
                  className={classes.tabs}
                >
                  {allTabs
                    .filter((el) => el.show)
                    .map((tab) => (
                      <Tab label={tab.label} value={tab.path} component={Link} to={tab.path} />
                    ))}
                </Tabs>
                <Switch>
                  {allTabs.map((tab) => (
                    <Route path={tab.path}>
                      <TabPanel>{tab.component()}</TabPanel>
                    </Route>
                  ))}
                  <Route exact path="/">
                    <Redirect to={allTabs[0].path} />
                  </Route>
                </Switch>
              </div>
            )}
          />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default SettingsPage;
