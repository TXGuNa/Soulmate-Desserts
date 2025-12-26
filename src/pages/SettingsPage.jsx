import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../context/TranslationContext";
import { Star, Edit2, Trash2 } from "lucide-react";

const SettingsPage = ({
  onNavigate,
  settings,
  setSettings,
}) => {
  const { user, isAdmin } = useAuth();

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin && (activeTab === "currencies" || activeTab === "store")) {
      setActiveTab("general");
    }
  }, [isAdmin, activeTab]);
  const [currencyForm, setCurrencyForm] = useState({
    code: "",
    name: "",
    symbol: "",
    rate: 1,
  });
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [shippingInput, setShippingInput] = useState("");

  /* 
   * CURRENCY LOGIC EXPLAINED:
   * Storage Base (Reference): The currency with rate === 1 in the database (e.g., USD). All other rates are "Units per 1 Base".
   * Visual Base (Default): The currency the user has selected as their main view (e.g., TMT).
   * 
   * Problem: Users want to see rates relative to their Visual Base. 
   * Example: Base=USD(1), TMT(3.5). Result: 1 USD = 3.5 TMT.
   * If Visual Base is TMT, user wants to see "1 USD = 3.5 TMT".
   * Math: DisplayValue = VisualBaseRate / RowCurrencyRate.
   * Input Math: NewRowRate = VisualBaseRate / InputValue.
   */

  /* 
   * CURRENCY LOGIC EXPLAINED:
   */

  // Ensure settings and currencies exist to prevent crashes
  const safeCurrencies = settings?.currencies || [];
  const safeStore = settings?.store || {};

  const storageBase = useMemo(() => {
    return safeCurrencies.find((c) => c.rate === 1) || { code: "USD", rate: 1 };
  }, [safeCurrencies]);

  const visualBase = useMemo(() => {
    return safeCurrencies.find((c) => c.code === settings?.currency) || storageBase;
  }, [safeCurrencies, settings?.currency, storageBase]);

  // Base currency switching removed; keep data as-is

  // Update shipping input when settings or currency changes
  useEffect(() => {
    const rate = visualBase.rate || 1;
    const val = safeStore.shipping || 0;
    setShippingInput((val * rate).toFixed(2));
  }, [safeStore.shipping, settings?.currency, visualBase.rate]);

  const languages = [
    { code: "en", name: "English" },
    { code: "ru", name: "Russian" },
    { code: "tr", name: "Turkish" },
    { code: "tk", name: "Turkmen" },
  ];

  const handleLanguageChange = async (langCode) => {
    setLoading(true);
    setError(null);
    const newSettings = { ...settings, language: langCode };
    setSettings(newSettings);
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      setError(t("failedToSaveLanguage"));
      console.error("Failed to save language:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = async (currencyCode) => {
    setLoading(true);
    setError(null);

    const selectedCurrency = settings.currencies.find(
      (c) => c.code === currencyCode
    );

    if (!selectedCurrency) {
      setError(t("failedToSaveDefaultCurrency"));
      setLoading(false);
      return;
    }

    // Do not rebase. Just change the preferred display currency.
    // The rates should always be relative to the immutable base (e.g. USD).
    const newSettings = {
      ...settings,
      currency: currencyCode,
    };

    setSettings(newSettings);
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      setError(t("failedToSaveDefaultCurrency"));
      console.error("Failed to save default currency:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCurrency = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    let newSettings;
    if (editingCurrency) {
      // Update rate calculation
      // Input was: 1 Cur = X VisualBase.
      // Stored needs: Units per USD.
      // Math: StoredRate = VisualBaseRate / InputValue
      
      const inputVal = parseFloat(currencyForm.rate) || 0;
      // Prevent division by zero or negative
      const validRate = inputVal > 0 ? inputVal : 1;
      
      const finalStoredRate = parseFloat((visualBase.rate / validRate).toFixed(6));

      newSettings = {
        ...settings,
        currencies: settings.currencies.map((c) =>
          c.code === editingCurrency.code
            ? {
                ...currencyForm,
                code: currencyForm.code.toUpperCase(),
                rate: finalStoredRate,
              }
            : c
        ),
      };
    } else {
      const inputVal = parseFloat(currencyForm.rate) || 0;
      const validRate = inputVal > 0 ? inputVal : 1;
      const finalStoredRate = parseFloat((visualBase.rate / validRate).toFixed(6));

      newSettings = {
        ...settings,
        currencies: [
          ...settings.currencies,
          { ...currencyForm, code: currencyForm.code.toUpperCase(), rate: finalStoredRate },
        ],
      };
    }

    setSettings(newSettings);
    setEditingCurrency(null);
    setCurrencyForm({ code: "", name: "", symbol: "", rate: 1 });

    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      setError(t("failedToSaveChanges"));
      console.error("Failed to save currency changes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCurrency = (currency) => {
    setEditingCurrency(currency);
    // When editing, show the rate relative to Visual Base
    // Display = VisualBaseRate / CurrencyRate
    const displayRate = currency.rate !== 0 ? parseFloat((visualBase.rate / currency.rate).toFixed(6)) : 0;
    setCurrencyForm({ ...currency, rate: displayRate });
  };

  const handleDeleteCurrency = async (code) => {
    setLoading(true);
    setError(null);
    const baseCurrencyObj = settings.currencies.find((c) => c.rate === 1);
    if (code === baseCurrencyObj.code) {
      setError(t("cannotDeleteBase"));
      setLoading(false);
      return;
    }
    if (settings.currency === code) {
      setError(t("cannotDeleteActive"));
      setLoading(false);
      return;
    }

    const newSettings = {
      ...settings,
      currencies: settings.currencies.filter((c) => c.code !== code),
    };

    setSettings(newSettings);

    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      setError(t("failedToDeleteCurrency"));
      console.error("Failed to delete currency:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExchangeRate = async (code, newRate) => {
    setLoading(true);
    setError(null);
    const newSettings = {
      ...settings,
      currencies: settings.currencies.map((c) =>
        c.code === code ? { ...c, rate: parseFloat(newRate) || 1 } : c
      ),
    };

    setSettings(newSettings);

    // Debouncing could be good here, but for now direct update
    try {
      await api.updateSettings(newSettings);
    } catch (err) {
      setError(t("failedToUpdateExchangeRate"));
      console.error("Failed to update exchange rate:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentCurrency = visualBase;

  return (
    <div className="page" style={{ maxWidth: "1200px" }}>
      <div className="page-header">
        <h1>{t("settings")}</h1>
        <p
          style={{
            color: "var(--chocolate)",
            opacity: 0.7,
            marginTop: "0.5rem",
          }}
        >
          Manage your language and currency preferences
        </p>
      </div>

      <div className="tabs" style={{ marginBottom: "2rem" }}>
        <button
          className={`tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          {t("general")}
        </button>
        {isAdmin && (
          <button
            className={`tab ${activeTab === "currencies" ? "active" : ""}`}
            onClick={() => setActiveTab("currencies")}
          >
            {t("currencies")}
          </button>
        )}
        {isAdmin && (
          <button
            className={`tab ${activeTab === "store" ? "active" : ""}`}
            onClick={() => setActiveTab("store")}
          >
            {t("storeSettings")}
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          style={{
            color: "var(--terracotta)",
            marginBottom: "1rem",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {activeTab === "general" && (
        <div className="form-card">
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              marginBottom: "1.5rem",
            }}
          >
            {t("languageSettings")}
          </h3>
          <div className="form-group">
            <label htmlFor="language-select">{t("selectLanguage")}</label>
            <select
              id="language-select"
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px solid var(--blush)",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {activeTab === "currencies" && isAdmin && (
        <>
          <div className="form-card" style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {editingCurrency ? t("editCurrency") : t("addNewCurrency")}
            </h3>
            <form onSubmit={handleAddCurrency}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t("currencyCode")} *</label>
                  <input
                    type="text"
                    value={currencyForm.code}
                    onChange={(e) =>
                      setCurrencyForm({
                        ...currencyForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="EUR, GBP, JPY, etc."
                    maxLength="3"
                    required
                    disabled={editingCurrency && editingCurrency.rate === 1}
                  />
                </div>
                <div className="form-group">
                  <label>{t("currencyName")} *</label>
                  <input
                    type="text"
                    value={currencyForm.name}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, name: e.target.value })
                    }
                    placeholder="Euro, British Pound, etc."
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t("symbol")}</label>
                  <input
                    type="text"
                    value={currencyForm.symbol}
                    onChange={(e) =>
                      setCurrencyForm({
                        ...currencyForm,
                        symbol: e.target.value,
                      })
                    }
                    placeholder="€, £, ¥ (optional)"
                  />
                  <small
                    style={{
                      color: "var(--chocolate)",
                      opacity: 0.7,
                      display: "block",
                      marginTop: "0.25rem",
                    }}
                  >
                    {t("symbolOptionalNote") ||
                      "Leave blank to use currency code as symbol"}
                  </small>
                </div>
                <div className="form-group">
                  <label>
                    {t("exchangeRate")}{" "}
                    {`(1 ${currencyForm.code || '???'} = ? ${visualBase.code})`}{" "}
                    *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={currencyForm.rate}
                    onChange={(e) =>
                      setCurrencyForm({
                        ...currencyForm,
                        rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="1.0"
                    min="0.0001"
                    required
                  />
                  <small
                    style={{
                      color: "var(--chocolate)",
                      opacity: 0.7,
                      display: "block",
                      marginTop: "0.25rem",
                    }}
                  >
                    1 {currencyForm.code || "XXX"} = {currencyForm.rate} {visualBase.code}
                  </small>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary">
                  {editingCurrency
                    ? t("updateCurrency")
                    : t("confirmAddCurrency")}
                </button>
                {editingCurrency && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingCurrency(null);
                      setCurrencyForm({
                        code: "",
                        name: "",
                        symbol: "",
                        rate: 1,
                      });
                    }}
                  >
                    {t("cancel")}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="form-card">
            <h3
              style={{
                fontFamily: "'Playfair Display',serif",
                marginBottom: "1.5rem",
              }}
            >
              {t("manageCurrencies")}
            </h3>
            {settings.currencies.length === 0 ? (
              <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
                {t("noCurrenciesAdded")}
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}>{t("defaultCurrency")}</th>
                      <th>{t("currencyCode")}</th>
                      <th>{t("currencyName")}</th>
                      <th>{t("symbol")}</th>
                      <th>{t("exchangeRate")}</th>
                      <th style={{ textAlign: "center" }}>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.currencies.map((curr) => (
                      <tr key={curr.code}>
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => handleCurrencyChange(curr.code)}
                            title={t("setDefault")}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                            disabled={loading}
                          >
                            <Star
                              size={20}
                              fill={
                                settings.currency === curr.code
                                  ? "#d4af37"
                                  : "none"
                              }
                              color={
                                settings.currency === curr.code
                                  ? "#d4af37"
                                  : "#ccc"
                              }
                            />
                          </button>
                        </td>
                        <td>
                          <strong>{curr.code}</strong>
                        </td>
                        <td>{curr.name}</td>
                        <td>{curr.symbol}</td>
                        <td>
                          {/* Rate Display: 1 Curr = ? Visual Base */}
                          {/* Math: VisualRate / CurrRate */}
                          {curr.code === visualBase.code ? (
                              <span>1 ({t("default")})</span>
                          ) : (
                            <input
                              type="number"
                              step="0.0001"
                              value={
                                curr.rate !== 0
                                  ? parseFloat((visualBase.rate / curr.rate).toFixed(6))
                                  : 0
                              }
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                if (val > 0) {
                                  // NewStored = VisualRate / NewVal
                                  const newStored = parseFloat((visualBase.rate / val).toFixed(6));
                                  handleUpdateExchangeRate(curr.code, newStored);
                                }
                              }}
                              style={{
                                width: "120px",
                                padding: "0.5rem",
                                border: "2px solid var(--blush)",
                                borderRadius: "8px",
                                background: "rgba(255,255,255,0.8)",
                              }}
                              disabled={loading}
                            />
                          )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {curr.code !== storageBase.code && (
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                className="btn btn-small btn-secondary icon-btn"
                                onClick={() => handleEditCurrency(curr)}
                                title={t("edit")}
                                style={{
                                  padding: "0.5rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                disabled={loading}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="btn btn-small btn-danger icon-btn"
                                onClick={() => handleDeleteCurrency(curr.code)}
                                title={t("delete")}
                                style={{
                                  padding: "0.5rem",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                disabled={loading}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === "store" && isAdmin && (
        <div className="form-card">
          <h3
            style={{
              fontFamily: "'Playfair Display',serif",
              marginBottom: "1.5rem",
            }}
          >
            {t("storeSettings")}
          </h3>
          <div className="form-group">
            <label>
              {t("shippingCost")} (
              {currentCurrency.symbol || currentCurrency.code})
            </label>
            <input
              type="number"
              value={shippingInput}
              onChange={(e) => setShippingInput(e.target.value)}
              onBlur={() => {
                const val = parseFloat(shippingInput);
                if (!isNaN(val)) {
                  // Shipping is stored in Base USD
                  // Input is in Visual Base
                  // Base = Input / VisualRate
                  // (Wait, Visual Base Rate is TMT/USD)
                  // So 10 USD * 3.5 = 35 TMT.
                  // Input 35. Stored should be 10.
                  // Stored = Input / VisualRate
                  const baseVal = val / visualBase.rate;
                  
                  setSettings((prev) => ({
                    ...prev,
                    store: { ...prev.store, shipping: baseVal },
                  }));
                  // Optional: re-format on blur to look nice
                  setShippingInput(val.toFixed(2));
                } else {
                  setSettings((prev) => ({
                    ...prev,
                    store: { ...prev.store, shipping: 0 },
                  }));
                  setShippingInput("0.00");
                }
              }}
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px solid var(--blush)",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.8)",
              }}
            />
          </div>
          <div className="form-group">
            <label>{t("taxRate")}</label>
            <input
              type="number"
              value={settings.store?.taxRate || 0}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  store: {
                    ...prev.store,
                    taxRate: parseFloat(e.target.value) || 0,
                  },
                }))
              }
              style={{
                width: "100%",
                padding: "1rem",
                border: "2px solid var(--blush)",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.8)",
              }}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
            onClick={async () => {
              try {
                await api.updateSettings(settings);
                console.log(t("success"));
              } catch (err) {
                console.error(err);
                console.log(t("error"));
              }
            }}
          >
            {t("saveChanges")}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
