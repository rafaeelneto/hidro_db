import React, { useState } from 'react';

import { useLazyQuery, gql } from '@apollo/client';

import { useHistory } from 'react-router-dom';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { makeStyles, TextField, Snackbar, Button } from '@material-ui/core/';

import v8n from 'v8n';

import { CircularProgressWithLabel } from '../loadingComponents/loadingsComponents';

import Alert from '../alert/alert.component';

import { API_ENDPOINTS, APIPostAuth } from '../../utils/fetchRestful';

import enumsOptions from '../../models/enums';

const useStylesCreateComponent = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  confirmBtn: {
    color: 'white',
    margin: '15px 0 15px 0',
  },
  cancelBtn: {
    color: theme.palette.danger,
  },
}));

const CHECK_USER_LOGIN = gql`
  query($item: String) {
    users_aggregate(where: { login_name: { _eq: $item } }) {
      aggregate {
        count
      }
    }
  }
`;
const CHECK_USER_EMAIL = gql`
  query($item: String) {
    users_aggregate(where: { email: { _eq: $item } }) {
      aggregate {
        count
      }
    }
  }
`;
const CHECK_USER_DRT = gql`
  query($item: String) {
    users_aggregate(where: { drt: { _eq: $item } }) {
      aggregate {
        count
      }
    }
  }
`;

const CreateUserComponent = ({ id, ...otherProps }) => {
  const classes = useStylesCreateComponent();

  const history = useHistory();

  const [sucess, setSucess] = useState(false);
  const [failure, setFailure] = useState(false);

  const [loginError, setLoginError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [drtError, setDrtError] = useState('');
  const [pswError, setPswError] = useState('');
  const [pswConfirmError, setPswConfirmError] = useState('');

  const [loginLoading, setLoginLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [drtLoading, setDrtLoading] = useState(false);

  const [nome, setNome] = useState();
  const [drt, setDrt] = useState();
  // eslint-disable-next-line camelcase
  const [login_name, setLogin_name] = useState();
  const [email, setEmail] = useState();
  const [psw, setPsw] = useState();
  const [pswConfirm, setPswConfirm] = useState();
  const DEFAULT_NULL_ROLE = { id: -1, label: '<não definido>' };
  const [role, setRole] = useState(DEFAULT_NULL_ROLE);

  // ? FEATURE MAY BE ADDED IN THE FUTURE
  // const [roles, setRoles] = useState([]);

  const [checkUserLogin, { data: dataCheckLogin, loading: userQueryLoading }] = useLazyQuery(
    CHECK_USER_LOGIN,
  );
  const [checkUserEmail, { data: dataCheckEmail, loading: emailQueryLoading }] = useLazyQuery(
    CHECK_USER_EMAIL,
  );
  const [checkUserDrt, { data: dataCheckDrt, loading: drtQueryLoading }] = useLazyQuery(
    CHECK_USER_DRT,
  );

  const handleClickCreate = async (e) => {
    e.preventDefault();
    const data = {
      input: {
        nome,
        drt,
        login_name,
        email,
        psw,
        pswConfirm,
        role: role.id,
        // ? FEATURE MAY BE ADDED IN THE FUTURE
        // roles,
      },
    };

    if (loginError || emailError || drtError || pswError || pswConfirmError || role.id === -1) {
      return;
    }

    const res = await APIPostAuth(API_ENDPOINTS.CREATE_USER_API, data);
    if (res.status && res.status === 200) {
      setSucess(true);
      setNome('');
      setDrt('');
      setLogin_name('');
      setEmail('');
      setPsw('');
      setPswConfirm('');
      setRole(DEFAULT_NULL_ROLE);

      // ? FEATURE MAY BE ADDED IN THE FUTURE
      // setRoles([]);
    } else {
      setFailure(true);
    }
  };

  const regexEmail = /^\S+@\S+$/;
  const regexDrt = /^[0-9]{5}-[0-9]{1}$/im;
  const regexLogin = /^([a-z0-9_-]){5,12}$/;

  const onLogin = () => {
    if (!regexLogin.test(login_name)) {
      setLoginError('Digite um nome de usuário válido com entre 5 e 12 caracteres');
      return;
    }

    checkUserLogin({
      variables: {
        item: `${login_name}`,
      },
    });

    setLoginLoading(true);
  };
  const onEmail = () => {
    if (!regexEmail.test(email)) {
      setEmailError('Digite um email válido');
      return;
    }

    checkUserEmail({
      variables: {
        item: `${email}`,
      },
    });

    setEmailLoading(true);
  };

  const onDRT = () => {
    if (drt && !regexDrt.test(drt)) {
      setDrtError('Digite um DRT válido como 00000-0');
      return;
    }

    checkUserDrt({
      variables: {
        item: `${drt}`,
      },
    });

    setDrtLoading(true);
  };

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

  if (!userQueryLoading && dataCheckLogin && loginLoading) {
    if (login_name && dataCheckLogin.users_aggregate.aggregate.count > 0) {
      setLoginError('Nome de usuário já existe');
    } else {
      setLoginError('');
    }
    setLoginLoading(false);
  }

  if (!emailQueryLoading && dataCheckEmail && emailLoading) {
    if (email && dataCheckEmail.users_aggregate.aggregate.count > 0) {
      setEmailError('Email já cadastrado');
    } else {
      setEmailError('');
    }
    setEmailLoading(false);
  }

  if (!drtQueryLoading && dataCheckDrt && drtLoading) {
    if (drt && dataCheckDrt.users_aggregate.aggregate.count > 0) {
      setDrtError('DRT já cadastrado');
    } else {
      setDrtError('');
    }
    setDrtLoading(false);
  }

  return (
    <div>
      <Snackbar open={sucess} autoHideDuration={6000} onClose={() => setSucess(false)}>
        <Alert onClose={() => setSucess(false)} severity="success">
          Usuário criado com sucesso
        </Alert>
      </Snackbar>

      <Snackbar open={failure} autoHideDuration={6000} onClose={() => setFailure(false)}>
        <Alert onClose={() => setFailure(false)} severity="error">
          Falha ao criar o usuário. Por favor, verifique os dados e tente novamente
        </Alert>
      </Snackbar>
      <form onSubmit={handleClickCreate} className={classes.root} autoComplete="on">
        <TextField
          id="nome"
          label="Nome"
          value={nome || ''}
          required
          onChange={({ target }) => setNome(target.value)}
        />
        <TextField
          id="drt"
          label="DRT"
          error={drtError}
          helperText={drtError}
          value={drt || ''}
          onChange={({ target }) => setDrt(target.value)}
          onBlur={onDRT}
          onFocus={() => setDrtError('')}
        />
        {drtLoading ? (
          <CircularProgressWithLabel variant="indeterminate" size={15} value={0} />
        ) : (
          ''
        )}
        <TextField
          id="login_name"
          label="Login"
          value={login_name || ''}
          error={loginError}
          helperText={loginError}
          required
          onChange={({ target }) => setLogin_name(target.value)}
          onBlur={onLogin}
          onFocus={() => setLoginError('')}
        />
        {loginLoading ? (
          <CircularProgressWithLabel variant="indeterminate" size={15} value={0} />
        ) : (
          ''
        )}
        <TextField
          id="email"
          label="Email"
          error={emailError}
          helperText={emailError}
          value={email || ''}
          required
          onChange={({ target }) => setEmail(target.value)}
          onBlur={onEmail}
          onFocus={() => setEmailError('')}
        />
        {emailLoading ? (
          <CircularProgressWithLabel variant="indeterminate" size={15} value={0} />
        ) : (
          ''
        )}
        <TextField
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
        <Autocomplete
          id="role"
          options={[...enumsOptions.roles, DEFAULT_NULL_ROLE]}
          getOptionLabel={(option) => option.label}
          value={role}
          required
          onChange={(event, value) => {
            setRole(value);
          }}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Tipo de usuário" placeholder="Tipo" />
          )}
        />
        {
          // ? FEATURE MAY BE ADDED IN THE FUTURE
          /* <Autocomplete
          multiple
          id="roles"
          options={enumsOptions.roles}
          getOptionLabel={(option) => option.label}
          value={enumsOptions.roles.filter((option) => roles.includes(option.id))}
          required
          onChange={(event, value) => setRoles(value.map((i) => i.id))}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Tipo de usuário" placeholder="Tipo" />
          )}
        /> */
        }
        <Button className={classes.confirmBtn} type="submit" color="primary" variant="contained">
          Criar Novo Usuário
        </Button>
        <Button className={classes.cancelBtn} onClick={() => history.goBack()}>
          Cancelar
        </Button>
      </form>
    </div>
  );
};

export default CreateUserComponent;
