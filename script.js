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
const appContainer = document.getElementById('app-container');
const themeSelect = document.getElementById('theme-select');
const sidebar = document.getElementById('history-sidebar');
const sidebarTitle = document.getElementById('sidebar-title');
const heatmapGrid = document.getElementById('heatmap-grid');

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

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentTheme = localStorage.getItem('siteTheme') || 'white';

function autoUpdatePrice() {
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
  if (catValue === 'Salary') {
    submitBtn.style.background = '#2ecc71';
    submitBtn.innerText = 'DEPOSIT FUNDS';
  } else {
    submitBtn.style.background = '#e74c3c';
    submitBtn.innerText = 'SUBTRACT TRANSACTION';
  }
}

if(category) {
  category.onchange = () => updateButtonMode(category.value);
}

function toggleSidebar(open) {
  sidebar.style.right = open ? '0px' : '-320px';
  if (open) renderHeatMap();
}

function changeTheme() {
  currentTheme = themeSelect.value;
  localStorage.setItem('siteTheme', currentTheme);
  applyThemeStyles();
}

function applyThemeStyles() {
  if (!themeSelect || !appContainer || !sidebar || !sidebarTitle) return;
  
  themeSelect.value = currentTheme;
  
  let lightLine = '#dcdde1';
  let darkLine = '#444444';
  
  let mBoard = document.getElementById('metrics-board');
  let cBox = document.getElementById('category-box-divider');

  if (currentTheme === 'white') {
    document.body.style.backgroundColor = '#f5f6fa'; appContainer.style.backgroundColor = '#ffffff'; appContainer.style.color = '#333333'; sidebar.style.background = '#ffffff'; sidebarTitle.style.color = '#333333'; sidebar.style.borderColor = lightLine; appContainer.style.borderColor = lightLine;
    if(mBoard) mBoard.style.borderColor = lightLine; if(cBox) cBox.style.borderColor = lightLine;
  } else if (currentTheme === 'grey') {
    document.body.style.backgroundColor = '#7f8c8d'; appContainer.style.backgroundColor = '#b2bec3'; appContainer.style.color = '#2d3436'; sidebar.style.background = '#b2bec3'; sidebarTitle.style.color = '#2d3436'; sidebar.style.borderColor = darkLine; appContainer.style.borderColor = darkLine;
    if(mBoard) mBoard.style.borderColor = darkLine; if(cBox) cBox.style.borderColor = darkLine;
  } else if (currentTheme === 'black') {
    document.body.style.backgroundColor = '#111111'; appContainer.style.backgroundColor = '#222222'; appContainer.style.color = '#ffffff'; sidebar.style.background = '#222222'; sidebarTitle.style.color = '#ffffff'; sidebar.style.borderColor = darkLine; appContainer.style.borderColor = darkLine;
    if(mBoard) mBoard.style.borderColor = darkLine; if(cBox) cBox.style.borderColor = darkLine;
  } else if (currentTheme === 'pink') {
    document.body.style.backgroundColor = '#fff0f6'; appContainer.style.backgroundColor = '#ffdeeb'; appContainer.style.color = '#a61e4d'; sidebar.style.background = '#ffdeeb'; sidebarTitle.style.color = '#a61e4d'; sidebar.style.borderColor = '#f783ac'; appContainer.style.borderColor = '#f783ac';
    if(mBoard) mBoard.style.borderColor = '#f783ac'; if(cBox) cBox.style.borderColor = '#f783ac';
  } else if (currentTheme === 'green') {
    document.body.style.backgroundColor = '#e6fcf5'; appContainer.style.backgroundColor = '#c3fae8'; appContainer.style.color = '#0ca678'; sidebar.style.background = '#c3fae8'; sidebarTitle.style.color = '#0ca678'; sidebar.style.borderColor = '#20c997'; appContainer.style.borderColor = '#20c997';
    if(mBoard) mBoard.style.borderColor = '#20c997'; if(cBox) cBox.style.borderColor = '#20c997';
  } else if (currentTheme === 'purple') {
    document.body.style.backgroundColor = '#f3f0ff'; appContainer.style.backgroundColor = '#e5dbff'; appContainer.style.color = '#5f3dc4'; sidebar.style.background = '#e5dbff'; sidebarTitle.style.color = '#5f3dc4'; sidebar.style.borderColor = '#845ef7'; appContainer.style.borderColor = '#845ef7';
    if(mBoard) mBoard.style.borderColor = '#845ef7'; if(cBox) cBox.style.borderColor = '#845ef7';
  } else if (currentTheme === 'brown') {
    document.body.style.backgroundColor = '#fdf8f5'; appContainer.style.backgroundColor = '#f4eae1'; appContainer.style.color = '#4e342e'; sidebar.style.background = '#f4eae1'; sidebarTitle.style.color = '#4e342e'; sidebar.style.borderColor = '#8d6e63'; appContainer.style.borderColor = '#8d6e63';
    if(mBoard) mBoard.style.borderColor = '#8d6e63'; if(cBox) cBox.style.borderColor = '#8d6e63';
  }
  init();
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
  if (category.value === 'Food') cleanItemName = `${itemLabelText} (${itemSize.value})`;

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
  item.style.background = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.03)"; item.style.color = isDark ? "#ffffff" : "#333333";
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
