import React from 'react';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
/* eslint-disable react/prop-types */
import { Paper } from '@material-ui/core';

import Masonry from 'react-masonry-css';

import { format, formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import MainFieldComponent from '../fieldsComponents/mainField.component';

import { CircularProgressWithLabel } from '../loadingComponents/loadingsComponents';

// =====================================
// MODEL IMPORTATIONS
// =====================================
import tablesBundler, { TablesBundler } from '../../models/tablesBundler';

import styles from './detailsItem.module.scss';

type DetailsItemProps = {
  tableName: string;
  featureId: number | string;
};

const breakpointColumnsObj = {
  default: 4,
  1200: 3,
  992: 2,
  768: 1,
};

const GET_USER_NAME = gql`
  query user($id: uuid!) {
    users_by_pk(id: $id) {
      nome
    }
  }
`;

const LastUserInfo = ({ tableName, featureId }) => {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table = tableInfo.instance;

  table.queries.GET_BY_ID();

  let userId = '';
  let lastModif = '';

  const { data: dataUserId, loading: loadingUserId, error: errorUserId } = useQuery(
    gql`
      ${table.queries.GET_BY_ID(`
      usr_modif
      last_modif`)}
    `,
    {
      variables: { id: featureId },
    },
  );

  if (dataUserId && dataUserId[tableInfo.nameByPk]) {
    userId = dataUserId[tableInfo.nameByPk].usr_modif || '';
    const lastModifValue = dataUserId[tableInfo.nameByPk].last_modif || '';

    if (lastModifValue) {
      lastModif = formatRelative(new Date(lastModifValue), new Date(), {
        locale: ptBR,
      });
    }
  }

  const { data, loading, error } = useQuery(GET_USER_NAME, {
    variables: { id: userId },
    skip: !userId,
  });

  if (loading || loadingUserId) {
    return (
      <div className={styles.userInfo}>
        <CircularProgressWithLabel variant="indeterminate" size={15} value={0} />
      </div>
    );
  }

  if (error || errorUserId) {
    return <div className={styles.userInfo}>-</div>;
  }

  let nomeUser = '';

  if (data && data['users_by_pk']) {
    nomeUser = data.users_by_pk.nome;
  }

  if (!lastModif && !nomeUser) return <div className={styles.userInfo}>-</div>;

  return (
    <div className={styles.userInfo}>
      Última modificação{lastModif ? ` ${lastModif}` : ''} {nomeUser ? `por ${nomeUser}` : ''}
    </div>
  );
};

const DetailsItem = ({ tableName, featureId }: DetailsItemProps) => {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table = tableInfo.instance;

  const fieldsArray = Array.from(table.fields.values())
    .filter((field) => !field.onlyTable)
    .filter((field) => (featureId === 'new' ? !field.notOnNew : true));

  const mainField = fieldsArray.filter((field) => field.isMain)[0];

  return (
    <div className={styles.root}>
      <div className={styles.subPageHeader}>
        <MainFieldComponent field={mainField} tableName={tableInfo.name} featureId={featureId} />
        {featureId !== 'new' ? <LastUserInfo tableName={tableName} featureId={featureId} /> : ''}
      </div>
      <div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className={styles.masonryGrid}
          columnClassName={styles.masonryGridColumn}
        >
          {table.fieldsOrder.map((tile) => (
            <Paper className={`${styles.tile}`} elevation={2}>
              <span className={styles.tileLabel}>{tile.label}</span>
              {tile.fields.map((fieldName) => {
                const field = fieldsArray.filter(
                  (fieldInner) => fieldInner.columnName === fieldName,
                )[0];

                if (!field) {
                  return '';
                }
                return <div key={fieldName}>{field.component(tableInfo.name, featureId)}</div>;
              })}
            </Paper>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default DetailsItem;
