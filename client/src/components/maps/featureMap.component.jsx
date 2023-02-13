/* eslint-disable react/self-closing-comp */
import React, { useState } from 'react';

import { gql, useQuery } from '@apollo/client';

import {
  MapContainer,
  TileLayer,
  Popup,
  ZoomControl,
  LayersControl,
  FeatureGroup,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';

import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

import { tableUserStateVar } from '../../graphql/cache';

import DetailsTip from './DetailsTip';

import styles from './featureMap.module.scss';

import { convert2GeoJson } from '../../utils/geoJsonConverter';
import LoadingComponent from '../loadingComponents/loading.component';

import './leaflet_custom.css';

const API_KEY_GMAPS = process.env.REACT_APP_API_KEY_GMAPS;

export default ({ tableInfo, getGIS, doRefetch = false, onRefetch = () => {} }) => {
  const [popup, setPopup] = useState({ show: false, data: {}, latlng: { lat: 0, lng: 0 } });

  const {
    data: { tableUserState },
  } = useQuery(gql`
    query {
      tableUserState @client
    }
  `);

  const thisUserState = tableUserState[tableInfo.name];

  let mapZoom = 6;
  let mapCenter = [-3.930020157111463, -52.3828125];
  let mapBaseLayer = 'OpenStreetMap';

  if (tableUserState && tableUserState.mapBase) {
    mapBaseLayer = tableUserState.mapBase || mapBaseLayer;
  }

  if (thisUserState && thisUserState.map) {
    mapZoom = thisUserState.map.zoom || mapZoom;
    mapCenter = thisUserState.map.center || mapCenter;
  }

  const { data, loading, error, refetch } = useQuery(gql`
    query GET_GEO_FEATURES {
      ${getGIS.query}
    }
  `);

  if (loading) return <LoadingComponent />;
  if (error) {
    throw error;
  }

  if (doRefetch) {
    refetch();
    onRefetch();
  }

  const geoJsonData = convert2GeoJson(data[tableInfo.name]);

  const onEachCustomTable = (properties) => {
    if (!properties.id) return null;

    const dataInfo = getGIS.getInfo(properties);

    const mouseOn = (e) => {
      setPopup({ show: true, data: dataInfo, latlng: e.latlng });
    };

    const mouseOut = (e) => {
      setPopup({ show: false, ...popup });
    };

    const mouseClick = (e) => {
      setPopup({ show: false, ...popup });
      mouseOn(e);
    };

    return {
      mouseover: mouseOn,
      mouseout: mouseOut,
      click: mouseClick,
    };
  };

  const pointToLayer = (properties) => {
    if (!properties.id) return null;

    return new L.Icon({
      iconUrl: getGIS.getIconURL(properties),
      iconSize: [15, 15],
      iconAnchor: [7.5, 7.5],
    });
  };

  function MapEventListener() {
    const mapChangeEventListerner = (e) => {
      const newMapState = {
        zoom: map.getZoom(),
        center: map.getCenter(),
      };

      const thisNew = {};

      if (!tableUserState[tableInfo.name]) {
        thisNew[tableInfo.name] = {
          map: newMapState,
        };
      } else {
        const newState = { ...thisUserState, map: newMapState };

        thisNew[tableInfo.name] = newState;
      }
      const newTableState = { ...tableUserState, ...thisNew };

      tableUserStateVar(newTableState);
    };

    const map = useMapEvents({
      zoomend: mapChangeEventListerner,
      drag: mapChangeEventListerner,
      baselayerchange: (e) => {
        const newTableState = { ...tableUserState, mapBase: e.name };

        tableUserStateVar(newTableState);
      },
    });
    return null;
  }

  return (
    <div className={styles.root}>
      <MapContainer
        className={styles.map}
        zoomControl={false}
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom
      >
        <MapEventListener />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked={mapBaseLayer === 'OpenStreetMap'} name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer checked={mapBaseLayer === 'Satelite'} name="Satelite">
            <ReactLeafletGoogleLayer opacity="80%" apiKey={API_KEY_GMAPS} type="satellite" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={mapBaseLayer === 'Satelite com Nomes'}
            name="Satelite com Nomes"
          >
            <ReactLeafletGoogleLayer opacity="80%" apiKey={API_KEY_GMAPS} type="hybrid" />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay checked name={tableInfo.label}>
            <FeatureGroup>
              {geoJsonData.features.map((feature) => {
                if (feature.type !== 'Point') return null;

                const { properties = {} } = feature;
                if (!properties.id) return null;

                const latlng = { lat: feature.coordinates[1], lng: feature.coordinates[0] };

                return (
                  <Marker
                    position={latlng}
                    icon={pointToLayer(properties)}
                    eventHandlers={onEachCustomTable(properties)}
                  />
                );
              })}
            </FeatureGroup>
          </LayersControl.Overlay>
          {/* {layers} */}
        </LayersControl>
        {popup.show ? (
          <Popup position={popup.latlng}>
            <DetailsTip id={popup.data.id} data={popup.data} hidden={!popup.show} />
          </Popup>
        ) : (
          ''
        )}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  );
};
