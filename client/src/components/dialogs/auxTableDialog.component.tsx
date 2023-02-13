import React, { useState } from 'react';
import {
  Button,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemText,
  Dialog,
  DialogContent,
  Collapse,
  Paper,
  LinearProgress,
  CircularProgress,
  ListItemSecondaryAction,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { gql, useQuery, useMutation } from '@apollo/client';
import { PlusCircle, RefreshCw, XCircle, Trash, X } from 'react-feather';
import LoadingComponent from '../loadingComponents/loading.component';

import { AuxTableType } from '../../models/Interfaces';

import styles from './auxTableDialog.module.scss';

type AuxAlertDialogProps = {
  title: string;
  open: boolean;
  onResponse: (response: boolean) => void;
  featureId: string | number;
  auxTable: AuxTableType;
};

export default function AuxAlertDialog({
  title,
  open,
  onResponse,
  auxTable,
  featureId,
}: AuxAlertDialogProps) {
  const [openNew, setOpenNew] = useState(false);
  const [thereIsNew, setThereIsNew] = useState(false);
  const [errorMsg, setErrorMsg] = useState({ type: '', msg: '' });
  const [loadingMutation, setLoadingMutation] = useState('');
  const [loadingId, setLoadingId] = useState('');
  const [errorId, setErrorId] = useState('');

  const [fieldState, setFieldState] = useState(auxTable.getDefaultState());

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  const GET_DATA = gql`
    ${auxTable.queryAll.query()}
  `;

  // PREPARE THE QUERY TO FETCH THE RELATION DATA
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
    variables: {
      feature_id: featureId,
    },
  });

  const [insertMutation, { data: dataInsert, error: errorInsert }] = useMutation(
    gql`
      ${auxTable.insertQuery.query}
    `,
  );
  const [deleteMutation, { data: dataDelete, error: errorDelete }] = useMutation(
    gql`
      ${auxTable.deleteQuery.query}
    `,
  );

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;

  if (errorInsert && loadingMutation === 'insert') {
    setErrorMsg({
      type: 'insert',
      msg: 'Erro ao enviar suas informações, tente novamente mais tarde',
    });
    setLoadingMutation('');
  }

  if (errorDelete && loadingMutation === 'delete') {
    setErrorMsg({ type: 'delete', msg: 'Não foi possível excluir' });
    setLoadingMutation('');
  }

  const result = auxTable.queryAll.getObject(data);

  const handleClose = () => {
    onResponse(thereIsNew);
  };

  const handleChange = (fieldName, value) => {
    const newFieldState = {
      ...fieldState,
    };
    newFieldState[fieldName] = value;
    setFieldState({
      ...newFieldState,
    });
  };

  const handleSave = () => {
    // check if the values of the field are filled
    let unfilledField = false;

    auxTable.fields
      .filter((field) => field.onAdd)
      .forEach((field) => {
        if (field.required && !fieldState[field.name].value) unfilledField = true;
      });

    if (unfilledField) return;

    // create the object to save
    const objects = auxTable.insertQuery.getMutationObj(featureId, fieldState);

    // make the mutation to the database
    insertMutation({ variables: { objects } });
    setLoadingMutation('insert');
  };

  const handleDelete = (id) => {
    // make the mutation to the database
    deleteMutation({ variables: { id } });
    setLoadingMutation('delete');
    setLoadingId(id);
  };

  if (
    (loadingMutation === 'insert' && dataInsert) ||
    (loadingMutation === 'delete' && dataDelete)
  ) {
    // store that the data has been updated
    setThereIsNew(true);
    setLoadingMutation('');
    setFieldState(auxTable.getDefaultState());
    setOpenNew(false);
    refetch();
  }

  // TODO fix the new data issue

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <AppBar className={styles.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => onResponse(false)}
              aria-label="close"
            >
              <X />
            </IconButton>
            <Typography variant="h6" className={styles.title}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
        <Divider />
        <DialogContent className={styles.dialogContent}>
          <div className={styles.dialogContentWrapper}>
            <div className={styles.btnContainer}>
              <Button
                className={`${styles.topBtns} ${openNew ? styles.btnCancel : ''}`}
                color="primary"
                disabled={!isOnEdit}
                variant="outlined"
                onClick={() => setOpenNew(!openNew)}
                size="small"
                startIcon={openNew ? <XCircle /> : <PlusCircle />}
              >
                {openNew ? 'CANCELAR' : 'ADICIONAR'}
              </Button>
              <Button
                className={`${styles.topBtns}`}
                color="primary"
                variant="outlined"
                onClick={() => refetch()}
                size="small"
                startIcon={<RefreshCw />}
              >
                Recarregar
              </Button>
            </div>
            <Collapse in={openNew}>
              <Paper className={styles.newCollapse}>
                <div className={styles.newContainer}>
                  {auxTable.fields.map((field) => (
                    <div className={styles.field}>{field.component(fieldState, handleChange)}</div>
                  ))}
                  <Button onClick={handleSave} color="primary">
                    Salvar
                  </Button>
                  {loadingMutation === 'insert' ? <LinearProgress /> : ''}
                </div>
              </Paper>
            </Collapse>
            <div className={styles.listContainer}>
              {result && result.length > 0 ? (
                <List dense className={styles.itemContainer}>
                  {result.map((el) => {
                    const { id, main, secundary } = auxTable.getResult(el);
                    return (
                      <div>
                        <ListItem key={id} className={styles.itemContainer} button>
                          <div className={styles.itemContainer}>
                            <div className={styles.itemHeader}>
                              {isOnEdit ? (
                                <div className={styles.itemActionContainer}>
                                  <div className={styles.deleteBtnWrapper}>
                                    <Button
                                      onClick={() => handleDelete(id)}
                                      size="small"
                                      disabled={loadingMutation === 'delete' && loadingId === id}
                                      aria-label="delete"
                                      className={styles.deleteBtn}
                                      startIcon={<Trash />}
                                    >
                                      Excluir
                                    </Button>
                                    {loadingMutation === 'delete' && loadingId === id ? (
                                      <CircularProgress
                                        size={32}
                                        className={styles.deleteProgress}
                                      />
                                    ) : (
                                      ''
                                    )}
                                  </div>

                                  {/* <Button
                                    onClick={() => {
                                      setOpenCondic(openCondic !== id ? id : '');
                                      setEditCondic(condic);
                                    }}
                                    size="small"
                                    aria-label="edit"
                                    startIcon={<Edit2 />}
                                    className={styles.editBtn}
                                  >
                                    Editar
                                  </Button> */}
                                </div>
                              ) : (
                                ''
                              )}
                              <ListItemText primary={main} />
                            </div>
                            <div className={styles.itemDetails}>
                              {secundary.map((item) => (
                                <span className={styles.secundaryText}>{item}</span>
                              ))}
                            </div>
                            <Divider />
                          </div>
                        </ListItem>
                      </div>
                    );
                  })}
                </List>
              ) : (
                <span className={styles.noFilesMsg}>Sem registros ainda</span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
