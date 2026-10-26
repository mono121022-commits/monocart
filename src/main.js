import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

// ============================================================================
// Translations & Localization
// ============================================================================
const i18n = {
  ar: {
    appTitle: 'مونو كارت',
    appTagline: 'سلة المقاضي الذكية',
    compileBtn: 'تجميع وطباعة',
    historyBtn: 'السجل & الإحصائيات',
    settingsBtn: 'الإعدادات',
    waNavLabel: 'دعم واتساب',
    completedLabel: 'مكتمل',
    totalItems: 'إجمالي الأغراض',
    boughtItems: 'تم بالكامل',
    partialItems: 'شراء جزئي',
    substituteItems: 'بدائل',
    missingItems: 'معلقة',
    pendingItems: 'باقي للشراء',
    allTab: 'الكل',
    pendingTab: '⏳ متبقي للشراء',
    boughtTab: '✓ تم بالكامل',
    partialTab: '⚠️ شراء جزئي',
    substituteTab: '🔄 بدائل',
    missingTab: '⏳ معلقة',
    searchPlaceholder: '🔍 بحث سريع في الأغراض...',
    clearAll: '🗑️ مسح الكل',
    boughtBtn: 'تم بالكامل',
    partialBtn: 'شراء جزئي',
    substituteBtn: 'لقيت بديل',
    missingBtn: 'معلقة',
    attachPhotoBtn: '📸 + إرفاق صورة للغرض',
    emptyTitle: 'لا توجد أغراض في هذه القائمة حالياً',
    emptySubtitle: 'أضف غرضاً جديداً بالأعلى أو ارفع صوراً متعددة لتوزيعها تلقائياً على الكروت.',
    allDoneTitle: '🎉 مبروك! اكتملت جميع المقاضي بنجاح',
    allDoneDesc: 'تم إنجاز 100% من المقاضي المطلوبة، يمكنك الآن إنهاء جولة التسوق وحفظ السجل.',
    missingAlertTitle: '⚠️ تنبيه بالنواقص والكميات الجزئية',
    missingAlertDesc: (missing, partial) => `يوجد ${missing} غرض غير متوفر و ${partial} غرض تم شراؤه جزئياً.`,
    statusLocal: 'تخزين ذكي',
    statusSupabase: 'مزامنة سحابية مباشرة',
    retentionPrefix: '⏱️ الاحتفاظ: ',
    switchHome: 'تبديل',
    homePrefix: 'منزل #',
    roleReviewer: 'وضع المُحضّر (في البيت)',
    roleReviewerHint: 'إعداد الأغراض ومتابعة المشتري حيّاً',
    roleShopper: 'وضع المتسوق (في السوبرماركت)',
    roleShopperHint: 'للتحقق والشراء وتسجيل الكميات والبدائل',
    btnNewList: '✨ قائمة أغراض جديدة',
    btnFinishShopping: '🏁 إنهاء التسوق وحفظ السجل',
    listSubtitle: 'حدّد المشتريات، التقط صور البدائل، وتابع النواقص فورياً.',
    tabQuickAdd: '✏️ كتابة غرض يدوي',
    tabBatchImages: '📸 توزيع صور متعددة على كروت',
    tabLoadDemo: '✨ تجربة المقاضي والصور الجاهزة',
    inputItemNamePlaceholder: 'اكتب غرضاً، أو اضغط Enter لكتابة أغراض متعددة سطر بسطر (مثلاً: جبنة براميلي [Enter] لبن نادك [Enter] بطاطس)...',
    inputItemQtyNumPlaceholder: 'العدد',
    inputItemUnitPlaceholder: 'الوحدة (علبة / كيس / كجم)',
    inputItemNotePlaceholder: 'ملاحظات (اختياري)...',
    btnAttachPhoto: '📷 إرفاق صورة',
    btnInstantCamera: '📸 لقطة كاميرا فورية',
    btnAddItemSubmit: '+ إضافة للأغراض',
    dropzoneTitle: 'اسحب وأفلت صور متعددة هنا، أو اضغط للاختيار',
    dropzoneSubtitle: 'عند رفع أكثر من صورة، سيقوم النظام تلقائياً بتوزيع كل صورة على كارت مستقل مع شيك ليست وملاحظات عصرية.',
    dropzoneBrowseBtn: '📂 اختيار صور متعددة من الجهاز',
    demoCardTitle: '🎯 المقاضي والصور التجريبية المرفقة من قبلك:',
    demoCardDesc: 'جبنة براميلي، جبنة دوبل كريم، لبن نادك، زبادي نادك، بطاطس كياس وفرة أو داري، كزبرة، بقدونس، مكسرات، مع الـ 5 صور التي رفعتها.',
    btnLoadDemoItems: '⚡ شحن القائمة بالبيانات والصور فوراً',
    themeDark: 'داكن',
    themeLight: 'فاتح',
    langToggle: 'English',
    tabAuthLogin: '🔑 تسجيل الدخول',
    tabAuthRegister: '✨ تسجيل منزل جديد',
    lblHomeLogin: 'رمز المنزل أو كود العميل:',
    lblHomeRegister: 'رمز المنزل الجديد (بصمة العميل):',
    inputHomeNoPlaceholder: 'مثال: منزل 101 أو كودك الخاص...',
    inputNewHomeNoPlaceholder: 'مثال: فيلا 5 أو عائلة أحمد...',
    waSupportTitle: 'تواصل مباشرة مع الدعم الفني عبر واتساب',
    waSupportSub: 'اضغط هنا للمحادثة الفورية على WhatsApp'
  },
  en: {
    appTitle: 'MonoCart',
    appTagline: 'Smart Shopping & Groceries',
    compileBtn: 'Compile & Print',
    historyBtn: 'History & Stats',
    settingsBtn: 'Settings',
    waNavLabel: 'WhatsApp',
    completedLabel: 'Completed',
    totalItems: 'Total Items',
    boughtItems: 'Full Purchase',
    partialItems: 'Partial',
    substituteItems: 'Substitutes',
    missingItems: 'Suspended',
    pendingItems: 'Remaining',
    allTab: 'All',
    pendingTab: '⏳ Pending',
    boughtTab: '✓ Completed',
    partialTab: '⚠️ Partial',
    substituteTab: '🔄 Substitutes',
    missingTab: '⏳ Suspended',
    searchPlaceholder: '🔍 Quick search in items...',
    clearAll: '🗑️ Clear All',
    boughtBtn: 'Completed',
    partialBtn: 'Partial',
    substituteBtn: 'Substitute',
    missingBtn: 'Suspended',
    attachPhotoBtn: '📸 + Attach Photo',
    emptyTitle: 'No items in this list currently',
    emptySubtitle: 'Add a new item above or upload multiple photos to distribute them automatically onto cards.',
    allDoneTitle: '🎉 Great Job! All items completed',
    allDoneDesc: '100% of items are marked as purchased. You can finish your shopping trip now.',
    missingAlertTitle: '⚠️ Missing & Partial Items Alert',
    missingAlertDesc: (missing, partial) => `${missing} items suspended/missing and ${partial} items partially bought.`,
    statusLocal: 'Smart Storage',
    statusSupabase: 'Cloud Realtime Active',
    retentionPrefix: '⏱️ Retention: ',
    switchHome: 'Switch',
    homePrefix: 'Home #',
    roleReviewer: 'Planner Mode (At Home)',
    roleReviewerHint: 'Prepare items & monitor buyer live',
    roleShopper: 'Shopper Mode (At Supermarket)',
    roleShopperHint: 'To check, buy & log substitutes',
    btnNewList: '✨ New Shopping List',
    btnFinishShopping: '🏁 Finish Shopping & Save Trip',
    listSubtitle: 'Select purchases, snap substitutes, and track missing items live.',
    tabQuickAdd: '✏️ Manual Item Entry',
    tabBatchImages: '📸 Distribute Photos to Cards',
    tabLoadDemo: '✨ Demo Samples & Photos',
    inputItemNamePlaceholder: 'Write an item, or press Enter for multiple items (e.g.: Cheese [Enter] Milk [Enter] Potatoes)...',
    inputItemQtyNumPlaceholder: 'Qty',
    inputItemUnitPlaceholder: 'Unit (box / bag / kg)',
    inputItemNotePlaceholder: 'Notes (optional)...',
    btnAttachPhoto: '📷 Attach Photo',
    btnInstantCamera: '📸 Instant Camera Snap',
    btnAddItemSubmit: '+ Add to Items',
    dropzoneTitle: 'Drag & drop multiple photos here, or click to browse',
    dropzoneSubtitle: 'When uploading multiple photos, the system will distribute each photo into an independent card with checklist and notes.',
    dropzoneBrowseBtn: '📂 Choose multiple photos from device',
    demoCardTitle: '🎯 Demo Groceries & Attached Photos:',
    demoCardDesc: 'Cheese, double cream, milk, yogurt, fries, coriander, parsley, nuts with 5 attached photos.',
    btnLoadDemoItems: '⚡ Load Demo Data & Photos Now',
    themeDark: 'Dark',
    themeLight: 'Light',
    langToggle: 'العربية',
    tabAuthLogin: '🔑 Login',
    tabAuthRegister: '✨ Register New Home',
    lblHomeLogin: 'Home Code or Client ID:',
    lblHomeRegister: 'New Home Code (Client ID):',
    inputHomeNoPlaceholder: 'e.g. Home 101 or your Client ID...',
    inputNewHomeNoPlaceholder: 'e.g. Villa 5 or Family Cart...',
    waSupportTitle: 'Direct WhatsApp Support',
    waSupportSub: 'Click here for immediate chat on WhatsApp'
  }
};

// ============================================================================
// Default Configuration & State
// ============================================================================
const DEFAULT_SUPABASE_URL = 'https://fynxenrvmionaombjqba.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bnhlbnJ2bWlvbmFvbWJqcWJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMjk0MjUsImV4cCI6MjEwODYwNTQyNX0.OQLU13tk_I1r5hPspm_n6gv6t151VQ2EEvjsEqZdFQE';

const SETTINGS_KEY = 'monocart_settings_v4';
const HOME_KEY = 'monocart_home_no';
const ROLE_KEY = 'monocart_user_role';
const THEME_KEY = 'monocart_theme';

let appState = {
  lang: 'ar',
  theme: 'light',
  homeNo: '',
  userRole: 'reviewer',
  activeFilter: 'pending',
  searchQuery: '',
  cameraStream: null,
  cameraTargetItemId: null,
  cameraMode: 'item',
  currentFacingMode: 'environment',
  viewingHistoryTrip: null,
  selectedHistoryItemIds: new Set(),
  openSubstituteItemId: null,
  settings: {
    retentionDays: 30,
    supabaseUrl: DEFAULT_SUPABASE_URL,
    supabaseKey: DEFAULT_SUPABASE_KEY
  },
  currentList: {
    id: generateId(),
    name: 'أغراض اليوم',
    homeNo: '',
    createdAt: new Date().toISOString(),
    items: []
  },
  historyLists: [],
  selectedHistoryList: null,
  tablesExistInSupabase: false
};

let supabase = null;
let realtimeChannel = null;

// Initial Demo items with quantityRequired, quantityFound, and partial purchase demonstration
const DEMO_ITEMS = [
  {
    id: 'demo-1',
    name: 'جبنة براميلي',
    quantityRequired: 1,
    quantityFound: 1,
    unit: 'علبة',
    status: 'bought',
    imageUrl: '/demo/demo1.jpeg',
    note: 'طازجة من قسم الأجبان',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-2',
    name: 'جبنة دوبل كريم',
    quantityRequired: 1,
    quantityFound: 1,
    unit: 'علبة',
    status: 'bought',
    imageUrl: '/demo/demo2.jpeg',
    note: '',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-3',
    name: 'لبن نادك',
    quantityRequired: 2,
    quantityFound: 0,
    unit: 'لتر',
    status: 'pending',
    imageUrl: '/demo/demo3.jpeg',
    note: '',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-4',
    name: 'زبادي نادك',
    quantityRequired: 6,
    quantityFound: 0,
    unit: 'حبات',
    status: 'pending',
    imageUrl: '/demo/demo4.jpeg',
    note: '',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-5',
    name: 'بطاطس كياس وفرة او داري',
    quantityRequired: 2,
    quantityFound: 1,
    unit: 'كيس',
    status: 'partial',
    imageUrl: '/demo/demo5.jpeg',
    note: 'المطلوب كيسين، وجدنا كيس واحد فقط بالثلاجة',
    alternativeImageUrl: '/demo/demo5.jpeg',
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-6',
    name: 'كزبرة 3',
    quantityRequired: 3,
    quantityFound: 3,
    unit: 'حزم',
    status: 'bought',
    imageUrl: '',
    note: 'خضراء طازجة',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-7',
    name: 'بقدونس 1',
    quantityRequired: 1,
    quantityFound: 1,
    unit: 'حزمة',
    status: 'bought',
    imageUrl: '',
    note: '',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'demo-8',
    name: 'مكسرات',
    quantityRequired: 1,
    quantityFound: 0,
    unit: 'علبة 500 جم',
    status: 'missing',
    imageUrl: '',
    note: 'النوع المطلوب غير متوفر بالرف',
    alternativeImageUrl: null,
    createdAt: new Date().toISOString()
  }
];

const SEED_HISTORY = [
  {
    id: 'hist-1',
    name: 'مقاضي الأسبوع الماضي',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    items: [
      { name: 'لبن نادك', quantityRequired: 2, quantityFound: 2, unit: 'لتر', status: 'bought' },
      { name: 'زبادي نادك', quantityRequired: 6, quantityFound: 6, unit: 'حبة', status: 'bought' },
      { name: 'جبنة براميلي', quantityRequired: 1, quantityFound: 1, unit: 'علبة', status: 'bought' },
      { name: 'بيض طازج', quantityRequired: 1, quantityFound: 1, unit: 'طبق', status: 'bought' }
    ]
  },
  {
    id: 'hist-2',
    name: 'طلبات السوبرماركت',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    items: [
      { name: 'لبن نادك', quantityRequired: 3, quantityFound: 2, unit: 'لتر', status: 'partial', note: 'متبقي لتر' },
      { name: 'بطاطس كياس وفرة', quantityRequired: 1, quantityFound: 0, unit: 'كيس', status: 'missing', note: 'غير متوفر' },
      { name: 'جبنة براميلي', quantityRequired: 2, quantityFound: 2, unit: 'علبة', status: 'bought' }
    ]
  }
];

// ============================================================================
// Initialization & Role Management
// ============================================================================
function initApp() {
  const savedLang = localStorage.getItem('monocart_lang');
  if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
    appState.lang = savedLang;
  }
  applyLanguage(appState.lang);
  loadTheme();
  loadSettings();
  loadRole();
  initSupabase();
  setupEventListeners();
  setActiveFilter('pending');

  const savedHome = localStorage.getItem(HOME_KEY);
  if (savedHome) {
    setHome(savedHome, false);
  } else {
    openHomeLoginModal();
  }
}

function loadTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  setTheme(saved);
}

function setTheme(theme) {
  appState.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  if (themeLabel) themeLabel.textContent = theme === 'dark' ? (appState.lang === 'ar' ? 'فاتح' : 'Light') : (appState.lang === 'ar' ? 'داكن' : 'Dark');
}

function toggleTheme() {
  const next = appState.theme === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

function generateId() {
  return 'item-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
}

function setActiveFilter(filterName) {
  appState.activeFilter = filterName;
  document.querySelectorAll('.filter-tabs .filter-btn').forEach(b => {
    if (b.dataset.filter === filterName) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
  renderCards();
}

function loadRole() {
  const saved = localStorage.getItem(ROLE_KEY);
  if (saved && (saved === 'reviewer' || saved === 'shopper')) {
    setRole(saved, false);
  } else {
    setRole('reviewer', false);
  }
}

function setRole(role, notify = true) {
  appState.userRole = role;
  localStorage.setItem(ROLE_KEY, role);

  const btnReviewer = document.getElementById('btnRoleReviewer');
  const btnShopper = document.getElementById('btnRoleShopper');
  const rolePill = document.getElementById('activeRolePill');
  const creationPanel = document.getElementById('creationPanelSection');
  const btnCreateNewList = document.getElementById('btnCreateNewList');
  const btnFinishShopping = document.getElementById('btnFinishShopping');

  if (role === 'shopper') {
    btnShopper.classList.add('active');
    btnReviewer.classList.remove('active');
    document.body.classList.add('mode-shopper');
    document.body.classList.remove('mode-reviewer');
    if (rolePill) {
      rolePill.textContent = i18n[appState.lang].roleShopper;
      rolePill.style.background = '#f97316';
      rolePill.style.color = '#fff';
    }
    if (creationPanel) creationPanel.style.display = 'none';
    if (btnCreateNewList) btnCreateNewList.style.display = 'none';
    if (btnFinishShopping) btnFinishShopping.style.display = 'inline-flex';
    if (notify) showToast('🛒 تم التبديل إلى وضع المتسوق في السوبرماركت');
  } else {
    btnReviewer.classList.add('active');
    btnShopper.classList.remove('active');
    document.body.classList.add('mode-reviewer');
    document.body.classList.remove('mode-shopper');
    if (rolePill) {
      rolePill.textContent = i18n[appState.lang].roleReviewer;
      rolePill.style.background = '#0f172a';
      rolePill.style.color = '#fff';
    }
    if (creationPanel) creationPanel.style.display = 'block';
    if (btnCreateNewList) btnCreateNewList.style.display = 'inline-flex';
    if (btnFinishShopping) btnFinishShopping.style.display = 'none';
    if (notify) showToast('📝 تم التبديل إلى وضع المُحضّر في البيت');
  }

  setActiveFilter('pending');
  renderApp();
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      appState.settings = { ...appState.settings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading settings', e);
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(appState.settings));
}

function openHomeLoginModal() {
  const modal = document.getElementById('modalHomeLogin');
  modal.style.display = 'flex';
  const input = document.getElementById('inputHomeNo');
  input.value = appState.homeNo || '';
  setTimeout(() => input.focus(), 100);
}

function setHome(homeNumber, isUserSwitch = true) {
  const clean = homeNumber.trim();
  if (!clean) return;

  appState.homeNo = clean;
  localStorage.setItem(HOME_KEY, clean);
  document.getElementById('modalHomeLogin').style.display = 'none';

  const t = i18n[appState.lang];
  document.getElementById('activeHomeLabel').textContent = `${t.homePrefix}${clean}`;
  document.getElementById('homeMetaPill').textContent = `🏡 ${t.homePrefix}${clean}`;
  const settingHomeInput = document.getElementById('settingHomeNoInput');
  if (settingHomeInput) settingHomeInput.value = clean;

  loadHomeData(clean, isUserSwitch);
}

async function loadHomeData(homeNumber, isUserSwitch) {
  const storageKey = `monocart_data_home_${homeNumber}`;
  const historyKey = `monocart_history_home_${homeNumber}`;

  let loadedFromSupabase = false;
  if (supabase && appState.tablesExistInSupabase) {
    try {
      const { data: lists, error: listErr } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('home_no', homeNumber)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!listErr && lists && lists.length > 0) {
        const activeList = lists[0];
        const { data: items } = await supabase
          .from('list_items')
          .select('*')
          .eq('list_id', activeList.id)
          .order('created_at', { ascending: false });

        appState.currentList = {
          id: activeList.id,
          name: activeList.name,
          homeNo: homeNumber,
          createdAt: activeList.created_at,
          items: (items || []).map(it => ({
            id: it.id,
            name: it.name,
            quantityRequired: it.quantity_required || 1,
            quantityFound: it.quantity_found || 0,
            unit: it.unit || '',
            status: it.status || 'pending',
            note: it.note || '',
            imageUrl: it.image_url || '',
            alternativeImageUrl: it.alternative_image_url || '',
            createdAt: it.created_at
          }))
        };
        loadedFromSupabase = true;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, will use local storage', e);
    }
  }

  if (!loadedFromSupabase) {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      appState.currentList = JSON.parse(saved);
      appState.currentList.homeNo = homeNumber;
    } else {
      appState.currentList = {
        id: generateId(),
        name: appState.lang === 'ar' ? `أغراض اليوم - منزل ${homeNumber}` : `Today's Items - Home ${homeNumber}`,
        homeNo: homeNumber,
        createdAt: new Date().toISOString(),
        items: []
      };
      saveData();
    }

    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      appState.historyLists = JSON.parse(savedHistory);
    } else {
      appState.historyLists = [];
      saveHistory();
    }
  }

  applyRetentionPolicy();
  renderApp();

  if (isUserSwitch) {
    showToast(`🏠 تم الدخول إلى سلة مقاضي منزل: ${homeNumber}`);
  }

  subscribeToHomeRealtime(homeNumber);
}

function saveData() {
  if (!appState.homeNo) return;
  const storageKey = `monocart_data_home_${appState.homeNo}`;
  localStorage.setItem(storageKey, JSON.stringify(appState.currentList));

  if (supabase && appState.tablesExistInSupabase) {
    syncToSupabase();
  }
}

function saveHistory() {
  if (!appState.homeNo) return;
  const historyKey = `monocart_history_home_${appState.homeNo}`;
  localStorage.setItem(historyKey, JSON.stringify(appState.historyLists));
}

function applyRetentionPolicy() {
  const days = appState.settings.retentionDays;
  if (days === 'forever') return;

  const cutoff = Date.now() - parseInt(days) * 86400000;
  const initialCount = appState.historyLists.length;
  appState.historyLists = appState.historyLists.filter(list => {
    const listTime = new Date(list.createdAt).getTime();
    return listTime >= cutoff;
  });

  if (appState.historyLists.length !== initialCount) {
    saveHistory();
  }
}

// ============================================================================
// Supabase Integration & Realtime (Silent Background Sync)
// ============================================================================
async function initSupabase() {
  const { supabaseUrl, supabaseKey } = appState.settings;
  const badge = document.getElementById('supabaseStatus');

  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase.from('shopping_lists').select('id').limit(1);
      if (error && error.code === 'PGRST205') {
        appState.tablesExistInSupabase = false;
        if (badge) {
          badge.className = 'connection-badge status-supabase';
          badge.querySelector('.status-text').textContent = 'مزامنة سحابية نشطة';
        }
      } else {
        appState.tablesExistInSupabase = true;
        if (badge) {
          badge.className = 'connection-badge status-supabase';
          badge.querySelector('.status-text').textContent = i18n[appState.lang].statusSupabase;
        }
        if (appState.homeNo) {
          syncToSupabase();
        }
      }
    } catch (err) {
      appState.tablesExistInSupabase = false;
    }
  }
}

async function syncToSupabase() {
  if (!supabase || !appState.tablesExistInSupabase || !appState.homeNo) return;
  try {
    await supabase.from('shopping_lists').upsert({
      id: appState.currentList.id,
      home_no: appState.homeNo,
      name: appState.currentList.name,
      retention_days: appState.settings.retentionDays
    });

    if (appState.currentList.items.length > 0) {
      const itemsPayload = appState.currentList.items.map(it => ({
        id: it.id,
        home_no: appState.homeNo,
        list_id: appState.currentList.id,
        name: it.name,
        quantity_required: it.quantityRequired || 1,
        quantity_found: it.quantityFound || 0,
        unit: it.unit || '',
        status: it.status,
        note: it.note || '',
        image_url: it.imageUrl || '',
        alternative_image_url: it.alternativeImageUrl || ''
      }));
      await supabase.from('list_items').upsert(itemsPayload);
    }
  } catch (err) {
    console.error('Supabase sync error', err);
  }
}

function subscribeToHomeRealtime(homeNumber) {
  if (!supabase || !appState.tablesExistInSupabase) return;

  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
  }

  try {
    realtimeChannel = supabase
      .channel(`home_${homeNumber}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'list_items',
          filter: `home_no=eq.${homeNumber}`
        },
        payload => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const item = payload.new;
            const idx = appState.currentList.items.findIndex(x => x.id === item.id);
            const formatted = {
              id: item.id,
              name: item.name,
              quantityRequired: item.quantity_required || 1,
              quantityFound: item.quantity_found || 0,
              unit: item.unit || '',
              status: item.status,
              note: item.note,
              imageUrl: item.image_url,
              alternativeImageUrl: item.alternative_image_url,
              createdAt: item.created_at || new Date().toISOString()
            };

            if (idx !== -1) {
              appState.currentList.items[idx] = formatted;
            } else {
              appState.currentList.items.unshift(formatted);
            }
            saveData();
            renderApp();
          } else if (payload.eventType === 'DELETE') {
            appState.currentList.items = appState.currentList.items.filter(x => x.id !== payload.old.id);
            saveData();
            renderApp();
          }
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('Realtime subscription issue', err);
  }
}

// ============================================================================
// Event Listeners Setup
// ============================================================================
function setupEventListeners() {
  document.getElementById('btnLangToggle').addEventListener('click', toggleLanguage);
  
  // Theme Toggle Button
  const btnTheme = document.getElementById('btnThemeToggle');
  if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

  // Role Buttons
  document.getElementById('btnRoleReviewer').addEventListener('click', () => setRole('reviewer'));
  document.getElementById('btnRoleShopper').addEventListener('click', () => setRole('shopper'));

  // Home Auth Modal Tabs
  const tabAuthLogin = document.getElementById('tabAuthLogin');
  const tabAuthRegister = document.getElementById('tabAuthRegister');
  const panelAuthLogin = document.getElementById('panelAuthLogin');
  const panelAuthRegister = document.getElementById('panelAuthRegister');

  if (tabAuthLogin && tabAuthRegister) {
    tabAuthLogin.addEventListener('click', () => {
      tabAuthLogin.classList.add('active');
      tabAuthRegister.classList.remove('active');
      panelAuthLogin.style.display = 'block';
      panelAuthRegister.style.display = 'none';
      const alert1 = document.getElementById('homeLoginAlert');
      if (alert1) alert1.style.display = 'none';
    });

    tabAuthRegister.addEventListener('click', () => {
      tabAuthRegister.classList.add('active');
      tabAuthLogin.classList.remove('active');
      panelAuthRegister.style.display = 'block';
      panelAuthLogin.style.display = 'none';
      const alert2 = document.getElementById('homeRegisterAlert');
      if (alert2) alert2.style.display = 'none';
      const regInput = document.getElementById('inputNewHomeNo');
      if (regInput) setTimeout(() => regInput.focus(), 100);
    });
  }

  // Home Login Form (Existing Homes)
  const formLogin = document.getElementById('formHomeLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('inputHomeNo');
      const clean = input.value.trim();
      if (!clean) return;

      const btnSubmit = document.getElementById('btnSubmitLogin');
      const alertBox = document.getElementById('homeLoginAlert');
      if (btnSubmit) btnSubmit.disabled = true;
      if (alertBox) alertBox.style.display = 'none';

      try {
        let exists = false;
        if (supabase && appState.tablesExistInSupabase) {
          const { data, error } = await supabase
            .from('shopping_lists')
            .select('id, home_no')
            .eq('home_no', clean)
            .limit(1);
          if (!error && data && data.length > 0) {
            exists = true;
          }
        }
        
        const storageKey = `monocart_data_home_${clean}`;
        if (localStorage.getItem(storageKey)) {
          exists = true;
        }

        // Allow demo homes 101 and 202 to always login
        if (!exists && clean !== '101' && clean !== '202') {
          if (alertBox) {
            alertBox.className = 'auth-alert-box alert-error';
            alertBox.textContent = appState.lang === 'ar'
              ? `⚠️ لم يتم العثور على منزل مسجل برمز "${clean}". يرجى التأكد من كتابة الرمز صحيحاً، أو إنشاء منزل جديد من تبويب (تسجيل منزل جديد).`
              : `⚠️ No registered home found with code "${clean}". Please verify the code or register a new home under "Register New Home".`;
            alertBox.style.display = 'block';
          }
          if (btnSubmit) btnSubmit.disabled = false;
          return;
        }

        setHome(clean);
        closeModal('modalHomeLogin');
      } catch (err) {
        setHome(clean);
        closeModal('modalHomeLogin');
      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
      }
    });
  }

  // Home Register Form (New Unique Homes)
  const formRegister = document.getElementById('formHomeRegister');
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.getElementById('inputNewHomeNo');
      const clean = input.value.trim();
      if (!clean) return;

      const btnSubmit = document.getElementById('btnSubmitRegister');
      const alertBox = document.getElementById('homeRegisterAlert');
      if (btnSubmit) btnSubmit.disabled = true;
      if (alertBox) alertBox.style.display = 'none';

      try {
        let isDuplicate = false;
        if (supabase && appState.tablesExistInSupabase) {
          const { data, error } = await supabase
            .from('shopping_lists')
            .select('id, home_no')
            .eq('home_no', clean)
            .limit(1);
          if (!error && data && data.length > 0) {
            isDuplicate = true;
          }
        }

        const storageKey = `monocart_data_home_${clean}`;
        if (localStorage.getItem(storageKey)) {
          isDuplicate = true;
        }

        if (isDuplicate) {
          if (alertBox) {
            alertBox.className = 'auth-alert-box alert-error';
            alertBox.textContent = appState.lang === 'ar'
              ? `❌ رمز المنزل "${clean}" مسجل بالفعل في سوبابيز! لا يمكن تكراره كمنزل جديد. يمكنك تسجيل الدخول إليه من تبويب "دخول لمنزل مسجل" أو اختيار رمز آخر جديد.`
              : `❌ Home code "${clean}" is already registered in Supabase! You cannot register it twice. You can log into it under "Login" or choose a different code.`;
            alertBox.style.display = 'block';
          }
          if (btnSubmit) btnSubmit.disabled = false;
          return;
        }

        // Create clean empty new home
        appState.homeNo = clean;
        localStorage.setItem(HOME_KEY, clean);

        appState.currentList = {
          id: generateId(),
          name: appState.lang === 'ar' ? `أغراض اليوم - منزل ${clean}` : `Today's Items - Home ${clean}`,
          homeNo: clean,
          createdAt: new Date().toISOString(),
          items: []
        };
        appState.historyLists = [];

        saveData();
        saveHistory();

        if (supabase && appState.tablesExistInSupabase) {
          await syncToSupabase();
          subscribeToHomeRealtime(clean);
        }

        if (alertBox) {
          alertBox.className = 'auth-alert-box alert-success';
          alertBox.textContent = appState.lang === 'ar'
            ? `🎉 تم تسجيل منزل ${clean} بنجاح! سلتك فارغة وجاهزة لإضافة مقاضيك.`
            : `🎉 Home ${clean} registered successfully! Your basket is clean and ready.`;
          alertBox.style.display = 'block';
        }

        setTimeout(() => {
          closeModal('modalHomeLogin');
          const t = i18n[appState.lang];
          document.getElementById('activeHomeLabel').textContent = `${t.homePrefix}${clean}`;
          document.getElementById('homeMetaPill').textContent = `🏡 ${t.homePrefix}${clean}`;
          renderApp();
          showToast(appState.lang === 'ar' ? `✨ أهلاً بك في منزل ${clean} الجديد!` : `✨ Welcome to new Home ${clean}!`);
        }, 800);
      } catch (err) {
        console.error('Registration error', err);
      } finally {
        if (btnSubmit) btnSubmit.disabled = false;
      }
    });
  }

  document.querySelectorAll('.btn-quick-home').forEach(btn => {
    btn.addEventListener('click', () => {
      const h = btn.dataset.home;
      const inp = document.getElementById('inputHomeNo');
      if (inp) inp.value = h;
      setHome(h);
    });
  });

  document.getElementById('btnSwitchHome').addEventListener('click', openHomeLoginModal);

  // Close Button (X) on Home Login Modal
  const btnCloseHomeLogin = document.getElementById('btnCloseHomeLoginModal');
  if (btnCloseHomeLogin) {
    btnCloseHomeLogin.addEventListener('click', () => {
      if (!appState.homeNo) {
        setHome('101', false);
      }
      closeModal('modalHomeLogin');
    });
  }

  const btnSaveSettingHome = document.getElementById('btnSaveSettingHome');
  if (btnSaveSettingHome) {
    btnSaveSettingHome.addEventListener('click', () => {
      const val = document.getElementById('settingHomeNoInput').value.trim();
      if (val) {
        setHome(val);
        closeModal('modalSettings');
      }
    });
  }

  // New List Modal
  document.getElementById('btnCreateNewList').addEventListener('click', () => {
    document.getElementById('modalNewList').style.display = 'flex';
    document.getElementById('inputNewListName').focus();
  });
  document.getElementById('btnCloseNewListModal').addEventListener('click', () => closeModal('modalNewList'));
  document.querySelectorAll('.btn-quick-name').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('inputNewListName').value = btn.dataset.name;
    });
  });
  document.getElementById('formNewListModal').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inputNewListName').value.trim() || 'أغراض جديدة';
    
    // Check if creating from selected history items
    if (appState.historySelectedToCreate && appState.historySelectedToCreate.length > 0) {
      createListFromSelectedHistory(name, appState.historySelectedToCreate);
      appState.historySelectedToCreate = null;
    } else {
      createNewShoppingList(name);
    }
    closeModal('modalNewList');
  });

  // Finish Shopping Trip Buttons
  document.getElementById('btnFinishShopping').addEventListener('click', openFinishTripModal);
  const quickFinishBanner = document.getElementById('btnQuickFinishFromBanner');
  if (quickFinishBanner) quickFinishBanner.addEventListener('click', openFinishTripModal);

  document.getElementById('btnCloseFinishTripModal').addEventListener('click', () => closeModal('modalFinishTrip'));
  document.getElementById('btnConfirmFinishTrip').addEventListener('click', handleConfirmFinishTrip);

  // History Detail Modal Closers
  document.getElementById('btnCloseHistoryDetailModal').addEventListener('click', () => closeModal('modalHistoryDetail'));
  document.getElementById('btnReopenHistoryList').addEventListener('click', handleReopenHistoryList);
  document.getElementById('btnRolloverMissingFromHistory').addEventListener('click', handleRolloverMissingFromHistory);

  // History Direct Main View Controls
  const btnExitHistory = document.getElementById('btnExitHistoryView');
  if (btnExitHistory) btnExitHistory.addEventListener('click', exitHistoryView);

  const btnSelectAllHistory = document.getElementById('btnSelectAllHistory');
  if (btnSelectAllHistory) btnSelectAllHistory.addEventListener('click', selectAllHistoryItems);

  const btnDeselectAllHistory = document.getElementById('btnDeselectAllHistory');
  if (btnDeselectAllHistory) btnDeselectAllHistory.addEventListener('click', deselectAllHistoryItems);

  const btnAddSelectedToNew = document.getElementById('btnAddSelectedToNewList');
  if (btnAddSelectedToNew) btnAddSelectedToNew.addEventListener('click', promptCreateNewListFromHistory);

  // List Name Edit
  const listNameInput = document.getElementById('listNameInput');
  listNameInput.addEventListener('change', (e) => {
    if (appState.viewingHistoryTrip) return;
    appState.currentList.name = e.target.value.trim() || 'أغراض اليوم';
    saveData();
    renderApp();
  });

  // Creation Tabs
  document.querySelectorAll('.creation-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.creation-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      document.getElementById('panelSingle').style.display = tab === 'single' ? 'block' : 'none';
      document.getElementById('panelBatch').style.display = tab === 'batch' ? 'block' : 'none';
      document.getElementById('panelDemo').style.display = tab === 'demo' ? 'block' : 'none';
    });
  });

  // Single Item Form Add (With Multiline / Enter support)
  const nameInput = document.getElementById('inputItemName');
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      // Enter without Ctrl allows normal newlines!
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        document.getElementById('formAddItem').requestSubmit();
      }
    });
  }

  document.getElementById('formAddItem').addEventListener('submit', (e) => {
    e.preventDefault();
    const qtyNumInput = document.getElementById('inputItemQtyNum');
    const unitInput = document.getElementById('inputItemUnit');
    const noteInput = document.getElementById('inputItemNote');
    const photoImg = document.getElementById('singlePhotoImg');

    const rawText = nameInput.value.trim();
    if (!rawText) return;

    // Split by newlines so multiple lines become multiple items
    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    const reqQty = parseInt(qtyNumInput.value) || 1;
    const unit = unitInput.value.trim() || 'علبة';
    const note = noteInput.value.trim() || '';
    const photoSrc = photoImg.dataset.src || '';

    const newItems = lines.map((lineName, idx) => ({
      id: generateId(),
      name: lineName,
      quantityRequired: reqQty,
      quantityFound: 0,
      unit,
      note,
      imageUrl: idx === 0 ? photoSrc : '',
      alternativeImageUrl: null,
      status: 'pending',
      createdAt: new Date().toISOString()
    }));

    appState.currentList.items = [...newItems, ...appState.currentList.items];
    saveData();

    nameInput.value = '';
    qtyNumInput.value = '1';
    unitInput.value = '';
    noteInput.value = '';
    photoImg.dataset.src = '';
    photoImg.src = '';
    document.getElementById('singlePhotoPreview').style.display = 'none';

    renderApp();
    if (lines.length > 1) {
      showToast(`🎉 تم إضافة ${lines.length} أغراض جديدة بنجاح!`);
    } else {
      showToast(`✓ تمت إضافة "${lines[0]}" للسلة بنجاح!`);
    }
  });

  // Single Photo Upload
  document.getElementById('fileSingleInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      readFileAsDataUrl(file, (dataUrl) => {
        const preview = document.getElementById('singlePhotoPreview');
        const img = document.getElementById('singlePhotoImg');
        img.src = dataUrl;
        img.dataset.src = dataUrl;
        preview.style.display = 'block';
      });
    }
  });

  document.getElementById('removeSinglePhoto').addEventListener('click', () => {
    const img = document.getElementById('singlePhotoImg');
    img.src = '';
    img.dataset.src = '';
    document.getElementById('singlePhotoPreview').style.display = 'none';
    document.getElementById('fileSingleInput').value = '';
  });

  document.getElementById('btnLaunchCameraSingle').addEventListener('click', () => {
    openCameraModal('singleForm');
  });

  // Batch Dropzone & File Input
  const dropzone = document.getElementById('batchDropzone');
  const fileBatchInput = document.getElementById('fileBatchInput');

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleBatchFiles(Array.from(files));
    }
  });

  fileBatchInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleBatchFiles(Array.from(files));
    }
  });

  // Demo Items Reload Button
  document.getElementById('btnLoadDemoItems').addEventListener('click', () => {
    appState.currentList.items = JSON.parse(JSON.stringify(DEMO_ITEMS));
    saveData();
    renderApp();
    showToast('تم شحن القائمة بكافة الأغراض والصور التجريبية بنجاح! ✨');
  });

  // Filter Buttons
  document.querySelectorAll('.filter-tabs .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveFilter(btn.dataset.filter);
    });
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    appState.searchQuery = e.target.value.toLowerCase().trim();
    renderCards();
  });

  document.getElementById('btnClearList').addEventListener('click', () => {
    if (confirm('هل أنت متأكد من مسح جميع الأغراض في هذه القائمة؟')) {
      appState.currentList.items = [];
      saveData();
      renderApp();
    }
  });

  // Modal Openers & Closers
  document.getElementById('btnCompile').addEventListener('click', openCompileModal);
  document.getElementById('btnHistory').addEventListener('click', openHistoryModal);
  document.getElementById('btnSettings').addEventListener('click', openSettingsModal);

  document.getElementById('btnCloseCompileModal').addEventListener('click', () => closeModal('modalCompile'));
  document.getElementById('btnCloseCameraModal').addEventListener('click', closeCameraModal);
  document.getElementById('btnCloseHistoryModal').addEventListener('click', () => closeModal('modalHistory'));
  document.getElementById('btnCloseSettingsModal').addEventListener('click', () => closeModal('modalSettings'));

  // Image Zoom Lightbox controls
  const btnCloseZoom = document.getElementById('btnCloseImageZoom');
  if (btnCloseZoom) btnCloseZoom.addEventListener('click', closeImageZoom);

  const btnZoomIn = document.getElementById('btnZoomIn');
  if (btnZoomIn) btnZoomIn.addEventListener('click', () => setZoomScale(zoomState.scale + 0.3));

  const btnZoomOut = document.getElementById('btnZoomOut');
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => setZoomScale(zoomState.scale - 0.3));

  const btnZoomReset = document.getElementById('btnZoomReset');
  if (btnZoomReset) btnZoomReset.addEventListener('click', resetImageZoom);

  // Wheel zoom on viewport
  const zoomViewport = document.getElementById('zoomViewport');
  if (zoomViewport) {
    zoomViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomScale(zoomState.scale + delta);
    }, { passive: false });

    // Drag to pan
    zoomViewport.addEventListener('mousedown', (e) => {
      if (zoomState.scale <= 1) return;
      zoomState.isDragging = true;
      zoomState.startX = e.clientX - zoomState.translateX;
      zoomState.startY = e.clientY - zoomState.translateY;
      zoomViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!zoomState.isDragging) return;
      zoomState.translateX = e.clientX - zoomState.startX;
      zoomState.translateY = e.clientY - zoomState.startY;
      updateZoomTransform();
    });

    window.addEventListener('mouseup', () => {
      if (zoomState.isDragging) {
        zoomState.isDragging = false;
        zoomViewport.classList.remove('is-dragging');
      }
    });

    // Touch support for mobile/tablet pinch & drag
    let initialTouchDistance = null;
    let initialScale = 1;
    zoomViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        zoomState.isDragging = true;
        zoomState.startX = e.touches[0].clientX - zoomState.translateX;
        zoomState.startY = e.touches[0].clientY - zoomState.translateY;
      } else if (e.touches.length === 2) {
        initialTouchDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = zoomState.scale;
      }
    }, { passive: true });

    zoomViewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && zoomState.isDragging && zoomState.scale > 1) {
        zoomState.translateX = e.touches[0].clientX - zoomState.startX;
        zoomState.translateY = e.touches[0].clientY - zoomState.startY;
        updateZoomTransform();
      } else if (e.touches.length === 2 && initialTouchDistance) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = currentDistance / initialTouchDistance;
        setZoomScale(initialScale * factor);
      }
    }, { passive: true });

    zoomViewport.addEventListener('touchend', () => {
      zoomState.isDragging = false;
      initialTouchDistance = null;
    });
  }

  // Camera Modal controls
  document.getElementById('btnSnapPhoto').addEventListener('click', snapCameraPhoto);
  document.getElementById('btnSwitchCamera').addEventListener('click', switchCameraFacing);
  document.getElementById('btnCameraUploadFallback').addEventListener('click', () => {
    document.getElementById('cameraFallbackInput').click();
  });
  document.getElementById('cameraFallbackInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      readFileAsDataUrl(file, (dataUrl) => {
        applyCapturedPhoto(dataUrl);
        closeCameraModal();
      });
    }
  });

  // Compile Modal Tabs
  document.getElementById('tabCompileImage').addEventListener('click', () => {
    document.getElementById('tabCompileImage').classList.add('active');
    document.getElementById('tabCompilePdf').classList.remove('active');
    document.getElementById('compileImagePane').style.display = 'block';
    document.getElementById('compilePdfPane').style.display = 'none';
    generateCollageCanvas();
  });

  document.getElementById('tabCompilePdf').addEventListener('click', () => {
    document.getElementById('tabCompilePdf').classList.add('active');
    document.getElementById('tabCompileImage').classList.remove('active');
    document.getElementById('compileImagePane').style.display = 'none';
    document.getElementById('compilePdfPane').style.display = 'block';
    renderPdfPreview();
  });

  document.getElementById('btnRegenerateCanvas').addEventListener('click', generateCollageCanvas);
  document.getElementById('chkIncludeItemName').addEventListener('change', generateCollageCanvas);
  document.getElementById('chkOnlyBought').addEventListener('change', generateCollageCanvas);
  document.getElementById('btnDownloadCollage').addEventListener('click', downloadCollageImage);
  document.getElementById('btnDownloadPdf').addEventListener('click', downloadPdfReport);

  // History & Settings Actions
  document.getElementById('btnSaveCurrentToHistory').addEventListener('click', saveCurrentListToHistory);
  document.getElementById('selectRetention').addEventListener('change', (e) => {
    appState.settings.retentionDays = e.target.value;
    saveSettings();
    applyRetentionPolicy();
    renderApp();
  });
}

// Multi-Image Batch Distribution
function handleBatchFiles(files) {
  const imageFiles = files.filter(f => f.type.startsWith('image/'));
  if (imageFiles.length === 0) {
    alert('يرجى اختيار ملفات صور صالحة.');
    return;
  }

  let processedCount = 0;
  const newItems = [];

  imageFiles.forEach((file, index) => {
    readFileAsDataUrl(file, (dataUrl) => {
      let cleanName = file.name.replace(/\.[^/.]+$/, '');
      if (cleanName.includes('WhatsApp')) {
        cleanName = `غرض مصور ${appState.currentList.items.length + index + 1}`;
      }

      newItems.push({
        id: generateId(),
        name: cleanName,
        quantityRequired: 1,
        quantityFound: 0,
        unit: 'حبة',
        imageUrl: dataUrl,
        alternativeImageUrl: null,
        note: '',
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      processedCount++;
      if (processedCount === imageFiles.length) {
        appState.currentList.items = [...newItems, ...appState.currentList.items];
        saveData();
        renderApp();
        showToast(`🎉 تم توزيع ${imageFiles.length} صورة على كروت مستقلة بنجاح!`);
      }
    });
  });
}

function readFileAsDataUrl(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsDataURL(file);
}

// ============================================================================
// New Shopping List & Finish Trip Operations
// ============================================================================
function createNewShoppingList(listName) {
  if (appState.currentList.items.length > 0) {
    saveCurrentListToHistory(false);
  }

  appState.currentList = {
    id: generateId(),
    name: listName,
    homeNo: appState.homeNo,
    createdAt: new Date().toISOString(),
    items: []
  };

  saveData();
  renderApp();
  showToast(`✨ تم بدء سلة مقاضي جديدة: "${listName}"`);
}

function openFinishTripModal() {
  const modal = document.getElementById('modalFinishTrip');
  const summaryBox = document.getElementById('finishTripSummaryBox');
  const items = appState.currentList.items;

  const total = items.length;
  const bought = items.filter(i => i.status === 'bought').length;
  const partial = items.filter(i => i.status === 'partial').length;
  const missing = items.filter(i => i.status === 'missing').length;

  summaryBox.innerHTML = `
    <div class="finish-summary-card sum-bought">
      <span class="sum-num">${bought}</span>
      <span class="sum-lbl">تم بالكامل ✓</span>
    </div>
    <div class="finish-summary-card sum-partial">
      <span class="sum-num">${partial}</span>
      <span class="sum-lbl">شراء جزئي ⚠️</span>
    </div>
    <div class="finish-summary-card sum-missing">
      <span class="sum-num">${missing}</span>
      <span class="sum-lbl">غير متوفر ✕</span>
    </div>
  `;

  modal.style.display = 'flex';
}

function handleConfirmFinishTrip() {
  const action = document.querySelector('input[name="finishAction"]:checked').value;
  const currentSnapshot = JSON.parse(JSON.stringify(appState.currentList));

  appState.historyLists.unshift({
    ...currentSnapshot,
    finishedAt: new Date().toISOString()
  });
  saveHistory();

  closeModal('modalFinishTrip');

  if (action === 'save_and_rollover') {
    const rolloverItems = [];

    currentSnapshot.items.forEach(it => {
      if (it.status === 'missing') {
        rolloverItems.push({
          ...it,
          id: generateId(),
          status: 'pending'
        });
      } else if (it.status === 'partial') {
        const remainingQty = Math.max(1, (it.quantityRequired || 1) - (it.quantityFound || 0));
        rolloverItems.push({
          ...it,
          id: generateId(),
          quantityRequired: remainingQty,
          quantityFound: 0,
          status: 'pending',
          note: `متبقي من جولة سابقة (${it.quantityFound} تم شراؤها سابقاً)`
        });
      }
    });

    appState.currentList = {
      id: generateId(),
      name: `نواقص ${currentSnapshot.name}`,
      homeNo: appState.homeNo,
      createdAt: new Date().toISOString(),
      items: rolloverItems
    };
    saveData();
    renderApp();
    triggerConfetti();
    showToast(`🔄 تم حفظ الجولة في السجل وترحيل ${rolloverItems.length} أغراض ناقصة لسلة جديدة!`);
  } else {
    triggerConfetti();
    renderApp();
    showToast('💾 تم حفظ وأرشفة جولة التسوق في السجل بنجاح!');
  }
}

// ============================================================================
// History Detailed Viewer
// ============================================================================
function viewHistoryListDetail(listId) {
  const target = appState.historyLists.find(l => l.id === listId);
  if (!target) return;

  closeModal('modalHistory');
  closeModal('modalHistoryDetail');

  appState.viewingHistoryTrip = target;
  appState.selectedHistoryItemIds = new Set();
  appState.openSubstituteItemId = null;

  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast(`📜 تم استعراض سجل: "${target.name}" في الصفحة الرئيسية`);
}

function exitHistoryView() {
  appState.viewingHistoryTrip = null;
  appState.selectedHistoryItemIds.clear();
  appState.openSubstituteItemId = null;
  renderApp();
  showToast('↩️ تم الرجوع إلى سلة المقاضي النشطة');
}

function selectAllHistoryItems() {
  if (!appState.viewingHistoryTrip) return;
  (appState.viewingHistoryTrip.items || []).forEach(it => {
    appState.selectedHistoryItemIds.add(it.id);
  });
  renderCards();
  updateHistorySelectionCount();
}

function deselectAllHistoryItems() {
  appState.selectedHistoryItemIds.clear();
  renderCards();
  updateHistorySelectionCount();
}

function updateHistorySelectionCount() {
  const countSpan = document.getElementById('historySelectedCount');
  if (countSpan) {
    countSpan.textContent = `${appState.selectedHistoryItemIds.size} صنف محدد`;
  }
}

function promptCreateNewListFromHistory() {
  if (!appState.viewingHistoryTrip) return;
  if (appState.selectedHistoryItemIds.size === 0) {
    alert('يرجى تحديد صنف واحد على الأقل أولاً لإضافته لسلة جديدة!');
    return;
  }

  const selectedItems = (appState.viewingHistoryTrip.items || []).filter(i => appState.selectedHistoryItemIds.has(i.id));
  appState.historySelectedToCreate = selectedItems;

  const modal = document.getElementById('modalNewList');
  const input = document.getElementById('inputNewListName');
  input.value = `أغراض جديدة من (${appState.viewingHistoryTrip.name})`;
  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 100);
}

function createListFromSelectedHistory(listName, items) {
  if (appState.currentList.items.length > 0) {
    saveCurrentListToHistory(false);
  }

  const newItems = items.map(item => ({
    ...item,
    id: generateId(),
    quantityFound: 0,
    status: 'pending'
  }));

  appState.currentList = {
    id: generateId(),
    name: listName,
    homeNo: appState.homeNo,
    createdAt: new Date().toISOString(),
    items: newItems
  };

  appState.viewingHistoryTrip = null;
  appState.selectedHistoryItemIds.clear();
  appState.openSubstituteItemId = null;

  saveData();
  renderApp();
  triggerConfetti();
  showToast(`✨ تم إنشاء سلة "${listName}" وإضافة ${newItems.length} صنف بنجاح!`);
}

function handleReopenHistoryList() {
  const target = appState.selectedHistoryList;
  if (!target) return;

  if (confirm(`هل تريد استرجاع قائمة "${target.name}" كقائمة نشطة جديدة؟`)) {
    appState.currentList = {
      id: generateId(),
      name: `${target.name} (نسخة جديدة)`,
      homeNo: appState.homeNo,
      createdAt: new Date().toISOString(),
      items: (target.items || []).map(i => ({
        ...i,
        id: generateId(),
        status: 'pending',
        quantityFound: 0
      }))
    };
    saveData();
    closeModal('modalHistoryDetail');
    closeModal('modalHistory');
    renderApp();
    showToast('⚡ تم استرجاع القائمة كقائمة تسوق نشطة!');
  }
}

function handleRolloverMissingFromHistory() {
  const target = appState.selectedHistoryList;
  if (!target) return;

  const missingItems = (target.items || []).filter(i => i.status === 'missing' || i.status === 'partial');
  if (missingItems.length === 0) {
    alert('هذه القائمة ليس بها أي نواقص!');
    return;
  }

  appState.currentList = {
    id: generateId(),
    name: `نواقص ${target.name}`,
    homeNo: appState.homeNo,
    createdAt: new Date().toISOString(),
    items: missingItems.map(i => {
      const remainingQty = i.status === 'partial' ? Math.max(1, (i.quantityRequired || 1) - (i.quantityFound || 0)) : (i.quantityRequired || 1);
      return {
        ...i,
        id: generateId(),
        quantityRequired: remainingQty,
        quantityFound: 0,
        status: 'pending'
      };
    })
  };

  saveData();
  closeModal('modalHistoryDetail');
  closeModal('modalHistory');
  renderApp();
  showToast(`✓ تم بدء سلة جديدة تحتوي على ${missingItems.length} أغراض ناقصة!`);
}

// ============================================================================
// Rendering & Data Analysis
// ============================================================================
function renderApp() {
  const { currentList, lang, settings, viewingHistoryTrip } = appState;
  const t = i18n[lang];

  const activeDisplayList = viewingHistoryTrip || currentList;
  const isHistoryMode = !!viewingHistoryTrip;

  const listNameInput = document.getElementById('listNameInput');
  listNameInput.value = activeDisplayList.name;
  listNameInput.readOnly = isHistoryMode;

  const listSubtitle = document.getElementById('listSubtitle');
  const listDatePill = document.getElementById('listDatePill');
  const historyViewBanner = document.getElementById('historyViewBanner');
  const historyBannerTitle = document.getElementById('historyBannerTitle');
  const historyBannerSubtitle = document.getElementById('historyBannerSubtitle');
  const historySelectionBar = document.getElementById('historySelectionBar');

  if (isHistoryMode) {
    if (historyViewBanner) {
      historyViewBanner.style.display = 'flex';
      historyBannerTitle.textContent = activeDisplayList.name;
      const formattedTripDate = new Date(activeDisplayList.createdAt).toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      historyBannerSubtitle.textContent = `📅 تاريخ الحفظ: ${formattedTripDate} • إجمالي الأصناف: ${activeDisplayList.items.length}`;
    }
    if (historySelectionBar) {
      historySelectionBar.style.display = 'flex';
      updateHistorySelectionCount();
    }
    if (listSubtitle) listSubtitle.textContent = 'سجل جولة مؤرشفة: حدد الأصناف المرغوبة لنقلها لسلة جديدة.';
    if (listDatePill) listDatePill.textContent = `📅 ${new Date(activeDisplayList.createdAt).toLocaleDateString('ar-EG')}`;
  } else {
    if (historyViewBanner) historyViewBanner.style.display = 'none';
    if (historySelectionBar) historySelectionBar.style.display = 'none';
    if (listSubtitle) listSubtitle.textContent = lang === 'ar' ? 'حدّد المشتريات، التقط صور البدائل، وتابع النواقص فورياً.' : 'Track groceries, snap shelf substitutes, and review in real-time.';
    if (listDatePill) listDatePill.textContent = lang === 'ar' ? '📅 اليوم' : '📅 Today';
  }

  const retentionMap = {
    '7': lang === 'ar' ? 'أسبوع' : '7 Days',
    '15': lang === 'ar' ? 'أسبوعين' : '15 Days',
    '30': lang === 'ar' ? 'شهر (افتراضي)' : '1 Month (Default)',
    '90': lang === 'ar' ? '3 أشهر' : '3 Months',
    '365': lang === 'ar' ? 'سنة' : '1 Year',
    'forever': lang === 'ar' ? 'دائم' : 'Permanent'
  };
  document.getElementById('retentionPill').textContent = t.retentionPrefix + (retentionMap[settings.retentionDays] || 'شهر');

  const total = activeDisplayList.items.length;
  const bought = activeDisplayList.items.filter(i => i.status === 'bought').length;
  const partial = activeDisplayList.items.filter(i => i.status === 'partial').length;
  const substitute = activeDisplayList.items.filter(i => i.status === 'substitute').length;
  const missing = activeDisplayList.items.filter(i => i.status === 'missing').length;
  const remaining = activeDisplayList.items.filter(i => i.status === 'pending').length;

  const effectiveBought = bought + substitute + partial * 0.5;
  const percent = total > 0 ? Math.round((effectiveBought / total) * 100) : 0;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statBought').textContent = bought;
  document.getElementById('statPartial').textContent = partial;
  const statSubEl = document.getElementById('statSubstitute');
  if (statSubEl) statSubEl.textContent = substitute;
  document.getElementById('statMissing').textContent = missing;
  document.getElementById('statRemaining').textContent = remaining;

  document.getElementById('filterCountAll').textContent = total;
  document.getElementById('filterCountPending').textContent = remaining;
  document.getElementById('filterCountBought').textContent = bought;
  document.getElementById('filterCountPartial').textContent = partial;
  const filterSubEl = document.getElementById('filterCountSubstitute');
  if (filterSubEl) filterSubEl.textContent = substitute;
  document.getElementById('filterCountMissing').textContent = missing;

  const circle = document.getElementById('progressCircle');
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  document.getElementById('progressPercent').textContent = percent + '%';

  const banner = document.getElementById('analysisBanner');
  const bannerTitle = document.getElementById('analysisTitle');
  const bannerDesc = document.getElementById('analysisDesc');
  const bannerIcon = document.getElementById('analysisIcon');

  if (total > 0 && !isHistoryMode) {
    banner.style.display = 'flex';
    if (percent === 100) {
      banner.className = 'analysis-banner banner-completed';
      bannerIcon.textContent = '🎉';
      bannerTitle.textContent = t.allDoneTitle;
      bannerDesc.textContent = t.allDoneDesc;
    } else if (missing > 0 || partial > 0) {
      banner.className = 'analysis-banner banner-warning';
      bannerIcon.textContent = '⚠️';
      bannerTitle.textContent = t.missingAlertTitle;
      bannerDesc.textContent = t.missingAlertDesc(missing, partial);
    } else {
      banner.className = 'analysis-banner banner-progress';
      bannerIcon.textContent = '📊';
      bannerTitle.textContent = lang === 'ar' ? 'حالة سلة المقاضي' : 'Shopping Basket Progress';
      bannerDesc.textContent = lang === 'ar'
        ? `تم شراء ${bought} بالكامل، و ${substitute} بدائل، و ${partial} جزئياً من أصل ${total} غرض (${percent}%).`
        : `Completed ${bought} fully, ${substitute} substitutes, and ${partial} partially of ${total} items (${percent}%).`;
    }
  } else {
    banner.style.display = 'none';
  }

  renderCards();
}

function renderCards() {
  const container = document.getElementById('itemsGrid');
  const emptyState = document.getElementById('emptyState');
  const { currentList, viewingHistoryTrip, activeFilter, searchQuery, lang, selectedHistoryItemIds } = appState;
  const activeDisplayList = viewingHistoryTrip || currentList;
  const isHistoryMode = !!viewingHistoryTrip;
  const t = i18n[lang];

  container.innerHTML = '';

  let filtered = activeDisplayList.items.filter(item => {
    if (activeFilter === 'bought' && item.status !== 'bought') return false;
    if (activeFilter === 'partial' && item.status !== 'partial') return false;
    if (activeFilter === 'substitute' && item.status !== 'substitute') return false;
    if (activeFilter === 'missing' && item.status !== 'missing') return false;
    if (activeFilter === 'pending' && item.status !== 'pending') return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) return false;
    return true;
  });

  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  filtered.forEach(item => {
    const card = document.createElement('div');
    const isSelectedInHistory = isHistoryMode && selectedHistoryItemIds.has(item.id);
    card.className = `item-card status-${item.status} ${isSelectedInHistory ? 'is-selected-for-copy' : ''}`;
    card.dataset.id = item.id;

    let statusLabel = lang === 'ar' ? '⏳ قيد الشراء' : '⏳ Pending';
    let statusClass = 'badge-pending';
    if (item.status === 'bought') {
      statusLabel = lang === 'ar' ? '✓ تم بالكامل' : '✓ Completed';
      statusClass = 'badge-bought';
    } else if (item.status === 'partial') {
      statusLabel = lang === 'ar' ? `⚠️ تم شراء ${item.quantityFound || 1} من ${item.quantityRequired || 2}` : `⚠️ ${item.quantityFound || 1} of ${item.quantityRequired || 2}`;
      statusClass = 'badge-partial';
    } else if (item.status === 'substitute') {
      const subName = item.substituteName ? ` (${item.substituteName})` : '';
      statusLabel = lang === 'ar' ? `🔄 بديل متوفر${subName}` : `🔄 Substitute${subName}`;
      statusClass = 'badge-substitute';
    } else if (item.status === 'missing') {
      statusLabel = lang === 'ar' ? '⏳ معلقة' : '⏳ Suspended';
      statusClass = 'badge-missing';
    }

    // Media Display (Photo or Alternative/Substitute Photo)
    const displayImg = (item.status === 'substitute' && item.alternativeImageUrl) ? item.alternativeImageUrl : item.imageUrl;
    let imageHtml = '';
    if (displayImg) {
      imageHtml = `
        <div class="card-media-wrap">
          <img src="${displayImg}" class="card-img" alt="${escapeHtml(item.name)}" title="🔍 اضغط لتكبير واستعراض الصورة بحجم كامل" data-zoom-src="${displayImg}" data-zoom-title="${escapeHtml(item.name)}" onerror="this.onerror=null; this.src='/logo.png';" />
          <span class="card-status-badge ${statusClass}">${statusLabel}</span>
        </div>
      `;
    } else {
      imageHtml = `
        <div class="card-media-wrap">
          <div class="no-image-placeholder" ${isHistoryMode ? '' : `onclick="document.getElementById('cardFileInput_${item.id}').click()"`}>
            <span class="placeholder-icon">📸</span>
            <span class="placeholder-text">${lang === 'ar' ? '+ إرفاق صورة للغرض' : '+ Add Photo'}</span>
          </div>
          <span class="card-status-badge ${statusClass}">${statusLabel}</span>
        </div>
      `;
    }

    const fileInputHtml = isHistoryMode ? '' : `<input type="file" id="cardFileInput_${item.id}" accept="image/*" style="display:none;" />`;
    let noteHtml = item.note ? `<p class="card-note-text" dir="auto">📝 ${escapeHtml(item.note)}</p>` : '';

    // History selection checkbox at top corner of card
    let historySelectHtml = '';
    if (isHistoryMode) {
      historySelectHtml = `
        <label class="history-card-select-wrap">
          <input type="checkbox" class="chk-history-item" data-id="${item.id}" ${isSelectedInHistory ? 'checked' : ''} />
          <span>تحديد</span>
        </label>
      `;
    }

    // Partial purchase stepper box
    let partialBoxHtml = '';
    if (item.status === 'partial') {
      const req = item.quantityRequired || 2;
      const found = item.quantityFound || 1;
      const missingCount = Math.max(0, req - found);

      partialBoxHtml = `
        <div class="partial-stepper-box">
          <div class="partial-stepper-row">
            <span class="stepper-label">الكمية التي وجدتها:</span>
            <div style="display:flex;align-items:center;gap:0.5rem;">
              ${!isHistoryMode ? `<button class="stepper-btn btn-stepper-minus" data-id="${item.id}">-</button>` : ''}
              <strong style="font-size:16px;color:#92400e;">${found} من ${req} ${item.unit || 'علبة'}</strong>
              ${!isHistoryMode ? `<button class="stepper-btn btn-stepper-plus" data-id="${item.id}">+</button>` : ''}
            </div>
          </div>
          <div class="partial-missing-alert-tag">
            ⚠️ ناقص ${missingCount} ${item.unit || 'علبة'} لسه
          </div>
        </div>
      `;
    }

    // Substitute Box ("لقيت بديل")
    let substituteBoxHtml = '';
    const isSubActive = item.status === 'substitute' || appState.openSubstituteItemId === item.id;
    if (isSubActive && !isHistoryMode) {
      substituteBoxHtml = `
        <div class="substitute-action-box">
          <div class="substitute-header">
            <span class="sub-icon-badge">🔄</span>
            <div>
              <strong>تسجيل الصنف البديل من الرف</strong>
              <span>يمكنك تصوير البديل وكتابة اسمه وتحديد الكمية</span>
            </div>
          </div>

          <div class="sub-photo-row">
            <button type="button" class="btn-sub-camera btn-card-camera" data-id="${item.id}">
              📸 التقاط صورة للبديل
            </button>
            ${item.alternativeImageUrl ? `
              <div class="sub-preview-chip">
                <img src="${item.alternativeImageUrl}" alt="بديل" onerror="this.onerror=null; this.src='/logo.png';" />
                <button type="button" class="btn-remove-sub-img" data-id="${item.id}">&times;</button>
              </div>
            ` : ''}
          </div>

          <input type="text" class="sub-name-input" placeholder="اسم أو ماركة البديل (اختياري)..." value="${escapeHtml(item.substituteName || '')}" dir="auto" />

          <div class="sub-qty-row">
            <span class="sub-qty-label">الكمية البديلة (افتراضي 1):</span>
            <div class="sub-stepper-control">
              <button type="button" class="stepper-btn btn-sub-minus" data-id="${item.id}">-</button>
              <span class="sub-qty-val">${item.substituteQty || 1} ${escapeHtml(item.unit || 'حبة')}</span>
              <button type="button" class="stepper-btn btn-sub-plus" data-id="${item.id}">+</button>
            </div>
          </div>

          <button type="button" class="btn-confirm-substitute" data-id="${item.id}">
            ✓ تأكيد واعتماد البديل
          </button>
        </div>
      `;
    }

    const qtyDisplay = `${item.quantityRequired || 1} ${item.unit || ''}`.trim();

    card.innerHTML = `
      ${historySelectHtml}
      ${imageHtml}
      ${fileInputHtml}
      <div class="card-body">
        <div class="card-title-row">
          <h3 class="card-title" dir="auto">${escapeHtml(item.name)}</h3>
          ${qtyDisplay ? `<span class="card-qty-badge" dir="auto">${escapeHtml(qtyDisplay)}</span>` : ''}
        </div>
        ${noteHtml}
        
        <!-- 4 Action Buttons with Pure CSS Art Icons -->
        <div class="card-check-actions-4">
          <button class="btn-check-bought ${item.status === 'bought' ? 'active' : ''}" title="${t.boughtBtn}" ${isHistoryMode ? 'disabled' : ''}>
            <span class="css-art-icon css-art-check"></span> <span>${t.boughtBtn}</span>
          </button>
          <button class="btn-check-partial ${item.status === 'partial' ? 'active' : ''}" title="${t.partialBtn}" ${isHistoryMode ? 'disabled' : ''}>
            <span class="css-art-icon css-art-partial"></span> <span>${t.partialBtn}</span>
          </button>
          <button class="btn-check-substitute ${item.status === 'substitute' ? 'active' : ''}" title="${t.substituteBtn}" ${isHistoryMode ? 'disabled' : ''}>
            <span class="css-art-icon css-art-substitute"></span> <span>${t.substituteBtn}</span>
          </button>
          <button class="btn-check-missing ${item.status === 'missing' ? 'active' : ''}" title="${t.missingBtn}" ${isHistoryMode ? 'disabled' : ''}>
            <span class="css-art-icon css-art-suspended"></span> <span>${t.missingBtn}</span>
          </button>
        </div>

        ${partialBoxHtml}
        ${substituteBoxHtml}

        ${!isHistoryMode ? `
          <div class="card-footer-utils">
            <button type="button" class="btn-card-attach-photo" title="${t.attachPhotoBtn}" onclick="document.getElementById('cardFileInput_${item.id}').click()">
              <span class="cam-icon">📸</span> <span>${t.attachPhotoBtn}</span>
            </button>
            <button class="btn-card-del" title="${lang === 'ar' ? 'حذف الغرض' : 'Delete item'}">🗑️</button>
          </div>
        ` : ''}
      </div>
    `;

    attachCardListeners(card, item, isHistoryMode);
    container.appendChild(card);
  });
}

function attachCardListeners(card, item, isHistoryMode) {
  // Image Zoom on click
  const cardImg = card.querySelector('.card-img');
  if (cardImg) {
    cardImg.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = cardImg.getAttribute('data-zoom-src') || cardImg.src;
      const title = cardImg.getAttribute('data-zoom-title') || item.name;
      openImageZoom(src, title);
    });
  }

  // Also enable zoom on substitute preview chip if present
  const subChipImg = card.querySelector('.sub-preview-chip img');
  if (subChipImg) {
    subChipImg.style.cursor = 'zoom-in';
    subChipImg.addEventListener('click', (e) => {
      e.stopPropagation();
      openImageZoom(subChipImg.src, `${item.name} (البديل)`);
    });
  }

  if (isHistoryMode) {
    const chk = card.querySelector('.chk-history-item');
    if (chk) {
      chk.addEventListener('change', (e) => {
        if (e.target.checked) {
          appState.selectedHistoryItemIds.add(item.id);
          card.classList.add('is-selected-for-copy');
        } else {
          appState.selectedHistoryItemIds.delete(item.id);
          card.classList.remove('is-selected-for-copy');
        }
        updateHistorySelectionCount();
      });
    }
    return;
  }

  // Bought Toggle
  const btnBought = card.querySelector('.btn-check-bought');
  if (btnBought) {
    btnBought.addEventListener('click', () => {
      appState.openSubstituteItemId = null;
      if (item.status === 'bought') {
        item.status = 'pending';
        item.quantityFound = 0;
      } else {
        item.status = 'bought';
        item.quantityFound = item.quantityRequired || 1;
      }
      saveData();
      renderApp();
    });
  }

  // Partial Toggle
  const btnPartial = card.querySelector('.btn-check-partial');
  if (btnPartial) {
    btnPartial.addEventListener('click', () => {
      appState.openSubstituteItemId = null;
      if (item.status === 'partial') {
        item.status = 'pending';
      } else {
        item.status = 'partial';
        const req = item.quantityRequired || 2;
        item.quantityFound = Math.max(1, Math.floor(req / 2));
      }
      saveData();
      renderApp();
    });
  }

  // Substitute Toggle
  const btnSub = card.querySelector('.btn-check-substitute');
  if (btnSub) {
    btnSub.addEventListener('click', () => {
      if (item.status === 'substitute') {
        item.status = 'pending';
        appState.openSubstituteItemId = null;
      } else {
        item.substituteQty = item.substituteQty || 1;
        appState.openSubstituteItemId = item.id;
      }
      saveData();
      renderApp();
    });
  }

  // Missing / Suspended Toggle ("معلقة")
  const btnMissing = card.querySelector('.btn-check-missing');
  if (btnMissing) {
    btnMissing.addEventListener('click', () => {
      appState.openSubstituteItemId = null;
      if (item.status === 'missing') {
        item.status = 'pending';
      } else {
        item.status = 'missing';
        item.quantityFound = 0;
      }
      saveData();
      renderApp();
    });
  }

  // Substitute Stepper & Confirm
  const subMinus = card.querySelector('.btn-sub-minus');
  const subPlus = card.querySelector('.btn-sub-plus');
  const subConfirm = card.querySelector('.btn-confirm-substitute');
  const subNameInput = card.querySelector('.sub-name-input');
  const subRemoveImg = card.querySelector('.btn-remove-sub-img');

  if (subMinus) {
    subMinus.addEventListener('click', () => {
      if ((item.substituteQty || 1) > 1) {
        item.substituteQty = (item.substituteQty || 1) - 1;
        renderApp();
      }
    });
  }
  if (subPlus) {
    subPlus.addEventListener('click', () => {
      item.substituteQty = (item.substituteQty || 1) + 1;
      renderApp();
    });
  }
  if (subNameInput) {
    subNameInput.addEventListener('input', (e) => {
      item.substituteName = e.target.value.trim();
    });
  }
  if (subRemoveImg) {
    subRemoveImg.addEventListener('click', () => {
      item.alternativeImageUrl = null;
      saveData();
      renderApp();
    });
  }
  if (subConfirm) {
    subConfirm.addEventListener('click', () => {
      item.status = 'substitute';
      item.substituteQty = item.substituteQty || 1;
      appState.openSubstituteItemId = null;
      saveData();
      renderApp();
      showToast(`✓ تم اعتماد البديل لـ "${item.name}"!`);
    });
  }

  // Steppers for partial
  const btnMinus = card.querySelector('.btn-stepper-minus');
  const btnPlus = card.querySelector('.btn-stepper-plus');
  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if ((item.quantityFound || 1) > 1) {
        item.quantityFound--;
        saveData();
        renderApp();
      }
    });
  }
  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      const req = item.quantityRequired || 2;
      if ((item.quantityFound || 1) < req) {
        item.quantityFound++;
        saveData();
        renderApp();
      } else {
        item.status = 'bought';
        saveData();
        renderApp();
      }
    });
  }

  // Card Camera button (for substitute or missing)
  const btnCamera = card.querySelector('.btn-card-camera');
  if (btnCamera) {
    btnCamera.addEventListener('click', () => {
      openCameraModal('item', item.id);
    });
  }

  // File Upload on Card
  const fileInput = card.querySelector(`#cardFileInput_${item.id}`);
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        readFileAsDataUrl(file, (dataUrl) => {
          item.imageUrl = dataUrl;
          saveData();
          renderApp();
        });
      }
    });
  }

  // Delete Card
  const btnDel = card.querySelector('.btn-card-del');
  if (btnDel) {
    btnDel.addEventListener('click', () => {
      appState.currentList.items = appState.currentList.items.filter(x => x.id !== item.id);
      saveData();
      renderApp();
    });
  }
}

// ============================================================================
// Camera Live Capture Modal
// ============================================================================
async function openCameraModal(mode, itemId = null) {
  appState.cameraMode = mode;
  appState.cameraTargetItemId = itemId;
  const modal = document.getElementById('modalCamera');
  modal.style.display = 'flex';

  try {
    const constraints = {
      video: {
        facingMode: appState.currentFacingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    appState.cameraStream = stream;
    const video = document.getElementById('cameraVideo');
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.warn('Camera stream fallback', err);
    document.getElementById('cameraFallbackInput').click();
  }
}

function closeCameraModal() {
  if (appState.cameraStream) {
    appState.cameraStream.getTracks().forEach(track => track.stop());
    appState.cameraStream = null;
  }
  document.getElementById('modalCamera').style.display = 'none';
}

function switchCameraFacing() {
  appState.currentFacingMode = appState.currentFacingMode === 'environment' ? 'user' : 'environment';
  closeCameraModal();
  setTimeout(() => {
    openCameraModal(appState.cameraMode, appState.cameraTargetItemId);
  }, 200);
}

function snapCameraPhoto() {
  const video = document.getElementById('cameraVideo');
  if (!video.videoWidth) {
    document.getElementById('cameraFallbackInput').click();
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  applyCapturedPhoto(dataUrl);
  closeCameraModal();
}

function applyCapturedPhoto(dataUrl) {
  if (appState.cameraMode === 'singleForm') {
    const preview = document.getElementById('singlePhotoPreview');
    const img = document.getElementById('singlePhotoImg');
    img.src = dataUrl;
    img.dataset.src = dataUrl;
    preview.style.display = 'block';
  } else if (appState.cameraMode === 'item' && appState.cameraTargetItemId) {
    const item = appState.currentList.items.find(x => x.id === appState.cameraTargetItemId);
    if (item) {
      if (item.status === 'missing' || item.status === 'substitute' || appState.openSubstituteItemId === item.id) {
        item.alternativeImageUrl = dataUrl;
      } else {
        item.imageUrl = dataUrl;
      }
      saveData();
      renderApp();
      showToast('📸 تم حفظ الصورة للغرض فورياً!');
    }
  }
}

// ============================================================================
// Compilation & Collage Tool (5 صور جنب بعض في الصف) & PDF Generator
// ============================================================================
function openCompileModal() {
  document.getElementById('modalCompile').style.display = 'flex';
  generateCollageCanvas();
}

function generateCollageCanvas() {
  const canvas = document.getElementById('collageCanvas');
  const ctx = canvas.getContext('2d');
  const includeNames = document.getElementById('chkIncludeItemName').checked;
  const onlyBought = document.getElementById('chkOnlyBought').checked;

  let items = appState.currentList.items.filter(item => {
    if (onlyBought && item.status !== 'bought' && item.status !== 'partial') return false;
    return !!(item.imageUrl || item.alternativeImageUrl);
  });

  if (items.length === 0) {
    canvas.width = 700;
    canvas.height = 300;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('لا توجد صور متوفرة للمقاضي المحددة حالياً.', canvas.width / 2, 140);
    ctx.font = '16px Cairo, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('أرفق صوراً للأغراض أو قم بإلغاء خيار "المشتراة فقط" لعرض كافة الصور.', canvas.width / 2, 180);
    return;
  }

  const cols = 5;
  const tileWidth = 320;
  const tileHeight = 320;
  const labelHeight = includeNames ? 60 : 0;
  const itemTotalHeight = tileHeight + labelHeight;
  const gap = 20;
  const headerHeight = 120;
  const padding = 30;

  const numRows = Math.ceil(items.length / cols);
  canvas.width = padding * 2 + cols * tileWidth + (cols - 1) * gap;
  canvas.height = padding * 2 + headerHeight + numRows * itemTotalHeight + (numRows - 1) * gap;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, headerHeight);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px Cairo, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`🛒 كولاج المقاضي (${appState.homeNo ? 'منزل #' + appState.homeNo : ''}): ${appState.currentList.name}`, canvas.width - padding, 55);

  ctx.fillStyle = '#f97316';
  ctx.font = 'bold 18px Cairo, sans-serif';
  const statsSummary = `عدد الصور: ${items.length} صور | التاريخ: ${new Date().toLocaleDateString('ar-EG')}`;
  ctx.fillText(statsSummary, canvas.width - padding, 95);

  items.forEach((item, index) => {
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    const x = padding + colIndex * (tileWidth + gap);
    const y = headerHeight + padding + rowIndex * (itemTotalHeight + gap);

    const imgSrc = item.status === 'missing' && item.alternativeImageUrl ? item.alternativeImageUrl : item.imageUrl;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      roundRect(ctx, x, y, tileWidth, tileHeight, 14);
      ctx.clip();
      ctx.drawImage(img, x, y, tileWidth, tileHeight);
      ctx.restore();

      ctx.strokeStyle = item.status === 'bought' ? '#10b981' : item.status === 'partial' ? '#f59e0b' : '#e2e8f0';
      ctx.lineWidth = 4;
      roundRect(ctx, x, y, tileWidth, tileHeight, 14);
      ctx.stroke();

      if (item.status === 'bought') {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x + 28, y + 28, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✓', x + 28, y + 35);
      } else if (item.status === 'partial') {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x + 28, y + 28, 18, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️', x + 28, y + 35);
      }

      if (includeNames) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x, y + tileHeight + 4, tileWidth, labelHeight - 8);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 18px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name, x + tileWidth / 2, y + tileHeight + 32);

        const qtyText = item.status === 'partial' 
          ? `(تم إيجاد ${item.quantityFound} من ${item.quantityRequired})`
          : `${item.quantityRequired || 1} ${item.unit || ''}`;
        ctx.fillStyle = item.status === 'partial' ? '#b45309' : '#f97316';
        ctx.font = '14px Cairo, sans-serif';
        ctx.fillText(qtyText, x + tileWidth / 2, y + tileHeight + 50);
      }
    };
    img.src = imgSrc;
  });
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function downloadCollageImage() {
  const canvas = document.getElementById('collageCanvas');
  const link = document.createElement('a');
  link.download = `MonoCart_Home_${appState.homeNo || '1'}_${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function renderPdfPreview() {
  const container = document.getElementById('pdfItemsListPreview');
  const dateP = document.getElementById('pdfReportDate');
  const badge = document.getElementById('pdfCompletionBadge');
  const { currentList, viewingHistoryTrip, homeNo } = appState;
  const activeList = viewingHistoryTrip || currentList;

  const dateStr = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  dateP.textContent = `المنزل: #${homeNo || '101'} | سلة: ${activeList.name || 'أغراض اليوم'} | التاريخ: ${dateStr}`;

  const items = activeList.items || [];
  const total = items.length;
  const bought = items.filter(i => i.status === 'bought').length;
  const partial = items.filter(i => i.status === 'partial').length;
  const substitute = items.filter(i => i.status === 'substitute').length;
  const missing = items.filter(i => i.status === 'missing').length;
  const pending = items.filter(i => i.status === 'pending').length;
  const percent = total > 0 ? Math.round(((bought + substitute + partial * 0.5) / total) * 100) : 0;
  badge.textContent = `نسبة الإنجاز: ${percent}% (تم: ${bought} | بدائل: ${substitute} | جزئي: ${partial} | معلقة: ${missing} | متبقي: ${pending})`;

  if (items.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:#94a3b8;">لا توجد أصناف في هذه القائمة لتصديرها.</div>';
    return;
  }

  // 5 items per row grid layout with high quality image thumbnails and full Arabic & English text support
  const tilesHtml = items.map((item, idx) => {
    const displayImg = (item.status === 'substitute' && item.alternativeImageUrl) ? item.alternativeImageUrl : item.imageUrl;
    const qtyStr = `${item.quantityRequired || 1} ${item.unit || ''}`.trim();
    
    let statusText = '⏳ متبقي للشراء';
    let statusClass = 'pdf-tile-pending';
    if (item.status === 'bought') {
      statusText = '✓ تم بالكامل';
      statusClass = 'pdf-tile-bought';
    } else if (item.status === 'partial') {
      statusText = `⚠️ شراء جزئي (${item.quantityFound || 1}/${item.quantityRequired || 1})`;
      statusClass = 'pdf-tile-partial';
    } else if (item.status === 'substitute') {
      const subName = item.substituteName ? `: ${item.substituteName}` : '';
      statusText = `🔄 بديل${subName}`;
      statusClass = 'pdf-tile-substitute';
    } else if (item.status === 'missing') {
      statusText = '⏳ معلقة';
      statusClass = 'pdf-tile-missing';
    }

    return `
      <div class="pdf-tile">
        ${displayImg ? `
          <img src="${displayImg}" class="pdf-tile-thumb" alt="${escapeHtml(item.name)}" crossorigin="anonymous" />
        ` : `
          <div class="pdf-tile-placeholder">
            <span>🛒</span>
          </div>
        `}
        <div class="pdf-tile-name" dir="auto">${idx + 1}. ${escapeHtml(item.name)}</div>
        <div class="pdf-tile-qty" dir="auto">${escapeHtml(qtyStr)}</div>
        <div class="pdf-tile-badge ${statusClass}" dir="auto">${statusText}</div>
        ${item.note ? `<div class="pdf-tile-note" dir="auto">📝 ${escapeHtml(item.note)}</div>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="pdf-grid-5">
      ${tilesHtml}
    </div>
  `;
}

async function downloadPdfReport() {
  const previewEl = document.getElementById('pdfPreviewContent');
  if (!previewEl) return;

  const btn = document.getElementById('btnDownloadPdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ جارِ استخراج ملف الـ PDF عالي الدقة (يرجى الانتظار ثواني)...';
  btn.disabled = true;

  try {
    const canvas = await html2canvas(previewEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
    heightLeft -= (pageHeight - (margin * 2));

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - (margin * 2));
    }

    const { homeNo, currentList, viewingHistoryTrip } = appState;
    const activeList = viewingHistoryTrip || currentList;
    const safeTitle = (activeList.name || 'تقرير_المقاضي').replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
    pdf.save(`MonoCart_${safeTitle}_منزل_${homeNo || '101'}_${Date.now()}.pdf`);
    showToast('✓ تم استخراج وتحميل ملف الـ PDF بنجاح مع دعم كامل للعربية والصور!');
  } catch (err) {
    console.error('PDF generation error', err);
    showToast('حدث خطأ أثناء استخراج الـ PDF');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ============================================================================
// History & Frequency Analytics
// ============================================================================
function openHistoryModal() {
  document.getElementById('modalHistory').style.display = 'flex';
  renderFrequencyAnalytics();
  renderHistoryLists();
}

function renderFrequencyAnalytics() {
  const container = document.getElementById('frequentItemsChips');
  const frequencyMap = {};
  const allHistorical = [...appState.historyLists.flatMap(l => l.items || []), ...appState.currentList.items];

  allHistorical.forEach(item => {
    const cleanName = (item.name || '').trim();
    if (cleanName) {
      frequencyMap[cleanName] = (frequencyMap[cleanName] || 0) + 1;
    }
  });

  const sorted = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="hint-tag">لا توجد بيانات تكرار كافية بعد.</p>';
    return;
  }

  container.innerHTML = sorted.map(([name, count]) => `
    <div class="frequent-chip" title="اضغط للإضافة للسلة الحالية">
      <span>${escapeHtml(name)}</span>
      <span class="count-badge">${count}x</span>
      <span class="chip-add-btn" data-name="${escapeHtml(name)}">+</span>
    </div>
  `).join('');

  container.querySelectorAll('.chip-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = e.target.dataset.name;
      appState.currentList.items.unshift({
        id: generateId(),
        name,
        quantityRequired: 1,
        quantityFound: 0,
        unit: 'حبة',
        status: 'pending',
        imageUrl: '',
        note: '',
        createdAt: new Date().toISOString()
      });
      saveData();
      renderApp();
      showToast(`✓ تمت إضافة "${name}" للسلة بنجاح!`);
    });
  });
}

function renderHistoryLists() {
  const container = document.getElementById('historyListContainer');
  if (appState.historyLists.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8;font-size:14px;">لا توجد قوائم سابقة محفوظة لهذا المنزل بعد.</p>';
    return;
  }

  container.innerHTML = appState.historyLists.map(list => {
    const dateFormatted = new Date(list.createdAt).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const count = (list.items || []).length;
    const bought = (list.items || []).filter(i => i.status === 'bought').length;

    return `
      <div class="history-card" style="cursor:pointer;" data-id="${list.id}">
        <div class="history-info">
          <h5>${escapeHtml(list.name || 'قائمة سابقة')}</h5>
          <span class="history-meta">📅 ${dateFormatted} • ${count} أغراض (${bought} تم شروه)</span>
        </div>
        <div class="history-actions">
          <button class="btn btn-sm btn-primary btn-view-detail" data-id="${list.id}">
            👁️ استعراض السجل في الصفحة الرئيسية
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-view-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      viewHistoryListDetail(btn.dataset.id);
    });
  });

  container.querySelectorAll('.history-card').forEach(card => {
    card.addEventListener('click', () => {
      viewHistoryListDetail(card.dataset.id);
    });
  });
}

function saveCurrentListToHistory(notify = true) {
  if (appState.currentList.items.length === 0) return;
  const snapshot = {
    id: generateId(),
    name: appState.currentList.name,
    homeNo: appState.homeNo,
    createdAt: new Date().toISOString(),
    items: JSON.parse(JSON.stringify(appState.currentList.items))
  };
  appState.historyLists.unshift(snapshot);
  saveHistory();
  renderHistoryLists();
  renderFrequencyAnalytics();
  if (notify) showToast('💾 تم حفظ نسخة من القائمة في السجل بنجاح!');
}

// ============================================================================
// Settings Management (Clean & Simple)
// ============================================================================
function openSettingsModal() {
  document.getElementById('modalSettings').style.display = 'flex';
  document.getElementById('selectRetention').value = appState.settings.retentionDays;
  const settingHomeInput = document.getElementById('settingHomeNoInput');
  if (settingHomeInput) settingHomeInput.value = appState.homeNo || '';
}

// ============================================================================
// General Helpers
// ============================================================================
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// ============================================================================
// Interactive Image Zoom & Lightbox
// ============================================================================
let zoomState = {
  scale: 1,
  minScale: 0.5,
  maxScale: 4.5,
  translateX: 0,
  translateY: 0,
  isDragging: false,
  startX: 0,
  startY: 0
};

function openImageZoom(imgSrc, title = '') {
  if (!imgSrc) return;
  const modal = document.getElementById('modalImageZoom');
  const imgEl = document.getElementById('zoomModalImg');
  const titleEl = document.getElementById('zoomModalTitle');
  
  if (!modal || !imgEl) return;

  const safeSrc = (typeof imgSrc === 'string' && imgSrc.startsWith('data:'))
    ? imgSrc
    : encodeURI(decodeURI(imgSrc));

  imgEl.style.opacity = '0';
  imgEl.style.transition = 'opacity 0.2s ease';
  imgEl.onload = () => {
    imgEl.style.opacity = '1';
  };
  imgEl.onerror = function() {
    this.onerror = null;
    this.src = '/logo.png';
    this.style.opacity = '1';
  };
  imgEl.src = safeSrc;

  if (titleEl) {
    titleEl.textContent = title ? `🔍 ${title}` : (appState.lang === 'ar' ? 'معاينة الغرض' : 'Item Photo Preview');
  }

  // Reset zoom state to default 100%
  resetImageZoom();

  modal.style.display = 'flex';
}

function closeImageZoom() {
  const modal = document.getElementById('modalImageZoom');
  const imgEl = document.getElementById('zoomModalImg');
  if (modal) modal.style.display = 'none';
  if (imgEl) {
    imgEl.src = '';
    imgEl.style.opacity = '0';
  }
}

function updateZoomTransform() {
  const stage = document.getElementById('zoomStage');
  const label = document.getElementById('zoomScaleLabel');
  if (stage) {
    stage.style.transform = `translate(${zoomState.translateX}px, ${zoomState.translateY}px) scale(${zoomState.scale})`;
  }
  if (label) {
    label.textContent = `${Math.round(zoomState.scale * 100)}%`;
  }
}

function setZoomScale(newScale) {
  zoomState.scale = Math.min(zoomState.maxScale, Math.max(zoomState.minScale, newScale));
  if (zoomState.scale === 1) {
    zoomState.translateX = 0;
    zoomState.translateY = 0;
  }
  updateZoomTransform();
}

function resetImageZoom() {
  zoomState.scale = 1;
  zoomState.translateX = 0;
  zoomState.translateY = 0;
  zoomState.isDragging = false;
  updateZoomTransform();
}

function applyLanguage(lang) {
  const t = i18n[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // App Brand
  const elAppTitle = document.getElementById('appTitle');
  if (elAppTitle) elAppTitle.innerHTML = lang === 'ar' ? `مونو كارت <span class="brand-badge">MonoCart</span>` : `MonoCart <span class="brand-badge">Smart Cart</span>`;
  
  const elAppTagline = document.getElementById('appTagline');
  if (elAppTagline) elAppTagline.textContent = t.appTagline;

  const elBtnCompile = document.querySelector('#btnCompile .btn-label');
  if (elBtnCompile) elBtnCompile.textContent = t.compileBtn;

  const elBtnHistory = document.querySelector('#btnHistory .btn-label');
  if (elBtnHistory) elBtnHistory.textContent = t.historyBtn;

  const elBtnSettings = document.querySelector('#btnSettings .btn-label');
  if (elBtnSettings) elBtnSettings.textContent = t.settingsBtn;

  const elWaNav = document.getElementById('waNavLabel');
  if (elWaNav) elWaNav.textContent = t.waNavLabel;

  const elLangLabel = document.getElementById('langLabel');
  if (elLangLabel) elLangLabel.textContent = t.langToggle;

  const elThemeLabel = document.getElementById('themeLabel');
  if (elThemeLabel) elThemeLabel.textContent = appState.theme === 'dark' ? t.themeLight : t.themeDark;

  if (appState.homeNo) {
    const elActiveHome = document.getElementById('activeHomeLabel');
    if (elActiveHome) elActiveHome.textContent = `${t.homePrefix}${appState.homeNo}`;
    const elBtnSwitchHome = document.getElementById('btnSwitchHome');
    if (elBtnSwitchHome) elBtnSwitchHome.textContent = t.switchHome;
    const elHomeMeta = document.getElementById('homeMetaPill');
    if (elHomeMeta) elHomeMeta.textContent = `🏡 ${t.homePrefix}${appState.homeNo}`;
  }

  // Role buttons
  const elRevTitle = document.querySelector('#btnRoleReviewer .role-title');
  if (elRevTitle) elRevTitle.textContent = t.roleReviewer;
  const elRevHint = document.querySelector('#btnRoleReviewer .role-hint');
  if (elRevHint) elRevHint.textContent = t.roleReviewerHint;

  const elShopTitle = document.querySelector('#btnRoleShopper .role-title');
  if (elShopTitle) elShopTitle.textContent = t.roleShopper;
  const elShopHint = document.querySelector('#btnRoleShopper .role-hint');
  if (elShopHint) elShopHint.textContent = t.roleShopperHint;

  const elBtnNewList = document.querySelector('#btnCreateNewList span');
  if (elBtnNewList) elBtnNewList.textContent = t.btnNewList;

  const elBtnFinish = document.querySelector('#btnFinishShopping span');
  if (elBtnFinish) elBtnFinish.textContent = t.btnFinishShopping;

  const elRolePill = document.getElementById('activeRolePill');
  if (elRolePill) {
    elRolePill.textContent = appState.userRole === 'shopper' ? `🛒 ${t.roleShopper}` : `📝 ${t.roleReviewer}`;
  }

  const elSubtitle = document.getElementById('listSubtitle');
  if (elSubtitle) elSubtitle.textContent = t.listSubtitle;

  const elCompleted = document.querySelector('.progress-sub');
  if (elCompleted) elCompleted.textContent = t.completedLabel;

  // Stat Labels
  const statMappings = [
    { id: 'statTotal', label: t.totalItems },
    { id: 'statBought', label: t.boughtItems },
    { id: 'statPartial', label: t.partialItems },
    { id: 'statSubstitute', label: t.substituteItems },
    { id: 'statMissing', label: t.missingItems },
    { id: 'statRemaining', label: t.pendingItems }
  ];
  statMappings.forEach(m => {
    const el = document.getElementById(m.id);
    if (el && el.parentElement) {
      const lbl = el.parentElement.querySelector('.stat-lbl');
      if (lbl) lbl.textContent = m.label;
    }
  });

  // Creation panel tabs
  const tabQuick = document.querySelector('#tabQuickAdd span');
  if (tabQuick) tabQuick.textContent = t.tabQuickAdd;
  const tabBatch = document.querySelector('#tabBatchImages span');
  if (tabBatch) tabBatch.textContent = t.tabBatchImages;
  const tabDemo = document.querySelector('#tabLoadDemo span');
  if (tabDemo) tabDemo.textContent = t.tabLoadDemo;

  // Creation panel form
  const inputName = document.getElementById('inputItemName');
  if (inputName) inputName.placeholder = t.inputItemNamePlaceholder;
  const inputQty = document.getElementById('inputItemQtyNum');
  if (inputQty) inputQty.placeholder = t.inputItemQtyNumPlaceholder;
  const inputUnit = document.getElementById('inputItemUnit');
  if (inputUnit) inputUnit.placeholder = t.inputItemUnitPlaceholder;
  const inputNote = document.getElementById('inputItemNote');
  if (inputNote) inputNote.placeholder = t.inputItemNotePlaceholder;

  const attachPhotoLabel = document.querySelector('.btn-attach-photo span');
  if (attachPhotoLabel) attachPhotoLabel.textContent = t.btnAttachPhoto;
  const attachCameraLabel = document.querySelector('#btnLaunchCameraSingle span');
  if (attachCameraLabel) attachCameraLabel.textContent = t.btnInstantCamera;
  const addItemSubmit = document.querySelector('#btnAddItemSubmit span');
  if (addItemSubmit) addItemSubmit.textContent = t.btnAddItemSubmit;

  // Dropzone
  const dzTitle = document.querySelector('.dropzone-title');
  if (dzTitle) dzTitle.textContent = t.dropzoneTitle;
  const dzSub = document.querySelector('.dropzone-subtitle');
  if (dzSub) dzSub.textContent = t.dropzoneSubtitle;
  const dzBtn = document.querySelector('#batchDropzone .btn');
  if (dzBtn) dzBtn.textContent = t.dropzoneBrowseBtn;

  // Demo box
  const demoH4 = document.querySelector('.demo-info h4');
  if (demoH4) demoH4.textContent = t.demoCardTitle;
  const demoP = document.querySelector('.demo-info p');
  if (demoP) demoP.textContent = t.demoCardDesc;
  const btnLoadDemo = document.getElementById('btnLoadDemoItems');
  if (btnLoadDemo) btnLoadDemo.textContent = t.btnLoadDemoItems;

  // Filter tabs
  const filterMappings = [
    { filter: 'all', label: t.allTab },
    { filter: 'pending', label: t.pendingTab },
    { filter: 'bought', label: t.boughtTab },
    { filter: 'partial', label: t.partialTab },
    { filter: 'substitute', label: t.substituteTab },
    { filter: 'missing', label: t.missingTab }
  ];
  filterMappings.forEach(f => {
    const btn = document.querySelector(`.filter-btn[data-filter="${f.filter}"] span`);
    if (btn) btn.textContent = f.label;
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;
  const btnClearList = document.getElementById('btnClearList');
  if (btnClearList) btnClearList.textContent = t.clearAll;

  // Empty state
  const emptyH3 = document.querySelector('#emptyState h3');
  if (emptyH3) emptyH3.textContent = t.emptyTitle;
  const emptyP = document.querySelector('#emptyState p');
  if (emptyP) emptyP.textContent = t.emptySubtitle;

  // Home Login / Register Modal
  const tabLoginText = document.getElementById('tabAuthLoginText');
  if (tabLoginText) tabLoginText.textContent = t.tabAuthLogin;
  const tabRegText = document.getElementById('tabAuthRegisterText');
  if (tabRegText) tabRegText.textContent = t.tabAuthRegister;

  const lblHomeLogin = document.getElementById('lblHomeLogin');
  if (lblHomeLogin) lblHomeLogin.textContent = t.lblHomeLogin;
  const lblHomeRegister = document.getElementById('lblHomeRegister');
  if (lblHomeRegister) lblHomeRegister.textContent = t.lblHomeRegister;

  const inputHomeNo = document.getElementById('inputHomeNo');
  if (inputHomeNo) inputHomeNo.placeholder = t.inputHomeNoPlaceholder;
  const inputNewHomeNo = document.getElementById('inputNewHomeNo');
  if (inputNewHomeNo) inputNewHomeNo.placeholder = t.inputNewHomeNoPlaceholder;

  const lblWa = document.getElementById('lblWaSupport');
  if (lblWa) lblWa.textContent = t.waSupportTitle;
  const waSub = document.querySelector('.wa-status-text');
  if (waSub) waSub.textContent = t.waSupportSub;
}

function toggleLanguage() {
  appState.lang = appState.lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('monocart_lang', appState.lang);
  applyLanguage(appState.lang);
  renderApp();
  showToast(appState.lang === 'ar' ? '🌐 تم تحويل الواجهة إلى العربية بنجاح' : '🌐 Switched interface to English successfully');
}

function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (e) {}
}

function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      border-left: 4px solid #f97316;
      animation: slideDown 0.3s ease;
      font-family: inherit;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.addEventListener('DOMContentLoaded', initApp);
