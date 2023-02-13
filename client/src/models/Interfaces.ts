import React from 'react';
/* eslint-disable no-unused-vars */

export type validateObjType = {
  valid: boolean;
  msg: string;
};

export interface Field {
  label: string;
  columnName: string;
  isMain: boolean;
  onTable: boolean;
  onlyTable: boolean;
  customOrder?(order: string): string;
  dontOrder?: boolean;
  defaultHiddenOnTable?: boolean;
  onlyDetails: boolean;
  validate?: (value: any) => validateObjType;
  query?(): string;
  mutation?(): string;
  independent?: boolean;
  notOnNew?: boolean;
  getValue?: Function;
  getValueToExport?: (row: any) => string;
  labelExport?: string;
  component: Function;
}

// TODO change the getGIS Type
export interface gisFeature extends mainFeature {
  geometryType: string;
  getGIS(): any;
}

export type fieldsOrderType = {
  label: string;
  grow?: boolean;
  fields: string[];
}[];

export type filesType = {
  id: string;
  link: string;
  nome: string;
  desc: string;
  data?: string;
}[];

export type condicionantesType = {
  id: string;
  condicionante: string;
  periodica: boolean;
  prazo: number;
  prazo_entrega: string;
  status: string;
  respondido?: boolean;
  diretoria_respon: string;
  obs?: string;
};

export type condicionantesListType = condicionantesType[];

export type fieldStateType = {
  name: string;
  label: string;
  labelExport?: string;
  present: boolean;
  isMain: boolean;
  customOrder?(order: string): string;
  dontOrder?: boolean;
}[];

export type Order = 'asc' | 'desc' | undefined;

export type customTabType = {
  label: string;
  filter?: string;
  order?: Order;
  orderBy?: string;
  // eslint-disable-next-line no-undef
  component: (refetch, onRefetch) => JSX.Element;
};

// TODO review queries, mutations and customTabs types
export interface mainFeature {
  previewComponent: React.Component;
  fields: Map<string, Field>;
  fieldsOrder: fieldsOrderType;
  defaultFieldsState: fieldStateType;
  statistics: any;
  queries: any;
  hasLastModif?: boolean;
  mutations: any;
  customTabs: customTabType[] | null;
  composeTableQuery(fieldsState: fieldStateType, filters?: string, orderBy?: string);
  composeTableSubscription(fieldsState: fieldStateType, filters?: string, orderBy?: string);
  composeItemQuery();
  getFieldsArray();
}

export type RelationTable = {
  name: string;
  query: (tableName: string) => () => string;
  query2: (tableName: string) => () => string;
  getColumnName: (tableName: string) => string;
  insert: {
    query: string;
    getMutationObj: (ids: any) => any;
  };
  delete: {
    query: string;
    getMutationObj: (id: string | number) => any;
  };
};

export type AuxFieldType = {
  name: string;
  label: string;
  main?: boolean;
  onAdd?: boolean;
  required?: boolean;
  getValue: (result: any) => any;
  component(value, onChange);
};

export type AuxTableQueryType = {
  query: () => string;
  getObject: (data: any) => any;
};

export type AuxTableMutationType = {
  query: string;
  getMutationObj: (id: any, fieldState: any) => any;
};

export type AuxTableType = {
  name: string;
  queryOne: AuxTableQueryType;
  queryAll: AuxTableQueryType;
  fields: AuxFieldType[];
  getResult: (data: any) => any;
  getDefaultState: () => any;
  insertQuery: AuxTableMutationType;
  deleteQuery: AuxTableMutationType;
  updateQuery: AuxTableMutationType;
};
