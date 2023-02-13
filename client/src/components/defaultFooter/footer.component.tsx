import React from 'react';

import styles from './footer.module.scss';

export default function Footer() {
  return (
    <footer className={`${styles.footer} ${styles.tile}`}>
      <div className={styles.tileContainer}>
        <div className={styles.creditsWrapper}>
          <span>Créditos e contato</span>
        </div>
      </div>
    </footer>
  );
}
