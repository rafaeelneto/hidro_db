import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core/';
import { useHistory, useLocation } from 'react-router-dom';

import { ChevronsLeft, ChevronUp, ChevronDown } from 'react-feather';

import { sideBarHiddenVar } from '../../graphql/cache';

import styles from './mainSidebar.module.scss';

const MainSideBar = ({ buttons, mobileView }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <nav className={styles.root}>
      {buttons.map((button) => (
        <Tooltip key={button.name} title={button.name} placement="right">
          <IconButton
            key={button.name}
            className={`${styles.button} ${
              pathname.includes(button.path) ? styles.buttonActive : ''
            }`}
            onClick={() => {
              history.push(button.path);
              sideBarHiddenVar(false);
            }}
          >
            {pathname.includes(button.path) ? (
              <button.iconActive className={styles.icon} />
            ) : (
              <button.icon className={styles.icon} />
            )}
          </IconButton>
        </Tooltip>
      ))}
    </nav>
  );
};

export default MainSideBar;
