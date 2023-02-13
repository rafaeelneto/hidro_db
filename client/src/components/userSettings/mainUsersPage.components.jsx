import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { format } from 'date-fns';

import {
  useTheme,
  makeStyles,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core/';

import { gql, useQuery, useMutation } from '@apollo/client';

import { userInfoVar } from '../../graphql/cache';

import LoadingComponent from '../loadingComponents/loading.component';
import AlertDialog from '../dialogs/alertDialog.component';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
  },
  boxWrapper: {
    border: `${theme.palette.backgroundLightGray} 1px solid`,
    borderRadius: '10px',
    padding: '0px 15px 0px 15px',
    marginBlockStart: '10px',
    marginBlockEnd: '10px',
  },
  userActionBtn: {
    margin: '0 5px 0 5px',
  },
  userDeleteBtn: {
    color: theme.palette.danger,
    borderColor: theme.palette.danger,
    '&.MuiButton-root:hover': {
      backgroundColor: theme.palette.dangerLight,
    },
  },
  tableContainer: {},
}));

const GET_USERS = gql`
  query UserCreatedBy($id: uuid!) {
    users(where: { created_by: { _eq: $id } }) {
      id
      nome
      email
      created_in
      last_acess
    }
  }
`;

const DELETE_MUTATION = gql`
  mutation deleteUser($id: uuid!) {
    delete_users_by_pk(id: $id) {
      id
    }
  }
`;

const MainUsersPage = ({ location }) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [openUser, setOpenUser] = useState([]);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: '',
  });

  const { id } = userInfoVar();

  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { id },
  });

  const [deleteUser] = useMutation(DELETE_MUTATION, {
    refetchQueries: [
      {
        query: GET_USERS,
        variables: {
          id,
        },
      },
    ],
  });

  if (loading) return <LoadingComponent />;
  if (error) {
    throw error;
  }

  const { users } = data;

  const handleListOpen = (userId) => {
    if (openUser.includes(userId)) {
      setOpenUser(openUser.filter((item) => item !== userId));
    } else {
      openUser.push(userId);
      setOpenUser(openUser);
    }
  };

  const onDeleteResponse = (response) => {
    // DELETE OPERATION
    if (response) {
      deleteUser({ variables: { id: deleteDialog.userId } });
    }

    setDeleteDialog({
      open: false,
      userId: '',
    });
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5">Usuários criados</Typography>
      <Typography variant="body1">Tabela de usuários criados por você para gerenciar</Typography>
      <Box className={classes.boxWrapper}>
        <List>
          {users.length > 0 ? (
            users.map((user) => {
              const creationDate = format(new Date(user.created_in), "'Criado em' dd/MM/yyyy");
              return (
                <ListItem key={user.id}>
                  <ListItemText button primary={user.nome} secondary={creationDate} />
                  <Button
                    className={classes.userActionBtn}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => console.log('Resetar senhar')}
                  >
                    Editar
                  </Button>
                  <Button
                    className={`${classes.userActionBtn} ${classes.userDeleteBtn}`}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setDeleteDialog({ open: true, userId: user.id });
                    }}
                  >
                    Excluir
                  </Button>
                </ListItem>
              );
            })
          ) : (
            <Typography variant="h6" style={{ textAlign: 'center', color: 'gray' }}>
              Ainda não há usuários
            </Typography>
          )}
        </List>
      </Box>

      <Button component={Link} to={`${location.pathname}/criar-usuario`}>
        Criar novo usuário
      </Button>

      <AlertDialog
        open={deleteDialog.open}
        title="Deletar usuário"
        msg="Você tem certeza que deseja excluir o usuário?"
        onResponse={onDeleteResponse}
      />
    </div>
  );
};

export default MainUsersPage;
