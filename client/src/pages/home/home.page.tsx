import React, { useState, useEffect } from 'react';

import { Button } from '@material-ui/core/';

import { gql, useQuery } from '@apollo/client';
import {
  Switch,
  Route,
  Link,
  Redirect,
  BrowserRouter,
  useHistory,
  useParams,
} from 'react-router-dom';

import logoHidroDB from '../../assets/logos/logo_hidro_db_horizontal_wbg.svg';
import imageHome from '../../assets/images/home.jpg';
import collaborationImg from '../../assets/images/collaboration.png';
import coberturaImg from '../../assets/images/cobertura.jpg';

import { CreditsPage } from '../aboutPage/about.page';
import Footer from '../../components/defaultFooter/footer.component';

import styles from './home.module.scss';

export default function HomePage() {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <Link to="/home">
          <img className={styles.headerLogo} src={logoHidroDB} alt="Logo do projeto Hidro-db" />
        </Link>
        <div className={`${styles.headerContainer} ${styles.tileContainer}`}>
          <Link to="/home/sobre">
            <Button className={`${styles.navBtn}`}>Sobre</Button>
          </Link>
          <Link to="/login">
            <Button className={`${styles.navBtn} ${styles.login_section_btn}`}>
              ENTRAR NA PLATAFORMA
            </Button>
          </Link>
        </div>
      </header>

      <Route exact path="/home">
        <div className={`${styles.heroTile} ${styles.tile}`}>
          <div className={`${styles.tileContainer}`}>
            <img className={styles.heroLogo} src={imageHome} alt="Logo do projeto Hidro-db" />
            <div className={styles.tileTextWrapper}>
              <h1 className={styles.tileTitle}>Dados de qualquer lugar, em qualquer lugar</h1>
              <p className={styles.tileText}>
                Tenha acesso a informações de poços a reservatórios, dados desde construtivos, de
                licenciamento a operacionais. Entre na plataforma, se não tiver acesso nos contate e
                peça credenciais
              </p>
            </div>
          </div>
        </div>

        <div className={`${styles.tile} ${styles.collaborationTile}`}>
          <div className={`${styles.tileContainer} ${styles.collaborationTileContainer}`}>
            <img className={styles.tileImg} src={collaborationImg} alt="Imagem de colaboração" />
            <div className={styles.tileTextWrapper}>
              <h1 className={styles.tileTitle}>Colaboração de todos os funcionários</h1>
              <p className={styles.tileText}>
                O projeto visa melhorar a forma como comunicamos os dados de água e esgoto da "NOME
                DA EMPRESA". Para isso, permite e conta com a colaboração de todos os funcionários
                dos mais diferentes setores da empresa. Faça login como editor ou requisite suas
                crediciais conosco
              </p>
              {/* <Button className={`${styles.navBtn} ${styles.requestCredentials}`}>
              REQUISITE CREDENCIAIS
            </Button> */}
            </div>
          </div>
        </div>
        <div className={`${styles.tile}`}>
          <div className={`${styles.tileContainer} ${styles.collaborationTileContainer}`}>
            <img className={styles.tileImg} src={coberturaImg} alt="Imagem de colaboração" />
            <div className={styles.tileTextWrapper}>
              <h1 className={styles.tileTitle}>Cobertura em todo o estado</h1>
              <p className={styles.tileText}>
                O nosso sistema é uma ferramenta colaborativa e integrada para o gerenciamento de
                informações da "NOME DA EMPRESA" e intenta abranger todo o estado e todos os
                municipios atendidos pela companhia mapeando os seus principais empreendimentos como
                sistemas de captação, reservação e distribuição de água e tratamento de água e
                esgoto
              </p>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/home/sobre">
        <div className={` ${styles.tile}`}>
          <CreditsPage />
        </div>
      </Route>

      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
