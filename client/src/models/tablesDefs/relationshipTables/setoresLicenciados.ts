import tablesNames from '../tablesNames';
import { RelationTable } from '../../Interfaces';

const tableQueries = new Map<string, { query: string; columnName: string }>();
tableQueries.set(tablesNames.sedes_setores.name, {
  query: `sedes_setores_rel_licen{
      id
      licen_id
    }`,
  columnName: 'licen_id',
});

tableQueries.set(tablesNames.licencas.name, {
  query: `sedes_setores_rel_licen{
      id
      setor_id
    }`,
  columnName: 'setor_id',
});

const tableQueries2 = new Map<string, { query: string; columnName: string }>();
tableQueries2.set(tablesNames.sedes_setores.name, {
  query: `
  query ($feature_id: bigint!) {
    sedes_setores_rel_licen(where: {setor_id: {_eq: $feature_id}}) {
      id
      licen_id
    }
  }
  `,
  columnName: 'licen_id',
});

tableQueries2.set(tablesNames.licencas.name, {
  query: `
  query ($feature_id: bigint!) {
    sedes_setores_rel_licen(where: {licen_id: {_eq: $feature_id}}) {
      id
      setor_id
    }
  }
  `,
  columnName: 'setor_id',
});

const insertMutation = {
  query: `
  mutation insert ($objects: [sedes_setores_rel_licen_insert_input!]!) {
    insert_sedes_setores_rel_licen(objects: $objects){
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
  mutation deleteSetorLicenciado ($id: bigint!) {
    delete_sedes_setores_rel_licen_by_pk(id: $id){
      id
    }
  }
  `,
  getMutationObj: (id: string | number) => ({ id }),
};

const setoresLicenciados: RelationTable = {
  name: 'sedes_setores_rel_licen',
  query: (table: string) => () => tableQueries.get(table)?.query || '',
  query2: (table: string) => () => tableQueries2.get(table)?.query || '',
  getColumnName: (table: string) => tableQueries2.get(table)?.columnName || '',
  insert: insertMutation,
  delete: deleteMutation,
};

export default setoresLicenciados;
