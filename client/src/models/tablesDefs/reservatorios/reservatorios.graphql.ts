export const queries = {
  GET_ALL: (filters, orderBy = 'order_by: { id: desc}', fields) => `
    query GET_RESERVATORIOS ($limit: Int!, $offset: Int!){
        reservatorios (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_RESERVATORIO_BY_ID($id: bigint!) {
      reservatorios_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_TO_MAPS: () => `
      reservatorios {
        id
        nome
        geom
        reservatorios_situacao (order_by: {date: desc} limit: 1){
          situacao
        }
      }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_RESERVATORIOS_OPTIONS{
    reservatorios{
      id
      nome
    }
}
  `,
  COUNT: (filters = '') => `
    query {
      reservatorios_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_TIPO: () => 'tipo',
  COLUMN_VOL_UTIL: () => 'vol_util',
  COLUMN_AREA_UTIL: () => 'area_util',
};

export const mutations = {
  INSERT: () => `
  mutation insertReserv ($objects: [reservatorios_insert_input!]!) {
    insert_reservatorios(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updateReserv ($id: bigint!, $changes: reservatorios_set_input!) {
    update_reservatorios_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
    mutation deleteReserv ($id: bigint!) {
      delete_reservatorios_by_pk(id: $id){
        id
      }
    }`,
};

export const filters = {
  POCOS_INATIVOS: ``,
};
