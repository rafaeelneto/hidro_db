import tablesNames from '../tablesNames';
import { RelationTable } from '../../Interfaces';

const tableQueries = new Map<string, { query: string; columnName: string }>();
tableQueries.set(tablesNames.cap_superf.name, {
  query: `cap_superf_rel_outorgas{
      id
      outorga_id
    }`,
  columnName: 'outorga_id',
});

tableQueries.set(tablesNames.outorgas.name, {
  query: `cap_superf_rel_outorgas{
      id
      superf_id
    }`,
  columnName: 'superf_id',
});

const tableQueries2 = new Map<string, { query: string; columnName: string }>();
tableQueries2.set(tablesNames.cap_superf.name, {
  query: `
  query ($feature_id: bigint!) {
    cap_superf_rel_outorgas(where: {superf_id: {_eq: $feature_id}}) {
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
    cap_superf_rel_outorgas(where: {outorga_id: {_eq: $feature_id}}) {
      id
      superf_id
    }
  }
  `,
  columnName: 'superf_id',
});

const insertMutation = {
  query: `
  mutation insert($objects: [cap_superf_rel_outorgas_insert_input!]!) {
    insert_cap_superf_rel_outorgas(objects: $objects){
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
    delete_cap_superf_rel_outorgas_by_pk(id: $id){
      id
    }
  }
  `,
  getMutationObj: (id: string | number) => ({ id }),
};

const capSuperfOutorgasRelation: RelationTable = {
  name: 'cap_superf_rel_outorgas',
  query: (table: string) => () => tableQueries.get(table)?.query || '',
  query2: (table: string) => () => tableQueries2.get(table)?.query || '',
  getColumnName: (table: string) => tableQueries2.get(table)?.columnName || '',
  insert: insertMutation,
  delete: deleteMutation,
};

export default capSuperfOutorgasRelation;
