import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { FIREBASE_CONFIG } from '@/core/config/firebaseConstants';

const SECONDARY_APP_NAME = 'TrancattoProvisioning';

function resolveConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? FIREBASE_CONFIG.apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? FIREBASE_CONFIG.authDomain,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? FIREBASE_CONFIG.projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? FIREBASE_CONFIG.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? FIREBASE_CONFIG.messagingSenderId,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? FIREBASE_CONFIG.appId,
  };
}

export function getProvisioningFirebaseApp(): FirebaseApp {
  const existingApp = getApps().find((app) => app.name === SECONDARY_APP_NAME);

  if (existingApp) {
    return existingApp;
  }

  return initializeApp(resolveConfig(), SECONDARY_APP_NAME);
}
