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

const yearGrid = document.getElementById('year-contribution-grid');
const diurnalGrid = document.getElementById('diurnal-heatmap-grid');

const metricsBoard = document.getElementById('metrics-board');
const categoryDivider = document.getElementById('category-box-divider');

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

const themeMap = {
  white:  { body: '#f5f6fa', card: '#ffffff', txt: '#333333', line: '#dcdde1' },
  grey:   { body: '#7f8c8d', card: '#b2bec3', txt: '#2d3436', line: '#444444' },
  black:  { body: '#111111', card: '#222222', txt: '#ffffff', line: '#444444' },
  pink:   { body: '#fff0f6', card: '#ffdeeb', txt: '#a61e4d', line: '#f783ac' },
  green:  { body: '#e6fcf5', card: '#c3fae8', txt: '#0ca678', line: '#20c997' },
  purple: { body: '#f3f0ff', card: '#e5dbff', txt: '#5f3dc4', line: '#845ef7' },
  brown:  { body: '#fdf8f5', card: '#f4eae1', txt: '#4e342e', line: '#8d6e63' }
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
  if (metricsBoard) metricsBoard.style.borderColor = config.line;
  if (categoryDivider) categoryDivider.style.borderColor = config.line;
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

// Renders the 12-Month Map
function renderYearlyMap() {
  if (!yearGrid) return;
  yearGrid.innerHTML = '';

  let monthlySpend = Array(12).fill(0);
  transactions.forEach(t => {
    if (t.amount < 0) {
      monthlySpend[t.month] += Math.abs(t.amount);
    }
  });

  monthsList.forEach((month, index) => {
    const spend = monthlySpend[index];
    let cellBg = 'rgba(0,0,0,0.05)';
    if (spend > 0 && spend <= 500) cellBg = '#c2f0c2';
    else if (spend > 500 && spend <= 2000) cellBg = '#71d971';
    else if (spend > 2000 && spend <= 5000) cellBg = '#27ae60';
    else if (spend > 5000) cellBg = '#1e7b43';

    const monthBlock = document.createElement('div');
    monthBlock.style.background = cellBg;
    monthBlock.style.padding = '6px 2px';
    monthBlock.style.borderRadius = '5px';
    monthBlock.style.fontSize = '10px';
    monthBlock.style.fontWeight = '700';
    monthBlock.style.color = spend > 2000 ? '#fff' : '#333';
    monthBlock.innerHTML = `<div>${month}</div><div style="font-size:8px; font-weight:600; opacity:0.9;">$${spend.toFixed(0)}</div>`;
    yearGrid.appendChild(monthBlock);
  });
}

// Renders Diurnal Monitor Heat Map (Morning, Afternoon, Evening, Night)
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
    let fillBarColor = '#95a5a6';
    if (amt > 0 && amt <= 500) fillBarColor = '#f39c12';
    else if (amt > 500 && amt <= 2000) fillBarColor = '#d35400';
    else if (amt > 2000) fillBarColor = '#c0392b';

    const blockRow = document.createElement('div');
    blockRow.style.display = 'flex';
    blockRow.style.alignItems = 'center';
    blockRow.style.justifyContent = 'space-between';
    blockRow.style.background = 'rgba(0,0,0,0.03)';
    blockRow.style.padding = '6px 10px';
    blockRow.style.borderRadius = '6px';
    blockRow.style.fontSize = '11px';

    blockRow.innerHTML = `
      <div style="width: 80px; font-weight:700;">${period}</div>
      <div style="flex:1; margin: 0 10px; background: rgba(0,0,0,0.05); height:8px; border-radius:4px; overflow:hidden;">
         <div style="width: ${Math.min(100, (amt/5000)*100)}%; background: ${fillBarColor}; height:100%;"></div>
      </div>
      <div style="font-weight:700; color:${fillBarColor};">$${amt.toFixed(2)}</div>
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
  const isDark = currentTheme === 'black';
  
  item.style.padding = "10px"; item.style.margin = "6px 0"; item.style.borderRadius = "6px";
  item.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"; 
  item.style.color = "inherit";
  item.style.display = "flex"; item.style.justifyContent = "space-between"; item.style.alignItems = "center";
  item.style.borderLeft = `5px solid ${categoryColors[t.cat] || '#7f8c8d'}`;

  item.innerHTML = `
    <div>
      <div style="font-weight:700; font-size:12px;">${t.text}</div>
      <div style="font-size:9px; opacity:0.7;">${monthsList[t.month]} | ${t.period}</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${isExpense ? '#ff4757' : '#2ecc71'}; font-weight: 700; font-size:12px;">${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-weight:bold; font-size:12px;">✕</button>
    </div>`;
  list.appendChild(item);
}

if (form) form.addEventListener('submit', saveTransaction);
applyThemeStyles();
