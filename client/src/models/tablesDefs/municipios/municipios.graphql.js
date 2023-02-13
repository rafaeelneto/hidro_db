export const queries = {
  GET_ALL: (filters, orderBy, fields) => `
    query GET_MUNICIPIOS ($limit: Int!, $offset: Int!){
        municipios (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_MUNICIPIO_BY_ID($id: bigint!) {
      municipios_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_MUNICIPIOS_OPTIONS{
    municipios{
      id
      nome
    }
}
  `,
  COLUMN: () => `
    municipio{
        id
        nome
    }
  `,
};

export const mutations = {
  COLUMN: () => 'municipio_id',
};
