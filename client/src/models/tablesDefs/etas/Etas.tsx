import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './etas.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './etas.graphql';

import { gisFeature, fieldsOrderType, customTabType } from '../../Interfaces';
import { MainFeature } from '../../MainFeature';

import FeatureMap from '../../../components/maps/featureMap.component';
import MainTable from '../../../components/mainTable/mainTable.component';

import markerPocoSI from '../../../assets/markers/poco_marker_si.png';

// TODO: Pass to components folder
const previewComponent = {};

const fieldsOrganization: fieldsOrderType = [
  {
    label: 'Geral',
    fields: [
      columnNames.estacao,
      columnNames.cap_tratamento,
      columnNames.cap_tratamento_ms,
      columnNames.obs,
    ],
  },
  {
    label: 'Construtivo',
    fields: [columnNames.parte_int, columnNames.vol_util, columnNames.area_util],
  },
  {
    label: 'Localização',
    fields: [columnNames.geom, columnNames.sedes_setores, columnNames.un, columnNames.municipio],
  },
  {
    label: 'Arquivos',
    fields: [columnNames.files],
  },
];

const statistics = {
  count: function useCount(filter = '') {
    const { data, loading } = useQuery(gql`
      ${queries.COUNT(filter)}
    `);
    if (loading) return 0;
    return data.etas_aggregate ? data.etas_aggregate.aggregate.count : 0;
  },
};

const GIS_PROPERTIES = {
  type: 'Point',
  query: queries.GET_ALL_TO_MAPS(),
  getIconURL: (properties) => {
    // if (!properties.etas_situacao[0]) return markerPocoSI;

    // if (properties.etas_situacao[0].situacao === 'ativo') {
    //   return markerPocoAtivo;
    // }

    return markerPocoSI;
  },
  getInfo: (properties) => ({
    id: properties.id,
    main: properties.nome,
    secundary: '',
    terciary: '',
    link: tablesNames.etas.getLink(properties.id),
  }),
};

const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.etas.name}
        table={new ETAs()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  {
    label: 'Mapa',
    component: (refetch, onRefetch) => (
      <FeatureMap tableInfo={tablesNames.etas} getGIS={GIS_PROPERTIES} />
    ),
  },
];

export default class ETAs extends MainFeature implements gisFeature {
  geometryType = GIS_PROPERTIES.type;

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
