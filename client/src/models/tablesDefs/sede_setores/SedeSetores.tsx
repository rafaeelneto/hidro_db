import React from 'react';
/* eslint-disable import/no-cycle */
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './sedeSetores.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './sedeSetores.graphql';

import { gisFeature, fieldsOrderType, customTabType } from '../../Interfaces';
import { MainFeature } from '../../MainFeature';

import FeatureMap from '../../../components/maps/featureMap.component';
import MainTable from '../../../components/mainTable/mainTable.component';

import markerSetor from '../../../assets/markers/setor_marker_ativo.png';

// TODO: Pass to components folder
const previewComponent = {};

const fieldsOrganization: fieldsOrderType = [
  {
    label: 'Geral',
    fields: [
      columnNames.geom,
      columnNames.endereco,
      columnNames.un,
      columnNames.municipio,
      columnNames.files,
    ],
  },
  {
    label: 'Atendimento',
    fields: [
      columnNames.bairros_atend,
      columnNames.num_ligacoes,
      columnNames.pop_atendida,
      columnNames.vaz_demanda,
    ],
  },
  {
    label: 'Licenciamento',
    fields: [columnNames.sedes_setores_rel_licen],
  },
];

const statistics = {
  count: function useCount(filter = '') {
    const { data, loading } = useQuery(gql`
      ${queries.COUNT(filter)}
    `);
    if (loading) return loading;
    return data.sedes_setores_aggregate ? data.sedes_setores_aggregate.aggregate.count : 0;
  },
};

const GIS_PROPERTIES = {
  type: 'Point',
  query: queries.GET_ALL_TO_MAPS(),
  getIconURL: (properties) => markerSetor,
  getInfo: (properties) => ({
    id: properties.id,
    main: properties.nome,
    secundary: '',
    // secundary: properties.pocos_situacao[0] ? properties.pocos_situacao[0].situacao : '',
    terciary: '',
    link: `/agua/sedes_setores/${properties.id}`,
  }),
};

const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.sedes_setores.name}
        table={new SedeSetores()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  {
    label: 'Mapa',
    component: (refetch, onRefetch) => (
      <FeatureMap tableInfo={tablesNames.sedes_setores} getGIS={GIS_PROPERTIES} />
    ),
  },
];

export default class SedeSetores extends MainFeature implements gisFeature {
  geometryType = 'Point';

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

  // eslint-disable-next-line class-methods-use-this
  getGIS() {
    return GIS_PROPERTIES;
  }
}
