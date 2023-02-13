import React from 'react';
/* eslint-disable camelcase */
import { TextField } from '@material-ui/core';
import { format, formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import AutoCompleteEnum from '../../../components/auxComponents/autoCompleteAuxEnum.component';

import columnNames from '../../columnsNames';

import AuxTable from '../../AuxTable';
import { AuxFieldType } from '../../Interfaces';
import enums from '../../enums';

import { queries, mutations } from './reservatorioSituacao.graphql';

const queryOne = {
  query: () => queries.queryOne,
  getObject: (data) => {
    const { reservatorios_situacao } = data;
    if (!reservatorios_situacao) return null;

    if (!(reservatorios_situacao.length > 0)) return null;

    const situacao = reservatorios_situacao[0];

    return {
      main: enums.enum_situ_features.get(situacao.situacao) || '',
      secundary: format(new Date(situacao.date), 'dd/MM/yyyy p', { locale: ptBR }),
    };
  },
};

const queryAll = {
  query: () => queries.queryAll,
  getObject: (data) => {
    const { reservatorios_situacao } = data;
    if (!reservatorios_situacao) return null;

    if (!(reservatorios_situacao.length > 0)) return null;

    return [...reservatorios_situacao];
  },
};

const fields: AuxFieldType[] = [
  {
    name: 'situacao',
    label: 'Situação',
    main: true,
    required: true,
    onAdd: true,
    getValue: (result) => {
      if (!result || !result.situacao) {
        return {
          value: '',
          label: '',
        };
      }

      return {
        value: result.situacao,
        label: enums.enum_situ_features.get(result.situacao),
      };
    },
    component(value, onChange) {
      return (
        <AutoCompleteEnum
          fieldName={this.name}
          label={this.label}
          value={value[this.name]}
          onChange={onChange}
          enumOptions={enums.enum_situ_features}
        />
      );
    },
  },
  {
    name: 'date',
    label: 'Data',
    required: true,
    onAdd: true,
    getValue: (result) => {
      if (!result || !result.date) {
        return {
          value: '',
          label: '',
        };
      }

      return {
        value: result.date,
        label: format(new Date(result.date), 'dd/MM/yyyy p', { locale: ptBR }),
      };
    },
    component(value, onChange) {
      const valuePicker = value[this.name].value || null;

      const onChangeField = (date) => {
        if (date == 'Invalid Date' || date == 'Invalid time value' || date == null) return;
        onChange(this.name, {
          value: formatISO(new Date(date)),
          label: format(new Date(date), 'dd/MM/yyyy p', { locale: ptBR }),
        });
      };

      return (
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
            <KeyboardDateTimePicker
              style={{ width: '100%' }}
              format="dd/MM/yyyy p"
              mask="__/__/____ __:__"
              ampm={false}
              label={this.label}
              value={valuePicker}
              onChange={onChangeField}
            />
          </MuiPickersUtilsProvider>
        </div>
      );
    },
  },
  {
    name: 'obs',
    label: 'Obs',
    onAdd: true,
    getValue: (result) => {
      if (!result || !result.obs) {
        return {
          value: '',
          label: '',
        };
      }

      return {
        value: result.obs,
        label: result.obs,
      };
    },
    component(value, onChange) {
      const onChangeField = (event) => {
        onChange(this.name, {
          value: event.target.value,
          label: event.target.value,
        });
      };

      return (
        <div>
          <TextField
            id="standard-multiline-flexible"
            label="Observação"
            style={{ width: '100%' }}
            multiline
            value={value.value}
            onChange={onChangeField}
          />
        </div>
      );
    },
  },
];

const insertQuery = {
  query: mutations.insert,
  getMutationObj: (featureId, fieldState) => {
    const objects = {};
    fields
      .filter((field) => field.onAdd)
      .forEach((field) => {
        objects[field.name] = fieldState[field.name].value;
      });

    // DEFINE THE FEATURE ID TO THE MUTATION
    // eslint-disable-next-line dot-notation
    objects['reserv_id'] = featureId;

    return objects;
  },
};

const updateQuery = {
  query: mutations.update,
  getMutationObj: (id, changes) => ({ id, changes }),
};

const deleteQuery = {
  query: mutations.delete,
  getMutationObj: (id, changes) => ({ id }),
};

export default new AuxTable(
  columnNames.cap_superf_situacao,
  queryOne,
  queryAll,
  fields,
  insertQuery,
  deleteQuery,
  updateQuery,
);
