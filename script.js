const netWorthDisplay = document.getElementById('net-worth');
const savingsRateDisplay = document.getElementById('savings-rate');
const burnRateDisplay = document.getElementById('burn-rate');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');

const itemType = document.getElementById('item-type');
const itemBrand = document.getElementById('item-brand');
const itemModel = document.getElementById('item-model');
const amount = document.getElementById('amount');
const category = document.getElementById('category');

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

const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayPeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Perfect Electronic Inventory Database mapping
const catalogData = {
  Mobiles: {
    Apple: { "iPhone 14": 54900, "iPhone 15": 56900, "iPhone 16": 69900 },
    Samsung: { "Galaxy S23": 45000, "Galaxy S24": 49999, "Galaxy S25": 62349 },
    Redmi: { "Redmi Note 13 5G": 12040, "Redmi Note 14 5G": 14190, "Redmi Note 14 Pro": 26000 },
    Realme: { "Realme 13 Pro": 29439, "Realme 13 Pro+": 23999, "Realme 14 Pro": 26999 },
    OnePlus: { "OnePlus 11": 47500, "OnePlus 12": 57000, "OnePlus 13": 60890 },
    Xiaomi: { "Xiaomi 13 Pro": 70000, "Xiaomi 14": 59990, "Xiaomi 14 Civi": 49990 },
    POCO: { "POCO X6 Pro": 23500, "POCO X7 Pro": 23999 },
    OPPO: { "OPPO Reno 11": 30000, "OPPO Reno 12": 32500, "OPPO Reno 13": 31990 },
    Vivo: { "Vivo V30": 31500, "Vivo V40": 37000, "Vivo V50": 29670 },
    Google: { "Pixel 7": 37500, "Pixel 8": 52000, "Pixel 9": 79999 },
    Sony: { "Xperia 1 V": 102500, "Xperia 1 VI": 115000 }
  },
  Laptops: {
    Apple: { "MacBook Air M2": 84400, "MacBook Air M3": 104950, "MacBook Air M4": 117450, "MacBook Pro M3": 224900 },
    HP: { "Victus 15": 65000, "Pavilion 14": 72500, "Envy x360": 100000, "Spectre x360": 165000, "Omen": 172500 },
    Dell: { "Inspiron 15": 60000, "Vostro 15": 55000, "XPS 13": 137500, "Alienware m16": 340000, "Latitude": 135000 },
    Lenovo: { "IdeaPad Slim 3": 50000, "IdeaPad Slim 5": 75000, "LOQ Gaming": 100000, "Legion 5": 160000, "ThinkPad Series": 160000 },
    ASUS: { "Vivobook 15": 60000, "Zenbook 14 OLED": 112500, "TUF Gaming F15": 87500, "ROG Strix": 235000 },
    Acer: { "Aspire Lite": 47500, "Aspire 5": 60000, "Swift Go": 82500, "Predator Helios": 195000 },
    MSI: { "Modern 14": 60000, "Thin 15": 75000, "Katana": 135000, "Stealth": 250000 },
    Samsung: { "Galaxy Book2": 77500, "Galaxy Book3": 95000, "Galaxy Book4": 107500, "Galaxy Book5": 117500 },
    Microsoft: { "Surface Laptop Go 2": 67500, "Surface Laptop 5": 127500, "Surface Laptop 7": 155000 },
    LG: { "Gram 14": 115000, "Gram 16": 145000 },
    Huawei: { "MateBook D15": 67500 },
    Xiaomi: { "RedmiBook Pro": 60000 },
    Honor: { "MagicBook X14": 57500 }
  }
};

let transactions = JSON.parse(localStorage.getItem('timeline_transactions')) || [];

function handleDisplayChange() {
  const selectedType = itemType.value;
  
  if (selectedType === 'Custom') {
    brandContainer.style.display = 'none';
    modelContainer.style.display = 'none';
    customTextContainer.style.display = 'block';
    amount.value = '';
    category.value = 'Salary';
  } else {
    brandContainer.style.display = 'block';
    modelContainer.style.display = 'block';
    customTextContainer.style.display = 'none';
    category.value = 'Electronics';
    populateBrands();
  }
  updateButtonMode();
}

function populateBrands() {
  const selectedType = itemType.value;
  if (selectedType === 'Custom') return;

  itemBrand.innerHTML = '';
  const brands = Object.keys(catalogData[selectedType]);
  
  brands.forEach(brand => {
    let opt = document.createElement('option');
    opt.value = brand;
    opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  populateModels();
}

function populateModels() {
  const selectedType = itemType.value;
  const selectedBrand = itemBrand.value;
  if (selectedType === 'Custom' || !catalogData[selectedType]?.[selectedBrand]) return;

  itemModel.innerHTML = '';
  const models = Object.keys(catalogData[selectedType][selectedBrand]);
  
  models.forEach(model => {
    let opt = document.createElement('option');
    opt.value = model;
    opt.innerText = model;
    itemModel.appendChild(opt);
  });
  autoUpdatePrice();
}

function autoUpdatePrice() {
  const selectedType = itemType.value;
  if (selectedType === 'Custom') return;

  const selectedBrand = itemBrand.value;
  const selectedModel = itemModel.value;

  if (catalogData[selectedType]?.[selectedBrand]?.[selectedModel] !== undefined) {
    amount.value = catalogData[selectedType][selectedBrand][selectedModel];
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
  const startingBalance = 500000;
  let totalDeposits = 0;
  let totalExpenses = 0;

  transactions.forEach(t => {
    if (t.amount > 0) totalDeposits += t.amount;
    else totalExpenses += Math.abs(t.amount);
  });

  const netWorth = startingBalance + totalDeposits - totalExpenses;
  if (netWorthDisplay) netWorthDisplay.innerText = netWorth.toFixed(2);

  const overallIncomePool = startingBalance + totalDeposits;
  const savingsRate = overallIncomePool > 0 ? ((netWorth / overallIncomePool) * 100) : 0;
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
    let cellBg = '#333333';
    let textColor = '#aaaaaa';
    
    if (spend > 0 && spend <= 40000) { cellBg = '#064e3b'; textColor = '#34d399'; }
    else if (spend > 40000 && spend <= 120000) { cellBg = '#047857'; textColor = '#a7f3d0'; }
    else if (spend > 120000) { cellBg = '#10b981'; textColor = '#ffffff'; }

    const monthBlock = document.createElement('div');
    monthBlock.style.background = cellBg;
    monthBlock.style.padding = '10px 4px';
    monthBlock.style.borderRadius = '6px';
    monthBlock.style.fontSize = '12px';
    monthBlock.style.fontWeight = '600';
    monthBlock.style.color = textColor;
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
    if (amt > 0 && amt <= 50000) barColor = '#f59e0b';
    else if (amt > 50000 && amt <= 150000) barColor = '#ea580c';
    else if (amt > 150000) barColor = '#dc2626';

    const blockRow = document.createElement('div');
    blockRow.style.display = 'flex';
    blockRow.style.alignItems = 'center';
    blockRow.style.justifyContent = 'space-between';
    blockRow.style.backgroundColor = '#1e1e1e';
    blockRow.style.padding = '10px 12px';
    blockRow.style.borderRadius = '6px';
    blockRow.style.fontSize = '12px';
    blockRow.style.border = '1px solid #3d3d3d';

    blockRow.innerHTML = `
      <div style="width: 85px; font-weight:600; color:#e0e0e0;">${period}</div>
      <div style="flex:1; margin: 0 14px; background: #262626; height:8px; border-radius:4px; overflow:hidden; border: 1px solid #3d3d3d;">
         <div style="width: ${Math.min(100, (amt/300000)*100)}%; background: ${barColor}; height:100%;"></div>
      </div>
      <div style="font-weight:700; color:${amt > 0 ? barColor : '#888888'};">₹${amt.toFixed(0)}</div>
    `;
    diurnalGrid.appendChild(blockRow);
  });
}

function saveTransaction(e) {
  e.preventDefault();
  let parsedAmount = parseFloat(amount.value);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return;

  let finalAmount = category.value !== 'Salary' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);
  let displayTitle = '';

  if (itemType.value === 'Custom') {
    displayTitle = customDesc.value.trim() || 'CUSTOM TRANSACTION';
  } else {
    displayTitle = `${itemBrand.value} ${itemModel.value}`;
  }

  transactions.push({
    id: Date.now(),
    text: displayTitle.toUpperCase(),
    amount: finalAmount,
    cat: category.value,
    month: parseInt(timelineMonth.value),
    period: timelinePeriod.value
  });

  updateLocalStorage();
  init();
  customDesc.value = '';
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function resetData() {
  if (confirm("Clear timeline history?")) {
    transactions = [];
    updateLocalStorage();
    init();
  }
}

function updateLocalStorage() {
  localStorage.setItem('timeline_transactions', JSON.stringify(transactions));
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
  
  item.style.padding = "10px"; 
  item.style.margin = "6px 0"; 
  item.style.borderRadius = "6px";
  item.style.backgroundColor = "#262626"; 
  item.style.color = "#e0e0e0";
  item.style.display = "flex"; 
  item.style.justifyContent = "space-between"; 
  item.style.alignItems = "center";
  item.style.border = "1px solid #3d3d3d";
  item.style.borderLeft = `6px solid ${t.cat === 'Salary' ? '#10b981' : '#3498db'}`;

  item.innerHTML = `
    <div>
      <div style="font-weight:600; font-size:12px; color:#ffffff;">${t.text}</div>
      <div style="font-size:10px; color:#888888; margin-top:2px;">${monthsList[t.month]} | ${t.period}</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${isExpense ? '#ef4444' : '#10b981'}; font-weight: 700; font-size:12px;">${isExpense ? '-' : '+'}.₹${Math.abs(t.amount)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold; font-size:12px;">✕</button>
    </div>`;
  list.appendChild(item);
}

// Attach explicit listener mappings cleanly
itemType.addEventListener('change', handleDisplayChange);
itemBrand.addEventListener('change', populateModels);
itemModel.addEventListener('change', autoUpdatePrice);
category.addEventListener('change', updateButtonMode);
form.addEventListener('submit', saveTransaction);

// Launch clean state setup
handleDisplayChange();
init();
