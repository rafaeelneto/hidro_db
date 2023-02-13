import React, { useState } from 'react';
/* eslint-disable react/prop-types */

import { InputLabel, Input, FormControl, IconButton, Tooltip } from '@material-ui/core/';

import { MapPin } from 'react-feather';

import { gql, useQuery } from '@apollo/client';

import FullScreenDialog from '../dialogs/fullScreenDialog.component';
import LocationPicker from '../maps/locationPicker.component';

import { useHistoryState } from '../../utils/dataState.manager';

import { FieldComponentType } from '../types/components.types';

import styles from './coordinates.module.scss';

const NULL_VALUE = { value: '', label: '' };

export default function Coordinates({ field, tableName, featureId }: FieldComponentType) {
  const { addHistoryItem, getHistoryLastItem } = useHistoryState();
  // GET THE LIST OF FILES
  const stateItem = { ...getHistoryLastItem(tableName, featureId) };

  const stateValue = stateItem[field.columnName] || NULL_VALUE;

  const [coordinatePickerDialog, setCoordPickerDialog] = useState(false);

  const { coordinates } = stateValue.value;
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: coordinates ? coordinates[1] : '',
    lng: coordinates ? coordinates[0] : '',
  });

  const GET_DATA_LOCAL = gql`
    query {
      isOnEdit @client
    }
  `;

  const {
    data: { isOnEdit },
  } = useQuery(GET_DATA_LOCAL);

  // handle on change of properties
  const onChangePosition = ({ lat, lng }: { lat: number; lng: number }) => {
    setPosition({ lat, lng });
  };

  const onResponse = (response: boolean) => {
    // SAVE COORDINATE TO HISTORY
    if (!position) return;

    setCoordPickerDialog(false);

    if (!response) return;

    const newGeom = { ...stateValue.value, coordinates: [position.lng, position.lat] };

    stateItem[field.columnName] = field.getValue ? field.getValue({ geom: newGeom }) : '';
    addHistoryItem(tableName, featureId, stateItem);
  };

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.fieldContainer}>
        <FormControl className={styles.textField}>
          <InputLabel htmlFor="component-simple">{field.label}</InputLabel>
          <Input id="component-simple" value={stateValue.label} disabled />
        </FormControl>
        <Tooltip title="Editar Coordenadas">
          <IconButton
            disabled={!isOnEdit}
            color="primary"
            onClick={() => setCoordPickerDialog(true)}
          >
            <MapPin />
          </IconButton>
        </Tooltip>
      </div>
      <div>
        <FullScreenDialog
          open={coordinatePickerDialog}
          onResponse={onResponse}
          title="Editar coordenadas"
          btnText="Salvar"
        >
          <div className={styles.locationPickerContainer}>
            <LocationPicker position={position} onChangePosition={onChangePosition} />
          </div>
        </FullScreenDialog>
      </div>
    </div>
  );
}
