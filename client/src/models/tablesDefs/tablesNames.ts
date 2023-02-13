export type TablesNames = {
  label: string;
  name: string;
  nameByPk: string;
  getLink?(id?: string);
};

const parentLinks = {
  agua: 'agua',
  licenciamento: 'licenciamento',
};

const tablesNames = {
  pocos: {
    label: 'Poços',
    name: 'pocos',
    nameByPk: 'pocos_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.agua}/${this.name}/${id}`;
    },
  },
  cap_superf: {
    label: 'Cap. Superficiais',
    name: 'cap_superf',
    nameByPk: 'cap_superf_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.agua}/${this.name}/${id}`;
    },
  },
  reservatorios: {
    label: 'Reservatórios',
    name: 'reservatorios',
    nameByPk: 'reservatorios_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.agua}/${this.name}/${id}`;
    },
  },
  etas: {
    label: 'ETAs',
    name: 'etas',
    nameByPk: 'etas_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.agua}/${this.name}/${id}`;
    },
  },
  processos: {
    label: 'Processos',
    name: 'processos',
    nameByPk: 'processos_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.licenciamento}/${this.name}/${id}`;
    },
  },
  notificacoes: {
    label: 'Notificações',
    name: 'notificacoes',
    nameByPk: 'notificacoes_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.licenciamento}/${this.name}/${id}`;
    },
  },
  municipios: {
    label: 'Municípios',
    name: 'municipios',
    nameByPk: 'municipios_by_pk',
  },
  un: {
    label: 'Unid. de Negócios',
    name: 'uns',
    nameByPk: 'uns_by_pk',
  },
  sedes_setores: {
    label: 'Setores/Sistemas',
    name: 'sedes_setores',
    nameByPk: 'sedes_setores_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.agua}/${this.name}/${id}`;
    },
  },
  outorgas: {
    label: 'Outorgas',
    name: 'outorgas',
    nameByPk: 'outorgas_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.licenciamento}/${this.name}/${id}`;
    },
  },
  licencas: {
    label: 'Licenças',
    name: 'licencas',
    nameByPk: 'licencas_by_pk',
    getLink(id?: string) {
      return `/${parentLinks.licenciamento}/${this.name}/${id}`;
    },
  },
};

export default tablesNames;
