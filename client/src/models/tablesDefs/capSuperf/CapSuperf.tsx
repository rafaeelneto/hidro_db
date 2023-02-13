import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './capSuperf.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './capSuperf.graphql';

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
    fields: [
      columnNames.data_implan,
      columnNames.corpo_hidrico,
      columnNames.bomba,
      columnNames.vaz_max,
      columnNames.obs,
    ],
  },
  {
    label: 'Situação',
    fields: [columnNames.cap_superf_situacao],
  },
  {
    label: 'Localização',
    fields: [columnNames.geom, columnNames.sedes_setores, columnNames.un, columnNames.municipio],
  },

  {
    label: 'Licenciamento',
    fields: [
      columnNames.licen_situ,
      columnNames.vaz_outorg,
      columnNames.horas_outorg,
      columnNames.cap_superf_rel_outorgas,
    ],
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
    return data.cap_superf_aggregate ? data.cap_superf_aggregate.aggregate.count : 0;
  },
};

const GIS_PROPERTIES = {
  type: 'Point',
  query: queries.GET_ALL_TO_MAPS(),
  getIconURL: (properties) => {
    if (!properties.cap_superf_situacao[0]) return markerPocoSI;

    if (properties.cap_superf_situacao[0].situacao === 'ativo') {
      return markerPocoAtivo;
    }
    return markerPocoInativo;
  },
  getInfo: (properties) => ({
    id: properties.id,
    main: properties.nome,
    secundary: properties.cap_superf_situacao[0] ? properties.cap_superf_situacao[0].situacao : '',
    terciary: '',
    link: `/agua/cap_superf/${properties.id}`,
  }),
};

const customTabs: customTabType[] = [
  {
    label: 'Geral',
    component: (refetch, onRefetch) => (
      <MainTable
        tableName={tablesNames.cap_superf.name}
        table={new CapSuperf()}
        doRefetch={refetch}
        onRefetch={onRefetch}
      />
    ),
  },
  {
    label: 'Mapa',
    component: (refetch, onRefetch) => (
      <FeatureMap tableInfo={tablesNames.cap_superf} getGIS={GIS_PROPERTIES} />
    ),
  },
];

export default class CapSuperf extends MainFeature implements gisFeature {
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
