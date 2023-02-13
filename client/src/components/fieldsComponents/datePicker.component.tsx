import React, { useState } from 'react';
import { InputLabel, Input, FormControl, InputProps, FormHelperText } from '@material-ui/core/';

import { format, formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { gql, useQuery } from '@apollo/client';

import { useHistoryState } from '../../utils/dataState.manager';

import { FieldComponentType } from '../types/components.types';

import styles from './datePicker.module.scss';

const NULL_VALUE = { value: '', label: '' };

const DatePickerComponent = ({
  field,
  tableName,
  featureId,
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

  const handleChange = (newDate) => {
    if (newDate == 'Invalid Date' || newDate == null) return;
    const newValue = {
      value: formatISO(newDate),
      label: format(new Date(newDate), 'dd/MM/yyyy p', { locale: ptBR }),
    };
    stateItem[field.columnName] = newValue;
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
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
        <KeyboardDatePicker
          disabled={!isOnEdit}
          className={styles.field}
          id="data"
          style={{ width: '100%' }}
          format="dd/MM/yyyy"
          label={field.label}
          value={value || null}
          onChange={handleChange}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default DatePickerComponent;
