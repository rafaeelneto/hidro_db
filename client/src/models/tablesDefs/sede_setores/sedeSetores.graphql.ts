export const queries = {
  GET_ALL: (filters, orderBy = 'order_by: { id: desc}', fields) => `
    query GET_SETOR_SEDES ($limit: Int!, $offset: Int!){
        sedes_setores (${filters} ${orderBy} limit: $limit, offset: $offset){
          id
          ${fields}
        }
    }
    `,
  GET_BY_ID: (fields) => `
    query GET_SEDE_SETOR_BY_ID($id: bigint!) {
      sedes_setores_by_pk(id: $id) {
        ${fields}
      }
    }
  `,
  GET_ALL_TO_MAPS: () => `
      sedes_setores {
        id
        nome
        geom
      }
  `,
  GET_ALL_OPTIONS: () => `
  query GET_SEDES_SETORES_OPTIONS{
    sedes_setores{
      id
      nome
    }
  }
  `,
  COUNT: (filters = '') => `
    query {
      sedes_setores_aggregate ${filters ? `(${filters})` : ''} {
        aggregate {
          count
        }
      }
    }
  `,
  COLUMN: () => `
  sede_setores{
        id
        nome
    }
  `,
  COLUMN_VAZAO: () => 'vazao',
  COLUMN_POP_ATENDIDA: () => 'pop_atendida',
  COLUMN_VAZ_DEMANDA: () => 'vazao_demanda',
  COLUMN_NUM_LIG: () => 'num_lig',
  COLUMN_FLUXO_SISTEMA: () => 'sistema_flux',
  COLUMN_BAIRROS_ATEND: () => 'bairros_atend',
};

export const mutations = {
  COLUMN: () => 'setor_id',
  INSERT: () => `
  mutation insertSedeSetor($objects: [sedes_setores_insert_input!]!) {
    insert_sedes_setores(objects: $objects) {
      returning {
        id
      }
    }
  }
  `,
  UPDATE: () => `
  mutation updateSedeSetor ($id: bigint!, $changes: sedes_setores_set_input!) {
    update_sedes_setores_by_pk(
      pk_columns: {id: $id}
      _set: $changes
    ){
      id
    }
  }
  `,
  DELETE: () => `
  mutation deleteSedeSetores($id: bigint!) {
    delete_sedes_setores_by_pk(id: $id) {
      id
    }
  }
  `,
};
