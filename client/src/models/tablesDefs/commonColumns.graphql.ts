export const queries = {
  COLUMN_ID: () => 'id',
  COLUMN_NOME: () => 'nome',
  COLUMN_SITUACAO: () => 'situacao',
  COLUMN_LICEN_SITU: () => 'licen_situ',
  COLUMN_VAZAO_MAX: () => 'vaz_max',
  COLUMN_VAZAO_OUTORGA: () => 'vaz_outorg',
  COLUMN_HORAS_OUTORGA: () => 'horas_outorg',
  COLUMN_OBS: () => 'obs',
  COLUMN_NUM_PATRIMONIO: () => 'num_patrimonio',
  COLUMN_DATA_ENTREGA: () => 'data_entrega',
  COLUMN_USR_MODIF: () => `
    users{
        id
        nome
    }
  `,

  COLUMN_LAST_MODIF: () => 'last_modif',
  COLUMN_DATA_IMPLACAO: () => 'data_implan',
  COLUMN_BOMBA: () => 'bomba',
  COLUMN_CORPO_HIDRICO: () => 'corpo_hidrico',

  COLUMN_FILES_JSON: () => 'files',
  COLUMN_GEOM: () => 'geom',
  COLUMN_ENDERECO: () => 'ender',

  COLUMN_CONDICIONANTES: () => 'condic',
  COLUMN_DATA_ENTRADA: () => 'data_entrada',
  COLUMN_VALIDADE: () => 'validade',
  COLUMN_TIPO: () => 'tipo',
  COLUMN_TIPO_CAP: () => 'tipo_captacao',
  COLUMN_RESPONSAVEL: () => 'responsavel',
  COLUMN_CNPJ_RESPONSAVEL: () => 'cnpj_resp',

  COLUMN_NUM_LICEN: () => 'num_licen',
  COLUMN_ATIVIDADE: () => 'atividade',
  COLUMN_DATA_EMISSAO: () => 'data_emissao',
  COLUMN_PRAZO: () => 'prazo',
};

export const mutations = {
  COLUMN_NOME: () => 'nome',
  COLUMN_FILES_JSON: () => 'files',
  COLUMN_GEOM: () => 'geom',
};
