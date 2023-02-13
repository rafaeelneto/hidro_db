import React from 'react';
import { InputAdornment } from '@material-ui/core';
import v8n from 'v8n';
import formatcoords from 'formatcoords';

import tablesNames from '../tablesNames';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import AutoCompleteList from '../../../components/fieldsComponents/autoCompleteList.component';
// eslint-disable-next-line import/no-cycle
import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';
import FilesList from '../../../components/fieldsComponents/filesList.component';
import Coordinates from '../../../components/fieldsComponents/coordinates.component';
import AuxTable from '../../../components/fieldsComponents/auxTable.component';

import columnNames from '../../columnsNames';
import { queries, mutations } from './sedeSetores.graphql';

import {
  queries as queriesMunicipios,
  mutations as mutationsMunicipios,
} from '../municipios/municipios.graphql';

import { queries as queriesUns, mutations as mutationsUns } from '../uns/uns.graphql';

import { queries as queriesCommon, mutations as mutationsCommon } from '../commonColumns.graphql';

import setoresLicenciados from '../relationshipTables/setoresLicenciados';
import { queries as queriesLicencas } from '../licencas/licencas.graphql';

import { Field } from '../../Interfaces';

import { uns, municipios, geom, arquivos } from '../commonFields';

const fields = new Map<string, Field>();

// =================================================
// NOME
// =================================================
fields.set(columnNames.nome, {
  label: 'Nome do Setor',
  columnName: columnNames.nome,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O nome do setor deve ser preenchido',
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
// MUNICIPIO
// =================================================
fields.set(columnNames.municipio, municipios);

// =================================================
// UN
// =================================================
fields.set(columnNames.un, uns);

// =================================================
// ARQUIVOS
// =================================================
fields.set(columnNames.files, arquivos(queries.GET_BY_ID, mutations.UPDATE));
// =================================================
// GEOGRAPHIC
// =================================================
fields.set(columnNames.geom, geom);

// =================================================
// ENDEREÇO
// =================================================
fields.set(columnNames.endereco, {
  label: 'Endereço',
  columnName: columnNames.endereco,
  isMain: false,
  onTable: true,
  onlyTable: false,
  defaultHiddenOnTable: true,
  onlyDetails: false,
  query: queriesCommon.COLUMN_ENDERECO,
  mutation: queriesCommon.COLUMN_ENDERECO,

  getValue: (row) => (row.ender ? { value: row.ender, label: row.ender } : null),
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
});

// =================================================
// BAIRROS ATENDIDOS
// =================================================
fields.set(columnNames.bairros_atend, {
  label: 'Bairros atendidos',
  columnName: columnNames.bairros_atend,
  isMain: false,
  onTable: true,
  onlyTable: false,
  defaultHiddenOnTable: true,
  onlyDetails: false,
  query: queries.COLUMN_BAIRROS_ATEND,
  mutation: queries.COLUMN_BAIRROS_ATEND,
  getValue: (row) =>
    row[columnNames.bairros_atend]
      ? { value: row[columnNames.bairros_atend], label: row[columnNames.bairros_atend] }
      : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
});

// =================================================
// VAZAO
// =================================================
fields.set(columnNames.vazao, {
  label: 'Vazão',
  columnName: columnNames.vazao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_VAZAO,
  mutation: queries.COLUMN_VAZAO,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().number().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) => (row.vazao ? { value: row.vazao, label: `${row.vazao} m³/h` } : null),
  getValueToExport: (row) => {
    if (!row.vazao) return '-';

    return `${row.vazao}`;
  },
  labelExport: 'Vazão (m³/h)',
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
// VAZAO DEMANDA
// =================================================
fields.set(columnNames.vaz_demanda, {
  label: 'Vazão Demanda',
  columnName: columnNames.vaz_demanda,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_VAZ_DEMANDA,
  mutation: queries.COLUMN_VAZ_DEMANDA,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().number().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row.vazao_demanda ? { value: row.vazao_demanda, label: `${row.vazao_demanda} m³/h` } : null,
  getValueToExport: (row) => {
    if (!row.vazao_demanda) return '-';

    return `${row.vazao_demanda}`;
  },
  labelExport: 'Vazão Demanda (m³/h)',
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
// POPULAÇÃO ATENDIDA
// =================================================
fields.set(columnNames.pop_atendida, {
  label: 'População atendida',
  columnName: columnNames.pop_atendida,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_POP_ATENDIDA,
  mutation: queries.COLUMN_POP_ATENDIDA,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row.pop_atendida ? { value: row.pop_atendida, label: row.pop_atendida } : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">pessoas</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// NUM LIGAÇÕES
// =================================================
fields.set(columnNames.num_ligacoes, {
  label: 'Nº de ligações totais',
  columnName: columnNames.num_ligacoes,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_NUM_LIG,
  mutation: queries.COLUMN_NUM_LIG,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row[columnNames.num_ligacoes]
      ? { value: row[columnNames.num_ligacoes], label: row[columnNames.num_ligacoes] }
      : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">ligações</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// LICENÇAS
// =================================================
fields.set(columnNames.sedes_setores_rel_licen, {
  label: 'Licenças',
  columnName: columnNames.sedes_setores_rel_licen,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  independent: true,
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={setoresLicenciados}
        queryOptions={{
          tableName: tablesNames.licencas.name,
          query: queriesLicencas.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.num_licen }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

export default fields;
