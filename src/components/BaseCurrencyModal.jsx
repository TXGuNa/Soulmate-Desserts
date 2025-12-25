import React from 'react';

const BaseCurrencyModal = ({
  isOpen,
  onClose,
  onConfirm,
  newBaseCurrency,
  loading,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Base Currency</h2>
        {newBaseCurrency && (
          <p>
            You are about to change the base currency to{' '}
            <strong>{newBaseCurrency.name} ({newBaseCurrency.code})</strong>. This will convert and update the prices of
            all products and ingredients in the database to reflect the new base currency. This action cannot be
            undone.
          </p>
        )}
        <div className="modal-actions">
          <button
            className="btn btn-primary"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Confirm Change'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaseCurrencyModal;
