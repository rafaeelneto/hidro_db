import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import { gql, useQuery } from '@apollo/client';

import { List as ListIcon } from 'react-feather';

import LoadingComponent from '../loadingComponents/loading.component';
import AuxTableDialog from '../dialogs/auxTableDialog.component';

// eslint-disable-next-line import/no-cycle
import { AuxTableType, Field } from '../../models/Interfaces';

import styles from './auxTable.module.scss';

type AuxTableProps = {
  auxTable: AuxTableType;

  field: Field;
  featureId: string | number;
};

export default function AuxTableComponent({ auxTable, field, featureId }: AuxTableProps) {
  const [open, setOpenDialog] = useState(false);

  const GET_DATA_AUX = gql`
    ${auxTable.queryOne.query()}
  `;

  // PREPARE THE QUERY TO FETCH THE RELATION DATA

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data, refetch, loading, error } = useQuery(GET_DATA_AUX, {
    // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
    variables: {
      feature_id: featureId,
    },
  });

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;
  const result = auxTable.queryOne.getObject(data);

  // HANDLE THE CHANGE OF THE RELATION
  const handleBtn = () => {
    setOpenDialog(true);
  };

  const onResponse = (shouldRefetch) => {
    setOpenDialog(false);
    if (shouldRefetch) refetch();
  };

  return (
    <div className={styles.fieldWrapper}>
      {/* <span className={styles.label}>{field.label}</span> */}
      {result ? (
        <div className={styles.container}>
          <span className={styles.main}>{result.main}</span>
          <span className={styles.secundary}>{result.secundary}</span>
        </div>
      ) : (
        <span className={styles.noMsg}>Não há ainda situação cadastrada</span>
      )}
      <Button
        color="primary"
        variant="outlined"
        onClick={handleBtn}
        size="small"
        startIcon={<ListIcon />}
      >
        LISTA COMPLETA
      </Button>
      <AuxTableDialog
        title={field.label}
        open={open}
        onResponse={onResponse}
        auxTable={auxTable}
        featureId={featureId}
      />
    </div>
  );
}
