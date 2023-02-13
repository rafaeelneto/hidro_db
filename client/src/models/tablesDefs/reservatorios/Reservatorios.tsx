import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './reservatorios.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './reservatorios.graphql';

import { gisFeature, fieldsOrderType, customTabType } from '../../Interfaces';
import { MainFeature } from '../../MainFeature';

import FeatureMap from '../../../components/maps/featureMap.component';
import MainTable from '../../../components/mainTable/mainTable.component';

import markerPocoAtivo from '../../../assets/markers/poco_marker_ativo.png';
import markerPocoInativo from '../../../assets/markers/poco_marker_inativo.png';
import markerPocoSI from '../../../assets/markers/poco_marker_si.png';

// TODO: Pass to components folder
const previewComponent = {};

const fieldsOrganization: fieldsOrderType = [
  {
    label: 'Geral',
    fields: [columnNames.num_patrimonio, columnNames.obs],
  },
  {
    label: 'Construtivo',
    fields: [columnNames.tipo, columnNames.vol_util, columnNames.area_util],
  },
  {
    label: 'Localização',
    fields: [columnNames.geom, columnNames.sedes_setores, columnNames.un, columnNames.municipio],
  },
  {
    label: 'Situação',
    fields: [columnNames.reservatorios_situacao],
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
    return data.reservatorios_aggregate ? data.reservatorios_aggregate.aggregate.count : 0;
  },
};

const GIS_PROPERTIES = {
  type: 'Point',
  query: queries.GET_ALL_TO_MAPS(),
  getIconURL: (properties) => {
    if (!properties.reservatorios_situacao[0]) return markerPocoSI;

    if (properties.reservatorios_situacao[0].situacao === 'ativo') {
      return markerPocoAtivo;
    }
    return markerPocoInativo;
  },
  getInfo: (properties) => ({
    id: properties.id,
    main: properties.nome,
    secundary: properties.reservatorios_situacao[0]
      ? properties.reservatorios_situacao[0].situacao
      : '',
    terciary: '',
    link: tablesNames.reservatorios.getLink(properties.id),
  }),
};

const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.reservatorios.name}
        table={new Reservatorios()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  {
    label: 'Mapa',
    component: (refetch, onRefetch) => (
      <FeatureMap tableInfo={tablesNames.reservatorios} getGIS={GIS_PROPERTIES} />
    ),
  },
];

export default class Reservatorios extends MainFeature implements gisFeature {
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
