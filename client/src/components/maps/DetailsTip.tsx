import React from 'react';

import { Button } from '@material-ui/core/';

import { Link } from 'react-router-dom';

import { Info } from 'react-feather';

import styles from './DetailsTip.module.scss';

export default ({ id, data, hidden = true }) => {
  const { main, secundary = '', link, terciary = '' } = data;

  return (
    <div className={styles.root} hidden={hidden}>
      <h2 className={styles.main}>{main}</h2>
      <span className={styles.secundary}>{secundary}</span>
      <span className={styles.terciary}>{terciary}</span>
      <Button
        className={styles.infoBtn}
        size="small"
        startIcon={<Info style={{ position: 'relative' }} />}
        component={Link}
        to={link}
      >
        Visualizar item
      </Button>
    </div>
  );
};
