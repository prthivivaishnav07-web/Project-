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

// Structured Database from requirements
const catalogData = {
  Mobiles: {
    Apple: { "iPhone 14": 54900, "iPhone 15": 56900, "iPhone 16": 69900 },
    Samsung: { "Galaxy S23": 42000, "Galaxy S24": 49999, "Galaxy S25": 62349 },
    Redmi: { "Redmi Note 13 5G": 12040, "Redmi Note 14 5G": 14190, "Redmi Note 14 Pro": 22000 },
    Realme: { "Realme 13 Pro": 29439, "Realme 13 Pro+": 23999, "Realme 14 Pro": 26999 },
    OnePlus: { "OnePlus 11": 45000, "OnePlus 12": 54000, "OnePlus 13": 60890 },
    Xiaomi: { "Xiaomi 13 Pro": 65000, "Xiaomi 14": 59990, "Xiaomi 14 Civi": 49990 },
    POCO: { "POCO X6 Pro": 22000, "POCO X7 Pro": 23999 },
    OPPO: { "OPPO Reno 11": 28000, "OPPO Reno 12": 30000, "OPPO Reno 13": 31990 },
    Vivo: { "Vivo V30": 29000, "Vivo V40": 34000, "Vivo V50": 29670 },
    Google: { "Pixel 7": 35000, "Pixel 8": 49000, "Pixel 9": 79999 },
    Sony: { "Xperia 1 V": 95000, "Xperia 1 VI": 115000 }
  },
  Laptops: {
    Apple: { "MacBook Air M2": 79900, "MacBook Air M3": 94900, "MacBook Air M4": 99900, "MacBook Pro M3": 149900 },
    HP: { "Victus 15": 55000, "Pavilion 14": 60000, "Envy x360": 80000, "Spectre x360": 130000, "Omen": 95000 },
    Dell: { "Inspiron 15": 45000, "Vostro 15": 40000, "XPS 13": 95000, "Alienware m16": 180000, "Latitude": 70000 },
    Lenovo: { "IdeaPad Slim 3": 40000, "IdeaPad Slim 5": 60000, "LOQ Gaming": 70000, "Legion 5": 100000, "ThinkPad Series": 70000 },
    ASUS: { "Vivobook 15": 40000, "Zenbook 14 OLED": 75000, "TUF Gaming F15": 55000, "ROG Strix": 120000 },
    Acer: { "Aspire Lite": 35000, "Aspire 5": 45000, "Swift Go": 65000, "Predator Helios": 110000 },
    MSI: { "Modern 14": 45000, "Thin 15": 60000, "Katana": 90000, "Stealth": 150000 },
    Samsung: { "Galaxy Book2": 60000, "Galaxy Book3": 70000, "Galaxy Book4": 65000, "Galaxy Book5": 75000 },
    Microsoft: { "Surface Laptop Go 2": 55000, "Surface Laptop 5": 95000, "Surface Laptop 7": 110000 },
    LG: { "Gram 14": 90000, "Gram 16": 110000 },
    Huawei: { "MateBook D15": 55000 },
    Xiaomi: { "RedmiBook Pro": 45000 },
    Honor: { "MagicBook X14": 45000 }
  }
};

let transactions = JSON.parse(localStorage.getItem('timeline_transactions')) || [];

function updateBrandDropdown() {
  const selectedType = itemType.value;
  
  if (selectedType === 'Custom') {
    brandContainer.style.display = 'none';
    modelContainer.style.display = 'none';
    customTextContainer.style.display = 'block';
    amount.value = '';
    return;
  }

  brandContainer.style.display = 'block';
  modelContainer.style.display = 'block';
  customTextContainer.style.display = 'none';

  itemBrand.innerHTML = '';
  Object.keys(catalogData[selectedType]).forEach(brand => {
    let opt = document.createElement('option');
    opt.value = brand;
    opt.innerText = brand;
    itemBrand.appendChild(opt);
  });
  updateModelDropdown();
}

function updateModelDropdown() {
  const selectedType = itemType.value;
  const selectedBrand = itemBrand.value;
  if (!catalogData[selectedType] || !catalogData[selectedType][selectedBrand]) return;

  itemModel.innerHTML = '';
  Object.keys(catalogData[selectedType][selectedBrand]).forEach(model => {
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
  const startingBalance = 500000; // Adjusted balance for electronics
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
    
    if (spend > 0 && spend <= 25000) { cellBg = '#064e3b'; textColor = '#34d399'; }
    else if (spend > 25000 && spend <= 75000) { cellBg = '#047857'; textColor = '#a7f3d0'; }
    else if (spend > 75000) { cellBg = '#10b981'; textColor = '#ffffff'; }

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
    if (amt > 0 && amt <= 30000) barColor = '#f59e0b';
    else if (amt > 30000 && amt <= 90000) barColor = '#ea580c';
    else if (amt > 90000) barColor = '#dc2626';

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
         <div style="width: ${Math.min(100, (amt/200000)*100)}%; background: ${barColor}; height:100%;"></div>
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

if (form) form.addEventListener('submit', saveTransaction);

// Initial Cascading Population Setup Run
updateBrandDropdown();
init();
