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
  DialogTitle,
  Collapse,
  Paper,
  TextField,
  ListItemSecondaryAction,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { format, formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { KeyboardDatePicker, DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { gql, useQuery } from '@apollo/client';
import { PlusCircle, XCircle, Trash, Edit2, X } from 'react-feather';

import { useHistoryState } from '../../utils/dataState.manager';

import { Field, condicionantesType, condicionantesListType } from '../../models/Interfaces';

import styles from './condicionDialog.module.scss';

type AuxAlertDialogProps = {
  field: Field;
  title: string;
  open: boolean;
  tableName: string;
  onResponse: () => void;
  featureId: string | number;
};

const DEFAULT_NEW_CONDIC: condicionantesType = {
  id: '',
  condicionante: '',
  periodica: false,
  diretoria_respon: '',
  obs: '',
  prazo: 0,
  prazo_entrega: new Date().toISOString(),
  status: '',
};

const CondicFields = ({
  condic,
  onChangeCondic,
}: {
  condic: condicionantesType;
  onChangeCondic: (newCondic: condicionantesType) => void;
}) => (
  <div>
    <TextField
      className={styles.field}
      id="standard-multiline-flexible"
      label="Condicionante"
      style={{ width: '100%' }}
      multiline
      value={condic.condicionante}
      onChange={(event) => {
        // eslint-disable-next-line implicit-arrow-linebreak
        onChangeCondic({ ...condic, condicionante: event.target.value });
      }}
    />
    <TextField
      className={styles.field}
      id="standard-multiline-flexible"
      label="Diretoria responsável"
      style={{ width: '100%' }}
      value={condic.diretoria_respon}
      onChange={(event) => {
        // eslint-disable-next-line implicit-arrow-linebreak
        onChangeCondic({ ...condic, diretoria_respon: event.target.value });
      }}
    />
    <TextField
      className={styles.field}
      id="standard-multiline-flexible"
      label="Obs"
      style={{ width: '100%' }}
      multiline
      value={condic.obs}
      onChange={(event) => {
        // eslint-disable-next-line implicit-arrow-linebreak
        onChangeCondic({ ...condic, obs: event.target.value });
      }}
    />
    <TextField
      className={styles.field}
      id="standard-multiline-flexible"
      label="Status"
      style={{ width: '100%' }}
      value={condic.status}
      onChange={(event) => {
        // eslint-disable-next-line implicit-arrow-linebreak
        onChangeCondic({ ...condic, status: event.target.value });
      }}
    />

    <FormControlLabel
      className={styles.field}
      control={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Checkbox
          checked={condic.periodica}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            onChangeCondic({ ...condic, periodica: event.target.checked });
          }}
          name="peridic"
        />
      }
      label="Periódico"
    />

    <FormControlLabel
      className={styles.field}
      control={
        // eslint-disable-next-line react/jsx-wrap-multilines
        <Checkbox
          checked={condic.respondido}
          onChange={(event) => {
            // eslint-disable-next-line implicit-arrow-linebreak
            onChangeCondic({ ...condic, respondido: event.target.checked });
          }}
          name="respondido"
        />
      }
      label="Condicionante Respondida?"
    />

    <TextField
      className={styles.field}
      id="standard-multiline-flexible"
      label="Prazo (em dias)"
      type="number"
      style={{ width: '100%' }}
      value={condic.prazo}
      onChange={(event) => {
        // eslint-disable-next-line implicit-arrow-linebreak
        onChangeCondic({ ...condic, prazo: parseInt(event.target.value, 10) });
      }}
    />

    <div className={styles.field}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <KeyboardDatePicker
          style={{ width: '100%' }}
          format="dd/MM/yyyy"
          label="Prazo de Entrega"
          value={condic.prazo_entrega}
          onChange={(date: any) => {
            if (date == 'Invalid Date' || date == null) return;
            // eslint-disable-next-line implicit-arrow-linebreak
            onChangeCondic({
              ...condic,
              prazo_entrega: formatISO(date),
            });
          }}
        />
      </MuiPickersUtilsProvider>
    </div>
  </div>
);

const NULL_VALUE = { value: [], label: '' };

export default function CondicAlertDialog({
  field,
  title,
  open,
  tableName,
  onResponse,
  featureId,
}: AuxAlertDialogProps) {
  const [openNew, setOpenNew] = useState(false);
  const [openCondic, setOpenCondic] = useState('');

  const [newCondic, setNewCondic] = useState(DEFAULT_NEW_CONDIC);
  const [editCondic, setEditCondic] = useState(DEFAULT_NEW_CONDIC);

  const handleClose = () => {
    onResponse();
  };

  const { addHistoryItem, getHistoryLastItem } = useHistoryState();

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  // GET THE LIST OF FILES
  let stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const { value: condicList }: { value: condicionantesListType } =
    stateItem[field.columnName] || NULL_VALUE;

  // GET THE LIST OF FILES

  const saveFileList = (newCondicList: condicionantesListType) => {
    stateItem = { ...stateItem };
    stateItem[field.columnName] = { value: newCondicList, label: '-' };
    addHistoryItem(tableName, featureId, stateItem);
  };

  // handle on change of properties
  const handleSave = () => {
    saveFileList([...condicList, { ...newCondic, id: new Date().toISOString() }]);
  };

  const handleSaveEdit = (id) => {
    const newCondicList = condicList.filter((condic) => condic.id !== id);
    saveFileList([...newCondicList, { ...editCondic }]);
  };

  // HANDLER TO THE DELETE BUTTON
  const handleDelete = (id) => {
    const newCondicList = condicList.filter((condic) => condic.id !== id);
    // save file list
    saveFileList(newCondicList);
  };

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
              onClick={() => onResponse()}
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
            </div>
            <Collapse in={openNew}>
              <Paper className={styles.newCollapse}>
                <div className={styles.newContainer}>
                  <CondicFields
                    condic={newCondic}
                    onChangeCondic={(newCondicChange: condicionantesType) => {
                      setNewCondic(newCondicChange);
                    }}
                  />
                  <Button onClick={handleSave} color="primary">
                    Salvar
                  </Button>
                </div>
              </Paper>
            </Collapse>
            <div className={styles.listContainer}>
              {condicList && condicList.length > 0 ? (
                <List className={styles.list}>
                  {condicList.map((condic) => {
                    const {
                      id,
                      condicionante,
                      prazo,
                      periodica,
                      status,
                      diretoria_respon,
                      prazo_entrega,
                      respondido,
                    } = condic;
                    return (
                      <div>
                        <ListItem key={id} className={styles.itemContainer}>
                          <div className={styles.itemContainer}>
                            <Divider />
                            <div className={styles.itemHeader}>
                              {isOnEdit ? (
                                <div className={styles.itemActionContainer}>
                                  <Button
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
                                  </Button>
                                  <Button
                                    onClick={() => handleDelete(id)}
                                    size="small"
                                    aria-label="delete"
                                    className={styles.deleteBtn}
                                    startIcon={<Trash />}
                                  >
                                    Excluir
                                  </Button>
                                </div>
                              ) : (
                                ''
                              )}
                              <ListItemText primary={condicionante} />
                            </div>
                            <div className={styles.itemDetails}>
                              <span className={styles.secundaryText}>
                                {respondido ? 'Condicionante respondida' : 'Condicionante pendente'}
                              </span>

                              <span className={styles.secundaryText}>
                                Status da Resposta: {status}
                              </span>
                              {periodica ? (
                                <span className={styles.secundaryText}>Periódica</span>
                              ) : (
                                ''
                              )}
                              <span className={styles.secundaryText}>
                                Prazo de: {prazo} dias {periodica ? 'periodicamente' : ''}
                              </span>
                              <span className={styles.secundaryText}>
                                Data do prazo:{' '}
                                {format(new Date(prazo_entrega), 'dd/MM/yyyy p', { locale: ptBR })}
                              </span>
                              <span className={styles.secundaryText}>
                                Diretoria Responsável: {diretoria_respon}
                              </span>
                            </div>
                          </div>
                          <Collapse in={openCondic ? openCondic === id : false}>
                            <Paper className={styles.editCollapse}>
                              <div className={styles.editContainer}>
                                <CondicFields
                                  condic={editCondic}
                                  onChangeCondic={(newCondicChange: condicionantesType) => {
                                    setEditCondic(newCondicChange);
                                  }}
                                />
                                <Button onClick={() => handleSaveEdit(id)} color="primary">
                                  Salvar
                                </Button>
                              </div>
                            </Paper>
                          </Collapse>
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
