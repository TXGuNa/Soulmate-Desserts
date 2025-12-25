import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/TranslationContext';
import LoginModal from './LoginModal';
import SearchModal from './SearchModal';
import { Search, Settings, ShoppingCart, LogOut, Menu, X } from 'lucide-react';

const Header = ({ onNavigate, products, formatCurrency }) => {
  const { itemCount, setIsOpen } = useCart();
  const { user, logout, isAdmin, isDealer } = useAuth();
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="logo" onClick={() => handleNavigate("home")}>
            <img src="/logo2.png" alt="Soulmate Desserts Characters" />
            <img src="/Soulmate.png" alt="Soulmate Desserts" />
          </div>

          <nav
            className={`nav ${mobileMenuOpen ? "mobile-open" : ""}`}
            aria-label="Mobile menu"
          >
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button
                className="close-menu-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <span className="nav-link" onClick={() => handleNavigate("home")}>
              {t("home")}
            </span>
            <span
              className="nav-link"
              onClick={() => handleNavigate("catalog")}
            >
              {t("ourCakes")}
            </span>
            <span
              className="nav-link"
              onClick={() => handleNavigate("contact")}
            >
              {t("contact")}
            </span>
            {isAdmin && (
              <span
                className="nav-link admin-link"
                onClick={() => handleNavigate("admin")}
              >
                {t("admin")}
              </span>
            )}

            <div className="mobile-nav-actions">
              {user ? (
                <span
                  className="nav-link"
                  onClick={() => {
                    logout();
                    onNavigate("home");
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut
                    size={18}
                    style={{ marginRight: "8px", verticalAlign: "text-bottom" }}
                  />
                  {t("logout")}
                </span>
              ) : (
                <span
                  className="nav-link"
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  {t("login")}
                </span>
              )}
            </div>
          </nav>

          <div className="nav-actions">
            {user ? (
              <div className="user-info">
                {t("hi")}, <strong>{user.name?.split(" ")[0]}</strong>
                {isAdmin && user.name?.toLowerCase() !== "admin" && (
                  <span className="badge admin">{t("admin")}</span>
                )}
                {isDealer && !isAdmin && (
                  <span className="badge dealer">{t("dealer")}</span>
                )}
              </div>
            ) : (
              <button
                className="btn btn-primary btn-small desktop-only"
                onClick={() => setShowLogin(true)}
              >
                {t("login")}
              </button>
            )}

            <div className="icon-btn-group">
              {user && (
                <button
                  className="cart-btn"
                  onClick={() => {
                    logout();
                    onNavigate("home");
                  }}
                  title={t("logout")}
                >
                  <LogOut size={20} />
                </button>
              )}

              <button
                className="cart-btn"
                onClick={() => setShowSearch(true)}
                title={t("search") || "Search"}
              >
                <Search size={20} />
              </button>

              <button
                className="cart-btn"
                onClick={() => onNavigate("settings")}
                title={t("settings")}
              >
                <Settings size={20} />
              </button>

              <button className="cart-btn" onClick={() => setIsOpen(true)}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </button>

              <button
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onNavigate={onNavigate}
      />
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        products={products || []}
        formatCurrency={formatCurrency}
      />
    </>
  );
};

export default Header;
