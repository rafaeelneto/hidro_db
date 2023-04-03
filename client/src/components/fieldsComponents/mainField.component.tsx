import React, { useState } from 'react';
import { useTheme, makeStyles, Input, FormControl, FormHelperText } from '@material-ui/core/';

import { gql, useQuery } from '@apollo/client';

import { useHistoryState } from '../../utils/dataState.manager';

import { FieldComponentType } from '../types/components.types';

const useStyles = makeStyles((theme) => ({
  mainInput: {
    fontWeight: 700,
    fontSize: '2rem',
    width: '50rem',
  },
}));

import styles from './mainField.module.scss';

const NULL_VALUE = { value: '', label: '' };

const TextFieldComponent = ({ field, tableName, featureId }: FieldComponentType) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addHistoryItem, getHistoryLastItem } = useHistoryState();

  const stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const { value } = stateItem[field.columnName] ?? NULL_VALUE;

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  const handleChange = (event) => {
    const { value: newValue } = event.target;
    stateItem[field.columnName] = { label: newValue, value: newValue };
    addHistoryItem(tableName, featureId, stateItem);
    if (field.validate && !field.validate(newValue).valid) {
      setError(true);
      setErrorMsg(field.validate(value).msg);
      return;
    }
    setError(false);
    setErrorMsg('');
  };

  return (
    <FormControl>
      <Input
        error={error}
        disableUnderline={!isOnEdit}
        className={styles.mainInput}
        id="component-simple"
        value={value}
        onChange={handleChange}
        disabled={!isOnEdit}
        placeholder={field.label}
      />
      {error ? <FormHelperText error={error}>{errorMsg}</FormHelperText> : ''}
    </FormControl>
  );
};

export default TextFieldComponent;
