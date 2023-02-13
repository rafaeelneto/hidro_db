import tablesNames from '../tablesNames';
import { RelationTable } from '../../Interfaces';

const tableQueries = new Map<string, { query: string; columnName: string }>();
tableQueries.set(tablesNames.processos.name, {
  query: `processos_rel_notif{
      id
      notif_id
    }`,
  columnName: 'notif_id',
});

tableQueries.set(tablesNames.notificacoes.name, {
  query: `processos_rel_notif{
      id
      processo_id
    }`,
  columnName: 'processo_id',
});

const tableQueries2 = new Map<string, { query: string; columnName: string }>();
tableQueries2.set(tablesNames.processos.name, {
  query: `
  query ($feature_id: bigint!) {
    processos_rel_notif(where: {processo_id: {_eq: $feature_id}}) {
      id
      notif_id
    }
  }
  `,
  columnName: 'notif_id',
});

tableQueries2.set(tablesNames.notificacoes.name, {
  query: `
  query ($feature_id: bigint!) {
    processos_rel_notif(where: {notif_id: {_eq: $feature_id}}) {
      id
      processo_id
    }
  }
  `,
  columnName: 'processo_id',
});

const insertMutation = {
  query: `
  mutation insert ($objects: [processos_rel_notif_insert_input!]!) {
    insert_processos_rel_notif(objects: $objects){
      returning{
        id
      }
    }
  }
  `,
  getMutationObj: (ids: any) => ({ ...ids }),
};

const deleteMutation = {
  query: `
  mutation deleteSetorLicenciado ($id: bigint!) {
    delete_processos_rel_notif_by_pk(id: $id){
      id
    }
  }
  `,
  getMutationObj: (id: string | number) => ({ id }),
};

const processosNotificacoes: RelationTable = {
  name: 'processos_rel_notif',
  query: (table: string) => () => tableQueries.get(table)?.query || '',
  query2: (table: string) => () => tableQueries2.get(table)?.query || '',
  getColumnName: (table: string) => tableQueries2.get(table)?.columnName || '',
  insert: insertMutation,
  delete: deleteMutation,
};

export default processosNotificacoes;
