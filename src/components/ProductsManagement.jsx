import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';
import { calculateCostPrice } from '../utils/helpers';
import { api } from '../api/client';
import { X, Trash2, Globe } from 'lucide-react';

const createThumbnail = (base64Image, maxWidth = 100) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Image;
    img.onload = () => {
      const ratio = maxWidth / img.width;
      const width = maxWidth;
      const height = img.height * ratio;
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const ProductsManagement = ({ products, setProducts, ingredients, formatCurrency, currentCurrency }) => {
  const { t } = useTranslation();
  // Use passed formatCurrency or fallback
  const formatPrice = formatCurrency || ((amount) => `${currentCurrency?.code || 'USD'} ${Number(amount).toFixed(2)}`);
  const [editing, setEditing] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchError, setSearchError] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countryContacts, setCountryContacts] = useState([]);

  // Load country contacts for region selection
  useEffect(() => {
    const loadCountryContacts = async () => {
      try {
        const contacts = await api.getCountryContacts();
        setCountryContacts(contacts);
      } catch (err) {
        console.error('Failed to load country contacts:', err);
      }
    };
    loadCountryContacts();
  }, []);

  const handleCreateNew = (initialName) => {
    const finalName = (initialName || '').trim();
    setEditing('new');
    setForm({ name: finalName, description: '', price: '', making_price: '', profit: '', profit_margin: '', images: [], uploadedImages: [], ingredients: [], tag: 'none', languages: ['en', 'ru', 'tr', 'tk'], regions: [], faceImageIndex: 0 });
    setSearchError('');
    setSearchName('');
  };
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await api.deleteProduct(confirmDeleteId);
      setProducts(prev => prev.filter(p => p.id !== confirmDeleteId));
      if (editing && editing !== 'new' && editing === confirmDeleteId) {
        setEditing(null);
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
      console.log(t('error') || 'Error');
    } finally {
      setConfirmDeleteId(null);
    }
  };
  const [form, setForm] = useState({ name: '', description: '', price: '', making_price: '', profit: '', profit_margin: '', images: [], uploadedImages: [], ingredients: [], tag: 'none', languages: ['en', 'ru', 'tr', 'tk'], regions: [], faceImageIndex: 0 });
  
  // Helper to convert rate
  const rate = currentCurrency?.rate || 1;
  const symbol = (currentCurrency?.symbol && currentCurrency.symbol.trim()) ? currentCurrency.symbol : (currentCurrency?.code || '$');
  const code = currentCurrency?.code || 'USD';

  // Refs to track previous rate for dynamic updates
  const prevRateRef = React.useRef(rate);

  // Update form values when currency rate changes while editing
  useEffect(() => {
    // If not editing or no change in rate, just update ref
    if (rate === prevRateRef.current) return;

    // Calculate ratio
    const ratio = rate / prevRateRef.current;
    prevRateRef.current = rate;

    // If we have a form with values, scale them
    const newPrice = (parseFloat(form.price) || 0) * ratio;
    const newMaking = (parseFloat(form.making_price) || 0) * ratio;
    // Profit also scales directly by ratio
    const newProfit = (parseFloat(form.profit) || 0) * ratio;
    
    // Profit margin % stays same because both Cost and Price scale by same ratio
    
    setForm(prev => ({
      ...prev,
      price: newPrice.toFixed(2),
      making_price: newMaking.toFixed(2),
      profit: newProfit.toFixed(2)
      // profit_margin remains unchanged
    }));
  }, [rate, form.price, form.making_price, form.profit]);

  // Available product tags
  // Using translation keys for labels and adding new badges
  const productTags = [
    { value: 'none', label: t('badges.none') },
    { value: 'hero', label: '👑 ' + (t('badges.hero') || 'Hero') },
    { value: 'bestseller', label: '⭐ ' + t('badges.bestseller') },
    { value: 'popular', label: '🔥 ' + t('badges.popular') },
    { value: 'premium', label: '💎 ' + t('badges.premium') },
    { value: 'signature', label: '✨ ' + t('badges.signature') },
    { value: 'rustic', label: '🌿 ' + t('badges.rustic') },
    { value: 'classic', label: '🎂 ' + t('badges.classic') },
    { value: 'seasonal', label: '🍂 ' + t('badges.seasonal') },
    { value: 'new', label: '🆕 ' + t('badges.new') },
    { value: 'limited', label: '⏳ ' + t('badges.limited') },
    { value: 'vegan', label: '🌱 ' + t('badges.vegan') },
    { value: 'glutenFree', label: '🌾 ' + t('badges.glutenFree') },
    { value: 'chefChoice', label: '👨‍🍳 ' + t('badges.chefChoice') },
    { value: 'organic', label: '🍃 ' + t('badges.organic') },
    { value: 'sugarFree', label: '🍬 ' + t('badges.sugarFree') },
    { value: 'hypoallergenic', label: '🛡️ ' + t('badges.hypoallergenic') },
    { value: 'dairyFree', label: '🥛✖️ ' + t('badges.dairyFree') },
    { value: 'nutFree', label: '🥜✖️ ' + t('badges.nutFree') },
    { value: 'halal', label: '🕌 ' + t('badges.halal') },
    { value: 'keto', label: '🥩 ' + t('badges.keto') }
  ];

  // Available languages
  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { code: 'tk', name: 'Turkmen', flag: '🇹🇲' }
  ];

  const handleLanguageToggle = (langCode) => {
    setForm(prev => {
      const currentLangs = prev.languages || [];
      if (currentLangs.includes(langCode)) {
        // Don't allow removing all languages
        if (currentLangs.length <= 1) return prev;
        return { ...prev, languages: currentLangs.filter(l => l !== langCode) };
      } else {
        return { ...prev, languages: [...currentLangs, langCode] };
      }
    });
  };
  
  const handleMultipleImageUpload = (e) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_WIDTH = 1600;
    const MAX_HEIGHT = 1600;
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file, idx) => {
      if (file.size > MAX_SIZE) {
        console.log(`${file.name}: ${t('imageSizeLimit')}`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        const img = new Image();
        img.onload = async () => {
          if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
            console.log(`${file.name}: ${t('imageResolutionLimit') || `Image resolution must be ≤ ${MAX_WIDTH}x${MAX_HEIGHT}`} `);
            return;
          }
          try {
            const thumb = await createThumbnail(base64);
            setForm(prev => ({
              ...prev,
              uploadedImages: [
                ...prev.uploadedImages,
                { id: `upload-${Date.now()}-${idx}`, data: base64, thumbnail: thumb }
              ]
            }));
          } catch {
            setForm(prev => ({
              ...prev,
              uploadedImages: [
                ...prev.uploadedImages,
                { id: `upload-${Date.now()}-${idx}`, data: base64, thumbnail: base64 }
              ]
            }));
          }
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveUploadedImage = (id) => {
    setForm(prev => {
      const idx = prev.uploadedImages.findIndex(img => img.id === id);
      const newUploaded = prev.uploadedImages.filter(img => img.id !== id);
      let newFace = prev.faceImageIndex;

      if (idx !== -1) {
        if (prev.faceImageIndex === idx) newFace = 0;
        else if (prev.faceImageIndex > idx) newFace = Math.max(0, prev.faceImageIndex - 1);
      }

      const totalAfter = newUploaded.length + (prev.images?.length || 0);
      if (newFace >= totalAfter) newFace = Math.max(0, totalAfter - 1);

      return { ...prev, uploadedImages: newUploaded, faceImageIndex: newFace };
    });
  };

  const handleRemoveImageURL = (idx) => {
    setForm(prev => {
      const newImages = (prev.images || []).filter((_, i) => i !== idx);
      const startOfUrls = prev.uploadedImages.length;
      const absoluteIdx = startOfUrls + idx;
      let newFace = prev.faceImageIndex;

      if (prev.faceImageIndex === absoluteIdx) newFace = 0;
      else if (prev.faceImageIndex > absoluteIdx) newFace = Math.max(0, prev.faceImageIndex - 1);

      const totalAfter = prev.uploadedImages.length + newImages.length;
      if (newFace >= totalAfter) newFace = Math.max(0, totalAfter - 1);

      return { ...prev, images: newImages, faceImageIndex: newFace };
    });
  };

  const handleEdit = (product) => {
    // Convert base values to current currency for display
    const displayPrice = product.price * rate;
    const displayMakingPrice = (product.making_price || 0) * rate;

    // Calculate cost based on current currency rates
    const costPriceBase = calculateCostPrice(product, ingredients);
    const costPrice = costPriceBase * rate;

    const profit = displayPrice - costPrice;
    const profitMargin = costPrice > 0 ? ((profit / costPrice) * 100) : 0;

    setEditing(product.id);
    const existingImages = product.images || [];
    const urlImages = existingImages.filter(img => !img.startsWith('data:image'));
    const dataImages = existingImages.filter(img => img.startsWith('data:image')).map((img, idx) => ({
      id: `data-${idx}`,
      data: img,
      thumbnail: img
    }));

    const currentTag = product.tags?.[0] || 'none';
    const currentLanguages = product.languages || ['en', 'ru', 'tr', 'tk'];
    const currentRegions = product.regions || [];
    setForm({
      name: product.name,
      description: product.description,
      price: displayPrice.toFixed(2),
      making_price: displayMakingPrice.toFixed(2),
      profit: profit.toFixed(2),
      profit_margin: profitMargin.toFixed(1),
      images: urlImages,
      uploadedImages: dataImages,
      ingredients: product.ingredients || [],
      tag: currentTag,
      languages: currentLanguages,
      regions: currentRegions,
      faceImageIndex: 0
    });
  };

  // Handle region toggle for product availability
  const handleRegionToggle = (countryCode) => {
    setForm(prev => {
      const currentRegions = prev.regions || [];
      if (currentRegions.includes(countryCode)) {
        return { ...prev, regions: currentRegions.filter(r => r !== countryCode) };
      } else {
        return { ...prev, regions: [...currentRegions, countryCode] };
      }
    });
  };

  // Calculate total cost from current form, in display currency
  const calculateCostFromForm = () => {
    const ingredientsCost = (form.ingredients || []).reduce((sum, ing) => {
      const ingredient = ingredients.find(i => i.id === ing.id);
      const basePrice = ingredient?.price || 0;
      return sum + (basePrice * rate) * (ing.quantity || 0);
    }, 0);

    const making = parseFloat(form.making_price) || 0;
    return ingredientsCost + making;
  };

  const handlePriceChange = (value) => {
    // Allow empty string for typing
    if (value === '') {
      setForm(prev => ({ ...prev, price: value }));
      return;
    }

    const newPrice = parseFloat(value);
    const costPrice = calculateCostFromForm();
    
    // Calculate Profit = Price - Cost
    const newProfit = !isNaN(newPrice) ? newPrice - costPrice : 0;
    
    // Calculate Markup = (Profit / Cost) * 100
    // If Cost is 0, Markup is technically infinite, but we can default to 0 or keeping it clear
    const newMarkup = costPrice > 0 ? ((newProfit / costPrice) * 100) : 0;
    
    setForm(prev => ({
      ...prev,
      price: value,
      profit: newProfit.toFixed(2),
      profit_margin: newMarkup.toFixed(1)
    }));
  };

  const handleProfitChange = (value, type) => {
    const costPrice = calculateCostFromForm();
    let newPrice, newProfit, newMargin;
    
    if (type === 'amount') {
      // Allow empty or negative sign properly
      if (value === '' || value === '-') {
        setForm(prev => ({ ...prev, profit: value }));
        return;
      }

      newProfit = parseFloat(value);
      newPrice = costPrice + (isNaN(newProfit) ? 0 : newProfit);
      // Change to Markup: (Profit / Cost) * 100
      newMargin = costPrice > 0 ? ((newProfit / costPrice) * 100) : 0;
      
      setForm(prev => ({
        ...prev,
        price: newPrice.toFixed(2),
        profit: value,
        profit_margin: newMargin.toFixed(1)
      }));
    } else if (type === 'margin') {
      if (value === '' || value === '-') {
        setForm(prev => ({ ...prev, profit_margin: value }));
        return;
      }
      
      newMargin = parseFloat(value);
      
      // Calculate Price -> Cost * (1 + Markup/100)
      if (!isNaN(newMargin)) {
         newPrice = costPrice * (1 + (newMargin / 100));
         newProfit = newPrice - costPrice;
         
         setForm(prev => ({
          ...prev,
          price: newPrice.toFixed(2),
          profit: newProfit.toFixed(2),
          profit_margin: value
        }));
      } else {
         setForm(prev => ({
          ...prev,
          profit_margin: value
        }));
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Combine all images: uploaded data URLs + existing URLs
    const allImages = [
      ...form.uploadedImages.map(img => img.data),
      ...form.images
    ];

    // Reorder so the face image is first
    if (form.faceImageIndex > 0 && form.faceImageIndex < allImages.length) {
      const faceImage = allImages[form.faceImageIndex];
      const reorderedImages = [faceImage, ...allImages.slice(0, form.faceImageIndex), ...allImages.slice(form.faceImageIndex + 1)];
      allImages.splice(0, allImages.length, ...reorderedImages);
    }

    // Validation: must have at least one image
    if (allImages.length === 0) {
      console.log(t('errorAddAtLeastOneImage') || 'Please add at least one image.');
      return;
    }

    const tagsToSave = form.tag && form.tag !== 'none' ? [form.tag] : [];
    const languagesToSave = form.languages && form.languages.length > 0 ? form.languages : ['en', 'ru', 'tr', 'tk'];
    
    // Validation: Check if Selling Price < Total Cost
    const totalCost = calculateCostFromForm();
    const sellingPrice = parseFloat(form.price) || 0;
    
    if (sellingPrice < totalCost) {
      console.log(t('errorPriceTooLow') || 'Selling Price cannot be lower than Total Cost!');
      return;
    }
    
    // Convert back to base currency (USD) for storage
    const basePrice = parseFloat(form.price) / rate;
    const baseMakingPrice = (parseFloat(form.making_price) || 0) / rate;
    


    const productData = {
      name: form.name, 
      description: form.description, 
      price: basePrice, 
      making_price: baseMakingPrice,
      images: allImages,
      category_id: '4', 
      ingredients: form.ingredients,
      tags: tagsToSave,
      languages: languagesToSave,
      regions: form.regions || [] // Empty means available in all regions
    };

    const saveProduct = async () => {
      try {

        if (editing && editing !== 'new') {
          // Update existing product
          const existingProduct = products.find(p => p.id === editing);
          const finalProduct = {
            ...existingProduct,
            ...productData
          };
          
          await api.updateProduct(editing, finalProduct);
          
          setProducts(prev => prev.map(p => 
            p.id === editing ? finalProduct : p
          ));
        } else {
          // Create new product
          const newProductPayload = {
            ...productData,
            id: Date.now().toString(),
          };
          
          const res = await api.createProduct(newProductPayload);
          setProducts(prev => [...prev, res]);
        }
        setEditing(null);
      } catch (error) {
        console.error("Failed to save product:", error);
        console.log(t('errorSavingProduct') || "Failed to save product. Please try again.");
      }
    };

    saveProduct();
  };

  // Helper to recalculate metrics based on current form state
  const recalculateFromCost = (currentForm) => {
    const ingredientsCost = currentForm.ingredients.reduce((sum, ing) => {
      const ingredient = ingredients.find(i => i.id === ing.id);
      const basePrice = ingredient?.price || 0;
      return sum + (basePrice * rate) * (ing.quantity || 0);
    }, 0);
    
    const costPrice = ingredientsCost + (parseFloat(currentForm.making_price) || 0);
    const currentPrice = parseFloat(currentForm.price) || 0;
    
    const newProfit = currentPrice - costPrice;
    const newMarkup = costPrice > 0 ? ((newProfit / costPrice) * 100) : 0;
    
    return {
      ...currentForm,
      profit: newProfit.toFixed(2),
      profit_margin: newMarkup.toFixed(1)
    };
  };

  const handleMakingPriceChange = (value) => {
    setForm(prev => {
      const updated = { ...prev, making_price: value };
      return recalculateFromCost(updated);
    });
  };

  const handleIngredientChange = (ingId, qty) => {
    setForm(prev => {
      const existing = prev.ingredients.find(i => i.id === ingId);
      let newIngredients;
      if (existing) {
        if (qty <= 0) {
          newIngredients = prev.ingredients.filter(i => i.id !== ingId);
        } else {
          newIngredients = prev.ingredients.map(i => i.id === ingId ? { ...i, quantity: qty } : i);
        }
      } else if (qty > 0) {
        newIngredients = [...prev.ingredients, { id: ingId, quantity: qty }];
      } else {
        newIngredients = prev.ingredients;
      }
      
      const updated = { ...prev, ingredients: newIngredients };
      return recalculateFromCost(updated);
    });
  };

  const getIngredientQty = (ingId) => {
    return form.ingredients.find(i => i.id === ingId)?.quantity || 0;
  };

  return (
    <>
      <div className="form-card" style={{marginBottom:'2rem'}}>
        <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1rem'}}>{t('createEditProduct') || 'Create / Edit Product'}</h3>
        {!editing ? (
          <>
            <div className="form-row" style={{alignItems:'flex-end',gap:'0.75rem'}}>
              <div className="form-group" style={{flex:1, position:'relative'}}>
                <label>{t('productName')}</label>
                <input 
                  type="text" 
                  value={searchName} 
                  onChange={e => { 
                    setSearchName(e.target.value); 
                    if (searchError) setSearchError(''); 
                    setHighlightIndex(0);
                    setDropdownOpen(true);
                  }} 
                  onKeyDown={e => {
                    const q = (searchName || '').trim();
                    if (!q) return;
                    const lower = q.toLowerCase();
                    const suggestions = products.filter(p => p.name?.toLowerCase().startsWith(lower)).slice(0,8);
                    if (e.key === 'Enter') {
                      const exact = products.find(p => p.name?.toLowerCase() === lower);
                      if (exact) {
                        handleEdit(exact);
                        setSearchError('');
                        setDropdownOpen(false);
                      } else if (suggestions.length > 0) {
                        const chosen = suggestions[Math.max(0, Math.min(highlightIndex, suggestions.length - 1))];
                        setSearchName(chosen.name);
                        handleEdit(chosen);
                        setSearchError('');
                        setDropdownOpen(false);
                      } else {
                        handleCreateNew(q);
                      }
                    } else if (e.key === 'Tab') {
                      if (suggestions.length > 0) {
                        setSearchName(suggestions[0].name);
                      }
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setHighlightIndex(prev => Math.min(prev + 1, Math.max(0, suggestions.length - 1)));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightIndex(prev => Math.max(prev - 1, 0));
                    } else if (e.key === 'Escape') {
                      setDropdownOpen(false);
                    }
                  }}
                  onFocus={() => setDropdownOpen(!!(searchName && searchName.trim()))}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  placeholder={t('productName')} 
                  style={{borderColor: searchError ? '#dc3545' : undefined}} 
                />
                {searchError && <div style={{color:'#dc3545',marginTop:'0.35rem',fontSize:'0.9rem'}}>{searchError}</div>}

                {dropdownOpen && searchName?.trim() && (() => {
                  const lower = searchName.trim().toLowerCase();
                  const suggestions = products.filter(p => p.name?.toLowerCase().startsWith(lower)).slice(0,8);
                  const exact = products.find(p => p.name?.toLowerCase() === lower);
                  return (
                    <div style={{
                      position:'absolute', left:0, right:0, top:'calc(100% + 6px)', zIndex:1000,
                      background:'white', border:'2px solid var(--blush)', borderRadius:'14px', padding:'0.5rem',
                      boxShadow:'0 10px 30px rgba(0,0,0,0.12)'
                    }}>
                      {suggestions.length > 0 ? suggestions.map((s, idx) => (
                        <button
                          key={s.id}
                          onMouseDown={() => { setSearchName(s.name); handleEdit(s); setHighlightIndex(0); setSearchError(''); setDropdownOpen(false); }}
                          style={{
                            display:'block', width:'100%', textAlign:'left', padding:'0.6rem 0.75rem', border:'none',
                            background: idx === highlightIndex ? 'linear-gradient(135deg,rgba(245,228,220,0.6),rgba(212,133,106,0.15))' : 'transparent',
                            cursor:'pointer', color:'var(--chocolate)', borderRadius:'10px',
                            fontWeight: idx === highlightIndex ? 700 : 500
                          }}
                          role="option"
                          aria-selected={idx === highlightIndex}
                        >
                          {s.name}
                        </button>
                      )) : (
                        <div style={{padding:'0.6rem 0.75rem', color:'var(--chocolate)', opacity:0.7}}>No matches</div>
                      )}
                      {!exact && (
                        <button 
                          onMouseDown={() => { handleCreateNew(searchName.trim()); setDropdownOpen(false); }}
                          style={{display:'block',width:'100%',textAlign:'left',padding:'0.6rem 0.75rem',border:'none',cursor:'pointer',
                          color:'var(--terracotta)',fontWeight:700,background:'transparent',borderTop:'1px dashed var(--blush)',marginTop:'0.25rem'}}
                        >
                          {(t('createAsNewProduct') || 'Create {name} as new product').replace('{name}', searchName.trim())}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* Dropdown now attaches directly beneath the input for cohesion */}
            <div style={{display:'flex',gap:'0.75rem',marginTop:'0.75rem'}}>
              <button className="form-submit" style={{width:'auto',padding:'0.8rem 2rem',marginTop:0}} onClick={() => {
                handleCreateNew(searchName || '');
              }}>
                {t('create') || 'Create'}
              </button>
              <button 
                className="form-submit" 
                style={{width:'auto',padding:'0.8rem 2rem',marginTop:0}}
                onClick={() => {
                  const q = (searchName || '').trim().toLowerCase();
                  if (!q) return;
                  const found = products.find(p => p.name?.toLowerCase() === q);
                  if (found) {
                    handleEdit(found);
                    setSearchError('');
                  } else {
                    setSearchError(t('productNotFound') || 'Product not found');
                  }
                }}
              >
                {t('edit')}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group"><label>{t('productName')} *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required onInvalid={e => e.target.setCustomValidity(t('fieldRequired'))} onInput={e => e.target.setCustomValidity('')} /></div>
              <div className="form-group"><label>{t('pricePerUnit')} ({symbol}) *</label><input type="number" step="0.01" value={form.price} onChange={e => handlePriceChange(e.target.value)} required onInvalid={e => e.target.setCustomValidity(t('fieldRequired'))} onInput={e => e.target.setCustomValidity('')} onWheel={(e) => e.target.blur()} /></div>
            </div>
            
            <div className="form-group"><label>{t('description')} *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required onInvalid={e => e.target.setCustomValidity(t('fieldRequired'))} onInput={e => e.target.setCustomValidity('')} /></div>
            
            <div className="form-group">
              <label>{t('productImages')} (Upload Multiple) *</label>
              <div style={{display:'flex',gap:'0.5rem',marginBottom:'1rem'}}>
                <input type="file" accept="image/*" onChange={handleMultipleImageUpload} style={{padding:'0.5rem'}} id="img-upload" multiple hidden />
                <label htmlFor="img-upload" className="btn btn-secondary btn-small" style={{width:'100%',justifyContent:'center',cursor:'pointer'}}>
                  {t('selectImageFile')}
                </label>
              </div>

              {/* Display uploaded images */}
              {form.uploadedImages.length > 0 && (
                <div style={{marginBottom:'1rem'}}>
                  <p style={{fontSize:'0.9rem',fontWeight:500,marginBottom:'0.5rem'}}>Uploaded Images ({form.uploadedImages.length}):</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'0.5rem'}}>
                    {form.uploadedImages.map((img, idx) => (
                      <div key={img.id} style={{position:'relative',borderRadius:'8px',overflow:'hidden',border:'2px solid var(--blush)'}}>
                        <img src={img.thumbnail} alt={`Upload ${idx + 1}`} style={{width:'100%',height:'100px',objectFit:'cover'}} />
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedImage(img.id)}
                          style={{position:'absolute',top:0,right:0,background:'rgba(255,0,0,0.7)',color:'white',border:'none',width:'24px',height:'24px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image URLs section */}
              <div style={{marginTop:'1rem',padding:'1rem',background:'var(--blush)',borderRadius:'12px'}}>
                <label style={{display:'block',marginBottom:'0.5rem',fontWeight:500}}>Add Image URLs:</label>
                <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.5rem'}}>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const url = e.target.value.trim();
                        if (url) {
                          setForm(prev => ({
                            ...prev,
                            images: [...prev.images, url]
                          }));
                          e.target.value = '';
                        }
                      }
                    }}
                    style={{flex:1,padding:'0.5rem',borderRadius:'6px',border:'1px solid var(--chocolate)'}}
                  />
                  <button 
                    type="button"
                    className="form-submit btn-small"
                    onClick={(e) => {
                      e.preventDefault();
                      const input = e.target.previousElementSibling;
                      const url = input.value.trim();
                      if (url) {
                        setForm(prev => ({
                          ...prev,
                          images: [...prev.images, url]
                        }));
                        input.value = '';
                      }
                    }}
                  >
                    {t('add') || 'Add'} URL
                  </button>
                </div>
                
                {form.images.length > 0 && (
                  <div>
                    <p style={{fontSize:'0.9rem',fontWeight:500,marginBottom:'0.5rem'}}>Image URLs ({form.images.length}):</p>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'0.5rem'}}>
                      {form.images.map((url, idx) => (
                        <div key={idx} style={{position:'relative',borderRadius:'8px',overflow:'hidden',border:'2px solid var(--terracotta)'}}>
                          <img src={url} alt={`URL ${idx + 1}`} style={{width:'100%',height:'100px',objectFit:'cover'}} />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageURL(idx)}
                            style={{position:'absolute',top:0,right:0,background:'rgba(255,0,0,0.7)',color:'white',border:'none',width:'24px',height:'24px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(form.uploadedImages.length > 0 || form.images.length > 0) && (
              <div className="form-group">
                <label style={{display:'block',marginBottom:'1rem',fontWeight:600}}>👤 {t('selectFaceImage') || 'Select Face Image'}</label>
                <p style={{fontSize:'0.85rem',color:'var(--chocolate)',opacity:0.7,marginBottom:'1rem'}}>Choose which photo will be shown in product collections</p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:'1rem',padding:'1.5rem',background:'var(--blush)',borderRadius:'12px'}}>
                  {[...form.uploadedImages, ...form.images.map((url, idx) => ({ id: `url-${idx}`, data: url }))].map((img, idx) => (
                    <div 
                      key={img.id} 
                      onClick={() => setForm(prev => ({ ...prev, faceImageIndex: idx }))}
                      style={{
                        position:'relative',
                        borderRadius:'12px',
                        overflow:'hidden',
                        cursor:'pointer',
                        border: form.faceImageIndex === idx ? '3px solid var(--terracotta)' : '2px solid transparent',
                        transition:'all 0.2s',
                        boxShadow: form.faceImageIndex === idx ? '0 0 0 3px white, 0 0 10px rgba(212,133,106,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                        transform: form.faceImageIndex === idx ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <img src={img.thumbnail || img.data} alt={`Face option ${idx + 1}`} style={{width:'100%',height:'120px',objectFit:'cover'}} />
                      {form.faceImageIndex === idx && (
                        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(212,133,106,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                          <div style={{background:'var(--terracotta)',color:'white',width:'40px',height:'40px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',fontWeight:'bold'}}>✓</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
               <label>{t('productBadge')}</label>
               <select 
                 value={form.tag} 
                 onChange={e => setForm({...form, tag: e.target.value})}
                 style={{padding:'1rem',width:'100%',borderRadius:'12px',border:'2px solid var(--blush)'}}
               >
                 {productTags.map(tag => (
                   <option key={tag.value} value={tag.value}>{tag.label}</option>
                 ))}
               </select>
            </div>

            <div className="form-group">
              <label>{t('showInLanguages')}</label>
              <div style={{display:'flex',gap:'1rem',flexWrap:'wrap',padding:'1rem',background:'var(--blush)',borderRadius:'12px'}}>
                {availableLanguages.map(lang => (
                  <label key={lang.code} style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'pointer',background:'white',padding:'0.5rem 1rem',borderRadius:'50px',border: form.languages?.includes(lang.code) ? '2px solid var(--terracotta)' : '2px solid transparent'}}>
                    <input 
                      type="checkbox" 
                      checked={form.languages?.includes(lang.code)} 
                      onChange={() => handleLanguageToggle(lang.code)}
                      style={{width:'auto',margin:0}}
                    />
                    <span>{lang.flag} {lang.name}</span>
                  </label>
                ))}
              </div>
              <p style={{fontSize:'0.8rem',color:'var(--chocolate)',marginTop:'0.5rem',opacity:0.7}}>
                {t('selectLanguagesProduct')}
              </p>
            </div>

            {/* Region/Country Availability */}
            <div className="form-group">
              <label style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <Globe size={18} /> {t('productRegions') || 'Available Regions'}
              </label>
              <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',padding:'1rem',background:'var(--blush)',borderRadius:'12px'}}>
                {countryContacts.length === 0 ? (
                  <p style={{color:'var(--chocolate)',opacity:0.7,fontSize:'0.9rem'}}>{t('noCountryContacts') || 'No regions configured'}</p>
                ) : (
                  countryContacts.map(contact => (
                    <label 
                      key={contact.id} 
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem',
                        cursor:'pointer',
                        background:'white',
                        padding:'0.5rem 1rem',
                        borderRadius:'50px',
                        border: form.regions?.includes(contact.countryCode) ? '2px solid var(--terracotta)' : '2px solid transparent',
                        transition:'all 0.2s'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={form.regions?.includes(contact.countryCode)} 
                        onChange={() => handleRegionToggle(contact.countryCode)}
                        style={{width:'auto',margin:0}}
                      />
                      <span style={{
                        display:'inline-flex',
                        alignItems:'center',
                        justifyContent:'center',
                        width:'28px',
                        height:'28px',
                        background: contact.countryCode === 'GENERAL' ? 'var(--espresso)' : 'var(--terracotta)',
                        color:'white',
                        borderRadius:'50%',
                        fontSize:'0.65rem',
                        fontWeight:700
                      }}>
                        {contact.countryCode === 'GENERAL' ? <Globe size={14} /> : contact.countryCode}
                      </span>
                      <span>{contact.country}</span>
                    </label>
                  ))
                )}
              </div>
              <p style={{fontSize:'0.8rem',color:'var(--chocolate)',marginTop:'0.5rem',opacity:0.7}}>
                {t('productRegionsHelp') || 'Leave empty to show in all regions, or select specific regions to restrict availability.'}
              </p>
            </div>
            
            <div style={{margin:'2rem 0',padding:'1.5rem',background:'var(--blush)',borderRadius:'16px'}}>
              <h4 style={{marginBottom:'1rem'}}>{t('costAnalysis')}</h4>
              
              <div className="form-group"><label>{t('makingPriceLabor')} ({symbol})</label><input type="number" step="0.01" value={form.making_price} onChange={e => handleMakingPriceChange(e.target.value)} placeholder="0.00" onWheel={(e) => e.target.blur()} /></div>
              
              <div style={{marginBottom:'1rem'}}>
                <label style={{display:'block',marginBottom:'0.5rem',fontWeight:500}}>{t('ingredients')}</label>
                <div style={{background:'white',borderRadius:'12px',border:'1px solid var(--blush)'}}>
                  <table className="admin-table" style={{marginBottom:0}}>
                    <thead style={{position:'sticky',top:0,zIndex:10,background:'white',boxShadow:'0 2px 4px rgba(0,0,0,0.05)'}}>
                      <tr>
                        <th style={{padding:'1rem'}}>{t('ingredientName')}</th>
                        <th style={{padding:'1rem'}}>{t('cost')}</th>
                        <th style={{padding:'1rem'}}>{t('quantity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map(ing => {
                        const qty = getIngredientQty(ing.id);
                        return (
                          <tr key={ing.id} style={{background: qty > 0 ? 'var(--blush)' : 'transparent', transition:'background 0.2s'}}>
                            <td style={{padding:'0.75rem 1rem'}}>
                              <div style={{fontWeight:500}}>{ing.name}</div>
                            </td>
                            <td style={{padding:'0.75rem 1rem', color:'var(--chocolate)', opacity:0.8}}>
                              {symbol} {(ing.price * rate).toFixed(2)} / {ing.unit}
                            </td>
                            <td style={{padding:'0.75rem 1rem'}}>
                              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                                <input 
                                  type="number" 
                                  min="0" 
                                  step="0.01"
                                  style={{
                                    width:'80px',
                                    padding:'0.5rem',
                                    fontSize:'0.9rem',
                                    border: qty > 0 ? '2px solid var(--terracotta)' : '1px solid #ddd',
                                    borderRadius:'6px',
                                    textAlign:'center'
                                  }} 
                                  value={qty}
                                  onChange={e => handleIngredientChange(ing.id, parseFloat(e.target.value) || 0)}
                                  onFocus={e => e.target.select()}
                                  onWheel={(e) => e.target.blur()}
                                />
                                <span style={{fontSize:'0.85rem', color:'var(--chocolate)', minWidth:'40px'}}>{ing.unit}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div style={{marginTop:'1.5rem',background:'linear-gradient(135deg,rgba(255,240,240,0.5),rgba(245,228,220,0.5))',padding:'2rem',borderRadius:'16px',border:'1px solid var(--blush)'}}>
                <h5 style={{fontSize:'0.95rem',fontWeight:600,color:'var(--chocolate)',marginBottom:'1.5rem',textTransform:'uppercase',letterSpacing:'0.5px',opacity:0.8}}>{t('pricingBreakdown')}</h5>
                
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'1.5rem'}}>
                  {/* Total Cost - Display Only */}
                  <div style={{background:'white',padding:'1.25rem',borderRadius:'12px',border:'2px solid var(--blush)'}}>
                    <label style={{display:'block',fontSize:'0.85rem',color:'var(--chocolate)',marginBottom:'0.5rem',fontWeight:500,opacity:0.7,textTransform:'uppercase',letterSpacing:'0.3px'}}>{t('totalCost')}</label>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem'}}>
                      <span style={{fontSize:'1.5rem',fontWeight:700,color:'var(--chocolate)',opacity:0.9}}>{code}</span>
                      <span style={{fontSize:'1.5rem',fontWeight:700,color:'var(--chocolate)'}}>{(calculateCostFromForm()).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Selling Price */}
                  <div style={{background:'white',padding:'1.25rem',borderRadius:'12px',border:'2px solid var(--terracotta)'}}>
                    <label style={{display:'block',fontSize:'0.85rem',color:'var(--chocolate)',marginBottom:'0.5rem',fontWeight:500,opacity:0.7,textTransform:'uppercase',letterSpacing:'0.3px'}}>{t('sellingPrice')}</label>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem'}}>
                      <span style={{fontSize:'1.5rem',fontWeight:700,color:'var(--chocolate)',opacity:0.9}}>{code}</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={form.price} 
                        onChange={e => handlePriceChange(e.target.value)} 
                        style={{
                          flex:1,
                          fontSize:'1.5rem',
                          fontWeight:700,
                          border:'none',
                          background:'transparent',
                          color:'var(--chocolate)',
                          outline:'none',
                          padding:'0',
                          cursor:'pointer'
                        }} 
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </div>

                  {/* Profit */}
                  <div style={{background:'white',padding:'1.25rem',borderRadius:'12px',border:'2px solid var(--sage)'}}>
                    <label style={{display:'block',fontSize:'0.85rem',color:'var(--chocolate)',marginBottom:'0.5rem',fontWeight:500,opacity:0.7,textTransform:'uppercase',letterSpacing:'0.3px'}}>{t('profit')}</label>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem'}}>
                      <span style={{fontSize:'1.5rem',fontWeight:700,color:'var(--chocolate)',opacity:0.9}}>{code}</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min="-100" 
                        max="1000" 
                        value={form.profit} 
                        onChange={e => handleProfitChange(e.target.value, 'amount')} 
                        style={{
                          flex:1,
                          fontSize:'1.5rem',
                          fontWeight:700,
                          border:'none',
                          background:'transparent',
                          color:'var(--chocolate)',
                          outline:'none',
                          padding:'0',
                          cursor:'pointer'
                        }} 
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </div>

                  {/* Profit Margin */}
                  <div style={{background:'white',padding:'1.25rem',borderRadius:'12px',border:'2px solid var(--mauve)'}}>
                    <label style={{display:'block',fontSize:'0.85rem',color:'var(--chocolate)',marginBottom:'0.5rem',fontWeight:500,opacity:0.7,textTransform:'uppercase',letterSpacing:'0.3px'}}>{t('profitMargin')}</label>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem'}}>
                      <span style={{fontSize:'1.5rem',fontWeight:700,color:'var(--chocolate)'}}>%</span>
                      <input 
                        type="number" 
                        step="0.1" 
                        value={form.profit_margin} 
                        onChange={e => handleProfitChange(e.target.value, 'margin')} 
                        style={{
                          flex:1,
                          fontSize:'1.5rem',
                          fontWeight:700,
                          border:'none',
                          background:'transparent',
                          color:'var(--chocolate)',
                          outline:'none',
                          padding:'0',
                          cursor:'pointer'
                        }} 
                        onWheel={(e) => e.target.blur()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{display:'flex',gap:'1rem',marginTop:'2rem'}}>
              <button type="submit" className="form-submit" style={{width:'auto',padding:'0.8rem 2rem',marginTop:0}}>{t('save') || 'Save'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>{t('cancel')}</button>
              {editing && editing !== 'new' && (
                <button 
                  type="button" 
                  className="btn" 
                  style={{background:'#dc3545',color:'#fff'}}
                  onClick={() => setConfirmDeleteId(editing)}
                >
                  {t('delete')}
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="form-card">
        <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('productManagement')}</h3>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card" onClick={() => handleEdit(p)}>
              <div className="product-image" style={{height:'200px',position:'relative'}}>
                <img src={p.images[0]} alt={p.name} />
                {p.tags?.[0] && <span className={`product-tag ${p.tags[0]}`}>{p.tags[0]}</span>}
                <button 
                  type="button"
                  title={t('delete')}
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(p.id); }}
                  style={{position:'absolute',top:'0.5rem',right:'0.5rem',background:'rgba(220,53,69,0.9)',color:'white',border:'none',width:'32px',height:'32px',borderRadius:'50%',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="product-content" style={{padding:'1rem'}}>
                <h4 style={{marginBottom:'0.5rem'}}>{p.name}</h4>
                <div className="product-price">{formatPrice(p.price)}</div>
                <div style={{fontSize:'0.85rem',marginTop:'0.5rem',color:'var(--chocolate)',opacity:0.7}}>{calculateCostPrice(p, ingredients) > 0 ? `Margin: ${(((p.price - calculateCostPrice(p, ingredients))/p.price)*100).toFixed(0)}%` : 'No cost data'}</div>
                {/* Show region badges */}
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.25rem',marginTop:'0.5rem'}}>
                  {(!p.regions || p.regions.length === 0) ? (
                    <span style={{fontSize:'0.7rem',padding:'0.2rem 0.5rem',background:'var(--sage)',color:'white',borderRadius:'10px',display:'inline-flex',alignItems:'center',gap:'0.25rem'}}>
                      <Globe size={10} /> {t('allRegions') || 'All'}
                    </span>
                  ) : (
                    p.regions.map(r => (
                      <span key={r} style={{fontSize:'0.7rem',padding:'0.2rem 0.5rem',background:'var(--terracotta)',color:'white',borderRadius:'10px',fontWeight:600}}>
                        {r}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {confirmDeleteId !== null && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div style={{background:'linear-gradient(135deg,rgba(255,240,240,0.95),rgba(245,228,220,0.95))',border:'1px solid var(--blush)',borderRadius:'16px',padding:'1.5rem',width:'min(420px,90vw)',boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
            <h4 style={{margin:'0 0 1rem',color:'var(--chocolate)'}}>{t('confirmDelete') || 'Delete this product?'}</h4>
            <p style={{margin:'0 0 1.25rem',color:'var(--chocolate)',opacity:0.8}}>{t('confirmDeleteDetail') || 'This action cannot be undone.'}</p>
            <div style={{display:'flex',gap:'0.75rem',justifyContent:'flex-end'}}>
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>{t('cancel')}</button>
              <button className="btn" style={{background:'#dc3545',color:'#fff'}} onClick={handleConfirmDelete}>{t('delete')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsManagement;
