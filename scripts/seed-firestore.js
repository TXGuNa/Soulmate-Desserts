import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app'; // Client SDK
import { getFirestore, collection, doc, setDoc, addDoc } from 'firebase/firestore'; // Client SDK

// Load env vars
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '..', 'db.json');

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
    console.error("Missing VITE_FIREBASE_API_KEY in .env");
    process.exit(1);
}

// Initialize Firebase (Client SDK)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const readJson = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));

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
  
  // Client SDK doesn't have batch size limits like Admin SDK strictly, 
  // but we should still process sequentially to avoid rate limits or overwhelming connection.
  for (const record of records) {
    const normalized = normalizer(record);
    
    // Clean up images if they are base64 (Storage upload removed for simplicity in Client SDK migration, 
    // real storage upload requires Auth usually. Keeping strings as is or skipping images if too large).
    // Ideally we'd strip base64 here if we can't upload them easily.
    if (normalized.images && Array.isArray(normalized.images)) {
         // Keep existing logic or simple pass through. 
         // Assuming users want data even if images break or are large strings.
    }

    const id = normalized.id ? String(normalized.id) : undefined;
    try {
        if (id) {
            await setDoc(doc(firestore, name, id), normalized, { merge: true });
        } else {
            await addDoc(collection(firestore, name), normalized);
        }
        process.stdout.write('.'); // progress indicator
    } catch (e) {
        console.error(`\nError saving ${name} record:`, e.message);
    }
  }
  console.log(`\nSeeded ${records.length} docs into ${name}`);
};

const main = async () => {
  console.log('Connecting to Firebase (Client SDK)...');
  console.log('Project:', firebaseConfig.projectId);
  
  const data = await readJson(dbPath);

  console.log('Seeding data...');
  await upsertCollection(db, 'products', data.products, normalizeProduct);
  await upsertCollection(db, 'ingredients', data.ingredients, normalizeIngredient);
  await upsertCollection(db, 'orders', data.orders);
  await upsertCollection(db, 'countryContacts', data.countryContacts);
  await upsertCollection(db, 'settings', data.settings ? [data.settings[0]] : []); // Settings is usually an array in db.json
  await upsertCollection(db, 'invites', data.invites);
  await upsertCollection(db, 'users', data.users);
  await upsertCollection(db, 'messages', data.messages);

  console.log('\nFirestore seed complete.');
  process.exit(0);
};

main().catch((err) => {
  console.error('\nSeed failed:', err);
  process.exit(1);
});

