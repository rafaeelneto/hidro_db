import React from 'react';
/* eslint-disable react/prop-types */

import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

import styles from './autoCompleteAuxEnum.module.scss';

type valueType = {
  value: string;
  label: string;
};
const NULL_VALUE: valueType = { value: '', label: '<não definido>' };

type AutoCompleteProps = {
  enumOptions: Map<string, string>;
  value: valueType;
  label: string;
  fieldName: string;
  onChange(fieldName, newValue);
};

export default function AutoCompleteComponent({
  enumOptions,
  onChange,
  value,
  label,
  fieldName,
}: AutoCompleteProps) {
  const options: valueType[] = [];

  Array.from(enumOptions.keys()).forEach((enumKey: string) => {
    options.push({ value: enumKey || '', label: enumOptions.get(enumKey) || '' });
  });

  options.unshift(NULL_VALUE);

  // handle on change of properties
  const handleChange = (event, newValue) => {
    // CHECK IF NEW VALUE IS PRESENT
    if (!newValue) return;

    // SET THE DATA STATE
    onChange(fieldName, newValue);
  };

  return (
    <div className={styles.fieldWrapper}>
      <Autocomplete
        className={styles.autoComplete}
        id="combo-box-demo"
        value={value}
        options={options}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <TextField {...params} label={label} margin="normal" />
        )}
      />
    </div>
  );
}
