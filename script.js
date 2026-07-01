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
  themeSelect.value = currentTheme;
  if (currentTheme === 'white') {
    document.body.style.backgroundColor = '#f5f6fa'; appContainer.style.backgroundColor = '#ffffff'; appContainer.style.color = '#333333'; sidebar.style.background = '#ffffff'; sidebarTitle.style.color = '#333333';
  } else if (currentTheme === 'grey') {
    document.body.style.backgroundColor = '#7f8c8d'; appContainer.style.backgroundColor = '#b2bec3'; appContainer.style.color = '#2d3436'; sidebar.style.background = '#b2bec3'; sidebarTitle.style.color = '#2d3436';
  } else if (currentTheme === 'black') {
    document.body.style.backgroundColor = '#111111'; appContainer.style.backgroundColor = '#222222'; appContainer.style.color = '#ffffff'; sidebar.style.background = '#222222'; sidebarTitle.style.color = '#ffffff';
  } else if (currentTheme === 'blue') {
    document.body.style.backgroundColor = '#2c3e50'; appContainer.style.backgroundColor = '#34495e'; appContainer.style.color = '#ecf0f1'; sidebar.style.background = '#34495e'; sidebarTitle.style.color = '#ecf0f1';
  }
  init();
}

// Calculates dynamic analytics values live
function recalculateDashboardMetrics() {
  const startingBalance = 10000;
  let totalDeposits = 0;
  let totalExpenses = 0;
  let weeklyExpenseSum = 0;

  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

  // Parse custom timestamps if available
  let firstTransactionTime = now;

  transactions.forEach(t => {
    if (t.timestamp && t.timestamp < firstTransactionTime) {
      firstTransactionTime = t.timestamp;
    }

    if (t.amount > 0) {
      totalDeposits += t.amount;
    } else {
      totalExpenses += Math.abs(t.amount);
      if (t.timestamp && t.timestamp >= oneWeekAgo) {
        weeklyExpenseSum += Math.abs(t.amount);
      }
    }
  });

  // 1. Net Worth Calculation
  const netWorth = startingBalance + totalDeposits - totalExpenses;
  netWorthDisplay.innerText = netWorth.toFixed(2);

  // 2. Savings Rate Calculation
  const overallIncomePool = startingBalance + totalDeposits;
  const savingsRate = overallIncomePool > 0 ? ((netWorth / overallIncomePool) * 100) : 0;
  savingsRateDisplay.innerText = `${Math.max(0, Math.min(100, savingsRate)).toFixed(0)}%`;

  // 3. Daily Burn Rate Calculation
  const totalDaysActive = Math.max(1, Math.ceil((now - firstTransactionTime) / (1000 * 60 * 60 * 24)));
  const burnRate = totalExpenses / totalDaysActive;
  burnRateDisplay.innerText = `$${burnRate.toFixed(2)}/day`;

  // 4. Monthly Gross Revenue Income with standard Indian GST & Income Tax Estimates (18% GST Bracket, 10% Flat TDS/Tax)
  const grossMonthlyIncome = totalDeposits; 
  const gstDeduction = grossMonthlyIncome * 0.18;
  const taxDeduction = grossMonthlyIncome * 0.10;
  const netMonthlyIncome = grossMonthlyIncome - gstDeduction - taxDeduction;

  monthlyIncomeDisplay.innerText = `$${grossMonthlyIncome.toFixed(2)}`;
  taxBreakdownDisplay.innerText = `Take-home: $${netMonthlyIncome.toFixed(2)} (-18% GST, -10% Tax)`;

  // 5. Weekly Payments calculation
  weeklyPaymentsDisplay.innerText = `$${weeklyExpenseSum.toFixed(2)}`;
}

function renderHeatMap() {
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
  if (category.value === 'Food') {
    cleanItemName = `${itemLabelText} (${itemSize.value})`;
  }

  transactions.push({ id: Date.now(), text: cleanItemName, amount: finalAmount, cat: category.value, timestamp: Date.now() });
  init(); updateLocalStorage();
  text.value = ''; amount.value = '';
  toggleSidebar(true);
}

function removeTransaction(id) { transactions = transactions.filter(t => t.id !== id); updateLocalStorage(); init(); }
function resetData() { if (confirm("RESET ALL ACCOUNT DATA?")) { transactions = []; updateLocalStorage(); init(); } }
function updateLocalStorage() { localStorage.setItem('transactions', JSON.stringify(transactions)); }

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  recalculateDashboardMetrics();
  renderHeatMap();
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const isDark = currentTheme === 'black' || currentTheme === 'blue';
  item.style.padding = "12px"; item.style.margin = "8px 0"; item.style.borderRadius = "8px";
  item.style.background = isDark ? "#333333" : "#f8f9fa"; item.style.color = isDark ? "#ffffff" : "#333333";
  item.style.display = "flex"; item.style.justifyContent = "space-between"; item.style.alignItems = "center";
  item.style.borderLeft = `6px solid ${categoryColors[t.cat] || '#7f8c8d'}`;

  item.innerHTML = `
    <div><span style="font-weight:700; font-size:13px;">${t.text}</span></div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: 700; font-size:13px;">${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold; font-size:14px;">✕</button>
    </div>`;
  list.appendChild(item);
}

form.addEventListener('submit', saveTransaction);
applyThemeStyles();
