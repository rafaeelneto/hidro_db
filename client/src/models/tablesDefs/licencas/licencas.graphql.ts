export const queries = {
  GET_ALL: (filters = '', orderBy = 'order_by: { id: desc}', fields) => `
    query GET_LICENCAS ($limit: Int!, $offset: Int!){
        licencas (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_LICENCA_BY_ID($id: bigint!) {
      licencas_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_LICENCAS_OPTIONS{
    licencas{
      id
      num_licen
    }
}
  `,
  COUNT_LICENCAS: (filters = '') => `
    query {
      licencas_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_NUM_LICEN: () => 'num_licen',
  COLUMN_DESC: () => 'desc',
};

export const mutations = {
  INSERT: () => `
  mutation insert($objects: [licencas_insert_input!]!) {
    insert_licencas(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updateOutorgas ($id: bigint!, $changes: licencas_set_input!) {
    update_licencas_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
  mutation deleteOutorgas ($id: bigint!) {
    delete_licencas_by_pk(id: $id){
      id
    }
  }`,
};
