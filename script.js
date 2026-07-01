const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const itemSize = document.getElementById('item-size');
const submitBtn = document.getElementById('form-submit-btn');
const balanceCard = document.getElementById('balance-card');
const appContainer = document.getElementById('app-container');
const themeSelect = document.getElementById('theme-select');
const sidebar = document.getElementById('history-sidebar');
const sidebarTitle = document.getElementById('sidebar-title');
const heatmapGrid = document.getElementById('heatmap-grid');

const categoryColors = { 'Clothes': '#9b59b6', 'Food': '#e67e22', 'Electronics': '#3498db', 'Salary': '#2ecc71', 'General': '#7f8c8d' };
const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Item Rates Rules Matrix
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

// Triggers instantly when user types item name or tweaks size drop option
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
    submitBtn.style.background = '#e74c3c';
  }
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
    document.body.style.backgroundColor = '#ffffff'; appContainer.style.backgroundColor = '#ffffff'; appContainer.style.color = '#000000';
    sidebar.style.background = '#ffffff'; sidebarTitle.style.color = '#333333';
  } else if (currentTheme === 'grey') {
    document.body.style.backgroundColor = '#7f8c8d'; appContainer.style.backgroundColor = '#b2bec3'; appContainer.style.color = '#2d3436';
    sidebar.style.background = '#b2bec3'; sidebarTitle.style.color = '#2d3436';
  } else if (currentTheme === 'black') {
    document.body.style.backgroundColor = '#111111'; appContainer.style.backgroundColor = '#222222'; appContainer.style.color = '#ffffff';
    sidebar.style.background = '#222222'; sidebarTitle.style.color = '#ffffff';
  } else if (currentTheme === 'blue') {
    document.body.style.backgroundColor = '#2c3e50'; appContainer.style.backgroundColor = '#34495e'; appContainer.style.color = '#ecf0f1';
    sidebar.style.background = '#34495e'; sidebarTitle.style.color = '#ecf0f1';
  }
  init();
}

function renderHeatMap() {
  heatmapGrid.innerHTML = '';
  let weeklySpend = [0, 0, 0, 0, 0, 0, 0];
  transactions.forEach(t => { if (t.amount < 0) { const date = new Date(t.timestamp || Date.now()); weeklySpend[date.getDay()] += Math.abs(t.amount); } });

  daysOfWeek.forEach((day, index) => {
    const totalDayCost = weeklySpend[index];
    let bgColor = '#b2bec3'; let icon = '⚪';
    if (totalDayCost > 0 && totalDayCost <= 500) { bgColor = '#7f8c8d'; icon = '⚪'; }
    else if (totalDayCost > 500 && totalDayCost <= 2000) { bgColor = '#f1c40f'; icon = '🟡'; }
    else if (totalDayCost > 2000 && totalDayCost <= 5000) { bgColor = '#e67e22'; icon = '🟠'; }
    else if (totalDayCost > 5000) { bgColor = '#c0392b'; icon = '🔥'; }

    const dayBlock = document.createElement('div');
    dayBlock.style.background = bgColor; dayBlock.style.padding = '6px 2px'; dayBlock.style.borderRadius = '4px'; dayBlock.style.fontSize = '10px'; dayBlock.style.fontWeight = '700';
    dayBlock.innerHTML = `<span>${day}</span><span>${icon}</span>`;
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
function resetData() { if (confirm("RESET DATA COMPLETELY?")) { transactions = []; updateLocalStorage(); init(); } }
function updateLocalStorage() { localStorage.setItem('transactions', JSON.stringify(transactions)); }

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  const startingBalance = 10000;
  const total = startingBalance + transactions.reduce((acc, t) => acc + t.amount, 0);
  balance.innerText = total.toFixed(2);
  balanceCard.style.backgroundColor = total <= 0 ? '#fadbd8' : '#d4efdf';
  balanceCard.style.color = total <= 0 ? '#78281f' : '#145a32';
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const isDark = currentTheme === 'black' || currentTheme === 'blue';
  item.style.padding = "12px"; item.style.margin = "8px 0"; item.style.borderRadius = "6px";
  item.style.background = isDark ? "#333333" : "#f8f9fa"; item.style.color = isDark ? "#ffffff" : "#333333";
  item.style.display = "flex"; item.style.justifyContent = "space-between"; item.style.alignItems = "center";
  item.style.borderLeft = `6px solid ${categoryColors[t.cat] || '#7f8c8d'}`;

  item.innerHTML = `
    <div><span style="font-weight:700; font-size:13px;">${t.text}</span></div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: 700;">${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}</span>
      <button type="button" onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold;">✕</button>
    </div>`;
  list.appendChild(item);
}

form.addEventListener('submit', saveTransaction);
applyThemeStyles();
