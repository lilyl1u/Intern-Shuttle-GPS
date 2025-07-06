import React, { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DriverMap: React.FC = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([0, 0], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);

      markerRef.current = L.marker([0, 0]).addTo(mapRef.current)
        .bindPopup('You are here').openPopup();
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current!.setView([latitude, longitude], 15);
        markerRef.current!.setLatLng([latitude, longitude]);
      });

      const watchId = navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        markerRef.current!.setLatLng([latitude, longitude]);
        mapRef.current!.setView([latitude, longitude]);
      });

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div id="map" style={{ height: '400px', width: '100%' }}></div>
  );
};

export default DriverMap;