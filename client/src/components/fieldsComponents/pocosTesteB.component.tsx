/* eslint-disable camelcase */
import React, { useState, useRef, useEffect } from 'react';
/* eslint-disable react/prop-types */
import { gql, useQuery } from '@apollo/client';

import { Button, List, ListItem, Divider, ListItemText } from '@material-ui/core';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { List as ListIcon } from 'react-feather';

import PocosTesteBDialog from '../dialogs/pocosTesteBDialog.component';

import { FieldComponentType } from '../types/components.types';

import LoadingComponent from '../loadingComponents/loading.component';

import styles from './pocosTesteB.module.scss';

const optionsTeste = [
  { value: '', label: 'não definido' },
  { value: 'continuo', label: 'Contínuo' },
  { value: 'escalonado', label: 'Escalonado' },
];

export default function PocosPerfilComponent({ field, tableName, featureId }: FieldComponentType) {
  const [open, setOpenDialog] = useState(false);

  const GET_DATA = gql`
    query($feature_id: bigint!) {
      pocos_testes_bomb(
        where: { poco_id: { _eq: $feature_id } }
        order_by: { data_final: desc }
        limit: 1
      ) {
        id
        data_inicio
        data_final
        tipo_teste
        ne
        vazao_estab_final
        executor
        q1
        r1
      }
    }
  `;

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data, refetch, loading, error } = useQuery(GET_DATA, {
    // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
    variables: {
      feature_id: featureId,
    },
  });

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;

  // TREAT THE DATA

  // HANDLE THE CHANGE OF THE RELATION
  const handleBtn = () => {
    setOpenDialog(true);
  };

  const onResponse = (shouldRefetch) => {
    setOpenDialog(false);
    refetch();
  };

  const pocoTestes = data.pocos_testes_bomb;

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.listContainer}>
        {pocoTestes && pocoTestes.length > 0 ? (
          <List dense className={styles.itemContainer}>
            {pocoTestes.map((teste) => {
              const { id, data_inicio, data_final, tipo_teste, ne, vazao_estab_final } = teste;
              return (
                <div>
                  <ListItem key={id} className={styles.itemContainer}>
                    <div className={styles.itemContainer}>
                      <div className={styles.itemDetails}>
                        <ListItemText
                          primary={
                            optionsTeste.filter((option) => option.value === tipo_teste)[0].label
                          }
                        />
                        <span className={styles.secundaryText}>
                          Vaz. Final: {vazao_estab_final} m³/h
                        </span>
                        <span className={styles.secundaryText}>
                          Data Início:{' '}
                          {data_inicio
                            ? format(new Date(data_inicio), 'dd/MM/yyyy p', {
                                locale: ptBR,
                              })
                            : '-'}
                        </span>
                        <span className={styles.secundaryText}>
                          Data Final:{' '}
                          {data_final
                            ? format(new Date(data_final), 'dd/MM/yyyy p', {
                                locale: ptBR,
                              })
                            : '-'}
                        </span>
                        <span className={styles.secundaryText}>NE: {ne} m</span>
                      </div>
                    </div>
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </List>
        ) : (
          <span className={styles.noFilesMsg}>Sem registros ainda</span>
        )}
      </div>
      <Button
        color="primary"
        variant="outlined"
        onClick={handleBtn}
        size="small"
        startIcon={<ListIcon />}
      >
        Lista completa
      </Button>

      <PocosTesteBDialog
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
