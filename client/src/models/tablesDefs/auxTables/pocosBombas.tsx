import React from 'react';
/* eslint-disable camelcase */
import { TextField, InputAdornment, FormControl, Input, InputLabel } from '@material-ui/core';
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

import { queries, mutations } from './pocosBombas.graphql';

const queryOne = {
  query: () => queries.queryOne,
  getObject: (data) => {
    const { pocos_bombas } = data;
    if (!pocos_bombas) return null;

    if (!(pocos_bombas.length > 0)) return null;

    const manutencao = pocos_bombas[0];

    return {
      main: manutencao.bomba_nova_nome,
      secundary: format(new Date(manutencao.data_instalacao), 'dd/MM/yyyy p', { locale: ptBR }),
    };
  },
};

const queryAll = {
  query: () => queries.queryAll,
  getObject: (data) => {
    const { pocos_bombas } = data;
    if (!pocos_bombas) return null;

    if (!(pocos_bombas.length > 0)) return null;

    return [...pocos_bombas];
  },
};

const fields: AuxFieldType[] = [
  {
    name: 'data_instalacao',
    label: 'Data de Instalação',
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
    name: 'bomba_ant_nome',
    label: 'Bomba Anterior Modelo',
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
    name: 'bomba_nova_nome',
    label: 'Bomba Nova Modelo',
    main: true,
    onAdd: true,
    required: true,
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
    name: 'profund',
    label: 'Profundidade da Bomba',
    onAdd: true,
    required: true,
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
          <FormControl>
            <InputLabel htmlFor="component-simple">{this.label}</InputLabel>
            <Input
              // eslint-disable-next-line react/jsx-props-no-spreading
              id="standard-multiline-flexible"
              type="number"
              endAdornment={<InputAdornment position="end">m</InputAdornment>}
              style={{ width: '100%' }}
              value={value.value}
              onChange={onChangeField}
            />
          </FormControl>
        </div>
      );
    },
  },
  {
    name: 'tipo_tubo_edut',
    label: 'Tipo do tubo edutor',
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
    name: 'diam_tubo_edut',
    label: 'Diâm. Tubo Edutor',
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
          <FormControl>
            <InputLabel htmlFor="component-simple">{this.label}</InputLabel>
            <Input
              // eslint-disable-next-line react/jsx-props-no-spreading
              id="standard-multiline-flexible"
              type="number"
              endAdornment={<InputAdornment position="end">mm</InputAdornment>}
              style={{ width: '100%' }}
              value={value.value}
              onChange={onChangeField}
            />
          </FormControl>
        </div>
      );
    },
  },
  {
    name: 'obs',
    label: 'Obs',
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
  // todo add files
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
  columnNames.pocos_bombas,
  queryOne,
  queryAll,
  fields,
  insertQuery,
  deleteQuery,
  updateQuery,
);
