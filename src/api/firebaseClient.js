import { collection, getDocs, addDoc, setDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
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

const countryContactsCol = () => collection(db, 'countryContacts');

export const firebaseCountryContacts = {
  async getCountryContacts() {
    ensureReady();
    const snap = await getDocs(countryContactsCol());
    return snap.docs.map(mapDoc);
  },
  async createCountryContact(contact) {
    ensureReady();
    // For country contacts, the ID is typically the country code (e.g., 'us', 'tm')
    // So we use setDoc instead of addDoc to enforce this.
    if (!contact.id) throw new Error('Contact must have an ID (country code).');
    await setDoc(doc(countryContactsCol(), contact.id), contact);
    return contact;
  },
  async updateCountryContact(id, contact) {
    ensureReady();
    await setDoc(doc(countryContactsCol(), id), contact, { merge: true });
    return { ...contact, id };
  },
  async deleteCountryContact(id) {
    ensureReady();
    await deleteDoc(doc(countryContactsCol(), id));
    return true;
  }
};

// Settings stored as a single document
const settingsDoc = () => doc(db, 'settings', 'default');

export const firebaseSettings = {
  async getSettings() {
    ensureReady();
    const snap = await getDoc(settingsDoc());
    if (!snap.exists()) {
      return {
        id: 'default',
        language: 'en',
        currency: 'USD',
        currencies: [{ code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 }],
      };
    }
    return { id: snap.id, ...snap.data() };
  },
  async updateSettings(settings) {
    ensureReady();
    const payload = { id: 'default', ...settings };
    await setDoc(settingsDoc(), payload, { merge: true });
    return payload;
  },
};

const ordersCol = () => collection(db, 'orders');

export const firebaseOrders = {
  async getOrders() {
    ensureReady();
    const snap = await getDocs(ordersCol());
    return snap.docs.map(mapDoc);
  },
  async createOrder(order) {
    ensureReady();
    if (order.id) {
      await setDoc(doc(ordersCol(), order.id), order, { merge: true });
      return order;
    }
    const created = await addDoc(ordersCol(), order);
    return { ...order, id: created.id };
  },
  async updateOrder(id, order) {
    ensureReady();
    await setDoc(doc(ordersCol(), id), { ...order, id }, { merge: true });
    return { ...order, id };
  },
};
