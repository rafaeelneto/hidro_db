import React from 'react';
import { InputAdornment } from '@material-ui/core';
import v8n from 'v8n';
import formatcoords from 'formatcoords';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import tablesNames from '../tablesNames';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import AuxTable from '../../../components/fieldsComponents/auxTable.component';
import CondicionantesComponent from '../../../components/fieldsComponents/condicionantes.component';
import AutoCompleteEnum from '../../../components/fieldsComponents/autoCompleteEnum.component';
import DatePicker from '../../../components/fieldsComponents/datePicker.component';

import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';

import columnNames from '../../columnsNames';
import { queries, mutations } from './notificacoes.graphql';

import { queries as queriesCommon } from '../commonColumns.graphql';

import processosNotificacoes from '../relationshipTables/processosNotificacoes';

import { queries as queriesProcessos } from '../processos/processos.graphql';

import enums from '../../enums';

import { municipios, uns, dataEntrada, obs, orgaos, arquivos, dataEmissao } from '../commonFields';

import notificacaoSituacao from '../auxTables/notificacaoSituacao';

import { Field } from '../../Interfaces';

const fields = new Map<string, Field>();

// =================================================
// N° NOTIFICAÇÃO
// =================================================
fields.set(columnNames.num_notif, {
  label: 'N° da notificação',
  columnName: columnNames.num_notif,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O n° da licença é obrigatório',
  }),
  onlyDetails: false,
  query: queries.COLUMN_NUM_NOTIF,
  mutation: queries.COLUMN_NUM_NOTIF,
  getValue: (row) =>
    row[columnNames.num_notif]
      ? { value: row[columnNames.num_notif], label: row[columnNames.num_notif] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// TIPO NOTIF
// =================================================
fields.set(columnNames.tipo_notif, {
  label: 'Tipo Notificação',
  columnName: columnNames.tipo_notif,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_TIPO_NOTIF,
  mutation: queries.COLUMN_TIPO_NOTIF,
  getValue: (row) =>
    row[columnNames.tipo_notif]
      ? { value: row[columnNames.tipo_notif], label: row[columnNames.tipo_notif] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// DATA RECEBIMENTO
// =================================================
fields.set(columnNames.data_receb, {
  label: 'Data de Recebimento',
  columnName: columnNames.data_receb,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queries.COLUMN_DATA_RECEB,
  mutation: queries.COLUMN_DATA_RECEB,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_receb]
      ? {
          value: row[columnNames.data_receb],
          label: format(new Date(row[columnNames.data_receb]), 'dd/MM/yyyy', { locale: ptBR }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// DATA RESPOSTA
// =================================================
fields.set(columnNames.data_resposta, {
  label: 'Data de Resposta',
  columnName: columnNames.data_resposta,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queries.COLUMN_DATA_RESPOSTA,
  mutation: queries.COLUMN_DATA_RESPOSTA,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_resposta]
      ? {
          value: row[columnNames.data_resposta],
          label: format(new Date(row[columnNames.data_resposta]), 'dd/MM/yyyy', { locale: ptBR }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// DATA PRAZO
// =================================================
fields.set(columnNames.data_prazo, {
  label: 'Data do Prazo',
  columnName: columnNames.data_prazo,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queries.COLUMN_DATA_PRAZO,
  mutation: queries.COLUMN_DATA_PRAZO,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_prazo]
      ? {
          value: row[columnNames.data_prazo],
          label: format(new Date(row[columnNames.data_prazo]), 'dd/MM/yyyy', { locale: ptBR }),
        }
      : null,
  component(tableName, featureId) {
    return <DatePicker field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// PRAZO EM DIAS
// =================================================
fields.set(columnNames.prazo, {
  label: 'Prazo',
  columnName: columnNames.prazo,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_PRAZO,
  mutation: queries.COLUMN_PRAZO,
  validate: (value) => ({
    // eslint-disable-next-line radix
    valid: v8n().integer().between(0, 100000000000000).test(parseInt(value)),
    msg: 'Valores positivos até 100000000000000',
  }),
  getValue: (row) =>
    row[columnNames.prazo]
      ? {
          value: row[columnNames.prazo],
          label: `${row[columnNames.prazo]} dias`,
        }
      : null,
  getValueToExport: (row) => {
    if (!row[columnNames.cap_tratamento_ms]) return '-';

    return `${row[columnNames.cap_tratamento_ms]}`;
  },
  labelExport: 'Prazo em dias',
  component(tableName, featureId) {
    return (
      <TextFieldComponent
        endAdornment={<InputAdornment position="end">dias</InputAdornment>}
        type="number"
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// DATA EMISSÃO
// =================================================
fields.set(columnNames.data_emissao, dataEmissao);

// =================================================
// MUNICIPIO
// =================================================
fields.set(columnNames.municipio, municipios);

// =================================================
// UN
// =================================================
fields.set(columnNames.un, uns);

// =================================================
// OBS
// =================================================
fields.set(columnNames.obs, obs);

// =================================================
// ORGAO
// =================================================
fields.set(columnNames.orgao, orgaos);

// =================================================
// VIA DE RECEBIMENTO
// =================================================
fields.set(columnNames.via_receb, {
  label: 'Via de Recebimento',
  columnName: columnNames.via_receb,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queries.COLUMN_VIA_RECEB,
  mutation: queries.COLUMN_VIA_RECEB,
  getValue: (row) =>
    row[columnNames.via_receb]
      ? { value: row[columnNames.via_receb], label: row[columnNames.via_receb] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// CONDICIONANTES
// =================================================
fields.set(columnNames.condicionantes, {
  label: 'Condicionantes',
  columnName: columnNames.condicionantes,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  query: queriesCommon.COLUMN_CONDICIONANTES,
  mutation: queriesCommon.COLUMN_CONDICIONANTES,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row[columnNames.condicionantes] && row[columnNames.condicionantes].length > 0
      ? { value: row[columnNames.condicionantes], label: '' }
      : { value: [], label: '' };
  },
  component(tableName, featureId) {
    return <CondicionantesComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// PROCESSOS
// =================================================
fields.set(columnNames.processos_rel_notif, {
  label: 'Processos',
  columnName: columnNames.processos_rel_notif,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  independent: true,
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={processosNotificacoes}
        queryOptions={{
          tableName: tablesNames.processos.name,
          query: queriesProcessos.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.num_processo }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// SITUAÇÃO
// =================================================
fields.set(columnNames.notif_situacao, {
  label: 'Situação',
  columnName: columnNames.notif_situacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  query: () => `
  notif_situacao( order_by: {data_situacao: desc}, limit: 1){
    data_situacao
    situacao
  }`,
  dontOrder: true,
  getValue: (row) => {
    const notifSitu = notificacaoSituacao.queryOne.getObject(row);
    if (notifSitu && notifSitu.main) return { value: notifSitu.main, label: notifSitu.main };

    return { value: '', label: '-' };
  },
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={notificacaoSituacao} field={this} featureId={featureId} />;
  },
});

// =================================================
// ARQUIVOS
// =================================================
fields.set(columnNames.files, arquivos(queries.GET_BY_ID, mutations.UPDATE));

export default fields;
