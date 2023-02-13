import React from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

import { ReactComponent as LogoDb } from '../../assets/logos/logo_hidro_db_wbg.svg';

import styles from './AppLoading.module.scss';

export default function AppLoading() {
  return (
    <div className={styles.loadingContainer}>
      <Box className={styles.containers}>
        <LogoDb className={styles.logo} />
      </Box>
      <Box className={`${styles.containers} `} width="100%">
        <LinearProgress variant="indeterminate" />
      </Box>
      <Box className={styles.containers}>Carregando aplicação...</Box>
    </div>
  );
}
