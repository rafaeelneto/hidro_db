export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    processos_situacao(where: {reserv_id: {_eq: $feature_id}} order_by: {data_situacao: desc}, limit: 1){
      data_situacao
      situacao
    }
  }
  `,
  queryAll: `
  query ($feature_id: bigint!){
    processos_situacao(where: {reserv_id: {_eq: $feature_id}} order_by: {data_situacao: desc},){
      id
      created_at
      data_situacao
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
  mutation insertReservSituacao($objects: [processos_situacao_insert_input!]!) {
    insert_processos_situacao(objects: $objects) {
      returning {
        id
      }
    }
  }
  `,
  update: `
  mutation updateReservfSituacao($id: bigint!, $changes: processos_situacao_set_input!) {
    update_processos_situacao_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deleteReservSituacao($id: bigint!) {
    delete_processos_situacao_by_pk(id: $id) {
      id
    }
  }
  `,
};
