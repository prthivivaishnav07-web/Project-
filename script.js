// DOM Element selections
const netWorthDisplay = document.getElementById('net-worth');
const savingsRateDisplay = document.getElementById('savings-rate');
const burnRateDisplay = document.getElementById('burn-rate');
const monthlyIncomeDisplay = document.getElementById('monthly-income');
const taxBreakdownDisplay = document.getElementById('tax-breakdown');
const weeklyPaymentsDisplay = document.getElementById('weekly-payments');

const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const itemSize = document.getElementById('item-size');
const submitBtn = document.getElementById('form-submit-btn');

const bodyBg = document.getElementById('body-bg');
const appContainer = document.getElementById('app-container');
const themeSelect = document.getElementById('theme-select');
const sidebar = document.getElementById('history-sidebar');
const sidebarTitle = document.getElementById('sidebar-title');
const heatmapGrid = document.getElementById('heatmap-grid');

const metricsBoard = document.getElementById('metrics-board');
const categoryDivider = document.getElementById('category-box-divider');

const categoryColors = { 'Clothes': '#9b59b6', 'Food': '#e67e22', 'Electronics': '#3498db', 'Salary': '#2ecc71', 'General': '#7f8c8d' };
const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const menuPrices = {
  'BURGER': { 'SMALL': 49, 'MEDIUM': 79, 'LARGE': 100 },
  'PIZZA': { 'SMALL': 59, 'MEDIUM': 99, 'LARGE': 159 },
  'SANDWICH': { 'SMALL': 79, 'MEDIUM': 79, 'LARGE': 79 },
  'FRENCH FRIES': { 'SMALL': 79, 'MEDIUM': 79, 'LARGE': 79 },
  'FRIES': { 'SMALL': 79, 'MEDIUM': 79, 'LARGE': 79 },
  'PERI PERI': { 'SMALL': 99, 'MEDIUM': 99, 'LARGE': 99 }
};

// State trackers
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentTheme = localStorage.getItem('siteTheme') || 'white';

// Solid clean definitions for all background settings
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
  if (!text || !amount || !category || !itemSize) return;
  const inputName = text.value.trim().toUpperCase();
  const selectedSize = itemSize.value;
  let matchedKey = null;

  for (let key in menuPrices) {
    if (inputName.includes(key)) {
      matchedKey = key;
      break;
    }
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
    submitBtn.innerText = 'DEPOSIT ';
  } else {
    submitBtn.style.background = '#e74c3c';
    submitBtn.innerText = 'TRANSACTION';
  }
}

if (category) {
  category.onchange = () => updateButtonMode(category.value);
}

function toggleSidebar(open) {
  if (!sidebar) return;
  sidebar.style.right = open ? '0px' : '-320px';
  if (open) renderHeatMap();
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
  if (!netWorthDisplay) return;
  const startingBalance = 10000;
  let totalDeposits = 0;
  let totalExpenses = 0;
  let weeklyExpenseSum = 0;

  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  let firstTransactionTime = now;

  transactions.forEach(t => {
    if (t.timestamp && t.timestamp < firstTransactionTime) firstTransactionTime = t.timestamp;
    if (t.amount > 0) {
      totalDeposits += t.amount;
    } else {
      totalExpenses += Math.abs(t.amount);
      if (t.timestamp && t.timestamp >= oneWeekAgo) weeklyExpenseSum += Math.abs(t.amount);
    }
  });

  const netWorth = startingBalance + totalDeposits - totalExpenses;
  netWorthDisplay.innerText = netWorth.toFixed(2);

  const overallIncomePool = startingBalance + totalDeposits;
  const savingsRate = overallIncomePool > 0 ? ((netWorth / overallIncomePool) * 100) : 0;
  if (savingsRateDisplay) savingsRateDisplay.innerText = `${Math.max(0, Math.min(100, savingsRate)).toFixed(0)}%`;

  const totalDaysActive = Math.max(1, Math.ceil((now - firstTransactionTime) / (1000 * 60 * 60 * 24)));
  const burnRate = totalExpenses / totalDaysActive;
  if (burnRateDisplay) burnRateDisplay.innerText = `$${burnRate.toFixed(2)}/day`;

  const grossMonthlyIncome = totalDeposits; 
  const gstDeduction = grossMonthlyIncome * 0.18;
  const taxDeduction = grossMonthlyIncome * 0.10;
  const netMonthlyIncome = grossMonthlyIncome - gstDeduction - taxDeduction;

  if (monthlyIncomeDisplay) monthlyIncomeDisplay.innerText = `$${grossMonthlyIncome.toFixed(2)}`;
  if (taxBreakdownDisplay) taxBreakdownDisplay.innerText = `Take-home: $${netMonthlyIncome.toFixed(2)} (-18% GST, -10% Tax)`;

  if (weeklyPaymentsDisplay) weeklyPaymentsDisplay.innerText = `$${weeklyExpenseSum.toFixed(2)}`;
}

function renderHeatMap() {
  if (!heatmapGrid) return;
  heatmapGrid.innerHTML = '';
  let weeklySpend = [0, 0, 0, 0, 0, 0, 0];
  transactions.forEach(t => { if (t.amount < 0) { const date = new Date(t.timestamp || Date.now()); weeklySpend[date.getDay()] += Math.abs(t.amount); } });

  daysOfWeek.forEach((day, index) => {
    const totalDayCost = weeklySpend[index];
    let bgColor = '#b2bec3';
    if (totalDayCost > 0 && totalDayCost <= 500) bgColor = '#7f8c8d';
    else if (totalDayCost > 500 && totalDayCost <= 2000) bgColor = '#f1c40f';
    else if (totalDayCost > 2000 && totalDayCost <= 5000) bgColor = '#e67e22';
    else if (totalDayCost > 5000) bgColor = '#c0392b';

    const dayBlock = document.createElement('div');
    dayBlock.style.background = bgColor; dayBlock.style.padding = '5px 2px'; dayBlock.style.borderRadius = '4px'; dayBlock.style.fontSize = '9px'; dayBlock.style.fontWeight = '700'; dayBlock.style.color = '#fff';
    dayBlock.innerHTML = `<div>${day}</div>`;
    heatmapGrid.appendChild(dayBlock);
  });
}

function calculateAmount(inputVal) {
  try {
    let sanitized = inputVal.toString().replace(/[^0-9+\-*/.]/g, '');
    if (!sanitized) return 0;
    let result = Function(`"use strict"; return (${sanitized})`)();
    return category.value !== 'Salary' ? -Math.abs(result) : Math.abs(result);
  } catch (error) { return null; }
}

function saveTransaction(e) {
  e.preventDefault();
  const finalAmount = calculateAmount(amount.value);
  if (finalAmount === null) return;

  const itemLabelText = text.value.toUpperCase();
  let cleanItemName = itemLabelText;
  if (category.value === 'Food' && itemSize) cleanItemName = `${itemLabelText} (${itemSize.value})`;

  transactions.push({ id: Date.now(), text: cleanItemName, amount: finalAmount, cat: category.value, timestamp: Date.now() });
  init(); updateLocalStorage();
  text.value = ''; amount.value = '';
  toggleSidebar(true);
}

function removeTransaction(id) { transactions = transactions.filter(t => t.id !== id); updateLocalStorage(); init(); }
function resetData() { if (confirm("RESET ALL ACCOUNT DATA?")) { transactions = []; updateLocalStorage(); init(); } }
function updateLocalStorage() { localStorage.setItem('transactions', JSON.stringify(transactions)); }

function init() {
  if (list) list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  recalculateDashboardMetrics();
  renderHeatMap();
}

function addTransactionDOM(t) {
  if (!list) return;
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const isDark = ['black'].includes(currentTheme);
  
  item.style.padding = "10px"; item.style.margin = "6px 0"; item.style.borderRadius = "6px";
  item.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"; 
  item.style.color = "inherit";
  item.style.display = "flex"; item.style.justifyContent = "space-between"; item.style.alignItems = "center";
  item.style.borderLeft = `5px solid ${categoryColors[t.cat] || '#7f8c8d'}`;

  item.innerHTML = `
    <div><span style="font-weight:700; font-size:12px;">${t.text}</span></div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="color: ${isExpense ? '#ff4757' : '#2ecc71'}; font-weight: 700; font-size:12px;">${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-weight:bold; font-size:12px;">✕</button>
    </div>`;
  list.appendChild(item);
}

if (form) {
  form.addEventListener('submit', saveTransaction);
}

applyThemeStyles();
