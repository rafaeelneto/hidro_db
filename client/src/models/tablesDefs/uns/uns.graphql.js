export const queries = {
  GET_ALL: (filters, orderBy, fields) => `
    query GET_UNS ($limit: Int!, $offset: Int!){
        uns (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_UNS_BY_ID($id: bigint!) {
      uns_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_UNS_OPTIONS{
    uns{
      id
      nome
    }
}
  `,
  COLUMN: () => `
    un{
        id
        nome
    }
  `,
};

export const mutations = {
  COLUMN: () => 'un_id',
};
