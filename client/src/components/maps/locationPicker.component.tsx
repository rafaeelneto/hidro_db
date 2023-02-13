import React, { useState } from 'react';

import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import formatcoords from 'formatcoords';

import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { coordinateChecker } from './coordinateChecker';

const API_KEY_GMAPS = process.env.REACT_APP_API_KEY_GMAPS;

const useStyles = makeStyles((theme) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  createStyles({
    root: {
      height: '100%',
      width: '100%',
    },
    map: {
      height: '90%',
      width: '100%',
    },
    formCoordinates: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }),
);

function EventListenerComponent({ onClick }) {
  useMapEvents({
    click: onClick(),
  });
  return null;
}

const LocationPicker = ({ position, onChangePosition }) => {
  const classes = useStyles();

  const [isValidCoordinate, setIsValidCoordinate] = useState(true);
  const [coordinateText, setCoordinateText] = useState(
    position
      ? formatcoords(position).format('DD MM ss X', {
          latLonSeparator: ', ',
          decimalPlaces: 2,
        })
      : '',
  );

  const storeCoordinates = (decimalCoordinates: { lat: number; lng: number }) => {
    setCoordinateText(
      formatcoords(decimalCoordinates).format('DD MM ss X', {
        latLonSeparator: ', ',
        decimalPlaces: 2,
      }),
    );
    setIsValidCoordinate(true);
    onChangePosition(decimalCoordinates);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (!isValidCoordinate) return;
      const coordinate = coordinateChecker(event.target.value);
      const decimalCoordinates = {
        lat: coordinate.getLatitude(),
        lng: coordinate.getLongitude(),
      };
      storeCoordinates(decimalCoordinates);
    }
  };

  return (
    <div className={classes.root}>
      <div>
        <form className={classes.formCoordinates} noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            value={coordinateText}
            error={position ? !isValidCoordinate : false}
            label="Coordenadas Geográficas"
            onKeyDown={onKeyDown}
            onChange={(event) => {
              setCoordinateText(event.target.value);
              const coordinate = coordinateChecker(event.target.value);
              if (!coordinate) {
                setIsValidCoordinate(false);
                return;
              }
              setIsValidCoordinate(true);
            }}
          />
        </form>
      </div>
      <MapContainer
        className={classes.map}
        center={[-3.930020157111463, -52.3828125]}
        zoom={6}
        scrollWheelZoom
      >
        <EventListenerComponent
          onClick={() => {
            return (e) => {
              storeCoordinates(e.latlng);
            };
          }}
        />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelite">
            <ReactLeafletGoogleLayer apiKey={API_KEY_GMAPS} type="satellite" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelite com Nomes">
            <ReactLeafletGoogleLayer apiKey={API_KEY_GMAPS} type="hybrid" />
          </LayersControl.BaseLayer>
        </LayersControl>
        {position ? <Marker position={position} /> : ''}
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
