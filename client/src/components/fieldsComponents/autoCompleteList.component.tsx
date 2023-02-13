import React from 'react';
/* eslint-disable react/prop-types */

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';

import LoadingComponent from '../loadingComponents/loading.component';
import { useHistoryState } from '../../utils/dataState.manager';

import { AutoCompleteProps } from '../types/components.types';

import styles from './autoCompleteList.module.scss';

// CONSTRUCT THE QUERY TO EXECUTE BASED ON FIELDS STATE
const GET_DATA = (queryText) => gql`
  ${queryText}
`;

type valueType = {
  value: string | null;
  label: string;
};

const NULL_VALUE: valueType = { value: null, label: '<não definido>' };

export default function AutoCompleteComponent({
  graphQlQuery,
  field,
  tableName,
  featureId,
}: AutoCompleteProps) {
  const { addHistoryItem, getHistoryLastItem } = useHistoryState();

  let stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const stateValue = stateItem[field.columnName] || NULL_VALUE;

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  let options: valueType[] = [];

  // MAKE THE GRAPHQL QUERY WITH THE APOLLO HOOK
  const { data, loading, error } = useQuery(graphQlQuery ? GET_DATA(graphQlQuery.query) : gql``, {
    // SKIP IF THE THE GRAPHQL VARIABLE ISN'T PRESENT
    skip: !graphQlQuery,
  });

  // MAKE THE DATA TREATMENT OF THE RECEIVED GRAPHQL DATA
  if (graphQlQuery) {
    if (loading) return <LoadingComponent />;
    if (error) return <h1>Erro na aplicação</h1>;
    options = data[graphQlQuery.tableName].map(graphQlQuery.getFunction);
  }

  options.unshift(NULL_VALUE);

  // handle on change of properties
  const handleChange = (event, newValue) => {
    // CHECK IF NEW VALUE IS PRESENT
    if (!newValue) return;

    // SET THE DATA STATE
    stateItem = { ...stateItem };
    stateItem[field.columnName] = newValue;
    addHistoryItem(tableName, featureId, stateItem);
  };

  return (
    <div className={styles.fieldWrapper}>
      <Autocomplete
        className={styles.autoComplete}
        id="combo-box-demo"
        value={stateValue}
        options={options}
        onChange={handleChange}
        disabled={!isOnEdit}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} label={field.label} margin="normal" />
        )}
      />
    </div>
  );
}
