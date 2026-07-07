import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '../..');

function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      if (!process.env[key]) {
        process.env[key] = rest.join('=');
      }
    }
  } catch {
    // optional env file
  }
}

loadEnvFile(resolve(rootDir, 'web/.env.local'));
loadEnvFile(resolve(rootDir, 'web/.env'));

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyBZP7R6v08MNsPv_BeT3DGT5jStpc75GXg',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'erick-c7214.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'erick-c7214',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'erick-c7214.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '495249634769',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:495249634769:web:1379c03d766888362cdcf0',
};

const ORDER_STATUSES = [
  'FATURADO',
  'PRODUCAO',
  'SEPARACAO',
  'ORDEM_DE_ROLINHO',
  'APROVADO',
  'AGUARDANDO_APROVACAO',
  'FATURADO',
  'FATURADO',
];

const ORDER_TEMPLATES = [
  { id: 'PED-2026-0042', orderDate: '2026-07-01T10:30:00.000Z', estimatedValue: 48750.0, weightInKg: 1250.5 },
  { id: 'PED-2026-0041', orderDate: '2026-06-28T14:15:00.000Z', estimatedValue: 32100.0, weightInKg: 890.0 },
  { id: 'PED-2026-0040', orderDate: '2026-06-25T09:00:00.000Z', estimatedValue: 15600.0, weightInKg: 420.75 },
  { id: 'PED-2026-0039', orderDate: '2026-06-20T16:45:00.000Z', estimatedValue: 22400.0, weightInKg: 610.0 },
  { id: 'PED-2026-0038', orderDate: '2026-06-18T11:20:00.000Z', estimatedValue: 9800.0, weightInKg: 275.3 },
  { id: 'PED-2026-0037', orderDate: '2026-06-15T08:00:00.000Z', estimatedValue: 54300.0, weightInKg: 1480.0 },
  { id: 'PED-2026-0036', orderDate: '2026-06-10T13:30:00.000Z', estimatedValue: 18900.0, weightInKg: 520.0 },
  { id: 'PED-2026-0035', orderDate: '2026-06-05T10:00:00.000Z', estimatedValue: 41200.0, weightInKg: 1100.25 },
];

function buildSeedOrders(clientCnpj) {
  return ORDER_TEMPLATES.map((order, index) => ({
    ...order,
    clientCnpj,
    status: ORDER_STATUSES[index],
  }));
}

async function main() {
  const email = process.argv[2] ?? process.env.SEED_USER_EMAIL;
  const password = process.argv[3] ?? process.env.SEED_USER_PASSWORD;
  const cnpjOverride = process.argv[4] ?? process.env.SEED_CLIENT_CNPJ;

  if (!email || !password) {
    console.error('Uso: npm run seed:orders -- email@empresa.com palavra-passe [cnpj-opcional]');
    console.error('Ou defina SEED_USER_EMAIL e SEED_USER_PASSWORD em web/.env.local');
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const { getAuth } = await import('firebase/auth');
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log('A autenticar...');
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  let clientCnpj = cnpjOverride;

  if (!clientCnpj) {
    const profileSnap = await getDoc(doc(db, 'users', user.uid));
    if (profileSnap.exists()) {
      clientCnpj = profileSnap.data().clientCnpj;
      console.log(`CNPJ do perfil: ${clientCnpj}`);
    }
  }

  if (!clientCnpj) {
    clientCnpj = '12.345.678/0001-90';
    console.log(`CNPJ não encontrado no perfil. A usar demo: ${clientCnpj}`);
  }

  const seedOrders = buildSeedOrders(clientCnpj);

  console.log(`A inserir ${seedOrders.length} pedidos no Firestore...`);

  for (const order of seedOrders) {
    const { id, ...data } = order;
    await setDoc(doc(db, 'orders', id), data);
    console.log(`  ✓ ${id} (${order.status})`);
  }

  console.log('\nSeed concluído com sucesso.');
  console.log(`Pedidos associados ao CNPJ: ${clientCnpj}`);
}

main().catch((error) => {
  console.error('Erro no seed:', error.message ?? error);
  process.exit(1);
});
