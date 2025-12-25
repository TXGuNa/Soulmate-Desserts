
// Unified Dictionary: Keys grouped by feature, containing all languages
const DICTIONARY = {
  // Navigation
  home: { en: 'Home', ru: 'Главная', tr: 'Ana Sayfa', tk: 'Baş Sahypa' },
  ourCakes: { en: 'Our Cakes', ru: 'Наши Торты', tr: 'Pastalarımız', tk: 'Tortlarymyz' },
  contact: { en: 'Contact', ru: 'Контакты', tr: 'İletişim', tk: 'Habarlaşmak' },
  admin: { en: 'Admin', ru: 'Админ', tr: 'Yönetici', tk: 'Admin' },
  login: { en: 'Login', ru: 'Войти', tr: 'Giriş Yap', tk: 'Girmek' },
  logout: { en: 'Logout', ru: 'Выйти', tr: 'Çıkış Yap', tk: 'Çykmak' },
  settings: { en: 'Settings', ru: 'Настройки', tr: 'Ayarlar', tk: 'Sazlamalar' },
  cart: { en: 'Cart', ru: 'Корзина', tr: 'Sepet', tk: 'Sebet' },
  searchProducts: { en: 'Search Products', ru: 'Поиск Товаров', tr: 'Ürün Ara', tk: 'Önüm Gözle' },
  searchPlaceholder: { en: 'Search', ru: 'Поиск', tr: 'Ara', tk: 'Gözle' },

  // Hero
  heroTitle: { en: 'Where Every Bite is', ru: 'Где каждый кусочек - это', tr: 'Her Lokma', tk: 'Her Bir Bölek' },
  heroTitleEmphasis: { en: 'Pure Love', ru: 'Чистая Любовь', tr: 'Saf Aşk', tk: 'Arassa Söýgi' },
  heroDescription: { en: 'Handcrafted artisan desserts made with passion and the finest ingredients. From birthdays to weddings, we make every celebration sweeter.', ru: 'Ручные десерты, созданные с страстью и лучшими ингредиентами. От дней рождения до свадеб, мы делаем каждое празднование слаще.', tr: 'Tutku ve en iyi malzemelerle yapılmış el yapımı zanaat tatlıları. Doğum günlerinden düğünlere, her kutlamayı daha tatlı yapıyoruz.', tk: 'Yhlasly we iň gowy ingredientler bilen elde ýasalan desertler. Doglan günlerden toýlara çenli, her bir baýramçylygy has süýji edýäris.' },
  exploreCreations: { en: 'Explore Our Creations →', ru: 'Исследуйте Наши Творения →', tr: 'Yaratımlarımızı Keşfet →', tk: 'Döredijiligimizi Gözden Geçiriň →' },
  customOrders: { en: 'Custom Orders', ru: 'Индивидуальные Заказы', tr: 'Özel Siparişler', tk: 'Ýörite Sargytlar' },

  // Collections
  ourCollections: { en: 'Our Collections', ru: 'Наши Коллекции', tr: 'Koleksiyonlarımız', tk: 'Kolleksiýalarymyz' },
  collectionsSubtitle: { en: 'From intimate gatherings to grand celebrations', ru: 'От небольших встреч до грандиозных торжеств', tr: 'Samimi toplantılardan büyük kutlamalara', tk: 'Kiçi ýygnanyşyklardan uly baýramçylyklara' },
  featuredCreations: { en: 'Featured Creations', ru: 'Избранные Творения', tr: 'Öne Çıkan Yaratımlar', tk: 'Saýlanan Döredijilik' },
  featuredSubtitle: { en: 'Our most loved desserts this season', ru: 'Самые любимые десерты этого сезона', tr: 'Bu sezonun en sevilen tatlıları', tk: 'Bu möwsümiň iň söýgüli desertleri' },

  // Product
  addToCart: { en: 'Add to Cart', ru: 'Добавить в Корзину', tr: 'Sepete Ekle', tk: 'Sebede Goş' },
  quantity: { en: 'Quantity', ru: 'Количество', tr: 'Miktar', tk: 'Mukdar' },
  dealerPrice: { en: 'Dealer Price', ru: 'Цена Дилера', tr: 'Bayi Fiyatı', tk: 'Diler Bahasy' },
  retailPrice: { en: 'Retail Price', ru: 'Розничная Цена', tr: 'Perakende Fiyatı', tk: 'Bölek Satuw Bahasy' },
  regularSellingPrice: { en: 'Regular Selling Price', ru: 'Обычная Цена Продажи', tr: 'Normal Satış Fiyatı', tk: 'Adaty Satuw Bahasy' },
  cost: { en: 'Cost', ru: 'Себестоимость', tr: 'Maliyet', tk: 'Bahasy' },
  profit: { en: 'Profit', ru: 'Прибыль', tr: 'Kar', tk: 'Peýda' },
  margin: { en: 'Margin', ru: 'Маржа', tr: 'Marj', tk: 'Marja' },
  editPrice: { en: 'Edit Price', ru: 'Редактировать Цену', tr: 'Fiyatı Düzenle', tk: 'Bahany Üýtget' },
  save: { en: 'Save', ru: 'Сохранить', tr: 'Kaydet', tk: 'Sakla' },
  cancel: { en: 'Cancel', ru: 'Отмена', tr: 'İptal', tk: 'Ýatyr' },
  edit: { en: 'Edit', ru: 'Редактировать', tr: 'Düzenle', tk: 'Üýtget' },
  delete: { en: 'Delete', ru: 'Удалить', tr: 'Sil', tk: 'Poz' },

  // Cart
  yourCart: { en: 'Your Cart', ru: 'Ваша Корзина', tr: 'Sepetiniz', tk: 'Siziň Sebediňiz' },
  cartEmpty: { en: 'Your cart is empty', ru: 'Ваша корзина пуста', tr: 'Sepetiniz boş', tk: 'Sebediňiz boş' },
  subtotal: { en: 'Subtotal', ru: 'Промежуточный Итог', tr: 'Ara Toplam', tk: 'Ara Jemi' },
  proceedToCheckout: { en: 'Proceed to Checkout', ru: 'Перейти к Оформлению', tr: 'Ödemeye Geç', tk: 'Töleg Et' },
  remove: { en: 'Remove', ru: 'Удалить', tr: 'Kaldır', tk: 'Aýyr' },

  // Checkout
  checkout: { en: 'Checkout', ru: 'Оформление Заказа', tr: 'Ödeme', tk: 'Töleg' },
  contactInfo: { en: 'Contact Info', ru: 'Контактная Информация', tr: 'İletişim Bilgileri', tk: 'Habarlaşmak Maglumatlary' },
  firstName: { en: 'First Name', ru: 'Имя', tr: 'Ad', tk: 'Ady' },
  lastName: { en: 'Last Name', ru: 'Фамилия', tr: 'Soyad', tk: 'Familiýasy' },
  email: { en: 'Email', ru: 'Электронная Почта', tr: 'E-posta', tk: 'E-poçta' },
  phone: { en: 'Phone', ru: 'Телефон', tr: 'Telefon', tk: 'Telefon' },
  delivery: { en: 'Delivery', ru: 'Доставка', tr: 'Teslimat', tk: 'Eltip Bermek' },
  address: { en: 'Address', ru: 'Адрес', tr: 'Adres', tk: 'Salgy' },
  date: { en: 'Date', ru: 'Дата', tr: 'Tarih', tk: 'Sene' },
  time: { en: 'Time', ru: 'Время', tr: 'Saat', tk: 'Wagt' },
  morning: { en: 'Morning', ru: 'Утро', tr: 'Sabah', tk: 'Irden' },
  afternoon: { en: 'Afternoon', ru: 'День', tr: 'Öğleden Sonra', tk: 'Günortan' },
  evening: { en: 'Evening', ru: 'Вечер', tr: 'Akşam', tk: 'Agşam' },
  notes: { en: 'Notes', ru: 'Примечания', tr: 'Notlar', tk: 'Bellikler' },
  specialInstructions: { en: 'Special Instructions', ru: 'Особые Инструкции', tr: 'Özel Talimatlar', tk: 'Ýörite Görkezmeler' },
  anyRequests: { en: 'Any special requests...', ru: 'Любые особые пожелания...', tr: 'Özel istekleriniz...', tk: 'Ýörite haýyşlar...' },
  orderSummary: { en: 'Order Summary', ru: 'Сводка Заказа', tr: 'Sipariş Özeti', tk: 'Sargyt Jemi' },
  tax: { en: 'Tax', ru: 'Налог', tr: 'Vergi', tk: 'Salgyt' },
  total: { en: 'Total', ru: 'Итого', tr: 'Toplam', tk: 'Jemi' },
  placeOrder: { en: 'Place Order', ru: 'Оформить Заказ', tr: 'Sipariş Ver', tk: 'Sargyt Ber' },
  orderPlaced: { en: 'Order Placed!', ru: 'Заказ Размещен!', tr: 'Sipariş Verildi!', tk: 'Sargyt Berildi!' },
  orderPlacedMessage: { en: "We'll contact you shortly to confirm.", ru: 'Мы свяжемся с вами в ближайшее время для подтверждения.', tr: 'Onaylamak için kısa süre içinde sizinle iletişime geçeceğiz.', tk: 'Tassyklamak üçin gysga wagtda siz bilen habarlaşarys.' },
  continueShopping: { en: 'Continue Shopping', ru: 'Продолжить Покупки', tr: 'Alışverişe Devam Et', tk: 'Söwda Dowam Et' },
  addDessertsFirst: { en: 'Add desserts first!', ru: 'Сначала добавьте десерты!', tr: 'Önce tatlı ekleyin!', tk: 'Ilki desert goşuň!' },
  browse: { en: 'Browse', ru: 'Просмотр', tr: 'Gözat', tk: 'Göz at' },
  qty: { en: 'Qty', ru: 'Кол-во', tr: 'Adet', tk: 'San' },

  // Login
  welcomeBack: { en: 'Welcome Back', ru: 'С Возвращением', tr: 'Tekrar Hoşgeldiniz', tk: 'Hoş Geldiňiz' },
  joinUs: { en: 'Join Us', ru: 'Присоединяйтесь', tr: 'Bize Katılın', tk: 'Bize Goşulyň' },
  signInToAccount: { en: 'Sign in to your account', ru: 'Войдите в свой аккаунт', tr: 'Hesabınıza giriş yapın', tk: 'Hasabyňyza giriň' },
  registerWithInvite: { en: 'Register with invite token', ru: 'Регистрация по приглашению', tr: 'Davet koduyla kayıt olun', tk: 'Çakylyk bilen hasaba alyň' },
  signIn: { en: 'Sign In', ru: 'Войти', tr: 'Giriş Yap', tk: 'Gir' },
  signingIn: { en: 'Signing In...', ru: 'Входим...', tr: 'Giriş Yapılıyor...', tk: 'Girilýär...' },
  register: { en: 'Register', ru: 'Регистрация', tr: 'Kayıt Ol', tk: 'Hasaba Al' },
  password: { en: 'Password', ru: 'Пароль', tr: 'Şifre', tk: 'Açar söz' },
  createPassword: { en: 'Create Password', ru: 'Создать Пароль', tr: 'Şifre Oluştur', tk: 'Açar söz dörediň' },
  fullName: { en: 'Full Name', ru: 'Полное Имя', tr: 'Ad Soyad', tk: 'Doly Ady' },
  inviteToken: { en: 'Invite Token', ru: 'Токен Приглашения', tr: 'Davet Kodu', tk: 'Çakylyk Kody' },
  enterInviteToken: { en: 'Enter the token from admin', ru: 'Введите токен от администратора', tr: 'Yöneticiden aldığınız kodu girin', tk: 'Admindan alnan kody giriziň' },
  adminLogin: { en: 'Admin Login', ru: 'Вход Администратора', tr: 'Yönetici Girişi', tk: 'Admin Girişi' },
  testTokens: { en: 'Test Tokens', ru: 'Тестовые Токены', tr: 'Test Kodları', tk: 'Synag Kodlary' },
  username: { en: 'Dealer', ru: 'Дилер', tr: 'Bayi', tk: 'Diler' }, // Assuming 'dealer' key was used for Dealer role label
  dealer: { en: 'Dealer', ru: 'Дилер', tr: 'Bayi', tk: 'Diler' },
  user: { en: 'User', ru: 'Пользователь', tr: 'Kullanıcı', tk: 'Ulanyjy' },
  invalidCredentials: { en: 'Invalid credentials', ru: 'Неверные данные', tr: 'Geçersiz kimlik bilgileri', tk: 'Nädogry maglumatlar' },
  loginSuccessful: { en: 'Login successful! Redirecting...', ru: 'Успешный вход! Перенаправление...', tr: 'Giriş başarılı! Yönlendiriliyor...', tk: 'Üstünlikli giriş! Ugradylýar...' },

  // Contact
  getInTouch: { en: 'Get in Touch', ru: 'Связаться с Нами', tr: 'İletişime Geçin', tk: 'Habarlaşyň' },
  contactSubtitle: { en: 'Questions? Custom orders? We\'d love to hear from you!', ru: 'Вопросы? Индивидуальные заказы? Мы рады помочь!', tr: 'Sorularınız mı var? Özel siparişler? Sizden haber almak isteriz!', tk: 'Soraglaryňyz barmy? Ýörite sargytlar? Sizden eşitmek isleýäris!' },
  name: { en: 'Name', ru: 'Имя', tr: 'Ad', tk: 'Ady' },
  message: { en: 'Message', ru: 'Сообщение', tr: 'Mesaj', tk: 'Habar' },
  sendMessage: { en: 'Send Message', ru: 'Отправить Сообщение', tr: 'Mesaj Gönder', tk: 'Habar Iber' },
  messageSent: { en: 'Message Sent!', ru: 'Сообщение Отправлено!', tr: 'Mesaj Gönderildi!', tk: 'Habar Iberildi!' },
  messageSentConfirm: { en: "We'll reply within 24 hours.", ru: 'Мы ответим в течение 24 часов.', tr: '24 saat içinde yanıt vereceğiz.', tk: '24 sagadyň içinde jogap bereris.' },
  tellUsAboutDreamDessert: { en: 'Tell us about your dream dessert...', ru: 'Расскажите о вашем идеальном десерте...', tr: 'Hayalinizdeki tatlıyı bize anlatın...', tk: 'Arzuw edýän desertiňiz barada aýdyň...' },
  back: { en: 'Back', ru: 'Назад', tr: 'Geri', tk: 'Yza' },

  // Settings
  languageSettings: { en: 'Language Settings', ru: 'Настройки Языка', tr: 'Dil Ayarları', tk: 'Dil Sazlamalary' },
  selectLanguage: { en: 'Select Language', ru: 'Выберите Язык', tr: 'Dil Seçin', tk: 'Dil Saýla' },
  currencySettings: { en: 'Currency Settings', ru: 'Настройки Валюты', tr: 'Para Birimi Ayarları', tk: 'Pul Birligi Sazlamalary' },
  selectCurrency: { en: 'Select Currency', ru: 'Выберите Валюту', tr: 'Para Birimi Seçin', tk: 'Pul Birligi Saýla' },
  general: { en: 'General', ru: 'Общие', tr: 'Genel', tk: 'Umumy' },
  currencies: { en: 'Currencies', ru: 'Валюты', tr: 'Para Birimleri', tk: 'Pul Birlikleri' },
  addCurrency: { en: 'Add Currency', ru: 'Добавить Валюту', tr: 'Para Birimi Ekle', tk: 'Pul Birligi Goş' },
  currencyCode: { en: 'Currency Code', ru: 'Код Валюты', tr: 'Para Birimi Kodu', tk: 'Pul Birligi Kody' },
  currencyName: { en: 'Currency Name', ru: 'Название Валюты', tr: 'Para Birimi Adı', tk: 'Pul Birligi Ady' },
  symbol: { en: 'Symbol', ru: 'Символ', tr: 'Sembol', tk: 'Nyşan' },
  exchangeRate: { en: 'Exchange Rate', ru: 'Курс Обмена', tr: 'Döviz Kuru', tk: 'Alyş-çalyş Kursy' },

  actions: { en: 'Actions', ru: 'Действия', tr: 'İşlemler', tk: 'Hereketler' },
  defaultCurrency: { en: 'Default', ru: 'По Умолчанию', tr: 'Varsayılan', tk: 'Bellenen' },
  setDefault: { en: 'Set as Default', ru: 'Сделать Головным', tr: 'Varsayılan Yap', tk: 'Esasy Et' },
  adminGeneralSettings: { en: 'General Settings', ru: 'Общие Настройки', tr: 'Genel Ayarlar', tk: 'Umumy Sazlamalar' },
  contactEmail: { en: 'Contact Email', ru: 'Контактный Email', tr: 'İletişim E-posta', tk: 'Habarlaşmak E-poçta' },
  contactPhone: { en: 'Contact Phone', ru: 'Контактный Телефон', tr: 'İletişim Telefon', tk: 'Habarlaşmak Telefon' },
  footerSettingsDescription: { en: 'These details will be displayed in the site footer.', ru: 'Эти данные будут отображаться в футере сайта.', tr: 'Bu bilgiler site altbilgisinde görüntülenecektir.', tk: 'Bu maglumatlar saýtyň aşaky böleginde görkeziler.' },

  // NEW KEYS (Currency Settings)
  manageCurrencies: { en: 'Manage Currencies', ru: 'Управление валютами', tr: 'Para Birimlerini Yönet', tk: 'Pul Birliklerini Dolandyr' },
  addNewCurrency: { en: 'Add New Currency', ru: 'Добавить новую валюту', tr: 'Yeni Para Birimi Ekle', tk: 'Täze Pul Birligi Goş' },
  editCurrency: { en: 'Edit Currency', ru: 'Редактировать валюту', tr: 'Para Birimini Düzenle', tk: 'Pul Birligini Üýtget' },
  updateCurrency: { en: 'Update Currency', ru: 'Обновить валюту', tr: 'Para Birimini Güncelle', tk: 'Pul Birligini Täzele' },
  confirmAddCurrency: { en: 'Add Currency', ru: 'Добавить', tr: 'Ekle', tk: 'Goş' },
  noCurrenciesAdded: { en: 'No currencies added yet.', ru: 'Валюты еще не добавлены.', tr: 'Henüz para birimi eklenmedi.', tk: 'Entek pul birligi goşulmady.' },
  baseCurrencyLabel: { en: 'Base', ru: 'Базовая', tr: 'Baz', tk: 'Esasy' },
  currentRate: { en: 'Current rate', ru: 'Текущий курс', tr: 'Güncel kur', tk: 'Hazirki kurs' },
  cannotDeleteBase: { en: 'Cannot delete base currency', ru: 'Нельзя удалить базовую валюту', tr: 'Baz para birimi silinemez', tk: 'Esasy pul birligini pozup bolmaýar' },
  cannotDeleteActive: { en: 'Cannot delete active currency. Please switch to another currency first.', ru: 'Нельзя удалить активную валюту. Пожалуйста, сначала переключитесь на другую.', tr: 'Aktif para birimi silinemez. Lütfen önce başka bir para birimine geçin.', tk: 'Işjeň pul birligini pozup bolmaýar. Ilki bilen başga pul birligine geçiň.' },
  
  // NEW KEYS (User Feedback & Base Currency)
  failedToSaveLanguage: { en: 'Failed to save language.', ru: 'Не удалось сохранить язык.', tr: 'Dil kaydedilemedi.', tk: 'Dil saklanyp bilmedi.' },
  failedToSaveDefaultCurrency: { en: 'Failed to save default currency.', ru: 'Не удалось сохранить валюту по умолчанию.', tr: 'Varsayılan para birimi kaydedilemedi.', tk: 'Bellenen pul birligi saklanyp bilmedi.' },
  failedToSaveChanges: { en: 'Failed to save changes.', ru: 'Не удалось сохранить изменения.', tr: 'Değişiklikler kaydedilemedi.', tk: 'Üýtgeşmeler saklanyp bilmedi.' },
  failedToDeleteCurrency: { en: 'Failed to delete currency.', ru: 'Не удалось удалить валюту.', tr: 'Para birimi silinemedi.', tk: 'Pul birligi pozulyp bilmedi.' },
  failedToUpdateExchangeRate: { en: 'Failed to update exchange rate.', ru: 'Не удалось обновить курс обмена.', tr: 'Döviz kuru güncellenemedi.', tk: 'Alyş-çalyş kursy täzelenip bilmedi.' },
  saving: { en: 'Saving...', ru: 'Сохранение...', tr: 'Kaydediliyor...', tk: 'Saklanýar...' },
  setAsBase: { en: 'Set as Base', ru: 'Установить как базовую', tr: 'Temel Olarak Ayarla', tk: 'Esasy Edip Bellik' },
  baseCurrency: { en: 'Base Currency', ru: 'Базовая Валюта', tr: 'Temel Para Birimi', tk: 'Esasy Pul Birligi' },

  // Store Settings
  storeSettings: { en: 'Store Settings', ru: 'Настройки Магазина', tr: 'Mağaza Ayarları', tk: 'Dükan Sazlamalary' },
  shippingCost: { en: 'Shipping Cost', ru: 'Стоимость Доставки', tr: 'Kargo Ücreti', tk: 'Eltip Bermek Bahasy' },
  taxRate: { en: 'Tax Rate (%)', ru: 'Налоговая Ставка (%)', tr: 'Vergi Oranı (%)', tk: 'Salgyt Möçberi (%)' },
  shipping: { en: 'Shipping', ru: 'Доставка', tr: 'Kargo', tk: 'Eltip bermek' },

  // Admin
  adminDashboard: { en: 'Admin Dashboard', ru: 'Панель Администратора', tr: 'Yönetici Paneli', tk: 'Admin Paneli' },
  overview: { en: 'Overview', ru: 'Обзор', tr: 'Genel Bakış', tk: 'Syn' },
  orders: { en: 'Orders', ru: 'Заказы', tr: 'Siparişler', tk: 'Sargytlar' },
  products: { en: 'Products', ru: 'Товары', tr: 'Ürünler', tk: 'Önümler' },
  ingredients: { en: 'Ingredients', ru: 'Ингредиенты', tr: 'Malzemeler', tk: 'Ingredientler' },
  invites: { en: 'Invites', ru: 'Приглашения', tr: 'Davetiyeler', tk: 'Çakylyklar' },
  users: { en: 'Users', ru: 'Пользователи', tr: 'Kullanıcılar', tk: 'Ulanyjylar' },
  pendingOrders: { en: 'Pending Orders', ru: 'Ожидающие Заказы', tr: 'Bekleyen Siparişler', tk: 'Garaşylýan Sargytlar' },
  registeredUsers: { en: 'Registered Users', ru: 'Зарегистрированные Пользователи', tr: 'Kayıtlı Kullanıcılar', tk: 'Hasaba Alnan Ulanyjylar' },
  totalRevenue: { en: 'Total Revenue', ru: 'Общий Доход', tr: 'Toplam Gelir', tk: 'Jemi Girdeji' },
  thisWeek: { en: 'This Week', ru: 'Эта Неделя', tr: 'Bu Hafta', tk: 'Bu Hepde' },
  recentOrders: { en: 'Recent Orders', ru: 'Недавние Заказы', tr: 'Son Siparişler', tk: 'Soňky Sargytlar' },
  allOrders: { en: 'All Orders', ru: 'Все Заказы', tr: 'Tüm Siparişler', tk: 'Ähli Sargytlar' },
  pending: { en: 'Pending', ru: 'Ожидает', tr: 'Bekliyor', tk: 'Garaşylýar' },
  inProgress: { en: 'In Progress', ru: 'В Работе', tr: 'Hazırlanıyor', tk: 'Taýýarlanýar' },
  ready: { en: 'Ready', ru: 'Готов', tr: 'Hazır', tk: 'Taýýar' },
  delivered: { en: 'Delivered', ru: 'Доставлен', tr: 'Teslim Edildi', tk: 'Gowşuryldy' },
  cancelled: { en: 'Cancelled', ru: 'Отменен', tr: 'İptal Edildi', tk: 'Ýatyryldy' },
  customer: { en: 'Customer', ru: 'Клиент', tr: 'Müşteri', tk: 'Müşderi' },
  items: { en: 'Items', ru: 'Товары', tr: 'Ürünler', tk: 'Harytlar' },
  status: { en: 'Status', ru: 'Статус', tr: 'Durum', tk: 'Ýagdaý' },

  // Admin - Invites
  createNewInvite: { en: 'Create New Invite', ru: 'Создать Приглашение', tr: 'Yeni Davet Oluştur', tk: 'Täze Çakylyk Döret' },
  emailOptional: { en: 'Email (optional - restrict to specific email)', ru: 'Email (опционально)', tr: 'E-posta (opsiyonel)', tk: 'E-poçta (hökmany däl)' },
  leaveBlankForAnyEmail: { en: 'Leave blank for any email', ru: 'Оставьте пустым для любого email', tr: 'Herhangi bir e-posta için boş bırakın', tk: 'Islendik e-poçta üçin boş goýuň' },
  leaveBlankForAnyEmailPlaceholder: { en: 'Leave blank for any email', ru: 'Оставьте пустым для любого email', tr: 'Herhangi bir e-posta için boş bırakın', tk: 'Islendik e-poçta üçin boş goýuň' },
  role: { en: 'Role', ru: 'Роль', tr: 'Rol', tk: 'Rol' },
  regularUser: { en: 'Regular User', ru: 'Обычный Пользователь', tr: 'Normal Kullanıcı', tk: 'Adaty Ulanyjy' },
  expiresInDays: { en: 'Expires in (days)', ru: 'Истекает через (дней)', tr: 'Geçerlilik (gün)', tk: 'Möhleti (gün)' },
  createInvite: { en: 'Create Invite', ru: 'Создать Приглашение', tr: 'Davet Oluştur', tk: 'Çakylyk Döret' },
  allInvites: { en: 'All Invites', ru: 'Все Приглашения', tr: 'Tüm Davetler', tk: 'Ähli Çakylyklar' },
  noInvitesYet: { en: 'No invites yet.', ru: 'Приглашений пока нет.', tr: 'Henüz davet yok.', tk: 'Entek çakylyk ýok.' },
  token: { en: 'Token', ru: 'Токен', tr: 'Kod', tk: 'Kod' },
  expires: { en: 'Expires', ru: 'Истекает', tr: 'Bitiş', tk: 'Möhleti' },
  active: { en: 'Active', ru: 'Активный', tr: 'Aktif', tk: 'Işjeň' },
  used: { en: 'Used', ru: 'Использован', tr: 'Kullanıldı', tk: 'Ulanyldy' },
  expired: { en: 'Expired', ru: 'Истек', tr: 'Süresi Doldu', tk: 'Möhleti Geçdi' },
  any: { en: 'Any', ru: 'Любой', tr: 'Herhangi', tk: 'Islendik' },

  // Admin - Users
  noUsersYet: { en: 'No users registered yet.', ru: 'Пользователей пока нет.', tr: 'Henüz kayıtlı kullanıcı yok.', tk: 'Entek hasaba alnan ulanyjy ýok.' },
  registered: { en: 'Registered', ru: 'Зарегистрирован', tr: 'Kayıt Tarihi', tk: 'Hasaba Alyndy' },

  // Admin - Products
  productManagement: { en: 'Product Management', ru: 'Управление Товарами', tr: 'Ürün Yönetimi', tk: 'Önüm Dolandyryşy' },
  makingPrice: { en: 'Making Price', ru: 'Цена Изготовления', tr: 'Yapım Ücreti', tk: 'Ýasama Bahasy' },
  productRegions: { en: 'Available Regions', ru: 'Доступные Регионы', tr: 'Mevcut Bölgeler', tk: 'Elýeterli Sebitler' },
  productRegionsHelp: { en: 'Leave empty to show in all regions, or select specific regions to restrict availability.', ru: 'Оставьте пустым для всех регионов или выберите конкретные регионы.', tr: 'Tüm bölgelerde göstermek için boş bırakın veya belirli bölgeleri seçin.', tk: 'Ähli sebitlere görkezmek üçin boş goýuň ýa-da belli sebitleri saýlaň.' },
  allRegions: { en: 'All Regions', ru: 'Все Регионы', tr: 'Tüm Bölgeler', tk: 'Ähli Sebitler' },

  // Admin - Ingredients
  ingredientManagement: { en: 'Ingredient Management', ru: 'Управление Ингредиентами', tr: 'Malzeme Yönetimi', tk: 'Ingredient Dolandyryşy' },
  addIngredient: { en: 'Add Ingredient', ru: 'Добавить Ингредиент', tr: 'Malzeme Ekle', tk: 'Ingredient Goş' },
  ingredientName: { en: 'Ingredient Name', ru: 'Название Ингредиента', tr: 'Malzeme Adı', tk: 'Ingredient Ady' },
  unit: { en: 'Unit', ru: 'Единица', tr: 'Birim', tk: 'Birlik' },
  pricePerUnit: { en: 'Price per Unit', ru: 'Цена за Единицу', tr: 'Birim Fiyatı', tk: 'Birlik Bahasy' },
  noIngredientsYet: { en: 'No ingredients yet.', ru: 'Ингредиентов пока нет.', tr: 'Henüz malzeme yok.', tk: 'Entek ingredient ýok.' },

  // Admin - Orders
  orderManagement: { en: 'Order Management', ru: 'Управление Заказами', tr: 'Sipariş Yönetimi', tk: 'Sargyt Dolandyryşy' },
  noOrdersYet: { en: 'No orders yet.', ru: 'Заказов пока нет.', tr: 'Henüz sipariş yok.', tk: 'Entek sargyt ýok.' },
  viewDetails: { en: 'View Details', ru: 'Подробнее', tr: 'Detaylar', tk: 'Jikme-jiklikler' },
  updateStatus: { en: 'Update Status', ru: 'Обновить Статус', tr: 'Durumu Güncelle', tk: 'Ýagdaýy Täzele' },
  completed: { en: 'Completed', ru: 'Завершен', tr: 'Tamamlandı', tk: 'Tamamlandy' },
  
  // Admin - Common
  goToLogin: { en: 'Go to Login', ru: 'Перейти к Входу', tr: 'Girişe Git', tk: 'Girişe Git' },
  backToHome: { en: 'Back to Home', ru: 'Вернуться на Главную', tr: 'Ana Sayfaya Dön', tk: 'Baş Sahypa' },
  adminCredentials: { en: 'Admin Credentials', ru: 'Учетные Данные Администратора', tr: 'Yönetici Bilgileri', tk: 'Admin Maglumatlary' },
  pleaseLoginWithAdmin: { en: 'Please login with admin credentials.', ru: 'Пожалуйста, войдите с учетными данными администратора.', tr: 'Lütfen yönetici bilgileriyle giriş yapın.', tk: 'Admin maglumatlary bilen giriň.' },
  createdToken: { en: 'Created! Token:', ru: 'Создано! Токен:', tr: 'Oluşturuldu! Kod:', tk: 'Döredildi! Kod:' },
  update: { en: 'Update', ru: 'Обновить', tr: 'Güncelle', tk: 'Täzele' },
  save: { en: 'Save', ru: 'Сохранить', tr: 'Kaydet', tk: 'Sakla' },
  add: { en: 'Add', ru: 'Добавить', tr: 'Ekle', tk: 'Goş' },
  confirmProductName: { en: 'Confirm/Edit product name', ru: 'Подтвердите/измените название товара', tr: 'Ürün adını onayla/düzenle', tk: 'Önüm adyny tassykla/üýtget' },
  createAsNewProduct: { en: 'Create {name} as new product', ru: 'Создать {name} как новый товар', tr: '{name} ürününü yeni oluştur', tk: '{name} adynda täze önüm döret' },
  editIngredient: { en: 'Edit Ingredient', ru: 'Редактировать Ингредиент', tr: 'Malzemeyi Düzenle', tk: 'Ingredienti Üýtget' },
  addNewIngredient: { en: 'Add New Ingredient', ru: 'Добавить Новый Ингредиент', tr: 'Yeni Malzeme Ekle', tk: 'Täze Ingredient Goş' },
  deleteIngredientConfirm: { en: 'Delete this ingredient?', ru: 'Удалить этот ингредиент?', tr: 'Bu malzemeyi silmek istediğinizden emin misiniz?', tk: 'Bu ingredienti pozmak isleýärsiňizmi?' },
  ingredientNameRequired: { en: 'Ingredient name is required', ru: 'Название ингредиента обязательно', tr: 'Malzeme adı gereklidir', tk: 'Ingredient ady hökmany' },
  ingredientUsedInProducts: { en: 'This ingredient is used in {count} product(s): {products}. Are you sure you want to delete it?', ru: 'Этот ингредиент используется в {count} товаре(ах): {products}. Вы уверены, что хотите удалить его?', tr: 'Bu malzeme {count} üründe kullanılıyor: {products}. Silmek istediğinizden emin misiniz?', tk: 'Bu ingredient {count} önümde ulanylyar: {products}. Pozmak isleýärsiňizmi?' },
  productName: { en: 'Product Name', ru: 'Название Товара', tr: 'Ürün Adı', tk: 'Önüm Ady' },
  productNotFound: { en: 'Product not found', ru: 'Товар не найден', tr: 'Ürün bulunamadı', tk: 'Önüm tapylmady' },
  productBadge: { en: 'Product Badge', ru: 'Бейдж Товара', tr: 'Ürün Rozeti', tk: 'Önüm Nyşany' },
  noneNoBadge: { en: 'None (No Badge)', ru: 'Нет (Без Бейджа)', tr: 'Yok (Rozet Yok)', tk: 'Ýok (Nyşan Ýok)' },
  showInLanguages: { en: 'Show in Languages', ru: 'Показывать на Языках', tr: 'Dillerde Göster', tk: 'Dillerde Görkez' },
  selectLanguagesProduct: { en: 'Select which languages this product will be visible in. At least one language required.', ru: 'Выберите языки, на которых будет виден этот товар. Требуется хотя бы один.', tr: 'Bu ürünün hangi dillerde görüneceğini seçin. En az bir dil gereklidir.', tk: 'Bu önümiň haýsy dillerde görünjekdigini saýlaň. Iň az bir dil zerur.' },
  createProduct: { en: 'Create Product', ru: 'Создать Товар', tr: 'Ürün Oluştur', tk: 'Önüm Döret' },
  create: { en: 'Create', ru: 'Создать', tr: 'Oluştur', tk: 'Döret' },
  createEditProduct: { en: 'Create / Edit Product', ru: 'Создать / Редактировать Товар', tr: 'Ürün Oluştur / Düzenle', tk: 'Önüm Döret / Üýtget' },
  saveChanges: { en: 'Save Changes', ru: 'Сохранить Изменения', tr: 'Değişiklikleri Kaydet', tk: 'Üýtgeşmeleri Sakla' },
  visibleIn: { en: 'Visible in:', ru: 'Виден в:', tr: 'Görünür:', tk: 'Görünýär:' },
  imageSizeLimit: { en: 'Image size must be less than 5MB', ru: 'Размер изображения должен быть меньше 5 МБ', tr: 'Görsel boyutu 5MB\'dan küçük olmalıdır', tk: 'Surat ölçegi 5MB-dan kiçi bolmaly' },
  imageResolutionLimit: { en: 'Image resolution too large', ru: 'Слишком большое разрешение изображения', tr: 'Görsel çözünürlüğü çok büyük', tk: 'Suratyň çözgüdi gaty uly' },
  selectImageFile: { en: 'Please select an image file', ru: 'Выбрать файл', tr: 'Dosya Seç', tk: 'Faýl Saýla' },
  imageUploadedSuccess: { en: 'Image uploaded successfully!', ru: 'Изображение успешно загружено!', tr: 'Görsel başarıyla yüklendi!', tk: 'Surat üstünlikli ýüklendi!' },
  imageURL: { en: 'Image URL', ru: 'URL Изображения', tr: 'Görsel URL', tk: 'Surat URL' },
  uploadImage: { en: 'Upload Image', ru: 'Загрузить Изображение', tr: 'Görsel Yükle', tk: 'Surat Ýükle' },
  description: { en: 'Description', ru: 'Описание', tr: 'Açıklama', tk: 'Düşündiriş' },

  // Cost Analysis
  costAnalysis: { en: 'Cost Analysis', ru: 'Анализ Стоимости', tr: 'Maliyet Analizi', tk: 'Baha Derňewi' },
  pricingBreakdown: { en: 'Pricing Breakdown', ru: 'Детализация Цены', tr: 'Fiyat Ayrıntısı', tk: 'Bahanyň Detallary' },
  showCostAnalysis: { en: 'Show Cost Analysis', ru: 'Показать Анализ', tr: 'Analizi Göster', tk: 'Derňewi Görkez' },
  hideCostAnalysis: { en: 'Hide Cost Analysis', ru: 'Скрыть Анализ', tr: 'Analizi Gizle', tk: 'Derňewi Gizle' },
  totalCost: { en: 'Total Cost', ru: 'Общая Стоимость', tr: 'Toplam Maliyet', tk: 'Jemi Baha' },
  sellingPrice: { en: 'Selling Price', ru: 'Цена Продажи', tr: 'Satış Fiyatı', tk: 'Satuw Bahasy' },
  profitMargin: { en: 'Markup', ru: 'Наценка', tr: 'Kar Oranı', tk: 'Üstüne goýma' },
  confirmDelete: { en: 'Confirm Delete', ru: 'Подтвердите удаление', tr: 'Silmeyi Onayla', tk: 'Pozmagy Tassykla' },
  confirmDeleteDetail: { en: 'Delete the selected product from your catalog.', ru: 'Удалить выбранный товар из каталога.', tr: 'Seçili ürünü kataloğunuzdan silin.', tk: 'Saýlanan önümi katalogdan poz.' },
  selectFaceImage: { en: 'Select Face Image', ru: 'Выберите лицевое изображение', tr: 'Kapak Görselini Seç', tk: 'Görkeziljek suraty saýla' },
  noIngredientsListed: { en: 'No ingredients listed', ru: 'Ингредиенты не указаны', tr: 'Malzeme listesi yok', tk: 'Ingredient sanawda ýok' },
  makingPriceLabor: { en: 'Making Price (Labor)', ru: 'Стоимость Работы', tr: 'İşçilik Ücreti', tk: 'Zähmet Bahasy' },

  // Footer
  footerDescription: { en: 'Handcrafted with love. Premium ingredients for unforgettable celebrations.', ru: 'Сделано с любовью. Премиум ингредиенты для незабываемых праздников.', tr: 'Sevgiyle yapıldı. Unutulmaz kutlamalar için premium malzemeler.', tk: 'Söýgi bilen ýasaldy. Ýatdan çykmajak baýramçylyklar üçin premium ingredientler.' },
  quickLinks: { en: 'Quick Links', ru: 'Быстрые Ссылки', tr: 'Hızlı Bağlantılar', tk: 'Çalt Baglanyşyklar' },
  collections: { en: 'Collections', ru: 'Коллекции', tr: 'Koleksiyonlar', tk: 'Kolleksiýalar' },
  birthdayCakes: { en: 'Birthday Cakes', ru: 'Торты на День Рождения', tr: 'Doğum Günü Pastaları', tk: 'Doglan Gün Tortlary' },
  weddingCakes: { en: 'Wedding Cakes', ru: 'Свадебные Торты', tr: 'Düğün Pastaları', tk: 'Toý Tortlary' },
  cupcakes: { en: 'Cupcakes', ru: 'Капкейки', tr: 'Cupcake\'ler', tk: 'Kapkeýkler' },
  madeWithLove: { en: 'Made with 💝', ru: 'Сделано с 💝', tr: '💝 ile yapıldı', tk: '💝 bilen ýasaldy' },
  
  // Data Management
  dataManagement: { en: 'Data Management', ru: 'Управление Данными', tr: 'Veri Yönetimi', tk: 'Maglumat Dolandyryşy' },
  resetData: { en: 'Reset', ru: 'Сброс', tr: 'Sıfırla', tk: 'Aslyna Getir' },

  // Country Contact Settings
  countryContacts: { en: 'Country Contacts', ru: 'Контакты по Странам', tr: 'Ülke İletişimleri', tk: 'Ýurt Aragatnaşyklary' },
  countryContactsDescription: { en: 'Manage contact info for different countries. Visitors will see contact info based on their location.', ru: 'Управление контактами для разных стран. Посетители увидят контакты своей страны.', tr: 'Farklı ülkeler için iletişim bilgilerini yönetin. Ziyaretçiler konumlarına göre iletişim bilgilerini görecektir.', tk: 'Dürli ýurtlar üçin aragatnaşyk maglumatlaryny dolandyryň. Myhmanlar öz ýerleşýän ýerine görä aragatnaşyk maglumatlaryny görerler.' },
  addCountryContact: { en: 'Add Country Contact', ru: 'Добавить Контакт Страны', tr: 'Ülke İletişimi Ekle', tk: 'Ýurt Aragatnaşygyny Goş' },
  editCountryContact: { en: 'Edit Country Contact', ru: 'Редактировать Контакт', tr: 'İletişimi Düzenle', tk: 'Aragatnaşygy Üýtget' },
  countryName: { en: 'Country Name', ru: 'Название Страны', tr: 'Ülke Adı', tk: 'Ýurt Ady' },
  countryCode: { en: 'Country Code', ru: 'Код Страны', tr: 'Ülke Kodu', tk: 'Ýurt Kody' },
  countryCodeHelp: { en: 'ISO 2-letter code (e.g., US, TM, DE) or GENERAL for default', ru: 'ISO 2-буквенный код (напр., US, TM, DE) или GENERAL по умолчанию', tr: 'ISO 2 harfli kod (örn: US, TM, DE) veya varsayılan için GENERAL', tk: 'ISO 2 harpli kod (meselem, US, TM, DE) ýa-da deslapky üçin GENERAL' },
  setAsDefault: { en: 'Set as Default', ru: 'Установить по умолчанию', tr: 'Varsayılan Yap', tk: 'Deslapky edip Bellemek' },
  defaultContact: { en: 'Default', ru: 'По умолчанию', tr: 'Varsayılan', tk: 'Deslapky' },
  noCountryContacts: { en: 'No country contacts yet. Add one to get started.', ru: 'Контактов по странам пока нет. Добавьте первый.', tr: 'Henüz ülke iletişimi yok. Başlamak için bir tane ekleyin.', tk: 'Entek ýurt aragatnaşygy ýok. Başlamak üçin goşuň.' },
  deleteCountryContact: { en: 'Delete this country contact?', ru: 'Удалить контакт этой страны?', tr: 'Bu ülke iletişimini silmek istiyor musunuz?', tk: 'Bu ýurt aragatnaşygyny pozmak isleýärsiňizmi?' },
  cannotDeleteDefault: { en: 'Cannot delete the default contact. Set another contact as default first.', ru: 'Нельзя удалить контакт по умолчанию. Сначала установите другой контакт как основной.', tr: 'Varsayılan iletişim silinemez. Önce başka bir iletişimi varsayılan yapın.', tk: 'Deslapky aragatnaşygy pozmak bolmaýar. Ilki başga aragatnaşygy deslapky edip belläň.' },
  yourLocation: { en: 'Your Location', ru: 'Ваше Местоположение', tr: 'Konumunuz', tk: 'Siziň Ýerleşýän Ýeriňiz' },
  contactInfoForYourRegion: { en: 'Contact info for your region', ru: 'Контакты для вашего региона', tr: 'Bölgeniz için iletişim bilgileri', tk: 'Siziň sebitiňiz üçin aragatnaşyk maglumatlary' },

  // Messages
  messages: { en: 'Messages', ru: 'Сообщения', tr: 'Mesajlar', tk: 'Habarlar' },
  sender: { en: 'Sender', ru: 'Отправитель', tr: 'Gönderen', tk: 'Ugradyjy' },
  date: { en: 'Date', ru: 'Дата', tr: 'Tarih', tk: 'Sene' },
  noMessagesYet: { en: 'No messages yet', ru: 'Сообщений пока нет', tr: 'Henüz mesaj yok', tk: 'Heniz habar ýok' },
  viewMessage: { en: 'View Message', ru: 'Просмотреть', tr: 'Mesajı Gör', tk: 'Habary Gör' },
  messageCreateSuccess: { en: 'Message sent successfully!', ru: 'Сообщение успешно отправлено!', tr: 'Mesaj başarıyla gönderildi!', tk: 'Habar üstünlikli ugradyldy!' },

  // Access
  accessDenied: { en: 'Access Denied', ru: 'Доступ Запрещен', tr: 'Erişim Engellendi', tk: 'Giriş Gadagan' },
  adminOnly: { en: 'Admin only.', ru: 'Только для администратора.', tr: 'Sadece yönetici.', tk: 'Diňe admin üçin.' },

  // Common
  loading: { en: 'Loading...', ru: 'Загрузка...', tr: 'Yükleniyor...', tk: 'Ýüklenýär...' },
  error: { en: 'Error', ru: 'Ошибка', tr: 'Hata', tk: 'Ýalňyşlyk' },
  success: { en: 'Success', ru: 'Успешно', tr: 'Başarılı', tk: 'Üstünlik' },
  hi: { en: 'Hi', ru: 'Привет', tr: 'Merhaba', tk: 'Salam' },
  required: { en: 'Required', ru: 'Обязательно', tr: 'Zorunlu', tk: 'Hökmany' },
  fieldRequired: { en: 'Please fill out this field.', ru: 'Пожалуйста, заполните это поле.', tr: 'Lütfen bu alanı doldurun.', tk: 'Bu meýdançany dolduryň.' },
  notUsed: { en: 'Not Used', ru: 'Не используется', tr: 'Kullanılmıyor', tk: 'Ulanylmadyk' },

  // Badges
  badges: { 
    en: {
      none: 'None', bestseller: 'Bestseller', popular: 'Popular', premium: 'Premium', signature: 'Signature',
      rustic: 'Rustic', classic: 'Classic', seasonal: 'Seasonal', new: 'New', limited: 'Limited',
      vegan: 'Vegan', glutenFree: 'Gluten Free', chefChoice: "Chef's Choice", organic: 'Organic',
      sugarFree: 'Sugar Free', hypoallergenic: 'Hypoallergenic', dairyFree: 'Dairy Free', nutFree: 'Nut-free', halal: 'Halal', keto: 'Keto'
    },
    ru: {
      none: 'Нет', bestseller: 'Хит Продаж', popular: 'Популярное', premium: 'Премиум', signature: 'Фирменное',
      rustic: 'Рустик', classic: 'Классика', seasonal: 'Сезонное', new: 'Новинка', limited: 'Лимитировано',
      vegan: 'Веган', glutenFree: 'Без Глютена', chefChoice: 'Выбор Шефа', organic: 'Органик',
      sugarFree: 'Без Сахара', hypoallergenic: 'Гипоаллергенно', dairyFree: 'Без Молока', nutFree: 'Без Орехов', halal: 'Халяль', keto: 'Кето'
    },
    tr: {
      none: 'Yok', bestseller: 'Çok Satan', popular: 'Popüler', premium: 'Premium', signature: 'İmza',
      rustic: 'Rustik', classic: 'Klasik', seasonal: 'Mevsimlik', new: 'Yeni', limited: 'Sınırlı',
      vegan: 'Vegan', glutenFree: 'Glutensiz', chefChoice: 'Şefin Seçimi', organic: 'Organik',
      sugarFree: 'Şekersiz', hypoallergenic: 'Hipoalerjenik', dairyFree: 'Süt İçermez', nutFree: 'Kuruyemişsiz', halal: 'Helal', keto: 'Keto'
    },
    tk: {
      none: 'Ýok', bestseller: 'Iň Köp Satylan', popular: 'Meşhur', premium: 'Premium', signature: 'Ýörite',
      rustic: 'Rustik', classic: 'Klassik', seasonal: 'Möwsümleýin', new: 'Täze', limited: 'Çäkli',
      vegan: 'Vegan', glutenFree: 'Glýutensiz', chefChoice: 'Aşpez Saýlawy', organic: 'Organik',
      sugarFree: 'Şekersiz', hypoallergenic: 'Allergiýasyz', dairyFree: 'Süýt Siz', nutFree: 'Ýerfyndyksyz', halal: 'Halal', keto: 'Keto'
    }
  }
};

// Helper to generate the legacy structure (translations.en.home...)
const generateTranslations = () => {
    const supportedLangs = ['en', 'ru', 'tr', 'tk'];
    const result = {};
    supportedLangs.forEach(lang => result[lang] = {});

    Object.keys(DICTIONARY).forEach(key => {
        if (key === 'badges') {
            supportedLangs.forEach(lang => {
                result[lang].badges = DICTIONARY.badges[lang];
            });
        } else {
            supportedLangs.forEach(lang => {
                result[lang][key] = DICTIONARY[key][lang] || DICTIONARY[key]['en'];
            });
        }
    });

    return result;
};

export const translations = generateTranslations();

// Export keys as enum for easier usage
export const TKeys = Object.keys(DICTIONARY).reduce((acc, key) => {
    acc[key] = key;
    return acc;
}, {});
