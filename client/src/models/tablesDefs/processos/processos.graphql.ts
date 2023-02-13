export const queries = {
  GET_ALL: (filters = '', orderBy = 'order_by: { id: desc}', fields) => `
    query GET_PROCESSOS ($limit: Int!, $offset: Int!){
        processos (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_LICENCA_BY_ID($id: bigint!) {
      processos_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_PROCESSOS_OPTIONS{
    processos{
      id
      num_processo
    }
}
  `,
  COUNT_PROCESSOS: (filters = '') => `
    query {
      processos_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN_NUM_PROCESSO: () => 'num_processo',
  COLUMN_SITUACAO: () => 'situacao',
  COLUMN_OBJ_PROCESSO: () => 'obj_processo',
  COLUMN_DESCRICAO: () => 'descricao',
  COLUMN_TIPOLOGIA: () => 'tipologia',
  COLUMN_TIPO: () => 'tipo',
};

export const mutations = {
  INSERT: () => `
  mutation insert($objects: [processos_insert_input!]!) {
    insert_processos(objects: $objects){
      returning{
        id
      }
    }
  }
  
  `,
  UPDATE: () => `
  mutation updateProcessos ($id: bigint!, $changes: processos_set_input!) {
    update_processos_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
  mutation deleteOutorgas ($id: bigint!) {
    delete_processos_by_pk(id: $id){
      id
    }
  }`,
};
