import React, { useState, useRef } from 'react';

import FullScreenDialog from './fullScreenDialog.component';
import PerfilEditor from '../perfilEditor/perfilEditor.component';

import { useHistoryState } from '../../utils/dataState.manager';

import { Field } from '../../models/Interfaces';

import styles from './pocosPerfilDialog.module.scss';

export default ({
  tableName,
  open,
  featureId,
  nomePoco = '',
  field,
  onResponse,
  ...otherProps
}) => (
  <div>
    <FullScreenDialog
      open={open}
      onResponse={onResponse}
      btnText={null}
      title={`Editar perfil do poço ${nomePoco}`}
      alwaysFull
    >
      <PerfilEditor tableName={tableName} nomePoco={nomePoco} featureId={featureId} field={field} />
    </FullScreenDialog>
  </div>
);
