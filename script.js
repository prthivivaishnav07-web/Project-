// Global Application Target Layout DOM Elements
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
const customTextContainer = document.getElementById('custom-text-container');
const customDesc = document.getElementById('custom-desc');

const submitBtn = document.getElementById('form-submit-btn');
const timelineMonth = document.getElementById('timeline-month');
const timelinePeriod = document.getElementById('timeline-period');
const sidebar = document.getElementById('history-sidebar');
const yearGrid = document.getElementById('year-contribution-grid');
const diurnalGrid = document.getElementById('diurnal-heatmap-grid');

// Dynamic Multi-User UI Label Tag Selectors
const titleUserTag = document.getElementById('title-user-tag');
const metricUserTag = document.getElementById('metric-user-tag');
const sidebarUserTag = document.getElementById('sidebar-user-tag');
const userGreeting = document.getElementById('user-greeting');

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayPeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Comprehensive Storage Schema Object 
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
  "SNACKS & FAST FOOD 🍔": {
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

// Multi-Wallet Session Configuration Variables
let currentUser = localStorage.getItem('timeline_active_user') || 'Vaishnav';
let transactions = [];

// Core Switching Engine for Profiles
function switchUser(newUser) {
  currentUser = newUser;
  localStorage.setItem('timeline_active_user', newUser);
  
  // Fetch scoped data array matching current selected user key string
  let rawTransactions = JSON.parse(localStorage.getItem(`timeline_transactions_${currentUser}`)) || [];
  transactions = rawTransactions.filter(t => t && typeof t.amount === 'number' && !isNaN(t.amount));
  localStorage.setItem(`timeline_transactions_${currentUser}`, JSON.stringify(transactions));

  updateUserInterfaceTags();
  init();
}

// Visual layout updating for selected active profile context tags
function updateUserInterfaceTags() {
  // Update button active focus styling states
  document.querySelectorAll('.user-btn').forEach(btn => {
    if (btn.id === `btn-${currentUser}`) {
      btn.style.background = '#3b82f6';
      btn.style.color = '#ffffff';
      btn.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';
    } else {
      btn.style.background = '#1e293b';
      btn.style.color = '#94a3b8';
      btn.style.boxShadow = 'none';
    }
  });

  // Assign user profile greeting text nodes dynamically
  if (currentUser === 'Vaishnav') {
    userGreeting.innerText = "👋 Hello Vaishnav! Monitoring operations.";
    userGreeting.style.color = '#3b82f6';
  } else if (currentUser === 'Mom') {
    userGreeting.innerText = "❤️ Welcome back, Mom! Manage your balances.";
    userGreeting.style.color = '#f43f5e';
  } else if (currentUser === 'Dad') {
    userGreeting.innerText = "💼 Good Day, Dad! Overview of ledger records.";
    userGreeting.style.color = '#10b981';
  }

  // Bind tags into standard element headers
  if (titleUserTag) titleUserTag.innerText = currentUser.toUpperCase();
  if (metricUserTag) metricUserTag.innerText = currentUser.toUpperCase();
  if (sidebarUserTag) sidebarUserTag.innerText = currentUser.toUpperCase();
}

function handleMainCategoryChange() {
  const selectedMain = mainCategory.value;

  if (selectedMain === "Custom / Other Deposit 💰" || !database[selectedMain]) {
    subCategoryContainer.style.display = 'none';
    brandContainer.style.display = 'none';
    modelContainer.style.display = 'none';
    customTextContainer.style.display = 'block';
    amount.value = '';
    category.value = 'Salary';
  } else {
    subCategoryContainer.style.display = 'block';
    brandContainer.style.display = 'block';
    modelContainer.style.display = 'block';
    customTextContainer.style.display = 'none';
    category.value = 'Expense';
    populateSubCategories();
  }
  updateButtonMode();
}

function populateSubCategories() {
  const selectedMain = mainCategory.value;
  subCategory.innerHTML = '';
  if (!database[selectedMain]) return;

  const groups = Object.keys(database[selectedMain]);
  groups.forEach(group => {
    let opt = document.createElement('option');
    opt.value = group; opt.innerText = group;
    subCategory.appendChild(opt);
  });
  populateBrands();
}

function populateBrands() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  itemBrand.innerHTML = '';
  if (!database[selectedMain] || !database[selectedMain][selectedSub]) return;

  const brands = Object.keys(database[selectedMain][selectedSub]);
  brands.forEach(brand => {
    let opt = document.createElement('option');
    opt.value = brand; opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  populateModels();
}

function populateModels() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  itemModel.innerHTML = '';
  if (!database[selectedMain] || !database[selectedMain][selectedSub] || !database[selectedMain][selectedSub][selectedBrand]) return;

  const models = Object.keys(database[selectedMain][selectedSub][selectedBrand]);
  modelContainer.style.display = (models.length === 1 && models[0] === 'Standard') ? 'none' : 'block';

  models.forEach(model => {
    let opt = document.createElement('option');
    opt.value = model; opt.innerText = model;
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
    submitBtn.style.background = '#3b82f6';
    submitBtn.innerText = 'TRANSACTION';
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
    let val = parseFloat(t.amount);
    if (!isNaN(val)) {
      if (val > 0) totalDeposits += val;
      else totalExpenses += Math.abs(val);
    }
  });

  const netWorth = startingBalance + totalDeposits - totalExpenses;
  if (netWorthDisplay) netWorthDisplay.innerText = `${netWorth.toFixed(2)}`;

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
    let val = parseFloat(t.amount);
    if (val < 0 && !isNaN(val)) {
      monthlySpend[t.month] += Math.abs(val);
    }
  });

  monthsList.forEach((month, index) => {
    const spend = monthlySpend[index];
    let cellBg = '#1e293b'; let textColor = '#64748b';
    
    if (spend > 0 && spend <= 5000) { cellBg = '#064e3b'; textColor = '#34d399'; }
    else if (spend > 5000 && spend <= 20000) { cellBg = '#0f766e'; textColor = '#2dd4bf'; }
    else if (spend > 20000) { cellBg = '#2563eb'; textColor = '#ffffff'; }

    const monthBlock = document.createElement('div');
    monthBlock.style.background = cellBg; monthBlock.style.padding = '10px 4px';
    monthBlock.style.borderRadius = '8px'; monthBlock.style.fontSize = '12px';
    monthBlock.style.fontWeight = '600'; monthBlock.style.color = textColor;
    monthBlock.style.border = '1px solid #334155';
    monthBlock.innerHTML = `<div>${month}</div><div style="font-size:9.5px; font-weight:700; margin-top:4px;">₹${(spend/1000).toFixed(1)}k</div>`;
    yearGrid.appendChild(monthBlock);
  });
}

function renderDiurnalMap() {
  if (!diurnalGrid) return;
  diurnalGrid.innerHTML = '';
  let periodSpend = { 'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0 };

  transactions.forEach(t => {
    let val = parseFloat(t.amount);
    if (val < 0 && !isNaN(val) && periodSpend[t.period] !== undefined) {
      periodSpend[t.period] += Math.abs(val);
    }
  });

  dayPeriods.forEach(period => {
    const amt = periodSpend[period];
    let barColor = '#475569';
    if (amt > 0 && amt <= 2000) barColor = '#f59e0b';
    else if (amt > 2000 && amt <= 10000) barColor = '#d97706';
    else if (amt > 10000) barColor = '#ef4444';

    const blockRow = document.createElement('div');
    blockRow.style.display = 'flex'; blockRow.style.alignItems = 'center';
    blockRow.style.justifyContent = 'space-between'; blockRow.style.backgroundColor = '#0f1115';
    blockRow.style.padding = '10px 12px'; blockRow.style.borderRadius = '8px';
    blockRow.style.fontSize = '12px'; blockRow.style.border = '1px solid #232d3d';

    blockRow.innerHTML = `
      <div style="width: 85px; font-weight:600; color:#cbd5e1;">${period}</div>
      <div style="flex:1; margin: 0 14px; background: #1e293b; height:8px; border-radius:4px; overflow:hidden; border: 1px solid #334155;">
         <div style="width: ${Math.min(100, (amt/25000)*100)}%; background: ${barColor}; height:100%;"></div>
      </div>
      <div style="font-weight:700; color:${amt > 0 ? barColor : '#64748b'};">₹${amt.toFixed(0)}</div>`;
    diurnalGrid.appendChild(blockRow);
  });
}

function saveTransaction(e) {
  e.preventDefault();
  let parsedAmount = parseFloat(amount.value);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return;

  let finalAmount = category.value !== 'Salary' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);
  let displayTitle = '';
  const selectedMain = mainCategory.value;

  if (selectedMain === "Custom / Other Deposit 💰") {
    displayTitle = customDesc.value.trim() || 'CUSTOM TRANSACTION';
  } else {
    const brandVal = itemBrand.value || 'Product';
    const sizeVal = itemModel.value || 'Standard';
    displayTitle = (sizeVal && sizeVal !== 'Standard') ? `${brandVal} (${sizeVal})` : `${brandVal}`;
  }

  transactions.push({
    id: Date.now(),
    text: displayTitle.toUpperCase(),
    amount: finalAmount,
    mainCat: selectedMain,
    month: parseInt(timelineMonth.value),
    period: timelinePeriod.value
  });

  updateLocalStorage();
  init();
  customDesc.value = '';
  amount.value = '';
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function resetData() {
  if (confirm(`Clear all timeline wallet history for ${currentUser}?`)) {
    transactions = [];
    updateLocalStorage();
    init();
  }
}

function updateLocalStorage() {
  localStorage.setItem(`timeline_transactions_${currentUser}`, JSON.stringify(transactions));
}

function init() {
  if (list) list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  recalculateDashboardMetrics();
  renderYearlyMap();
  renderDiurnalMap();
}

function addTransactionDOM(t) {
  if (!list) return;
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  
  let highlightColor = '#3b82f6';
  if (t.mainCat === "Custom / Other Deposit 💰" || t.amount > 0) highlightColor = '#10b981';
  else if (t.mainCat === "SNACKS & FAST FOOD 🍔") highlightColor = '#f59e0b';

  item.style.padding = "10px"; item.style.margin = "6px 0"; item.style.borderRadius = "8px";
  item.style.backgroundColor = "#1e293b"; item.style.color = "#cbd5e1";
  item.style.display = "flex"; item.style.justifyContent = "space-between"; item.style.alignItems = "center";
  item.style.border = "1px solid #334155"; item.style.borderLeft = `6px solid ${highlightColor}`;

  item.innerHTML = `
    <div>
      <div style="font-weight:600; font-size:12px; color:#ffffff;">${t.text}</div>
      <div style="font-size:10px; color:#94a3b8; margin-top:2px;">${monthsList[t.month]} | ${t.period}</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${isExpense ? '#fb7185' : '#10b981'}; font-weight: 700; font-size:12px;">${isExpense ? '-' : '+'}.₹${Math.abs(t.amount)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#f43f5e; cursor:pointer; font-weight:bold; font-size:12px;">✕</button>
    </div>`;
  list.appendChild(item);
}

// Event Linkages
mainCategory.addEventListener('change', handleMainCategoryChange);
subCategory.addEventListener('change', populateBrands);
itemBrand.addEventListener('change', populateModels);
itemModel.addEventListener('change', autoUpdatePrice);
category.addEventListener('change', updateButtonMode);
form.addEventListener('submit', saveTransaction);

// Trigger Initial Dynamic Active Session Configuration
switchUser(currentUser);
