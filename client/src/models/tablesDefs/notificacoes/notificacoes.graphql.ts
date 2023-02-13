export const queries = {
  GET_ALL: (filters = '', orderBy = 'order_by: { id: desc}', fields) => `
    query GET_NOTIFICACOES ($limit: Int!, $offset: Int!){
        notificacoes (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_NOTIFICACAO_BY_ID($id: bigint!) {
      notificacoes_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_NOTIFICACOES_OPTIONS{
    notificacoes{
      id
      num_notif
    }
}
  `,
  COUNT_NOTIFICACOES: (filters = '') => `
    query {
      notificacoes_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_NUM_NOTIF: () => 'num_notif',
  COLUMN_DATA_RECEB: () => 'data_receb',
  COLUMN_DATA_RESPOSTA: () => 'data_resposta',
  COLUMN_VIA_RECEB: () => 'via_receb',
  COLUMN_TIPO_NOTIF: () => 'tipo_notif',
  COLUMN_PRAZO: () => 'prazo',
  COLUMN_DATA_PRAZO: () => 'data_prazo',
};

export const mutations = {
  INSERT: () => `
  mutation insert($objects: [notificacoes_insert_input!]!) {
    insert_notificacoes(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updatenotificacoes ($id: bigint!, $changes: notificacoes_set_input!) {
    update_notificacoes_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
  mutation deleteNotificacoes ($id: bigint!) {
    delete_notificacoes_by_pk(id: $id){
      id
    }
  }`,
};
