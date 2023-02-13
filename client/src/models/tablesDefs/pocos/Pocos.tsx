import React from 'react';
import { useQuery, gql } from '@apollo/client';

import tablesNames from '../tablesNames';
import fields from './pocos.fields';
import columnNames from '../../columnsNames';
import { queries, mutations } from './pocos.graphql';

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
    fields: [columnNames.ponteira, columnNames.num_patrimonio, columnNames.obs],
  },
  {
    label: 'Situação',
    fields: [columnNames.pocos_situacao],
  },
  {
    label: 'Localização',
    fields: [columnNames.geom, columnNames.sedes_setores, columnNames.un, columnNames.municipio],
  },
  {
    label: 'Construtivo',
    fields: [
      columnNames.data_perf,
      columnNames.data_entrega,
      columnNames.profundidade,
      columnNames.vaz_max,
    ],
  },
  {
    label: 'Perfil',
    grow: true,
    fields: [columnNames.perfil_geol_const],
  },
  {
    label: 'Testes de Bombeamento',
    fields: [columnNames.pocos_testes_bomb],
  },
  {
    label: 'Licenciamento',
    fields: [
      columnNames.licen_situ,
      columnNames.vaz_outorg,
      columnNames.horas_outorg,
      columnNames.rel_pocos_outorgados,
    ],
  },
  {
    label: 'Arquivos',
    fields: [columnNames.files],
  },
  {
    label: 'Manutenção',
    fields: [columnNames.pocos_manutencao],
  },
  {
    label: 'Bombas',
    fields: [columnNames.pocos_bombas],
  },
];

const statistics = {
  count: function useCount(filter = '') {
    const { data, loading } = useQuery(gql`
      ${queries.COUNT(filter)}
    `);
    if (loading) return 0;
    return data.pocos_aggregate ? data.pocos_aggregate.aggregate.count : 0;
  },
};

const GIS_PROPERTIES = {
  type: 'Point',
  query: queries.GET_ALL_TO_MAPS(),
  getIconURL: (properties) => {
    if (!properties.pocos_situacao[0]) return markerPocoSI;

    if (properties.pocos_situacao[0].situacao === 'ativo') {
      return markerPocoAtivo;
    }
    return markerPocoInativo;
  },
  getInfo: (properties) => ({
    id: properties.id,
    main: properties.nome,
    secundary: properties.pocos_situacao[0] ? properties.pocos_situacao[0].situacao : '',
    terciary: '',
    link: `/agua/pocos/${properties.id}`,
  }),
};

const customTabs: customTabType[] = [
  {
    label: 'Geral',
    orderBy: 'nome',
    order: 'asc',
    component(refetch, onRefetch) {
      return (
        <MainTable
          tableName={tablesNames.pocos.name}
          table={new Pocos()}
          orderBy={this.orderBy}
          doRefetch={refetch}
          onRefetch={onRefetch}
        />
      );
    },
  },
  {
    label: 'Mapa',
    component: (refetch, onRefetch) => (
      <FeatureMap
        tableInfo={tablesNames.pocos}
        doRefetch={refetch}
        onRefetch={onRefetch}
        getGIS={GIS_PROPERTIES}
      />
    ),
  },
  {
    label: 'Poços Profundos',
    filter: 'where: {profun: {_gte: 50}}',
    orderBy: 'nome',
    order: 'desc',
    component(refetch, onRefetch) {
      return (
        <MainTable
          tableName={tablesNames.pocos.name}
          table={new Pocos()}
          filters={this.filter}
          orderBy={this.orderBy}
          doRefetch={refetch}
          onRefetch={onRefetch}
        />
      );
    },
  },
];

export default class Pocos extends MainFeature implements gisFeature {
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
