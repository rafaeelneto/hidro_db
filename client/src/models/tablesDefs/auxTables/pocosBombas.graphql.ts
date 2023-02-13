export const queries = {
  queryOne: `
  query ($feature_id: bigint!){
    pocos_bombas(where: {poco_id: {_eq: $feature_id}} order_by: {data_instalacao: desc}, limit: 1){
      profund
      bomba_nova_nome
      data_instalacao
      tipo_tubo_edut
      diam_tubo_edut
    }
  }
  `,
  queryAll: `
  query ($feature_id: bigint!){
    pocos_bombas(where: {poco_id: {_eq: $feature_id}} order_by: {data_instalacao: desc},){
      id
      data_instalacao
      bomba_ant_nome
      bomba_nova_nome
      profund
      tipo_tubo_edut
      diam_tubo_edut
      obs
      files
    }
  }
  `,
};

export const mutations = {
  insert: `
  mutation insertPocoBomba($objects: [pocos_bombas_insert_input!]!) {
    insert_pocos_bombas(objects: $objects){
      returning{
        id
      }
    }
  }
  `,
  update: `
  mutation updatePocoBomba($id: bigint!, $changes: pocos_bombas_set_input!) {
    update_pocos_bombas_by_pk(pk_columns: {id: $id}, _set: $changes) {
      id
    }
  }
  `,
  delete: `
  mutation deletePocoBomba ($id: bigint!) {
    delete_pocos_bombas_by_pk(id: $id){
      id
    }
  }
  `,
};
