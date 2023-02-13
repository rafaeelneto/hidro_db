import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './processos.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './processos.graphql';

import { fieldsOrderType, customTabType } from '../../Interfaces';
import { MainFeature } from '../../MainFeature';

import MainTable from '../../../components/mainTable/mainTable.component';

// TODO: Pass to components folder
const previewComponent = {};

const fieldsOrganization: fieldsOrderType = [
  {
    label: 'Geral',
    fields: [
      columnNames.situacao,
      columnNames.orgao,
      columnNames.tipo,
      columnNames.tipologia,
      columnNames.data_entrada,
      columnNames.obs,
    ],
  },
  {
    label: 'Objetos do processo',
    fields: [columnNames.descricao, columnNames.obj_processo],
  },
  {
    label: 'Documentos Derivados',
    fields: [
      columnNames.processos_rel_licen,
      columnNames.processos_rel_outor,
      columnNames.processos_rel_notif,
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
      ${queries.COUNT_PROCESSOS(filters)}
    `);
    if (loading) return 0;
    return data.processos_aggregate ? data.processos_aggregate.aggregate.count : 0;
  },
};

// TODO: PASS TO COMPONENTS FOLDER
const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.processos.name}
        table={new Processos()}
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

export default class Processos extends MainFeature {
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
