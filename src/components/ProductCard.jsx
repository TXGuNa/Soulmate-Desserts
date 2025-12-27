import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { calculateCostPrice } from '../utils/helpers';

const ProductCard = ({ product, onClick, onAdd, ingredients, formatCurrency }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const price = product.price;
  const costPrice = calculateCostPrice(product, ingredients);
  const profit = price - costPrice;
  const profitMargin = costPrice ? ((profit / price) * 100).toFixed(1) : 0;
  const formatPrice = formatCurrency || ((amount) => `USD ${Number(amount).toFixed(2)}`);
  
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        <img src={product.images[0]} alt={product.name} />
        {product.tags?.[0] && <span className={`product-tag tag-${product.tags[0]}`}>{t(`badges.${product.tags[0]}`) || product.tags[0]}</span>}
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        {isAdmin && (
          <div style={{padding:'0.75rem',background:'var(--blush)',borderRadius:'10px',marginBottom:'1rem',fontSize:'0.85rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}><span style={{opacity:0.7}}>{t('cost')}:</span><strong>{formatPrice(costPrice)}</strong></div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.25rem'}}><span style={{opacity:0.7}}>{t('profit')}:</span><strong style={{color:'#28a745'}}>{formatPrice(profit)}</strong></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{opacity:0.7}}>{t('margin')}:</span><strong style={{color:'#28a745'}}>{profitMargin}%</strong></div>
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
