import React from 'react';

import { Route, Switch, useRouteMatch } from 'react-router-dom';

import CreateUserComponent from './createUser.component';
import MainUsersPage from './mainUsersPage.components';

import styles from './usersSettings.module.scss';

const UsersSettingsComponent = () => {
  const match = useRouteMatch();
  return (
    <div className={styles.root}>
      <Switch>
        <Route path={`${match.url}/criar-usuario`} component={CreateUserComponent} />
        <Route strict path="/" component={MainUsersPage} />
      </Switch>
    </div>
  );
};

export default UsersSettingsComponent;
