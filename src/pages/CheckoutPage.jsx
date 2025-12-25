import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';

const CheckoutPage = ({ onNavigate, onCreateOrder, formatCurrency, settings }) => {
  const { cart: items, cartTotal: subtotal, clearCart } = useCart(); // Refactored: items=cart, subtotal=cartTotal
  const { user } = useAuth();
  const { t } = useTranslation();
  const [done, setDone] = useState(false);
  
  const taxRate = settings?.store?.taxRate || 0;
  const tax = subtotal * (taxRate / 100);

  const currentCurrency = settings?.currencies?.find(c => c.code === settings?.currency);
  const rate = currentCurrency?.rate || 1;
  const shippingBase = settings?.store?.shipping || 0;
  const shipping = shippingBase * rate; // Apply conversion

  const total = subtotal + tax + shipping;
  const formatPrice = formatCurrency || ((amount) => `USD ${Number(amount).toFixed(2)}`);

  if (done) return <div className="page"><div className="success-msg"><div className="success-icon">🎉</div><h2>{t('orderPlaced')}</h2><p>{t('orderPlacedMessage')}</p><button className="btn btn-primary" onClick={() => onNavigate('home')}>{t('continueShopping')}</button></div></div>;
  if (items.length === 0) return <div className="page"><div className="success-msg"><div className="success-icon">🛒</div><h2>{t('cartEmpty')}</h2><p>Add desserts first!</p><button className="btn btn-primary" onClick={() => onNavigate('catalog')}>Browse</button></div></div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
      customerName: formData.get('firstName') + ' ' + formData.get('lastName'),
      email: formData.get('email') || user?.email || '',
      phone: formData.get('phone'),
      address: formData.get('address'),
      date: formData.get('date'),
      time: formData.get('time'),
      notes: formData.get('notes'),
      items: items,
      subtotal: subtotal,
      tax: tax,
      total: total
    };
    if (onCreateOrder) {
      onCreateOrder(orderData);
    }
    setDone(true);
    clearCart();
  };

  return (
    <div className="page" style={{maxWidth:'1100px'}}>
      <div className="page-header"><h1>{t('checkout')}</h1></div>
      <div className="checkout-grid">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-section"><h3>{t('contactInfo')}</h3>
            <div className="form-row"><div className="form-group"><label>{t('firstName')} *</label><input type="text" name="firstName" defaultValue={user?.name?.split(' ')[0]} required /></div><div className="form-group"><label>{t('lastName')} *</label><input type="text" name="lastName" defaultValue={user?.name?.split(' ')[1]} required /></div></div>
            <div className="form-row"><div className="form-group"><label>{t('email')}</label><input type="email" name="email" defaultValue={user?.email} /></div><div className="form-group"><label>{t('phone')} *</label><input type="tel" name="phone" required /></div></div>
          </div>
          <div className="form-section"><h3>{t('delivery')}</h3>
            <div className="form-group full"><label>{t('address')} *</label><input type="text" name="address" required /></div>
            <div className="form-row"><div className="form-group"><label>{t('date')} *</label><input type="date" name="date" required /></div><div className="form-group"><label>{t('time')}</label><select name="time"><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div></div>
          </div>
          <div className="form-section"><h3>{t('notes')}</h3><div className="form-group full"><label>{t('specialInstructions')}</label><textarea name="notes" placeholder="Any requests..." /></div></div>
          <button type="submit" className="form-submit">{t('placeOrder')} — {formatPrice(total)}</button>
        </form>
        <div className="checkout-summary">
          <h3>{t('orderSummary')}</h3>
          {items.map(i => <div key={i.id} className="summary-item"><div className="summary-item-img"><img src={i.images[0]} alt="" /></div><div className="summary-item-details"><div className="summary-item-name">{i.name}</div><div className="summary-item-qty">{t('quantity')}: {i.quantity}</div></div><div className="summary-item-price">{formatPrice(i.price * i.quantity)}</div></div>)}
          <div className="summary-totals">
            <div className="summary-row">
              <span>{t('subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {tax > 0 && (
              <div className="summary-row">
                <span>{t('tax')}</span>
                <span>{formatPrice(tax)}</span>
              </div>
            )}
            {shipping > 0 && (
              <div className="summary-row">
                <span>{t('shipping')}</span>
                <span>{formatPrice(shipping)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>{t('total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
