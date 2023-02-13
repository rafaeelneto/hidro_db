import { Component } from 'react';
import { gql } from '@apollo/client';
import { mainFeature, Field, fieldsOrderType, fieldStateType, customTabType } from './Interfaces';

export class MainFeature implements mainFeature {
  previewComponent: Component;

  fields: Map<string, Field>;

  fieldsOrder: fieldsOrderType;

  defaultFieldsState: fieldStateType;

  statistics: any;

  queries: any;

  mutations: any;

  hasLastModif: boolean;

  customTabs: customTabType[] | null;

  constructor(
    hasLastModif = false,
    previewComponent: any,
    fields: Map<string, any>,
    fldsOrder: fieldsOrderType,
    statistics: any,
    queries: any,
    mutations: any,
    customTabs: customTabType[] | null,
  ) {
    this.previewComponent = previewComponent;
    this.fields = fields;
    this.fieldsOrder = fldsOrder;
    this.defaultFieldsState = this.getFieldsStateObj();
    this.statistics = statistics;
    this.queries = queries;
    this.mutations = mutations;
    this.hasLastModif = hasLastModif;
    this.customTabs = customTabs;
  }

  composeTableSubscription(fieldsState: fieldStateType, filters = '', orderBy = '') {
    let fieldsQueries = '';
    fieldsState.forEach((field) => {
      if (field.present && this.fields.get(field.name)) {
        const fieldTmp = this.fields.get(field.name);
        fieldsQueries = `
          ${fieldsQueries}
          ${fieldTmp?.query ? fieldTmp.query() : ''}
        `;
      }
    });
    const query = this.queries
      .GET_ALL(filters, orderBy, fieldsQueries)
      .replace('query', 'subscription');
    return gql`
      ${query}
    `;
  }

  composeTableQuery(fieldsState: fieldStateType, filters = '', orderBy = '') {
    let fieldsQueries = '';
    fieldsState.forEach((field) => {
      if (field.present && this.fields.get(field.name)) {
        const fieldTmp = this.fields.get(field.name);
        fieldsQueries = `
          ${fieldsQueries}
          ${fieldTmp?.query ? fieldTmp.query() : ''}
        `;
      }
    });
    const query = this.queries.GET_ALL(filters, orderBy, fieldsQueries);
    return gql`
      ${query}
    `;
  }

  composeItemQuery() {
    const fieldsArray = Array.from(this.fields.values()).filter((field) => !field.onlyTable);
    let fieldsQueries = '';
    fieldsArray.forEach((field) => {
      if (!field.onlyTable && !field.independent) {
        fieldsQueries = `
          ${fieldsQueries}
          ${field.query ? field.query() : ''}
        `;
      }
    });
    const query = this.queries.GET_BY_ID(fieldsQueries);
    return gql`
      ${query}
    `;
  }

  getFieldsStateObj(): fieldStateType {
    const fieldState: {
      name: string;
      label: string;
      present: boolean;
      isMain: boolean;
      customOrder?(order: string): string;
      dontOrder?: boolean;
    }[] = [];
    Array.from(this.fields.values())
      .filter((field) => (field.onTable || field.onlyTable) && !field.onlyDetails)
      .forEach((field) => {
        const fieldObj = {
          name: field.columnName,
          label: field.label,
          present: field.onTable && !field.defaultHiddenOnTable,
          isMain: field.isMain,
        };

        if (field.labelExport) {
          fieldObj['labelExport'] = field.labelExport;
        }

        if (field.customOrder) {
          fieldObj['customOrder'] = field.customOrder;
        }

        if (field.dontOrder) {
          fieldObj['dontOrder'] = field.dontOrder;
        }

        if (field.isMain) fieldState.unshift(fieldObj);
        else fieldState.push(fieldObj);
      });

    return fieldState;
  }

  getFieldsArray(): Field[] {
    return Array.from(this.fields.values()).filter((field) => {
      if (field.onlyTable) return false;
      if (field.independent) return false;

      return true;
    });
  }
}

export default MainFeature;
