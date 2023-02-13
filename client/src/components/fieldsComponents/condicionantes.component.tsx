import React, { useState } from 'react';
/* eslint-disable react/prop-types */

import { Button, List, ListItem, ListItemText, Divider } from '@material-ui/core';

import { format, formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { List as ListIcon } from 'react-feather';

import CondicionantesDialog from '../dialogs/condicionDialog.component';

import { condicionantesListType } from '../../models/Interfaces';

import { FieldComponentType } from '../types/components.types';

import { useHistoryState } from '../../utils/dataState.manager';

import styles from './condicionantes.module.scss';

const NULL_VALUE = { value: [], label: '' };

export default function FileListComponent({ field, tableName, featureId }: FieldComponentType) {
  const [open, setOpenDialog] = useState(false);

  const { getHistoryLastItem } = useHistoryState();

  // GET THE LIST OF FILES
  const stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const { value: condicList }: { value: condicionantesListType } =
    stateItem[field.columnName] || NULL_VALUE;

  const handleBtn = () => {
    setOpenDialog(true);
  };

  const onResponse = () => {
    setOpenDialog(false);
  };

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.demo}>
        <List dense>
          {condicList && condicList.length > 0 ? (
            condicList.map((condic) => {
              const {
                id,
                condicionante,
                diretoria_respon,
                obs,
                periodica,
                prazo,
                prazo_entrega,
                status,
                respondido,
              } = condic;
              return (
                <div>
                  <ListItem key={id} className={styles.itemContainer}>
                    <div className={styles.itemContainer}>
                      <div className={styles.itemHeader}>
                        <ListItemText primary={condicionante} />
                      </div>
                      <div className={styles.itemDetails}>
                        <span className={styles.secundaryText}>
                          {respondido ? 'Condicionante respondida' : 'Condicionante pendente'}
                        </span>
                        <span className={styles.secundaryText}>Status da Resposta: {status}</span>
                        {periodica ? <span className={styles.secundaryText}>Periódica</span> : ''}
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
                  </ListItem>
                  <Divider />
                </div>
              );
            })
          ) : (
            <span className={styles.noFilesMsg}>Sem condicionantes registradas</span>
          )}
        </List>
      </div>

      <Button
        color="primary"
        variant="outlined"
        onClick={handleBtn}
        size="small"
        startIcon={<ListIcon />}
      >
        DETALHES
      </Button>

      <CondicionantesDialog
        title={field.label}
        tableName={tableName}
        open={open}
        onResponse={onResponse}
        field={field}
        featureId={featureId}
      />
    </div>
  );
}
