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
import PocosPerfisComponent from '../../../components/fieldsComponents/pocosPerfis.component';
import PocosTesteB from '../../../components/fieldsComponents/pocosTesteB.component';

import enums from '../../enums';
import tablesNames from '../tablesNames';

import columnNames from '../../columnsNames';
import { queries, mutations } from './pocos.graphql';

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

import pocosOutorgados from '../relationshipTables/pocosOutorgados';
import pocosSituacao from '../auxTables/pocosSituacao';
import pocosBombas from '../auxTables/pocosBombas';
import pocosManutencao from '../auxTables/pocosManutencao';

const fields = new Map<string, Field>();

// =================================================
// NOME
// =================================================
fields.set(columnNames.nome, {
  label: 'Nome do Poço',
  columnName: columnNames.nome,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O nome do poço deve ser preenchido',
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
fields.set(columnNames.pocos_situacao, {
  label: 'Situação',
  columnName: columnNames.pocos_situacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  query: () => `
  pocos_situacao( order_by: {date: desc}, limit: 1){
    date
    situacao
  }`,
  dontOrder: true,
  getValue: (row) => {
    const notifSitu = pocosSituacao.queryOne.getObject(row);
    if (notifSitu && notifSitu.main) return { value: notifSitu.main, label: notifSitu.main };

    return { value: '', label: '-' };
  },
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={pocosSituacao} field={this} featureId={featureId} />;
  },
});

// =================================================
// PROFUNDIDADE
// =================================================
fields.set(columnNames.profundidade, {
  label: 'Profundidade',
  columnName: columnNames.profundidade,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().number().between(0, 10000).test(parseInt(value)),
    msg: 'Valores positivos até 10000',
  }),
  query: queries.COLUMN_PROFUNDIDADE,
  mutation: mutations.COLUMN_PROFUNDIDADE,
  getValue: (row) => (row.profun ? { value: row.profun, label: `${row.profun} m` } : null),
  getValueToExport: (row) => (row.profun ? row.profun : '-'),
  labelExport: 'Profundidade (m)',
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">metros</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// Bombas
// =================================================
fields.set(columnNames.pocos_bombas, {
  label: 'Bomba',
  columnName: columnNames.pocos_bombas,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  query: () => `
  pocos_bombas( order_by: {data_instalacao: desc}, limit: 1){
    profund
      bomba_nova_nome
      data_instalacao
  }`,
  dontOrder: true,
  getValue: (row) => {
    const bombaPoco = pocosBombas.queryOne.getObject(row);
    if (bombaPoco && bombaPoco.main) return { value: bombaPoco.main, label: bombaPoco.main };

    return { value: '', label: '-' };
  },
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={pocosBombas} field={this} featureId={featureId} />;
  },
});

// =================================================
// TESTE DE BOMBAMENTO
// =================================================
fields.set(columnNames.pocos_testes_bomb, {
  label: 'Teste de Bombeamento',
  columnName: columnNames.pocos_testes_bomb,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  notOnNew: true,
  component(tableName, featureId) {
    return <PocosTesteB field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// VAZAO MÁXIMA
// =================================================
fields.set(columnNames.vaz_max, vazMaxima);

// =================================================
// VAZAO OUTORGA
// =================================================
fields.set(columnNames.vaz_outorg, vazOutorgada);

// =================================================
// HORAS OUTORGADAS
// =================================================
fields.set(columnNames.horas_outorg, horasOutorgadas);

// =================================================
// PONTEIRA
// =================================================
fields.set(columnNames.ponteira, {
  label: 'N° Ponteira',
  columnName: columnNames.ponteira,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queries.COLUMN_PONTEIRA,
  mutation: queries.COLUMN_PONTEIRA,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 1000000000).test(parseInt(value)),
    msg: 'Valores positivos até 1000000000',
  }),
  getValue: (row) =>
    row.ponteira ? { value: row.ponteira, label: row.ponteira > 1 ? row.ponteira : '-' } : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        helperText="Caso não seja ponteira, apenas colocar 1"
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
// DATA PERFURAÇÃO
// =================================================
fields.set(columnNames.data_perf, {
  label: 'Data Perfuração',
  columnName: columnNames.data_perf,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queries.COLUMN_DATA_PERF,
  mutation: queries.COLUMN_DATA_PERF,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_perf]
      ? {
          value: row[columnNames.data_perf],
          label: format(new Date(row[columnNames.data_perf]), 'dd/MM/yyyy', {
            locale: ptBR,
          }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// DATA ENTREGA
// =================================================
fields.set(columnNames.data_entrega, {
  label: 'Data Entrega',
  columnName: columnNames.data_entrega,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queriesCommon.COLUMN_DATA_ENTREGA,
  mutation: queriesCommon.COLUMN_DATA_ENTREGA,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_entrega]
      ? {
          value: row[columnNames.data_entrega],
          label: format(new Date(row[columnNames.data_entrega]), 'dd/MM/yyyy', {
            locale: ptBR,
          }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
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
// SEDE SETORES
// =================================================
fields.set(columnNames.sedes_setores, sedeSetores);

// =================================================
// SITUAÇÃO LICENCIAMENTO
// =================================================
fields.set(columnNames.licen_situ, {
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
});

// =================================================
// OUTORGAS
// =================================================
fields.set(columnNames.rel_pocos_outorgados, {
  label: 'Outorgas',
  columnName: columnNames.rel_pocos_outorgados,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  independent: true,
  getValue: (row) => {
    return row.rel_pocos_outorgados && row.rel_pocos_outorgados.length > 0
      ? { value: row.sede_setores.id, label: row.sede_setores.nome }
      : null;
  },
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={pocosOutorgados}
        queryOptions={{
          tableName: tablesNames.outorgas.name,
          query: queriesOutorgas.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.num_outorga }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// ARQUIVOS
// =================================================
fields.set(columnNames.files, arquivos(queries.GET_BY_ID, mutations.UPDATE));

// =================================================
// GEOGRAPHIC
// =================================================
fields.set(columnNames.geom, geom);

// =================================================
// MANUTENÇÃO
// =================================================
fields.set(columnNames.pocos_manutencao, {
  label: 'Manutenção',
  columnName: columnNames.pocos_manutencao,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  independent: true,
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={pocosManutencao} field={this} featureId={featureId} />;
  },
});

// =================================================
// PERFIL
// =================================================
const PERFIL_DEFAULT = {
  geologico: [],
  construtivo: {
    furo: [],
    filtros: [],
    tubo_boca: [],
    revestimento: [],
    espaco_anelar: [],
    laje: {
      tipo: '',
      largura: '',
      espessura: '',
      comprimento: '',
    },
  },
};
fields.set(columnNames.perfil_geol_const, {
  label: 'Perfil geológico construtivo',
  columnName: columnNames.perfil_geol_const,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  query: queries.COLUMN_PERFIL_GEOL_CONST,
  mutation: queries.COLUMN_PERFIL_GEOL_CONST,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    if (!row[columnNames.perfil_geol_const]) {
      return { value: PERFIL_DEFAULT, label: '' };
    }

    let noPerfil = true;
    if (
      row[columnNames.perfil_geol_const].geologic &&
      row[columnNames.perfil_geol_const].constructive
    ) {
      noPerfil =
        row[columnNames.perfil_geol_const].geologic.length === 0 &&
        row[columnNames.perfil_geol_const].constructive.bole_hole.length === 0 &&
        row[columnNames.perfil_geol_const].constructive.hole_fill.length === 0 &&
        row[columnNames.perfil_geol_const].constructive.well_case.length === 0 &&
        row[columnNames.perfil_geol_const].constructive.well_screen.length === 0;
    }

    if (noPerfil) {
      return { value: PERFIL_DEFAULT, label: '' };
    }
    return { value: row[columnNames.perfil_geol_const], label: '' };
  },
  component(tableName, featureId) {
    return <PocosPerfisComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

export default fields;
