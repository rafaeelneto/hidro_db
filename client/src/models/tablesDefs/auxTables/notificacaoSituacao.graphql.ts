export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    notif_situacao(where: {notif_id: {_eq: $feature_id}} order_by: {data_situacao: desc}, limit: 1){
      data_situacao
      situacao
    }
  }
  `,
  queryAll: `
  query ($feature_id: bigint!){
    notif_situacao(where: {notif_id: {_eq: $feature_id}} order_by: {data_situacao: desc}){
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
  mutation insertNotifSituacao($objects: [notif_situacao_insert_input!]!) {
    insert_notif_situacao(objects: $objects) {
      returning {
        id
      }
    }
  }
  `,
  update: `
  mutation updateNotiffSituacao($id: bigint!, $changes: notif_situacao_set_input!) {
    update_notif_situacao_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deleteNotifSituacao($id: bigint!) {
    delete_notif_situacao_by_pk(id: $id) {
      id
    }
  }
  `,
};
