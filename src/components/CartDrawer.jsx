import React from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../context/TranslationContext';
import { X, ArrowLeft } from 'lucide-react';

const CartDrawer = ({ onNavigate, formatCurrency, settings }) => {
  const { cart: items, isOpen, setIsOpen, updateQuantity, removeFromCart: removeItem, cartTotal: subtotal } = useCart();
  const { t } = useTranslation();
  const formatPrice = formatCurrency || ((amount) => `USD ${Number(amount).toFixed(2)}`);
  
  
  const currentCurrency = settings?.currencies?.find(c => c.code === settings?.currency);
  const rate = currentCurrency?.rate || 1;

  const shippingBase = settings?.store?.shipping || 0;
  const shipping = shippingBase * rate; // Apply conversion
  
  const taxRate = settings?.store?.taxRate || 0;
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + shipping + tax;

  const handleProductClick = () => {
    setIsOpen(false);
    onNavigate('catalog');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-header-title-group">
            <button className="cart-back-btn" onClick={() => setIsOpen(false)}>
              <ArrowLeft size={24} />
            </button>
            <h3>{t('yourCart')}</h3>
          </div>
          <button className="cart-close" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? <div className="cart-empty"><div className="cart-empty-icon">🛒</div><p>{t('cartEmpty')}</p></div> : items.map(i => (
            <div key={i.id} className="cart-item">
              <div className="cart-item-img" onClick={handleProductClick} style={{cursor: 'pointer'}}><img src={i.images[0]} alt={i.name} /></div>
              <div className="cart-item-details">
                <div className="cart-item-name" onClick={handleProductClick} style={{cursor: 'pointer'}}>{i.name}</div>
                <div className="cart-item-price">{formatPrice(i.price * i.quantity)}</div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(i.id, -1)}>−</button>
                  <span>{i.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(i.id, 1)}>+</button>
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(i.id)}>{t('remove')}</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal"><span>{t('subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div>
            {shipping > 0 && <div className="cart-subtotal" style={{fontSize: '0.9em', opacity: 0.8}}><span>{t('shipping')}</span><strong>{formatPrice(shipping)}</strong></div>}
            {tax > 0 && <div className="cart-subtotal" style={{fontSize: '0.9em', opacity: 0.8}}><span>{t('tax')} ({taxRate}%)</span><strong>{formatPrice(tax)}</strong></div>}
            <div className="cart-total" style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em'}}><span>{t('total')}</span><strong>{formatPrice(total)}</strong></div>
            <button className="checkout-btn" onClick={() => { setIsOpen(false); onNavigate('checkout'); }}>{t('proceedToCheckout')}</button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
