import React, { useState } from 'react';
import { InputLabel, Input, FormControl, InputProps, FormHelperText } from '@material-ui/core/';

import { gql, useQuery } from '@apollo/client';

import { useHistoryState } from '../../utils/dataState.manager';

import { FieldComponentType } from '../types/components.types';

import styles from './textField.module.scss';

const NULL_VALUE = { value: '', label: '' };

const TextFieldComponent = ({
  field,
  tableName,
  featureId,
  helperText,
  ...otherProps
}: FieldComponentType & InputProps) => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { addHistoryItem, getHistoryLastItem } = useHistoryState();

  const stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const { value } = stateItem[field.columnName] || NULL_VALUE;

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
    <div className={styles.root}>
      <FormControl className={styles.formControl}>
        <InputLabel htmlFor="component-simple">{field.label}</InputLabel>
        <Input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...otherProps}
          id="component-simple"
          error={error}
          value={value}
          onChange={handleChange}
          disabled={!isOnEdit}
        />
        {error ? <FormHelperText error={error}>{errorMsg}</FormHelperText> : ''}
        {helperText ? <FormHelperText id="component-helper-text">{helperText}</FormHelperText> : ''}
      </FormControl>
    </div>
  );
};

export default TextFieldComponent;
