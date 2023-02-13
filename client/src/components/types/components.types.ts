import { Field } from '../../models/Interfaces';

export type FieldComponentType = {
  field: Field;
  tableName: string;
  featureId: number | string;
  helperText?: string;
};

export type FilesComponentType = FieldComponentType & {
  query: string;
  mutation: string;
};

export type FilesAuxComponentType = {
  fieldName: string;
  nameByPk: string;
  featureId?: number | string;
  query: string;
  mutation: string;
};

export type AutoCompleteProps = FieldComponentType & {
  graphQlQuery: any;
};
export type AutoCompleteEnumProps = FieldComponentType & {
  enumOptions: Map<string, string>;
};
