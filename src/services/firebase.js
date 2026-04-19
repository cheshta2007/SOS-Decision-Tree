import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  enableIndexedDbPersistence, 
  collection, 
  addDoc 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sos-mock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export let db = null;
export let app = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code == 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence");
    }
  });
} catch (error) {
  console.warn("Firebase initialization failed. Continuing without DB.", error);
}

// Function to save an emergency log (if we ever want to recall it)
export async function logEmergencyInteraction(type, context, generatedSteps) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, "emergency_logs"), {
      type,
      context,
      generatedSteps,
      timestamp: new Date(),
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}
