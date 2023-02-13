export const queries = {
  GET_ALL: (filters, orderBy = 'order_by: { nome: desc}', fields) => `
    query GET_POCOS ($limit: Int!, $offset: Int!){
        pocos (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_POCO_BY_ID($id: bigint!) {
      pocos_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_TO_MAPS: () => `
      pocos {
        id
        nome
        geom
        pocos_situacao (order_by: {date: desc} limit: 1){
          situacao
        }
      }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_POCOS_OPTIONS{
    pocos{
      id
      nome
    }
}
  `,
  COUNT: (filters = '') => `
    query {
      pocos_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_PROFUNDIDADE: () => 'profun',
  COLUMN_DATA_PERF: () => 'data_perf',
  COLUMN_PONTEIRA: () => 'ponteira',
  COLUMN_PERFIL_GEOL_CONST: () => 'perfil_geol_const',
};

export const mutations = {
  INSERT: () => `
  mutation insert($objects: [pocos_insert_input!]!) {
    insert_pocos(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updatePocos ($id: bigint!, $changes: pocos_set_input!) {
    update_pocos_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
    mutation deletePocos ($id: bigint!) {
      delete_pocos_by_pk(id: $id){
        id
      }
    }`,
  COLUMN_PROFUNDIDADE: () => 'profun',
};

export const filters = {
  POCOS_INATIVOS: ``,
};
