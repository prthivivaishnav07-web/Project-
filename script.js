// Grab DOM elements from your interface
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

const titleUserTag = document.getElementById('title-user-tag');
const metricUserTag = document.getElementById('metric-user-tag');
const userGreeting = document.getElementById('user-greeting');

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayPeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Master item data setup
const database = {
  "Food 🍔": {
    "Fast Food": { "McDonald's": { "Burger Meal": 299 }, "Dominos": { "Cheese Burst Pizza": 450 } },
    "Snacks": { "Haldiram": { "Bhujia 400g": 110 }, "Lay's": { "Classic Salted": 20 } },
    "Drinks": { "Amul": { "Kool 200ml": 25 }, "Coca-Cola": { "Diet Coke 500ml": 40 } }
  },
  "Groceries 🛒": {
    "Rice": { "India Gate": { "5 kg Premium": 650 } },
    "Cooking Oil": { "Fortune": { "Sunflower 1 L": 180 } },
    "Wheat Flour": { "Aashirvaad": { "Chakki Atta 10 kg": 580 } },
    "Sugar": { "Madhur": { "Sugar 1 kg": 55 } }
  },
  "Cosmetics 💅": {
    "Shampoo": { "Dove": { "Repair 340ml": 320 } },
    "Face Wash": { "Himalaya": { "Neem 100ml": 180 } },
    "Soap": { "Lux": { "Beauty Bar 150g": 45 } },
    "Body Lotion": { "Nivea": { "Nourishing 200ml": 299 } }
  },
  "Home Appliances 🏠": {
    "Mixer Grinder": { "Prestige": { "Iris 750 W": 3499 } },
    "Electric Kettle": { "Philips": { "1.5 L Metal": 1799 } }
  },
  "Electronics ⚡": {
    "Mobiles": { 
      "Apple": { "iPhone 15 128GB": 68900, "iPhone 15 Pro": 109900 },
      "Samsung": { "Galaxy S24 Ultra": 124999, "Galaxy A36 5G": 28999 },
      "Vivo": { "V30 Pro": 41999, "T3 Ultra": 28999 }
    },
    "Laptops": {
      "HP": { "15s Core i5": 58000 },
      "Asus": { "TUF Gaming F15": 62000 }
    },
    "Smart Watches": {
      "Apple": { "Watch Series 9": 41900 },
      "Noise": { "ColorFit Pro": 2499 }
    }
  },
  "Clothing 👗": {
    "T-Shirt": { "Puma": { "Sportswear L": 999 } },
    "Jeans": { "Levi's": { "511 Slim 32": 2499 } }
  },
  "Stationery ✏️": {
    "Notebook": { "Classmate": { "Long Book": 120 } },
    "Pen": { "Reynolds": { "Trimax Gel": 50 } }
  }
};

let currentUser = localStorage.getItem('timeline_active_user') || 'Vaishnav';
let allFamilyLogs = JSON.parse(localStorage.getItem('timeline_shared_database')) || [];

function switchUser(newUser) {
  currentUser = newUser;
  localStorage.setItem('timeline_active_user', newUser);
  updateUserInterfaceTags();
  populateMainCategories();
  renderDashboardUI();
}

function updateUserInterfaceTags() {
  document.querySelectorAll('.user-btn').forEach(btn => {
    if (btn.id === `btn-${currentUser}`) {
      btn.style.background = '#3b82f6';
      btn.style.color = '#ffffff';
    } else {
      btn.style.background = '#1e293b';
      btn.style.color = '#94a3b8';
    }
  });

  if (currentUser === 'Mom') {
    if (userGreeting) { userGreeting.innerText = "❤️ Welcome back, Mom!"; userGreeting.style.color = '#f43f5e'; }
  } else if (currentUser === 'Dad') {
    if (userGreeting) { userGreeting.innerText = "💼 Good Day, Dad!"; userGreeting.style.color = '#10b981'; }
  } else {
    if (userGreeting) { userGreeting.innerText = "👋 Hello Vaishnav!"; userGreeting.style.color = '#3b82f6'; }
  }

  if (titleUserTag) titleUserTag.innerText = currentUser.toUpperCase();
  if (metricUserTag) metricUserTag.innerText = currentUser.toUpperCase();
}

function populateMainCategories() {
  if (!mainCategory) return;
  mainCategory.innerHTML = '';
  
  Object.keys(database).forEach(mainCat => {
    if (currentUser === 'Mom') {
      // Mom profile only sees household items and food
      if (mainCat === "Groceries 🛒" || mainCat === "Cosmetics 💅" || mainCat === "Home Appliances 🏠" || mainCat === "Food 🍔") {
        let opt = document.createElement('option'); opt.value = mainCat; opt.innerText = mainCat; mainCategory.appendChild(opt);
      }
    } else {
      // Vaishnav and Dad see electronics, clothing, stationery, food
      if (mainCat === "Electronics ⚡" || mainCat === "Clothing 👗" || mainCat === "Stationery ✏️" || mainCat === "Food 🍔") {
        let opt = document.createElement('option'); opt.value = mainCat; opt.innerText = mainCat; mainCategory.appendChild(opt);
      }
    }
  });

  let customOpt = document.createElement('option');
  customOpt.value = "Custom / Other Deposit 💰";
  customOpt.innerText = "Custom / Other Deposit 💰";
  mainCategory.appendChild(customOpt);

  handleMainCategoryChange();
}

function handleMainCategoryChange() {
  const selectedMain = mainCategory.value;

  if (selectedMain === "Custom / Other Deposit 💰" || !database[selectedMain]) {
    if (subCategoryContainer) subCategoryContainer.style.display = 'none';
    if (brandContainer) brandContainer.style.display = 'none';
    if (modelContainer) modelContainer.style.display = 'none';
    if (customTextContainer) customTextContainer.style.display = 'block';
    amount.value = ''; category.value = 'Salary';
  } else {
    if (subCategoryContainer) subCategoryContainer.style.display = 'block';
    if (brandContainer) brandContainer.style.display = 'block';
    if (modelContainer) modelContainer.style.display = 'block';
    if (customTextContainer) customTextContainer.style.display = 'none';
    category.value = 'Expense';
    populateSubCategories();
  }
  updateButtonMode();
}

function populateSubCategories() {
  const selectedMain = mainCategory.value;
  if (!subCategory) return;
  subCategory.innerHTML = '';
  if (!database[selectedMain]) return;
  
  Object.keys(database[selectedMain]).forEach(group => {
    let opt = document.createElement('option'); opt.value = group; opt.innerText = group;
    subCategory.appendChild(opt);
  });
  populateBrands();
}

function populateBrands() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  if (!itemBrand) return;
  itemBrand.innerHTML = '';
  if (!database[selectedMain] || !database[selectedMain][selectedSub]) return;
  
  Object.keys(database[selectedMain][selectedSub]).forEach(brand => {
    let opt = document.createElement('option'); opt.value = brand; opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  populateModels();
}

function populateModels() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  if (!itemModel) return;
  itemModel.innerHTML = '';
  if (!database[selectedMain] || !database[selectedMain][selectedSub] || !database[database[selectedMain][selectedSub][selectedBrand]]) {
    if (!database[selectedMain]?.[selectedSub]?.[selectedBrand]) return;
  }
  
  Object.keys(database[selectedMain][selectedSub][selectedBrand]).forEach(model => {
    let opt = document.createElement('option'); opt.value = model; opt.innerText = model;
    itemModel.appendChild(opt);
  });
  autoUpdatePrice();
}

function autoUpdatePrice() {
  const selectedMain = mainCategory.value; const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value; const selectedModel = itemModel.value;
  
  if (database[selectedMain]?.[selectedSub]?.[selectedBrand]?.[selectedModel] !== undefined) {
    amount.value = database[selectedMain][selectedSub][selectedBrand][selectedModel];
  }
}

function updateButtonMode() {
  if (!submitBtn) return;
  if (category.value === 'Salary') { submitBtn.style.background = '#10b981'; submitBtn.innerText = 'DEPOSIT FUNDS'; }
  else { submitBtn.style.background = '#3b82f6'; submitBtn.innerText = 'TRANSACTION'; }
}

function toggleSidebar(open) { if (sidebar) sidebar.style.right = open ? '0px' : '-320px'; }

function recalculateDashboardMetrics() {
  const startingBalance = 10000; let totalDeposits = 0; let totalExpenses = 0;
  const userFilteredTransactions = allFamilyLogs.filter(t => t.user === currentUser);

  userFilteredTransactions.forEach(t => {
    let val = parseFloat(t.amount);
    if (!isNaN(val)) { if (val > 0) totalDeposits += val; else totalExpenses += Math.abs(val); }
  });

  const netWorth = startingBalance + totalDeposits - totalExpenses;
  if (netWorthDisplay) netWorthDisplay.innerText = `${netWorth.toFixed(2)}`;
  const totalPool = startingBalance + totalDeposits;
  const savingsRate = totalPool > 0 ? ((netWorth / totalPool) * 100) : 0;
  if (savingsRateDisplay) savingsRateDisplay.innerText = `${Math.max(0, Math.min(100, savingsRate)).toFixed(0)}%`;
  if (burnRateDisplay) burnRateDisplay.innerText = `₹${(totalExpenses / 30).toFixed(2)}/day`;
}

function renderYearlyMap() {
  if (!yearGrid) return; yearGrid.innerHTML = ''; let monthlySpend = Array(12).fill(0);
  const userFilteredTransactions = allFamilyLogs.filter(t => t.user === currentUser);
  
  userFilteredTransactions.forEach(t => {
    let val = parseFloat(t.amount); if (val < 0 && !isNaN(val)) monthlySpend[t.month] += Math.abs(val);
  });
  monthsList.forEach((month, index) => {
    const spend = monthlySpend[index]; let cellBg = '#1e293b'; let textColor = '#64748b';
    if (spend > 0 && spend <= 5000) { cellBg = '#064e3b'; textColor = '#34d399'; }
    else if (spend > 5000) { cellBg = '#2563eb'; textColor = '#ffffff'; }
    const monthBlock = document.createElement('div');
    monthBlock.style.background = cellBg; monthBlock.style.padding = '10px 4px'; monthBlock.style.borderRadius = '8px';
    monthBlock.style.fontSize = '12px'; monthBlock.style.color = textColor; monthBlock.style.border = '1px solid #334155';
    monthBlock.innerHTML = `<div>${month}</div><div style="font-size:9.5px; margin-top:4px;">₹${(spend/1000).toFixed(1)}k</div>`;
    yearGrid.appendChild(monthBlock);
  });
}

function renderDiurnalMap() {
  if (!diurnalGrid) return; diurnalGrid.innerHTML = ''; let periodSpend = { 'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0 };
  const userFilteredTransactions = allFamilyLogs.filter(t => t.user === currentUser);

  userFilteredTransactions.forEach(t => {
    let val = parseFloat(t.amount); if (val < 0 && !isNaN(val)) periodSpend[t.period] += Math.abs(val);
  });
  dayPeriods.forEach(period => {
    const amt = periodSpend[period]; let barColor = '#475569'; if (amt > 0) barColor = '#ef4444';
    const blockRow = document.createElement('div');
    blockRow.style.display = 'flex'; blockRow.style.alignItems = 'center'; blockRow.style.justifyContent = 'space-between';
    blockRow.style.backgroundColor = '#0f1115'; blockRow.style.padding = '10px 12px'; blockRow.style.borderRadius = '8px';
    blockRow.style.fontSize = '12px'; blockRow.style.border = '1px solid #232d3d';
    blockRow.innerHTML = `
      <div style="width: 85px; font-weight:600; color:#cbd5e1;">${period}</div>
      <div style="flex:1; margin: 0 14px; background: #1e293b; height:8px; border-radius:4px; overflow:hidden;">
         <div style="width: ${Math.min(100, (amt/25000)*100)}%; background: ${barColor}; height:100%;"></div>
      </div>
      <div style="font-weight:700; color:#64748b;">₹${amt.toFixed(0)}</div>`;
    diurnalGrid.appendChild(blockRow);
  });
}

function saveTransaction(e) {
  e.preventDefault(); let parsedAmount = parseFloat(amount.value); if (isNaN(parsedAmount) || parsedAmount <= 0) return;
  let finalAmount = category.value !== 'Salary' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);
  let displayTitle = ''; const selectedMain = mainCategory.value;

  if (selectedMain === "Custom / Other Deposit 💰") { displayTitle = customDesc.value.trim() || 'CUSTOM'; }
  else { displayTitle = `${subCategory.value} - ${itemBrand.value || 'Item'} (${itemModel.value || 'Std'})`; }

  const payload = {
    id: Date.now(), text: displayTitle.toUpperCase(), amount: finalAmount,
    mainCat: selectedMain, month: parseInt(timelineMonth.value), period: timelinePeriod.value, user: currentUser
  };

  allFamilyLogs.unshift(payload);
  localStorage.setItem('timeline_shared_database', JSON.stringify(allFamilyLogs));
  
  if (customDesc) customDesc.value = ''; 
  amount.value = ''; 
  renderDashboardUI();
}

function removeTransaction(id) {
  allFamilyLogs = allFamilyLogs.filter(t => t.id !== id);
  localStorage.setItem('timeline_shared_database', JSON.stringify(allFamilyLogs));
  renderDashboardUI();
}

function resetData() {
  if (confirm(`Reset wallet ledger records entirely for ${currentUser}?`)) {
    allFamilyLogs = allFamilyLogs.filter(t => t.user !== currentUser);
    localStorage.setItem('timeline_shared_database', JSON.stringify(allFamilyLogs));
    renderDashboardUI();
  }
}

function renderDashboardUI() {
  if (list) list.innerHTML = '';
  allFamilyLogs.forEach(addTransactionDOM);
  recalculateDashboardMetrics(); renderYearlyMap(); renderDiurnalMap();
}

function addTransactionDOM(t) {
  if (!list) return; const item = document.createElement('li'); const isExpense = t.amount < 0;
  let highlightColor = '#3b82f6'; if (t.amount > 0) highlightColor = '#10b981';

  let tagColor = '#3b82f6'; 
  if (t.user === 'Mom') tagColor = '#f43f5e'; 
  if (t.user === 'Dad') tagColor = '#10b981'; 

  item.style.padding = "10px"; item.style.margin = "6px 0"; item.style.borderRadius = "8px";
  item.style.backgroundColor = "#1e293b"; item.style.display = "flex";
  item.style.justifyContent = "space-between"; item.style.alignItems = "center";
  item.style.borderLeft = `6px solid ${highlightColor}`;

  item.innerHTML = `
    <div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="background: ${tagColor}; color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">${t.user}</span>
        <div style="font-weight:600; font-size:12px; color:#ffffff;">${t.text}</div>
      </div>
      <div style="font-size:10px; color:#94a3b8; margin-top:4px;">${monthsList[t.month]} | ${t.period}</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${isExpense ? '#fb7185' : '#10b981'}; font-weight: 700; font-size:12px;">₹${Math.abs(t.amount)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#f43f5e; cursor:pointer; font-weight:bold;">✕</button>
    </div>`;
  list.appendChild(item);
}

if (mainCategory) mainCategory.addEventListener('change', handleMainCategoryChange);
if (subCategory) subCategory.addEventListener('change', populateBrands);
if (itemBrand) itemBrand.addEventListener('change', populateModels);
if (itemModel) itemModel.addEventListener('change', autoUpdatePrice);
if (category) category.addEventListener('change', updateButtonMode);
if (form) form.addEventListener('submit', saveTransaction);

// Boot sequence initialization load
switchUser(currentUser);
