export const queries = {
  GET_ALL: (filters, orderBy, fields) => `
    query GET_ORGAOS ($limit: Int!, $offset: Int!){
      orgaos (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_ORGAOS_BY_ID($id: bigint!) {
      orgaos_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_UNS_OPTIONS{
    orgaos{
      id
      nome
    }
}
  `,
  COLUMN: () => `
    orgao{
        id
        nome
    }
  `,
};

export const mutations = {
  COLUMN: () => 'orgao_id',
};
