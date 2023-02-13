export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    cap_superf_situacao(where: {superf_id: {_eq: $feature_id}} order_by: {date: desc}, limit: 1){
      date
      situacao
    }
  }
  `,
  queryAll: `
  query cap_superf_situacao ($feature_id: bigint!){
    cap_superf_situacao(where: {superf_id: {_eq: $feature_id}} order_by: {date: desc},){
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
  mutation insertPocoSituacao($objects: [cap_superf_situacao_insert_input!]!) {
    insert_cap_superf_situacao(objects: $objects) {
      returning {
        id
      }
    }
  }
  `,
  update: `
  mutation updateCapSuperfSituacao($id: bigint!, $changes: cap_superf_situacao_set_input!) {
    update_cap_superf_situacao_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deletePocoSituacao($id: bigint!) {
    delete_cap_superf_situacao_by_pk(id: $id) {
      id
    }
  }
  `,
};
