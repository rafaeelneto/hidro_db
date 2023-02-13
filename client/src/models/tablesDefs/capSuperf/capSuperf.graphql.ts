export const queries = {
  GET_ALL: (filters, orderBy = 'order_by: { id: desc}', fields) => `
    query GET_CAP_SUPERF ($limit: Int!, $offset: Int!){
      cap_superf (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GETCAP_SUPERF_BY_ID($id: bigint!) {
      cap_superf_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_TO_MAPS: () => `
      cap_superf {
        id
        nome
        geom
        cap_superf_situacao (order_by: {date: desc} limit: 1){
          situacao
        }
      }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_CAP_SUPERF_OPTIONS{
    cap_superf{
      id
      nome
    }
}
  `,
  COUNT: (filters = '') => `
    query {
      cap_superf_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
};

export const mutations = {
  INSERT: () => `
  mutation insertCapSuperf($objects: [cap_superf_insert_input!]!) {
    insert_cap_superf(objects: $objects) {
      returning {
        id
      }
    }
  }
  `,
  UPDATE: () => `
  mutation updateCapSuperf($id: bigint!, $changes: cap_superf_set_input!) {
    update_cap_superf_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  DELETE: () => `
  mutation deleteCapSuperf($id: bigint!) {
    delete_cap_superf_by_pk(id: $id) {
      id
    }
  }
  `,
  COLUMN_PROFUNDIDADE: () => 'profun',
};

export const filters = {
  POCOS_INATIVOS: ``,
};
