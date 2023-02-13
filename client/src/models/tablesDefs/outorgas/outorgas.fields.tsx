import React from 'react';
import v8n from 'v8n';

import tablesNames from '../tablesNames';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import FilesList from '../../../components/fieldsComponents/filesList.component';
import CondicionantesComponent from '../../../components/fieldsComponents/condicionantes.component';

import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';

import columnNames from '../../columnsNames';
import { queries, mutations } from './outorgas.graphql';

import { queries as queriesPocos } from '../pocos/pocos.graphql';
import { queries as queriesCapSuperf } from '../capSuperf/capSuperf.graphql';

import { queries as queriesCommon } from '../commonColumns.graphql';

import {
  municipios,
  uns,
  sedeSetores,
  validade,
  dataEntrada,
  licenTipo,
  capTipo,
  responsavel,
  obs,
  cnpjResp,
  orgaos,
  arquivos,
  dataEmissao,
} from '../commonFields';

import { Field } from '../../Interfaces';

import pocosOutorgados from '../relationshipTables/pocosOutorgados';
import capSuperfOutorgados from '../relationshipTables/capSuperfOutorgados';

const fields = new Map<string, Field>();

// =================================================
// N° OUTORGA
// =================================================
fields.set(columnNames.num_outorga, {
  label: 'N° da Outorga',
  columnName: columnNames.num_outorga,
  isMain: true,
  onTable: true,
  onlyTable: false,
  validate: (value) => ({
    valid: v8n().not.empty().test(value),
    msg: 'O n° da outorga é obrigatório',
  }),
  onlyDetails: false,
  query: queries.COLUMN_NUM_OUTORGA,
  mutation: queries.COLUMN_NUM_OUTORGA,
  getValue: (row) => (row.num_outorga ? { value: row.num_outorga, label: row.num_outorga } : null),
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
// SEDE SETORES
// =================================================
fields.set(columnNames.sedes_setores, sedeSetores);

// =================================================
// TIPO LICENÇA
// =================================================
fields.set(columnNames.tipo, licenTipo);

// =================================================
// TIPO CAP/OBJETO
// =================================================
fields.set(columnNames.tipo_captacao, capTipo);

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
// OBJ OUTORGA
// =================================================
fields.set(columnNames.obj_outor, {
  label: 'Objeto da outorga',
  columnName: columnNames.obj_outor,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  defaultHiddenOnTable: true,
  query: queries.COLUMN_OBJ_OUTORGA,
  mutation: queries.COLUMN_OBJ_OUTORGA,
  getValue: (row) =>
    row[columnNames.obj_outor]
      ? { value: row[columnNames.obj_outor], label: row[columnNames.obj_outor] }
      : null,
  component(tableName, featureId) {
    return (
      <TextFieldComponent multiline field={this} tableName={tableName} featureId={featureId} />
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

// =================================================
// POCOS
// =================================================
fields.set(columnNames.rel_pocos_outorgados, {
  label: 'Poços',
  columnName: columnNames.rel_pocos_outorgados,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  independent: true,
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={pocosOutorgados}
        queryOptions={{
          tableName: tablesNames.pocos.name,
          query: queriesPocos.GET_ALL_OPTIONS(),
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
// CAP SUPERF
// =================================================
fields.set(columnNames.cap_superf_rel_outorgas, {
  label: 'Cap. Superficiais',
  columnName: columnNames.cap_superf_rel_outorgas,
  isMain: false,
  onTable: false,
  onlyTable: false,
  onlyDetails: true,
  notOnNew: true,
  query: capSuperfOutorgados.query(tablesNames.cap_superf.name),
  mutation: () => '',
  independent: true,
  // eslint-disable-next-line arrow-body-style
  getValue: (row) => {
    return row[columnNames.cap_superf_rel_outorgas] &&
      row[columnNames.cap_superf_rel_outorgas].length > 0
      ? { value: row[columnNames.cap_superf_rel_outorgas].id, label: '' }
      : null;
  },
  component(tableName, featureId) {
    return (
      <RelationAutoComplete
        relationTable={capSuperfOutorgados}
        queryOptions={{
          tableName: tablesNames.cap_superf.name,
          query: queriesCapSuperf.GET_ALL_OPTIONS(),
          getFunction: (item) => ({ value: item.id, label: item.nome }),
        }}
        field={this}
        tableName={tableName}
        featureId={featureId}
      />
    );
  },
});

export default fields;
