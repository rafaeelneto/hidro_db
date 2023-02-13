import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

import { useHistoryState } from '../utils/dataState.manager';

import { mainFeature, gisFeature } from '../models/Interfaces';

import Observable from '../utils/Observable';

import { isLoadingVar, isSucessVar, sucessMsgVar } from '../graphql/cache';
import columnsNames from '../models/columnsNames';

const mutation = new Observable();

const DEFAULT_MUTATION_STATE = {
  insert: false,
  update: false,
  delete: false,
  featureId: '',
};

// eslint-disable-next-line import/prefer-default-export
export const useMutationItem = (tableName, table: mainFeature | gisFeature) => {
  const {
    getHistoryLastItem,
    getHistoryLastKey,
    setHistoryOriginal,
    resetHistory,
  } = useHistoryState();
  const fieldsArray = Array.from(table.fields.values()).filter((field) => !field.onlyTable);

  const [mutationsState, setMutationsState] = useState(DEFAULT_MUTATION_STATE);

  const INSERT_MUTATION = gql`
    ${table.mutations.INSERT()}
  `;

  const [
    insertItem,
    { data: insertData, loading: insertLoading, error: insertError },
  ] = useMutation(INSERT_MUTATION);

  const UPDATE_MUTATION = gql`
    ${table.mutations.UPDATE()}
  `;

  const [
    updateItem,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_MUTATION);

  const DELETE_MUTATION = gql`
    ${table.mutations.DELETE()}
  `;

  const [
    deleteItem,
    { data: deleteData, loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_MUTATION);

  if (
    (mutationsState.insert && !insertLoading) ||
    (mutationsState.update && !updateLoading) ||
    (mutationsState.delete && !deleteLoading)
  ) {
    setMutationsState(DEFAULT_MUTATION_STATE);

    if (mutationsState.featureId) {
      setHistoryOriginal(
        tableName,
        mutationsState.featureId,
        getHistoryLastItem(tableName, mutationsState.featureId),
      );
      resetHistory(tableName, mutationsState.featureId, true);
    }

    if (insertError) throw insertError;
    if (updateError) throw updateError;
    if (deleteError) throw deleteError;

    mutation.notify({});

    isLoadingVar(false);
    isSucessVar(true);
  }

  const onInsert = (position: { lat: number; lng: number } | null): boolean => {
    const newValues = {};
    if (getHistoryLastKey(tableName, 'new') < 1) return false;
    const lastItemHistory = getHistoryLastItem(tableName, 'new');

    if (position) {
      // eslint-disable-next-line dot-notation
      newValues['geom'] = {
        type: (table as gisFeature).geometryType,
        coordinates: [position.lng, position.lat],
        crs: {
          type: 'name',
          properties: {
            name: 'epsg:4326',
          },
        },
      };
    }

    let invalidField = false;

    fieldsArray.forEach((field) => {
      const columnValue = lastItemHistory[field.columnName];
      if (!columnValue) return;
      if (field.validate && !field.validate(columnValue.value).valid) {
        invalidField = true;
        return;
      }
      newValues[field.mutation ? field.mutation() : ''] =
        field.columnName === columnsNames.files ? columnValue : columnValue.value;
    });

    if (table.hasLastModif) {
      newValues['last_modif'] = new Date().toISOString();
    }

    if (invalidField) return false;

    insertItem({
      variables: {
        objects: [newValues],
      },
    });

    isLoadingVar(true);

    setMutationsState({ ...mutationsState, insert: true, featureId: 'new' });

    return true;
  };

  const onUpdate = (featuresId: number[]): boolean => {
    let invalidField = false;
    featuresId.forEach((featureId) => {
      const changes = {};

      if (getHistoryLastKey(tableName, featureId) < 1) return;

      const lastItemHistory = getHistoryLastItem(tableName, featureId);

      fieldsArray.forEach((field) => {
        const newValue = lastItemHistory[field.columnName];
        if (!newValue) return;
        if (field.validate && !field.validate(newValue.value).valid) {
          invalidField = true;
          return;
        }

        changes[field.mutation ? field.mutation() : ''] =
          field.columnName === columnsNames.files ? newValue : newValue.value;
      });

      if (table.hasLastModif) {
        changes['last_modif'] = new Date().toISOString();
      }

      if (invalidField) return;

      console.log(changes);

      updateItem({ variables: { id: featureId, changes } });
      setMutationsState({
        ...mutationsState,
        update: true,
        featureId: Number(featureId).toString(),
      });

      isLoadingVar(true);
    });

    if (invalidField) return false;

    return true;
  };

  const onDelete = (featuresId: number[]) => {
    const successMsgChecker = (length) => {
      if (length > 1) return 'Itens excluídos com sucesso';
      return 'Item excluído com sucesso';
    };

    featuresId.forEach((id) => {
      deleteItem({ variables: { id } });
      isLoadingVar(true);
      sucessMsgVar(successMsgChecker(featuresId.length));
      setMutationsState({ ...mutationsState, delete: true });
    });
  };

  const attach = (f) => {
    mutation.subscribe(f);
  };
  const detach = (f) => {
    mutation.unsubscribe(f);
  };

  return {
    onInsert,
    onUpdate,
    onDelete,
    attach,
    detach,
  };
};
