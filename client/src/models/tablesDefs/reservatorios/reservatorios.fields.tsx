import React from 'react';
import { InputAdornment } from '@material-ui/core';
import v8n from 'v8n';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import AutoCompleteEnum from '../../../components/fieldsComponents/autoCompleteEnum.component';
import FilesList from '../../../components/fieldsComponents/filesList.component';
import AuxTable from '../../../components/fieldsComponents/auxTable.component';
import DatePicker from '../../../components/fieldsComponents/datePicker.component';
import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';

import enums from '../../enums';
import tablesNames from '../tablesNames';

import columnNames from '../../columnsNames';
import { queries, mutations } from './reservatorios.graphql';

import { queries as queriesCommon, mutations as mutationsCommon } from '../commonColumns.graphql';

import { queries as queriesOutorgas } from '../outorgas/outorgas.graphql';

import {
  municipios,
  uns,
  sedeSetores,
  geom,
  obs,
  numPatrimonio,
  horasOutorgadas,
  vazOutorgada,
  vazMaxima,
  arquivos,
} from '../commonFields';

import { Field } from '../../Interfaces';

import reservatoriosSituacao from '../auxTables/reservatorioSituacao';

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
// SITUAÇÃO
// =================================================
fields.set(columnNames.reservatorios_situacao, {
  label: 'Situação',
  columnName: columnNames.reservatorios_situacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  query: () => `
  reservatorios_situacao( order_by: {date: desc}, limit: 1){
    date
    situacao
  }`,
  dontOrder: true,
  getValue: (row) => {
    const reservSitu = reservatoriosSituacao.queryOne.getObject(row);
    if (reservSitu && reservSitu.main) return { value: reservSitu.main, label: reservSitu.main };

    return { value: '', label: '-' };
  },
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={reservatoriosSituacao} field={this} featureId={featureId} />;
  },
});

// =================================================
// TIPO RESERV.
// =================================================
fields.set(columnNames.tipo, {
  label: 'Tipo de Reservatório',
  columnName: columnNames.tipo,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_TIPO,
  mutation: queries.COLUMN_TIPO,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row[columnNames.tipo]
      ? {
          value: row[columnNames.tipo],
          label: enums.enum_reserv_tipo.get(row[columnNames.tipo]),
        }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteEnum
        enumOptions={enums.enum_reserv_tipo}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// VOLUME UTIL
// =================================================
fields.set(columnNames.vol_util, {
  label: 'Volume Útil',
  columnName: columnNames.vol_util,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_VOL_UTIL,
  mutation: queries.COLUMN_VOL_UTIL,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 100000000000000).test(parseInt(value)),
    msg: 'Valores positivos até 100000000000000',
  }),
  getValue: (row) => (row.vol_util ? { value: row.vol_util, label: `${row.vol_util} m³` } : null),
  getValueToExport: (row) => {
    if (!row.vol_util) return '-';

    return `${row.vol_util}`;
  },
  labelExport: 'Volume Útil (m³)',
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">m³</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// AREA UTIL
// =================================================
fields.set(columnNames.area_util, {
  label: 'Área Útil',
  columnName: columnNames.area_util,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_AREA_UTIL,
  mutation: queries.COLUMN_AREA_UTIL,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 100000000000000).test(parseInt(value)),
    msg: 'Valores positivos até 100000000000000',
  }),
  getValue: (row) =>
    row.area_util ? { value: row.area_util, label: `${row.area_util} m²` } : null,

  getValueToExport: (row) => {
    if (!row.area_util) return '-';

    return `${row.area_util}`;
  },
  labelExport: 'Área Útil (m²)',
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">m²</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// NUM PATRIMONIO
// =================================================
fields.set(columnNames.num_patrimonio, numPatrimonio);

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
