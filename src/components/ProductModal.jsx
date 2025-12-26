import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import { calculateCostPrice } from '../utils/helpers';
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const ProductModal = ({
  product,
  onClose,
  onAdd,
  ingredients,
  onUpdateProduct,
  formatCurrency,
  settings,
}) => {
  const { t } = useTranslation();
  const [qty, setQty] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightbox, setIsLightbox] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (isLightbox) {
          setIsLightbox(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose, isLightbox]);

  if (!product) return null;
  const price = product.price;

  const images =
    product.images && Array.isArray(product.images)
      ? product.images
      : [product.images[0]];
  const totalImages = images.length;

  return (
    <>
      <div
        className={`modal-overlay ${product ? "open" : ""}`}
        onClick={onClose}
      >
        <div
          className="modal modal-product"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            ×
          </button>

          {/* Image Card - Compact, Fixed Resolution */}
          <div className="modal-image-card">
            <div
              className="modal-image-display"
              onClick={() => setIsLightbox(true)}
            >
              <img src={images[currentImageIndex]} alt={product.name} />
              <button
                className="modal-image-zoom-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightbox(true);
                }}
              >
                <ZoomIn size={24} />
              </button>
            </div>

            {/* Arrow Navigation */}
            {totalImages > 1 && (
              <>
                <button
                  className="modal-image-nav-btn modal-image-nav-prev"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? totalImages - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  className="modal-image-nav-btn modal-image-nav-next"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === totalImages - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {totalImages > 1 && (
              <div className="modal-image-counter-compact">
                {currentImageIndex + 1} / {totalImages}
              </div>
            )}
          </div>

          {/* Content - All Details */}
          <div className="modal-content modal-content-full">
            <h2 className="modal-title" title={product.name}>
              {product.name}
            </h2>

            {product.tags?.[0] && (
              <div style={{ marginBottom: "0.75rem" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "12px",
                    background: "var(--blush)",
                    border: "1px solid var(--terracotta)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--chocolate)",
                  }}
                >
                  {product.tags[0]}
                </span>
              </div>
            )}

            <p className="modal-desc" style={{ whiteSpace: "pre-wrap" }}>
              {product.description}
            </p>

            <div className="modal-total-amount">
              {formatCurrency(price * qty)}
            </div>

            <div className="modal-qty">
              <label>{t("quantity")}</label>
              <div className="modal-qty-controls">
                <button
                  className="modal-qty-btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                >
                  −
                </button>
                <div className="modal-qty-value">{qty}</div>
                <button
                  className="modal-qty-btn"
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {product.ingredients?.length > 0 && (
              <div className="modal-ingredients-section">
                <div className="modal-ingredients-title">
                  {t("ingredients")}
                </div>
                <ul
                  className="modal-ingredients-list"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                    gap: "0.25rem 0.75rem",
                  }}
                >
                  {product.ingredients.map((pi, idx) => {
                    const ing = ingredients?.find((i) => i.id === pi.id);
                    if (!ing) return null;
                    return (
                      <li
                        key={`${pi.id}-${idx}`}
                        style={{
                          color: "var(--espresso)",
                          opacity: 0.85,
                          fontSize: "0.9rem",
                        }}
                      >
                        {ing.name}{" "}
                        {pi.quantity ? `— ${pi.quantity} ${ing.unit}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
              <button
                className="modal-add-btn"
                onClick={() => {
                  onAdd(product, qty);
                  onClose();
                  setQty(1);
                }}
              >
                {t("addToCart")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for Full Image View */}
      {isLightbox && (
        <div
          className="modal-lightbox-overlay"
          onClick={() => setIsLightbox(false)}
        >
          <div className="modal-lightbox" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-lightbox-close"
              onClick={() => setIsLightbox(false)}
            >
              ×
            </button>
            <img src={images[currentImageIndex]} alt={product.name} />
            {totalImages > 1 && (
              <>
                <button
                  className="modal-lightbox-nav modal-lightbox-prev"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? totalImages - 1 : prev - 1
                    )
                  }
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className="modal-lightbox-nav modal-lightbox-next"
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === totalImages - 1 ? 0 : prev + 1
                    )
                  }
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;
