/* eslint-disable react/self-closing-comp */
import React, { useState } from 'react';

import { gql, useQuery } from '@apollo/client';

import {
  MapContainer,
  TileLayer,
  Popup,
  ZoomControl,
  LayersControl,
  GeoJSON,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';

import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

import { tableUserStateVar } from '../../graphql/cache';

import LoadingComponent from '../loadingComponents/loading.component';
import DetailsTip from './DetailsTip';

import styles from './mainMap.module.scss';

import './leaflet_custom.css';

import tablesBundler from '../../models/tablesBundler';

import { convert2GeoJson } from '../../utils/geoJsonConverter';

const API_KEY_GMAPS = process.env.REACT_APP_API_KEY_GMAPS;

export default ({ tablesNames }) => {
  const tablesInfo = tablesNames.map((tableName) => {
    if (!tablesBundler[tableName].instance.getGIS) return null;

    // eslint-disable-next-line consistent-return
    return { ...tablesBundler[tableName], getGIS: tablesBundler[tableName].instance.getGIS() };
  });

  const {
    data: { tableUserState },
  } = useQuery(gql`
    query {
      tableUserState @client
    }
  `);

  let mapBaseLayer = 'OpenStreetMap';

  if (tableUserState && tableUserState.mapBase) {
    mapBaseLayer = tableUserState.mapBase || mapBaseLayer;
  }

  const [popup, setPopup] = useState({ show: false, data: {}, latlng: { lat: 0, lng: 0 } });

  const { data, loading, error } = useQuery(gql`
    query GET_GEO_FEATURES {
      ${tablesInfo.map((table) => table.getGIS.query)}
    }
  `);

  if (loading) return <LoadingComponent />;
  if (error) {
    throw error;
  }

  const layers = tablesInfo.map((table) => {
    const dataTable = data[table.name];
    if (!dataTable) return '';
    const geoJsonData = convert2GeoJson(dataTable);

    const onEachCustomTable = (feature = {}, layer) => {
      const { properties = {} } = feature;

      if (!properties.id) return;

      const dataInfo = table.getGIS.getInfo(properties);

      const mouseOn = (e) => {
        setPopup({ show: true, data: dataInfo, latlng: e.latlng });
      };

      const mouseOut = (e) => {
        setTimeout(() => setPopup({ show: false, ...popup }), 300000);
      };

      const mouseClick = (e) => {
        setPopup({ show: false, ...popup });
        mouseOn(e);
      };

      layer.on({
        mouseover: mouseOn,
        mouseout: mouseOut,
        click: mouseClick,
      });
    };

    const pointToLayer = (feature, latlng) => {
      const { properties = {} } = feature;
      if (!properties.id) return;

      const tableMarker = new L.Icon({
        iconUrl: table.getGIS.getIconURL(properties),
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5],
      });

      // eslint-disable-next-line consistent-return
      return L.marker(latlng, {
        icon: tableMarker,
      });
    };

    return (
      <LayersControl.Overlay checked name={table.label}>
        <GeoJSON data={geoJsonData} onEachFeature={onEachCustomTable} pointToLayer={pointToLayer} />
      </LayersControl.Overlay>
    );
  });

  function MapEventListener() {
    const map = useMapEvents({
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
        zoomControl={false}
        className={styles.map}
        center={[-3.930020157111463, -52.3828125]}
        zoom={6}
        scrollWheelZoom
      >
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
          {layers}
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
