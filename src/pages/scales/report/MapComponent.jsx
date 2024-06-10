// src/MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapComponent = ({ lat, lng }) => {
  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAsH8omDk8y0lSGLTW9YtZiiQ2MkmsF-uQ">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
