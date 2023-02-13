import React from 'react';
/* eslint-disable camelcase */
import { TextField } from '@material-ui/core';
import { format, formatISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DateTimePicker,
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import DateFnsUtils from '@date-io/date-fns';

import columnNames from '../../columnsNames';

import AutoCompleteEnum from '../../../components/auxComponents/autoCompleteAuxEnum.component';

import AuxTable from '../../AuxTable';
import { AuxFieldType } from '../../Interfaces';
import enums from '../../enums';

import { queries, mutations } from './pocosManutencao.graphql';

const queryOne = {
  query: () => queries.queryOne,
  getObject: (data) => {
    const { pocos_manutencao } = data;
    if (!pocos_manutencao) return null;

    if (!(pocos_manutencao.length > 0)) return null;

    const manutencao = pocos_manutencao[0];

    return {
      main: enums.enum_ocrr_types.get(manutencao.ocrr) || '-',
      secundary: format(new Date(manutencao.created_at), 'dd/MM/yyyy p', { locale: ptBR }),
    };
  },
};

const queryAll = {
  query: () => queries.queryAll,
  getObject: (data) => {
    const { pocos_manutencao } = data;
    if (!pocos_manutencao) return null;

    if (!(pocos_manutencao.length > 0)) return null;

    return [...pocos_manutencao];
  },
};

const fields: AuxFieldType[] = [
  {
    name: 'ocrr',
    label: 'Ocorrência',
    main: true,
    required: true,
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: enums.enum_ocrr_types.get(resultValue),
      };
    },
    component(value, onChange) {
      return (
        <AutoCompleteEnum
          fieldName={this.name}
          label={this.label}
          value={value[this.name]}
          onChange={onChange}
          enumOptions={enums.enum_ocrr_types}
        />
      );
    },
  },
  {
    name: 'status',
    label: 'Status do serviço',
    main: false,
    required: true,
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: enums.enum_status_serv.get(resultValue),
      };
    },
    component(value, onChange) {
      return (
        <AutoCompleteEnum
          fieldName={this.name}
          label={this.label}
          value={value[this.name]}
          onChange={onChange}
          enumOptions={enums.enum_status_serv}
        />
      );
    },
  },
  {
    name: 'data_previsao',
    label: 'Data de Previsão',
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: format(new Date(resultValue), 'dd/MM/yyyy p', { locale: ptBR }),
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
    name: 'data_conclusao',
    label: 'Data da Conclusão',
    required: true,
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: format(new Date(resultValue), 'dd/MM/yyyy p', { locale: ptBR }),
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
    name: 'executor',
    label: 'Executor',
    required: true,
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: resultValue,
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
            label={this.label}
            style={{ width: '100%' }}
            value={value.value}
            onChange={onChangeField}
          />
        </div>
      );
    },
  },
  {
    name: 'eq_exec',
    label: 'Equipe Executora',
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: resultValue,
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
            label={this.label}
            style={{ width: '100%' }}
            value={value.value}
            onChange={onChangeField}
          />
        </div>
      );
    },
  },
  {
    name: 'descr',
    label: 'Descrição do serviço',
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: resultValue,
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
            label={this.label}
            style={{ width: '100%' }}
            multiline
            value={value.value}
            onChange={onChangeField}
          />
        </div>
      );
    },
  },
  {
    name: 'obs',
    label: 'Obs',
    required: true,
    onAdd: true,
    getValue(result) {
      if (!result || !result[this.name]) {
        return {
          value: '',
          label: '',
        };
      }

      const resultValue = result[this.name];

      return {
        value: resultValue,
        label: resultValue,
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
            label={this.label}
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
    objects['poco_id'] = featureId;

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
  columnNames.pocos_manutencao,
  queryOne,
  queryAll,
  fields,
  insertQuery,
  deleteQuery,
  updateQuery,
);
