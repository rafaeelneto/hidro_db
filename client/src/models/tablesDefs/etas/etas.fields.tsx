import React from 'react';
import { InputAdornment } from '@material-ui/core';
import v8n from 'v8n';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';

import columnNames from '../../columnsNames';
import { queries, mutations } from './etas.graphql';

import { queries as queriesCommon, mutations as mutationsCommon } from '../commonColumns.graphql';

import { municipios, uns, sedeSetores, geom, obs, arquivos } from '../commonFields';

import { Field } from '../../Interfaces';

const fields = new Map<string, Field>();

// =================================================
// NOME
// =================================================
fields.set(columnNames.nome, {
  label: 'Nome',
  columnName: columnNames.nome,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O nome deve ser preenchido',
  }),
  onlyDetails: false,
  query: queriesCommon.COLUMN_NOME,
  mutation: mutationsCommon.COLUMN_NOME,
  getValue: (row) => (row.nome ? { value: row.nome, label: row.nome } : null),
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// CAP. TRATAMENTO
// =================================================
fields.set(columnNames.cap_tratamento, {
  label: 'Cap. Tratamento',
  columnName: columnNames.cap_tratamento,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_CAP_TRATAM,
  mutation: queries.COLUMN_CAP_TRATAM,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 100000000000000).test(parseInt(value)),
    msg: 'Valores positivos até 100000000000000',
  }),
  getValue: (row) =>
    row[columnNames.cap_tratamento]
      ? { value: row[columnNames.cap_tratamento], label: `${row[columnNames.cap_tratamento]} m³/h` }
      : null,
  getValueToExport: (row) => {
    if (!row[columnNames.cap_tratamento]) return '-';

    return `${row[columnNames.cap_tratamento]}`;
  },
  labelExport: 'Cap. Tratamento (m³/h)',
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">m³/h</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// CAP. TRATAMENTO M³/S
// =================================================
fields.set(columnNames.cap_tratamento_ms, {
  label: 'Cap. Tratamento',
  columnName: columnNames.cap_tratamento_ms,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_CAP_TRATAM_MS,
  mutation: queries.COLUMN_CAP_TRATAM_MS,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 100000000000000).test(parseInt(value)),
    msg: 'Valores positivos até 100000000000000',
  }),
  getValue: (row) =>
    row[columnNames.cap_tratamento_ms]
      ? {
          value: row[columnNames.cap_tratamento_ms],
          label: `${row[columnNames.cap_tratamento_ms]} m³/s`,
        }
      : null,
  getValueToExport: (row) => {
    if (!row[columnNames.cap_tratamento_ms]) return '-';

    return `${row[columnNames.cap_tratamento_ms]}`;
  },
  labelExport: 'Cap. Tratamento (m³/s)',
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">m³/s</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// PARTES INTEGRANTES
// =================================================
fields.set(columnNames.parte_int, {
  label: 'Partes Integrantes',
  columnName: columnNames.parte_int,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_PARTE_INT,
  mutation: queries.COLUMN_PARTE_INT,
  getValue: (row) =>
    row[columnNames.parte_int]
      ? { value: row[columnNames.parte_int], label: row[columnNames.parte_int] }
      : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
});

// =================================================
// OBS
// =================================================
fields.set(columnNames.obs, obs);

// =================================================
// MUNICIPIO
// =================================================
fields.set(columnNames.municipio, municipios);

// =================================================
// UN
// =================================================
fields.set(columnNames.un, uns);

// =================================================
// SEDE SETORES
// =================================================
fields.set(columnNames.sedes_setores, sedeSetores);

// =================================================
// ARQUIVOS
// =================================================
fields.set(columnNames.files, arquivos(queries.GET_BY_ID, mutations.UPDATE));

// =================================================
// GEOGRAPHIC
// =================================================
fields.set(columnNames.geom, geom);

export default fields;
