import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './outorgas.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './outorgas.graphql';

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
    ],
  },
  {
    label: 'Localização',
    fields: [columnNames.municipio, columnNames.un, columnNames.sedes_setores],
  },
  {
    label: 'Componentes',
    fields: [
      columnNames.tipo_captacao,
      columnNames.obj_outor,
      columnNames.rel_pocos_outorgados,
      columnNames.cap_superf_rel_outorgas,
    ],
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
      ${queries.COUNT_OUTORGAS(filters)}
    `);
    if (loading) return 0;
    return data.outorgas_aggregate ? data.outorgas_aggregate.aggregate.count : 0;
  },
};

// TODO: PASS TO COMPONENTS FOLDER
const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.outorgas.name}
        table={new Outorgas()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  {
    label: 'Outorgas vigentes',
    filter: 'where: {validade: {_gt: "now()"}}',
    orderBy: 'validade',
    order: 'asc',
    component(refetch, onRefetch) {
      return (
        <MainTable
          tableName={tablesNames.outorgas.name}
          table={new Outorgas()}
          filters={this.filter}
          orderBy={this.orderBy}
          doRefetch={refetch}
          onRefetch={onRefetch}
        />
      );
    },
  },
  {
    label: 'Outorgas vencidas',
    filter: 'where: {validade: {_lte: "now()"}}',
    orderBy: 'validade',
    order: 'asc',
    component(refetch, onRefetch) {
      return (
        <MainTable
          tableName={tablesNames.outorgas.name}
          table={new Outorgas()}
          filters={this.filter}
          orderBy={this.orderBy}
          doRefetch={refetch}
          onRefetch={onRefetch}
        />
      );
    },
  },
];

export default class Outorgas extends MainFeature {
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
