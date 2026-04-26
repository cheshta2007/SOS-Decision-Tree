import { Loader } from "@googlemaps/js-api-loader";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsPromise = null;

export const initGoogleMaps = () => {
  if (!API_KEY) {
    console.warn("Google Maps API Key completely missing.");
    return Promise.reject("Missing API Key");
  }
  
  if (!googleMapsPromise) {
    const loader = new Loader({
      apiKey: API_KEY,
      version: "weekly",
      libraries: ["places", "geometry"]
    });
    googleMapsPromise = loader.load();
  }
  return googleMapsPromise;
};

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  });
};

export const calculateDistance = (pos1, pos2) => {
  if (!window.google || !google.maps.geometry) return null;
  const p1 = new google.maps.LatLng(pos1.lat, pos1.lng);
  const p2 = new google.maps.LatLng(pos2.lat, pos2.lng);
  const distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
  return (distance / 1000).toFixed(1); // Return in km
};

export const getDirectionsUrl = (dest) => {
  return `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
};

export const getShareableLocationUrl = (pos) => {
  return `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
};
