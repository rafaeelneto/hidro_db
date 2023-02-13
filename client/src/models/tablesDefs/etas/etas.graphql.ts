export const queries = {
  GET_ALL: (filters, orderBy = 'order_by: { id: desc}', fields) => `
    query GET_ETAS ($limit: Int!, $offset: Int!){
        etas (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_ETA_BY_ID($id: bigint!) {
      etas_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_TO_MAPS: () => `
      etas {
        id
        nome
        geom
      }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_ETAS_OPTIONS{
    etas{
      id
      nome
    }
}
  `,
  COUNT: (filters = '') => `
    query {
      etas_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_CAP_TRATAM: () => 'cap_tratamento',
  COLUMN_CAP_TRATAM_MS: () => 'cap_tratamento_ms',
  COLUMN_ESTACAO: () => 'estacao',
  COLUMN_PARTE_INT: () => 'parte_int',
};

export const mutations = {
  INSERT: () => `
  mutation insertReserv ($objects: [etas_insert_input!]!) {
    insert_etas(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updateReserv ($id: bigint!, $changes: etas_set_input!) {
    update_etas_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
    mutation deleteReserv ($id: bigint!) {
      delete_etas_by_pk(id: $id){
        id
      }
    }`,
};

export const filters = {
  POCOS_INATIVOS: ``,
};
