/* global google */
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { initGoogleMaps, getUserLocation } from '../services/maps';

export default function MapPreview() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [errorMSG, setErrorMSG] = useState("");

  useEffect(() => {
    let mapInstance;

    const initializeMap = async () => {
      try {
        const _ = await initGoogleMaps(); // Wait for script load
        const userPos = await getUserLocation();
        
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { PlacesService } = await google.maps.importLibrary("places"); // Using callback mode

        if (!mapRef.current) return;

        mapInstance = new Map(mapRef.current, {
          center: userPos,
          zoom: 14,
          mapId: "SOS_DECISION_TREE_MAP", // Generic mapId required for Advanced markers
          disableDefaultUI: true,
        });

        // Add User Marker
        new AdvancedMarkerElement({
          map: mapInstance,
          position: userPos,
          title: "You are here",
        });

        // Search for nearby hospitals and police stations
        const service = new google.maps.places.PlacesService(mapInstance);
        const request = {
          location: userPos,
          radius: '5000',
          type: ['hospital', 'police']
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.slice(0, 5).forEach(place => {
              new AdvancedMarkerElement({
                map: mapInstance,
                position: place.geometry.location,
                title: place.name,
              });
            });
          }
          setLoading(false);
        });

      } catch (err) {
        console.error(err);
        setErrorMSG("Location access denied or maps unavailable.");
        setLoading(false);
      }
    };

    initializeMap();

  }, []);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={18} />
        Nearby Services
      </h3>
      
      <div className="map-container" ref={mapRef}>
        {loading && !errorMSG && <div>Locating nearby help...</div>}
        {errorMSG && <div style={{ color: 'var(--color-danger)' }}>{errorMSG}</div>}
      </div>
      
      {!errorMSG && !loading && (
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Info size={12} /> Map shows nearest hospitals and police stations
        </p>
      )}
    </div>
  );
}
