import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { calculateCostPrice } from '../utils/helpers';

const ProductCard = ({ product, onClick, onAdd, ingredients, formatCurrency }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const price = parseFloat(product.price) || 0;
  const costPrice = calculateCostPrice(product, ingredients);
  const profit = price - costPrice;
  const profitMargin = (costPrice > 0 && price > 0) ? ((profit / price) * 100) : 0;
  
  const formatPrice = formatCurrency || ((amount) => `USD ${Number(amount).toFixed(2)}`);
  
  const displayValue = (val, isPercentage = false) => {
    if (isNaN(val)) return '-';
    if (isPercentage) return `${val.toFixed(1)}%`;
    return formatPrice(val);
  };
  
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        <img src={product.images[0]} alt={product.name} />
        {product.tags?.[0] && <span className={`product-tag ${product.tags[0]}`}>{t(`badges.${product.tags[0]}`) || product.tags[0]}</span>}
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        {isAdmin && (
          <div style={{padding:'0.75rem',background:'var(--blush)',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.85rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}><span style={{opacity:0.7}}>{t('cost')}:</span><strong>{displayValue(costPrice)}</strong></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}><span style={{opacity:0.7}}>{t('profit')}:</span><strong style={{color: profit >= 0 ? '#28a745' : '#dc3545'}}>{displayValue(profit)}</strong></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{opacity:0.7}}>{t('margin')}:</span><strong style={{color: profitMargin >= 0 ? '#28a745' : '#dc3545'}}>{displayValue(profitMargin, true)}</strong></div>
          </div>
        )}
        <div className="product-footer">
          <div className="product-price" style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
            <div>
              <span style={{fontSize:'1.4rem',fontWeight:600,color:'var(--terracotta)'}}>{formatPrice(price)}</span>
            </div>
          </div>
          <button className="add-btn" onClick={e => { e.stopPropagation(); onAdd(product); }}>+</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
