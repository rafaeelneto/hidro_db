import { AuxTableType, AuxFieldType, AuxTableQueryType, AuxTableMutationType } from './Interfaces';

export default class AuxTable implements AuxTableType {
  name: string;

  queryOne: AuxTableQueryType;

  queryAll: AuxTableQueryType;

  fields: AuxFieldType[];

  insertQuery: AuxTableMutationType;

  deleteQuery: AuxTableMutationType;

  updateQuery: AuxTableMutationType;

  constructor(
    name: string,
    queryOne: AuxTableQueryType,
    queryAll: AuxTableQueryType,
    fields: AuxFieldType[],
    insertQuery: AuxTableMutationType,
    deleteQuery: AuxTableMutationType,
    updateQuery: AuxTableMutationType,
  ) {
    this.name = name;
    this.queryOne = queryOne;
    this.queryAll = queryAll;
    this.fields = fields;
    this.insertQuery = insertQuery;
    this.deleteQuery = deleteQuery;
    this.updateQuery = updateQuery;
  }

  getResult(data) {
    const mainField = this.fields.filter((field) => field.main)[0].getValue(data).label;
    const secundary: string[] = [];
    this.fields.forEach((field) => {
      if (field.main) return;
      secundary.push(`${field.label}: ${field.getValue(data).label}`);
    });
    return {
      id: data.id,
      main: mainField,
      secundary,
    };
  }

  getDefaultState() {
    const defaultState = {};
    this.fields
      .filter((field) => field.onAdd)
      .forEach((field) => {
        defaultState[field.name] = field.getValue(null);
      });
    return defaultState;
  }
}
