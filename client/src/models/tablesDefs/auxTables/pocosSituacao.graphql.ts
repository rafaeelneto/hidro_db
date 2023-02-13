export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    pocos_situacao(where: {poco_id: {_eq: $feature_id}} order_by: {date: desc}, limit: 1){
      date
      situacao
    }
  }
  `,
  queryAll: `
  query pocos_situacao ($feature_id: bigint!){
    pocos_situacao(where: {poco_id: {_eq: $feature_id}} order_by: {date: desc},){
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
  mutation insertPocoSituacao($objects: [pocos_situacao_insert_input!]!) {
    insert_pocos_situacao(objects: $objects){
      returning{
        id
      }
    }
  }
  `,
  update: `
  mutation updatePocoSituacao($id: bigint!, $changes: pocos_situacao_set_input!) {
    update_pocos_situacao_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deletePocoSituacao ($id: bigint!) {
    delete_pocos_situacao_by_pk(id: $id){
      id
    }
  }
  `,
};
