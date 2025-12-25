import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, isFirebaseEnabled } from '../firebase';

const ensureReady = () => {
  if (!isFirebaseEnabled || !db) {
    throw new Error('Firebase is not enabled. Set VITE_USE_FIREBASE=true and provide config.');
  }
};

const productsCol = () => collection(db, 'products');

const mapDoc = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const firebaseProducts = {
  async getProducts() {
    ensureReady();
    const snap = await getDocs(productsCol());
    return snap.docs.map(mapDoc);
  },
  async createProduct(product) {
    ensureReady();
    if (product.id) {
      await setDoc(doc(productsCol(), product.id), product, { merge: true });
      return product;
    }
    const created = await addDoc(productsCol(), product);
    return { ...product, id: created.id };
  },
  async updateProduct(id, product) {
    ensureReady();
    await setDoc(doc(productsCol(), id), { ...product, id }, { merge: true });
    return { ...product, id };
  },
  async deleteProduct(id) {
    ensureReady();
    await deleteDoc(doc(productsCol(), id));
    return true;
  }
};
