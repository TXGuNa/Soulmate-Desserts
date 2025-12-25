import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { calculateCostPrice } from '../utils/helpers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductModal = ({ product, onClose, onAdd, ingredients, onUpdateProduct, formatCurrency, settings }) => {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  if (!product) return null;
  const price = product.price;
  const baseCurrency = settings?.currencies?.find(c => c.rate === 1) || { code:'USD', symbol:'$', rate:1 };
  const currentCurrency = settings?.currencies?.find(c => c.code === settings?.currency) || baseCurrency;
  const rate = currentCurrency?.rate || 1;
  const symbol = (currentCurrency?.symbol && currentCurrency.symbol.trim()) ? currentCurrency.symbol : (currentCurrency?.code || 'USD');
  const formatPriceWithCode = (amount) => `${symbol} ${(amount * rate).toFixed(2)}`;
  const images = product.images && Array.isArray(product.images) ? product.images : [product.images[0]];
  const totalImages = images.length;

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleImageThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };
  
  return (
    <div className={`modal-overlay ${product ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-img">
          <div className="modal-image-container">
            <img src={images[currentImageIndex]} alt={product.name} />
            {totalImages > 1 && (
              <>
                <button className="modal-nav-btn modal-nav-prev" onClick={goToPrevImage}>
                  <ChevronLeft size={24} />
                </button>
                <button className="modal-nav-btn modal-nav-next" onClick={goToNextImage}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          {totalImages > 1 && (
            <div className="modal-image-thumbnails">
              {images.map((img, index) => (
                <div 
                  key={index} 
                  className={`modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleImageThumbnailClick(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
          {totalImages > 1 && (
            <div className="modal-image-counter">
              {currentImageIndex + 1} / {totalImages}
            </div>
          )}
        </div>
        <div className="modal-content">
          <h2 className="modal-title" title={product.name}>{product.name}</h2>
          {product.tags?.[0] && (
            <div style={{marginBottom:'0.75rem'}}>
              <span style={{display:'inline-block',padding:'0.25rem 0.6rem',borderRadius:'12px',background:'var(--blush)',border:'1px solid var(--terracotta)',fontSize:'0.85rem',fontWeight:600,color:'var(--chocolate)'}}>
                {product.tags[0]}
              </span>
            </div>
          )}
          <p className="modal-desc" style={{whiteSpace:'pre-wrap'}}>{product.description}</p>
          <div className="modal-price">{formatPriceWithCode(product.price)}</div>

          <div className="modal-qty">
            <label>{t('quantity')}</label>
            <div className="modal-qty-controls">
              <button className="modal-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <div className="modal-qty-value">{qty}</div>
              <button className="modal-qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          {product.ingredients?.length > 0 && (
            <div style={{marginBottom:'1rem'}}>
              <div style={{fontWeight:600,color:'var(--chocolate)',marginBottom:'0.5rem'}}>{t('ingredients')}</div>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'0.25rem 1rem'}}>
                {product.ingredients.map((pi, idx) => {
                  const ing = ingredients?.find(i => i.id === pi.id);
                  if (!ing) return null;
                  return (
                    <li key={`${pi.id}-${idx}`} style={{color:'var(--espresso)',opacity:0.85}}>
                      {ing.name} {pi.quantity ? `— ${pi.quantity} ${ing.unit}` : ''}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <button className="modal-add-btn" onClick={() => { onAdd(product, qty); onClose(); setQty(1); }}>{t('addToCart')} - {formatPriceWithCode(price * qty)}</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
