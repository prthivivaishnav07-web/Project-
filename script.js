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

// Separate Database Matrix for Vaishnav/Dad vs Mom
const defaultDatabase = {
  "ELECTRONICS ⚡": {
    "Mobiles 📱": {
      "Apple": { "iPhone 14": 54900, "iPhone 15": 68900, "iPhone 16": 79900 },
      "Samsung": { "Galaxy S24": 74999, "Galaxy S25": 82300 },
      "OPPO": { "A3 Pro 5G": 17999, "Reno 12": 32500 }
    },
    "Laptops 💻": {
      "Apple": { "MacBook Air M2": 84400, "MacBook Air M3": 104900 },
      "HP": { "Victus 15": 62000, "Pavilion 14": 68500 }
    }
  },
  "SNACKS & FAST FOOD 🍔": {
    "Pizza Menu 🍕": {
      "Margherita Pizza": { "Small": 199, "Medium": 299, "Large": 449 },
      "Farmhouse Pizza": { "Small": 299, "Medium": 449, "Large": 649 }
    }
  }
};

// SPECIAL SECTIONS EXCLUSIVELY FOR MOM
const momDatabase = {
  "Groceries 🛒": {
    "Rice": { "India Gate": { "5 kg": 650 } },
    "Cooking Oil": { "Fortune": { "1 L": 180 } },
    "Wheat Flour": { "Aashirvaad": { "10 kg": 580 } },
    "Sugar": { "Madhur": { "1 kg": 55 } }
  },
  "Cosmetics 💅": {
    "Shampoo": { "Dove": { "340 ml": 320 } },
    "Face Wash": { "Himalaya": { "100 ml": 180 } },
    "Soap": { "Lux": { "150 g": 45 } },
    "Body Lotion": { "Nivea": { "200 ml": 299 } }
  },
  "Electronics ⚡": {
    "Smartphone": { "Samsung": { "Galaxy A36 5G": 28999 } },
    "Laptop": { "HP": { "15s i5 16GB": 58000 } }
  },
  "Clothing 👗": {
    "T-Shirt": { "Puma": { "L Size": 999 } },
    "Jeans": { "Levi's": { "32 Size": 2499 } }
  },
  "Stationery ✏️": {
    "Notebook": { "Classmate": { "200 Pages": 120 } },
    "Pen": { "Reynolds": { "Trimax": 50 } }
  },
  "Home Appliances 🏠": {
    "Mixer Grinder": { "Prestige": { "750 W": 3499 } },
    "Electric Kettle": { "Philips": { "1.5 L": 1799 } }
  }
};

let currentUser = localStorage.getItem('timeline_active_user') || 'Vaishnav';
let allFamilyLogs = JSON.parse(localStorage.getItem('timeline_shared_database')) || [];

// Identify which database profile to look into
function getActiveDatabase() {
  return currentUser === 'Mom' ? momDatabase : defaultDatabase;
}

function switchUser(newUser) {
  currentUser = newUser;
  localStorage.setItem('timeline_active_user', newUser);
  updateUserInterfaceTags();
  populateMainCategories(); // Redraw main options list depending on user
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

  if (currentUser === 'Vaishnav') { userGreeting.innerText = "👋 Hello Vaishnav!"; userGreeting.style.color = '#3b82f6'; }
  else if (currentUser === 'Mom') { userGreeting.innerText = "❤️ Welcome back, Mom!"; userGreeting.style.color = '#f43f5e'; }
  else if (currentUser === 'Dad') { userGreeting.innerText = "💼 Good Day, Dad!"; userGreeting.style.color = '#10b981'; }

  if (titleUserTag) titleUserTag.innerText = currentUser.toUpperCase();
  if (metricUserTag) metricUserTag.innerText = currentUser.toUpperCase();
}

function populateMainCategories() {
  const currentDb = getActiveDatabase();
  mainCategory.innerHTML = '';
  
  Object.keys(currentDb).forEach(mainCat => {
    let opt = document.createElement('option');
    opt.value = mainCat;
    opt.innerText = mainCat;
    mainCategory.appendChild(opt);
  });

  // Always keep custom option at the bottom
  let customOpt = document.createElement('option');
  customOpt.value = "Custom / Other Deposit 💰";
  customOpt.innerText = "Custom / Other Deposit 💰";
  mainCategory.appendChild(customOpt);

  handleMainCategoryChange();
}

function handleMainCategoryChange() {
  const selectedMain = mainCategory.value;
  const currentDb = getActiveDatabase();

  if (selectedMain === "Custom / Other Deposit 💰" || !currentDb[selectedMain]) {
    subCategoryContainer.style.display = 'none'; brandContainer.style.display = 'none'; modelContainer.style.display = 'none';
    customTextContainer.style.display = 'block'; amount.value = ''; category.value = 'Salary';
  } else {
    subCategoryContainer.style.display = 'block'; brandContainer.style.display = 'block'; modelContainer.style.display = 'block';
    customTextContainer.style.display = 'none'; category.value = 'Expense';
    populateSubCategories();
  }
  updateButtonMode();
}

function populateSubCategories() {
  const selectedMain = mainCategory.value;
  const currentDb = getActiveDatabase();
  subCategory.innerHTML = '';
  if (!currentDb[selectedMain]) return;
  
  Object.keys(currentDb[selectedMain]).forEach(group => {
    let opt = document.createElement('option'); opt.value = group; opt.innerText = group;
    subCategory.appendChild(opt);
  });
  populateBrands();
}

function populateBrands() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const currentDb = getActiveDatabase();
  itemBrand.innerHTML = '';
  if (!currentDb[selectedMain] || !currentDb[selectedMain][selectedSub]) return;
  
  Object.keys(currentDb[selectedMain][selectedSub]).forEach(brand => {
    let opt = document.createElement('option'); opt.value = brand; opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  populateModels();
}

function populateModels() {
  const selectedMain = mainCategory.value;
  const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value;
  const currentDb = getActiveDatabase();
  itemModel.innerHTML = '';
  if (!currentDb[selectedMain] || !currentDb[selectedMain][selectedSub] || !currentDb[selectedMain][selectedSub][selectedBrand]) return;
  
  const models = Object.keys(currentDb[selectedMain][selectedSub][selectedBrand]);
  modelContainer.style.display = (models.length === 1 && models[0] === 'Standard') ? 'none' : 'block';
  models.forEach(model => {
    let opt = document.createElement('option'); opt.value = model; opt.innerText = model;
    itemModel.appendChild(opt);
  });
  autoUpdatePrice();
}

function autoUpdatePrice() {
  const selectedMain = mainCategory.value; const selectedSub = subCategory.value;
  const selectedBrand = itemBrand.value; const selectedModel = itemModel.value;
  const currentDb = getActiveDatabase();
  
  if (currentDb[selectedMain]?.[selectedSub]?.[selectedBrand]?.[selectedModel] !== undefined) {
    amount.value = currentDb[selectedMain][selectedSub][selectedBrand][selectedModel];
  }
}

function updateButtonMode() {
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
  else { displayTitle = `${itemBrand.value || 'Item'} (${itemModel.value || 'Std'})`; }

  const payload = {
    id: Date.now(), text: displayTitle.toUpperCase(), amount: finalAmount,
    mainCat: selectedMain, month: parseInt(timelineMonth.value), period: timelinePeriod.value, user: currentUser
  };

  allFamilyLogs.unshift(payload);
  localStorage.setItem('timeline_shared_database', JSON.stringify(allFamilyLogs));
  
  customDesc.value = ''; amount.value = ''; 
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

mainCategory.addEventListener('change', handleMainCategoryChange);
subCategory.addEventListener('change', populateBrands);
itemBrand.addEventListener('change', populateModels);
itemModel.addEventListener('change', autoUpdatePrice);
category.addEventListener('change', updateButtonMode);
form.addEventListener('submit', saveTransaction);

switchUser(currentUser);
