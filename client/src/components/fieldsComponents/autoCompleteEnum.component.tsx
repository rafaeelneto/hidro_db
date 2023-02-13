import React from 'react';
/* eslint-disable react/prop-types */

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';

import { useHistoryState } from '../../utils/dataState.manager';

import { AutoCompleteEnumProps } from '../types/components.types';

import styles from './autoCompleteEnum.module.scss';

type valueType = {
  value: string | null;
  label: string;
};

const NULL_VALUE: valueType = { value: null, label: '<não definido>' };

export default function AutoCompleteComponent({
  enumOptions,
  field,
  tableName,
  featureId,
}: AutoCompleteEnumProps) {
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

  if (enumOptions) {
    Array.from(enumOptions.keys()).forEach((enumKey: string) => {
      options.push({ value: enumKey || '', label: enumOptions.get(enumKey) || '' });
    });
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
