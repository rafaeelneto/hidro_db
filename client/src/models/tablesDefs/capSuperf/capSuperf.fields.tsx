import React from 'react';
import { InputAdornment } from '@material-ui/core';
import v8n from 'v8n';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import TextFieldComponent from '../../../components/fieldsComponents/textField.component';
import AutoCompleteEnum from '../../../components/fieldsComponents/autoCompleteEnum.component';
import RelationAutoComplete from '../../../components/fieldsComponents/relationAutoComplete.component';
import FilesList from '../../../components/fieldsComponents/filesList.component';
import AuxTable from '../../../components/fieldsComponents/auxTable.component';
import DatePicker from '../../../components/fieldsComponents/datePicker.component';

import enums from '../../enums';

import columnNames from '../../columnsNames';
import { queries, mutations } from './capSuperf.graphql';

import tablesNames from '../tablesNames';

import { queries as queriesCommon, mutations as mutationsCommon } from '../commonColumns.graphql';
import { queries as queriesOutorgas } from '../outorgas/outorgas.graphql';

import {
  municipios,
  uns,
  sedeSetores,
  geom,
  obs,
  corpoHidrico,
  horasOutorgadas,
  vazOutorgada,
  vazMaxima,
  licenSitu,
  bomba,
  arquivos,
} from '../commonFields';

import { Field } from '../../Interfaces';

import capSuperfSituacao from '../auxTables/capSuperfSituacao';
import capSuperfOutorgados from '../relationshipTables/capSuperfOutorgados';

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
fields.set(columnNames.cap_superf_situacao, {
  label: 'Situação',
  columnName: columnNames.cap_superf_situacao,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  independent: true,
  query: () => `
  cap_superf_situacao( order_by: {date: desc}, limit: 1){
    date
    situacao
  }`,
  dontOrder: true,
  getValue: (row) => {
    const notifSitu = capSuperfSituacao.queryOne.getObject(row);
    if (notifSitu && notifSitu.main) return { value: notifSitu.main, label: notifSitu.main };

    return { value: '', label: '-' };
  },
  notOnNew: true,
  component(tableName, featureId) {
    return <AuxTable auxTable={capSuperfSituacao} field={this} featureId={featureId} />;
  },
});

// =================================================
// CORPO HÍDRICO
// =================================================
fields.set(columnNames.corpo_hidrico, corpoHidrico);

// =================================================
// DATA IMPLANTAÇÃO
// =================================================
fields.set(columnNames.data_implan, {
  label: 'Data Implantação',
  columnName: columnNames.data_implan,
  isMain: false,
  onTable: true,
  onlyTable: false,
  onlyDetails: false,
  // validate: (value) => ({
  //   valid: v8n().number().between(0, 10000).test(parseInt(value)),
  //   msg: 'Valores positivos até 10000',
  // }),
  query: queriesCommon.COLUMN_DATA_IMPLACAO,
  mutation: queriesCommon.COLUMN_DATA_IMPLACAO,
  // eslint-disable-next-line no-confusing-arrow
  getValue: (row) =>
    row[columnNames.data_implan]
      ? {
          value: row[columnNames.data_implan],
          label: format(new Date(row[columnNames.data_implan]), 'dd/MM/yyyy', {
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
fields.set(columnNames.licen_situ, licenSitu);

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
// NUM PATRIMONIO
// =================================================
// fields.set(columnNames.num_patrimonio, numPatrimonio);

// =================================================
// OBS
// =================================================
fields.set(columnNames.obs, obs);

// =================================================
// BOMBA
// =================================================
fields.set(columnNames.bomba, bomba);

// =================================================
// OUTORGAS
// =================================================
fields.set(columnNames.cap_superf_rel_outorgas, {
  label: 'Outorgas',
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

export default fields;
