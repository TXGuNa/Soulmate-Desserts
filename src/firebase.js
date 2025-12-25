import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const isFirebaseEnabled = import.meta.env.VITE_USE_FIREBASE === 'true';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let db = null;

if (isFirebaseEnabled) {
  if (!firebaseConfig.projectId) {
    console.warn('Firebase enabled but config is missing. Check .env settings.');
  } else {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
}

export { app, db, isFirebaseEnabled };
