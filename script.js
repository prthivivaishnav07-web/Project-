const netWorthDisplay = document.getElementById('net-worth');
const savingsRateDisplay = document.getElementById('savings-rate');
const burnRateDisplay = document.getElementById('burn-rate');

const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const itemSize = document.getElementById('item-size');
const submitBtn = document.getElementById('form-submit-btn');

const timelineMonth = document.getElementById('timeline-month');
const timelinePeriod = document.getElementById('timeline-period');

const bodyBg = document.getElementById('body-bg');
const appContainer = document.getElementById('app-container');
const themeSelect = document.getElementById('theme-select');
const sidebar = document.getElementById('history-sidebar');
const sidebarTitle = document.getElementById('sidebar-title');
const sidebarHeader = document.getElementById('sidebar-header');

const yearGrid = document.getElementById('year-contribution-grid');
const diurnalGrid = document.getElementById('diurnal-heatmap-grid');

const metricsBoard = document.getElementById('metrics-board');
const categoryDivider = document.getElementById('category-box-divider');
const appHeader = document.getElementById('app-header');

const contributionCard = document.getElementById('contribution-card');
const diurnalCard = document.getElementById('diurnal-card');

const categoryColors = { 'Clothes': '#9b59b6', 'Food': '#e67e22', 'Electronics': '#3498db', 'Salary': '#2ecc71', 'General': '#7f8c8d' };
const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayPeriods = ['Morning', 'Afternoon', 'Evening', 'Night'];

const menuPrices = {
  'BURGER': { 'SMALL': 49, 'MEDIUM': 79, 'LARGE': 100 },
  'PIZZA': { 'SMALL': 59, 'MEDIUM': 99, 'LARGE': 159 },
  'SANDWICH': { 'SMALL': 79, 'MEDIUM': 79, 'LARGE': 79 },
  'FRENCH FRIES': { 'SMALL': 79, 'MEDIUM': 79, 'LARGE': 79 },
  'FRIES': { 'SMALL': 79, 'MEDIUM': 79, 'LARGE': 79 },
  'PERI PERI': { 'SMALL': 99, 'MEDIUM': 99, 'LARGE': 99 }
};

let transactions = JSON.parse(localStorage.getItem('timeline_transactions')) || [];
let currentTheme = localStorage.getItem('siteTheme') || 'white';

// Enhanced Contrast Theme Parameters (No mud transparency rules)
const themeMap = {
  white:  { body: '#f5f6fa', card: '#ffffff', txt: '#222222', line: '#b2bec3', innerCard: '#f8f9fa' },
  grey:   { body: '#4a5568', card: '#2d3748', txt: '#ffffff', line: '#718096', innerCard: '#1a202c' },
  black:  { body: '#0a0a0a', card: '#161616', txt: '#ffffff', line: '#333333', innerCard: '#222222' },
  pink:   { body: '#fff0f6', card: '#ffdeeb', txt: '#a61e4d', line: '#f783ac', innerCard: '#fff3f6' },
  green:  { body: '#e6fcf5', card: '#c3fae8', txt: '#0ca678', line: '#20c997', innerCard: '#f0fdf4' },
  purple: { body: '#f3f0ff', card: '#e5dbff', txt: '#5f3dc4', line: '#845ef7', innerCard: '#f8f7ff' },
  brown:  { body: '#fdf8f5', card: '#f4eae1', txt: '#4e342e', line: '#8d6e63', innerCard: '#faf6f0' }
};

function autoUpdatePrice() {
  const inputName = text.value.trim().toUpperCase();
  const selectedSize = itemSize.value;
  let matchedKey = null;

  for (let key in menuPrices) {
    if (inputName.includes(key)) { matchedKey = key; break; }
  }

  if (matchedKey) {
    amount.value = menuPrices[matchedKey][selectedSize];
    category.value = 'Food'; 
    updateButtonMode('Food');
  }
}

function updateButtonMode(catValue) {
  if (!submitBtn) return;
  if (catValue === 'Salary') {
    submitBtn.style.background = '#2ecc71';
    submitBtn.innerText = 'DEPOSIT FUNDS';
  } else {
    submitBtn.style.background = '#e74c3c';
    submitBtn.innerText = 'SUBTRACT TRANSACTION';
  }
}

if (category) {
  category.onchange = () => updateButtonMode(category.value);
}

function toggleSidebar(open) {
  if (!sidebar) return;
  sidebar.style.right = open ? '0px' : '-320px';
}

function applyThemeStyles() {
  const config = themeMap[currentTheme] || themeMap.white;
  if (themeSelect) themeSelect.value = currentTheme;
  if (bodyBg) bodyBg.style.backgroundColor = config.body;
  
  if (appContainer) {
    appContainer.style.backgroundColor = config.card;
    appContainer.style.color = config.txt;
    appContainer.style.borderColor = config.line;
  }
  if (sidebar) {
    sidebar.style.backgroundColor = config.card;
    sidebar.style.color = config.txt;
    sidebar.style.borderColor = config.line;
  }
  
  if (sidebarTitle) sidebarTitle.style.color = config.txt;
  if (sidebarHeader) sidebarHeader.style.borderColor = config.line;
  if (metricsBoard) metricsBoard.style.borderColor = config.line;
  if (categoryDivider) categoryDivider.style.borderColor = config.line;
  if (appHeader) appHeader.style.borderColor = config.line;

  if (contributionCard) {
    contributionCard.style.borderColor = config.line;
    contributionCard.style.backgroundColor = config.innerCard;
  }
  if (diurnalCard) {
    diurnalCard.style.borderColor = config.line;
    diurnalCard.style.backgroundColor = config.innerCard;
  }

  init();
}

if (themeSelect) {
  themeSelect.addEventListener('change', (e) => {
    currentTheme = e.target.value;
    localStorage.setItem('siteTheme', currentTheme);
    applyThemeStyles();
  });
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
  if (netWorthDisplay) netWorthDisplay.innerText = netWorth.toFixed(2);

  const overallIncomePool = startingBalance + totalDeposits;
  const savingsRate = overallIncomePool > 0 ? ((netWorth / overallIncomePool) * 100) : 0;
  if (savingsRateDisplay) savingsRateDisplay.innerText = `${Math.max(0, Math.min(100, savingsRate)).toFixed(0)}%`;

  const totalDaysActive = 30; 
  const burnRate = totalExpenses / totalDaysActive;
  if (burnRateDisplay) burnRateDisplay.innerText = `$${burnRate.toFixed(2)}/day`;
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
    let cellBg = currentTheme === 'black' || currentTheme === 'grey' ? '#333' : '#e4e7eb';
    let textColor = currentTheme === 'black' || currentTheme === 'grey' ? '#aaa' : '#555';
    
    if (spend > 0 && spend <= 500) { cellBg = '#c2f0c2'; textColor = '#1e7b43'; }
    else if (spend > 500 && spend <= 2000) { cellBg = '#71d971'; textColor = '#0e4622'; }
    else if (spend > 2000 && spend <= 5000) { cellBg = '#27ae60'; textColor = '#fff'; }
    else if (spend > 5000) { cellBg = '#1e7b43'; textColor = '#fff'; }

    const monthBlock = document.createElement('div');
    monthBlock.style.background = cellBg;
    monthBlock.style.padding = '8px 2px';
    monthBlock.style.borderRadius = '6px';
    monthBlock.style.fontSize = '11px';
    monthBlock.style.fontWeight = '700';
    monthBlock.style.color = textColor;
    monthBlock.style.border = `1px solid ${themeMap[currentTheme].line}`;
    monthBlock.innerHTML = `<div>${month}</div><div style="font-size:8.5px; font-weight:800; margin-top:2px;">$${spend.toFixed(0)}</div>`;
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

  const config = themeMap[currentTheme] || themeMap.white;

  dayPeriods.forEach(period => {
    const amt = periodSpend[period];
    let fillBarColor = '#95a5a6';
    if (amt > 0 && amt <= 500) fillBarColor = '#f39c12';
    else if (amt > 500 && amt <= 2000) fillBarColor = '#d35400';
    else if (amt > 2000) fillBarColor = '#c0392b';

    const blockRow = document.createElement('div');
    blockRow.style.display = 'flex';
    blockRow.style.alignItems = 'center';
    blockRow.style.justifyContent = 'space-between';
    blockRow.style.backgroundColor = config.card;
    blockRow.style.padding = '8px 12px';
    blockRow.style.borderRadius = '6px';
    blockRow.style.fontSize = '11px';
    blockRow.style.border = `1px solid ${config.line}`;

    blockRow.innerHTML = `
      <div style="width: 80px; font-weight:700; color:${config.txt};">${period}</div>
      <div style="flex:1; margin: 0 12px; background: ${config.innerCard}; border: 1px solid ${config.line}; height:10px; border-radius:5px; overflow:hidden;">
         <div style="width: ${Math.min(100, (amt/5000)*100)}%; background: ${fillBarColor}; height:100%;"></div>
      </div>
      <div style="font-weight:800; color:${amt > 0 ? fillBarColor : config.txt};">$${amt.toFixed(2)}</div>
    `;
    diurnalGrid.appendChild(blockRow);
  });
}

function saveTransaction(e) {
  e.preventDefault();
  let valStr = amount.value.toString().replace(/[^0-9+\-*/.]/g, '');
  if (!valStr) return;
  let evaluated = Function(`"use strict"; return (${valStr})`)();
  let finalAmount = category.value !== 'Salary' ? -Math.abs(evaluated) : Math.abs(evaluated);

  const cleanItemName = category.value === 'Food' ? `${text.value.toUpperCase()} (${itemSize.value})` : text.value.toUpperCase();

  transactions.push({
    id: Date.now(),
    text: cleanItemName,
    amount: finalAmount,
    cat: category.value,
    month: parseInt(timelineMonth.value),
    period: timelinePeriod.value
  });

  updateLocalStorage();
  init();
  text.value = ''; amount.value = '';
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function resetData() {
  if (confirm("RESET ALL TIMELINE DATA?")) {
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
  const config = themeMap[currentTheme] || themeMap.white;
  
  item.style.padding = "10px"; 
  item.style.margin = "6px 0"; 
  item.style.borderRadius = "6px";
  item.style.backgroundColor = config.innerCard; 
  item.style.color = config.txt;
  item.style.display = "flex"; 
  item.style.justifyContent = "space-between"; 
  item.style.alignItems = "center";
  item.style.border = `1px solid ${config.line}`;
  item.style.borderLeft = `6px solid ${categoryColors[t.cat] || '#7f8c8d'}`;

  item.innerHTML = `
    <div>
      <div style="font-weight:700; font-size:12px; color:${config.txt};">${t.text}</div>
      <div style="font-size:9.5px; font-weight:600; opacity:0.8; margin-top:2px;">${monthsList[t.month]} | ${t.period}</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${isExpense ? '#ff4757' : '#2ecc71'}; font-weight: 800; font-size:12px;">${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-weight:bold; font-size:12px;">✕</button>
    </div>`;
  list.appendChild(item);
}

if (form) form.addEventListener('submit', saveTransaction);
applyThemeStyles();
