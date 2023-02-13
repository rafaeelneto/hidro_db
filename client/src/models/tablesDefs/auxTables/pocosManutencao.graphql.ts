export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    pocos_manutencao(where: {poco_id: {_eq: $feature_id}} order_by: {created_at: desc}, limit: 1){
      ocrr
      status
      created_at
    }
  }
  `,
  queryAll: `
  query pocos_manutencao ($feature_id: bigint!){
    pocos_manutencao(where: {poco_id: {_eq: $feature_id}} order_by: {created_at: desc},){
      id
      created_at
      data_conclusao
      data_previsao
      descr
      ocrr
      obs
      executor
      descr
      status
      eq_exec
    }
  }
  `,
};

export const mutations = {
  insert: `
  mutation insertPocoManutencao($objects: [pocos_manutencao_insert_input!]!) {
    insert_pocos_manutencao(objects: $objects){
      returning{
        id
      }
    }
  }
  `,
  update: `
  mutation updatePocoManutencao($id: bigint!, $changes: pocos_manutencao_set_input!) {
    update_pocos_manutencao_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deletePocoManutencao ($id: bigint!) {
    delete_pocos_manutencao_by_pk(id: $id){
      id
    }
  }
  `,
};
