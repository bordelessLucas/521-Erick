import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '@/core/config/firebaseConstants';

function resolveConfig() {
  return {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? FIREBASE_CONFIG.apiKey,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? FIREBASE_CONFIG.authDomain,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? FIREBASE_CONFIG.projectId,
    storageBucket:
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? FIREBASE_CONFIG.storageBucket,
    messagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? FIREBASE_CONFIG.messagingSenderId,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? FIREBASE_CONFIG.appId,
  };
}

function getFirebaseApp(): FirebaseApp {
  const defaultApp = getApps().find((app) => app.name === '[DEFAULT]');

  if (defaultApp) {
    return defaultApp;
  }

  return initializeApp(resolveConfig());
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
