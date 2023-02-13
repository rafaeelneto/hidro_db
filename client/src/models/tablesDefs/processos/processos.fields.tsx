import React from 'react';
import v8n from 'v8n';

import tablesNames from '../tablesNames';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import FilesList from '../../../components/fieldsComponents/filesList.component';
import CondicionantesComponent from '../../../components/fieldsComponents/condicionantes.component';
import AuxTable from '../../../components/fieldsComponents/auxTable.component';
import AutoCompleteEnum from '../../../components/fieldsComponents/autoCompleteEnum.component';

import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';

import columnNames from '../../columnsNames';
import { queries, mutations } from './processos.graphql';

import { queries as queriesCommon } from '../commonColumns.graphql';

import processosSituacao from '../auxTables/processosSituacao';

import processosLicencas from '../relationshipTables/processosLicencas';
import processosOutorgas from '../relationshipTables/processosOutorgas';
import processosNotificacoes from '../relationshipTables/processosNotificacoes';

import { queries as queriesLicencas } from '../licencas/licencas.graphql';
import { queries as queriesOutorgas } from '../outorgas/outorgas.graphql';
import { queries as queriesNotificaoes } from '../notificacoes/notificacoes.graphql';

import enums from '../../enums';

import { municipios, uns, dataEntrada, obs, orgaos, arquivos } from '../commonFields';

import { Field } from '../../Interfaces';

const fields = new Map<string, Field>();

// =================================================
// N° PROCESSO
// =================================================
fields.set(columnNames.num_processo, {
  label: 'N° do Processo',
  columnName: columnNames.num_processo,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O n° da licença é obrigatório',
  }),
  onlyDetails: false,
  query: queries.COLUMN_NUM_PROCESSO,
  mutation: queries.COLUMN_NUM_PROCESSO,
  getValue: (row) =>
    row[columnNames.num_processo]
      ? { value: row[columnNames.num_processo], label: row[columnNames.num_processo] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// DATA ENTRADA
// =================================================
fields.set(columnNames.data_entrada, dataEntrada);

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
// OBJ PROCESSO
// =================================================
fields.set(columnNames.obj_processo, {
  label: 'Objeto do Processo',
  columnName: columnNames.obj_processo,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queries.COLUMN_OBJ_PROCESSO,
  mutation: queries.COLUMN_OBJ_PROCESSO,
  getValue: (row) =>
    row[columnNames.obj_processo]
      ? { value: row[columnNames.obj_processo], label: row[columnNames.obj_processo] }
      : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
});

// =================================================
// DESCRIÇÃO DO PROCESSO
// =================================================
fields.set(columnNames.descricao, {
  label: 'Descrição do Processo',
  columnName: columnNames.descricao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queries.COLUMN_DESCRICAO,
  mutation: queries.COLUMN_DESCRICAO,
  getValue: (row) =>
    row[columnNames.descricao]
      ? { value: row[columnNames.descricao], label: row[columnNames.descricao] }
      : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
});

// =================================================
// SITUAÇÃO
// =================================================
fields.set(columnNames.situacao, {
  label: 'Situação (temporario)',
  columnName: columnNames.situacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_SITUACAO,
  mutation: queries.COLUMN_SITUACAO,
  getValue: (row) =>
    row[columnNames.situacao]
      ? { value: row[columnNames.situacao], label: row[columnNames.situacao] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// SITUAÇÃO
// =================================================
fields.set(columnNames.processos_situacao, {
  label: 'Situação',
  columnName: columnNames.processos_situacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  query: () => `
  processos_situacao( order_by: {data_situacao: desc}, limit: 1){
    data_situacao
    situacao
  }`,
  dontOrder: true,
  getValue: (row) => {
    const notifSitu = processosSituacao.queryOne.getObject(row);
    if (notifSitu && notifSitu.main) return { value: notifSitu.main, label: notifSitu.main };

    return { value: '', label: '-' };
  },
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={processosSituacao} field={this} featureId={featureId} />;
  },
});

// =================================================
// TIPOLOGIA
// =================================================
fields.set(columnNames.tipologia, {
  label: 'Tipologia',
  columnName: columnNames.tipologia,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  query: queries.COLUMN_SITUACAO,
  mutation: queries.COLUMN_SITUACAO,
  getValue: (row) =>
    row[columnNames.tipologia]
      ? { value: row[columnNames.tipologia], label: row[columnNames.tipologia] }
      : null,
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// TIPOLOGIA DO PROCESSO
// =================================================
fields.set(columnNames.tipo, {
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
          label: enums.enum_processo_tipo.get(row[columnNames.tipo]),
        }
      : null;
  },
  component(tableName, featureId) {
    return (
      <AutoCompleteEnum
        enumOptions={enums.enum_processo_tipo}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// LICENCAS
// =================================================
fields.set(columnNames.processos_rel_licen, {
  label: 'Licenças',
  columnName: columnNames.processos_rel_licen,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  independent: true,
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={processosLicencas}
        queryOptions={{
          tableName: tablesNames.licencas.name,
          query: queriesLicencas.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.num_licenca }),
        }}
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
fields.set(columnNames.processos_rel_outor, {
  label: 'Outorgas',
  columnName: columnNames.processos_rel_outor,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  independent: true,
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={processosOutorgas}
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
// NOTIFICAÇÕES
// =================================================
fields.set(columnNames.processos_rel_notif, {
  label: 'Notificações',
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
          tableName: tablesNames.notificacoes.name,
          query: queriesNotificaoes.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.num_notif }),
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

export default fields;
