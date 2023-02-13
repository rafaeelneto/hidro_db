import React from 'react';
import { Button } from '@material-ui/core/';

import { useHistory } from 'react-router-dom';

import { ChevronLeft } from 'react-feather';

import styles from './about.module.scss';

export const CreditsPage = () => (
  <div>
    <div className={styles.creditsHeader}>
      <div className={styles.title}>Sobre</div>
      <p className={styles.body}>
        Abaixo todos aqueles que contribuiram para a elaboração do projeto e o preenchimento de
        informações:
      </p>
    </div>
    <div className={styles.creditsContainer}>
      <div className={styles.title}>Elaboração e Desenvolvimento</div>
      <div className={styles.names}>Rafael Gomes</div>
    </div>
  </div>
);

const AboutPage = () => {
  const history = useHistory();

  return (
    <div className={styles.root}>
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
          <CreditsPage />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
