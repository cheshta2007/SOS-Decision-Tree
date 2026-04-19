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
      libraries: ["places"]
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
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  });
};
