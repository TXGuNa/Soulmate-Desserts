import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { useCart } from '../context/CartContext';
import { Search, X, ShoppingBag } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, products, formatCurrency }) => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  
  const formatPrice = formatCurrency || ((amount) => `USD ${Number(amount).toFixed(2)}`);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProducts = query.trim() === '' 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  const handleAddToCart = (product) => {
    addToCart(product);
    onClose();
  };

  return (
    <div className="modal-overlay open" style={{zIndex: 1000, background: 'rgba(44, 24, 16, 0.8)'}} onClick={onClose}>
      <div 
        className="form-card" 
        style={{
          width: '600px', 
          maxWidth: '90%', 
          padding: '2rem', 
          position: 'relative',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }} 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={24} color="var(--espresso)" />
        </button>

        <h3 style={{fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
          <Search size={24} color="var(--terracotta)" />
          {t('searchProducts') || 'Search Products'}
        </h3>

        <div style={{position: 'relative', marginBottom: '1.5rem'}}>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder') || 'Type to find cakes, cupcakes...'}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              borderRadius: '50px',
              border: '2px solid var(--terracotta)',
              fontSize: '1.1rem',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(212, 133, 106, 0.15)'
            }}
          />
          <Search size={20} color="var(--terracotta)" style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)'}} />
        </div>

        <div style={{height: '400px', overflowY: 'auto', paddingRight: '0.5rem'}}>
          {query.trim() === '' ? (
            <div style={{textAlign: 'center', padding: '3rem', color: 'var(--chocolate)', opacity: 0.7}}>
              <Search size={48} style={{opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto 1rem'}} />
              <p>{t('startTyping') || 'Start typing to see results...'}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: 'var(--chocolate)', opacity: 0.7}}>
              <p>{t('noResults') || 'No products found.'}</p>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '1rem'}}>
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--blush)',
                    borderRadius: '16px',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  className="search-result-item"
                  onClick={() => handleAddToCart(product)}
                >
                  <div style={{
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    marginRight: '1rem',
                    background: 'white'
                  }}>
                    {product.thumbnail || product.image || (product.images && product.images[0]) ? (
                      <img src={product.thumbnail || product.image || (product.images && product.images[0])} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'}}>🍰</div>
                    )}
                  </div>
                  <div style={{flex: 1}}>
                    <h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: 'var(--espresso)', marginBottom: '0.25rem'}}>{product.name}</h4>
                    <span style={{color: 'var(--terracotta)', fontWeight: 600}}>
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button 
                    style={{
                      background: 'white',
                      border: 'none',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--terracotta)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
