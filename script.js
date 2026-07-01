 const balance = document.getElementById('balance');
const list = document.getElementById('list');
const form = document.getElementById('tracker-form');
const text = document.getElementById('desc');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const editIdInput = document.getElementById('edit-id');
const submitBtn = document.getElementById('form-submit-btn');
const balanceCard = document.getElementById('balance-card');
const appContainer = document.getElementById('app-container');
const themeSelect = document.getElementById('theme-select');
const sidebar = document.getElementById('history-sidebar');
const sidebarTitle = document.getElementById('sidebar-title');
const heatmapGrid = document.getElementById('heatmap-grid');

const categoryColors = {
  'Clothes': '#9b59b6',
  'Food': '#e67e22',
  'Electronics': '#3498db',
  'Salary': '#2ecc71',
  'General': '#7f8c8d'
};

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentTheme = localStorage.getItem('siteTheme') || 'white';

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
    document.body.style.backgroundColor = '#ffffff';
    appContainer.style.backgroundColor = '#ffffff';
    appContainer.style.color = '#000000';
    sidebar.style.background = '#ffffff';
    sidebarTitle.style.color = '#333333';
  } else if (currentTheme === 'grey') {
    document.body.style.backgroundColor = '#7f8c8d';
    appContainer.style.backgroundColor = '#b2bec3';
    appContainer.style.color = '#2d3436';
    sidebar.style.background = '#b2bec3';
    sidebarTitle.style.color = '#2d3436';
  } else if (currentTheme === 'black') {
    document.body.style.backgroundColor = '#111111';
    appContainer.style.backgroundColor = '#222222';
    appContainer.style.color = '#ffffff';
    sidebar.style.background = '#222222';
    sidebarTitle.style.color = '#ffffff';
  } else if (currentTheme === 'blue') {
    document.body.style.backgroundColor = '#2c3e50';
    appContainer.style.backgroundColor = '#34495e';
    appContainer.style.color = '#ecf0f1';
    sidebar.style.background = '#34495e';
    sidebarTitle.style.color = '#ecf0f1';
  }
  init();
}

// Generate the Calendar Heat Map color scheme elements dynamically
function renderHeatMap() {
  heatmapGrid.innerHTML = '';
  
  // Group total spend calculations by day index
  let weeklySpend = [0, 0, 0, 0, 0, 0, 0];
  
  transactions.forEach(t => {
    if (t.amount < 0) { // Expense transactions only
      const date = new Date(t.timestamp || Date.now());
      const dayIndex = date.getDay();
      weeklySpend[dayIndex] += Math.abs(t.amount);
    }
  });

  daysOfWeek.forEach((day, index) => {
    const totalDayCost = weeklySpend[index];
    let bgColor = '#b2bec3'; // Empty/Low Default (Grey)
    let fontColor = '#ffffff';
    let icon = '⚪';

    if (totalDayCost > 0 && totalDayCost <= 500) {
      bgColor = '#7f8c8d'; // LOW
      icon = '⚪';
    } else if (totalDayCost > 500 && totalDayCost <= 2000) {
      bgColor = '#f1c40f'; // MEDIUM
      fontColor = '#2d3436';
      icon = '🟡';
    } else if (totalDayCost > 2000 && totalDayCost <= 5000) {
      bgColor = '#e67e22'; // HIGH
      icon = '🟠';
    } else if (totalDayCost > 5000) {
      bgColor = '#c0392b'; // FULL HIGH
      icon = '🔥';
    }

    const dayBlock = document.createElement('div');
    dayBlock.style.background = bgColor;
    dayBlock.style.color = fontColor;
    dayBlock.style.padding = '6px 2px';
    dayBlock.style.borderRadius = '4px';
    dayBlock.style.fontSize = '10px';
    dayBlock.style.fontWeight = '700';
    dayBlock.style.display = 'flex';
    dayBlock.style.flexDirection = 'column';
    dayBlock.style.alignItems = 'center';
    dayBlock.style.gap = '2px';
    dayBlock.title = `Total Spent: $${totalDayCost.toFixed(2)}`;

    dayBlock.innerHTML = `
      <span>${day}</span>
      <span style="font-size:11px;">${icon}</span>
    `;
    heatmapGrid.appendChild(dayBlock);
  });
}

function formatDuration(timestamp) {
  if (!timestamp) return "JUST NOW";
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "JUST NOW";
  if (minutes < 60) return `${minutes}M AGO`;
  if (hours < 24) return `${hours}H AGO`;
  return `${days}D AGO`;
}

function calculateAmount(inputVal) {
  try {
    let sanitized = inputVal.replace(/[^0-9+\-*/.]/g, '');
    if (!sanitized) return 0;
    let result = Function(`"use strict"; return (${sanitized})`)();
    if (category.value !== 'Salary') {
      result = -Math.abs(result); 
    } else {
      result = Math.abs(result);
    }
    return isNaN(result) || !isFinite(result) ? null : result;
  } catch (error) {
    return null;
  }
}

function saveTransaction(e) {
  e.preventDefault();
  const finalAmount = calculateAmount(amount.value);
  if (finalAmount === null) return;

  const editId = editIdInput.value;

  if (editId) {
    transactions = transactions.map(t => t.id == editId ? {
      ...t,
      text: text.value.toUpperCase(),
      amount: finalAmount,
      cat: category.value
    } : t);
    editIdInput.value = '';
  } else {
    transactions.push({
      id: Date.now(),
      text: text.value.toUpperCase(),
      amount: finalAmount,
      cat: category.value,
      timestamp: Date.now()
    });
  }
  
  init();
  updateLocalStorage();
  text.value = '';
  amount.value = '';
  toggleSidebar(true);
}

function editTransaction(id) {
  const t = transactions.find(t => t.id === id);
  if (!t) return;
  text.value = t.text;
  amount.value = Math.abs(t.amount); 
  category.value = t.cat;
  editIdInput.value = t.id;
  toggleSidebar(false);
}

function addTransactionDOM(t) {
  const item = document.createElement('li');
  const isExpense = t.amount < 0;
  const itemColor = categoryColors[t.cat] || '#7f8c8d';
  const isDark = currentTheme === 'black' || currentTheme === 'blue';

  item.style.padding = "12px";
  item.style.margin = "8px 0";
  item.style.borderRadius = "6px";
  item.style.background = isDark ? "#333333" : "#f8f9fa";
  item.style.color = isDark ? "#ffffff" : "#333333";
  item.style.display = "flex";
  item.style.justifyContent = "space-between";
  item.style.alignItems = "center";
  item.style.borderLeft = `6px solid ${itemColor}`;
  item.style.cursor = 'pointer';
  item.setAttribute('onclick', `editTransaction(${t.id})`);

  const timeLabel = formatDuration(t.timestamp);

  item.innerHTML = `
    <div style="max-width: 65%;">
      <span style="font-weight:700; font-size:13px; display:block; word-break:break-all;">${t.text}</span> 
      <span style="color:#888; font-size:10px; font-weight:700; display:inline-block; margin-top:2px;">${timeLabel}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="color: ${isExpense ? '#e74c3c' : '#2ecc71'}; font-weight: 700; font-size:13px;">
        ${isExpense ? '-' : '+'}$${Math.abs(t.amount).toFixed(2)}
      </span>
      <button onclick="event.stopPropagation(); removeTransaction(${t.id})" style="background:none; border:none; color:#e74c3c; cursor:pointer; font-weight:bold; font-size:14px;">✕</button>
    </div>
  `;
  list.appendChild(item);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}

function resetData() {
  if (confirm("RESET DATA COMPLETELY?")) {
    transactions = [];
    updateLocalStorage();
    init();
  }
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  renderHeatMap();
  
  const startingBalance = 10000;
  const transactionTotal = transactions.reduce((acc, t) => acc + t.amount, 0);
  const total = startingBalance + transactionTotal;
  
  balance.innerText = total.toFixed(2);
  
  if (total <= 0) {
    balanceCard.style.backgroundColor = '#fadbd8';
    balanceCard.style.color = '#78281f';
  } else if (total < 4000) {
    balanceCard.style.backgroundColor = '#fdebd0';
    balanceCard.style.color = '#7e5109';
  } else {
    balanceCard.style.backgroundColor = '#d4efdf';
    balanceCard.style.color = '#145a32';
  }
}

if(category) {
  category.onchange = () => {
      if(category.value === 'Salary') {
          submitBtn.style.background = '#2ecc71';
      } else {
          submitBtn.style.background = '#e74c3c';
      }
  };
}

setInterval(() => {
  if (sidebar.style.right === '0px') {
    init();
  }
}, 30000);

form.addEventListener('submit', saveTransaction);
applyThemeStyles();
