// Mongolian localization utilities
export const SUPPORTED_LANGUAGES = {
  mn: 'Mongolian',
  en: 'English'
};

export const CURRENCIES = {
  MNT: {
    symbol: '₮',
    code: 'MNT',
    name: 'Mongolian Tugrik'
  },
  USD: {
    symbol: '$',
    code: 'USD', 
    name: 'US Dollar'
  }
};

// Mongolian translations
export const translations = {
  mn: {
    // Gaming Center Map
    'gaming.centers': 'Тоглоомын төвүүд',
    'search.location': 'Байршил эсвэл төвийн нэр хайх...',
    'filters.search': 'Шүүлтүүр болон хайлт',
    'all.centers': 'Бүх төвүүд',
    'high.availability': 'Өндөр хүртээмжтэй (10+ компьютер)',
    'medium.availability': 'Дунд хүртээмжтэй (5-9 компьютер)',
    'low.availability': 'Бага хүртээмжтэй (1-4 компьютер)',
    'any.distance': 'Ямар ч зай',
    'within.km': 'хүрээнд {distance} км',
    'nearest.first': 'Хамгийн ойрхон эхэнд',
    'price.low.high': 'Үнэ: Багаас их рүү',
    'price.high.low': 'Үнэ: Ихээс бага руу',
    'most.available': 'Хамгийн их хүртээмжтэй',
    'highest.rated': 'Хамгийн өндөр үнэлгээтэй',
    'high.availability.short': 'Өндөр хүртээмжтэй',
    'nearby': 'Ойр (2км)',
    'budget.friendly': 'Хямд үнэтэй',
    'top.rated': 'Шилдэг үнэлгээтэй',
    'availability': 'Хүртээмж',
    'distance': 'Зай',
    'sort.by': 'Эрэмбэлэх',
    'reset': 'Дахин тохируулах',
    'price.range': 'Үнийн хүрээ: ₮{min} - ₮{max} цагт',
    'min.price': 'Хамгийн бага үнэ',
    'max.price': 'Хамгийн их үнэ',
    'active.filters': 'Идэвхтэй шүүлтүүр:',
    'clear.all': 'Бүгдийг арилгах',
    'location.error': 'Байршлын алдаа',
    'getting.location': 'Таны байршлыг олж байна...',
    
    // Digital Wallet
    'digital.wallet': 'Дижитал түрийвч',
    'manage.funds': 'Тоглоомын мөнгөө удирдаж, зардлаа хянах',
    'book.session': 'Сешн захиалах',
    'top.up.wallet': 'Түрийвч цэнэглэх',
    'book': 'Захиалах',
    'top.up': 'Цэнэглэх',
    'history': 'Түүх',
    'overview': 'Тойм',
    'transactions': 'Гүйлгээнүүд',
    'analytics': 'Шинжилгээ',
    'wallet.balance': 'Түрийвчний үлдэгдэл',
    'secured': 'Аюулгүй',
    'this.month': 'Энэ сар',
    'gaming.expenses': 'Тоглоомын зардал',
    'hours.played': 'Тоглосон цаг',
    'avg.per.week': 'Дундаж: 7ц/долоо хоног',
    'favorite.center': 'Дуртай төв',
    'most.visited': 'Хамгийн их очсон',
    'visits': 'удаа',
    'recent.activity': 'Сүүлийн үйл ажиллагаа',
    'view.all': 'Бүгдийг харах',
    'quick.stats': 'Хурдан статистик',
    
    // Transaction types
    'wallet.topup': 'Түрийвч цэнэглэх',
    'gaming.session': 'Тоглоомын сешн',
    'booking.cancellation.refund': 'Захиалга цуцлах буцаан олголт',
    'credit.card': 'Кредит карт',
    'paypal': 'PayPal',
    'bank.transfer': 'Банкны шилжүүлэг',
    'completed': 'Дууссан',
    'pending': 'Хүлээгдэж байна',
    
    // Common actions
    'search': 'Хайх',
    'book.now': 'Одоо захиалах',
    'view.details': 'Дэлгэрэнгүй харах',
    'cancel': 'Цуцлах',
    'confirm': 'Батлах',
    'close': 'Хаах',
    'save': 'Хадгалах',
    'edit': 'Засах',
    'delete': 'Устгах',
    
    // Time and date
    'today': 'өнөөдөр',
    'yesterday': 'өчигдөр',
    'just.now': 'дөнгөж сая',
    'hours': 'цаг',
    'minutes': 'минут',
    'days': 'өдөр',
    
    // Gaming centers
    'available.pcs': 'Боломжтой компьютер',
    'rating': 'Үнэлгээ',
    'per.hour': 'цагт',
    'open.24.7': '24/7 нээлттэй',
    'high.end.gaming.pcs': 'Өндөр чанартай тоглоомын компьютер',
    'rgb.setup': 'RGB тохиргоо',
    'snack.bar': 'Хөнгөн зууш',
    'tournament.area': 'Тэмцээний талбай',
    'vr.gaming': 'VR тоглоом',
    'streaming.setup': 'Стриминг тохиргоо',
    'private.rooms': 'Хувийн өрөө',
    'food.delivery': 'Хоол хүргэлт',
    'budget.friendly.center': 'Хямд үнэтэй',
    'student.discounts': 'Оюутны хөнгөлөлт',
    'group.packages': 'Бүлгийн багц',
    'retro.games': 'Ретро тоглоом',
    'premium.gaming': 'Премиум тоглоом',
    '4k.monitors': '4К дэлгэц',
    'mechanical.keyboards': 'Механик гар',
    'pro.chairs': 'Мэргэжлийн сандал'
  },
  en: {
    // Gaming Center Map
    'gaming.centers': 'Gaming Centers',
    'search.location': 'Search location or center name...',
    'filters.search': 'Filters & Search',
    'all.centers': 'All Centers',
    'high.availability': 'High Availability (10+ PCs)',
    'medium.availability': 'Medium Availability (5-9 PCs)',
    'low.availability': 'Low Availability (1-4 PCs)',
    'any.distance': 'Any Distance',
    'within.km': 'Within {distance} km',
    'nearest.first': 'Nearest First',
    'price.low.high': 'Price: Low to High',
    'price.high.low': 'Price: High to Low',
    'most.available': 'Most Available',
    'highest.rated': 'Highest Rated',
    'high.availability.short': 'High Availability',
    'nearby': 'Nearby (2km)',
    'budget.friendly': 'Budget Friendly',
    'top.rated': 'Top Rated',
    'availability': 'Availability',
    'distance': 'Distance',
    'sort.by': 'Sort By',
    'reset': 'Reset',
    'price.range': 'Price Range: ₮{min} - ₮{max} per hour',
    'min.price': 'Min Price',
    'max.price': 'Max Price',
    'active.filters': 'Active filters:',
    'clear.all': 'Clear all',
    'location.error': 'Location Error',
    'getting.location': 'Getting your location...',
    
    // Digital Wallet
    'digital.wallet': 'Digital Wallet',
    'manage.funds': 'Manage your gaming funds and track spending',
    'book.session': 'Book Session',
    'top.up.wallet': 'Top Up Wallet',
    'book': 'Book',
    'top.up': 'Top Up',
    'history': 'History',
    'overview': 'Overview',
    'transactions': 'Transactions',
    'analytics': 'Analytics',
    'wallet.balance': 'Wallet Balance',
    'secured': 'Secured',
    'this.month': 'This Month',
    'gaming.expenses': 'Gaming expenses',
    'hours.played': 'Hours Played',
    'avg.per.week': 'Avg: 7h/week',
    'favorite.center': 'Favorite Center',
    'most.visited': 'Most visited',
    'visits': 'visits',
    'recent.activity': 'Recent Activity',
    'view.all': 'View All',
    'quick.stats': 'Quick Stats',
    
    // Transaction types
    'wallet.topup': 'Wallet Top-up',
    'gaming.session': 'Gaming Session',
    'booking.cancellation.refund': 'Booking Cancellation Refund',
    'credit.card': 'Credit Card',
    'paypal': 'PayPal',
    'bank.transfer': 'Bank Transfer',
    'completed': 'Completed',
    'pending': 'Pending',
    
    // Common actions
    'search': 'Search',
    'book.now': 'Book Now',
    'view.details': 'View Details',
    'cancel': 'Cancel',
    'confirm': 'Confirm',
    'close': 'Close',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    
    // Time and date
    'today': 'today',
    'yesterday': 'yesterday',
    'just.now': 'just now',
    'hours': 'hours',
    'minutes': 'minutes',
    'days': 'days',
    
    // Gaming centers
    'available.pcs': 'Available PCs',
    'rating': 'Rating',
    'per.hour': 'per hour',
    'open.24.7': '24/7',
    'high.end.gaming.pcs': 'High-end Gaming PCs',
    'rgb.setup': 'RGB Setup',
    'snack.bar': 'Snack Bar',
    'tournament.area': 'Tournament Area',
    'vr.gaming': 'VR Gaming',
    'streaming.setup': 'Streaming Setup',
    'private.rooms': 'Private Rooms',
    'food.delivery': 'Food Delivery',
    'budget.friendly.center': 'Budget Friendly',
    'student.discounts': 'Student Discounts',
    'group.packages': 'Group Packages',
    'retro.games': 'Retro Games',
    'premium.gaming': 'Premium Gaming',
    '4k.monitors': '4K Monitors',
    'mechanical.keyboards': 'Mechanical Keyboards',
    'pro.chairs': 'Pro Chairs'
  }
};

// Current language state
let currentLanguage = 'mn'; // Default to Mongolian
let currentCurrency = 'MNT'; // Default to Mongolian Tugrik

// Translation function
export const t = (key, params = {}) => {
  let translation = translations?.[currentLanguage]?.[key] || translations?.['en']?.[key] || key;
  
  // Replace parameters in translation
  Object.keys(params)?.forEach(param => {
    translation = translation?.replace(new RegExp(`{${param}}`, 'g'), params?.[param]);
  });
  
  return translation;
};

// Language management
export const setLanguage = (lang) => {
  if (SUPPORTED_LANGUAGES?.[lang]) {
    currentLanguage = lang;
    localStorage.setItem('gameCenter_language', lang);
  }
};

export const getCurrentLanguage = () => currentLanguage;

export const initializeLanguage = () => {
  const savedLang = localStorage.getItem('gameCenter_language');
  if (savedLang && SUPPORTED_LANGUAGES?.[savedLang]) {
    currentLanguage = savedLang;
  }
};

// Currency management
export const setCurrency = (currency) => {
  if (CURRENCIES?.[currency]) {
    currentCurrency = currency;
    localStorage.setItem('gameCenter_currency', currency);
  }
};

export const getCurrentCurrency = () => currentCurrency;

export const initializeCurrency = () => {
  const savedCurrency = localStorage.getItem('gameCenter_currency');
  if (savedCurrency && CURRENCIES?.[savedCurrency]) {
    currentCurrency = savedCurrency;
  }
};

// Currency formatting function
export const formatCurrency = (amount, currency = null) => {
  const curr = currency || currentCurrency;
  const currencyInfo = CURRENCIES?.[curr];
  
  if (!currencyInfo) {
    return `${amount}`;
  }

  if (curr === 'MNT') {
    // Mongolian Tugrik formatting
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  } else if (curr === 'USD') {
    // US Dollar formatting
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  }
  
  return `${currencyInfo?.symbol}${amount}`;
};

// Convert USD to MNT (approximate rate: 1 USD = 2800 MNT)
export const convertToMNT = (usdAmount) => {
  return Math.round(usdAmount * 2800);
};

// Convert MNT to USD
export const convertToUSD = (mntAmount) => {
  return Math.round((mntAmount / 2800) * 100) / 100;
};

// Get localized date
export const formatDate = (date, options = {}) => {
  const locale = currentLanguage === 'mn' ? 'mn-MN' : 'en-US';
  return new Date(date)?.toLocaleDateString(locale, options);
};

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeLanguage();
  initializeCurrency();
}