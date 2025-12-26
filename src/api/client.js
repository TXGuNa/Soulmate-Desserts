import { isFirebaseEnabled } from '../firebase';
import { firebaseProducts, firebaseCountryContacts, firebaseSettings, firebaseOrders, firebaseIngredients, firebaseMessages, firebaseUsers, firebaseInvites } from './firebaseClient';

const API_URL = 'http://localhost:3001';

// Generic fetch wrapper
const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Request Failed:', error);
    throw error;
  }
};

const useFirebase = isFirebaseEnabled;

export const api = {
  // Products
  getProducts: () =>
    useFirebase ? firebaseProducts.getProducts() : request("products"),
  createProduct: (product) =>
    useFirebase
      ? firebaseProducts.createProduct(product)
      : request("products", { method: "POST", body: JSON.stringify(product) }),
  updateProduct: (id, product) =>
    useFirebase
      ? firebaseProducts.updateProduct(id, product)
      : request(`products/${id}`, {
          method: "PUT",
          body: JSON.stringify(product),
        }),
  deleteProduct: (id) =>
    useFirebase
      ? firebaseProducts.deleteProduct(id)
      : request(`products/${id}`, { method: "DELETE" }),

  // Ingredients
  // Ingredients
  getIngredients: () => 
    useFirebase ? firebaseIngredients.getIngredients() : request("ingredients"),
  createIngredient: (ing) =>
    useFirebase 
      ? firebaseIngredients.createIngredient(ing)
      : request("ingredients", { method: "POST", body: JSON.stringify(ing) }),
  updateIngredient: (id, ing) =>
    useFirebase
      ? firebaseIngredients.updateIngredient(id, ing)
      : request(`ingredients/${id}`, { method: "PUT", body: JSON.stringify(ing) }),
  deleteIngredient: (id) => 
    useFirebase ? firebaseIngredients.deleteIngredient(id) : request(`ingredients/${id}`, { method: "DELETE" }),

  // Orders
  getOrders: () =>
    useFirebase ? firebaseOrders.getOrders() : request("orders"),
  createOrder: (order) =>
    useFirebase
      ? firebaseOrders.createOrder(order)
      : request("orders", { method: "POST", body: JSON.stringify(order) }),
  updateOrder: (id, order) =>
    useFirebase
      ? firebaseOrders.updateOrder(id, order)
      : request(`orders/${encodeURIComponent(id)}`, {
          method: "PUT",
          body: JSON.stringify(order),
        }),

  // Messages
  // Messages
  getMessages: () => 
    useFirebase ? firebaseMessages.getMessages() : request("messages"),
  createMessage: (msg) =>
    useFirebase
      ? firebaseMessages.createMessage(msg)
      : request("messages", { method: "POST", body: JSON.stringify(msg) }),
  deleteMessage: (id) => 
    useFirebase ? firebaseMessages.deleteMessage(id) : request(`messages/${id}`, { method: "DELETE" }),

  // Users (Mock Auth)
  // Users (Mock Auth)
  getUsers: () => 
    useFirebase ? firebaseUsers.getUsers() : request("users"),
  createUser: (user) =>
    useFirebase
      ? firebaseUsers.createUser(user)
      : request("users", { method: "POST", body: JSON.stringify(user) }),
  deleteUser: (id) => 
    useFirebase ? firebaseUsers.deleteUser(id) : request(`users/${id}`, { method: "DELETE" }),
  // Invites
  // Invites
  getInvites: () => 
    useFirebase ? firebaseInvites.getInvites() : request("invites"),
  createInvite: (invite) =>
    useFirebase
      ? firebaseInvites.createInvite(invite)
      : request("invites", { method: "POST", body: JSON.stringify(invite) }),
  updateInvite: (id, invite) =>
    useFirebase
      ? firebaseInvites.updateInvite(id, invite)
      : request(`invites/${id}`, { method: "PUT", body: JSON.stringify(invite) }),
  deleteInvite: (id) => 
    useFirebase ? firebaseInvites.deleteInvite(id) : request(`invites/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () =>
    useFirebase ? firebaseSettings.getSettings() : request("settings/1"),
  updateSettings: (settings) =>
    useFirebase
      ? firebaseSettings.updateSettings(settings)
      : request("settings/1", {
          method: "PUT",
          body: JSON.stringify({ id: 1, ...settings }),
        }),

  // Country Contacts
  getCountryContacts: () =>
    useFirebase
      ? firebaseCountryContacts.getCountryContacts()
      : request("countryContacts"),
  createCountryContact: (contact) =>
    useFirebase
      ? firebaseCountryContacts.createCountryContact(contact)
      : request("countryContacts", {
          method: "POST",
          body: JSON.stringify(contact),
        }),
  updateCountryContact: (id, contact) =>
    useFirebase
      ? firebaseCountryContacts.updateCountryContact(id, contact)
      : request(`countryContacts/${id}`, {
          method: "PUT",
          body: JSON.stringify(contact),
        }),
  deleteCountryContact: (id) =>
    useFirebase
      ? firebaseCountryContacts.deleteCountryContact(id)
      : request(`countryContacts/${id}`, { method: "DELETE" }),

  // IP Geolocation (free API)
  getCountryFromIP: async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      return { countryCode: data.country_code, countryName: data.country_name };
    } catch (error) {
      console.error("Failed to get country from IP:", error);
      return { countryCode: "GENERAL", countryName: "Unknown" };
    }
  },
};
