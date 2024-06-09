import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const MapComponent = ({ lat, lng }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (mapRef.current && window.google) {
        const { AdvancedMarkerElement } = window.google.maps.marker;
        
        const map = mapRef.current.state.map;
        new AdvancedMarkerElement({
          position: { lat: parseFloat(lat), lng: parseFloat(lng) },
          map: map,
        });
      }
    };

    initializeMap().catch((error) => console.error('Error loading Google Maps:', error));
  }, [lat, lng]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAsH8omDk8y0lSGLTW9YtZiiQ2MkmsF-uQ">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
        zoom={10}
        onLoad={(map) => (mapRef.current = { state: { map } })}
      />
    </LoadScript>
  );
};

export default MapComponent;
