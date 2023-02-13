import React from 'react';
import { Button, Divider } from '@material-ui/core/';
import { useHistory, useRouteMatch, useLocation } from 'react-router-dom';

import styles from './subSidebar.module.scss';

const SubSideBar = ({ subRoutes }) => {
  const history = useHistory();
  const { path } = useRouteMatch();
  const { pathname } = useLocation();

  return (
    <nav className={styles.root}>
      {subRoutes.map((item) => (
        <div className={styles.btnContainer}>
          <Button
            key={item.path}
            className={`${styles.btn} ${pathname.includes(item.path) ? styles.btnActive : ''}`}
            onClick={() => history.push(path + item.path)}
          >
            {item.name}
          </Button>
          {item.lastMain ? <Divider /> : ''}
        </div>
      ))}
    </nav>
  );
};

export default SubSideBar;
