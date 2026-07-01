// DOM Element Nodes
const netWorthDisplay = document.getElementById('net-worth');
const savingsRateDisplay = document.getElementById('savings-rate');
const burnRateDisplay = document.getElementById('burn-rate');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');

const mainCategory = document.getElementById('main-category');
const subCategory = document.getElementById('sub-category');
const itemBrand = document.getElementById('item-brand');
const itemModel = document.getElementById('item-model');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

const subCategoryContainer = document.getElementById('sub-category-container');
const brandContainer = document.getElementById('brand-container');
const modelContainer = document.getElementById('model-container');
const subCategoryLabel = document.getElementById('sub-category-label');
const brandLabel = document.getElementById('brand-label');
const modelLabel = document.getElementById('model-label');
const customTextContainer = document.getElementById('custom-text-container');
const customDesc = document.getElementById('custom-desc');

const submitBtn = document.getElementById('form-submit-btn');
const timelineMonth = document.getElementById('timeline-month');
const timelinePeriod = document.getElementById('timeline-period');
const sidebar = document.getElementById('history-sidebar');
const yearGrid = document.getElementById('year-contribution-grid');
const diurnalGrid = document.getElementById('diurnal-heatmap-grid');

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayPeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Fixed Database Object - Key strings match HTML values exactly
const database = {
  "ELECTRONICS ⚡": {
    "Mobiles 📱": {
      "Apple": { "iPhone 14": 54900, "iPhone 15": 68900, "iPhone 16": 79900 },
      "Samsung": { "Galaxy S24": 74999, "Galaxy S25": 82300 },
      "OPPO": { "A3 Pro 5G": 17999, "Reno 12": 32500 }
    },
    "Laptops 💻": {
      "Apple": { "MacBook Air M2": 84400, "MacBook Air M3": 104900 },
      "HP": { "Victus 15": 62000, "Pavilion 14": 68500 },
      "Dell": { "Inspiron 15": 54000 }
    }
  },
  "FOOD & DINING 🍔": {
    "Pizza Menu 🍕": {
      "Margherita Pizza": { "Small": 199, "Medium": 299, "Large": 449 },
      "Farmhouse Pizza": { "Small": 299, "Medium": 449, "Large": 649 }
    },
    "Burgers Menu 🍔": {
      "Crispy Veg Burger": { "Standard": 129 },
      "Cheese Burger": { "Standard": 159 },
      "Chicken Maharaja": { "Standard": 299 }
    },
    "Wraps & Rolls 🌯": {
      "Veg Kathi Roll": { "Standard": 120 },
      "Chicken Tikka Wrap": { "Standard": 180 }
    },
    "Sandwiches 🥪": {
      "Club Sandwich": { "Standard": 140 },
      "Grilled Cheese": { "Standard": 110 }
    },
    "Fries & Sides 🍟": {
      "Classic Fries": { "Regular": 99, "Large": 149 },
      "Garlic Breadsticks": { "Standard": 139 }
    },
    "Momos 🥟": {
      "Steamed Veg Momos": { "Standard": 100 },
      "Fried Chicken Momos": { "Standard": 140 }
    },
    "Chinese 🥢": {
      "Veg Hakka Noodles": { "Standard": 160 },
      "Manchurian Gravy": { "Standard": 180 }
    },
    "Beverages 🥤": {
      "Cold Coffee": { "Standard": 90 },
      "Fresh Lime Soda": { "Standard": 60 }
    },
    "KFC Menu 🍗": {
      "Chicken Bucket (4pc)": { "Standard": 449 },
      "Zinger Burger": { "Standard": 219 }
    }
  }
};

let transactions = JSON.parse(localStorage.getItem('timeline_transactions')) || [];

// Cascade Control Engine
function handleMainCategoryChange() {
  const selectedMain = mainCategory.value;

  if (selectedMain.startsWith('Custom')) {
    subCategoryContainer.style.display = 'none';
    brandContainer.style.display = 'none';
    modelContainer.style.display = 'none';
    customTextContainer.style.display = 'block';
    amount.value = '';
    category.value = 'Salary';
  } else {
    subCategoryContainer.style.display = 'block';
    brandContainer.style.display = 'block';
    customTextContainer.style.display = 'none';
    category.value = 'Expense';

    if (selectedMain.includes('ELECTRONICS')) {
      subCategoryLabel.innerText = "ELECTRONIC ITEM TYPE";
      brandLabel.innerText = "BRAND NAME";
      modelLabel.innerText = "MODEL DESCRIPTION";
    } else {
      subCategoryLabel.innerText = "ITEM TYPE GROUP";
      brandLabel.innerText = "BRAND / SPECIFIC PRODUCT";
      modelLabel.innerText = "MODEL VARIANT / SIZE";
    }
    populateSubCategories();
  }
  updateButtonMode();
}

function populateSubCategories() {
  const selectedMain = mainCategory.value;
  if (!database[selectedMain]) return;

  subCategory.innerHTML = '';
  const subs = Object.keys(database[selectedMain]);
  
  subs.forEach(sub => {
    let opt = document.createElement('option');
    opt.value = sub;
    opt.innerText = sub;
    subCategory.appendChild(opt);
  });
  populateBrands();
}

function populateBrands() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  if (!database[selectedMain]?.[selectedSub]) return;

  itemBrand.innerHTML = '';
  const brands = Object.keys(database[selectedMain][selectedSub]);

  brands.forEach(brand => {
    let opt = document.createElement('option');
    opt.value = brand;
    opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  populateModels();
}

function populateModels() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  if (!database[selectedMain]?.[selectedSub]?.[selectedBrand]) return;

  itemModel.innerHTML = '';
  const models = Object.keys(database[selectedMain][selectedSub][selectedBrand]);

  if (models.length === 1 && models[0] === 'Standard') {
    modelContainer.style.display = 'none';
  } else {
    modelContainer.style.display = 'block';
  }

  models.forEach(model => {
    let opt = document.createElement('option');
    opt.value = model;
    opt.innerText = model;
    itemModel.appendChild(opt);
  });
  autoUpdatePrice();
}

function autoUpdatePrice() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  const selectedModel = itemModel.value;

  if (database[selectedMain]?.[selectedSub]?.[selectedBrand]?.[selectedModel] !== undefined) {
    amount.value = database[selectedMain][selectedSub][selectedBrand][selectedModel];
  }
}

function updateButtonMode() {
  if (!submitBtn) return;
  if (category.value === 'Salary') {
    submitBtn.style.background = '#10b981';
    submitBtn.innerText = 'DEPOSIT FUNDS';
  } else {
    submitBtn.style.background = '#ef4444';
    submitBtn.innerText = 'SUBTRACT TRANSACTION';
  }
}

function toggleSidebar(open) {
  if (!sidebar) return;
  sidebar.style.right = open ? '0px' : '-320px';
}

function recalculateDashboardMetrics() {
  const startingBalance = 10000;
  let totalDeposits = 0;
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (t.amount > 0) totalDeposits += t.amount;
    else totalExpenses += Math.abs(t.amount);
  });

  const netWorth = startingBalance + totalDeposits - totalExpenses;
  if (netWorthDisplay) netWorthDisplay.innerText = `₹${netWorth.toFixed(2)}`;

  const totalPool = startingBalance + totalDeposits;
  const savingsRate = totalPool > 0 ? ((netWorth / totalPool) * 100) : 0;
  if (savingsRateDisplay) savingsRateDisplay.innerText = `${Math.max(0, Math.min(100, savingsRate)).toFixed(0)}%`;

  const burnRate = totalExpenses / 30;
  if (burnRateDisplay) burnRateDisplay.innerText = `₹${burnRate.toFixed(2)}/day`;
}

function renderYearlyMap() {
  if (!yearGrid) return;
  yearGrid.innerHTML = '';
  let monthlySpend = Array(12).fill(0);

  transactions.forEach(t => {
    if (t.amount < 0) monthlySpend[t.month] += Math.abs(t.amount);
  });

  monthsList.forEach((month, index) => {
    const spend = monthlySpend[index];
    let cellBg = '#333333'; let textColor = '#aaaaaa';
    
    if (spend > 0 && spend <= 5000) { cellBg = '#064e3b'; textColor = '#34d399'; }
    else if (spend > 5000 && spend <= 20000) { cellBg = '#047857'; textColor = '#a7f3d0'; }
    else if (spend > 20000) { cellBg = '#10b981'; textColor = '#ffffff'; }

    const monthBlock = document.createElement('div');
    monthBlock.style.background = cellBg; monthBlock.style.padding = '10px 4px';
    monthBlock.style.borderRadius = '6px'; monthBlock.style.fontSize = '12px';
    monthBlock.style.fontWeight = '600'; monthBlock.style.color = textColor;
    monthBlock.style.border = '1px solid #444';
    monthBlock.innerHTML = `<div>${month}</div><div style="font-size:9.5px; font-weight:700; margin-top:4px;">₹${(spend/1000).toFixed(1)}k</div>`;
    yearGrid.appendChild(monthBlock);
  });
}

function renderDiurnalMap() {
  if (!diurnalGrid) return;
  diurnalGrid.innerHTML = '';
  let periodSpend = { 'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0 };

  transactions.forEach(t => {
    if (t.amount < 0 && periodSpend[t.period] !== undefined) {
      periodSpend[t.period] += Math.abs(t.amount);
    }
  });

  dayPeriods.forEach(period => {
    const amt = periodSpend[period];
    let barColor = '#4b5563';
    if (amt > 0 && amt <= 2000) barColor = '#f59e0b';
    else if (amt > 2000 && amt <= 10000) barColor = '#ea580c';
    else if (amt > 10000) barColor = '#dc2626';

    const blockRow = document.createElement('div');
    blockRow.style.display = 'flex'; blockRow.style.alignItems = 'center';
    blockRow.style.justifyContent = 'space-between';
