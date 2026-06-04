import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const realtimeFirebaseConfig = {
  apiKey: import.meta.env.VITE_RTD_API_KEY,
  authDomain: import.meta.env.VITE_RTD_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_RTD_DATABASE_URL,
  projectId: import.meta.env.VITE_RTD_PROJECT_ID,
  storageBucket: import.meta.env.VITE_RTD_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_RTD_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_RTD_APP_ID,
  measurementId: import.meta.env.VITE_RTD_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const realtimeApp = getApps().some((item) => item.name === "realtime-app")
  ? getApp("realtime-app")
  : initializeApp(realtimeFirebaseConfig, "realtime-app");

const realtimeDb = getDatabase(realtimeApp);

export { auth, db, realtimeDb };