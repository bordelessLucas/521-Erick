export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBZP7R6v08MNsPv_BeT3DGT5jStpc75GXg',
  authDomain: 'erick-c7214.firebaseapp.com',
  projectId: 'erick-c7214',
  storageBucket: 'erick-c7214.firebasestorage.app',
  messagingSenderId: '495249634769',
  appId: '1:495249634769:web:1379c03d766888362cdcf0',
} as const;

export const FIRESTORE_COLLECTIONS = {
  orders: 'orders',
  users: 'users',
  pipelineStages: 'pipelineStages',
} as const;

/** CNPJ do Erick — ao informar na tela de login, libera o acesso admin. */
export const ADMIN_GATE_CNPJ = '12.345.678/0001-90';

export const DEMO_CLIENT_CNPJ = ADMIN_GATE_CNPJ;

/** Credenciais padrão do painel admin (acesso via CNPJ do Erick). */
export const ADMIN_DEFAULT_EMAIL = 'admin@admin.com';
export const ADMIN_DEFAULT_PASSWORD = '12345678';
