/* global google */
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info, Share2, ExternalLink } from 'lucide-react';
import { initGoogleMaps, getUserLocation, calculateDistance, getDirectionsUrl, getShareableLocationUrl } from '../services/maps';

export default function MapPreview() {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [errorMSG, setErrorMSG] = useState("");
  const [userPos, setUserPos] = useState(null);
  const [nearbyServices, setNearbyServices] = useState([]);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    let mapInstance;

    const initializeMap = async () => {
      try {
        const _ = await initGoogleMaps(); // Wait for script load
        const pos = await getUserLocation();
        setUserPos(pos);
        
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        if (!mapRef.current) return;

        mapInstance = new Map(mapRef.current, {
          center: pos,
          zoom: 14,
          mapId: "SOS_DECISION_TREE_MAP",
          disableDefaultUI: true,
        });

        // Add User Marker
        new AdvancedMarkerElement({
          map: mapInstance,
          position: pos,
          title: "You are here",
        });

        // Search for nearby hospitals, police, and fire stations
        const service = new google.maps.places.PlacesService(mapInstance);
        const request = {
          location: pos,
          radius: '5000',
          type: ['hospital', 'police', 'fire_station']
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const processedResults = results.slice(0, 5).map(place => {
              const placePos = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              };
              
              new AdvancedMarkerElement({
                map: mapInstance,
                position: placePos,
                title: place.name,
              });

              return {
                name: place.name,
                type: place.types[0],
                distance: calculateDistance(pos, placePos),
                pos: placePos,
                vicinity: place.vicinity
              };
            });
            setNearbyServices(processedResults);
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

  const handleShare = async () => {
    if (!userPos) return;
    const url = getShareableLocationUrl(userPos);
    try {
      await navigator.clipboard.writeText(url);
      setSharing(true);
      setTimeout(() => setSharing(false), 2000);
    } catch (err) {
      console.error("Failed to copy location URL");
    }
  };

  return (
    <div className="map-preview-section">
      <div className="section-header">
        <h3 className="section-title">
          <MapPin size={18} />
          Nearby Emergency Services
        </h3>
        {userPos && (
          <button 
            className={`share-btn ${sharing ? 'active' : ''}`}
            onClick={handleShare}
          >
            <Share2 size={16} />
            {sharing ? 'Copied!' : 'Share Location'}
          </button>
        )}
      </div>
      
      <div className="map-container" ref={mapRef}>
        {loading && !errorMSG && (
          <div className="map-overlay">
            <div className="loader-small"></div>
            <span>Locating nearby help...</span>
          </div>
        )}
        {errorMSG && <div className="map-error">{errorMSG}</div>}
      </div>

      {!loading && nearbyServices.length > 0 && (
        <div className="nearby-list">
          {nearbyServices.map((service, idx) => (
            <div key={idx} className="service-card">
              <div className="service-info">
                <span className="service-name">{service.name}</span>
                <span className="service-distance">{service.distance} km away</span>
              </div>
              <a 
                href={getDirectionsUrl(service.pos)}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-link"
              >
                <Navigation size={14} />
                Directions
              </a>
            </div>
          ))}
        </div>
      )}
      
      {!errorMSG && !loading && (
        <p className="map-footer-info">
          <Info size={12} /> Showing nearest hospitals, police, and fire stations
        </p>
      )}
    </div>
  );
}
