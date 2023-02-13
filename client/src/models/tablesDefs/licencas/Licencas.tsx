import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './licencas.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './licencas.graphql';

import { fieldsOrderType, customTabType } from '../../Interfaces';
import { MainFeature } from '../../MainFeature';

import MainTable from '../../../components/mainTable/mainTable.component';

// TODO: Pass to components folder
const previewComponent = {};

const fieldsOrganization: fieldsOrderType = [
  {
    label: 'Geral',
    fields: [
      columnNames.orgao,
      columnNames.tipo,
      columnNames.responsavel,
      columnNames.cnpj_resp,
      columnNames.data_emissao,
      columnNames.data_entrada,
      columnNames.validade,
      columnNames.obs,
      columnNames.processos_rel_licen,
    ],
  },
  {
    label: 'Objetos licenciados',
    fields: [columnNames.atividade, columnNames.desc, columnNames.sedes_setores_rel_licen],
  },
  {
    label: 'Localização',
    fields: [columnNames.municipio, columnNames.un],
  },
  {
    label: 'Arquivos',
    fields: [columnNames.files],
  },
  {
    label: 'Condicionantes',
    fields: [columnNames.condicionantes],
  },
];

const statistics = {
  count: function useCount(filters = '') {
    const { data, loading } = useQuery(gql`
      ${queries.COUNT_LICENCAS(filters)}
    `);
    if (loading) return 0;
    return data.licencas_aggregate ? data.licencas_aggregate.aggregate.count : 0;
  },
};

// TODO: PASS TO COMPONENTS FOLDER
const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.licencas.name}
        table={new Licencas()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  {
    label: 'Licenças vigentes',
    filter: 'where: {validade: {_gt: "now()"}}',
    orderBy: 'validade',
    order: 'asc',
    component(refetch, onRefetch) {
      return (
        <MainTable
          tableName={tablesNames.licencas.name}
          table={new Licencas()}
          filters={this.filter}
          orderBy={this.orderBy}
          doRefetch={refetch}
          onRefetch={onRefetch}
        />
      );
    },
  },
  {
    label: 'Licenças vencidas',
    filter: 'where: {validade: {_lte: "now()"}}',
    orderBy: 'validade',
    order: 'asc',
    component(refetch, onRefetch) {
      return (
        <MainTable
          tableName={tablesNames.licencas.name}
          table={new Licencas()}
          filters={this.filter}
          orderBy={this.orderBy}
          doRefetch={refetch}
          onRefetch={onRefetch}
        />
      );
    },
  },
];

export default class Licencas extends MainFeature {
  constructor() {
    super(
      true,
      previewComponent,
      fields,
      fieldsOrganization,
      statistics,
      queries,
      mutations,
      customTabs,
    );
  }
}
