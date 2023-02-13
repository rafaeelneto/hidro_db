import tablesNames from '../tablesNames';
import { RelationTable } from '../../Interfaces';

const tableQueries = new Map<string, { query: string; columnName: string }>();
tableQueries.set(tablesNames.pocos.name, {
  query: `rel_pocos_outorgas{
      id
      outorga_id
    }`,
  columnName: 'outorga_id',
});

tableQueries.set(tablesNames.outorgas.name, {
  query: `rel_pocos_outorgas{
      id
      poco_id
    }`,
  columnName: 'poco_id',
});

const tableQueries2 = new Map<string, { query: string; columnName: string }>();
tableQueries2.set(tablesNames.pocos.name, {
  query: `
  query ($feature_id: bigint!) {
    rel_pocos_outorgas(where: {poco_id: {_eq: $feature_id}}) {
      id
      outorga_id
    }
  }
  `,
  columnName: 'outorga_id',
});

tableQueries2.set(tablesNames.outorgas.name, {
  query: `
  query ($feature_id: bigint!) {
    rel_pocos_outorgas(where: {outorga_id: {_eq: $feature_id}}) {
      id
      poco_id
    }
  }
  `,
  columnName: 'poco_id',
});

const insertMutation = {
  query: `
  mutation insert($objects: [rel_pocos_outorgas_insert_input!]!) {
    insert_rel_pocos_outorgas(objects: $objects){
      returning{
        id
      }
    }
  }
  `,
  getMutationObj: (ids: any) => ({ ...ids }),
};

const deleteMutation = {
  query: `
  mutation deletePocos ($id: bigint!) {
    delete_rel_pocos_outorgas_by_pk(id: $id){
      id
    }
  }
  `,
  getMutationObj: (id: string | number) => ({ id }),
};

const pocosOutorgasRelation: RelationTable = {
  name: 'rel_pocos_outorgas',
  query: (table: string) => () => tableQueries.get(table)?.query || '',
  query2: (table: string) => () => tableQueries2.get(table)?.query || '',
  getColumnName: (table: string) => tableQueries2.get(table)?.columnName || '',
  insert: insertMutation,
  delete: deleteMutation,
};

export default pocosOutorgasRelation;
