import React, { useState } from 'react';
import { IconButton, Tooltip, makeStyles, useTheme } from '@material-ui/core';
import { useQuery, gql } from '@apollo/client';
import grey from '@material-ui/core/colors/grey';

import { Link, useLocation } from 'react-router-dom';

import { Edit, PlusCircle, Delete, Trash, Save } from 'react-feather';

import LoadingComponent from '../loadingComponents/loading.component';
import AlertDialog from '../dialogs/alertDialog.component';

import tablesBundler, { TablesBundler } from '../../models/tablesBundler';
import enums from '../../models/enums';

import { isOnEditVar } from '../../graphql/cache';
import { useHistoryState } from '../../utils/dataState.manager';

// =====================================
// DATA STATE MANAGER
// =====================================
import { useSelectedItems } from '../../utils/dataState.manager';

import { useMutationItem } from '../../graphql/fetchMutation';

import styles from './editPanel.module.scss';

const useStyles = makeStyles((theme) => ({
  editBtn: {
    fill: theme.palette.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnActive: {
    fill: 'white',
    backgroundColor: theme.palette.primary.main,
    '&.MuiButton-root:hover': {
      backgroundColor: grey[700],
    },
  },
  btn: {
    fill: grey[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActive: {
    fill: grey[700],
  },
}));

// eslint-disable-next-line react/prop-types
export default ({ tableName, featureId }) => {
  const tableInfo: TablesBundler = tablesBundler[tableName];
  const table = tableInfo.instance;
  const theme = useTheme();
  const classes = useStyles(theme);

  const location = useLocation();

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { resetHistory, getHistoryLastKey } = useHistoryState();

  const { getSelectedItems, removeAllSelectedItems } = useSelectedItems();

  const { onUpdate, onDelete } = useMutationItem(tableName, table);

  const selectedItems = getSelectedItems(tableName);

  let unsavedChanges = false;

  if (featureId && (getHistoryLastKey(tableName, featureId) ?? 0) > 0) {
    unsavedChanges = true;
  }

  const onExitResponse = (response) => {
    if (response) resetHistory(tableName, featureId, true);
    isOnEditVar(!response);
    setExitDialogOpen(false);
  };

  const onDeleteResponse = (response) => {
    // DELETE OPERATION

    // TODO IMPLEMENT THE DELETE FUNCTION TO ONE FEATURE ONLY
    if (response) {
      onDelete(selectedItems);
      removeAllSelectedItems(tableName);
    }

    setDeleteDialogOpen(false);
  };

  const GET_DATA = gql`
    query {
      isOnEdit @client
      userInfo @client
    }
  `;

  const {
    data: { isOnEdit, userInfo },
    loading,
  } = useQuery(GET_DATA);

  if (loading) return <LoadingComponent />;

  if (userInfo && !enums.authRoles.includes(userInfo.role)) return <div />;

  const handleEditBtn = () => {
    if (userInfo && enums.authRoles.includes(userInfo.role)) {
      if (isOnEdit) {
        if (unsavedChanges) setExitDialogOpen(true);
        else isOnEditVar(false);
      } else isOnEditVar(true);
    }
  };

  const handleDeleteBtn = () => {
    if (isOnEdit && selectedItems.length > 0) setDeleteDialogOpen(true);
  };

  const handleDiscardBtn = () => {
    if (featureId) resetHistory(tableName, featureId, true);
    else if (selectedItems) {
      selectedItems.forEach((id) => {
        // resetHistory(tablenid);
      });
    }
  };

  return (
    <div className={styles.root}>
      <div>
        <Tooltip title={!isOnEdit ? 'Editar' : 'Fechar edição'} placement="top">
          <IconButton
            className={`${classes.editBtn} ${isOnEdit ? classes.editBtnActive : ''}`}
            onClick={handleEditBtn}
          >
            <Edit />
          </IconButton>
        </Tooltip>
      </div>
      <Tooltip title="Adicionar" placement="top">
        <IconButton
          className={`${classes.btn} ${isOnEdit ? classes.btnActive : ''}`}
          disabled={!isOnEdit}
          component={Link}
          to={`${location.pathname}/new`}
        >
          <PlusCircle />
        </IconButton>
      </Tooltip>
      <Tooltip title="Excluir" placement="top">
        <IconButton
          className={`${classes.btn} ${isOnEdit ? classes.btnActive : ''}`}
          disabled={!isOnEdit}
          onClick={handleDeleteBtn}
        >
          <Trash />
        </IconButton>
      </Tooltip>
      <Tooltip title="Salvar alterações" placement="top">
        <IconButton
          className={`${classes.btn} ${isOnEdit && unsavedChanges ? classes.btnActive : ''}`}
          disabled={!(isOnEdit && unsavedChanges)}
          onClick={() => {
            onUpdate([featureId]);
            resetHistory(tableName, featureId, true);
          }}
        >
          <Save />
        </IconButton>
      </Tooltip>
      <Tooltip title="Descartar alterações" placement="top">
        <IconButton
          className={`${classes.btn} ${isOnEdit && unsavedChanges ? classes.btnActive : ''}`}
          disabled={!(isOnEdit && unsavedChanges)}
          onClick={handleDiscardBtn}
        >
          <Delete />
        </IconButton>
      </Tooltip>
      <AlertDialog
        open={exitDialogOpen}
        title="Sair sem salvar"
        msg="Você tem certeza que deseja sair da edição sem salvar alterações?"
        onResponse={onExitResponse}
      />
      <AlertDialog
        open={deleteDialogOpen}
        title={`Excluir ${
          selectedItems ? `${selectedItems.length} items selectionados` : 'este item?'
        }`}
        msg={`Você tem certeza que vai excluir ${
          selectedItems ? `${selectedItems.length} items selectionados` : 'este item?'
        }? Essa operação não pode ser desfeita`}
        onResponse={onDeleteResponse}
      />
    </div>
  );
};
