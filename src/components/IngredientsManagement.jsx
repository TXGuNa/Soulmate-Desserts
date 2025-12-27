import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { api } from '../api/client';

const IngredientsManagement = ({ ingredients, setIngredients, products, currentCurrency, formatCurrency }) => {
  const { t } = useTranslation();
  const [newIng, setNewIng] = useState({ name: '', unit: '', price: '' });
  const [editing, setEditing] = useState(null);

  // Helper to convert rate
  const rate = currentCurrency?.rate || 1;
  const symbol = (currentCurrency?.symbol && currentCurrency.symbol.trim()) ? currentCurrency.symbol : (currentCurrency?.code || '$');

  useEffect(() => {
    if (ingredients) {
      localStorage.setItem('soulmate_ingredients', JSON.stringify(ingredients));
    }
  }, [ingredients]);

  const handleSave = (e) => {
    if (e) e.preventDefault();

    // Validation
    const nameToCheck = editing ? editing.name : newIng.name;
    if (!nameToCheck || !nameToCheck.trim()) {
      console.log(t('ingredientNameRequired'));
      return;
    }
    
    // Convert current input price back to base (USD) for storage
    const getBasePrice = (inputPrice) => (parseFloat(inputPrice) || 0) / rate;

    const saveIngredient = async () => {
      try {
        if (editing) {
          const updatedIng = { ...editing, price: getBasePrice(editing.price) };
          await api.updateIngredient(editing.id, updatedIng);
          setIngredients(prev => prev.map(ing => 
            ing.id === editing.id 
              ? updatedIng 
              : ing
          ));
          setEditing(null);
        } else {
          const newId = 'ing' + Date.now();
          const newIngPayload = { id: newId, name: newIng.name, unit: newIng.unit, price: getBasePrice(newIng.price) };
          const res = await api.createIngredient(newIngPayload);
          setIngredients(prev => [...prev, res]);
          setNewIng({ name: '', unit: '', price: '' });
        }
      } catch (error) {
        console.error("Failed to save ingredient:", error);
        console.log(t('errorSavingIngredient') || "Failed to save ingredient.");
      }
    };
    saveIngredient();
  };

  const handleEdit = (ing) => {
    // Convert base price to current currency for editing
    setEditing({ ...ing, price: (ing.price * rate).toFixed(2) });
    setNewIng({ name: '', unit: '', price: '' });
  };

  const isIngredientUsed = (ingId) => {
    if (!products) return false;
    return products.some(p => p.ingredients?.some(ing => ing.id === ingId));
  };

  const getUsedInProducts = (ingId) => {
    if (!products) return [];
    return products.filter(p => p.ingredients?.some(ing => ing.id === ingId));
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const executeDelete = async () => {
    if (!confirmDeleteId) return;
    
    try {
      await api.deleteIngredient(confirmDeleteId);
      setIngredients(prev => prev.filter(ing => ing.id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Failed to delete ingredient:", err);
      // Optional: Show error toast here
    }
  };

  const getDeleteWarningMessage = (id) => {
    const usedIn = getUsedInProducts(id);
    if (usedIn.length > 0) {
      return t('ingredientUsedInProducts').replace('{count}', usedIn.length).replace('{products}', usedIn.map(p => p.name).join(', '));
    }
    return t('deleteIngredientConfirm');
  };

  return (
    <>
      <div className="form-card" style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            marginBottom: "1.5rem",
          }}
        >
          {editing ? t("editIngredient") : t("addNewIngredient")}
        </h3>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>{t("ingredientName")} *</label>
              <input
                type="text"
                value={editing?.name || newIng.name}
                onChange={(e) =>
                  editing
                    ? setEditing({ ...editing, name: e.target.value })
                    : setNewIng({ ...newIng, name: e.target.value })
                }
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity(t("fieldRequired"))
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
            <div className="form-group">
              <label>{t("unit")} *</label>
              <input
                type="text"
                value={editing?.unit || newIng.unit}
                onChange={(e) =>
                  editing
                    ? setEditing({ ...editing, unit: e.target.value })
                    : setNewIng({ ...newIng, unit: e.target.value })
                }
                placeholder="lb, oz, qt, etc."
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity(t("fieldRequired"))
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
            <div className="form-group">
              <label>
                {t("pricePerUnit")} ({symbol}) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editing?.price || newIng.price}
                onChange={(e) =>
                  editing
                    ? setEditing({ ...editing, price: e.target.value })
                    : setNewIng({ ...newIng, price: e.target.value })
                }
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity(t("fieldRequired"))
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
          </div>
          <button
            type="submit"
            className="form-submit"
            style={{ width: "auto", padding: "0.8rem 2rem", marginTop: 0 }}
          >
            {editing ? t("update") : t("add")} {t("ingredients")}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditing(null)}
              style={{ marginLeft: "0.5rem" }}
            >
              {t("cancel")}
            </button>
          )}
        </form>
      </div>

      <div className="form-card">
        <h3
          style={{
            fontFamily: "'Playfair Display',serif",
            marginBottom: "1.5rem",
          }}
        >
          {t("ingredientManagement")}
        </h3>
        {ingredients.length === 0 ? (
          <p style={{ color: "var(--chocolate)", opacity: 0.7 }}>
            {t("noIngredientsYet")}
          </p>
        ) : (
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>{t("ingredientName")}</th>
                  <th style={{ width: "15%" }}>{t("unit")}</th>
                  <th style={{ width: "20%" }}>
                    {t("pricePerUnit")} ({symbol})
                  </th>
                  <th style={{ width: "15%" }}>{t("status")}</th>
                  <th style={{ width: "15%" }}>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing) => {
                  const isUsed = isIngredientUsed(ing.id);
                  const usedIn = getUsedInProducts(ing.id);
                  const isEditing = editing?.id === ing.id;
                  return (
                    <tr key={ing.id}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editing.name}
                            onChange={(e) =>
                              setEditing({ ...editing, name: e.target.value })
                            }
                            style={{
                              padding: "0.5rem 0.75rem",
                              border: "1px solid var(--terracotta)",
                              borderRadius: "8px",
                              width: "100%",
                              background: "white",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              outline: "none",
                              color: "var(--espresso)",
                              fontSize: "0.95rem",
                            }}
                            placeholder={t("ingredientName")}
                            autoFocus
                            required
                            onInvalid={(e) =>
                              e.target.setCustomValidity(t("fieldRequired"))
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                          />
                        ) : (
                          <strong
                            style={{
                              color: "var(--espresso)",
                              fontSize: "0.95rem",
                            }}
                          >
                            {ing.name}
                          </strong>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editing.unit}
                            onChange={(e) =>
                              setEditing({ ...editing, unit: e.target.value })
                            }
                            style={{
                              padding: "0.5rem 0.75rem",
                              border: "1px solid var(--terracotta)",
                              borderRadius: "8px",
                              width: "100%",
                              background: "white",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              outline: "none",
                              color: "var(--espresso)",
                            }}
                            placeholder={t("unit")}
                            required
                            onInvalid={(e) =>
                              e.target.setCustomValidity(t("fieldRequired"))
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                          />
                        ) : (
                          <span style={{ color: "var(--chocolate)" }}>
                            {ing.unit}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editing.price}
                            onChange={(e) =>
                              setEditing({ ...editing, price: e.target.value })
                            }
                            style={{
                              padding: "0.5rem 0.75rem",
                              border: "1px solid var(--terracotta)",
                              borderRadius: "8px",
                              width: "100%",
                              background: "white",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                              outline: "none",
                              color: "var(--espresso)",
                            }}
                            placeholder="0.00"
                            onWheel={(e) => e.target.blur()}
                            required
                            onInvalid={(e) =>
                              e.target.setCustomValidity(t("fieldRequired"))
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                          />
                        ) : (
                          <span>
                            {formatCurrency ? formatCurrency(ing.price) : `${symbol} ${(ing.price * rate).toFixed(2)}`}
                          </span>
                        )}
                      </td>
                      <td>
                        {isUsed ? (
                          <span
                            className="status used"
                            title={`Used in: ${usedIn
                              .map((p) => p.name)
                              .join(", ")}`}
                          >
                            {t("used")} ({usedIn.length})
                          </span>
                        ) : (
                          <span className="status active">{t("notUsed")}</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSave()}
                                title={t("save") || "Save"}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <Check size={18} color="#28a745" />
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                title={t("cancel")}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <X size={18} color="#DC3545" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(ing)}
                                title={t("edit")}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: "4px",
                                }}
                              >
                                <Edit2 size={18} color="#5C4033" />
                              </button>
                              {!isUsed && (
                                <button
                                  onClick={() => handleDeleteClick(ing.id)}
                                  title={t("delete")}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                  }}
                                >
                                  <Trash2 size={18} color="#DC3545" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <div className={`modal-overlay ${confirmDeleteId ? 'open' : ''}`} style={{zIndex: 1000}}>
        <div className="modal" style={{
          maxWidth: '400px', 
          padding: '2.5rem', 
          textAlign: 'center', 
          height: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', // Center content horizontally
          justifyContent: 'center'
        }}>
          <h3 style={{marginBottom: '1rem', color: 'var(--espresso)', fontFamily: "'Playfair Display', serif", fontSize:'1.5rem'}}>
            {t('confirmDelete')}
          </h3>
          <p style={{marginBottom: '2rem', color: 'var(--chocolate)', opacity: 0.8}}>
            {confirmDeleteId && getDeleteWarningMessage(confirmDeleteId)}
          </p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%'}}>
             <button 
               className="btn btn-secondary"
               onClick={() => setConfirmDeleteId(null)}
               style={{flex: 1}}
             >
               {t('cancel')}
             </button>
             <button 
               className="btn btn-danger"
               onClick={executeDelete}
               style={{flex: 1}}
             >
               {t('delete')}
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default IngredientsManagement;
