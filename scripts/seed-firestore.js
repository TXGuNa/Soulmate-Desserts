import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

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

const uploadBase64Image = async (base64String, filePath, storageInstance) => {
  const bucket = storageInstance.bucket();
  const file = bucket.file(filePath);

  const buffer = Buffer.from(base64String.split(',')[1], 'base64');
  await file.save(buffer, {
    metadata: { contentType: 'image/jpeg' },
    public: true,
    resumable: false,
  });

  // Construct the public URL manually for consistency and long-term access
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media`;
  
  return publicUrl;
};

const upsertCollection = async (firestore, name, records, normalizer = (v) => v, storage) => {
  if (!Array.isArray(records) || records.length === 0) return;
  const col = firestore.collection(name);
  for (const record of records) {
    let normalized = normalizer(record);

    // Handle product images for 'products' collection
    if (name === 'products' && normalized.images && Array.isArray(normalized.images)) {
      const imageUrls = [];
      for (const [index, image] of normalized.images.entries()) {
        if (image && image.startsWith('data:image') && storage) {
          // It's a base64 image, upload to Firebase Storage
          const fileName = `products/${normalized.id || 'new'}_${index}.jpeg`;
          try {
            const imageUrl = await uploadBase64Image(image, fileName, storage);
            imageUrls.push(imageUrl);
            console.log(`Uploaded image for product ${normalized.id}: ${imageUrl}`);
          } catch (uploadError) {
            console.error(`Failed to upload image for product ${normalized.id} at index ${index}:`, uploadError);
            imageUrls.push('error-upload-url'); // Placeholder for failed upload
          }
        } else {
          // It's already a URL or not a base64 image
          imageUrls.push(image);
        }
      }
      normalized = { ...normalized, images: imageUrls };
    }

    const id = normalized.id ? String(normalized.id) : undefined;
    const docRef = id ? col.doc(id) : col.doc();
    await docRef.set({ ...normalized, id: id || docRef.id }, { merge: true });
  }
  console.log(`Seeded ${records.length} docs into ${name}`);
};

const main = async () => {
  const credential = await buildCredential();
  initializeApp({ 
    credential, 
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    storageBucket: 'soulmate-desserts.firebasestorage.app' 
  });
  const firestore = getFirestore();
  const storage = getStorage();

  const data = await readJson(dbPath);

  await upsertCollection(firestore, 'products', data.products, normalizeProduct, storage);
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
