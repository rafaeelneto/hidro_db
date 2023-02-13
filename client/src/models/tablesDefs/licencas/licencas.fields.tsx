import React from 'react';
import v8n from 'v8n';

import tablesNames from '../tablesNames';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import FilesList from '../../../components/fieldsComponents/filesList.component';
import CondicionantesComponent from '../../../components/fieldsComponents/condicionantes.component';

import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';

import columnNames from '../../columnsNames';
import { queries, mutations } from './licencas.graphql';

import { queries as queriesPocos } from '../pocos/pocos.graphql';
import { queries as queriesCapSuperf } from '../capSuperf/capSuperf.graphql';

import { queries as queriesCommon } from '../commonColumns.graphql';

import setoresLicenciados from '../relationshipTables/setoresLicenciados';
import { queries as queriesSetores } from '../sede_setores/sedeSetores.graphql';

import processosLicencas from '../relationshipTables/processosLicencas';
import { queries as queriesProcessos } from '../processos/processos.graphql';

import {
  municipios,
  uns,
  validade,
  dataEntrada,
  licenTipo,
  atividade,
  responsavel,
  obs,
  cnpjResp,
  orgaos,
  arquivos,
  dataEmissao,
} from '../commonFields';

import { Field } from '../../Interfaces';

const fields = new Map<string, Field>();

// =================================================
// N° LICENCA
// =================================================
fields.set(columnNames.num_licen, {
  label: 'N° da licença',
  columnName: columnNames.num_licen,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O n° da licença é obrigatório',
  }),
  onlyDetails: false,
  query: queries.COLUMN_NUM_LICEN,
  mutation: queries.COLUMN_NUM_LICEN,
  getValue: (row) => (row.num_licen ? { value: row.num_licen, label: row.num_licen } : null),
  component(tableName, featureId) {
    return <TextFieldComponent field={this} tableName={tableName} featureId={featureId} />;
  },
});

// =================================================
// DATA EMISSÃO
// =================================================
fields.set(columnNames.data_emissao, dataEmissao);

// =================================================
// DATA ENTRADA
// =================================================
fields.set(columnNames.data_entrada, dataEntrada);

// =================================================
// VALIDADE
// =================================================
fields.set(columnNames.validade, validade);

// =================================================
// MUNICIPIO
// =================================================
fields.set(columnNames.municipio, municipios);

// =================================================
// UN
// =================================================
fields.set(columnNames.un, uns);

// =================================================
// TIPO LICENÇA
// =================================================
fields.set(columnNames.tipo, licenTipo);

// =================================================
// RESPONSAVEL
// =================================================
fields.set(columnNames.responsavel, responsavel);

// =================================================
// CNPJ RESPONSAVEL
// =================================================
fields.set(columnNames.cnpj_resp, cnpjResp);

// =================================================
// OBS
// =================================================
fields.set(columnNames.obs, obs);

// =================================================
// ORGAO
// =================================================
fields.set(columnNames.orgao, orgaos);

// =================================================
// ATIVIDADE LICENCIADA
// =================================================
fields.set(columnNames.atividade, atividade);

// =================================================
// DESCRIÇÃO DA LICENÇA
// =================================================
fields.set(columnNames.desc, {
  label: 'Descrição da Licença',
  columnName: columnNames.desc,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queries.COLUMN_DESC,
  mutation: queries.COLUMN_DESC,
  getValue: (row) =>
    row[columnNames.desc] ? { value: row[columnNames.desc], label: row[columnNames.desc] } : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
    );
  },
});

// =================================================
// SETORES
// =================================================
fields.set(columnNames.sedes_setores_rel_licen, {
  label: 'Setores Licenciados',
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
          tableName: tablesNames.sedes_setores.name,
          query: queriesSetores.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.nome }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

// =================================================
// PROCESSOS
// =================================================
fields.set(columnNames.processos_rel_licen, {
  label: 'Processos',
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
// ARQUIVOS
// =================================================
fields.set(columnNames.files, arquivos(queries.GET_BY_ID, mutations.UPDATE));

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

export default fields;
