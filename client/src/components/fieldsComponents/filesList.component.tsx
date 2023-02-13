import React, { useState } from 'react';
/* eslint-disable react/prop-types */

import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  CircularProgress,
  Divider,
} from '@material-ui/core';

import { Trash, UploadCloud } from 'react-feather';

import { gql, useQuery, useMutation } from '@apollo/client';

import LoadingComponent from '../loadingComponents/loading.component';

import { LinearProgressWithLabel } from '../loadingComponents/loadingsComponents';
import FileUploadDialog from '../dialogs/fileUploadDialog.component';

import { APIPostAuth, API_ENDPOINTS } from '../../utils/fetchRestful';

import { filesType } from '../../models/Interfaces';

import tablesNames from '../../models/tablesDefs/tablesNames';

import { FilesComponentType } from '../types/components.types';

import styles from './filesList.module.scss';

const DEFAULT_ERROR_STATE = { error: true, id: '', msg: '' };

export default function FileListComponent({
  field,
  tableName,
  query,
  mutation,
  featureId,
}: FilesComponentType) {
  const tableInfo = tablesNames[tableName];

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loadingState, setLoadingState] = useState({ loading: false, progress: 0 });
  const [deleteLoadingState, setDeleteLoadingState] = useState('');
  const [error, setError] = useState(DEFAULT_ERROR_STATE);

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  // QUERY THE FILES COLLUMN
  const { data: dataFileList, loading: loadingFileList, error: errorFileList, refetch } = useQuery(
    gql`
      ${query}
    `,
    {
      variables: {
        id: featureId,
      },
    },
  );

  // DEFINE MUTATION
  const [
    updateFiles,
    { data: dataMutation, loading: loadingMutation, error: errorMutation },
  ] = useMutation(
    gql`
      ${mutation}
    `,
  );

  if (loadingFileList || loadingMutation) return <LoadingComponent />;
  if (errorFileList) return <span>Erro ter a lista de arquivos</span>;

  // GET THE LIST OF FILES
  const fileList: filesType = dataFileList[tableInfo.nameByPk][field.columnName] || [];

  const onUploadProgress = (progressEvent) => {
    setLoadingState({
      loading: true,
      progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
    });
  };

  const saveFileList = (newFileList: filesType) => {
    const changes = {};
    changes[field.columnName] = newFileList;
    updateFiles({
      variables: {
        id: featureId,
        changes,
      },
    });
    setLoadingState({ loading: true, progress: 100 });
  };

  // handle on change of properties
  const handleChange = (response, data: FormData) => {
    setUploadDialogOpen(false);
    if (!response || !data) return;

    setLoadingState({ progress: 0, loading: true });

    APIPostAuth(API_ENDPOINTS.FILE_UPLOAD, data, onUploadProgress)
      .then((res) => {
        if (res.status !== 200) return;
        const { id, nome, desc, fileUrl: link } = res.data;

        // save the files list
        const newFileList = [...fileList, { id, nome, desc, link }];
        saveFileList(newFileList);
      })
      .catch((err) => {
        setError({
          error: true,
          id: '',
          msg: 'Não foi possível fazer upload do arquivo, tente novamente mais tarde',
        });
        setTimeout(() => setError(DEFAULT_ERROR_STATE), 2000);
      });
  };

  // HANDLER TO THE DELETE BUTTON
  const handleDelete = (id) => {
    const data = { file_name: id };

    setDeleteLoadingState(id);

    const deleteFile = () => {
      const newFileList = fileList.filter((file) => file.id !== id);
      // save file list
      saveFileList(newFileList);
    };

    APIPostAuth(API_ENDPOINTS.FILE_DELETE, data)
      .then((res) => {
        if (res.status !== 200) return;

        deleteFile();
      })
      .catch((err) => {
        if (err.status !== 404) {
          setError({
            error: true,
            id,
            msg: 'Não foi possível deletar o arquivo, tente novamente mais tarde',
          });
          setTimeout(() => setError(DEFAULT_ERROR_STATE), 2000);
          return;
        }

        deleteFile();
      });
  };

  if ((loadingState.loading || deleteLoadingState !== '') && dataMutation) {
    setLoadingState({ loading: false, progress: 0 });
    setDeleteLoadingState('');
    refetch();
  }

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.demo}>
        <List dense>
          {fileList && fileList.length > 0 ? (
            fileList.map((file) => {
              const { nome, desc, id, link, data } = file;
              return (
                <div>
                  <ListItem
                    className={styles.itemContainer}
                    key={id}
                    button
                    component="a"
                    href={link}
                    target="_blank"
                  >
                    <div className={styles.itemContainer}>
                      <div className={styles.itemHeader}>{nome}</div>
                      <div className={styles.itemDetails}>
                        <span className={styles.secundaryText}>
                          <>
                            {desc}
                            {data || ''}
                            {error.error && error.id === id ? (
                              <span className={styles.errorMsg}>{error.msg}</span>
                            ) : (
                              ''
                            )}
                          </>
                        </span>
                      </div>
                    </div>
                  </ListItem>
                  {isOnEdit ? (
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleDelete(id)}
                        aria-label="delete"
                        className={styles.deleteBtn}
                      >
                        <Trash />
                      </IconButton>
                      {deleteLoadingState === id && (
                        <CircularProgress size={32} className={styles.deleteProgress} />
                      )}
                    </ListItemSecondaryAction>
                  ) : (
                    ''
                  )}
                  <Divider />
                </div>
              );
            })
          ) : (
            <span className={styles.noFilesMsg}>Sem arquivos ainda</span>
          )}
          {loadingState.loading ? (
            <ListItem className={styles.progressBar}>
              <LinearProgressWithLabel
                className={styles.progressBar}
                value={loadingState.progress}
                variant={loadingState.progress < 100 ? 'determinate' : 'indeterminate'}
              />
            </ListItem>
          ) : (
            ''
          )}
          {error.error && error.id === '' ? (
            <span className={styles.errorMsg}>{error.msg}</span>
          ) : (
            ''
          )}
        </List>
      </div>

      <Button
        disabled={!isOnEdit}
        variant="outlined"
        color="primary"
        className={styles.uploadButton}
        startIcon={<UploadCloud />}
        onClick={() => setUploadDialogOpen(true)}
      >
        Adicionar arquivos
      </Button>

      <FileUploadDialog open={uploadDialogOpen} onResponse={handleChange} />
    </div>
  );
}
