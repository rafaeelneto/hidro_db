/* eslint-disable import/no-cycle */
import tablesNames from './tablesDefs/tablesNames';

import Pocos from './tablesDefs/pocos/Pocos';
import Outorgas from './tablesDefs/outorgas/Outorgas';
import Licencas from './tablesDefs/licencas/Licencas';
import Notificacoes from './tablesDefs/notificacoes/Notificacoes';
import Processos from './tablesDefs/processos/Processos';
import CapSuperf from './tablesDefs/capSuperf/CapSuperf';
import SedesSetores from './tablesDefs/sede_setores/SedeSetores';
import Reservatorios from './tablesDefs/reservatorios/Reservatorios';
import ETAs from './tablesDefs/etas/Etas';
import { mainFeature, gisFeature } from './Interfaces';

export type TablesBundler = {
  label: string;
  name: string;
  nameByPk: string;
  instance: mainFeature | gisFeature;
};

export default {
  pocos: {
    ...tablesNames.pocos,
    instance: new Pocos(),
  },
  reservatorios: {
    ...tablesNames.reservatorios,
    instance: new Reservatorios(),
  },
  etas: {
    ...tablesNames.etas,
    instance: new ETAs(),
  },
  cap_superf: {
    ...tablesNames.cap_superf,
    instance: new CapSuperf(),
  },
  municipios: {
    ...tablesNames.municipios,
  },
  un: {
    ...tablesNames.un,
  },
  sedes_setores: {
    ...tablesNames.sedes_setores,
    instance: new SedesSetores(),
  },
  outorgas: {
    ...tablesNames.outorgas,
    instance: new Outorgas(),
  },
  processos: {
    ...tablesNames.processos,
    instance: new Processos(),
  },
  licencas: {
    ...tablesNames.licencas,
    instance: new Licencas(),
  },
  notificacoes: {
    ...tablesNames.notificacoes,
    instance: new Notificacoes(),
  },
};
