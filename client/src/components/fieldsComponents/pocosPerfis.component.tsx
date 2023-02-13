import React, { useState } from 'react';

import { Button } from '@material-ui/core';

import { List as ListIcon } from 'react-feather';

import PerfilDrawer from '../perfilDrawer/perfilDrawer.component';

import PocosPerfilDialog from '../dialogs/pocosPerfilDialog.component';

import { FieldComponentType } from '../types/components.types';

import { useHistoryState } from '../../utils/dataState.manager';

import styles from './pocosPerfis.module.scss';

const PERFIL_DEFAULT = {
  geologic: [],
  constructive: {
    bole_hole: [],
    well_screen: [],
    surface_case: [],
    well_case: [],
    hole_fill: [],
    cement_pad: {
      type: '',
      width: 0,
      thickness: 0,
      length: 0,
    },
  },
};

const NULL_VALUE = { value: PERFIL_DEFAULT, label: '' };

export default function PocosPerfilComponent({ field, tableName, featureId }: FieldComponentType) {
  const [open, setOpenDialog] = useState(false);

  const { getHistoryLastItem } = useHistoryState();

  // GET THE LIST OF FILES
  const stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const { value: perfil } = stateItem[field.columnName] || NULL_VALUE;

  const handleBtn = () => {
    setOpenDialog(true);
  };

  const onResponse = () => {
    setOpenDialog(false);
  };

  return (
    <div className={styles.fieldWrapper}>
      <div>
        <PerfilDrawer perfil={perfil} withZoom={false} />
      </div>

      <Button
        color="primary"
        variant="outlined"
        onClick={handleBtn}
        size="small"
        startIcon={<ListIcon />}
      >
        Editar perfil
      </Button>

      <PocosPerfilDialog
        title={field.label}
        tableName={tableName}
        open={open}
        onResponse={onResponse}
        field={field}
        nomePoco={stateItem['nome'] ? stateItem['nome'].value : ''}
        featureId={featureId}
      />
    </div>
  );
}
