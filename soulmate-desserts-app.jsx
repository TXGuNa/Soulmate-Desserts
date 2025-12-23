import React, { useState, useEffect, createContext, useContext } from 'react';

// ============================================
// MOCK DATA
// ============================================

const mockCategories = [
  { id: '1', name: 'Birthday Cakes', slug: 'birthday', icon: '🎂' },
  { id: '2', name: 'Wedding Cakes', slug: 'wedding', icon: '💒' },
  { id: '3', name: 'Cupcakes', slug: 'cupcakes', icon: '🧁' },
  { id: '4', name: 'Specialty', slug: 'specialty', icon: '✨' },
];

// Global ingredients with prices
let ingredientsData = [
  { id: 'ing1', name: 'Flour', unit: 'lb', price: 2.50 },
  { id: 'ing2', name: 'Sugar', unit: 'lb', price: 3.00 },
  { id: 'ing3', name: 'Butter', unit: 'lb', price: 5.50 },
  { id: 'ing4', name: 'Eggs', unit: 'dozen', price: 4.50 },
  { id: 'ing5', name: 'Belgian Chocolate', unit: 'lb', price: 12.00 },
  { id: 'ing6', name: 'Vanilla Extract', unit: 'oz', price: 8.00 },
  { id: 'ing7', name: 'Cream Cheese', unit: 'lb', price: 4.50 },
  { id: 'ing8', name: 'Heavy Cream', unit: 'qt', price: 5.00 },
  { id: 'ing9', name: 'Cocoa Powder', unit: 'lb', price: 6.50 },
  { id: 'ing10', name: 'Lemon Juice', unit: 'qt', price: 4.00 },
  { id: 'ing11', name: 'Elderflower Syrup', unit: 'bottle', price: 15.00 },
  { id: 'ing12', name: 'Caramel Sauce', unit: 'jar', price: 7.50 },
  { id: 'ing13', name: 'Sea Salt', unit: 'lb', price: 3.50 },
  { id: 'ing14', name: 'Food Coloring', unit: 'set', price: 12.00 },
  { id: 'ing15', name: 'Fondant', unit: 'lb', price: 8.00 },
];

// Helper function to calculate cost from ingredients
const calculateCostPrice = (product, ingredients) => {
  const ingredientsCost = product.ingredients?.reduce((sum, ing) => {
    const ingredient = ingredients.find(i => i.id === ing.id);
    return sum + (ingredient?.price || 0) * (ing.quantity || 0);
  }, 0) || 0;
  return ingredientsCost + (product.making_price || 0);
};

const mockProducts = [
  { id: '1', name: 'Classic Chocolate Dream', description: 'Rich layers of Belgian chocolate ganache', price: 85.00, making_price: 15.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing5', quantity: 1.5 }, { id: 'ing8', quantity: 0.5 }], category_id: '1', images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'], tags: ['bestseller'] },
  { id: '2', name: 'Vanilla Cloud', description: 'Light Madagascar vanilla with Swiss meringue', price: 75.00, making_price: 12.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing6', quantity: 2 }, { id: 'ing4', quantity: 1 }], category_id: '1', images: ['https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=600'], tags: ['classic'] },
  { id: '3', name: 'Red Velvet Romance', description: 'Southern-style with cream cheese frosting', price: 90.00, making_price: 18.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing7', quantity: 1 }, { id: 'ing9', quantity: 0.5 }, { id: 'ing14', quantity: 0.5 }], category_id: '1', images: ['https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600'], tags: ['popular'] },
  { id: '4', name: 'Elegant Tiered Wonder', description: 'Three-tier masterpiece with hand-piped details', price: 450.00, making_price: 80.00, ingredients: [{ id: 'ing1', quantity: 8 }, { id: 'ing2', quantity: 6 }, { id: 'ing3', quantity: 3 }, { id: 'ing4', quantity: 3 }, { id: 'ing15', quantity: 5 }], category_id: '2', images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600'], tags: ['premium'] },
  { id: '5', name: 'Rustic Garden', description: 'Semi-naked cake with fresh flowers', price: 320.00, making_price: 60.00, ingredients: [{ id: 'ing1', quantity: 5 }, { id: 'ing2', quantity: 4 }, { id: 'ing3', quantity: 2 }, { id: 'ing8', quantity: 1 }], category_id: '2', images: ['https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=600'], tags: ['rustic'] },
  { id: '6', name: 'Assorted Cupcake Box', description: 'Dozen cupcakes in seasonal flavors', price: 48.00, making_price: 8.00, ingredients: [{ id: 'ing1', quantity: 1.5 }, { id: 'ing2', quantity: 1 }, { id: 'ing3', quantity: 0.5 }, { id: 'ing4', quantity: 0.5 }], category_id: '3', images: ['https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600'], tags: ['popular'] },
  { id: '7', name: 'Salted Caramel Bliss', description: 'Caramel layers with sea salt buttercream', price: 95.00, making_price: 16.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing12', quantity: 1 }, { id: 'ing13', quantity: 0.1 }, { id: 'ing8', quantity: 0.5 }], category_id: '4', images: ['https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600'], tags: ['signature'] },
  { id: '8', name: 'Lemon Elderflower', description: 'Zesty lemon with elderflower meringue', price: 88.00, making_price: 14.00, ingredients: [{ id: 'ing1', quantity: 2 }, { id: 'ing2', quantity: 1.5 }, { id: 'ing10', quantity: 0.5 }, { id: 'ing11', quantity: 0.5 }, { id: 'ing4', quantity: 1 }], category_id: '4', images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600'], tags: ['seasonal'] },
];

const ADMIN = { email: 'admin@soulmate.com', password: 'Admin@2024!', name: 'Admin', role: 'admin' };
let mockInvites = [
  { id: '1', token: 'DEALER2024', email: '', role: 'dealer', used: false, expiresAt: '2025-12-31' },
  { id: '2', token: 'USER2024', email: '', role: 'public', used: false, expiresAt: '2025-12-31' },
];
let mockUsers = [];

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  en: {
    // Navigation
    home: 'Home',
    ourCakes: 'Our Cakes',
    contact: 'Contact',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    settings: 'Settings',
    cart: 'Cart',
    // Hero
    heroTitle: 'Where Every Bite is',
    heroTitleEmphasis: 'Pure Love',
    heroDescription: 'Handcrafted artisan desserts made with passion and the finest ingredients. From birthdays to weddings, we make every celebration sweeter.',
    exploreCreations: 'Explore Our Creations →',
    customOrders: 'Custom Orders',
    // Collections
    ourCollections: 'Our Collections',
    collectionsSubtitle: 'From intimate gatherings to grand celebrations',
    featuredCreations: 'Featured Creations',
    featuredSubtitle: 'Our most loved desserts this season',
    // Product
    addToCart: 'Add to Cart',
    quantity: 'Quantity',
    dealerPrice: 'Dealer Price',
    retailPrice: 'Retail Price',
    cost: 'Cost',
    profit: 'Profit',
    margin: 'Margin',
    editPrice: 'Edit Price',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    // Cart
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    subtotal: 'Subtotal',
    proceedToCheckout: 'Proceed to Checkout',
    remove: 'Remove',
    // Checkout
    checkout: 'Checkout',
    contactInfo: 'Contact Info',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    delivery: 'Delivery',
    address: 'Address',
    date: 'Date',
    time: 'Time',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    notes: 'Notes',
    specialInstructions: 'Special Instructions',
    anyRequests: 'Any special requests...',
    orderSummary: 'Order Summary',
    tax: 'Tax',
    total: 'Total',
    placeOrder: 'Place Order',
    orderPlaced: 'Order Placed!',
    orderPlacedMessage: "We'll contact you shortly to confirm.",
    continueShopping: 'Continue Shopping',
    addDessertsFirst: 'Add desserts first!',
    browse: 'Browse',
    qty: 'Qty',
    // Login
    welcomeBack: 'Welcome Back',
    joinUs: 'Join Us',
    signInToAccount: 'Sign in to your account',
    registerWithInvite: 'Register with invite token',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    register: 'Register',
    password: 'Password',
    createPassword: 'Create Password',
    fullName: 'Full Name',
    inviteToken: 'Invite Token',
    enterInviteToken: 'Enter the token from admin',
    adminLogin: 'Admin Login',
    testTokens: 'Test Tokens',
    dealer: 'Dealer',
    user: 'User',
    invalidCredentials: 'Invalid credentials',
    loginSuccessful: 'Login successful! Redirecting...',
    // Contact
    getInTouch: 'Get in Touch',
    contactSubtitle: 'Questions? Custom orders? We\'d love to hear from you!',
    name: 'Name',
    message: 'Message',
    sendMessage: 'Send Message',
    messageSent: 'Message Sent!',
    messageSentConfirm: "We'll reply within 24 hours.",
    tellUsAboutDreamDessert: 'Tell us about your dream dessert...',
    back: 'Back',
    // Settings
    languageSettings: 'Language Settings',
    selectLanguage: 'Select Language',
    currencySettings: 'Currency Settings',
    selectCurrency: 'Select Currency',
    general: 'General',
    currencies: 'Currencies',
    addCurrency: 'Add Currency',
    currencyCode: 'Currency Code',
    currencyName: 'Currency Name',
    symbol: 'Symbol',
    exchangeRate: 'Exchange Rate',
    actions: 'Actions',
    // Admin
    adminDashboard: 'Admin Dashboard',
    overview: 'Overview',
    orders: 'Orders',
    products: 'Products',
    ingredients: 'Ingredients',
    invites: 'Invites',
    users: 'Users',
    pendingOrders: 'Pending Orders',
    registeredUsers: 'Registered Users',
    totalRevenue: 'Total Revenue',
    thisWeek: 'This Week',
    recentOrders: 'Recent Orders',
    allOrders: 'All Orders',
    pending: 'Pending',
    inProgress: 'In Progress',
    ready: 'Ready',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    customer: 'Customer',
    items: 'Items',
    status: 'Status',
    // Admin - Invites
    createNewInvite: 'Create New Invite',
    emailOptional: 'Email (optional - restrict to specific email)',
    leaveBlankForAnyEmail: 'Leave blank for any email',
    role: 'Role',
    regularUser: 'Regular User',
    expiresInDays: 'Expires in (days)',
    createInvite: 'Create Invite',
    allInvites: 'All Invites',
    noInvitesYet: 'No invites yet.',
    token: 'Token',
    expires: 'Expires',
    active: 'Active',
    used: 'Used',
    expired: 'Expired',
    any: 'Any',
    // Admin - Users
    noUsersYet: 'No users registered yet.',
    registered: 'Registered',
    // Admin - Products
    productManagement: 'Product Management',
    makingPrice: 'Making Price',
    // Admin - Ingredients
    ingredientManagement: 'Ingredient Management',
    addIngredient: 'Add Ingredient',
    ingredientName: 'Ingredient Name',
    unit: 'Unit',
    pricePerUnit: 'Price per Unit',
    noIngredientsYet: 'No ingredients yet.',
    // Admin - Orders
    orderManagement: 'Order Management',
    noOrdersYet: 'No orders yet.',
    viewDetails: 'View Details',
    updateStatus: 'Update Status',
    completed: 'Completed',
    // Admin - Common
    goToLogin: 'Go to Login',
    backToHome: 'Back to Home',
    adminCredentials: 'Admin Credentials',
    pleaseLoginWithAdmin: 'Please login with admin credentials.',
    createdToken: 'Created! Token:',
    remove: 'Remove',
    update: 'Update',
    add: 'Add',
    editIngredient: 'Edit Ingredient',
    addNewIngredient: 'Add New Ingredient',
    deleteIngredientConfirm: 'Delete this ingredient?',
    ingredientUsedInProducts: 'This ingredient is used in {count} product(s): {products}. Are you sure you want to delete it?',
    productName: 'Product Name',
    productBadge: 'Product Badge',
    noneNoBadge: 'None (No Badge)',
    showInLanguages: 'Show in Languages',
    selectLanguagesProduct: 'Select which languages this product will be visible in. At least one language required.',
    createProduct: 'Create Product',
    saveChanges: 'Save Changes',
    visibleIn: 'Visible in:',
    imageSizeLimit: 'Image size must be less than 5MB',
    selectImageFile: 'Please select an image file',
    // Cost Analysis
    costAnalysis: 'Cost Analysis',
    showCostAnalysis: 'Show Cost Analysis',
    hideCostAnalysis: 'Hide Cost Analysis',
    totalCost: 'Total Cost',
    sellingPrice: 'Selling Price',
    profitMargin: 'Profit Margin',
    noIngredientsListed: 'No ingredients listed',
    makingPriceLabor: 'Making Price (Labor)',
    // Footer
    footerDescription: 'Handcrafted with love. Premium ingredients for unforgettable celebrations.',
    quickLinks: 'Quick Links',
    collections: 'Collections',
    birthdayCakes: 'Birthday Cakes',
    weddingCakes: 'Wedding Cakes',
    cupcakes: 'Cupcakes',
    madeWithLove: 'Made with 💝',
    // Access
    accessDenied: 'Access Denied',
    adminOnly: 'Admin only.',
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    hi: 'Hi',
    required: 'Required'
  },
  ru: {
    home: 'Главная',
    ourCakes: 'Наши Торты',
    contact: 'Контакты',
    admin: 'Админ',
    login: 'Войти',
    logout: 'Выйти',
    settings: 'Настройки',
    cart: 'Корзина',
    heroTitle: 'Где каждый кусочек - это',
    heroTitleEmphasis: 'Чистая Любовь',
    heroDescription: 'Ручные десерты, созданные с страстью и лучшими ингредиентами. От дней рождения до свадеб, мы делаем каждое празднование слаще.',
    exploreCreations: 'Исследуйте Наши Творения →',
    customOrders: 'Индивидуальные Заказы',
    ourCollections: 'Наши Коллекции',
    collectionsSubtitle: 'От небольших встреч до грандиозных торжеств',
    featuredCreations: 'Избранные Творения',
    featuredSubtitle: 'Самые любимые десерты этого сезона',
    addToCart: 'Добавить в Корзину',
    quantity: 'Количество',
    dealerPrice: 'Цена Дилера',
    retailPrice: 'Розничная Цена',
    cost: 'Себестоимость',
    profit: 'Прибыль',
    margin: 'Маржа',
    editPrice: 'Редактировать Цену',
    save: 'Сохранить',
    cancel: 'Отмена',
    edit: 'Редактировать',
    delete: 'Удалить',
    yourCart: 'Ваша Корзина',
    cartEmpty: 'Ваша корзина пуста',
    subtotal: 'Промежуточный Итог',
    proceedToCheckout: 'Перейти к Оформлению',
    remove: 'Удалить',
    checkout: 'Оформление Заказа',
    contactInfo: 'Контактная Информация',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Электронная Почта',
    phone: 'Телефон',
    delivery: 'Доставка',
    address: 'Адрес',
    date: 'Дата',
    time: 'Время',
    morning: 'Утро',
    afternoon: 'День',
    evening: 'Вечер',
    notes: 'Примечания',
    specialInstructions: 'Особые Инструкции',
    anyRequests: 'Любые особые пожелания...',
    orderSummary: 'Сводка Заказа',
    tax: 'Налог',
    total: 'Итого',
    placeOrder: 'Оформить Заказ',
    orderPlaced: 'Заказ Размещен!',
    orderPlacedMessage: 'Мы свяжемся с вами в ближайшее время для подтверждения.',
    continueShopping: 'Продолжить Покупки',
    addDessertsFirst: 'Сначала добавьте десерты!',
    browse: 'Просмотр',
    qty: 'Кол-во',
    welcomeBack: 'С Возвращением',
    joinUs: 'Присоединяйтесь',
    signInToAccount: 'Войдите в свой аккаунт',
    registerWithInvite: 'Регистрация по приглашению',
    signIn: 'Войти',
    signingIn: 'Входим...',
    register: 'Регистрация',
    password: 'Пароль',
    createPassword: 'Создать Пароль',
    fullName: 'Полное Имя',
    inviteToken: 'Токен Приглашения',
    enterInviteToken: 'Введите токен от администратора',
    adminLogin: 'Вход Администратора',
    testTokens: 'Тестовые Токены',
    dealer: 'Дилер',
    user: 'Пользователь',
    invalidCredentials: 'Неверные данные',
    loginSuccessful: 'Успешный вход! Перенаправление...',
    getInTouch: 'Связаться с Нами',
    contactSubtitle: 'Вопросы? Индивидуальные заказы? Мы рады помочь!',
    name: 'Имя',
    message: 'Сообщение',
    sendMessage: 'Отправить Сообщение',
    messageSent: 'Сообщение Отправлено!',
    messageSentConfirm: 'Мы ответим в течение 24 часов.',
    tellUsAboutDreamDessert: 'Расскажите о вашем идеальном десерте...',
    back: 'Назад',
    languageSettings: 'Настройки Языка',
    selectLanguage: 'Выберите Язык',
    currencySettings: 'Настройки Валюты',
    selectCurrency: 'Выберите Валюту',
    general: 'Общие',
    currencies: 'Валюты',
    addCurrency: 'Добавить Валюту',
    currencyCode: 'Код Валюты',
    currencyName: 'Название Валюты',
    symbol: 'Символ',
    exchangeRate: 'Курс Обмена',
    actions: 'Действия',
    adminDashboard: 'Панель Администратора',
    overview: 'Обзор',
    orders: 'Заказы',
    products: 'Товары',
    ingredients: 'Ингредиенты',
    invites: 'Приглашения',
    users: 'Пользователи',
    pendingOrders: 'Ожидающие Заказы',
    registeredUsers: 'Зарегистрированные Пользователи',
    totalRevenue: 'Общий Доход',
    thisWeek: 'Эта Неделя',
    recentOrders: 'Недавние Заказы',
    allOrders: 'Все Заказы',
    pending: 'Ожидает',
    inProgress: 'В Работе',
    ready: 'Готов',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
    customer: 'Клиент',
    items: 'Товары',
    status: 'Статус',
    createNewInvite: 'Создать Приглашение',
    emailOptional: 'Email (опционально)',
    leaveBlankForAnyEmail: 'Оставьте пустым для любого email',
    role: 'Роль',
    regularUser: 'Обычный Пользователь',
    expiresInDays: 'Истекает через (дней)',
    createInvite: 'Создать Приглашение',
    allInvites: 'Все Приглашения',
    noInvitesYet: 'Приглашений пока нет.',
    token: 'Токен',
    expires: 'Истекает',
    active: 'Активный',
    used: 'Использован',
    expired: 'Истек',
    any: 'Любой',
    noUsersYet: 'Пользователей пока нет.',
    registered: 'Зарегистрирован',
    productManagement: 'Управление Товарами',
    makingPrice: 'Цена Изготовления',
    ingredientManagement: 'Управление Ингредиентами',
    addIngredient: 'Добавить Ингредиент',
    ingredientName: 'Название Ингредиента',
    unit: 'Единица',
    pricePerUnit: 'Цена за Единицу',
    noIngredientsYet: 'Ингредиентов пока нет.',
    orderManagement: 'Управление Заказами',
    noOrdersYet: 'Заказов пока нет.',
    viewDetails: 'Подробнее',
    updateStatus: 'Обновить Статус',
    costAnalysis: 'Анализ Стоимости',
    showCostAnalysis: 'Показать Анализ',
    hideCostAnalysis: 'Скрыть Анализ',
    totalCost: 'Общая Стоимость',
    sellingPrice: 'Цена Продажи',
    profitMargin: 'Маржа Прибыли',
    noIngredientsListed: 'Ингредиенты не указаны',
    makingPriceLabor: 'Стоимость Работы',
    footerDescription: 'Сделано с любовью. Премиум ингредиенты для незабываемых праздников.',
    quickLinks: 'Быстрые Ссылки',
    collections: 'Коллекции',
    birthdayCakes: 'Торты на День Рождения',
    weddingCakes: 'Свадебные Торты',
    cupcakes: 'Капкейки',
    madeWithLove: 'Сделано с 💝',
    accessDenied: 'Доступ Запрещен',
    adminOnly: 'Только для администратора.',
    completed: 'Завершен',
    notUsed: 'Не используется',
    goToLogin: 'Перейти к Входу',
    backToHome: 'Вернуться на Главную',
    adminCredentials: 'Учетные Данные Администратора',
    pleaseLoginWithAdmin: 'Пожалуйста, войдите с учетными данными администратора.',
    createdToken: 'Создано! Токен:',
    remove: 'Удалить',
    update: 'Обновить',
    add: 'Добавить',
    editIngredient: 'Редактировать Ингредиент',
    addNewIngredient: 'Добавить Новый Ингредиент',
    deleteIngredientConfirm: 'Удалить этот ингредиент?',
    ingredientUsedInProducts: 'Этот ингредиент используется в {count} товаре(ах): {products}. Вы уверены, что хотите удалить его?',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    hi: 'Привет',
    required: 'Обязательно'
  },
  tr: {
    home: 'Ana Sayfa',
    ourCakes: 'Pastalarımız',
    contact: 'İletişim',
    admin: 'Yönetici',
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    settings: 'Ayarlar',
    cart: 'Sepet',
    heroTitle: 'Her Lokma',
    heroTitleEmphasis: 'Saf Aşk',
    heroDescription: 'Tutku ve en iyi malzemelerle yapılmış el yapımı zanaat tatlıları. Doğum günlerinden düğünlere, her kutlamayı daha tatlı yapıyoruz.',
    exploreCreations: 'Yaratımlarımızı Keşfet →',
    customOrders: 'Özel Siparişler',
    ourCollections: 'Koleksiyonlarımız',
    collectionsSubtitle: 'Samimi toplantılardan büyük kutlamalara',
    featuredCreations: 'Öne Çıkan Yaratımlar',
    featuredSubtitle: 'Bu sezonun en sevilen tatlıları',
    addToCart: 'Sepete Ekle',
    quantity: 'Miktar',
    dealerPrice: 'Bayi Fiyatı',
    retailPrice: 'Perakende Fiyatı',
    cost: 'Maliyet',
    profit: 'Kar',
    margin: 'Marj',
    editPrice: 'Fiyatı Düzenle',
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    yourCart: 'Sepetiniz',
    cartEmpty: 'Sepetiniz boş',
    subtotal: 'Ara Toplam',
    proceedToCheckout: 'Ödemeye Geç',
    remove: 'Kaldır',
    checkout: 'Ödeme',
    contactInfo: 'İletişim Bilgileri',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    phone: 'Telefon',
    delivery: 'Teslimat',
    address: 'Adres',
    date: 'Tarih',
    time: 'Saat',
    morning: 'Sabah',
    afternoon: 'Öğleden Sonra',
    evening: 'Akşam',
    notes: 'Notlar',
    specialInstructions: 'Özel Talimatlar',
    anyRequests: 'Özel istekleriniz...',
    orderSummary: 'Sipariş Özeti',
    tax: 'Vergi',
    total: 'Toplam',
    placeOrder: 'Sipariş Ver',
    orderPlaced: 'Sipariş Verildi!',
    orderPlacedMessage: 'Onaylamak için kısa süre içinde sizinle iletişime geçeceğiz.',
    continueShopping: 'Alışverişe Devam Et',
    addDessertsFirst: 'Önce tatlı ekleyin!',
    browse: 'Gözat',
    qty: 'Adet',
    welcomeBack: 'Tekrar Hoşgeldiniz',
    joinUs: 'Bize Katılın',
    signInToAccount: 'Hesabınıza giriş yapın',
    registerWithInvite: 'Davet koduyla kayıt olun',
    signIn: 'Giriş Yap',
    signingIn: 'Giriş Yapılıyor...',
    register: 'Kayıt Ol',
    password: 'Şifre',
    createPassword: 'Şifre Oluştur',
    fullName: 'Ad Soyad',
    inviteToken: 'Davet Kodu',
    enterInviteToken: 'Yöneticiden aldığınız kodu girin',
    adminLogin: 'Yönetici Girişi',
    testTokens: 'Test Kodları',
    dealer: 'Bayi',
    user: 'Kullanıcı',
    invalidCredentials: 'Geçersiz kimlik bilgileri',
    loginSuccessful: 'Giriş başarılı! Yönlendiriliyor...',
    getInTouch: 'İletişime Geçin',
    contactSubtitle: 'Sorularınız mı var? Özel siparişler? Sizden haber almak isteriz!',
    name: 'Ad',
    message: 'Mesaj',
    sendMessage: 'Mesaj Gönder',
    messageSent: 'Mesaj Gönderildi!',
    messageSentConfirm: '24 saat içinde yanıt vereceğiz.',
    tellUsAboutDreamDessert: 'Hayalinizdeki tatlıyı bize anlatın...',
    back: 'Geri',
    languageSettings: 'Dil Ayarları',
    selectLanguage: 'Dil Seçin',
    currencySettings: 'Para Birimi Ayarları',
    selectCurrency: 'Para Birimi Seçin',
    general: 'Genel',
    currencies: 'Para Birimleri',
    addCurrency: 'Para Birimi Ekle',
    currencyCode: 'Para Birimi Kodu',
    currencyName: 'Para Birimi Adı',
    symbol: 'Sembol',
    exchangeRate: 'Döviz Kuru',
    actions: 'İşlemler',
    adminDashboard: 'Yönetici Paneli',
    overview: 'Genel Bakış',
    orders: 'Siparişler',
    products: 'Ürünler',
    ingredients: 'Malzemeler',
    invites: 'Davetiyeler',
    users: 'Kullanıcılar',
    pendingOrders: 'Bekleyen Siparişler',
    registeredUsers: 'Kayıtlı Kullanıcılar',
    totalRevenue: 'Toplam Gelir',
    thisWeek: 'Bu Hafta',
    recentOrders: 'Son Siparişler',
    allOrders: 'Tüm Siparişler',
    pending: 'Bekliyor',
    inProgress: 'Hazırlanıyor',
    ready: 'Hazır',
    delivered: 'Teslim Edildi',
    cancelled: 'İptal Edildi',
    customer: 'Müşteri',
    items: 'Ürünler',
    status: 'Durum',
    createNewInvite: 'Yeni Davet Oluştur',
    emailOptional: 'E-posta (opsiyonel)',
    leaveBlankForAnyEmail: 'Herhangi bir e-posta için boş bırakın',
    role: 'Rol',
    regularUser: 'Normal Kullanıcı',
    expiresInDays: 'Geçerlilik (gün)',
    createInvite: 'Davet Oluştur',
    allInvites: 'Tüm Davetler',
    noInvitesYet: 'Henüz davet yok.',
    token: 'Kod',
    expires: 'Bitiş',
    active: 'Aktif',
    used: 'Kullanıldı',
    expired: 'Süresi Doldu',
    any: 'Herhangi',
    noUsersYet: 'Henüz kayıtlı kullanıcı yok.',
    registered: 'Kayıt Tarihi',
    productManagement: 'Ürün Yönetimi',
    makingPrice: 'Yapım Ücreti',
    ingredientManagement: 'Malzeme Yönetimi',
    addIngredient: 'Malzeme Ekle',
    ingredientName: 'Malzeme Adı',
    unit: 'Birim',
    pricePerUnit: 'Birim Fiyatı',
    noIngredientsYet: 'Henüz malzeme yok.',
    orderManagement: 'Sipariş Yönetimi',
    noOrdersYet: 'Henüz sipariş yok.',
    viewDetails: 'Detaylar',
    updateStatus: 'Durumu Güncelle',
    costAnalysis: 'Maliyet Analizi',
    showCostAnalysis: 'Analizi Göster',
    hideCostAnalysis: 'Analizi Gizle',
    totalCost: 'Toplam Maliyet',
    sellingPrice: 'Satış Fiyatı',
    profitMargin: 'Kar Marjı',
    noIngredientsListed: 'Malzeme listesi yok',
    makingPriceLabor: 'İşçilik Ücreti',
    footerDescription: 'Sevgiyle yapıldı. Unutulmaz kutlamalar için premium malzemeler.',
    quickLinks: 'Hızlı Bağlantılar',
    collections: 'Koleksiyonlar',
    birthdayCakes: 'Doğum Günü Pastaları',
    weddingCakes: 'Düğün Pastaları',
    cupcakes: 'Cupcake\'ler',
    madeWithLove: '💝 ile yapıldı',
    accessDenied: 'Erişim Engellendi',
    adminOnly: 'Sadece yönetici.',
    completed: 'Tamamlandı',
    notUsed: 'Kullanılmıyor',
    goToLogin: 'Girişe Git',
    backToHome: 'Ana Sayfaya Dön',
    adminCredentials: 'Yönetici Bilgileri',
    pleaseLoginWithAdmin: 'Lütfen yönetici bilgileriyle giriş yapın.',
    createdToken: 'Oluşturuldu! Kod:',
    remove: 'Kaldır',
    update: 'Güncelle',
    add: 'Ekle',
    editIngredient: 'Malzemeyi Düzenle',
    addNewIngredient: 'Yeni Malzeme Ekle',
    deleteIngredientConfirm: 'Bu malzemeyi silmek istediğinizden emin misiniz?',
    ingredientUsedInProducts: 'Bu malzeme {count} üründe kullanılıyor: {products}. Silmek istediğinizden emin misiniz?',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    hi: 'Merhaba',
    required: 'Zorunlu'
  },
  tk: {
    home: 'Baş Sahypa',
    ourCakes: 'Tortlarymyz',
    contact: 'Habarlaşmak',
    admin: 'Admin',
    login: 'Girmek',
    logout: 'Çykmak',
    settings: 'Sazlamalar',
    cart: 'Sebet',
    heroTitle: 'Her Bir Bölek',
    heroTitleEmphasis: 'Arassa Söýgi',
    heroDescription: 'Yhlasly we iň gowy ingredientler bilen elde ýasalan desertler. Doglan günlerden toýlara çenli, her bir baýramçylygy has süýji edýäris.',
    exploreCreations: 'Döredijiligimizi Gözden Geçiriň →',
    customOrders: 'Ýörite Sargytlar',
    ourCollections: 'Kolleksiýalarymyz',
    collectionsSubtitle: 'Kiçi ýygnanyşyklardan uly baýramçylyklara',
    featuredCreations: 'Saýlanan Döredijilik',
    featuredSubtitle: 'Bu möwsümiň iň söýgüli desertleri',
    addToCart: 'Sebede Goş',
    quantity: 'Mukdar',
    dealerPrice: 'Diler Bahasy',
    retailPrice: 'Bölek Satuw Bahasy',
    cost: 'Bahasy',
    profit: 'Peýda',
    margin: 'Marja',
    editPrice: 'Bahany Üýtget',
    save: 'Sakla',
    cancel: 'Ýatyr',
    edit: 'Üýtget',
    delete: 'Poz',
    yourCart: 'Siziň Sebediňiz',
    cartEmpty: 'Sebediňiz boş',
    subtotal: 'Ara Jemi',
    proceedToCheckout: 'Töleg Et',
    remove: 'Aýyr',
    checkout: 'Töleg',
    contactInfo: 'Habarlaşmak Maglumatlary',
    firstName: 'Ady',
    lastName: 'Familiýasy',
    email: 'E-poçta',
    phone: 'Telefon',
    delivery: 'Eltip Bermek',
    address: 'Salgy',
    date: 'Sene',
    time: 'Wagt',
    morning: 'Irden',
    afternoon: 'Günortan',
    evening: 'Agşam',
    notes: 'Bellikler',
    specialInstructions: 'Ýörite Görkezmeler',
    anyRequests: 'Ýörite haýyşlar...',
    orderSummary: 'Sargyt Jemi',
    tax: 'Salgyt',
    total: 'Jemi',
    placeOrder: 'Sargyt Ber',
    orderPlaced: 'Sargyt Berildi!',
    orderPlacedMessage: 'Tassyklamak üçin gysga wagtda siz bilen habarlaşarys.',
    continueShopping: 'Söwda Dowam Et',
    addDessertsFirst: 'Ilki desert goşuň!',
    browse: 'Göz at',
    qty: 'San',
    welcomeBack: 'Hoş Geldiňiz',
    joinUs: 'Bize Goşulyň',
    signInToAccount: 'Hasabyňyza giriň',
    registerWithInvite: 'Çakylyk bilen hasaba alyň',
    signIn: 'Gir',
    signingIn: 'Girilýär...',
    register: 'Hasaba Al',
    password: 'Açar söz',
    createPassword: 'Açar söz dörediň',
    fullName: 'Doly Ady',
    inviteToken: 'Çakylyk Kody',
    enterInviteToken: 'Admindan alnan kody giriziň',
    adminLogin: 'Admin Girişi',
    testTokens: 'Synag Kodlary',
    dealer: 'Diler',
    user: 'Ulanyjy',
    invalidCredentials: 'Nädogry maglumatlar',
    loginSuccessful: 'Üstünlikli giriş! Ugradylýar...',
    getInTouch: 'Habarlaşyň',
    contactSubtitle: 'Soraglaryňyz barmy? Ýörite sargytlar? Sizden eşitmek isleýäris!',
    name: 'Ady',
    message: 'Habar',
    sendMessage: 'Habar Iber',
    messageSent: 'Habar Iberildi!',
    messageSentConfirm: '24 sagadyň içinde jogap bereris.',
    tellUsAboutDreamDessert: 'Arzuw edýän desertiňiz barada aýdyň...',
    back: 'Yza',
    languageSettings: 'Dil Sazlamalary',
    selectLanguage: 'Dil Saýla',
    currencySettings: 'Pul Birligi Sazlamalary',
    selectCurrency: 'Pul Birligi Saýla',
    general: 'Umumy',
    currencies: 'Pul Birlikleri',
    addCurrency: 'Pul Birligi Goş',
    currencyCode: 'Pul Birligi Kody',
    currencyName: 'Pul Birligi Ady',
    symbol: 'Nyşan',
    exchangeRate: 'Alyş-çalyş Kursy',
    actions: 'Hereketler',
    adminDashboard: 'Admin Paneli',
    overview: 'Syn',
    orders: 'Sargytlar',
    products: 'Önümler',
    ingredients: 'Ingredientler',
    invites: 'Çakylyklar',
    users: 'Ulanyjylar',
    pendingOrders: 'Garaşylýan Sargytlar',
    registeredUsers: 'Hasaba Alnan Ulanyjylar',
    totalRevenue: 'Jemi Girdeji',
    thisWeek: 'Bu Hepde',
    recentOrders: 'Soňky Sargytlar',
    allOrders: 'Ähli Sargytlar',
    pending: 'Garaşylýar',
    inProgress: 'Taýýarlanýar',
    ready: 'Taýýar',
    delivered: 'Gowşuryldy',
    cancelled: 'Ýatyryldy',
    customer: 'Müşderi',
    items: 'Harytlar',
    status: 'Ýagdaý',
    createNewInvite: 'Täze Çakylyk Döret',
    emailOptional: 'E-poçta (hökmany däl)',
    leaveBlankForAnyEmail: 'Islendik e-poçta üçin boş goýuň',
    role: 'Rol',
    regularUser: 'Adaty Ulanyjy',
    expiresInDays: 'Möhleti (gün)',
    createInvite: 'Çakylyk Döret',
    allInvites: 'Ähli Çakylyklar',
    noInvitesYet: 'Entek çakylyk ýok.',
    token: 'Kod',
    expires: 'Möhleti',
    active: 'Işjeň',
    used: 'Ulanyldy',
    expired: 'Möhleti Geçdi',
    any: 'Islendik',
    noUsersYet: 'Entek hasaba alnan ulanyjy ýok.',
    registered: 'Hasaba Alyndy',
    productManagement: 'Önüm Dolandyryşy',
    makingPrice: 'Ýasama Bahasy',
    ingredientManagement: 'Ingredient Dolandyryşy',
    addIngredient: 'Ingredient Goş',
    ingredientName: 'Ingredient Ady',
    unit: 'Birlik',
    pricePerUnit: 'Birlik Bahasy',
    noIngredientsYet: 'Entek ingredient ýok.',
    orderManagement: 'Sargyt Dolandyryşy',
    noOrdersYet: 'Entek sargyt ýok.',
    viewDetails: 'Jikme-jiklikler',
    updateStatus: 'Ýagdaýy Täzele',
    costAnalysis: 'Baha Derňewi',
    showCostAnalysis: 'Derňewi Görkez',
    hideCostAnalysis: 'Derňewi Gizle',
    totalCost: 'Jemi Baha',
    sellingPrice: 'Satuw Bahasy',
    profitMargin: 'Peýda Marjasy',
    noIngredientsListed: 'Ingredient sanawda ýok',
    makingPriceLabor: 'Zähmet Bahasy',
    footerDescription: 'Söýgi bilen ýasaldy. Ýatdan çykmajak baýramçylyklar üçin premium ingredientler.',
    quickLinks: 'Çalt Baglanyşyklar',
    collections: 'Kolleksiýalar',
    birthdayCakes: 'Doglan Gün Tortlary',
    weddingCakes: 'Toý Tortlary',
    cupcakes: 'Kapkeýkler',
    madeWithLove: '💝 bilen ýasaldy',
    accessDenied: 'Giriş Gadagan',
    adminOnly: 'Diňe admin üçin.',
    completed: 'Tamamlandy',
    notUsed: 'Ulanylmadyk',
    goToLogin: 'Girişe Git',
    backToHome: 'Baş Sahypa',
    adminCredentials: 'Admin Maglumatlary',
    pleaseLoginWithAdmin: 'Admin maglumatlary bilen giriň.',
    createdToken: 'Döredildi! Kod:',
    remove: 'Aýyr',
    update: 'Täzele',
    add: 'Goş',
    editIngredient: 'Ingredienti Üýtget',
    addNewIngredient: 'Täze Ingredient Goş',
    deleteIngredientConfirm: 'Bu ingredienti pozmak isleýärsiňizmi?',
    ingredientUsedInProducts: 'Bu ingredient {count} önümde ulanylyar: {products}. Pozmak isleýärsiňizmi?',
    loading: 'Ýüklenýär...',
    error: 'Ýalňyşlyk',
    success: 'Üstünlik',
    hi: 'Salam',
    required: 'Hökmany'
  }
};

const TranslationContext = createContext();
const useTranslation = () => useContext(TranslationContext);

const TranslationProvider = ({ children, language }) => {
  const t = (key) => {
    const lang = language || 'en';
    return translations[lang]?.[key] || translations['en'][key] || key;
  };
  return <TranslationContext.Provider value={{ t, language: language || 'en' }}>{children}</TranslationContext.Provider>;
};

// ============================================
// CONTEXTS
// ============================================

const CartContext = createContext();
const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
    setIsOpen(true);
  };

  const updateQuantity = (id, qty) => qty <= 0 ? setItems(prev => prev.filter(i => i.product.id !== id)) : setItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  const removeItem = (id) => setItems(prev => prev.filter(i => i.product.id !== id));
  const clearCart = () => setItems([]);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, itemCount, isOpen, setIsOpen }}>{children}</CartContext.Provider>;
};

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('public');
  const [invites, setInvites] = useState(mockInvites);
  const [users, setUsers] = useState(mockUsers);
  const [authVersion, setAuthVersion] = useState(0); // Force re-render trigger

  useEffect(() => {
    const saved = localStorage.getItem('soulmate_user');
    if (saved) { 
      try {
        const p = JSON.parse(saved); 
        setUser(p); 
        setRole(p.role || 'public'); 
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('soulmate_user');
      }
    }
  }, []);

  const login = (email, password) => {
    if (email.toLowerCase() === ADMIN.email && password === ADMIN.password) {
      const u = { email: ADMIN.email, name: ADMIN.name, role: 'admin' };
      localStorage.setItem('soulmate_user', JSON.stringify(u));
      setUser(u); 
      setRole('admin'); 
      setAuthVersion(v => v + 1); // Force re-render
      return { success: true };
    }
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const u = { email: found.email, name: found.name, role: found.role };
      localStorage.setItem('soulmate_user', JSON.stringify(u));
      setUser(u); 
      setRole(found.role); 
      setAuthVersion(v => v + 1); // Force re-render
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const registerWithInvite = (token, name, email, password, phone = '') => {
    const invite = invites.find(i => i.token === token && !i.used && new Date(i.expiresAt) > new Date());
    if (!invite) return { success: false, error: 'Invalid or expired invite token' };
    if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) return { success: false, error: 'This invite is for a different email' };
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return { success: false, error: 'Email already registered' };
    
    const newUser = { id: Date.now().toString(), email, password, name, phone: phone || '', role: invite.role, createdAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]); mockUsers.push(newUser);
    setInvites(prev => prev.map(i => i.id === invite.id ? { ...i, used: true } : i));
    
    const u = { email, name, phone: phone || '', role: invite.role };
    localStorage.setItem('soulmate_user', JSON.stringify(u));
    setUser(u); 
    setRole(invite.role); 
    setAuthVersion(v => v + 1); // Force re-render
    return { success: true, role: invite.role };
  };

  const createInvite = (email, role, days = 7) => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const exp = new Date(); exp.setDate(exp.getDate() + days);
    const inv = { id: Date.now().toString(), token, email: email || '', role, used: false, expiresAt: exp.toISOString() };
    setInvites(prev => [...prev, inv]); mockInvites.push(inv);
    return { success: true, invite: inv };
  };

  const deleteInvite = (id) => { setInvites(prev => prev.filter(i => i.id !== id)); return { success: true }; };
  const deleteUser = (id) => { setUsers(prev => prev.filter(u => u.id !== id)); return { success: true }; };
  const logout = () => { 
    setUser(null); 
    setRole('public'); 
    localStorage.removeItem('soulmate_user'); 
    setAuthVersion(v => v + 1); // Force re-render
  };

  const isAdmin = role === 'admin';
  const isDealer = role === 'dealer' || role === 'admin';

  return <AuthContext.Provider value={{ user, role, login, logout, registerWithInvite, createInvite, deleteInvite, deleteUser, invites, users, isDealer, isAdmin, authVersion }}>{children}</AuthContext.Provider>;
};

// ============================================
// STYLES
// ============================================

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--cream:#FDF8F4;--blush:#F8E8E0;--rose:#E9D0C8;--terracotta:#D4856A;--chocolate:#5C4033;--espresso:#2C1810;--gold:#C9A86A;--sage:#8FA87A;--mauve:#B8929A}
body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--espresso);line-height:1.6}
.app{min-height:100vh;background:radial-gradient(ellipse at 10% 10%,rgba(248,232,224,0.8) 0%,transparent 40%),radial-gradient(ellipse at 90% 90%,rgba(233,208,200,0.5) 0%,transparent 40%),var(--cream)}
.header{position:sticky;top:0;z-index:100;background:rgba(253,248,244,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(44,24,16,0.08)}
.header-inner{max-width:1400px;margin:0 auto;padding:1.25rem 2rem;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1rem}
.logo{font-family:'Playfair Display',serif;font-size:1.75rem;font-weight:600;color:var(--espresso);text-decoration:none;display:flex;align-items:center;gap:0.5rem;cursor:pointer;transition:opacity 0.2s}
.logo:hover{opacity:0.8}
.logo img{height:80px;width:auto;object-fit:contain;max-width:400px;display:block}
.logo img:first-of-type{height:70px;margin-right:0.75rem}
.logo span{color:var(--terracotta);font-style:italic}
.nav{display:flex;gap:2.5rem;align-items:center;justify-self:center}
.nav-link{font-size:1.2rem;font-weight:500;color:var(--chocolate);cursor:pointer;transition:color 0.3s;position:relative}
.nav-link:hover{color:var(--terracotta)}
.nav-link::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:var(--terracotta);transition:width 0.3s}
.nav-link:hover::after{width:100%}
.nav-actions{display:flex;gap:1rem;align-items:center;justify-self:end}
.user-info{font-size:0.9rem;color:var(--chocolate)}
.user-info strong{color:var(--terracotta)}
.badge{font-size:0.65rem;padding:0.2rem 0.5rem;border-radius:50px;margin-left:0.5rem;font-weight:600;text-transform:uppercase}
.badge.admin{background:linear-gradient(135deg,var(--gold),#E8D5A3);color:var(--espresso)}
.badge.dealer{background:var(--sage);color:white}
.cart-btn{position:relative;background:none;border:none;cursor:pointer;padding:0.5rem;font-size:1.8rem;transition:transform 0.2s}
.cart-btn:hover{transform:scale(1.15)}
.cart-badge{position:absolute;top:-4px;right:-4px;background:var(--terracotta);color:white;font-size:0.7rem;font-weight:600;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.hero{position:relative;min-height:85vh;display:flex;align-items:center;overflow:hidden}
.hero-content{max-width:1400px;margin:0 auto;padding:4rem 2rem;display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
.hero-text h1{font-family:'Playfair Display',serif;font-size:3.75rem;font-weight:500;line-height:1.15;color:var(--espresso);margin-bottom:1.5rem}
.hero-text h1 em{color:var(--terracotta);font-style:italic}
.hero-text p{font-size:1.1rem;color:var(--chocolate);margin-bottom:2.5rem;max-width:480px;opacity:0.85}
.hero-cta{display:flex;gap:1rem;flex-wrap:wrap}
.btn{padding:1rem 2rem;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:0.95rem;font-weight:500;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-flex;align-items:center;gap:0.5rem;border:2px solid transparent}
.btn-primary{background:linear-gradient(135deg,var(--espresso),var(--chocolate));color:var(--cream);border-color:var(--espresso)}
.btn-primary:hover{background:linear-gradient(135deg,var(--terracotta),var(--mauve));border-color:var(--terracotta);transform:translateY(-3px);box-shadow:0 15px 40px rgba(212,133,106,0.35)}
.btn-secondary{background:transparent;color:var(--espresso);border:2px solid var(--chocolate)}
.btn-secondary:hover{background:var(--espresso);color:var(--cream)}
.btn-small{padding:0.5rem 1rem;font-size:1rem}
.btn-danger{background:#DC3545;color:white;border-color:#DC3545}
.hero-image-wrapper{border-radius:180px 180px 30px 30px;overflow:hidden;box-shadow:0 50px 100px rgba(44,24,16,0.12)}
.hero-image-wrapper img{width:100%;height:550px;object-fit:cover}
.section{padding:5rem 2rem;max-width:1400px;margin:0 auto}
.section-header{text-align:center;margin-bottom:4rem}
.section-header h2{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:500;color:var(--espresso);margin-bottom:1rem}
.section-header p{color:var(--chocolate);opacity:0.75}
.categories-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
.category-card{background:white;border-radius:24px;padding:2rem 1.5rem;text-align:center;cursor:pointer;transition:all 0.4s;border:2px solid transparent}
.category-card:hover{transform:translateY(-8px);box-shadow:0 25px 50px rgba(212,133,106,0.15)}
.category-card.active{border-color:var(--terracotta);background:var(--blush)}
.category-icon{font-size:2.5rem;margin-bottom:0.75rem;display:block}
.category-name{font-family:'Playfair Display',serif;font-size:1.15rem;font-weight:600;color:var(--espresso)}
.products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2rem}
.product-card{background:white;border-radius:24px;overflow:hidden;transition:all 0.4s;cursor:pointer}
.product-card:hover{transform:translateY(-10px);box-shadow:0 35px 70px rgba(44,24,16,0.12)}
.product-image{position:relative;height:260px;overflow:hidden}
.product-image img{width:100%;height:100%;object-fit:cover;transition:transform 0.7s}
.product-card:hover .product-image img{transform:scale(1.1)}
.product-tag{position:absolute;top:1rem;left:1rem;background:var(--espresso);color:var(--cream);padding:0.4rem 1rem;border-radius:50px;font-size:0.7rem;font-weight:600;text-transform:uppercase}
.product-tag.bestseller{background:linear-gradient(135deg,#C9A86A,#E8D5A3);color:var(--espresso)}
.product-content{padding:1.5rem}
.product-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:600;color:var(--espresso);margin-bottom:0.5rem}
.product-description{font-size:0.9rem;color:var(--chocolate);opacity:0.75;margin-bottom:1rem}
.product-footer{display:flex;justify-content:space-between;align-items:center}
.product-price{font-size:1.4rem;font-weight:600;color:var(--terracotta)}
.product-price small{display:block;font-size:0.75rem;color:var(--sage);font-weight:500}
.add-btn{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--espresso),var(--chocolate));color:white;border:none;cursor:pointer;font-size:1.2rem;display:flex;align-items:center;justify-content:center;transition:all 0.3s}
.add-btn:hover{background:linear-gradient(135deg,var(--terracotta),var(--mauve));transform:scale(1.1) rotate(90deg)}
.cart-overlay{position:fixed;inset:0;background:rgba(44,24,16,0.5);backdrop-filter:blur(4px);z-index:200;opacity:0;visibility:hidden;transition:all 0.3s}
.cart-overlay.open{opacity:1;visibility:visible}
.cart-drawer{position:fixed;top:0;right:0;bottom:0;width:420px;max-width:100%;background:#FFFEFA;z-index:201;transform:translateX(100%);transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);display:flex;flex-direction:column}
.cart-drawer.open{transform:translateX(0)}
.cart-header{padding:1.5rem 2rem;border-bottom:1px solid var(--blush);display:flex;justify-content:space-between;align-items:center}
.cart-header h3{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:600}
.cart-close{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--chocolate);transition:all 0.2s}
.cart-close:hover{color:var(--terracotta);transform:rotate(90deg)}
.cart-items{flex:1;overflow-y:auto;padding:1.5rem 2rem}
.cart-item{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--blush)}
.cart-item-img{width:75px;height:75px;border-radius:12px;overflow:hidden}
.cart-item-img img{width:100%;height:100%;object-fit:cover}
.cart-item-details{flex:1}
.cart-item-name{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;margin-bottom:0.25rem}
.cart-item-price{color:var(--terracotta);font-weight:600}
.cart-item-qty{display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem}
.qty-btn{width:28px;height:28px;border-radius:50%;border:1px solid var(--rose);background:white;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
.qty-btn:hover{background:var(--blush)}
.cart-item-remove{background:none;border:none;color:var(--rose);cursor:pointer;font-size:0.8rem;margin-top:0.5rem}
.cart-item-remove:hover{color:var(--terracotta);text-decoration:underline}
.cart-empty{text-align:center;padding:4rem 2rem;color:var(--chocolate)}
.cart-empty-icon{font-size:3.5rem;margin-bottom:1rem;opacity:0.4}
.cart-footer{padding:1.5rem 2rem;border-top:1px solid var(--blush);background:white}
.cart-subtotal{display:flex;justify-content:space-between;margin-bottom:1rem;font-size:1.1rem}
.cart-subtotal strong{font-family:'Playfair Display',serif;font-size:1.4rem;color:var(--terracotta)}
.checkout-btn{width:100%;padding:1.1rem;background:linear-gradient(135deg,var(--espresso),var(--chocolate));color:white;border:none;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:500;cursor:pointer;transition:all 0.3s}
.checkout-btn:hover{background:linear-gradient(135deg,var(--terracotta),var(--mauve));transform:translateY(-2px)}
.modal-overlay{position:fixed;inset:0;background:rgba(44,24,16,0.7);backdrop-filter:blur(8px);z-index:300;display:flex;align-items:center;justify-content:center;padding:2rem;opacity:0;visibility:hidden;transition:all 0.3s}
.modal-overlay.open{opacity:1;visibility:visible}
.modal{background:white;border-radius:28px;max-width:850px;width:100%;max-height:90vh;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;transform:scale(0.9);transition:transform 0.3s;position:relative}
.modal-overlay.open .modal{transform:scale(1)}
.modal-img{height:100%;min-height:450px}
.modal-img img{width:100%;height:100%;object-fit:cover}
.modal-content{padding:2.5rem;display:flex;flex-direction:column}
.modal-close{position:absolute;top:1rem;right:1rem;background:white;border:none;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:1.2rem;box-shadow:0 4px 15px rgba(0,0,0,0.1);transition:all 0.2s;z-index:10}
.modal-close:hover{transform:scale(1.1) rotate(90deg)}
.modal-title{font-family:'Playfair Display',serif;font-size:2rem;font-weight:600;color:var(--espresso);margin-bottom:1rem}
.modal-desc{color:var(--chocolate);line-height:1.7;margin-bottom:1.5rem;opacity:0.85}
.modal-price{font-size:1.75rem;font-weight:600;color:var(--terracotta);margin-bottom:1.5rem}
.modal-qty{display:flex;align-items:center;gap:1.5rem;margin-bottom:2rem}
.modal-qty label{font-weight:500}
.modal-qty-controls{display:flex;align-items:center;gap:1rem;background:var(--blush);padding:0.5rem 1rem;border-radius:50px}
.modal-qty-btn{width:36px;height:36px;border-radius:50%;border:none;background:white;cursor:pointer;font-size:1.2rem;transition:all 0.2s}
.modal-qty-btn:hover{background:var(--espresso);color:white}
.modal-qty-value{font-size:1.2rem;font-weight:600;min-width:30px;text-align:center}
.modal-add-btn{margin-top:auto;padding:1.1rem 2rem;background:linear-gradient(135deg,var(--espresso),var(--chocolate));color:white;border:none;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:500;cursor:pointer;transition:all 0.3s}
.modal-add-btn:hover{background:linear-gradient(135deg,var(--terracotta),var(--mauve));transform:translateY(-3px)}
.page{max-width:1000px;margin:0 auto;padding:4rem 2rem}
.page-header{text-align:center;margin-bottom:3rem}
.page-header h1{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:500;color:var(--espresso);margin-bottom:0.75rem}
.page-header p{color:var(--chocolate);opacity:0.75}
.form-card{background:white;padding:2.5rem;border-radius:24px;box-shadow:0 20px 60px rgba(44,24,16,0.06)}
.form-section{margin-bottom:2rem}
.form-section h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:1.5rem;color:var(--espresso);padding-bottom:0.75rem;border-bottom:2px solid var(--blush)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.form-group{margin-bottom:1rem}
.form-group.full{grid-column:1/-1}
.form-group label{display:block;font-weight:500;margin-bottom:0.5rem;color:var(--chocolate);font-size:0.9rem}
.form-group input,.form-group textarea,.form-group select{width:100%;padding:1rem;border:2px solid var(--blush);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:1rem;transition:border-color 0.2s;background:rgba(255,255,255,0.8);color:var(--espresso)}
.form-group input:focus,.form-group textarea:focus,.form-group select:focus{outline:none;border-color:var(--terracotta);background:white}
.form-group textarea{resize:vertical;min-height:100px}
.form-error{color:#d64545;font-size:0.85rem;margin-top:0.5rem;padding:0.75rem;background:#FFF5F5;border-radius:8px}
.form-success{color:#28a745;font-size:0.85rem;margin-top:0.5rem;padding:0.75rem;background:#F0FFF4;border-radius:8px}
.form-submit{width:100%;padding:1.1rem;background:linear-gradient(135deg,var(--espresso),var(--chocolate));color:white;border:none;border-radius:50px;font-family:'DM Sans',sans-serif;font-size:1rem;font-weight:500;cursor:pointer;transition:all 0.3s;margin-top:1rem}
.form-submit:hover{background:linear-gradient(135deg,var(--terracotta),var(--mauve));transform:translateY(-2px)}
.tabs{display:flex;gap:0.5rem;margin-bottom:2rem;border-bottom:2px solid var(--blush)}
.tab{padding:1rem 1.5rem;background:none;border:none;font-family:'DM Sans',sans-serif;font-size:0.95rem;font-weight:500;color:var(--chocolate);cursor:pointer;position:relative}
.tab:hover{color:var(--terracotta)}
.tab.active{color:var(--terracotta)}
.tab.active::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--terracotta)}
.admin-table{width:100%;border-collapse:collapse}
.admin-table th,.admin-table td{padding:1rem;text-align:left;border-bottom:1px solid var(--blush)}
.admin-table th{font-weight:600;color:var(--chocolate);font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em}
.admin-table tr:hover{background:var(--blush)}
.token{font-family:monospace;background:var(--blush);padding:0.35rem 0.75rem;border-radius:6px;font-size:0.9rem}
.status{display:inline-block;padding:0.25rem 0.75rem;border-radius:50px;font-size:0.75rem;font-weight:600;text-transform:uppercase}
.status.active{background:#D4EDDA;color:#155724}
.status.used{background:#F8D7DA;color:#721C24}
.status.expired{background:#FFF3CD;color:#856404}
.checkout-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:2.5rem;align-items:start}
.checkout-summary{background:white;padding:2rem;border-radius:24px;position:sticky;top:120px}
.checkout-summary h3{font-family:'Playfair Display',serif;font-size:1.3rem;margin-bottom:1.5rem}
.summary-item{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--blush)}
.summary-item-img{width:60px;height:60px;border-radius:10px;overflow:hidden}
.summary-item-img img{width:100%;height:100%;object-fit:cover}
.summary-item-details{flex:1}
.summary-item-name{font-weight:500;margin-bottom:0.25rem}
.summary-item-qty{font-size:0.85rem;color:var(--chocolate);opacity:0.7}
.summary-item-price{font-weight:600;color:var(--terracotta)}
.summary-totals{margin-top:1.5rem;padding-top:1.5rem;border-top:2px solid var(--blush)}
.summary-row{display:flex;justify-content:space-between;margin-bottom:0.75rem;color:var(--chocolate)}
.summary-row.total{font-size:1.2rem;font-weight:600;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--blush);color:var(--espresso)}
.summary-row.total span:last-child{color:var(--terracotta)}
.success-msg{text-align:center;padding:4rem 2rem}
.success-icon{font-size:4.5rem;margin-bottom:1.5rem}
.success-msg h2{font-family:'Playfair Display',serif;font-size:2.25rem;margin-bottom:1rem;color:var(--espresso)}
.success-msg p{color:var(--chocolate);margin-bottom:2rem;opacity:0.75}
.footer{background:linear-gradient(180deg,var(--espresso) 0%,#1a0f0a 100%);color:var(--cream);padding:4rem 2rem 2rem;margin-top:4rem}
.footer-content{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem}
.footer-brand h3{font-family:'Playfair Display',serif;font-size:1.5rem;margin-bottom:1rem}
.footer-brand p{opacity:0.65;line-height:1.7;max-width:280px}
.footer-section h4{font-size:0.85rem;font-weight:600;margin-bottom:1.25rem;text-transform:uppercase;letter-spacing:0.1em;opacity:0.9}
.footer-section ul{list-style:none}
.footer-section li{margin-bottom:0.6rem}
.footer-section a{color:var(--cream);text-decoration:none;opacity:0.65;cursor:pointer;transition:opacity 0.2s}
.footer-section a:hover{opacity:1}
.footer-bottom{max-width:1400px;margin:3rem auto 0;padding-top:2rem;border-top:1px solid rgba(253,248,244,0.15);text-align:center;opacity:0.5;font-size:0.9rem}
@media(max-width:1024px){.hero-content{grid-template-columns:1fr;text-align:center}.hero-text h1{font-size:3rem}.hero-cta{justify-content:center}.hero-image{display:none}.categories-grid{grid-template-columns:repeat(2,1fr)}.checkout-grid{grid-template-columns:1fr}.modal{grid-template-columns:1fr}.modal-img{min-height:220px}}
@media(max-width:768px){.nav{display:none}.hero-text h1{font-size:2.25rem}.section{padding:3rem 1.5rem}.categories-grid{gap:1rem}.products-grid{grid-template-columns:1fr}.footer-content{grid-template-columns:1fr;text-align:center}.form-row{grid-template-columns:1fr}}
`;

// ============================================
// COMPONENTS
// ============================================

const LoginModal = ({ isOpen, onClose, onNavigate }) => {
  const { login, registerWithInvite } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', password: '', token: '', phone: '' });
      setError('');
      setSuccess('');
      setMode('login');
    }
  }, [isOpen]);

  const handleLogin = e => {
    e.preventDefault(); 
    setError('');
    const r = login(form.email, form.password);
    if (r.success) {
      setSuccess('Login successful!');
      // Check localStorage directly for the role since state may not be updated yet
      const savedUser = localStorage.getItem('soulmate_user');
      const isAdminUser = savedUser && JSON.parse(savedUser).role === 'admin';
      
      // Close modal first, then navigate
      onClose();
      
      // Use setTimeout to ensure React has time to process the auth state change
      setTimeout(() => {
        if (isAdminUser) {
          onNavigate('admin');
        } else {
          onNavigate('home');
        }
      }, 100);
    } else {
      setError(r.error);
    }
  };

  const handleRegister = e => {
    e.preventDefault(); setError('');
    if (!form.token.trim()) return setError('Enter invite token');
    if (!form.name.trim()) return setError('Enter your name');
    const r = registerWithInvite(form.token.trim().toUpperCase(), form.name, form.email, form.password, form.phone);
    if (r.success) { 
      setSuccess(`Welcome! You're registered as ${r.role}.`); 
      onClose();
      setTimeout(() => { 
        onNavigate('home'); 
      }, 100); 
    }
    else setError(r.error);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal" style={{maxWidth:'500px',gridTemplateColumns:'1fr'}} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-content">
          <h2 className="modal-title" style={{textAlign:'center',marginBottom:'0.5rem'}}>{mode === 'login' ? 'Welcome Back' : 'Join Us'}</h2>
          <p style={{textAlign:'center',color:'var(--chocolate)',opacity:0.7,marginBottom:'2rem'}}>{mode === 'login' ? 'Sign in to your account' : 'Register with invite token'}</p>
          <div className="tabs" style={{marginBottom:'1.5rem'}}>
            <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>Login</button>
            <button className={`tab ${mode === 'invite' ? 'active' : ''}`} onClick={() => { setMode('invite'); setError(''); setSuccess(''); }}>Register</button>
          </div>
          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="form-submit">Sign In</button>
              <div style={{marginTop:'1.5rem',padding:'1rem',background:'var(--blush)',borderRadius:'12px',fontSize:'0.85rem'}}><strong>🔐 Admin:</strong> admin@soulmate.com / Admin@2024!</div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-group"><label>Invite Token *</label><input type="text" value={form.token} onChange={e => setForm({...form, token: e.target.value.toUpperCase()})} placeholder="XXXXXXXX" style={{textTransform:'uppercase',fontFamily:'monospace'}} required /></div>
              <div className="form-group"><label>Full Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+1 (555) 123-4567" /></div>
              <div className="form-group"><label>Create Password *</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              {error && <p className="form-error">{error}</p>}
              {success && <p className="form-success">{success}</p>}
              <button type="submit" className="form-submit">Register</button>
              <div style={{marginTop:'1.5rem',padding:'1rem',background:'var(--blush)',borderRadius:'12px',fontSize:'0.85rem'}}><strong>📧 Test Tokens:</strong><br/><code style={{background:'white',padding:'0.2rem 0.5rem',borderRadius:'4px'}}>DEALER2024</code> — Dealer<br/><code style={{background:'white',padding:'0.2rem 0.5rem',borderRadius:'4px'}}>USER2024</code> — User</div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Header = ({ onNavigate }) => {
  const { itemCount, setIsOpen } = useCart();
  const { user, logout, isAdmin, isDealer } = useAuth();
  const { t } = useTranslation();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={() => onNavigate('home')}>
          <img src="/logo2.png" alt="Soulmate Desserts Characters" style={{height:'70px',width:'auto',objectFit:'contain',marginRight:'0.75rem'}} />
          <img src="/Soulmate.png" alt="Soulmate Desserts" />
        </div>
        <nav className="nav">
          <span className="nav-link" onClick={() => onNavigate('home')}>{t('home')}</span>
          <span className="nav-link" onClick={() => onNavigate('catalog')}>{t('ourCakes')}</span>
          <span className="nav-link" onClick={() => onNavigate('contact')}>{t('contact')}</span>
          {isAdmin && <span className="nav-link" onClick={() => onNavigate('admin')} style={{color:'var(--terracotta)',fontWeight:600}}>{t('admin')}</span>}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-info">{t('hi')}, <strong>{user.name?.split(' ')[0]}</strong>
                {isAdmin && user.name?.toLowerCase() !== 'admin' && <span className="badge admin">{t('admin')}</span>}
                {isDealer && !isAdmin && <span className="badge dealer">{t('dealer')}</span>}
              </span>
              <span className="nav-link" onClick={logout}>{t('logout')}</span>
            </>
            ) : (
              <button className="btn btn-primary btn-small" onClick={() => setShowLogin(true)} style={{padding:'0.8rem 2rem',fontSize:'1.1rem'}}>{t('login')}</button>
            )}
          <button className="cart-btn" onClick={() => onNavigate('settings')} style={{fontSize:'1.8rem'}} title={t('settings')}>⚙️</button>
          <button className="cart-btn" onClick={() => setIsOpen(true)}>🛒{itemCount > 0 && <span className="cart-badge">{itemCount}</span>}</button>
        </div>
      </div>
    </header>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onNavigate={onNavigate} />
    </>
  );
};

const Hero = ({ onNavigate }) => {
  const { t } = useTranslation();
  return (
  <section className="hero">
    <div className="hero-content">
      <div className="hero-text">
          <h1>{t('heroTitle')} <em>{t('heroTitleEmphasis')}</em></h1>
          <p>{t('heroDescription')}</p>
        <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => onNavigate('catalog')}>{t('exploreCreations')}</button>
            <button className="btn btn-secondary" onClick={() => onNavigate('contact')}>{t('customOrders')}</button>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-image-wrapper">
          <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800" alt="Cake" />
        </div>
      </div>
    </div>
  </section>
);
};

const ProductCard = ({ product, onClick, onAdd, ingredients, formatCurrency }) => {
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const price = product.price;
  const costPrice = calculateCostPrice(product, ingredients);
  const profit = price - costPrice;
  const profitMargin = costPrice ? ((profit / price) * 100).toFixed(1) : 0;
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);
  
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-image">
        <img src={product.images[0]} alt={product.name} />
        {product.tags?.[0] && <span className={`product-tag ${product.tags[0]}`}>{product.tags[0]}</span>}
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

const ProductModal = ({ product, onClose, onAdd, ingredients, onUpdateProduct, formatCurrency }) => {
  const { t } = useTranslation();
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);
  const [qty, setQty] = useState(1);
  const [editingPrice, setEditingPrice] = useState(false);
  const [editingMakingPrice, setEditingMakingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(product?.price || 0);
  const [newMakingPrice, setNewMakingPrice] = useState(product?.making_price || 0);
  const { isAdmin } = useAuth();
  const [showCostAnalysis, setShowCostAnalysis] = useState(false);
  
  // Update local state when product changes
  useEffect(() => {
    if (product) {
      setNewPrice(product.price);
      setNewMakingPrice(product.making_price || 0);
    }
  }, [product]);
  
  if (!product) return null;
  const price = product.price;
  const costPrice = calculateCostPrice(product, ingredients);
  const profit = price - costPrice;
  const profitMargin = costPrice ? ((profit / price) * 100).toFixed(1) : 0;
  
  const handlePriceUpdate = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const priceValue = parseFloat(newPrice);
    if (onUpdateProduct && priceValue > 0 && !isNaN(priceValue)) {
      onUpdateProduct(product.id, { price: priceValue });
      setEditingPrice(false);
    } else if (priceValue <= 0 || isNaN(priceValue)) {
      alert('Please enter a valid price greater than 0');
    } else {
      setEditingPrice(false);
    }
  };

  const handleMakingPriceUpdate = () => {
    if (onUpdateProduct && newMakingPrice >= 0) {
      onUpdateProduct(product.id, { making_price: parseFloat(newMakingPrice) });
      setEditingMakingPrice(false);
    }
  };
  
  return (
    <div className={`modal-overlay ${product ? 'open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-img"><img src={product.images[0]} alt={product.name} /></div>
        <div className="modal-content">
          <h2 className="modal-title">{product.name}</h2>
          <p className="modal-desc">{product.description}</p>
          {isAdmin ? (
            <div style={{marginBottom:'1.5rem'}}>
              {editingPrice ? (
                <form onSubmit={handlePriceUpdate} style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                  <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                    <label style={{fontWeight:500}}>Regular Selling Price: $</label>
                    <input 
                      type="number" 
                      value={newPrice} 
                      onChange={e => setNewPrice(e.target.value)} 
                      style={{padding:'0.5rem',border:'2px solid var(--terracotta)',borderRadius:'8px',width:'120px'}} 
                      step="0.01" 
                      min="0.01"
                      required
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary btn-small">{t('save')}</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-small" 
                      onClick={() => { 
                        setEditingPrice(false); 
                        setNewPrice(product.price); 
                      }}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <button type="submit" className="btn btn-primary btn-small">{t('save')}</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-small" 
                      onClick={() => { 
                        setEditingPrice(false); 
                        setNewPrice(product.price); 
                      }}
                    >
                      {t('cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                  <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                    <div className="modal-price">{formatPrice(product.price)}</div>
                    <span style={{fontSize:'0.85rem',opacity:0.7}}>(Regular Price)</span>
                      <button 
                        className="btn btn-small" 
                        onClick={() => { 
                          setEditingPrice(true); 
                          setNewPrice(product.price); 
                        }} 
                        style={{padding:'0.4rem 0.8rem',fontSize:'0.85rem'}}
                      >
                        {t('editPrice')}
                      </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              <div>
          <div className="modal-price">{formatPrice(price)}</div>
                <span style={{fontSize:'0.85rem',opacity:0.7}}>{t('retailPrice')}</span>
              </div>
            </div>
          )}
          {isAdmin && (
            <div style={{marginBottom:'1.5rem'}}>
              <button className="btn btn-secondary btn-small" onClick={() => setShowCostAnalysis(!showCostAnalysis)} style={{width:'100%',marginBottom:'1rem'}}>
                {showCostAnalysis ? 'Hide' : 'Show'} Cost Analysis
              </button>
              {showCostAnalysis && (
                <div style={{padding:'1rem',background:'var(--blush)',borderRadius:'12px'}}>
                  <h3 style={{fontSize:'1rem',fontWeight:600,marginBottom:'0.75rem',color:'var(--espresso)'}}>💰 Cost Analysis</h3>
                  <div style={{marginBottom:'1rem'}}>
                    <h4 style={{fontSize:'0.9rem',fontWeight:600,marginBottom:'0.5rem',color:'var(--chocolate)'}}>Ingredients:</h4>
                    {product.ingredients && product.ingredients.length > 0 ? (
                      product.ingredients.map(ing => {
                        const ingredient = ingredients.find(i => i.id === ing.id);
                        const ingCost = (ingredient?.price || 0) * (ing.quantity || 0);
                        return (
                          <div key={ing.id} style={{display:'flex',justifyContent:'space-between',padding:'0.4rem 0',fontSize:'0.85rem',borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
                            <span>{ingredient?.name || 'Unknown'} ({ing.quantity} {ingredient?.unit || ''})</span>
                            <strong>${ingCost.toFixed(2)}</strong>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{padding:'0.4rem 0',fontSize:'0.85rem',opacity:0.7}}>No ingredients listed</div>
                    )}
                    <div style={{display:'flex',justifyContent:'space-between',padding:'0.4rem 0',fontSize:'0.85rem',marginTop:'0.5rem',borderTop:'2px solid rgba(0,0,0,0.1)'}}>
                      {editingMakingPrice ? (
                        <div style={{display:'flex',gap:'0.5rem',alignItems:'center',width:'100%'}}>
                          <span>Making Price (Labor): $</span>
                          <input type="number" value={newMakingPrice} onChange={e => setNewMakingPrice(e.target.value)} style={{padding:'0.3rem',border:'2px solid var(--terracotta)',borderRadius:'6px',width:'100px',background:'rgba(255,255,255,0.8)'}} step="0.01" min="0" />
                          <button className="btn btn-primary btn-small" onClick={handleMakingPriceUpdate} style={{padding:'0.3rem 0.6rem',fontSize:'0.75rem'}}>Save</button>
                          <button className="btn btn-secondary btn-small" onClick={() => { setEditingMakingPrice(false); setNewMakingPrice(product.making_price || 0); }} style={{padding:'0.3rem 0.6rem',fontSize:'0.75rem'}}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
                          <span>Making Price (Labor):</span>
                          <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                            <strong>${(product.making_price || 0).toFixed(2)}</strong>
                            <button className="btn btn-small" onClick={() => { setEditingMakingPrice(true); setNewMakingPrice(product.making_price || 0); }} style={{padding:'0.2rem 0.5rem',fontSize:'0.7rem'}}>Edit</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',fontSize:'0.9rem',paddingTop:'0.75rem',borderTop:'2px solid rgba(0,0,0,0.1)'}}>
                    <div><span style={{opacity:0.7}}>Total Cost:</span><div style={{fontWeight:600,color:'var(--chocolate)'}}>${costPrice.toFixed(2)}</div></div>
                    <div><span style={{opacity:0.7}}>Selling Price:</span><div style={{fontWeight:600,color:'var(--terracotta)'}}>${price.toFixed(2)}</div></div>
                    <div><span style={{opacity:0.7}}>Profit:</span><div style={{fontWeight:600,color:'#28a745'}}>${profit.toFixed(2)}</div></div>
                    <div><span style={{opacity:0.7}}>Profit Margin:</span><div style={{fontWeight:600,color:'#28a745'}}>{profitMargin}%</div></div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="modal-qty">
            <label>{t('quantity')}:</label>
            <div className="modal-qty-controls">
              <button className="modal-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="modal-qty-value">{qty}</span>
              <button className="modal-qty-btn" onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
          <button className="modal-add-btn" onClick={() => { onAdd(product, qty); onClose(); }}>{t('addToCart')} — {formatPrice(price * qty)}</button>
        </div>
      </div>
    </div>
  );
};

const CartDrawer = ({ onNavigate, formatCurrency }) => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();
  const { t } = useTranslation();
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);
  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header"><h3>{t('yourCart')}</h3><button className="cart-close" onClick={() => setIsOpen(false)}>×</button></div>
        <div className="cart-items">
          {items.length === 0 ? <div className="cart-empty"><div className="cart-empty-icon">🛒</div><p>{t('cartEmpty')}</p></div> : items.map(i => (
            <div key={i.product.id} className="cart-item">
              <div className="cart-item-img"><img src={i.product.images[0]} alt={i.product.name} /></div>
              <div className="cart-item-details">
                <div className="cart-item-name">{i.product.name}</div>
                <div className="cart-item-price">{formatPrice(i.product.price * i.quantity)}</div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(i.product.id, i.quantity - 1)}>−</button>
                  <span>{i.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(i.product.id, i.quantity + 1)}>+</button>
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(i.product.id)}>{t('remove')}</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && <div className="cart-footer"><div className="cart-subtotal"><span>{t('subtotal')}</span><strong>{formatPrice(subtotal)}</strong></div><button className="checkout-btn" onClick={() => { setIsOpen(false); onNavigate('checkout'); }}>{t('proceedToCheckout')}</button></div>}
      </div>
    </>
  );
};

const HomePage = ({ onNavigate, products, ingredients, onUpdateProduct, formatCurrency }) => {
  const [selectedId, setSelectedId] = useState(null);
  const { addItem } = useCart();
  const { t, language } = useTranslation();
  
  // Filter products by current language
  const filteredProducts = products.filter(p => {
    const productLangs = p.languages || ['en', 'ru', 'tr', 'tk']; // Default to all languages if not set
    return productLangs.includes(language);
  });
  
  const selected = filteredProducts.find(p => p.id === selectedId);
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <section className="section">
        <div className="section-header"><h2>{t('ourCollections')}</h2><p>{t('collectionsSubtitle')}</p></div>
        <div className="products-grid">{filteredProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => setSelectedId(p.id)} onAdd={p => addItem(p, 1)} ingredients={ingredients} formatCurrency={formatCurrency} />)}</div>
      </section>
      {selected && <ProductModal product={selected} onClose={() => setSelectedId(null)} onAdd={addItem} ingredients={ingredients} onUpdateProduct={onUpdateProduct} formatCurrency={formatCurrency} />}
    </>
  );
};

const CatalogPage = ({ products, ingredients, onUpdateProduct, formatCurrency }) => {
  const [selectedId, setSelectedId] = useState(null);
  const { addItem } = useCart();
  const { language } = useTranslation();
  
  // Filter products by current language
  const filteredProducts = products.filter(p => {
    const productLangs = p.languages || ['en', 'ru', 'tr', 'tk'];
    return productLangs.includes(language);
  });
  
  const selected = filteredProducts.find(p => p.id === selectedId);
  const { t } = useTranslation();
  return (
    <>
      <section className="section">
        <div className="section-header"><h2>{t('ourCollections')}</h2><p>{t('collectionsSubtitle')}</p></div>
        <div className="products-grid">{filteredProducts.map(p => <ProductCard key={p.id} product={p} onClick={() => setSelectedId(p.id)} onAdd={p => addItem(p, 1)} ingredients={ingredients} formatCurrency={formatCurrency} />)}</div>
      </section>
      {selected && <ProductModal product={selected} onClose={() => setSelectedId(null)} onAdd={addItem} ingredients={ingredients} onUpdateProduct={onUpdateProduct} formatCurrency={formatCurrency} />}
    </>
  );
};

const LoginPage = ({ onNavigate }) => {
  const { login, registerWithInvite } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault(); 
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    const result = login(form.email, form.password);
    
    if (result.success) {
      setSuccess(t('loginSuccessful'));
      const savedUser = localStorage.getItem('soulmate_user');
      const isAdminUser = savedUser && JSON.parse(savedUser).role === 'admin';
      
      setTimeout(() => {
        setIsLoading(false);
        if (isAdminUser) {
          onNavigate('admin');
        } else {
          onNavigate('home');
        }
      }, 500);
    } else {
      setIsLoading(false);
      setError(t('invalidCredentials'));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault(); 
    setError('');
    setSuccess('');
    
    if (!form.token.trim()) {
      setError(t('inviteToken') + ' ' + t('required'));
      return;
    }
    if (!form.name.trim()) {
      setError(t('fullName') + ' ' + t('required'));
      return;
    }
    if (!form.email.trim()) {
      setError(t('email') + ' ' + t('required'));
      return;
    }
    if (!form.password.trim()) {
      setError(t('password') + ' ' + t('required'));
      return;
    }
    
    const result = registerWithInvite(form.token.trim().toUpperCase(), form.name, form.email, form.password, form.phone);
    if (result.success) { 
      setSuccess(t('success') + '!'); 
      setTimeout(() => onNavigate('home'), 500); 
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="page" style={{maxWidth:'480px'}}>
      <div className="page-header">
        <h1>{mode === 'login' ? t('welcomeBack') : t('joinUs')}</h1>
        <p>{mode === 'login' ? t('signInToAccount') : t('registerWithInvite')}</p>
      </div>
      <div className="form-card">
        <div className="tabs">
          <button className={`tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); setSuccess(''); }}>{t('login')}</button>
          <button className={`tab ${mode === 'invite' ? 'active' : ''}`} onClick={() => { setMode('invite'); setError(''); setSuccess(''); }}>{t('register')}</button>
        </div>
        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{t('email')} *</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                placeholder="admin@soulmate.com"
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('password')} *</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="form-submit" disabled={isLoading}>
              {isLoading ? t('signingIn') : t('signIn')}
            </button>
            <div style={{marginTop:'2rem',padding:'1.25rem',background:'var(--blush)',borderRadius:'12px',fontSize:'0.9rem'}}>
              <strong>🔐 {t('adminLogin')}:</strong><br/>
              <span style={{fontFamily:'monospace'}}>admin@soulmate.com</span><br/>
              <span style={{fontFamily:'monospace'}}>Admin@2024!</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>{t('inviteToken')} *</label>
              <input 
                type="text" 
                value={form.token} 
                onChange={e => setForm({...form, token: e.target.value.toUpperCase()})} 
                placeholder="XXXXXXXX" 
                style={{textTransform:'uppercase',fontFamily:'monospace'}} 
                required 
              />
              <small style={{color:'var(--chocolate)',opacity:0.7,display:'block',marginTop:'0.5rem'}}>{t('enterInviteToken')}</small>
            </div>
            <div className="form-group">
              <label>{t('fullName')} *</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('email')} *</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t('phone')}</label>
              <input 
                type="tel" 
                value={form.phone} 
                onChange={e => setForm({...form, phone: e.target.value})} 
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label>{t('createPassword')} *</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})} 
                required 
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
            <button type="submit" className="form-submit">{t('register')}</button>
            <div style={{marginTop:'2rem',padding:'1.25rem',background:'var(--blush)',borderRadius:'12px',fontSize:'0.9rem'}}>
              <strong>📧 {t('testTokens')}:</strong><br/>
              <code style={{background:'white',padding:'0.2rem 0.5rem',borderRadius:'4px'}}>DEALER2024</code> — {t('dealer')}<br/>
              <code style={{background:'white',padding:'0.2rem 0.5rem',borderRadius:'4px'}}>USER2024</code> — {t('user')}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const CheckoutPage = ({ onNavigate, onCreateOrder, formatCurrency }) => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [done, setDone] = useState(false);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);

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
          {items.map(i => <div key={i.product.id} className="summary-item"><div className="summary-item-img"><img src={i.product.images[0]} alt="" /></div><div className="summary-item-details"><div className="summary-item-name">{i.product.name}</div><div className="summary-item-qty">{t('quantity')}: {i.quantity}</div></div><div className="summary-item-price">{formatPrice(i.product.price * i.quantity)}</div></div>)}
          <div className="summary-totals"><div className="summary-row"><span>{t('subtotal')}</span><span>{formatPrice(subtotal)}</span></div><div className="summary-row"><span>{t('tax')}</span><span>{formatPrice(tax)}</span></div><div className="summary-row total"><span>{t('total')}</span><span>{formatPrice(total)}</span></div></div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [done, setDone] = useState(false);
  if (done) return <div className="page"><div className="success-msg"><div className="success-icon">💌</div><h2>{t('messageSent')}</h2><p>{t('messageSentConfirm')}</p><button className="btn btn-primary" onClick={() => onNavigate('home')}>{t('back')}</button></div></div>;
  return (
    <div className="page" style={{maxWidth:'700px'}}>
      <div className="page-header"><h1>{t('getInTouch')}</h1><p>{t('contactSubtitle')}</p></div>
      <div className="form-card">
        <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
          <div className="form-row"><div className="form-group"><label>{t('name')} *</label><input type="text" required /></div><div className="form-group"><label>{t('phone')} *</label><input type="tel" required /></div></div>
          <div className="form-group"><label>{t('email')}</label><input type="email" /></div>
          <div className="form-group"><label>{t('message')} *</label><textarea required placeholder={t('tellUsAboutDreamDessert')} /></div>
          <button type="submit" className="form-submit">{t('sendMessage')}</button>
        </form>
      </div>
    </div>
  );
};

const IngredientsManagement = ({ ingredients, setIngredients, products }) => {
  const { t } = useTranslation();
  const [newIng, setNewIng] = useState({ name: '', unit: '', price: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (ingredients) {
      localStorage.setItem('soulmate_ingredients', JSON.stringify(ingredients));
      ingredientsData = ingredients;
    }
  }, [ingredients]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    if (editing) {
      setIngredients(prev => prev.map(ing => 
        ing.id === editing.id 
          ? { ...editing, price: parseFloat(editing.price) || 0 } 
          : ing
      ));
      setEditing(null);
    } else {
      const newId = 'ing' + Date.now();
      setIngredients(prev => [...prev, { id: newId, name: newIng.name, unit: newIng.unit, price: parseFloat(newIng.price) }]);
      setNewIng({ name: '', unit: '', price: '' });
    }
  };

  const handleEdit = (ing) => {
    setEditing({ ...ing });
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

  const handleDelete = (id) => {
    const usedIn = getUsedInProducts(id);
    const message = usedIn.length > 0 
      ? t('ingredientUsedInProducts').replace('{count}', usedIn.length).replace('{products}', usedIn.map(p => p.name).join(', '))
      : t('deleteIngredientConfirm');
    
    if (window.confirm(message)) {
      setIngredients(prev => prev.filter(ing => ing.id !== id));
    }
  };

  return (
    <>
      <div className="form-card" style={{marginBottom:'2rem'}}>
        <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{editing ? t('editIngredient') : t('addNewIngredient')}</h3>
        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group"><label>{t('ingredientName')} *</label><input type="text" value={editing?.name || newIng.name} onChange={e => editing ? setEditing({...editing, name: e.target.value}) : setNewIng({...newIng, name: e.target.value})} required /></div>
            <div className="form-group"><label>{t('unit')} *</label><input type="text" value={editing?.unit || newIng.unit} onChange={e => editing ? setEditing({...editing, unit: e.target.value}) : setNewIng({...newIng, unit: e.target.value})} placeholder="lb, oz, qt, etc." required /></div>
            <div className="form-group"><label>{t('pricePerUnit')} *</label><input type="number" step="0.01" min="0" value={editing?.price || newIng.price} onChange={e => editing ? setEditing({...editing, price: e.target.value}) : setNewIng({...newIng, price: e.target.value})} required /></div>
          </div>
          <button type="submit" className="btn btn-primary">{editing ? t('update') : t('add')} {t('ingredients')}</button>
          {editing && <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)} style={{marginLeft:'0.5rem'}}>{t('cancel')}</button>}
        </form>
      </div>

      <div className="form-card">
        <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('ingredientManagement')}</h3>
        {ingredients.length === 0 ? <p style={{color:'var(--chocolate)',opacity:0.7}}>{t('noIngredientsYet')}</p> : (
          <table className="admin-table"><thead><tr><th>{t('ingredientName')}</th><th>{t('unit')}</th><th>{t('pricePerUnit')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead><tbody>
            {ingredients.map(ing => {
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
                        onChange={e => setEditing({...editing, name: e.target.value})}
                        style={{padding:'0.25rem',border:'2px solid var(--terracotta)',borderRadius:'4px',width:'100%'}}
                        required
                      />
                    ) : (
                      <strong>{ing.name}</strong>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editing.unit} 
                        onChange={e => setEditing({...editing, unit: e.target.value})}
                        style={{padding:'0.25rem',border:'2px solid var(--terracotta)',borderRadius:'4px',width:'100%'}}
                        required
                      />
                    ) : (
                      ing.unit
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        value={editing.price} 
                        onChange={e => setEditing({...editing, price: e.target.value})}
                        style={{padding:'0.25rem',border:'2px solid var(--terracotta)',borderRadius:'4px',width:'100px'}}
                        required
                      />
                    ) : (
                      `$${ing.price.toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {isUsed ? (
                      <span style={{fontSize:'0.75rem',padding:'0.25rem 0.5rem',background:'#FFF3CD',color:'#856404',borderRadius:'4px'}}>
                        Used in {usedIn.length} product(s)
                      </span>
                    ) : (
                      <span style={{fontSize:'0.75rem',opacity:0.5}}>Not used</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button className="btn btn-small btn-primary" onClick={(e) => {
                          e.preventDefault();
                          if (editing.name && editing.unit && editing.price) {
                            handleSave(e);
                          }
                        }} style={{marginRight:'0.5rem'}}>{t('save')}</button>
                        <button className="btn btn-small btn-secondary" onClick={() => setEditing(null)}>{t('cancel')}</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-small" onClick={() => handleEdit(ing)} style={{marginRight:'0.5rem'}}>{t('edit')}</button>
                        <button className="btn btn-small btn-danger" onClick={() => handleDelete(ing.id)}>{t('delete')}</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody></table>
        )}
      </div>
    </>
  );
};

const ProductsManagement = ({ products, setProducts, ingredients, formatCurrency }) => {
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', making_price: '', profit: '', profit_margin: '', image: '', uploadedImage: null, ingredients: [], tag: 'none', languages: ['en', 'ru', 'tr', 'tk'] });
  
  // Available product tags
  const productTags = [
    { value: 'none', label: 'None (No Badge)' },
    { value: 'bestseller', label: '⭐ Bestseller' },
    { value: 'popular', label: '🔥 Popular' },
    { value: 'premium', label: '💎 Premium' },
    { value: 'signature', label: '✨ Signature' },
    { value: 'rustic', label: '🌿 Rustic' },
    { value: 'classic', label: '🎂 Classic' },
    { value: 'seasonal', label: '🍂 Seasonal' },
    { value: 'new', label: '🆕 New' }
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
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, uploadedImage: reader.result, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveUploadedImage = () => {
    setForm(prev => ({ ...prev, uploadedImage: null }));
  };

  const calculateCostFromForm = () => {
    const ingredientsCost = form.ingredients.reduce((sum, ing) => {
      const ingredient = ingredients.find(i => i.id === ing.id);
      return sum + (ingredient?.price || 0) * (ing.quantity || 0);
    }, 0);
    return ingredientsCost + (parseFloat(form.making_price) || 0);
  };

  const handleEdit = (product) => {
    const costPrice = calculateCostPrice(product, ingredients);
    const profit = product.price - costPrice;
    const profitMargin = costPrice > 0 ? ((profit / product.price) * 100) : 0;
    
    setEditing(product.id);
    const existingImage = product.images?.[0] || '';
    const isDataUrl = existingImage.startsWith('data:image');
    const currentTag = product.tags?.[0] || 'none';
    const currentLanguages = product.languages || ['en', 'ru', 'tr', 'tk'];
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      making_price: product.making_price || 0,
      profit: profit.toFixed(2),
      profit_margin: profitMargin.toFixed(1),
      image: isDataUrl ? '' : existingImage,
      uploadedImage: isDataUrl ? existingImage : null,
      ingredients: product.ingredients || [],
      tag: currentTag,
      languages: currentLanguages
    });
  };

  const handleProfitChange = (value, type) => {
    const costPrice = calculateCostFromForm();
    let newPrice, newProfit, newMargin;
    
    if (type === 'amount') {
      newProfit = parseFloat(value) || 0;
      newPrice = costPrice + newProfit;
      newMargin = newPrice > 0 ? ((newProfit / newPrice) * 100) : 0;
      setForm(prev => ({
        ...prev,
        price: newPrice.toFixed(2),
        profit: newProfit.toFixed(2),
        profit_margin: newMargin.toFixed(1)
      }));
    } else if (type === 'margin') {
      newMargin = parseFloat(value) || 0;
      if (newMargin > 0 && newMargin < 100) {
        newPrice = costPrice / (1 - (newMargin / 100));
        newProfit = newPrice - costPrice;
      } else {
        newPrice = costPrice;
        newProfit = 0;
        newMargin = 0;
      }
      setForm(prev => ({
        ...prev,
        price: newPrice.toFixed(2),
        profit: newProfit.toFixed(2),
        profit_margin: newMargin.toFixed(1)
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const imageToSave = form.uploadedImage || form.image || null;
    const tagsToSave = form.tag && form.tag !== 'none' ? [form.tag] : [];
    const languagesToSave = form.languages && form.languages.length > 0 ? form.languages : ['en', 'ru', 'tr', 'tk'];
    if (editing && editing !== 'new') {
      // Update existing product
      setProducts(prev => prev.map(p => 
        p.id === editing 
          ? { 
              ...p, 
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              making_price: parseFloat(form.making_price),
              images: imageToSave ? [imageToSave] : p.images,
              ingredients: form.ingredients,
              tags: tagsToSave,
              languages: languagesToSave
            }
          : p
      ));
      setEditing(null);
      setForm({ name: '', description: '', price: '', making_price: '', profit: '', profit_margin: '', image: '', uploadedImage: null, ingredients: [], tag: 'none', languages: ['en', 'ru', 'tr', 'tk'] });
    } else {
      // Create new product
      const newId = Date.now().toString();
      const newProduct = {
        id: newId,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        making_price: parseFloat(form.making_price),
        ingredients: form.ingredients,
        category_id: '1',
        images: imageToSave ? [imageToSave] : ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'],
        tags: tagsToSave,
        languages: languagesToSave
      };
      setProducts(prev => [...prev, newProduct]);
      setForm({ name: '', description: '', price: '', making_price: '', profit: '', profit_margin: '', image: '', uploadedImage: null, ingredients: [], tag: 'none', languages: ['en', 'ru', 'tr', 'tk'] });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', making_price: '', profit: '', profit_margin: '', image: '', uploadedImage: null, ingredients: [], tag: 'none', languages: ['en', 'ru', 'tr', 'tk'] });
  };

  const handleNewProduct = () => {
    setEditing('new');
    setForm({ 
      name: '', 
      description: '', 
      price: '', 
      making_price: '0', 
      profit: '0', 
      profit_margin: '0', 
      image: '',
      uploadedImage: null,
      ingredients: [],
      tag: 'none',
      languages: ['en', 'ru', 'tr', 'tk']
    });
  };

  const recalculateProfit = (ingredientsList, makingPrice, currentPrice) => {
    const ingredientsCost = ingredientsList.reduce((sum, ing) => {
      const ingredient = ingredients.find(i => i.id === ing.id);
      return sum + (ingredient?.price || 0) * (ing.quantity || 0);
    }, 0);
    const costPrice = ingredientsCost + (parseFloat(makingPrice) || 0);
    const profit = currentPrice - costPrice;
    const margin = currentPrice > 0 ? ((profit / currentPrice) * 100) : 0;
    return { profit: profit.toFixed(2), margin: margin.toFixed(1) };
  };

  const handleAddIngredient = () => {
    if (form.ingredients.length === 0 || form.ingredients[form.ingredients.length - 1].id) {
      setForm(prev => {
        const newIngredients = [...prev.ingredients, { id: '', quantity: 1 }];
        const { profit, margin } = recalculateProfit(newIngredients, prev.making_price, parseFloat(prev.price) || 0);
        return { ...prev, ingredients: newIngredients, profit, profit_margin: margin };
      });
    }
  };

  const handleIngredientChange = (index, field, value) => {
    setForm(prev => {
      const updatedIngredients = prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: field === 'quantity' ? parseFloat(value) || 0 : value } : ing
      );
      const { profit, margin } = recalculateProfit(updatedIngredients, prev.making_price, parseFloat(prev.price) || 0);
      return { ...prev, ingredients: updatedIngredients, profit, profit_margin: margin };
    });
  };

  const handleRemoveIngredient = (index) => {
    setForm(prev => {
      const newIngredients = prev.ingredients.filter((_, i) => i !== index);
      const { profit, margin } = recalculateProfit(newIngredients, prev.making_price, parseFloat(prev.price) || 0);
      return { ...prev, ingredients: newIngredients, profit, profit_margin: margin };
    });
  };

  return (
    <>
      <div className="form-card" style={{marginBottom:'2rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",margin:0}}>All Products</h3>
          {editing !== 'new' && (
            <button className="btn btn-primary" onClick={handleNewProduct}>+ Add New Product</button>
          )}
        </div>
        {editing === 'new' && (
          <div style={{padding:'1.5rem',background:'var(--blush)',borderRadius:'16px',border:'2px solid var(--terracotta)',marginBottom:'1.5rem'}}>
            <h4 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1rem',color:'var(--espresso)'}}>Create New Product</h4>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group"><label>Product Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="form-group">
                  <label>Product Badge</label>
                  <select 
                    value={form.tag} 
                    onChange={e => setForm({...form, tag: e.target.value})}
                    style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)',color:'var(--espresso)'}}
                  >
                    {productTags.map(tag => (
                      <option key={tag.value} value={tag.value}>{tag.label}</option>
                    ))}
                  </select>
                  <small style={{display:'block',marginTop:'0.25rem',opacity:0.7}}>Select "None" to hide badge on product card</small>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Price *</label><input type="number" step="0.01" min="0" value={form.price} onChange={e => {
                  const newPrice = parseFloat(e.target.value) || 0;
                  const costPrice = calculateCostFromForm();
                  const newProfit = newPrice - costPrice;
                  const newMargin = newPrice > 0 ? ((newProfit / newPrice) * 100) : 0;
                  setForm(prev => ({...prev, price: e.target.value, profit: newProfit.toFixed(2), profit_margin: newMargin.toFixed(1)}));
                }} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Making Price (Labor) *</label><input type="number" step="0.01" min="0" value={form.making_price} onChange={e => {
                  const newMakingPrice = e.target.value;
                  const ingredientsCost = form.ingredients.reduce((sum, ing) => {
                    const ingredient = ingredients.find(i => i.id === ing.id);
                    return sum + (ingredient?.price || 0) * (ing.quantity || 0);
                  }, 0);
                  const newCostPrice = ingredientsCost + (parseFloat(newMakingPrice) || 0);
                  const currentPrice = parseFloat(form.price) || 0;
                  const newProfit = currentPrice - newCostPrice;
                  const newMargin = currentPrice > 0 ? ((newProfit / currentPrice) * 100) : 0;
                  setForm(prev => ({...prev, making_price: newMakingPrice, profit: newProfit.toFixed(2), profit_margin: newMargin.toFixed(1)}));
                }} required /></div>
                <div className="form-group" style={{display:'flex',alignItems:'center',paddingTop:'1.5rem'}}>
                  {form.tag && form.tag !== 'none' && (
                    <span className={`product-tag ${form.tag}`} style={{fontSize:'0.85rem',padding:'0.5rem 1rem'}}>
                      {productTags.find(t => t.value === form.tag)?.label.split(' ')[1] || form.tag}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-row" style={{padding:'1rem',background:'white',borderRadius:'12px',marginBottom:'1rem'}}>
                <div className="form-group">
                  <label>Profit Amount *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={form.profit} 
                    onChange={e => handleProfitChange(e.target.value, 'amount')} 
                    required 
                    style={{fontWeight:600,color:'#28a745'}}
                  />
                  <small style={{display:'block',marginTop:'0.25rem',opacity:0.7}}>Editing this will update the selling price</small>
                </div>
                <div className="form-group">
                  <label>Profit Margin (%) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="99" 
                    value={form.profit_margin} 
                    onChange={e => handleProfitChange(e.target.value, 'margin')} 
                    required 
                    style={{fontWeight:600,color:'#28a745'}}
                  />
                  <small style={{display:'block',marginTop:'0.25rem',opacity:0.7}}>Editing this will update the selling price</small>
                </div>
              </div>
              <div style={{padding:'0.75rem',background:'white',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                  <span style={{opacity:0.7}}>Cost Price (auto-calculated):</span>
                  <strong style={{color:'var(--chocolate)'}}>${calculateCostFromForm().toFixed(2)}</strong>
                </div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <span style={{opacity:0.7}}>Selling Price:</span>
                  <strong style={{color:'var(--terracotta)'}}>${(parseFloat(form.price) || 0).toFixed(2)}</strong>
                </div>
              </div>
              <div className="form-group full"><label>Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows="3" /></div>
              <div className="form-group full">
                <label>Product Image</label>
                <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                  <div>
                    <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.9rem',fontWeight:500}}>Upload Image:</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{width:'100%',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px'}}
                    />
                    {form.uploadedImage && (
                      <div style={{marginTop:'0.5rem',position:'relative',display:'inline-block'}}>
                        <img 
                          src={form.uploadedImage} 
                          alt="Uploaded preview" 
                          style={{maxWidth:'200px',maxHeight:'200px',objectFit:'cover',borderRadius:'8px',border:'2px solid var(--terracotta)'}}
                        />
                        <button 
                          type="button"
                          onClick={handleRemoveUploadedImage}
                          style={{position:'absolute',top:'-10px',right:'-10px',background:'#dc3545',color:'white',border:'none',borderRadius:'50%',width:'24px',height:'24px',cursor:'pointer',fontSize:'16px',lineHeight:'20px'}}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={{textAlign:'center',opacity:0.7}}>OR</div>
                  <div>
                    <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.9rem',fontWeight:500}}>Or Enter Image URL:</label>
                    <input 
                      type="url" 
                      value={form.image} 
                      onChange={e => setForm({...form, image: e.target.value, uploadedImage: null})} 
                      placeholder="https://example.com/image.jpg"
                      disabled={!!form.uploadedImage}
                      style={{width:'100%',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',opacity:form.uploadedImage ? 0.5 : 1}}
                    />
                    {form.image && !form.uploadedImage && (
                      <div style={{marginTop:'0.5rem'}}>
                        <img 
                          src={form.image} 
                          alt="URL preview" 
                          style={{maxWidth:'200px',maxHeight:'200px',objectFit:'cover',borderRadius:'8px',border:'2px solid var(--blush)'}}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{display:'none',padding:'1rem',background:'#f8d7da',color:'#721c24',borderRadius:'8px',fontSize:'0.85rem'}}>
                          Image failed to load. Please check the URL.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <small style={{display:'block',marginTop:'0.5rem',opacity:0.7}}>Upload an image file or enter a URL. Leave empty to use default image.</small>
              </div>
              <div className="form-group full">
                <label>Ingredients</label>
                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'0.5rem'}}>
                  {form.ingredients.map((ing, idx) => (
                    <div key={idx} style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                      <select value={ing.id} onChange={e => handleIngredientChange(idx, 'id', e.target.value)} style={{flex:1,padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}}>
                        <option value="">Select ingredient</option>
                        {ingredients.map(ingOption => (
                          <option key={ingOption.id} value={ingOption.id}>{ingOption.name} ({ingOption.unit})</option>
                        ))}
                      </select>
                      <input type="number" step="0.1" min="0" value={ing.quantity} onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)} placeholder="Qty" style={{width:'100px',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}} />
                      <button type="button" className="btn btn-small btn-danger" onClick={() => handleRemoveIngredient(idx)}>Remove</button>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn btn-secondary btn-small" onClick={handleAddIngredient}>+ Add Ingredient</button>
              </div>
              <div className="form-group full">
                <label>Show in Languages</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',padding:'1rem',background:'white',borderRadius:'12px'}}>
                  {availableLanguages.map(lang => (
                    <label 
                      key={lang.code} 
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem',
                        padding:'0.5rem 1rem',
                        background: form.languages?.includes(lang.code) ? 'var(--terracotta)' : 'var(--blush)',
                        color: form.languages?.includes(lang.code) ? 'white' : 'var(--espresso)',
                        borderRadius:'8px',
                        cursor:'pointer',
                        transition:'all 0.2s',
                        userSelect:'none'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={form.languages?.includes(lang.code) || false}
                        onChange={() => handleLanguageToggle(lang.code)}
                        style={{display:'none'}}
                      />
                      <span style={{fontSize:'1.2rem'}}>{lang.flag}</span>
                      <span style={{fontWeight:500}}>{lang.name}</span>
                    </label>
                  ))}
                </div>
                <small style={{display:'block',marginTop:'0.5rem',opacity:0.7}}>Select which languages this product will be visible in. At least one language required.</small>
              </div>
              <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
                <button type="submit" className="btn btn-primary">Create Product</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="form-card">
        {products.length === 0 ? (
          <p style={{color:'var(--chocolate)',opacity:0.7}}>No products yet.</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {products.map(product => {
              const costPrice = calculateCostPrice(product, ingredients);
              const isEditing = editing === product.id && editing !== 'new';
              
              return (
                <div key={product.id} style={{padding:'1.5rem',background:'var(--blush)',borderRadius:'16px',border:isEditing ? '2px solid var(--terracotta)' : '1px solid rgba(0,0,0,0.1)'}}>
                  {isEditing ? (
                    <form onSubmit={handleSave}>
                      <div className="form-row">
                        <div className="form-group"><label>Product Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                        <div className="form-group">
                          <label>Product Badge</label>
                          <select 
                            value={form.tag} 
                            onChange={e => setForm({...form, tag: e.target.value})}
                            style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)',color:'var(--espresso)'}}
                          >
                            {productTags.map(tag => (
                              <option key={tag.value} value={tag.value}>{tag.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label>Price *</label><input type="number" step="0.01" min="0" value={form.price} onChange={e => {
                          const newPrice = parseFloat(e.target.value) || 0;
                          const costPrice = calculateCostFromForm();
                          const newProfit = newPrice - costPrice;
                          const newMargin = newPrice > 0 ? ((newProfit / newPrice) * 100) : 0;
                          setForm(prev => ({...prev, price: e.target.value, profit: newProfit.toFixed(2), profit_margin: newMargin.toFixed(1)}));
                        }} required /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><label>Making Price (Labor) *</label><input type="number" step="0.01" min="0" value={form.making_price} onChange={e => {
                          const newMakingPrice = e.target.value;
                          // Recalculate cost and profit when making price changes
                          const ingredientsCost = form.ingredients.reduce((sum, ing) => {
                            const ingredient = ingredients.find(i => i.id === ing.id);
                            return sum + (ingredient?.price || 0) * (ing.quantity || 0);
                          }, 0);
                          const newCostPrice = ingredientsCost + (parseFloat(newMakingPrice) || 0);
                          const currentPrice = parseFloat(form.price) || 0;
                          const newProfit = currentPrice - newCostPrice;
                          const newMargin = currentPrice > 0 ? ((newProfit / currentPrice) * 100) : 0;
                          setForm(prev => ({...prev, making_price: newMakingPrice, profit: newProfit.toFixed(2), profit_margin: newMargin.toFixed(1)}));
                        }} required /></div>
                        <div className="form-group" style={{display:'flex',alignItems:'center',paddingTop:'1.5rem'}}>
                          {form.tag && form.tag !== 'none' && (
                            <span className={`product-tag ${form.tag}`} style={{fontSize:'0.85rem',padding:'0.5rem 1rem'}}>
                              {productTags.find(t => t.value === form.tag)?.label.split(' ')[1] || form.tag}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="form-row" style={{padding:'1rem',background:'var(--blush)',borderRadius:'12px',marginBottom:'1rem'}}>
                        <div className="form-group">
                          <label>Profit Amount *</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            value={form.profit} 
                            onChange={e => handleProfitChange(e.target.value, 'amount')} 
                            required 
                            style={{fontWeight:600,color:'#28a745'}}
                          />
                          <small style={{display:'block',marginTop:'0.25rem',opacity:0.7}}>Editing this will update the selling price</small>
                        </div>
                        <div className="form-group">
                          <label>Profit Margin (%) *</label>
                          <input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="99" 
                            value={form.profit_margin} 
                            onChange={e => handleProfitChange(e.target.value, 'margin')} 
                            required 
                            style={{fontWeight:600,color:'#28a745'}}
                          />
                          <small style={{display:'block',marginTop:'0.25rem',opacity:0.7}}>Editing this will update the selling price</small>
                        </div>
                      </div>
                      <div style={{padding:'0.75rem',background:'white',borderRadius:'8px',marginBottom:'1rem',fontSize:'0.9rem'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                          <span style={{opacity:0.7}}>Cost Price (auto-calculated):</span>
                          <strong style={{color:'var(--chocolate)'}}>${calculateCostFromForm().toFixed(2)}</strong>
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between'}}>
                          <span style={{opacity:0.7}}>Selling Price:</span>
                          <strong style={{color:'var(--terracotta)'}}>${(parseFloat(form.price) || 0).toFixed(2)}</strong>
                        </div>
                      </div>
                      <div className="form-group full"><label>Description *</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows="3" /></div>
                      <div className="form-group full">
                        <label>Product Image</label>
                        <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                          <div>
                            <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.9rem',fontWeight:500}}>Upload Image:</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              style={{width:'100%',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}}
                            />
                            {form.uploadedImage && (
                              <div style={{marginTop:'0.5rem',position:'relative',display:'inline-block'}}>
                                <img 
                                  src={form.uploadedImage} 
                                  alt="Uploaded preview" 
                                  style={{maxWidth:'200px',maxHeight:'200px',objectFit:'cover',borderRadius:'8px',border:'2px solid var(--terracotta)'}}
                                />
                                <button 
                                  type="button"
                                  onClick={handleRemoveUploadedImage}
                                  style={{position:'absolute',top:'-10px',right:'-10px',background:'#dc3545',color:'white',border:'none',borderRadius:'50%',width:'24px',height:'24px',cursor:'pointer',fontSize:'16px',lineHeight:'20px'}}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                          <div style={{textAlign:'center',opacity:0.7}}>OR</div>
                          <div>
                            <label style={{display:'block',marginBottom:'0.5rem',fontSize:'0.9rem',fontWeight:500}}>Or Enter Image URL:</label>
                            <input 
                              type="url" 
                              value={form.image} 
                              onChange={e => setForm({...form, image: e.target.value, uploadedImage: null})} 
                              placeholder="https://example.com/image.jpg"
                              disabled={!!form.uploadedImage}
                              style={{width:'100%',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',opacity:form.uploadedImage ? 0.5 : 1,background:'rgba(255,255,255,0.8)'}}
                            />
                            {form.image && !form.uploadedImage && (
                              <div style={{marginTop:'0.5rem'}}>
                                <img 
                                  src={form.image} 
                                  alt="URL preview" 
                                  style={{maxWidth:'200px',maxHeight:'200px',objectFit:'cover',borderRadius:'8px',border:'2px solid var(--blush)'}}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                                <div style={{display:'none',padding:'1rem',background:'#f8d7da',color:'#721c24',borderRadius:'8px',fontSize:'0.85rem'}}>
                                  Image failed to load. Please check the URL.
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <small style={{display:'block',marginTop:'0.5rem',opacity:0.7}}>Upload an image file or enter a URL. Leave empty to use default image.</small>
                      </div>
                      <div className="form-group full">
                        <label>Ingredients</label>
                        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',marginBottom:'0.5rem'}}>
                          {form.ingredients.map((ing, idx) => (
                            <div key={idx} style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                              <select value={ing.id} onChange={e => handleIngredientChange(idx, 'id', e.target.value)} style={{flex:1,padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}}>
                                <option value="">Select ingredient</option>
                                {ingredients.map(ingOption => (
                                  <option key={ingOption.id} value={ingOption.id}>{ingOption.name} ({ingOption.unit})</option>
                                ))}
                              </select>
                              <input type="number" step="0.1" min="0" value={ing.quantity} onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)} placeholder="Qty" style={{width:'100px',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}} />
                              <button type="button" className="btn btn-small btn-danger" onClick={() => handleRemoveIngredient(idx)}>Remove</button>
                            </div>
                          ))}
                        </div>
                        <button type="button" className="btn btn-secondary btn-small" onClick={handleAddIngredient}>+ Add Ingredient</button>
                      </div>
                      <div className="form-group full">
                        <label>Show in Languages</label>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',padding:'1rem',background:'white',borderRadius:'12px'}}>
                          {availableLanguages.map(lang => (
                            <label 
                              key={lang.code} 
                              style={{
                                display:'flex',
                                alignItems:'center',
                                gap:'0.5rem',
                                padding:'0.5rem 1rem',
                                background: form.languages?.includes(lang.code) ? 'var(--terracotta)' : 'var(--blush)',
                                color: form.languages?.includes(lang.code) ? 'white' : 'var(--espresso)',
                                borderRadius:'8px',
                                cursor:'pointer',
                                transition:'all 0.2s',
                                userSelect:'none'
                              }}
                            >
                              <input 
                                type="checkbox" 
                                checked={form.languages?.includes(lang.code) || false}
                                onChange={() => handleLanguageToggle(lang.code)}
                                style={{display:'none'}}
                              />
                              <span style={{fontSize:'1.2rem'}}>{lang.flag}</span>
                              <span style={{fontWeight:500}}>{lang.name}</span>
                            </label>
                          ))}
                        </div>
                        <small style={{display:'block',marginTop:'0.5rem',opacity:0.7}}>Select which languages this product will be visible in.</small>
                      </div>
                      <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
                        <button type="submit" className="btn btn-primary">Save Changes</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div style={{display:'flex',gap:'1.5rem',marginBottom:'1rem'}}>
                        {product.images?.[0] && (
                          <div style={{width:'120px',height:'120px',flexShrink:0,position:'relative'}}>
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'12px',border:'2px solid var(--blush)'}}
                            />
                            {product.tags?.[0] && (
                              <span className={`product-tag ${product.tags[0]}`} style={{position:'absolute',top:'8px',left:'8px',fontSize:'0.7rem',padding:'0.25rem 0.5rem'}}>
                                {product.tags[0]}
                              </span>
                            )}
                          </div>
                        )}
                        <div style={{flex:1}}>
                          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.5rem',flexWrap:'wrap'}}>
                            <h4 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',margin:0,color:'var(--espresso)'}}>{product.name}</h4>
                            {product.tags?.[0] && (
                              <span style={{fontSize:'0.75rem',padding:'0.2rem 0.6rem',background:'var(--terracotta)',color:'white',borderRadius:'50px',textTransform:'capitalize'}}>
                                {product.tags[0]}
                              </span>
                            )}
                          </div>
                          <p style={{color:'var(--chocolate)',opacity:0.8,marginBottom:'0.75rem'}}>{product.description}</p>
                          <div style={{display:'flex',gap:'1.5rem',fontSize:'0.9rem',flexWrap:'wrap'}}>
                            <div><span style={{opacity:0.7}}>Price:</span> <strong style={{color:'var(--terracotta)'}}>{formatPrice(product.price)}</strong></div>
                            <div><span style={{opacity:0.7}}>Cost:</span> <strong style={{color:'var(--chocolate)'}}>{formatPrice(costPrice)}</strong></div>
                            <div><span style={{opacity:0.7}}>Making:</span> <strong>{formatPrice(product.making_price || 0)}</strong></div>
                            <div><span style={{opacity:0.7}}>Profit:</span> <strong style={{color:'#28a745'}}>{formatPrice(product.price - costPrice)}</strong></div>
                            <div><span style={{opacity:0.7}}>Margin:</span> <strong style={{color:'#28a745'}}>{costPrice > 0 ? (((product.price - costPrice) / product.price) * 100).toFixed(1) : '0.0'}%</strong></div>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'1rem',marginTop:'0.75rem',flexWrap:'wrap'}}>
                            <button className="btn btn-primary btn-small" onClick={() => handleEdit(product)}>Edit</button>
                            <div style={{display:'flex',gap:'0.25rem',alignItems:'center'}}>
                              <span style={{fontSize:'0.8rem',opacity:0.7,marginRight:'0.25rem'}}>Visible in:</span>
                              {availableLanguages.map(lang => (
                                <span 
                                  key={lang.code}
                                  title={lang.name}
                                  style={{
                                    fontSize:'1rem',
                                    opacity: (product.languages || ['en', 'ru', 'tr', 'tk']).includes(lang.code) ? 1 : 0.3,
                                    filter: (product.languages || ['en', 'ru', 'tr', 'tk']).includes(lang.code) ? 'none' : 'grayscale(100%)'
                                  }}
                                >
                                  {lang.flag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {product.ingredients && product.ingredients.length > 0 && (
                        <div style={{padding:'0.75rem',background:'white',borderRadius:'8px',fontSize:'0.85rem'}}>
                          <strong style={{display:'block',marginBottom:'0.5rem'}}>Ingredients:</strong>
                          <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                            {product.ingredients.map((ing, idx) => {
                              const ingredient = ingredients.find(i => i.id === ing.id);
                              return ingredient ? (
                                <span key={idx} style={{padding:'0.25rem 0.5rem',background:'var(--blush)',borderRadius:'4px'}}>
                                  {ingredient.name} ({ing.quantity} {ingredient.unit})
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

const OrdersManagement = ({ orders, setOrders, formatCurrency }) => {
  const { t } = useTranslation();
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);
  const statusOptions = [t('pending'), t('inProgress'), t('ready'), t('completed'), t('cancelled')];
  
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const getStatusColor = (status) => {
    const statusMap = { [t('pending')]: 'Pending', [t('inProgress')]: 'In Progress', [t('ready')]: 'Ready', [t('completed')]: 'Completed', [t('cancelled')]: 'Cancelled' };
    const originalStatus = Object.keys(statusMap).find(k => statusMap[k] === status) || status;
    const colors = {
      'Pending': '#FFF3CD',
      'In Progress': '#D1ECF1',
      'Ready': '#D4EDDA',
      'Completed': '#D4EDDA',
      'Cancelled': '#F8D7DA'
    };
    return colors[originalStatus] || colors[status] || '#E2E3E5';
  };

  const getStatusTextColor = (status) => {
    const statusMap = { [t('pending')]: 'Pending', [t('inProgress')]: 'In Progress', [t('ready')]: 'Ready', [t('completed')]: 'Completed', [t('cancelled')]: 'Cancelled' };
    const originalStatus = Object.keys(statusMap).find(k => statusMap[k] === status) || status;
    const colors = {
      'Pending': '#856404',
      'In Progress': '#0C5460',
      'Ready': '#155724',
      'Completed': '#155724',
      'Cancelled': '#721C24'
    };
    return colors[originalStatus] || colors[status] || '#383D41';
  };

  const translateStatus = (status) => {
    const statusMap = {
      'Pending': t('pending'),
      'In Progress': t('inProgress'),
      'Ready': t('ready'),
      'Completed': t('completed'),
      'Cancelled': t('cancelled')
    };
    return statusMap[status] || status;
  };

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const inProgressCount = orders.filter(o => o.status === 'In Progress').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom:'2rem'}}>
        <div className="form-card" style={{textAlign:'center',padding:'2rem'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📦</div>
          <div style={{fontSize:'2rem',fontWeight:'600',color:'var(--terracotta)'}}>{pendingCount}</div>
          <div style={{color:'var(--chocolate)',opacity:0.7}}>{t('pendingOrders')}</div>
        </div>
        <div className="form-card" style={{textAlign:'center',padding:'2rem'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>⚙️</div>
          <div style={{fontSize:'2rem',fontWeight:'600',color:'var(--terracotta)'}}>{inProgressCount}</div>
          <div style={{color:'var(--chocolate)',opacity:0.7}}>{t('inProgress')}</div>
        </div>
        <div className="form-card" style={{textAlign:'center',padding:'2rem'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>✅</div>
          <div style={{fontSize:'2rem',fontWeight:'600',color:'var(--terracotta)'}}>{readyCount}</div>
          <div style={{color:'var(--chocolate)',opacity:0.7}}>{t('ready')}</div>
        </div>
      </div>
      <div className="form-card">
        <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('allOrders')}</h3>
        {orders.length === 0 ? (
          <p style={{color:'var(--chocolate)',opacity:0.7}}>{t('noOrdersYet')}</p>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {orders.map(order => (
              <div key={order.id} style={{padding:'1.5rem',background:'var(--blush)',borderRadius:'16px',border:'1px solid rgba(0,0,0,0.1)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:'1rem',flexWrap:'wrap',gap:'1rem'}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',gap:'1rem',alignItems:'center',marginBottom:'0.5rem'}}>
                      <strong style={{fontSize:'1.1rem',color:'var(--espresso)'}}>{order.id}</strong>
                      <span style={{fontSize:'0.8rem',padding:'0.25rem 0.75rem',background:getStatusColor(order.status),color:getStatusTextColor(order.status),borderRadius:'50px',fontWeight:600}}>{translateStatus(order.status)}</span>
                    </div>
                    <div style={{fontSize:'0.9rem',color:'var(--chocolate)',marginBottom:'0.5rem'}}>
                      <strong>{t('customer')}:</strong> {order.customerName}
                    </div>
                    {order.email && (
                      <div style={{fontSize:'0.85rem',color:'var(--chocolate)',opacity:0.7,marginBottom:'0.25rem'}}>{order.email}</div>
                    )}
                    {order.phone && (
                      <div style={{fontSize:'0.85rem',color:'var(--chocolate)',opacity:0.7,marginBottom:'0.5rem'}}>{order.phone}</div>
                    )}
                    {order.address && (
                      <div style={{fontSize:'0.85rem',color:'var(--chocolate)',opacity:0.7,marginBottom:'0.5rem'}}>📍 {order.address}</div>
                    )}
                    {order.date && (
                      <div style={{fontSize:'0.85rem',color:'var(--chocolate)',opacity:0.7}}>📅 {new Date(order.date).toLocaleDateString()} {order.time && `(${order.time})`}</div>
                    )}
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'1.5rem',fontWeight:'600',color:'var(--terracotta)',marginBottom:'0.5rem'}}>{formatPrice(order.total)}</div>
                    <div style={{fontSize:'0.85rem',opacity:0.7}}>{order.items.length} {t('items')}</div>
                  </div>
                </div>
                <div style={{marginBottom:'1rem',padding:'0.75rem',background:'white',borderRadius:'8px'}}>
                  <strong style={{display:'block',marginBottom:'0.5rem',fontSize:'0.9rem'}}>{t('items')}:</strong>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{display:'flex',justifyContent:'space-between',fontSize:'0.85rem'}}>
                        <span>{item.product.name} × {item.quantity}</span>
                        <strong>{formatPrice(item.product.price * item.quantity)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                {order.notes && (
                  <div style={{marginBottom:'1rem',padding:'0.75rem',background:'white',borderRadius:'8px',fontSize:'0.85rem'}}>
                    <strong>Notes:</strong> {order.notes}
                  </div>
                )}
                <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                  <label style={{fontSize:'0.9rem',fontWeight:500}}>{t('updateStatus')}:</label>
                  <select 
                    value={order.status} 
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    style={{padding:'0.5rem 1rem',border:'2px solid var(--terracotta)',borderRadius:'8px',fontSize:'0.9rem',fontWeight:500,background:'white',cursor:'pointer'}}
                  >
                    <option value="Pending">{t('pending')}</option>
                    <option value="In Progress">{t('inProgress')}</option>
                    <option value="Ready">{t('ready')}</option>
                    <option value="Completed">{t('completed')}</option>
                    <option value="Cancelled">{t('cancelled')}</option>
                  </select>
                  <span style={{fontSize:'0.8rem',opacity:0.7,marginLeft:'auto'}}>{t('recentOrders')}: {new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const AdminPage = ({ onNavigate, ingredients, setIngredients, products, setProducts, orders, setOrders, formatCurrency }) => {
  const { isAdmin, invites, users, createInvite, deleteInvite, deleteUser, user, role } = useAuth();
  const { t } = useTranslation();
  const [tab, setTab] = useState('dashboard');
  const [newInv, setNewInv] = useState({ email: '', role: 'dealer', days: 7 });
  const [msg, setMsg] = useState('');
  const formatPrice = formatCurrency || ((amount) => `$${amount.toFixed(2)}`);
  
  // Ensure orders is an array
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

  // Check admin status - use multiple checks for reliability
  // Check localStorage as fallback in case context hasn't updated yet
  const checkAdmin = () => {
    if (isAdmin) return true;
    if (user && role === 'admin') return true;
    // Fallback: check localStorage directly
    try {
      const saved = localStorage.getItem('soulmate_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed && parsed.role === 'admin';
      }
    } catch (e) {
      console.error('Error checking admin status:', e);
    }
    return false;
  };

  const isAdminUser = checkAdmin();

  if (!isAdminUser) {
    return (
      <div className="page">
        <div className="success-msg">
          <div className="success-icon">🔒</div>
          <h2>{t('accessDenied')}</h2>
          <p>{t('adminOnly')} {t('pleaseLoginWithAdmin')}</p>
          <div style={{marginTop:'1.5rem',padding:'1rem',background:'var(--blush)',borderRadius:'12px',textAlign:'left',maxWidth:'400px',margin:'1.5rem auto'}}>
            <p style={{fontSize:'0.9rem',marginBottom:'0.5rem',fontWeight:600}}>{t('adminCredentials')}:</p>
            <p style={{fontSize:'0.85rem',fontFamily:'monospace'}}>
              {t('email')}: admin@soulmate.com<br/>
              {t('password')}: Admin@2024!
            </p>
          </div>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={() => onNavigate('login')}>{t('goToLogin')}</button>
            <button className="btn btn-secondary" onClick={() => onNavigate('home')}>{t('backToHome')}</button>
          </div>
        </div>
      </div>
    );
  }

  const handleCreate = e => {
    e.preventDefault();
    const r = createInvite(newInv.email, newInv.role, parseInt(newInv.days));
    if (r.success) { setMsg(`${t('createdToken')} ${r.invite.token}`); setNewInv({ email: '', role: 'dealer', days: 7 }); setTimeout(() => setMsg(''), 5000); }
  };

  const getStatus = inv => inv.used ? 'used' : new Date(inv.expiresAt) < new Date() ? 'expired' : 'active';

  return (
    <div className="page" style={{maxWidth:'1200px'}}>
      <div className="page-header"><h1>{t('adminDashboard')}</h1></div>
      <div className="tabs">
        <button className={`tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>{t('overview')}</button>
        <button className={`tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>{t('orders')}</button>
        <button className={`tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>{t('products')}</button>
        <button className={`tab ${tab === 'ingredients' ? 'active' : ''}`} onClick={() => setTab('ingredients')}>{t('ingredients')}</button>
        <button className={`tab ${tab === 'invites' ? 'active' : ''}`} onClick={() => setTab('invites')}>{t('invites')}</button>
        <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>{t('users')}</button>
      </div>

      {tab === 'dashboard' && (
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1.5rem',marginBottom:'2rem'}}>
            <div className="form-card" style={{textAlign:'center',padding:'2rem'}}><div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>📦</div><div style={{fontSize:'2rem',fontWeight:'600',color:'var(--terracotta)'}}>{safeOrders.filter(o => o.status === 'Pending').length}</div><div style={{color:'var(--chocolate)',opacity:0.7}}>{t('pendingOrders')}</div></div>
            <div className="form-card" style={{textAlign:'center',padding:'2rem'}}><div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>👥</div><div style={{fontSize:'2rem',fontWeight:'600',color:'var(--terracotta)'}}>{Array.isArray(users) ? users.length : 0}</div><div style={{color:'var(--chocolate)',opacity:0.7}}>{t('registeredUsers')}</div></div>
            <div className="form-card" style={{textAlign:'center',padding:'2rem'}}><div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>💰</div><div style={{fontSize:'2rem',fontWeight:'600',color:'var(--terracotta)'}}>{formatPrice(safeOrders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.total || 0), 0))}</div><div style={{color:'var(--chocolate)',opacity:0.7}}>{t('totalRevenue')}</div></div>
          </div>
          <div className="form-card"><h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('recentOrders')}</h3>
            {safeOrders.length === 0 ? (
              <p style={{color:'var(--chocolate)',opacity:0.7}}>{t('noOrdersYet')}</p>
            ) : (
              safeOrders.slice(0, 5).map(o => (
              <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem',background:'var(--blush)',borderRadius:'12px',marginBottom:'0.75rem'}}>
                  <div><strong>{o.id}</strong> — {o.customerName}<div style={{fontSize:'0.9rem',color:'var(--chocolate)',opacity:0.7}}>{o.items.map(i => `${i.product.name} ×${i.quantity}`).join(', ')}</div></div>
                  <div style={{textAlign:'right'}}><div style={{fontWeight:'600',color:'var(--terracotta)'}}>{formatPrice(o.total)}</div><div style={{fontSize:'0.8rem',padding:'0.25rem 0.75rem',background:o.status==='Pending'?'#FFF3CD':o.status==='Ready'?'#D4EDDA':o.status==='Cancelled'?'#F8D7DA':'#D1ECF1',borderRadius:'50px',display:'inline-block',marginTop:'0.25rem'}}>{t(o.status === 'Pending' ? 'pending' : o.status === 'Ready' ? 'ready' : o.status === 'Cancelled' ? 'cancelled' : o.status === 'In Progress' ? 'inProgress' : o.status === 'Completed' ? 'completed' : o.status)}</div></div>
              </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'invites' && (
        <>
          <div className="form-card" style={{marginBottom:'2rem'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('createNewInvite')}</h3>
            <form onSubmit={handleCreate}>
              <div className="form-row">
                <div className="form-group"><label>{t('emailOptional')}</label><input type="email" value={newInv.email} onChange={e => setNewInv({...newInv, email: e.target.value})} placeholder={t('leaveBlankForAnyEmail')} /></div>
                <div className="form-group"><label>{t('role')} *</label><select value={newInv.role} onChange={e => setNewInv({...newInv, role: e.target.value})}><option value="dealer">{t('dealer')}</option><option value="public">{t('regularUser')}</option></select></div>
              </div>
              <div className="form-group" style={{maxWidth:'200px'}}><label>{t('expiresInDays')}</label><input type="number" value={newInv.days} onChange={e => setNewInv({...newInv, days: e.target.value})} min="1" max="90" /></div>
              {msg && <p className="form-success">{msg}</p>}
              <button type="submit" className="btn btn-primary">{t('createInvite')}</button>
            </form>
          </div>
          <div className="form-card">
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('allInvites')}</h3>
            {invites.length === 0 ? <p style={{color:'var(--chocolate)',opacity:0.7}}>{t('noInvitesYet')}</p> : (
              <table className="admin-table"><thead><tr><th>{t('token')}</th><th>{t('email')}</th><th>{t('role')}</th><th>{t('status')}</th><th>{t('expires')}</th><th>{t('actions')}</th></tr></thead><tbody>
                {invites.map(inv => { const st = getStatus(inv); return (
                  <tr key={inv.id}><td><span className="token">{inv.token}</span></td><td>{inv.email || <em style={{opacity:0.5}}>{t('any')}</em>}</td><td style={{textTransform:'capitalize'}}>{inv.role === 'dealer' ? t('dealer') : t('regularUser')}</td><td><span className={`status ${st}`}>{t(st)}</span></td><td>{new Date(inv.expiresAt).toLocaleDateString()}</td><td>{st === 'active' && <button className="btn btn-small btn-danger" onClick={() => deleteInvite(inv.id)}>{t('delete')}</button>}</td></tr>
                );})}
              </tbody></table>
            )}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <OrdersManagement orders={safeOrders} setOrders={setOrders} formatCurrency={formatCurrency} />
      )}

      {tab === 'products' && (
        <ProductsManagement products={safeProducts} setProducts={setProducts} ingredients={safeIngredients} formatCurrency={formatCurrency} />
      )}

      {tab === 'ingredients' && (
        <IngredientsManagement ingredients={safeIngredients} setIngredients={setIngredients} products={safeProducts} />
      )}

      {tab === 'users' && (
        <div className="form-card">
          <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('registeredUsers')}</h3>
          {(!users || users.length === 0) ? <p style={{color:'var(--chocolate)',opacity:0.7}}>{t('noUsersYet')}</p> : (
            <table className="admin-table"><thead><tr><th>{t('name')}</th><th>{t('email')}</th><th>{t('phone')}</th><th>{t('role')}</th><th>{t('registered')}</th><th>{t('actions')}</th></tr></thead><tbody>
              {users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.phone || '-'}</td><td><span className={`status ${u.role==='dealer'?'active':''}`} style={{background:u.role==='dealer'?'#D4EDDA':'#E2E3E5'}}>{u.role === 'dealer' ? t('dealer') : t('regularUser')}</span></td><td>{new Date(u.createdAt).toLocaleDateString()}</td><td><button className="btn btn-small btn-danger" onClick={() => deleteUser(u.id)}>{t('remove')}</button></td></tr>)}
            </tbody></table>
          )}
        </div>
      )}
    </div>
  );
};

const SettingsPage = ({ onNavigate, settings, setSettings }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [currencyForm, setCurrencyForm] = useState({ code: '', name: '', symbol: '', rate: 1 });
  const [editingCurrency, setEditingCurrency] = useState(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'tk', name: 'Turkmen' }
  ];

  const handleLanguageChange = (langCode) => {
    setSettings(prev => ({ ...prev, language: langCode }));
  };

  const handleCurrencyChange = (currencyCode) => {
    setSettings(prev => ({ ...prev, currency: currencyCode }));
  };

  const handleAddCurrency = (e) => {
    e.preventDefault();
    if (editingCurrency) {
      setSettings(prev => ({
        ...prev,
        currencies: prev.currencies.map(c => 
          c.code === editingCurrency.code 
            ? { ...currencyForm, code: currencyForm.code.toUpperCase() }
            : c
        )
      }));
      setEditingCurrency(null);
    } else {
      setSettings(prev => ({
        ...prev,
        currencies: [...prev.currencies, { ...currencyForm, code: currencyForm.code.toUpperCase() }]
      }));
    }
    setCurrencyForm({ code: '', name: '', symbol: '', rate: 1 });
  };

  const handleEditCurrency = (currency) => {
    setEditingCurrency(currency);
    setCurrencyForm({ ...currency });
  };

  const handleDeleteCurrency = (code) => {
    if (code === 'USD') {
      alert('Cannot delete base currency (USD)');
      return;
    }
    if (settings.currency === code) {
      alert('Cannot delete active currency. Please switch to another currency first.');
      return;
    }
    setSettings(prev => ({
      ...prev,
      currencies: prev.currencies.filter(c => c.code !== code)
    }));
  };

  const handleUpdateExchangeRate = (code, newRate) => {
    setSettings(prev => ({
      ...prev,
      currencies: prev.currencies.map(c => 
        c.code === code ? { ...c, rate: parseFloat(newRate) || 1 } : c
      )
    }));
  };

  const baseCurrency = settings.currencies.find(c => c.code === 'USD') || { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 };
  const currentCurrency = settings.currencies.find(c => c.code === settings.currency) || baseCurrency;

  return (
    <div className="page" style={{maxWidth:'1200px'}}>
      <div className="page-header">
        <h1>{t('settings')}</h1>
        <p style={{color:'var(--chocolate)',opacity:0.7,marginTop:'0.5rem'}}>Manage your language and currency preferences</p>
      </div>

      <div className="tabs" style={{marginBottom:'2rem'}}>
        <button className={`tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
          {t('general')}
        </button>
        <button className={`tab ${activeTab === 'currencies' ? 'active' : ''}`} onClick={() => setActiveTab('currencies')}>
          {t('currencies')}
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="form-card">
          <div style={{marginBottom:'2rem',padding:'1.5rem',background:'var(--blush)',borderRadius:'12px',border:'2px solid var(--terracotta)'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'0.5rem',color:'var(--espresso)'}}>Admin Access</h3>
            <p style={{fontSize:'0.9rem',color:'var(--chocolate)',opacity:0.8,marginBottom:'1rem'}}>
              To access the Admin Dashboard, login with admin credentials:
            </p>
            <div style={{fontSize:'0.85rem',color:'var(--chocolate)',background:'white',padding:'1rem',borderRadius:'8px',marginBottom:'1rem',fontFamily:'monospace'}}>
              <strong>Email:</strong> admin@soulmate.com<br/>
              <strong>Password:</strong> Admin@2024!
            </div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              <button 
                className="btn btn-primary btn-small" 
                onClick={() => onNavigate('admin')}
              >
                Go to Admin Dashboard
              </button>
              {!user && (
                <button 
                  className="btn btn-secondary btn-small" 
                  onClick={() => onNavigate('login')}
                >
                  Login First
                </button>
              )}
            </div>
          </div>
          <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('languageSettings')}</h3>
          <div className="form-group">
            <label>{t('selectLanguage')}</label>
            <select 
              value={settings.language} 
              onChange={e => handleLanguageChange(e.target.value)}
              style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)'}}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div style={{marginTop:'2rem',paddingTop:'2rem',borderTop:'2px solid var(--blush)'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>{t('currencySettings')}</h3>
            <div className="form-group">
              <label>{t('selectCurrency')}</label>
              <select 
                value={settings.currency} 
                onChange={e => handleCurrencyChange(e.target.value)}
                style={{width:'100%',padding:'1rem',border:'2px solid var(--blush)',borderRadius:'12px',background:'rgba(255,255,255,0.8)'}}
              >
                {settings.currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </option>
                ))}
              </select>
              <p style={{marginTop:'0.5rem',fontSize:'0.85rem',color:'var(--chocolate)',opacity:0.7}}>
                Current rate: 1 USD = {currentCurrency.rate} {currentCurrency.code}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'currencies' && (
        <>
          <div className="form-card" style={{marginBottom:'2rem'}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>
              {editingCurrency ? 'Edit Currency' : 'Add New Currency'}
            </h3>
            <form onSubmit={handleAddCurrency}>
              <div className="form-row">
                <div className="form-group">
                  <label>Currency Code *</label>
                  <input 
                    type="text" 
                    value={currencyForm.code} 
                    onChange={e => setCurrencyForm({...currencyForm, code: e.target.value.toUpperCase()})}
                    placeholder="EUR, GBP, JPY, etc."
                    maxLength="3"
                    required
                    disabled={editingCurrency && editingCurrency.code === 'USD'}
                  />
                </div>
                <div className="form-group">
                  <label>Currency Name *</label>
                  <input 
                    type="text" 
                    value={currencyForm.name} 
                    onChange={e => setCurrencyForm({...currencyForm, name: e.target.value})}
                    placeholder="Euro, British Pound, etc."
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Symbol *</label>
                  <input 
                    type="text" 
                    value={currencyForm.symbol} 
                    onChange={e => setCurrencyForm({...currencyForm, symbol: e.target.value})}
                    placeholder="€, £, ¥, etc."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Exchange Rate (to USD) *</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={currencyForm.rate} 
                    onChange={e => setCurrencyForm({...currencyForm, rate: parseFloat(e.target.value) || 1})}
                    placeholder="1.0"
                    min="0.0001"
                    required
                  />
                  <small style={{color:'var(--chocolate)',opacity:0.7,display:'block',marginTop:'0.25rem'}}>
                    1 USD = {currencyForm.rate} {currencyForm.code || 'XXX'}
                  </small>
                </div>
              </div>
              <div style={{display:'flex',gap:'1rem'}}>
                <button type="submit" className="btn btn-primary">
                  {editingCurrency ? 'Update Currency' : 'Add Currency'}
                </button>
                {editingCurrency && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingCurrency(null);
                      setCurrencyForm({ code: '', name: '', symbol: '', rate: 1 });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="form-card">
            <h3 style={{fontFamily:"'Playfair Display',serif",marginBottom:'1.5rem'}}>Manage Currencies</h3>
            {settings.currencies.length === 0 ? (
              <p style={{color:'var(--chocolate)',opacity:0.7}}>No currencies added yet.</p>
            ) : (
              <div style={{overflowX:'auto'}}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Exchange Rate</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.currencies.map(curr => (
                      <tr key={curr.code}>
                        <td><strong>{curr.code}</strong></td>
                        <td>{curr.name}</td>
                        <td>{curr.symbol}</td>
                        <td>
                          {curr.code === 'USD' ? (
                            <span>1.0000 (Base)</span>
                          ) : (
                            <input 
                              type="number" 
                              step="0.0001"
                              value={curr.rate} 
                              onChange={e => handleUpdateExchangeRate(curr.code, e.target.value)}
                              style={{width:'120px',padding:'0.5rem',border:'2px solid var(--blush)',borderRadius:'8px',background:'rgba(255,255,255,0.8)'}}
                            />
                          )}
                        </td>
                        <td>
                          {curr.code !== 'USD' && (
                            <>
                              <button 
                                className="btn btn-small btn-secondary" 
                                onClick={() => handleEditCurrency(curr)}
                                style={{marginRight:'0.5rem'}}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-small btn-danger" 
                                onClick={() => handleDeleteCurrency(curr.code)}
                              >
                                Delete
                              </button>
                            </>
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
    </div>
  );
};

const Footer = ({ onNavigate }) => {
  const { t } = useTranslation();
  return (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-brand"><img src="/Soulmate.png" alt="Soulmate Desserts" style={{height:'60px',width:'auto',objectFit:'contain',maxWidth:'300px',display:'block',marginBottom:'0.5rem'}} /><p>{t('footerDescription')}</p></div>
      <div className="footer-section"><h4>{t('quickLinks')}</h4><ul><li><a onClick={() => onNavigate('home')}>{t('home')}</a></li><li><a onClick={() => onNavigate('catalog')}>{t('ourCakes')}</a></li><li><a onClick={() => onNavigate('contact')}>{t('contact')}</a></li></ul></div>
      <div className="footer-section"><h4>{t('collections')}</h4><ul><li><a onClick={() => onNavigate('catalog')}>{t('birthdayCakes')}</a></li><li><a onClick={() => onNavigate('catalog')}>{t('weddingCakes')}</a></li><li><a onClick={() => onNavigate('catalog')}>{t('cupcakes')}</a></li></ul></div>
      <div className="footer-section"><h4>{t('contact')}</h4><ul><li>(512) 555-CAKE</li><li>hello@soulmatedesserts.com</li></ul></div>
    </div>
    <div className="footer-bottom"><p>© 2024 Soulmate Desserts. {t('madeWithLove')}</p></div>
  </footer>
);
};

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [page, setPage] = useState('home');
  
  // Debug: log page changes
  useEffect(() => {
    console.log('Current page:', page);
  }, [page]);
  
  // Wrapper for setPage to ensure it works correctly
  const handleNavigate = (newPage) => {
    console.log('Navigating to:', newPage);
    if (newPage && typeof newPage === 'string') {
      setPage(newPage);
    }
  };
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('soulmate_products');
    return saved ? JSON.parse(saved) : [...mockProducts];
  });
  const [ingredients, setIngredients] = useState(() => {
    const saved = localStorage.getItem('soulmate_ingredients');
    return saved ? JSON.parse(saved) : [...ingredientsData];
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('soulmate_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('soulmate_settings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      language: 'en',
      currency: 'USD',
      currencies: [
        { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
        { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
        { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 150.25 },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.35 },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 }
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem('soulmate_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('soulmate_ingredients', JSON.stringify(ingredients));
    ingredientsData = ingredients;
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('soulmate_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('soulmate_settings', JSON.stringify(settings));
  }, [settings]);

  const handleUpdateProduct = (productId, updates) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === productId ? { ...p, ...updates } : p);
      return updated;
    });
  };

  const handleCreateOrder = (orderData) => {
    const newOrder = {
      id: `#${Date.now()}`,
      ...orderData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  // Currency conversion utility
  const convertCurrency = (amount) => {
    const currentCurrency = settings.currencies.find(c => c.code === settings.currency);
    if (!currentCurrency || settings.currency === 'USD') return amount;
    return amount * currentCurrency.rate;
  };

  const formatCurrency = (amount) => {
    const currentCurrency = settings.currencies.find(c => c.code === settings.currency) || settings.currencies[0];
    const converted = convertCurrency(amount);
    return `${currentCurrency.symbol}${converted.toFixed(2)}`;
  };

  const renderPage = () => {
    const pageKey = page || 'home';
    const commonProps = { onNavigate: handleNavigate, formatCurrency };
    
    switch (pageKey) {
      case 'home':
        return <HomePage {...commonProps} products={products} ingredients={ingredients} onUpdateProduct={handleUpdateProduct} />;
      case 'catalog':
        return <CatalogPage {...commonProps} products={products} ingredients={ingredients} onUpdateProduct={handleUpdateProduct} />;
      case 'checkout':
        return <CheckoutPage {...commonProps} onCreateOrder={handleCreateOrder} />;
      case 'contact':
        return <ContactPage {...commonProps} />;
      case 'login':
        return <LoginPage {...commonProps} />;
      case 'settings':
        return <SettingsPage {...commonProps} settings={settings} setSettings={setSettings} />;
      case 'admin':
        return <AdminPage {...commonProps} ingredients={ingredients} setIngredients={setIngredients} products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} />;
      default:
        console.warn(`Page "${pageKey}" not found, defaulting to home`);
        return <HomePage {...commonProps} products={products} ingredients={ingredients} onUpdateProduct={handleUpdateProduct} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <TranslationProvider language={settings?.language || 'en'}>
        <style>{styles}</style>
        <div className="app">
            <Header onNavigate={handleNavigate} />
            <div key={page}>
              {renderPage()}
        </div>
            <CartDrawer onNavigate={handleNavigate} formatCurrency={formatCurrency} />
            <Footer onNavigate={handleNavigate} />
          </div>
        </TranslationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
