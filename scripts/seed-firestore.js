import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '..', 'db.json');

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

const buildCredential = async () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const saPath = path.resolve(__dirname, '..', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const serviceAccount = await readJson(saPath);
    return cert(serviceAccount);
  }
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error('Missing admin credentials. Set FIREBASE_ADMIN_* or FIREBASE_SERVICE_ACCOUNT_PATH.');
  }
  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
  return cert({ projectId, clientEmail, privateKey });
};

const normalizeProduct = (p) => ({
  ...p,
  makingPrice: p.makingPrice ?? p.making_price ?? 0,
});

const normalizeIngredient = (i) => ({
  ...i,
  pricePerUnit: i.pricePerUnit ?? i.price_per_unit ?? i.price ?? 0,
});

const upsertCollection = async (firestore, name, records, normalizer = (v) => v) => {
  if (!Array.isArray(records) || records.length === 0) return;
  const col = firestore.collection(name);
  for (const record of records) {
    const normalized = normalizer(record);
    const id = normalized.id ? String(normalized.id) : undefined;
    const docRef = id ? col.doc(id) : col.doc();
    await docRef.set({ ...normalized, id: id || docRef.id }, { merge: true });
  }
  console.log(`Seeded ${records.length} docs into ${name}`);
};

const main = async () => {
  const credential = await buildCredential();
  initializeApp({ credential, projectId: process.env.FIREBASE_ADMIN_PROJECT_ID });
  const firestore = getFirestore();

  const data = await readJson(dbPath);

  await upsertCollection(firestore, 'products', data.products, normalizeProduct);
  await upsertCollection(firestore, 'ingredients', data.ingredients, normalizeIngredient);
  await upsertCollection(firestore, 'orders', data.orders);
  await upsertCollection(firestore, 'countryContacts', data.countryContacts);
  await upsertCollection(firestore, 'settings', data.settings ? [data.settings] : []);
  await upsertCollection(firestore, 'invites', data.invites);
  await upsertCollection(firestore, 'users', data.users);

  console.log('Firestore seed complete.');
};

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
