import React from 'react';
import { InputAdornment } from '@material-ui/core';
import v8n from 'v8n';
import formatcoords from 'formatcoords';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import tablesNames from './tablesNames';

import TextFieldComponent from '../../components/fieldsComponents/textField.component';
import AutoCompleteList from '../../components/fieldsComponents/autoCompleteList.component';
import AutoCompleteEnum from '../../components/fieldsComponents/autoCompleteEnum.component';
// eslint-disable-next-line import/no-cycle
import RelationAutoComplete from '../../components/fieldsComponents/relationAutoComplete.component';
import FilesList from '../../components/fieldsComponents/filesList.component';
import Coordinates from '../../components/fieldsComponents/coordinates.component';
import AuxTable from '../../components/fieldsComponents/auxTable.component';
import DatePicker from '../../components/fieldsComponents/datePicker.component';

import enums from '../enums';

import columnNames from '../columnsNames';

import {
  queries as queriesMunicipios,
  mutations as mutationsMunicipios,
} from './municipios/municipios.graphql';

import { queries as queriesUns, mutations as mutationsUns } from './uns/uns.graphql';

import {
  queries as queriesSedeSetores,
  mutations as mutationsSedeSetores,
} from './sede_setores/sedeSetores.graphql';

import { queries as queriesOrgaos, mutations as mutationsOrgaos } from './orgaos/orgaos.graphql';

import { queries as queriesCommon, mutations as mutationsCommon } from './commonColumns.graphql';

import { Field } from './../Interfaces';

import { queries as queriesOutorgas } from './outorgas/outorgas.graphql';
import pocosOutorgados from './relationshipTables/pocosOutorgados';

export const obs: Field = {
  label: 'Observação',
  columnName: columnNames.obs,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_OBS,
  mutation: queriesCommon.COLUMN_OBS,
  getValue: (row) => (row.obs ? { value: row.obs, label: row.obs } : null),
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
};

export const geom: Field = {
  label: 'Coordenadas',
  columnName: columnNames.geom,
  isMain: false,
  onTable: true,
  onlyTable: false,
  defaultHiddenOnTable: false,
  onlyDetails: false,
  notOnNew: true,
  query: queriesCommon.COLUMN_GEOM,
  mutation: mutationsCommon.COLUMN_GEOM,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row.geom
      ? {
          value: row.geom,
          label: formatcoords(row.geom.coordinates, true).format('DD MM ss X', {
            latLonSeparator: '/',
            decimalPlaces: 2,
          }),
        }
      : null;
  },
  component(tableName, featureId) {
    return <Coordinates field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// VAZAO MÁXIMA
// =================================================
export const vazMaxima: Field = {
  label: 'Vazão Máxima',
  columnName: columnNames.vaz_max,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queriesCommon.COLUMN_VAZAO_MAX,
  mutation: queriesCommon.COLUMN_VAZAO_MAX,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().number().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) => (row.vaz_max ? { value: row.vaz_max, label: `${row.vaz_max} m³/h` } : null),
  getValueToExport: (row) => {
    if (!row.vaz_max) return '-';

    return `${row.vaz_max}`;
  },
  labelExport: 'Vazão Máxima (m³/h)',
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
};

// =================================================
// VAZAO OUTORGA
// =================================================
export const vazOutorgada: Field = {
  label: 'Vazão outorgada',
  columnName: columnNames.vaz_outorg,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queriesCommon.COLUMN_VAZAO_OUTORGA,
  mutation: queriesCommon.COLUMN_VAZAO_OUTORGA,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().number().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row.vaz_outorg ? { value: row.vaz_outorg, label: `${row.vaz_outorg} m³/h` } : null,
  getValueToExport: (row) => {
    if (!row.vaz_outorg) return '-';

    return `${row.vaz_outorg}`;
  },
  labelExport: 'Vazão Outorgada (m³/h)',
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
};

// =================================================
// HORAS OUTORGADAS
// =================================================
export const horasOutorgadas: Field = {
  label: 'Horas outorgadas',
  columnName: columnNames.horas_outorg,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_HORAS_OUTORGA,
  mutation: queriesCommon.COLUMN_HORAS_OUTORGA,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row.horas_outorg ? { value: row.horas_outorg, label: row.horas_outorg } : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">horas</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

// =================================================
// NUM PATRIMONIO
// =================================================
export const numPatrimonio: Field = {
  label: 'N° de Patrimônio',
  columnName: columnNames.num_patrimonio,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_NUM_PATRIMONIO,
  mutation: queriesCommon.COLUMN_NUM_PATRIMONIO,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row.num_patrimonio ? { value: row.num_patrimonio, label: row.num_patrimonio } : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent type="number" field={this} tableName={tableName} featureId={featureId} />
    );
  },
};

// =================================================
// MUNICIPIO
// =================================================
export const municipios: Field = {
  label: 'Município',
  columnName: columnNames.municipio,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queriesMunicipios.COLUMN,
  customOrder: (order) => {
    return `{nome: ${order}}`;
  },
  mutation: mutationsMunicipios.COLUMN,

  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row.municipio && row.municipio.nome
      ? { value: row.municipio.id, label: row.municipio.nome }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteList
        graphQlQuery={{
          tableName: tablesNames.municipios.name,
          query: queriesMunicipios.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.nome }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

// =================================================
// UN
// =================================================
export const uns: Field = {
  label: 'Unid. de Negócios',
  columnName: columnNames.un,
  isMain: false,
  onTable: true,
  onlyTable: false,

  onlyDetails: false,
  query: queriesUns.COLUMN,
  customOrder: (order) => {
    return `{nome: ${order}}`;
  },
  mutation: mutationsUns.COLUMN,
  getValue: (row) => (row.un && row.un.nome ? { value: row.un.id, label: row.un.nome } : null),
  component(tableName, featureId) {
    return (
      <AutoCompleteList
        graphQlQuery={{
          tableName: tablesNames.un.name,
          query: queriesUns.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.nome }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

// =================================================
// SEDE SETORES
// =================================================
export const sedeSetores: Field = {
  label: 'Setor',
  columnName: columnNames.sedes_setores,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queriesSedeSetores.COLUMN,
  customOrder: (order) => {
    return `{nome: ${order}}`;
  },
  mutation: mutationsSedeSetores.COLUMN,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row.sede_setores && row.sede_setores.nome
      ? { value: row.sede_setores.id, label: row.sede_setores.nome }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteList
        graphQlQuery={{
          tableName: tablesNames.sedes_setores.name,
          query: queriesSedeSetores.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.nome }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

// =================================================
// SITUAÇÃO LICENCIAMENTO
// =================================================
export const licenSitu: Field = {
  label: 'Situação do Licenciamento',
  columnName: columnNames.licen_situ,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_LICEN_SITU,
  mutation: queriesCommon.COLUMN_LICEN_SITU,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row[columnNames.licen_situ]
      ? {
          value: row[columnNames.licen_situ],
          label: enums.enum_licen_situ.get(row[columnNames.licen_situ]),
        }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteEnum
        enumOptions={enums.enum_licen_situ}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

// =================================================
// TIPO LICENCIAMENTO
// =================================================
export const licenTipo: Field = {
  label: 'Tipo',
  columnName: columnNames.tipo,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_TIPO,
  mutation: queriesCommon.COLUMN_TIPO,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row[columnNames.tipo]
      ? {
          value: row[columnNames.tipo],
          label: enums.enum_licen_tipo.get(row[columnNames.tipo]),
        }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteEnum
        enumOptions={enums.enum_licen_tipo}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

export const capTipo: Field = {
  label: 'Tipo Captação/Objeto',
  columnName: columnNames.tipo_captacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_TIPO_CAP,
  mutation: queriesCommon.COLUMN_TIPO_CAP,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row[columnNames.tipo_captacao]
      ? {
          value: row[columnNames.tipo_captacao],
          label: enums.enum_cap_tipo.get(row[columnNames.tipo_captacao]),
        }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteEnum
        enumOptions={enums.enum_cap_tipo}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

// =================================================
// DATA ENTRADA
// =================================================
export const dataEntrada: Field = {
  label: 'Data de Entrada',
  columnName: columnNames.data_entrada,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queriesCommon.COLUMN_DATA_ENTRADA,
  mutation: queriesCommon.COLUMN_DATA_ENTRADA,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_entrada]
      ? {
          value: row[columnNames.data_entrada],
          label: format(new Date(row[columnNames.data_entrada]), 'dd/MM/yyyy', { locale: ptBR }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// VALIDADE
// =================================================
export const validade: Field = {
  label: 'Validade',
  columnName: columnNames.validade,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queriesCommon.COLUMN_VALIDADE,
  mutation: queriesCommon.COLUMN_VALIDADE,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.validade]
      ? {
          value: row[columnNames.validade],
          label: format(new Date(row[columnNames.validade]), 'dd/MM/yyyy', {
            locale: ptBR,
          }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// DATA EMISSAO
// =================================================
export const dataEmissao: Field = {
  label: 'Data de Emissão',
  columnName: columnNames.data_emissao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queriesCommon.COLUMN_DATA_EMISSAO,
  mutation: queriesCommon.COLUMN_DATA_EMISSAO,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_emissao]
      ? {
          value: row[columnNames.data_emissao],
          label: format(new Date(row[columnNames.data_emissao]), 'dd/MM/yyyy', {
            locale: ptBR,
          }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// RESPONSAVEL
// =================================================
export const responsavel: Field = {
  label: 'Responsável',
  columnName: columnNames.responsavel,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_RESPONSAVEL,
  mutation: queriesCommon.COLUMN_RESPONSAVEL,
  getValue: (row) =>
    row[columnNames.responsavel]
      ? { value: row[columnNames.responsavel], label: row[columnNames.responsavel] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// CORPO HÍDRICO
// =================================================
export const corpoHidrico: Field = {
  label: 'Corpo Hídrico',
  columnName: columnNames.corpo_hidrico,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queriesCommon.COLUMN_CORPO_HIDRICO,
  mutation: queriesCommon.COLUMN_CORPO_HIDRICO,
  getValue: (row) =>
    row[columnNames.corpo_hidrico]
      ? { value: row[columnNames.corpo_hidrico], label: row[columnNames.corpo_hidrico] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// BOMBA
// =================================================
export const bomba: Field = {
  label: 'Bomba',
  columnName: columnNames.bomba,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_BOMBA,
  mutation: queriesCommon.COLUMN_BOMBA,
  getValue: (row) =>
    row[columnNames.bomba]
      ? { value: row[columnNames.bomba], label: row[columnNames.bomba] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// CNPJ RESPONSAVEL
// =================================================
export const cnpjResp: Field = {
  label: 'CNPJ Responsável',
  columnName: columnNames.cnpj_resp,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_CNPJ_RESPONSAVEL,
  mutation: queriesCommon.COLUMN_CNPJ_RESPONSAVEL,
  getValue: (row) =>
    row[columnNames.cnpj_resp]
      ? { value: row[columnNames.cnpj_resp], label: row[columnNames.cnpj_resp] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
};

// =================================================
// ORGAOS
// =================================================
export const orgaos: Field = {
  label: 'Orgão',
  columnName: columnNames.orgao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queriesOrgaos.COLUMN,
  customOrder: (order) => {
    return `{nome: ${order}}`;
  },
  mutation: mutationsOrgaos.COLUMN,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row.orgao && row.orgao.nome ? { value: row.orgao.id, label: row.orgao.nome } : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteList
        graphQlQuery={{
          tableName: 'orgaos',
          query: queriesOrgaos.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.nome }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
};

export const atividade: Field = {
  label: 'Atividade Licenciada',
  columnName: columnNames.atividade,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queriesCommon.COLUMN_ATIVIDADE,
  mutation: queriesCommon.COLUMN_ATIVIDADE,
  getValue: (row) => (row.atividade ? { value: row.atividade, label: row.atividade } : null),
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
};

export const arquivos = (queryFunction: any, mutationUpdateFuncion: any) => ({
  label: 'Arquivos',
  columnName: columnNames.files,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  independent: true,
  notOnNew: true,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row.files ? row.files : [];
  },
  component(tableName, featureId) {
    return (
      <FilesList
        field={this}
        tableName={tableName}
        query={queryFunction(queriesCommon.COLUMN_FILES_JSON())}
        mutation={mutationUpdateFuncion()}
        featureId={featureId}
      />
    );
  },
});
