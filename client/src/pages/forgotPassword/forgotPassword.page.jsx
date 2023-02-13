import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Button, Snackbar } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

import Alert from '../../components/alert/alert.component';
import Footer from '../../components/defaultFooter/footer.component';

import { APIPatch, API_ENDPOINTS } from '../../utils/fetchRestful';

import styles from './forgotPassword.module.scss';

import logoHidroDB from '../../assets/logos/logo_hidro_db_horizontal_wbg.svg';

export default function ResetPassword() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [sucess, setSucess] = useState(false);
  const [failure, setFailure] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (emailError) return;

    const data = { email };

    APIPatch(`${API_ENDPOINTS.FORGOT_PASSWORD}`, data)
      .then(() => {
        setSucess(true);
      })
      .catch(() => {
        setFailure(true);
      });
  }

  const onEmail = () => {
    const regexEmail = /^\S+@\S+$/;
    if (!regexEmail.test(email)) {
      setEmailError('Digite um email válido');
    }
  };

  return (
    <div className={styles.root}>
      <Snackbar open={sucess} autoHideDuration={6000} onClose={() => setSucess(false)}>
        <Alert onClose={() => setSucess(false)} severity="success">
          Cheque seu email para verificar as instruções para recuperar sua senha
        </Alert>
      </Snackbar>

      <Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure(false)}>
        <Alert onClose={() => setFailure(false)} severity="error">
          Não foi possível alterar sua senha. Verifique se seu email está correto
        </Alert>
      </Snackbar>
      <div className={styles.container}>
        <img className={styles.logoDB} src={logoHidroDB} alt="Logo Hidro-db" />

        <div className={styles.formContainer}>
          <h2>Recuperação de senha</h2>
          <p>
            Informe seu email para onde, caso esteja cadastrado, enviaremos as instruções para
            recuperar sua senha
          </p>

          <form className={styles.pswForm} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              label="Email"
              error={emailError}
              helperText={emailError}
              value={email || ''}
              required
              onChange={({ target }) => setEmail(target.value)}
              onBlur={onEmail}
              onFocus={() => setEmailError('')}
            />
            <Button className={`${styles.submitBtn}`} type="submit">
              REQUISITAR MUDANÇA DE SENHA
            </Button>
          </form>
        </div>
        <Button className={`${styles.homeBtn}`} onClick={() => history.push('/home')}>
          Ir para home page
        </Button>
      </div>
      <Footer />
    </div>
  );
}
