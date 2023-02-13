import React, { useState } from 'react';

import { Button, Snackbar } from '@material-ui/core/';
import TextField from '@material-ui/core/TextField';

import { useParams, useHistory } from 'react-router-dom';

import v8n from 'v8n';

import Alert from '../../components/alert/alert.component';
import Footer from '../../components/defaultFooter/footer.component';

import { APIPatch, API_ENDPOINTS } from '../../utils/fetchRestful';

import styles from './reset.module.scss';

import logoHidroDB from '../../assets/logos/logo_hidro_db_horizontal_wbg.svg';

export default function ResetPassword() {
  const { resetToken } = useParams();
  const history = useHistory();

  const [psw, setPsw] = useState('');
  const [pswConfirm, setPswConfirm] = useState('');
  const [pswError, setPswError] = useState('');
  const [pswConfirmError, setPswConfirmError] = useState('');

  const [sucess, setSucess] = useState(false);
  const [failure, setFailure] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    if (pswError || pswConfirmError) return;

    const data = { psw, pswConfirm };

    APIPatch(`${API_ENDPOINTS.RESET_PASSWORD}/${resetToken}`, data)
      .then(() => {
        setSucess(true);
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      })
      .catch(() => {
        setFailure(true);
      });
  }

  const onPsw = () => {
    if (!v8n().string().minLength(6).test(psw)) {
      setPswError('Digite uma senha com no mínimo 6 caracteres');
    }
  };

  const onPswConfirm = () => {
    if (!v8n().string().minLength(6).test(pswConfirm) || psw !== pswConfirm) {
      setPswConfirmError('As duas senhas devem ser iguais');
    }
  };

  return (
    <div className={styles.root}>
      <Snackbar open={sucess} autoHideDuration={3000} onClose={() => setSucess(false)}>
        <Alert onClose={() => setSucess(false)} severity="success">
          Sua senha foi alterada. Você será redirecionado para fazer login
        </Alert>
      </Snackbar>

      <Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure(false)}>
        <Alert onClose={() => setFailure(false)} severity="error">
          Não foi possível alterar sua senha. Tente novamente, se não funcionar entre em contato
          conosco.
        </Alert>
      </Snackbar>
      <div className={styles.container}>
        <img className={styles.logoDB} src={logoHidroDB} alt="Logo Hidro-db" />

        <div className={styles.formContainer}>
          <h2>Recuperação de senha</h2>
          <p>Abaixo configure sua nova senha</p>

          <form className={styles.pswForm} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              className={styles.formField}
              id="psw"
              label="Senha"
              error={pswError}
              helperText={pswError}
              value={psw || ''}
              type="password"
              required
              onChange={({ target }) => setPsw(target.value)}
              onBlur={onPsw}
              onFocus={() => setPswError('')}
            />
            <TextField
              className={styles.formField}
              id="pswConfirm"
              label="Confirmação da Senha"
              error={pswConfirmError}
              helperText={pswConfirmError}
              type="password"
              value={pswConfirm || ''}
              required
              onChange={({ target }) => setPswConfirm(target.value)}
              onBlur={onPswConfirm}
              onFocus={() => setPswConfirmError('')}
            />
            <Button className={`${styles.submitBtn}`} type="submit">
              configurar nova senha
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
