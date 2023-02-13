import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './notificacoes.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './notificacoes.graphql';

import { fieldsOrderType, customTabType } from '../../Interfaces';
import { MainFeature } from '../../MainFeature';

import MainTable from '../../../components/mainTable/mainTable.component';

// TODO: Pass to components folder
const previewComponent = {};

const fieldsOrganization: fieldsOrderType = [
  {
    label: 'Geral',
    fields: [
      columnNames.data_receb,
      columnNames.via_receb,
      columnNames.data_emissao,
      columnNames.obs,
      columnNames.orgao,
    ],
  },
  {
    label: 'Situação',
    fields: [columnNames.notif_situacao],
  },
  {
    label: 'Detalhes',
    fields: [
      columnNames.processos_rel_notif,
      columnNames.prazo,
      columnNames.data_prazo,
      columnNames.condicionantes,
    ],
  },
  {
    label: 'Localização',
    fields: [columnNames.municipio, columnNames.un],
  },
  {
    label: 'Arquivos',
    fields: [columnNames.files],
  },
];

const statistics = {
  count: function useCount(filters = '') {
    const { data, loading } = useQuery(gql`
      ${queries.COUNT_NOTIFICACOES(filters)}
    `);
    if (loading) return 0;
    return data.notificacoes_aggregate ? data.notificacoes_aggregate.aggregate.count : 0;
  },
};

// TODO: PASS TO COMPONENTS FOLDER
const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.notificacoes.name}
        table={new Notificacoes()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  // {
  //   label: 'Licenças vigentes',
  //   filter: 'where: {validade: {_gt: "now()"}}',
  //   orderBy: 'order_by: {validade: asc}',
  //   component(refetch, onRefetch) {
  //     return (
  //       <MainTable
  //         tableName={tablesNames.processos.name}
  //         table={new Licencas()}
  //         filters={this.filter}
  //         orderBy={this.orderBy}
  //         doRefetch={refetch}
  //         onRefetch={onRefetch}
  //       />
  //     );
  //   },
  // },
];

export default class Notificacoes extends MainFeature {
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
