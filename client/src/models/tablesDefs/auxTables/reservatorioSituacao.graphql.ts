export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    reservatorios_situacao(where: {reserv_id: {_eq: $feature_id}} order_by: {date: desc}, limit: 1){
      date
      situacao
    }
  }
  `,
  queryAll: `
  query reservatoriosSituacao ($feature_id: bigint!){
    reservatorios_situacao(where: {reserv_id: {_eq: $feature_id}} order_by: {date: desc},){
      id
      created_at
      date
      situacao
      last_modif
      usr_modif
      obs
    }
  }
  `,
};

export const mutations = {
  insert: `
  mutation insertReservSituacao($objects: [reservatorios_situacao_insert_input!]!) {
    insert_reservatorios_situacao(objects: $objects) {
      returning {
        id
      }
    }
  }
  `,
  update: `
  mutation updateReservfSituacao($id: bigint!, $changes: reservatorios_situacao_set_input!) {
    update_reservatorios_situacao_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deleteReservSituacao($id: bigint!) {
    delete_reservatorios_situacao_by_pk(id: $id) {
      id
    }
  }
  `,
};
