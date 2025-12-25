import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TranslationProvider } from './context/TranslationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import { api } from './api/client';
import './styles/App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [userCountry, setUserCountry] = useState(null); // User's country from IP
  
  // Wrapper for setPage to ensure it works correctly
  const handleNavigate = (newPage) => {
    if (newPage && typeof newPage === 'string') {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const [products, setProducts] = useState([]);
  
  const [ingredients, setIngredients] = useState([]);
  
  const [orders, setOrders] = useState([]);
  
  const [settings, setSettings] = useState({
    language: 'en',
    currency: 'USD',
    currencies: [
      { code: 'TMT', name: 'Turkmen Manat', symbol: 'TMT', rate: 3.5 },
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 }
    ],
    contactInfo: {
      phone: '(512) 555-CAKE',
      email: 'hello@soulmatedesserts.com'
    }
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Use Promise.allSettled to ensure that if one fails, others still load
      const results = await Promise.allSettled([
        api.getProducts(),
        api.getIngredients(),
        api.getOrders(),
        api.getSettings()
      ]);

      const [prodsResult, ingsResult, ordsResult, setsResult] = results;

      if (prodsResult.status === 'fulfilled') {
        setProducts(prodsResult.value);
      } else {
        console.error('Failed to load products:', prodsResult.reason);
      }

      if (ingsResult.status === 'fulfilled') {
        setIngredients(ingsResult.value);
      } else {
        console.error('Failed to load ingredients:', ingsResult.reason);
      }

      if (ordsResult.status === 'fulfilled') {
        setOrders(ordsResult.value);
      } else {
        console.error('Failed to load orders:', ordsResult.reason);
      }

      if (setsResult.status === 'fulfilled') {
        const sets = setsResult.value;
        if (sets && sets.currencies) setSettings(sets);
      } else {
        console.error('Failed to load settings:', setsResult.reason);
      }
    } catch (error) {
       console.error('Unexpected error in fetchData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Detect user country from IP
    const detectCountry = async () => {
      try {
        const location = await api.getCountryFromIP();
        setUserCountry(location.countryCode);
      } catch (err) {
        console.error('Failed to detect country:', err);
        setUserCountry('GENERAL');
      }
    };
    detectCountry();
  }, []);

  const handleUpdateProduct = (productId, updates) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? { ...p, ...updates } : p);
      return updated;
    });
  };



  // Currency conversion utility
  const convertCurrency = (amount) => {
    const currentCurrency = settings.currencies.find(c => c.code === settings.currency);
    if (!currentCurrency || settings.currency === 'USD') return Number(amount);
    return Number(amount) * currentCurrency.rate;
  };

  const formatCurrency = (amount) => {
    const currentCurrency = settings.currencies.find(c => c.code === settings.currency) || settings.currencies[0];
    const converted = convertCurrency(amount);
    const displaySymbol = (currentCurrency?.symbol && currentCurrency.symbol.trim()) ? currentCurrency.symbol : (currentCurrency?.code || 'USD');
    return `${displaySymbol} ${Number(converted).toFixed(2)}`;
  };

  // Handle Base Currency Rotation (make selected currency the new Base 1.0)
  const handleBaseCurrencyChange = async (newBaseCode) => {
    const oldBase = settings.currencies.find(c => c.rate === 1) || settings.currencies.find(c => c.code === 'USD') || settings.currencies[0];
    const newBase = settings.currencies.find(c => c.code === newBaseCode);

    if (!newBase || newBase.code === oldBase.code) return;

    setIsLoading(true);
    try {
      // Conversion factor: e.g. if TMT was 3.5, factor is 3.5
      const factor = newBase.rate;

      // 1. Update Currencies
      // New Base becomes 1.0. All others are divided by factor.
      // e.g. TMT (3.5) -> 1.0. USD (1.0) -> 1/3.5 = 0.2857
      const updatedCurrencies = settings.currencies.map(c => ({
        ...c,
        rate: parseFloat((c.rate / factor).toFixed(6)) // Prevent excessive decimals
      }));

      // 2. Prepare Settings Update (including shipping cost conversion)
      const updatedSettings = {
        ...settings,
        currencies: updatedCurrencies,
        currency: newBaseCode, // Set new base as active currency too
        store: settings.store ? {
          ...settings.store,
          shipping: parseFloat((settings.store.shipping * factor).toFixed(2))
        } : settings.store
      };

      // 3. Prepare Products Update (Stored prices are now in new Base)
      // Price increases by factor. e.g. 10 USD -> 35 TMT
      const updatedProducts = products.map(p => ({
        ...p,
        price: parseFloat((p.price * factor).toFixed(2)),
        makingPrice: p.makingPrice ? parseFloat((p.makingPrice * factor).toFixed(2)) : 0
      }));

      // 4. Prepare Ingredients Update
      const updatedIngredients = ingredients.map(i => ({
        ...i,
        pricePerUnit: parseFloat((i.pricePerUnit * factor).toFixed(2))
      }));

      // 5. Apply Updates to API (Persistence)
      await api.updateSettings(updatedSettings); // Update settings first

      // Only update products/ingredients if they have valid IDs
      const validProducts = updatedProducts.filter(p => p.id);
      const validIngredients = updatedIngredients.filter(i => i.id);
      
      // Parallelize product/ingredient updates for speed - use allSettled to ignore individual failures
      if (validProducts.length > 0 || validIngredients.length > 0) {
        await Promise.allSettled([
          ...validProducts.map(p => api.updateProduct(p.id, p)),
          ...validIngredients.map(i => api.updateIngredient(i.id, i))
        ]);
      }
      
      // 6. Update Local State
      setSettings(updatedSettings);
      setProducts(updatedProducts);
      setIngredients(updatedIngredients);
      
    } catch (error) {
      console.error("Failed to rotate base currency:", error);
      console.log("Failed to update base currency. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = {
        id: `#${Date.now()}`,
        ...orderData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      await api.createOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);
      handleNavigate('home');
      console.log(`Order Placed Successfully! Order ID: ${newOrder.id}`);
    } catch (err) {
      console.log("Failed to place order");
      console.error(err);
    }
  };

  const handleResetData = () => {
     console.log("Reset not fully supported in DB mode. Please edit db.json directly.");
  };

  // Currency helpers to pass down
  const currentCurrency = settings.currencies.find(c => c.code === settings.currency) || settings.currencies[0];

  const renderPage = () => {
    const pageKey = page || 'home';
    const commonProps = { onNavigate: handleNavigate, formatCurrency, settings };
    
    switch (pageKey) {
      case 'home':
        return <HomePage {...commonProps} products={products} ingredients={ingredients} onUpdateProduct={handleUpdateProduct} userCountry={userCountry} />;
      case 'catalog':
        return <CatalogPage {...commonProps} products={products} ingredients={ingredients} onUpdateProduct={handleUpdateProduct} userCountry={userCountry} />;
      case 'checkout':
        return <CheckoutPage {...commonProps} onCreateOrder={handleCreateOrder} />;
      case 'contact':
        return <ContactPage {...commonProps} />;
      case 'login':
        return <LoginPage {...commonProps} />;
      case 'settings':
        return <SettingsPage {...commonProps} settings={settings} setSettings={setSettings} onBaseCurrencyChange={handleBaseCurrencyChange} />;
      case 'admin':
        return <AdminPage 
          {...commonProps} 
          ingredients={ingredients} 
          setIngredients={setIngredients} 
          products={products} 
          setProducts={setProducts} 
          orders={orders} 
          setOrders={setOrders} 
          settings={settings} 
          setSettings={setSettings}
          currentCurrency={currentCurrency}
          onResetData={handleResetData}
          refreshData={fetchData}
          userCountry={userCountry}
        />;
      default:
        // Removed console.warn to fix build syntax error
        return <HomePage {...commonProps} products={products} ingredients={ingredients} onUpdateProduct={handleUpdateProduct} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <TranslationProvider language={settings?.language || 'en'}>
          <div className="app">
            <Header onNavigate={handleNavigate} products={products} formatCurrency={formatCurrency} />
            <div key={page} className="page-container">
              {renderPage()}
            </div>
            <CartDrawer onNavigate={handleNavigate} formatCurrency={formatCurrency} settings={settings} />
            <Footer onNavigate={handleNavigate} contactInfo={settings?.contactInfo} />
          </div>
        </TranslationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
