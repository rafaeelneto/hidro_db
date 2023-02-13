const createUsersRoles = ['admin'];
const authRoles = ['admin', 'contributor', 'manager'];

const roles = [
  {
    id: 1,
    label: 'Administrador',
    name: 'admin',
  },
  {
    id: 2,
    label: 'Usuário',
    name: 'user',
  },
  {
    id: 3,
    label: 'Contribuidor',
    name: 'contributor',
  },
  {
    id: 4,
    label: 'Gerente',
    name: 'manager',
  },
];

const enumSituFeature = new Map<string, string>();
enumSituFeature.set('em_construcao', 'Em construção');
enumSituFeature.set('ativo', 'Ativo');
enumSituFeature.set('a_construir', 'A construir');
enumSituFeature.set('inativo', 'Inativo');
enumSituFeature.set('inativo_perm', 'Inativo permanentemente');
enumSituFeature.set('p_recuperacao', 'Para recuperação');
enumSituFeature.set('recuperacao', 'Em recuperação');

const enumLicenSitu = new Map<string, string>();
enumLicenSitu.set('sem_outorga', 'Sem outorga');
enumLicenSitu.set('outorgado', 'Outorgado');
enumLicenSitu.set('em_processo', 'Em processo');
enumLicenSitu.set('em_processo_renov', 'Em processo de renovação');

const enumFeaturesTypes = new Map<string, string>();
enumFeaturesTypes.set('pocos', 'Poços');
enumFeaturesTypes.set('sedes_setores', 'Sede Setores');
enumFeaturesTypes.set('eeas', 'EEAs');
enumFeaturesTypes.set('etas', 'ETAs');
enumFeaturesTypes.set('reservatorios', 'Reservatórios');
enumFeaturesTypes.set('cap_superf', 'Cap. Superficial');

const enumOcrrTypes = new Map<string, string>();
enumOcrrTypes.set('falta_ee', 'Falta Energia Elétrica');
enumOcrrTypes.set('pane_equip', 'Pane no Equipamento');
enumOcrrTypes.set('vaza_sistem', 'Vazamento no Sistema');
enumOcrrTypes.set('m_corret _equip', 'Manutenção Corretiva no Equipamento');
enumOcrrTypes.set('m_prevent_equip', 'Manutenção Preventiva no Equipamento');
enumOcrrTypes.set('m_corret_sist', 'Manutenção Corretiva no Sistema');
enumOcrrTypes.set('m_prevent_sist', 'Manutenção Preventiva no Sistema');

const enumStatusServ = new Map<string, string>();
enumStatusServ.set('agendado', 'Agendado');
enumStatusServ.set('em_andamento', 'Em andamento');
enumStatusServ.set('concluido', 'Concluído');
enumStatusServ.set('prorrogado', 'Prorrogado');
enumStatusServ.set('cancelado', 'Cancelado');

const enumLicenTipo = new Map<string, string>();
enumLicenTipo.set('outorga_previa', 'Outorga Prévia');
enumLicenTipo.set('outorga_direito', 'Outorga de Direito');
enumLicenTipo.set('disp_outorga', 'Dispensa de Outorga');
enumLicenTipo.set('li', 'Licença de Instalação');
enumLicenTipo.set('lo', 'Licença de Operação');
enumLicenTipo.set('lp', 'Licença Prévia');
enumLicenTipo.set('dl', 'Dispensa de Licença');

const enumProcessoTipo = new Map<string, string>();
enumProcessoTipo.set('outorga_previa', 'Outorga Prévia');
enumProcessoTipo.set('outorga_direito', 'Outorga de Direito');
enumProcessoTipo.set('disp_outorga', 'Dispensa de Outorga');
enumProcessoTipo.set('li', 'Licença de Instalação');
enumProcessoTipo.set('lo', 'Licença de Operação');
enumProcessoTipo.set('lp', 'Licença Prévia');
enumProcessoTipo.set('dl', 'Dispensa de Licença');
enumProcessoTipo.set('r_outorga_previa', 'Renovação de Outorga Prévia');
enumProcessoTipo.set('r_outorga_direito', 'Renovação de Outorga de Direito');
enumProcessoTipo.set('r_disp_outorga', 'Renovação de Dispensa de Outorga');
enumProcessoTipo.set('r_li', 'Renovação de Licença de Instalação');
enumProcessoTipo.set('r_lo', 'Renovação de Licença de Operação');
enumProcessoTipo.set('r_lp', 'Renovação de Licença Prévia');
enumProcessoTipo.set('r_dl', 'Renovação de Dispensa de Licença');

const enumProcessoSitu = new Map<string, string>();
enumProcessoSitu.set('com_notificacao', 'Com notificação');
enumProcessoSitu.set('com_notificacao_resp', 'Com notificação Respondida');
enumProcessoSitu.set('em_analise', 'Em análise');
enumProcessoSitu.set('deferido', 'Deferido');
enumProcessoSitu.set('indeferido', 'Indeferido');

const enumNotifSitu = new Map<string, string>();
enumNotifSitu.set('em_andamento', 'Em andamento');
enumNotifSitu.set('respondida', 'Respondida');
enumNotifSitu.set('nao_respondida', 'Não Respondida');

const enumCapTipo = new Map<string, string>();
enumCapTipo.set('superficial', 'Captação Superficial');
enumCapTipo.set('subterranea', 'Captação Subterrânea');
enumCapTipo.set('esg_sanitario', 'Esgotamento Sanitário');

const enumReservTipo = new Map<string, string>();
enumReservTipo.set('rel', 'Reserv. Elevado');
enumReservTipo.set('rap', 'Reserv. Apoiado');

export default {
  enum_licen_situ: enumLicenSitu,
  enum_features_types: enumFeaturesTypes,
  enum_situ_features: enumSituFeature,
  enum_ocrr_types: enumOcrrTypes,
  enum_status_serv: enumStatusServ,
  enum_licen_tipo: enumLicenTipo,
  enum_processo_tipo: enumProcessoTipo,
  enum_processo_situ: enumProcessoSitu,
  enum_notificacao_situ: enumNotifSitu,
  enum_cap_tipo: enumCapTipo,
  enum_reserv_tipo: enumReservTipo,
  authRoles,
  createUsersRoles,
  roles,
};
