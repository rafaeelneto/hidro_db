/* eslint-disable eqeqeq */
import React, { useState } from 'react';

import v8n from 'v8n';

import { Button, Snackbar } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

import { useHistory, Link } from 'react-router-dom';

import Alert from '../../components/alert/alert.component';
import Footer from '../../components/defaultFooter/footer.component';

import { autheticate } from '../../utils/authetication';

import logoHidroDB from '../../assets/logos/logo_hidro_db_horizontal_wbg.svg';

import styles from './login.module.scss';

export default function LoginPage() {
  const history = useHistory();

  const [identifier, setIdentifier] = useState('');
  const [psw, setPsw] = useState('');
  const [idError, setIdError] = useState('');
  const [pswError, setPswError] = useState('');

  const [failure, setFailure] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (idError || pswError) return;

    try {
      const token = await autheticate(identifier, psw);
      if (token) {
        history.push('/');
      }
    } catch (error) {
      if (!error) {
        setFailure(
          'Não foi possível fazer login. Tente novamente mais tarde, se não funcionar entre em contato conosco',
        );
        return;
      }

      const { status } = error;
      if (status === 401 || status == 400) {
        setFailure('Login ou senha incorretos');
        setIdError('Login ou senha incorretos');
        setPswError('Login ou senha incorretos');
      } else if (status == 500 || status) {
        setFailure(
          'Não foi possível fazer login. Tente novamente mais tarde, se não funcionar entre em contato conosco',
        );
      } else {
        setFailure(
          `Erro desconhecido. Recarregue a página e tente novamente 
          mais tarde, se não funcionar entre em contato conosco`,
        );
      }
    }
  };

  const onIdentifier = () => {
    const regexEmail = /^\S+@\S+$/;
    const regexDrt = /^[0-9]{5}-[0-9]{1}$/im;
    const regexLogin = /^([a-z0-9_-]){5,12}$/;
    if (
      !(regexEmail.test(identifier) || regexDrt.test(identifier) || regexLogin.test(identifier))
    ) {
      setIdError('Digite um identificador válido com nome de usuário, email ou mesmo seu DRT');
    }
  };

  const onPsw = () => {
    if (!v8n().string().minLength(6).test(psw)) {
      setPswError('Sua senha deve conter no mínimo dígitos');
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure('')}>
          <Alert onClose={() => setFailure(false)} severity="error">
            {failure}
          </Alert>
        </Snackbar>

        <img className={styles.logoDB} src={logoHidroDB} alt="Logo Hidro-db" />

        <div className={styles.formContainer}>
          <h2>LOGIN</h2>
          <p>Abaixo digite suas credenciais para entrar no Hidro-db</p>

          <form className={styles.pswForm} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              id="identifier"
              label="Login/DRT/Email"
              error={idError}
              helperText={idError}
              value={identifier || ''}
              type="text"
              required
              onChange={({ target }) => setIdentifier(target.value)}
              onBlur={onIdentifier}
              onFocus={() => setIdError('')}
            />
            <TextField
              className={styles.formField}
              id="psw"
              label="Senha"
              error={pswError}
              helperText={pswError}
              type="password"
              value={psw || ''}
              required
              onChange={({ target }) => setPsw(target.value)}
              onBlur={onPsw}
              onFocus={() => setPswError('')}
            />
            <Link className={styles.forgotLink} to="/esqueceu-senha">
              Esqueceu sua senha?
            </Link>
            <Button className={`${styles.submitBtn}`} type="submit">
              Login
            </Button>
          </form>
        </div>
        <Button className={`${styles.homeBtn}`} onClick={() => history.push('/home')}>
          Ir para home page
        </Button>
      </div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
  );
}
