import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../context/TranslationContext';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const HomePage = ({ onNavigate, products, ingredients, onUpdateProduct, formatCurrency, userCountry, settings }) => {
  const [selectedId, setSelectedId] = useState(null);
  const { addToCart } = useCart(); // Refactored from addItem to addToCart
  const { t, language } = useTranslation();
  
  // Filter products by current language and region
  const filteredProducts = products.filter(p => {
    const productLangs = p.languages || ['en', 'ru', 'tr', 'tk']; // Default to all languages if not set
    const langMatch = productLangs.includes(language);
    
    // Check region - if no regions set, show to all. If regions set, check if user's country is included
    const productRegions = p.regions || []; // Empty means available everywhere
    const regionMatch = productRegions.length === 0 || productRegions.includes(userCountry) || productRegions.includes('GENERAL');
    
    return langMatch && regionMatch;
  });
  
  const selected = filteredProducts.find(p => p.id === selectedId);
  
  // Find Hero product from all products (or filtered, depending on preference - usually global hero makes sense, but filtered is safer for region/lang)
  const heroProduct = filteredProducts.find(p => p.tags?.includes('hero')) || products.find(p => p.tags?.includes('hero'));

  return (
    <>
      <Hero onNavigate={onNavigate} heroProduct={heroProduct} onViewProduct={(product) => setSelectedId(product.id)} />
      <section className="section">
        <div className="section-header"><h2>{t('ourCollections')}</h2><p>{t('collectionsSubtitle')}</p></div>
        <div className="products-grid">{filteredProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => setSelectedId(p.id)} onAdd={p => addToCart(p, 1)} ingredients={ingredients} formatCurrency={formatCurrency} />)}</div>
      </section>
      {selected && <ProductModal product={selected} onClose={() => setSelectedId(null)} onAdd={addToCart} ingredients={ingredients} onUpdateProduct={onUpdateProduct} formatCurrency={formatCurrency} settings={settings} />}
    </>
  );
};

export default HomePage;
