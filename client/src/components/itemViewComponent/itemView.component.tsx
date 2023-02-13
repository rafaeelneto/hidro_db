import React, { useState, useEffect } from 'react';
/* eslint-disable react/prop-types */
import { useParams, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Button } from '@material-ui/core';

import { ChevronLeft } from 'react-feather';

import { useHistoryState } from '../../utils/dataState.manager';

import DetailsComponent from '../detailsItemComponent/detailsItem.component';
import LoadingComponent from '../loadingComponents/loading.component';
import EditPanelComponent from '../editPanel/editPanel.component';

// =====================================
// MODEL IMPORTATIONS
// =====================================
import tablesBundler, { TablesBundler } from '../../models/tablesBundler';

import { useMutationItem } from '../../graphql/fetchMutation';

import styles from './itemView.module.scss';

type ItemTableProps = {
  tableName: string;
};

const TableItem = ({ tableName }: ItemTableProps) => {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table = tableInfo.instance;

  const history = useHistory();
  // @ts-ignore
  const { id: featureId } = useParams();

  const [replaceOriginalData, setReplaceOriginalData] = useState(true);
  const [refetchData, setRefetchData] = useState(false);

  const fieldsArray = table.getFieldsArray();

  const { setHistoryOriginal, getHistoryLastItem } = useHistoryState();

  const GET_DATA = table.composeItemQuery();

  const onMutationListener = () => {
    setRefetchData(true);
    setReplaceOriginalData(true);
  };

  const { attach, detach } = useMutationItem(tableName, table);

  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: {
      id: featureId,
    },
  });

  useEffect(() => {
    attach(onMutationListener);
    return () => {
      setRefetchData(true);
      detach(onMutationListener);
    };
  }, []);

  if (refetchData) {
    refetch().then(() => {
      setRefetchData(false);
      setReplaceOriginalData(true);
    });
  }

  if (loading) return <LoadingComponent />;
  if (error) return <h1>Erro na aplicação</h1>;

  const resetItemState = () => {
    const newOriginalState = {};

    fieldsArray.map(
      (field) => (newOriginalState[field.columnName] = field.getValue(data[tableInfo.nameByPk])),
    );

    setHistoryOriginal(tableName, featureId, newOriginalState);

    setReplaceOriginalData(false);
  };

  if ((replaceOriginalData || !getHistoryLastItem(tableName, featureId)) && data) {
    resetItemState();
  }

  return (
    <div className={styles.root}>
      <div>
        <div className={styles.subPageHeader}>
          <Button
            className={styles.backBtn}
            startIcon={<ChevronLeft />}
            onClick={() => {
              history.goBack();
            }}
          >
            VOLTAR
          </Button>
          <EditPanelComponent tableName={tableInfo.name} featureId={featureId} />
        </div>

        <DetailsComponent tableName={tableName} featureId={featureId} />
      </div>
    </div>
  );
};

export default TableItem;
