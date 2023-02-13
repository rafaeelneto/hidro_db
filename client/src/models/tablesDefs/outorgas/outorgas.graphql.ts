export const queries = {
  GET_ALL: (filters = '', orderBy = 'order_by: { id: desc}', fields) => `
    query GET_OUTORGAS ($limit: Int!, $offset: Int!){
        outorgas (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_OUTORGA_BY_ID($id: bigint!) {
      outorgas_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_OUTORGAS_OPTIONS{
    outorgas{
      id
      num_outorga
    }
}
  `,
  COUNT_OUTORGAS: (filters = '') => `
    query {
      outorgas_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_NUM_OUTORGA: () => 'num_outorga',
  COLUMN_DATA_ENTRADA: () => 'data_entrada',
  COLUMN_VALIDADE: () => 'validade',
  COLUMN_OBJ_OUTORGA: () => 'obj_outor',
};

export const mutations = {
  INSERT: () => `
  mutation insert($objects: [outorgas_insert_input!]!) {
    insert_outorgas(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updateOutorgas ($id: bigint!, $changes: outorgas_set_input!) {
    update_outorgas_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
  mutation deleteOutorgas ($id: bigint!) {
    delete_outorgas_by_pk(id: $id){
      id
    }
  }`,
};
